import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
  auditLogs: many(auditLog),
  humanApprovals: many(humanApprovals),
  notifications: many(notifications),
}));

// ============================================
// PAYROLL SYSTEM TABLES
// ============================================

/**
 * Casos de payroll: representa cada proceso de liquidación de nómina.
 * Flujo de estados: DRAFT → COLLECTION → ANALYSIS → PRE_LIQUIDATION → AUDIT → APPROVAL → EMISSION → PRESENTATION → CLOSED
 */
export const payrollCases = mysqlTable("payroll_cases", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["DRAFT", "ACTIVE", "COMPLETED", "PAUSED", "ERROR"]).default("DRAFT").notNull(),
  currentStage: mysqlEnum("current_stage", ["COLLECTION", "ANALYSIS", "PRE_LIQUIDATION", "AUDIT", "APPROVAL", "EMISSION", "PRESENTATION", "CLOSED"]).default("COLLECTION").notNull(),
  payrollPeriod: varchar("payroll_period", { length: 20 }).notNull(), // ej: "2024-01"
  employeeCount: int("employee_count"),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }),
  metadata: json("metadata"), // Datos adicionales del caso
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PayrollCase = typeof payrollCases.$inferSelect;
export type InsertPayrollCase = typeof payrollCases.$inferInsert;

/**
 * Etapas del caso: registro de transiciones y tiempo en cada etapa.
 */
export const caseStages = mysqlTable("case_stages", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("case_id").notNull(),
  stage: mysqlEnum("stage", ["COLLECTION", "ANALYSIS", "PRE_LIQUIDATION", "AUDIT", "APPROVAL", "EMISSION", "PRESENTATION", "CLOSED"]).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  durationMinutes: int("duration_minutes"),
});

export type CaseStage = typeof caseStages.$inferSelect;
export type InsertCaseStage = typeof caseStages.$inferInsert;

/**
 * Novedades laborales: cambios en empleados, salarios, beneficios, etc.
 */
export const newsItems = mysqlTable("news_items", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("case_id"),
  newsType: mysqlEnum("news_type", ["SALARY_CHANGE", "HIRING", "TERMINATION", "BENEFIT_CHANGE", "TAX_UPDATE", "REGULATORY_CHANGE", "OTHER"]).notNull(),
  content: text("content").notNull(),
  source: mysqlEnum("source", ["MANUAL", "EMAIL", "CHAT", "API", "DOCUMENT", "OFFICIAL_ORGANISM"]).notNull(),
  classification: varchar("classification", { length: 100 }),
  priority: mysqlEnum("priority", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  attachmentUrl: varchar("attachment_url", { length: 500 }),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = typeof newsItems.$inferInsert;

/**
 * ADN Organizacional: repositorio de reglas, criterios, políticas y plantillas.
 */
export const dnaOrganizational = mysqlTable("dna_organizational", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["TECHNICAL_CRITERIA", "INTERNAL_RULES", "POLICIES", "TEMPLATES", "JURISPRUDENCE", "WORKFLOWS", "LEARNING"]).notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
  description: text("description"),
  version: int("version").default(1),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DNAOrganizational = typeof dnaOrganizational.$inferSelect;
export type InsertDNAOrganizational = typeof dnaOrganizational.$inferInsert;

/**
 * Ejecuciones de agentes: registro de cada invocación de agente IA.
 */
export const agentExecutions = mysqlTable("agent_executions", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("case_id").notNull(),
  agentType: mysqlEnum("agent_type", ["NORMATIVE_INTERPRETER", "PRE_LIQUIDATOR", "AUDITOR", "COMMUNICATOR"]).notNull(),
  stage: mysqlEnum("stage", ["COLLECTION", "ANALYSIS", "PRE_LIQUIDATION", "AUDIT", "APPROVAL", "EMISSION", "PRESENTATION", "CLOSED"]),
  input: json("input"),
  output: json("output"),
  reasoning: text("reasoning"),
  status: mysqlEnum("status", ["PENDING", "RUNNING", "SUCCESS", "FAILED", "PARTIAL"]).default("PENDING"),
  errorMessage: text("error_message"),
  executionTimeMs: int("execution_time_ms"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AgentExecution = typeof agentExecutions.$inferSelect;
export type InsertAgentExecution = typeof agentExecutions.$inferInsert;

/**
 * Log de auditoría: trazabilidad completa de todas las acciones en el sistema.
 */
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("case_id"),
  userId: int("user_id"),
  action: varchar("action", { length: 100 }).notNull(),
  actor: varchar("actor", { length: 100 }).notNull(), // "AGENT_*" o "USER_*"
  details: json("details"),
  changesBefore: json("changes_before"),
  changesAfter: json("changes_after"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

/**
 * Aprobaciones humanas: decisiones del supervisor sobre resultados de agentes.
 */
export const humanApprovals = mysqlTable("human_approvals", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("case_id").notNull(),
  stage: mysqlEnum("stage", ["COLLECTION", "ANALYSIS", "PRE_LIQUIDATION", "AUDIT", "APPROVAL", "EMISSION", "PRESENTATION", "CLOSED"]).notNull(),
  agentExecutionId: int("agent_execution_id"),
  supervisorId: int("supervisor_id").notNull(),
  decision: mysqlEnum("decision", ["APPROVED", "REJECTED", "MODIFIED", "PENDING"]).default("PENDING"),
  reasoning: text("reasoning"),
  modifications: json("modifications"),
  learnedRule: text("learned_rule"), // Regla aprendida para el ADN
  learnedRuleCategory: mysqlEnum("learned_rule_category", ["TECHNICAL_CRITERIA", "INTERNAL_RULES", "POLICIES", "TEMPLATES", "JURISPRUDENCE", "WORKFLOWS", "LEARNING"]),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type HumanApproval = typeof humanApprovals.$inferSelect;
export type InsertHumanApproval = typeof humanApprovals.$inferInsert;

/**
 * Documentos: almacenamiento de referencias a archivos adjuntos.
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("case_id").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileKey: varchar("file_key", { length: 500 }).notNull(), // S3 key
  url: varchar("url", { length: 500 }).notNull(), // Presigned URL o referencia
  documentType: mysqlEnum("document_type", ["RECEIPT", "DECLARATION", "REGULATORY", "PAYSLIP", "PROOF", "OTHER"]).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  fileSize: int("file_size"),
  uploadedBy: int("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Notificaciones: alertas y eventos del sistema.
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  caseId: int("case_id"),
  notificationType: mysqlEnum("notification_type", ["ANOMALY_DETECTED", "APPROVAL_REQUIRED", "STAGE_COMPLETED", "CASE_COMPLETED", "ERROR_OCCURRED", "INFO"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  read: boolean("read").default(false),
  actionUrl: varchar("action_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================
// RELATIONS
// ============================================



export const caseStagesRelations = relations(caseStages, ({ one }) => ({
  payrollCase: one(payrollCases, {
    fields: [caseStages.caseId],
    references: [payrollCases.id],
  }),
}));

export const newsItemsRelations = relations(newsItems, ({ one }) => ({
  payrollCase: one(payrollCases, {
    fields: [newsItems.caseId],
    references: [payrollCases.id],
  }),
}));

export const agentExecutionsRelations = relations(agentExecutions, ({ one }) => ({
  payrollCase: one(payrollCases, {
    fields: [agentExecutions.caseId],
    references: [payrollCases.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  payrollCase: one(payrollCases, {
    fields: [auditLog.caseId],
    references: [payrollCases.id],
  }),
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));

export const humanApprovalsRelations = relations(humanApprovals, ({ one }) => ({
  payrollCase: one(payrollCases, {
    fields: [humanApprovals.caseId],
    references: [payrollCases.id],
  }),
  supervisor: one(users, {
    fields: [humanApprovals.supervisorId],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  payrollCase: one(payrollCases, {
    fields: [documents.caseId],
    references: [payrollCases.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  payrollCase: one(payrollCases, {
    fields: [notifications.caseId],
    references: [payrollCases.id],
  }),
}));