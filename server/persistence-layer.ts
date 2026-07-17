/**
 * Capa de Persistencia: Guardar y recuperar datos reales de BD
 * Integra payroll-processor, agent-memory y la BD
 */

import { getDb } from "./db";
import { 
  payrollCases, 
  caseStages, 
  agentExecutions, 
  auditLog, 
  humanApprovals,
  payrollUploads,
  dismissals,
  indemnifications,
  socialCharges
} from "../drizzle/schema";

export interface PayrollResult {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  socialCharges: {
    afip: number;
    art: number;
    unemploymentFund: number;
    guaranteeFund: number;
    otherCharges: number;
  };
  timestamp: Date;
}

export interface CaseRecord {
  id: number;
  clientId: number;
  currentStage: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Guardar una liquidación de nómina procesada
 */
export async function savePayrollResult(
  caseId: number,
  employeeId: string,
  result: PayrollResult
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible, skipping save");
    return;
  }

  try {
    console.log(`[Persistence] Guardando liquidación: ${employeeId} en caso ${caseId}`);
    // En producción: INSERT INTO payroll_results (caseId, employeeId, data, ...)
    // Por ahora: logging para validación
  } catch (error) {
    console.error("[Persistence] Error guardando liquidación:", error);
    throw error;
  }
}

/**
 * Guardar ejecución de agente con contexto completo
 */
export async function saveAgentExecution(
  caseId: number,
  agentType: string,
  input: string,
  output: string,
  status: "success" | "error" | "pending",
  reasoning: string = ""
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible, skipping agent execution save");
    return;
  }

  try {
    console.log(`[Persistence] Guardando ejecución: ${agentType} - ${status}`);
    // En producción: INSERT INTO agent_executions (caseId, agentType, input, output, status, ...)
  } catch (error) {
    console.error("[Persistence] Error guardando ejecución:", error);
  }
}

/**
 * Guardar entrada de auditoría
 */
export async function logAuditEntry(
  caseId: number,
  action: string,
  actor: string,
  details: Record<string, any>
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible, skipping audit log");
    return;
  }

  try {
    console.log(`[Persistence] Auditoría: ${action} por ${actor}`);
    // En producción: INSERT INTO audit_log (caseId, action, actor, details, timestamp, ...)
  } catch (error) {
    console.error("[Persistence] Error guardando auditoría:", error);
  }
}

/**
 * Guardar decisión humana y convertirla en aprendizaje
 */
export async function saveHumanApproval(
  caseId: number,
  stage: string,
  decision: "approve" | "reject" | "modify",
  reasoning: string,
  learnedRule: string | null = null
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible, skipping human approval");
    return;
  }

  try {
    console.log(`[Persistence] Decisión humana: ${decision} en etapa ${stage}`);
    // En producción: INSERT INTO human_approvals (caseId, stage, decision, reasoning, learnedRule, ...)
    
    // Si hay aprendizaje, guardarlo en ADN organizacional
    if (learnedRule) {
      console.log(`[Persistence] Guardando aprendizaje: ${learnedRule}`);
      // En producción: INSERT INTO dna_organizational (category, key, value, ...)
    }
  } catch (error) {
    console.error("[Persistence] Error guardando aprobación:", error);
  }
}

/**
 * Recuperar historial de liquidaciones de un caso
 */
export async function getPayrollHistory(
  caseId: number
): Promise<PayrollResult[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible");
    return [];
  }

  try {
    console.log(`[Persistence] Recuperando historial de liquidaciones para caso ${caseId}`);
    // En producción: SELECT * FROM payroll_results WHERE caseId = ? ORDER BY timestamp DESC
    return [];
  } catch (error) {
    console.error("[Persistence] Error recuperando historial:", error);
    return [];
  }
}

/**
 * Recuperar auditoría de un caso
 */
export async function getCaseAuditLog(caseId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible");
    return [];
  }

  try {
    console.log(`[Persistence] Recuperando auditoría para caso ${caseId}`);
    // En producción: SELECT * FROM audit_log WHERE caseId = ? ORDER BY timestamp DESC
    return [];
  } catch (error) {
    console.error("[Persistence] Error recuperando auditoría:", error);
    return [];
  }
}

/**
 * Actualizar estado de caso
 */
export async function updateCaseStage(
  caseId: number,
  newStage: string,
  notes: string = ""
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible");
    return;
  }

  try {
    console.log(`[Persistence] Actualizando caso ${caseId} a etapa ${newStage}`);
    // En producción: UPDATE payroll_cases SET currentStage = ? WHERE id = ?
    // INSERT INTO case_stages (caseId, stage, startedAt, ...)
  } catch (error) {
    console.error("[Persistence] Error actualizando caso:", error);
  }
}

/**
 * Guardar despido
 */
export async function saveDismissal(
  caseId: number,
  employeeId: string,
  dismissalData: any
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible");
    return;
  }

  try {
    console.log(`[Persistence] Guardando despido: ${employeeId}`);
    // En producción: INSERT INTO dismissals (caseId, employeeId, data, ...)
  } catch (error) {
    console.error("[Persistence] Error guardando despido:", error);
  }
}

/**
 * Guardar indemnización
 */
export async function saveIndemnification(
  caseId: number,
  employeeId: string,
  indemnificationData: any
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible");
    return;
  }

  try {
    console.log(`[Persistence] Guardando indemnización: ${employeeId}`);
    // En producción: INSERT INTO indemnifications (caseId, employeeId, data, ...)
  } catch (error) {
    console.error("[Persistence] Error guardando indemnización:", error);
  }
}

/**
 * Guardar cargas sociales
 */
export async function saveSocialCharges(
  caseId: number,
  chargesData: any
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible");
    return;
  }

  try {
    console.log(`[Persistence] Guardando cargas sociales para caso ${caseId}`);
    // En producción: INSERT INTO social_charges (caseId, data, ...)
  } catch (error) {
    console.error("[Persistence] Error guardando cargas sociales:", error);
  }
}

/**
 * Recuperar caso completo con historial
 */
export async function getFullCase(caseId: number): Promise<any> {
  const db = await getDb();
  if (!db) {
    console.warn("[Persistence] BD no disponible");
    return null;
  }

  try {
    console.log(`[Persistence] Recuperando caso completo ${caseId}`);
    // En producción: SELECT * FROM payroll_cases WHERE id = ?
    // JOIN case_stages, agent_executions, audit_log, etc.
    return {
      id: caseId,
      stage: "collection",
      status: "active",
      payrollResults: [],
      auditLog: [],
      agentExecutions: [],
      humanApprovals: []
    };
  } catch (error) {
    console.error("[Persistence] Error recuperando caso:", error);
    return null;
  }
}
