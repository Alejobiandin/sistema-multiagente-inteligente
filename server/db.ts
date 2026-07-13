import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  payrollCases,
  caseStages,
  newsItems,
  dnaOrganizational,
  agentExecutions,
  auditLog,
  humanApprovals,
  documents,
  notifications,
  PayrollCase,
  CaseStage,
  NewsItem,
  AgentExecution,
  AuditLog,
  HumanApproval,
  Document,
  Notification,
  DNAOrganizational,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// PAYROLL CASES
// ============================================

export async function createPayrollCase(data: {
  clientId: number;
  clientName: string;
  payrollPeriod: string;
  employeeCount?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(payrollCases).values({
    clientId: data.clientId,
    clientName: data.clientName,
    payrollPeriod: data.payrollPeriod,
    employeeCount: data.employeeCount,
    status: "DRAFT",
    currentStage: "COLLECTION",
  });

  return result;
}

export async function getPayrollCaseById(caseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(payrollCases).where(eq(payrollCases.id, caseId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function listPayrollCases(filters?: {
  status?: string;
  currentStage?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let conditions: any[] = [];
  
  if (filters?.status) {
    conditions.push(eq(payrollCases.status, filters.status as any));
  }
  if (filters?.currentStage) {
    conditions.push(eq(payrollCases.currentStage, filters.currentStage as any));
  }

  let baseQuery = db.select().from(payrollCases);
  
  if (conditions.length > 0) {
    baseQuery = baseQuery.where(and(...conditions)) as any;
  }

  baseQuery = baseQuery.orderBy(desc(payrollCases.createdAt)) as any;
  
  if (filters?.limit) {
    baseQuery = baseQuery.limit(filters.limit) as any;
  }
  if (filters?.offset) {
    baseQuery = baseQuery.offset(filters.offset) as any;
  }

  return await baseQuery;
}

export async function updatePayrollCaseStage(caseId: number, newStage: string, status?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {
    currentStage: newStage,
    updatedAt: new Date(),
  };

  if (status) {
    updateData.status = status;
  }

  await db.update(payrollCases).set(updateData).where(eq(payrollCases.id, caseId));

  // Registrar la transición de etapa
  await db.insert(caseStages).values({
    caseId,
    stage: newStage as any,
  });
}

// ============================================
// CASE STAGES
// ============================================

export async function getCaseStageHistory(caseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(caseStages).where(eq(caseStages.caseId, caseId)).orderBy(caseStages.startedAt);
}

// ============================================
// NEWS ITEMS
// ============================================

export async function createNewsItem(data: {
  caseId?: number;
  newsType: string;
  content: string;
  source: string;
  priority?: string;
  attachmentUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(newsItems).values({
    caseId: data.caseId,
    newsType: data.newsType as any,
    content: data.content,
    source: data.source as any,
    priority: data.priority as any,
    attachmentUrl: data.attachmentUrl,
  });
}

export async function listNewsItems(filters?: {
  caseId?: number;
  processed?: boolean;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let conditions: any[] = [];

  if (filters?.caseId) {
    conditions.push(eq(newsItems.caseId, filters.caseId));
  }
  if (filters?.processed !== undefined) {
    conditions.push(eq(newsItems.processed, filters.processed));
  }

  let baseQuery = db.select().from(newsItems);
  
  if (conditions.length > 0) {
    baseQuery = baseQuery.where(and(...conditions)) as any;
  }

  baseQuery = baseQuery.orderBy(desc(newsItems.createdAt)) as any;

  if (filters?.limit) {
    baseQuery = baseQuery.limit(filters.limit) as any;
  }

  return await baseQuery;
}

export async function updateNewsItemProcessed(newsItemId: number, classification: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(newsItems).set({
    processed: true,
    classification,
  }).where(eq(newsItems.id, newsItemId));
}

// ============================================
// DNA ORGANIZATIONAL
// ============================================

export async function getDNAByCategory(category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(dnaOrganizational).where(
    and(
      eq(dnaOrganizational.category, category as any),
      eq(dnaOrganizational.active, true)
    )
  );
}

export async function getDNAByKey(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(dnaOrganizational).where(eq(dnaOrganizational.key, key)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrUpdateDNARule(data: {
  category: string;
  key: string;
  value: string;
  description?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getDNAByKey(data.key);

  if (existing) {
    await db.update(dnaOrganizational).set({
      value: data.value,
      description: data.description,
      version: (existing.version || 1) + 1,
      updatedAt: new Date(),
    }).where(eq(dnaOrganizational.id, existing.id));
  } else {
    await db.insert(dnaOrganizational).values({
      category: data.category as any,
      key: data.key,
      value: data.value,
      description: data.description,
      version: 1,
    });
  }
}

// ============================================
// AGENT EXECUTIONS
// ============================================

export async function createAgentExecution(data: {
  caseId: number;
  agentType: string;
  stage?: string;
  input?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(agentExecutions).values({
    caseId: data.caseId,
    agentType: data.agentType as any,
    stage: data.stage as any,
    input: data.input,
    status: "PENDING",
  });

  return result;
}

export async function updateAgentExecution(executionId: number, data: {
  status: string;
  output?: any;
  reasoning?: string;
  errorMessage?: string;
  executionTimeMs?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(agentExecutions).set({
    status: data.status as any,
    output: data.output,
    reasoning: data.reasoning,
    errorMessage: data.errorMessage,
    executionTimeMs: data.executionTimeMs,
  }).where(eq(agentExecutions.id, executionId));
}

export async function getAgentExecutionHistory(caseId: number, agentType?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let conditions: any[] = [eq(agentExecutions.caseId, caseId)];

  if (agentType) {
    conditions.push(eq(agentExecutions.agentType, agentType as any));
  }

  return await db.select().from(agentExecutions).where(and(...conditions)).orderBy(desc(agentExecutions.timestamp));
}

// ============================================
// AUDIT LOG
// ============================================

export async function createAuditLog(data: {
  caseId?: number;
  userId?: number;
  action: string;
  actor: string;
  details?: any;
  changesBefore?: any;
  changesAfter?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(auditLog).values({
    caseId: data.caseId,
    userId: data.userId,
    action: data.action,
    actor: data.actor,
    details: data.details,
    changesBefore: data.changesBefore,
    changesAfter: data.changesAfter,
  });
}

export async function getCaseAuditLog(caseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(auditLog).where(eq(auditLog.caseId, caseId)).orderBy(desc(auditLog.timestamp));
}

// ============================================
// HUMAN APPROVALS
// ============================================

export async function createHumanApproval(data: {
  caseId: number;
  stage: string;
  agentExecutionId?: number;
  supervisorId: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(humanApprovals).values({
    caseId: data.caseId,
    stage: data.stage as any,
    agentExecutionId: data.agentExecutionId,
    supervisorId: data.supervisorId,
    decision: "PENDING",
  });

  return result;
}

export async function updateHumanApproval(approvalId: number, data: {
  decision: string;
  reasoning?: string;
  modifications?: any;
  learnedRule?: string;
  learnedRuleCategory?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(humanApprovals).set({
    decision: data.decision as any,
    reasoning: data.reasoning,
    modifications: data.modifications,
    learnedRule: data.learnedRule,
    learnedRuleCategory: data.learnedRuleCategory as any,
  }).where(eq(humanApprovals.id, approvalId));
}

export async function getPendingApprovals(supervisorId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let conditions: any[] = [eq(humanApprovals.decision, "PENDING")];

  if (supervisorId) {
    conditions.push(eq(humanApprovals.supervisorId, supervisorId));
  }

  return await db.select().from(humanApprovals).where(and(...conditions)).orderBy(desc(humanApprovals.timestamp));
}

// ============================================
// DOCUMENTS
// ============================================

export async function createDocument(data: {
  caseId: number;
  filename: string;
  fileKey: string;
  url: string;
  documentType: string;
  mimeType?: string;
  fileSize?: number;
  uploadedBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(documents).values({
    caseId: data.caseId,
    filename: data.filename,
    fileKey: data.fileKey,
    url: data.url,
    documentType: data.documentType as any,
    mimeType: data.mimeType,
    fileSize: data.fileSize,
    uploadedBy: data.uploadedBy,
  });
}

export async function getCaseDocuments(caseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(documents).where(eq(documents.caseId, caseId)).orderBy(desc(documents.uploadedAt));
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function createNotification(data: {
  userId: number;
  caseId?: number;
  notificationType: string;
  title: string;
  message?: string;
  actionUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(notifications).values({
    userId: data.userId,
    caseId: data.caseId,
    notificationType: data.notificationType as any,
    title: data.title,
    message: data.message,
    actionUrl: data.actionUrl,
  });
}

export async function getUserNotifications(userId: number, unreadOnly?: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let conditions: any[] = [eq(notifications.userId, userId)];

  if (unreadOnly) {
    conditions.push(eq(notifications.read, false));
  }

  return await db.select().from(notifications).where(and(...conditions)).orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(notifications).set({
    read: true,
    readAt: new Date(),
  }).where(eq(notifications.id, notificationId));
}
