import { invokeLLM, InvokeParams } from "./_core/llm";
import {
  createAgentExecution,
  updateAgentExecution,
  getDNAByCategory,
  getDNAByKey,
  getPayrollCaseById,
  createAuditLog,
  createNotification,
} from "./db";

/**
 * Tipos de agentes del sistema
 */
export type AgentType = "NORMATIVE_INTERPRETER" | "PRE_LIQUIDATOR" | "AUDITOR" | "COMMUNICATOR";

/**
 * Resultado de ejecución de un agente
 */
export interface AgentResult {
  success: boolean;
  output: any;
  reasoning: string;
  anomalies?: string[];
  recommendations?: string[];
  errorMessage?: string;
}

/**
 * AGENTE INTERPRETADOR NORMATIVO
 * Analiza cambios normativos, detecta impactos y propone actualizaciones
 */
export async function executeNormativeInterpreterAgent(
  caseId: number,
  newsContent: string,
  dnaRules: any[]
): Promise<AgentResult> {
  const executionResult = await createAgentExecution({
    caseId,
    agentType: "NORMATIVE_INTERPRETER",
    stage: "ANALYSIS",
    input: { newsContent, rulesCount: dnaRules.length },
  });
  const executionId = (executionResult as any).insertId || 0;

  try {
    const dnaContext = dnaRules.map(r => `${r.key}: ${r.value}`).join("\n");

    const prompt = `You are a regulatory analysis expert for payroll systems. Analyze the following news/regulatory change and compare it against our organizational DNA (rules and policies).

ORGANIZATIONAL DNA (Current Rules):
${dnaContext}

NEWS/REGULATORY CHANGE:
${newsContent}

Provide your analysis in JSON format with:
{
  "classification": "SALARY_CHANGE|HIRING|TERMINATION|BENEFIT_CHANGE|TAX_UPDATE|REGULATORY_CHANGE|OTHER",
  "impact_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "affected_areas": ["area1", "area2"],
  "required_actions": ["action1", "action2"],
  "dna_updates_needed": [{"key": "...", "new_value": "...", "reason": "..."}],
  "anomalies_detected": ["anomaly1", "anomaly2"],
  "reasoning": "Detailed explanation of the analysis"
}`;

    const result = await invokeLLM({
      model: "claude-3-5-sonnet",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    const responseText = result.choices[0]?.message.content || '';
    const contentStr = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
    const analysis = JSON.parse(contentStr);

    await updateAgentExecution(executionId, {
      status: "SUCCESS",
      output: analysis,
      reasoning: analysis.reasoning,
      executionTimeMs: Date.now(),
    });

    // Log de auditoría
    await createAuditLog({
      caseId,
      action: "AGENT_EXECUTION",
      actor: "AGENT_NORMATIVE_INTERPRETER",
      details: {
        classification: analysis.classification,
        impactLevel: analysis.impact_level,
      },
    });

    return {
      success: true,
      output: analysis,
      reasoning: analysis.reasoning,
      anomalies: analysis.anomalies_detected,
      recommendations: analysis.required_actions,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await updateAgentExecution(executionId, {
      status: "FAILED",
      errorMessage,
      executionTimeMs: Date.now(),
    });

    return {
      success: false,
      output: null,
      reasoning: "Error during normative analysis",
      errorMessage,
    };
  }
}

/**
 * AGENTE PRELIQUIDADOR
 * Calcula conceptos, genera borradores y valida parámetros
 */
export async function executePreLiquidatorAgent(
  caseId: number,
  employeeData: any[],
  parameters: any
): Promise<AgentResult> {
  const executionResult = await createAgentExecution({
    caseId,
    agentType: "PRE_LIQUIDATOR",
    stage: "PRE_LIQUIDATION",
    input: { employeeCount: employeeData.length, parametersApplied: Object.keys(parameters) },
  });
  const executionId = (executionResult as any).insertId || 0;

  try {
    const prompt = `You are a payroll calculation expert. Calculate the pre-liquidation for the following employees based on the parameters provided.

PARAMETERS:
${JSON.stringify(parameters, null, 2)}

EMPLOYEE DATA:
${JSON.stringify(employeeData, null, 2)}

Provide your calculation in JSON format with:
{
  "total_amount": 0,
  "employee_details": [
    {
      "employee_id": "...",
      "gross_salary": 0,
      "deductions": 0,
      "net_salary": 0,
      "concepts": {"concept_name": amount}
    }
  ],
  "validation_status": "VALID|NEEDS_REVIEW|INVALID",
  "validation_notes": ["note1", "note2"],
  "reasoning": "Explanation of calculations"
}`;

    const result = await invokeLLM({
      model: "claude-3-5-sonnet",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
    });

    const responseText = result.choices[0]?.message.content || '';
    const contentStr = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
    const calculation = JSON.parse(contentStr);

    await updateAgentExecution(executionId, {
      status: "SUCCESS",
      output: calculation,
      reasoning: calculation.reasoning,
      executionTimeMs: Date.now(),
    });

    await createAuditLog({
      caseId,
      action: "AGENT_EXECUTION",
      actor: "AGENT_PRE_LIQUIDATOR",
      details: {
        totalAmount: calculation.total_amount,
        validationStatus: calculation.validation_status,
      },
    });

    return {
      success: true,
      output: calculation,
      reasoning: calculation.reasoning,
      recommendations: calculation.validation_notes,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await updateAgentExecution(executionId, {
      status: "FAILED",
      errorMessage,
      executionTimeMs: Date.now(),
    });

    return {
      success: false,
      output: null,
      reasoning: "Error during pre-liquidation calculation",
      errorMessage,
    };
  }
}

/**
 * AGENTE AUDITOR
 * Detecta anomalías, compara históricos y valida coherencia
 */
export async function executeAuditorAgent(
  caseId: number,
  currentCalculation: any,
  historicalData?: any[]
): Promise<AgentResult> {
  const executionResult = await createAgentExecution({
    caseId,
    agentType: "AUDITOR",
    stage: "AUDIT",
    input: { hasHistoricalData: !!historicalData },
  });
  const executionId = (executionResult as any).insertId || 0;

  try {
    const prompt = `You are a payroll audit expert. Review the current calculation and compare it against historical data to detect anomalies and inconsistencies.

CURRENT CALCULATION:
${JSON.stringify(currentCalculation, null, 2)}

HISTORICAL DATA:
${JSON.stringify(historicalData || [], null, 2)}

Provide your audit in JSON format with:
{
  "audit_status": "PASSED|WARNINGS|FAILED",
  "anomalies": [
    {
      "type": "VARIANCE|MISSING_DATA|INCONSISTENCY|CALCULATION_ERROR",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
      "description": "...",
      "affected_employees": ["emp1", "emp2"]
    }
  ],
  "variance_analysis": {
    "average_variance_percent": 0,
    "employees_with_high_variance": ["emp1"]
  },
  "recommendations": ["rec1", "rec2"],
  "reasoning": "Detailed audit explanation"
}`;

    const result = await invokeLLM({
      model: "claude-3-5-sonnet",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2500,
    });

    const responseText = result.choices[0]?.message.content || '';
    const contentStr = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
    const audit = JSON.parse(contentStr);

    await updateAgentExecution(executionId, {
      status: "SUCCESS",
      output: audit,
      reasoning: audit.reasoning,
      executionTimeMs: Date.now(),
    });

    // Si hay anomalías críticas, crear notificación
    const criticalAnomalies = audit.anomalies.filter((a: any) => a.severity === "CRITICAL");
    if (criticalAnomalies.length > 0) {
      const payrollCase = await getPayrollCaseById(caseId);
      if (payrollCase) {
        await createNotification({
          userId: 1, // TODO: Get actual supervisor ID
          caseId,
          notificationType: "ANOMALY_DETECTED",
          title: `Critical anomalies detected in case ${caseId}`,
          message: `${criticalAnomalies.length} critical anomalies found during audit`,
        });
      }
    }

    await createAuditLog({
      caseId,
      action: "AGENT_EXECUTION",
      actor: "AGENT_AUDITOR",
      details: {
        auditStatus: audit.audit_status,
        anomaliesCount: audit.anomalies.length,
      },
    });

    return {
      success: true,
      output: audit,
      reasoning: audit.reasoning,
      anomalies: audit.anomalies.map((a: any) => a.description),
      recommendations: audit.recommendations,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await updateAgentExecution(executionId, {
      status: "FAILED",
      errorMessage,
      executionTimeMs: Date.now(),
    });

    return {
      success: false,
      output: null,
      reasoning: "Error during audit",
      errorMessage,
    };
  }
}

/**
 * AGENTE COMUNICADOR
 * Procesa novedades, genera alertas e interpreta documentación
 */
export async function executeCommunicatorAgent(
  caseId: number,
  documentContent: string,
  newsType: string
): Promise<AgentResult> {
  const executionResult = await createAgentExecution({
    caseId,
    agentType: "COMMUNICATOR",
    stage: "COLLECTION",
    input: { newsType, documentLength: documentContent.length },
  });
  const executionId = (executionResult as any).insertId || 0;

  try {
    const prompt = `You are a payroll communication expert. Process the following document/news and extract relevant information for payroll processing.

NEWS TYPE: ${newsType}

DOCUMENT CONTENT:
${documentContent}

Provide your analysis in JSON format with:
{
  "extracted_information": {
    "key_data": {"field": "value"},
    "affected_employees": ["emp1", "emp2"],
    "effective_date": "YYYY-MM-DD",
    "urgency": "LOW|MEDIUM|HIGH|CRITICAL"
  },
  "required_actions": ["action1", "action2"],
  "missing_information": ["info1", "info2"],
  "alerts": [
    {
      "type": "WARNING|ERROR|INFO",
      "message": "..."
    }
  ],
  "reasoning": "Explanation of the processing"
}`;

    const result = await invokeLLM({
      model: "claude-3-5-sonnet",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    const responseText = result.choices[0]?.message.content || '';
    const contentStr = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
    const processing = JSON.parse(contentStr);

    await updateAgentExecution(executionId, {
      status: "SUCCESS",
      output: processing,
      reasoning: processing.reasoning,
      executionTimeMs: Date.now(),
    });

    // Crear alertas si es necesario
    if (processing.alerts && processing.alerts.length > 0) {
      const errorAlerts = processing.alerts.filter((a: any) => a.type === "ERROR");
      if (errorAlerts.length > 0) {
        await createNotification({
          userId: 1, // TODO: Get actual supervisor ID
          caseId,
          notificationType: "INFO",
          title: `Processing alerts for case ${caseId}`,
          message: `${errorAlerts.length} alerts generated during document processing`,
        });
      }
    }

    await createAuditLog({
      caseId,
      action: "AGENT_EXECUTION",
      actor: "AGENT_COMMUNICATOR",
      details: {
        newsType,
        extractedFields: Object.keys(processing.extracted_information.key_data || {}),
      },
    });

    return {
      success: true,
      output: processing,
      reasoning: processing.reasoning,
      anomalies: processing.alerts.map((a: any) => a.message),
      recommendations: processing.required_actions,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await updateAgentExecution(executionId, {
      status: "FAILED",
      errorMessage,
      executionTimeMs: Date.now(),
    });

    return {
      success: false,
      output: null,
      reasoning: "Error during document processing",
      errorMessage,
    };
  }
}

/**
 * Orquestador de agentes: coordina la ejecución según la etapa del flujo
 */
export async function orchestrateAgents(
  caseId: number,
  stage: string,
  input: any
): Promise<{
  results: Record<string, AgentResult>;
  nextStage?: string;
  requiresApproval: boolean;
}> {
  const results: Record<string, AgentResult> = {};

  try {
    switch (stage) {
      case "COLLECTION":
        // Ejecutar Agente Comunicador para procesar novedades
        results.communicator = await executeCommunicatorAgent(
          caseId,
          input.documentContent,
          input.newsType
        );
        return {
          results,
          nextStage: "ANALYSIS",
          requiresApproval: false,
        };

      case "ANALYSIS":
        // Ejecutar Agente Interpretador Normativo
        const dnaRules = await getDNAByCategory("INTERNAL_RULES");
        results.normativeInterpreter = await executeNormativeInterpreterAgent(
          caseId,
          input.newsContent,
          dnaRules
        );
        return {
          results,
          nextStage: "PRE_LIQUIDATION",
          requiresApproval: false,
        };

      case "PRE_LIQUIDATION":
        // Ejecutar Agente Preliquidador
        results.preLiquidator = await executePreLiquidatorAgent(
          caseId,
          input.employeeData,
          input.parameters
        );
        return {
          results,
          nextStage: "AUDIT",
          requiresApproval: false,
        };

      case "AUDIT":
        // Ejecutar Agente Auditor
        results.auditor = await executeAuditorAgent(
          caseId,
          input.currentCalculation,
          input.historicalData
        );
        return {
          results,
          nextStage: "APPROVAL",
          requiresApproval: results.auditor.output?.audit_status !== "PASSED",
        };

      default:
        return {
          results: {},
          requiresApproval: false,
        };
    }
  } catch (error) {
    console.error(`Error orchestrating agents for case ${caseId}:`, error);
    return {
      results,
      requiresApproval: true,
    };
  }
}
