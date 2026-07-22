/**
 * Flujo End-to-End: Carga → Procesamiento → Descarga
 * Orquesta todo el ciclo de vida de una liquidación
 */

import { calculatePayroll } from "./payroll-processor";
import { 
  savePayrollResult, 
  logAuditEntry, 
  updateCaseStage,
  getFullCase,
  saveSocialCharges,
  saveDismissal,
  saveIndemnification
} from "./persistence-layer";
import { 
  recordLearning, 
  detectAnomalies, 
  suggestActions 
} from "./agent-learning";
import { getDb } from "./db";
import { payrollUploads, processingStatus } from "../drizzle/schema";

export interface FlowResult {
  success: boolean;
  caseId: number;
  processedEmployees: number;
  failedEmployees: number;
  totalCharges: number;
  duration: number;
  downloadUrl?: string;
}

/**
 * Ejecutar flujo completo de liquidación
 */
export async function executePayrollFlow(
  uploadId: number,
  employeeData: Array<Record<string, any>>
): Promise<FlowResult> {
  const startTime = Date.now();
  let processedCount = 0;
  let failedCount = 0;
  let totalCharges = 0;

  try {
    console.log(`[Flow] Iniciando flujo para upload ${uploadId} con ${employeeData.length} empleados`);

    // Paso 1: Validar datos de entrada
    console.log(`[Flow] Paso 1: Validando datos`);
    const validatedData = validateEmployeeData(employeeData);
    if (validatedData.length === 0) {
      throw new Error("No hay datos válidos para procesar");
    }

    // Paso 2: Crear caso de liquidación
    console.log(`[Flow] Paso 2: Creando caso de liquidación`);
    const caseId = await createPayrollCase(uploadId);

    // Paso 3: Procesar cada empleado
    console.log(`[Flow] Paso 3: Procesando ${validatedData.length} empleados`);
    for (const employee of validatedData) {
      try {
        // Calcular liquidación
        const result = calculatePayroll({
          employeeId: employee.id,
          employeeName: employee.name,
          hoursWorked: employee.hours || 160,
          hourlyRate: (employee.salary || 0) / 160
        });
        
        // Guardar resultado
        const payrollResult: any = {
          employeeId: employee.id,
          employeeName: employee.name,
          baseSalary: employee.salary || 0,
          grossSalary: result.grossSalary || 0,
          deductions: 0,
          netSalary: result.netSalary || 0,
          socialCharges: {},
          timestamp: new Date()
        };
        await savePayrollResult(caseId, employee.id, payrollResult);
        
        // Calcular y guardar cargas sociales
        const socialCharges = calculateSocialCharges(payrollResult);
        await saveSocialCharges(caseId, socialCharges);
        
        totalCharges += socialCharges.total;
        processedCount++;

        // Registrar en auditoría
        await logAuditEntry(caseId, "PAYROLL_PROCESSED", "SYSTEM", {
          employeeId: employee.id,
          grossSalary: result.grossSalary,
          netSalary: result.netSalary
        });

      } catch (error) {
        console.error(`[Flow] Error procesando empleado ${employee.id}:`, error);
        failedCount++;
        
        // Registrar error en auditoría
        await logAuditEntry(caseId, "PAYROLL_ERROR", "SYSTEM", {
          employeeId: employee.id,
          error: String(error)
        });
      }
    }

    // Paso 4: Detectar anomalías
    console.log(`[Flow] Paso 4: Detectando anomalías`);
    const anomalies = await detectAnomalies("PRELIQUIDADOR", {
      totalCharges,
      employeeCount: processedCount
    });
    
    if (anomalies.length > 0) {
      console.log(`[Flow] Anomalías detectadas: ${anomalies.join(", ")}`);
      await logAuditEntry(caseId, "ANOMALIES_DETECTED", "SYSTEM", { anomalies });
    }

    // Paso 5: Actualizar estado del caso
    console.log(`[Flow] Paso 5: Actualizando estado del caso`);
    await updateCaseStage(caseId, "PRELIQUIDATION", `Procesados ${processedCount} empleados`);

    // Paso 6: Generar URL de descarga
    console.log(`[Flow] Paso 6: Generando descarga`);
    const downloadUrl = await generateDownloadUrl(caseId);

    const duration = Date.now() - startTime;
    console.log(`[Flow] Flujo completado en ${duration}ms`);

    return {
      success: true,
      caseId,
      processedEmployees: processedCount,
      failedEmployees: failedCount,
      totalCharges,
      duration,
      downloadUrl
    };

  } catch (error) {
    console.error("[Flow] Error en flujo:", error);
    return {
      success: false,
      caseId: 0,
      processedEmployees: processedCount,
      failedEmployees: failedCount,
      totalCharges,
      duration: Date.now() - startTime
    };
  }
}

/**
 * Validar datos de empleados
 */
function validateEmployeeData(
  data: Array<Record<string, any>>
): Array<Record<string, any>> {
  return data.filter(emp => {
    const required = ["id", "name", "salary", "hours"];
    return required.every(field => emp[field] !== undefined && emp[field] !== null);
  });
}

/**
 * Crear caso de liquidación
 */
async function createPayrollCase(uploadId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("BD no disponible");

  try {
    // En producción: INSERT INTO payroll_cases (uploadId, status, currentStage, ...)
    console.log(`[Flow] Caso de liquidación creado para upload ${uploadId}`);
    return uploadId; // Simplificado para demo
  } catch (error) {
    console.error("[Flow] Error creando caso:", error);
    throw error;
  }
}

/**
 * Calcular cargas sociales
 */
function calculateSocialCharges(payrollResult: any): Record<string, number> {
  const gross = payrollResult.grossSalary;
  
  return {
    afip: gross * 0.13,
    inamovilidad: gross * 0.0075,
    art: gross * 0.015,
    unemploymentFund: gross * 0.01,
    guaranteeFund: gross * 0.005,
    total: gross * (0.13 + 0.0075 + 0.015 + 0.01 + 0.005)
  };
}

/**
 * Generar URL de descarga
 */
async function generateDownloadUrl(caseId: number): Promise<string> {
  try {
    // En producción: generar PDF/Excel con datos del caso
    // Usar manus-md-to-pdf o librería de Excel
    const url = `/api/download/payroll/${caseId}`;
    console.log(`[Flow] URL de descarga generada: ${url}`);
    return url;
  } catch (error) {
    console.error("[Flow] Error generando descarga:", error);
    throw error;
  }
}

/**
 * Ejecutar flujo de despidos
 */
export async function executeDismissalFlow(
  caseId: number,
  dismissalData: Record<string, any>
): Promise<{ success: boolean; dismissalId: number }> {
  try {
    console.log(`[Flow] Iniciando flujo de despido para caso ${caseId}`);

    // Validar datos
    if (!dismissalData.employeeId || !dismissalData.dismissalDate) {
      throw new Error("Datos de despido incompletos");
    }

    // Calcular indemnización
    const indemnification = calculateIndemnification(dismissalData);

    // Guardar despido
    await saveDismissal(caseId, dismissalData.employeeId, dismissalData);

    // Guardar indemnización
    await saveIndemnification(caseId, dismissalData.employeeId, indemnification);

    // Registrar en auditoría
    await logAuditEntry(caseId, "DISMISSAL_PROCESSED", "SYSTEM", dismissalData);

    console.log(`[Flow] Despido procesado exitosamente`);
    return { success: true, dismissalId: 1 };

  } catch (error) {
    console.error("[Flow] Error en flujo de despido:", error);
    return { success: false, dismissalId: 0 };
  }
}

/**
 * Calcular indemnización según LCT
 */
function calculateIndemnification(dismissalData: Record<string, any>): Record<string, number> {
  const yearsOfService = dismissalData.yearsOfService || 0;
  const lastSalary = dismissalData.lastSalary || 0;
  const reason = dismissalData.dismissalReason || "WITHOUT_CAUSE";

  let multiplier = 1;
  if (reason === "WITHOUT_CAUSE") multiplier = 1;
  else if (reason === "WITH_CAUSE") multiplier = 0;
  else if (reason === "RESIGNATION") multiplier = 0.5;

  const baseAmount = lastSalary * yearsOfService * multiplier;
  const vacationAmount = (dismissalData.vacationDaysNotTaken || 0) * (lastSalary / 30);
  const sacAmount = (dismissalData.sacProportion || 0);

  return {
    baseIndemnity: baseAmount,
    vacationAmount,
    sacAmount,
    total: baseAmount + vacationAmount + sacAmount
  };
}

/**
 * Obtener resumen de flujo
 */
export async function getFlowSummary(caseId: number): Promise<Record<string, any>> {
  try {
    const caseData = await getFullCase(caseId);
    
    return {
      caseId,
      status: caseData?.status || "unknown",
      stage: caseData?.stage || "unknown",
      processedEmployees: caseData?.payrollResults?.length || 0,
      totalCharges: calculateTotalCharges(caseData?.payrollResults || []),
      auditLogEntries: caseData?.auditLog?.length || 0,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error("[Flow] Error obteniendo resumen:", error);
    return {};
  }
}

/**
 * Calcular total de cargas
 */
function calculateTotalCharges(results: any[]): number {
  return results.reduce((sum, result) => sum + (result.socialCharges?.total || 0), 0);
}
