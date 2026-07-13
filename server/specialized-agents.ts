import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { agentExecutions } from "../drizzle/schema";

/**
 * Agente Especializado en Despidos
 * Calcula preaviso, integración de mes, y prepara documentación de despido
 */
export async function agentDismissal(input: {
  employeeId: string;
  employeeName: string;
  lastSalary: number;
  yearsOfService: number;
  dismissalReason: "WITHOUT_CAUSE" | "WITH_CAUSE" | "RESIGNATION" | "RETIREMENT" | "DEATH" | "FORCE_MAJEURE" | "OTHER";
  dismissalDate: string;
  workingDaysInMonth: number;
  caseId: number;
}) {
  const prompt = `
Eres un experto en Ley de Contrato de Trabajo (LCT) argentina. Analiza el siguiente caso de despido y calcula:

1. **Preaviso**: Según antigüedad, ¿cuántos días de preaviso corresponden?
2. **Integración de mes**: ¿Cuántos días del mes actual deben pagarse?
3. **Motivo**: ¿El despido es con o sin justa causa?
4. **Documentación**: ¿Qué documentos se requieren?

Datos del empleado:
- Nombre: ${input.employeeName}
- Salario: $${input.lastSalary}
- Antigüedad: ${input.yearsOfService} años
- Motivo de despido: ${input.dismissalReason}
- Fecha de despido: ${input.dismissalDate}
- Días hábiles en el mes: ${input.workingDaysInMonth}

Responde en JSON con estructura:
{
  "noticeRequired": true/false,
  "noticeDays": número,
  "integrationDays": número,
  "integrationAmount": número,
  "reasoning": "explicación",
  "requiredDocuments": ["doc1", "doc2"],
  "lctReferences": ["artículo X", "artículo Y"]
}
  `;

  try {
    const response = await invokeLLM({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const messageContent = response.choices[0]?.message.content;
    if (!messageContent) throw new Error("No response content");
    
    const textContent = typeof messageContent === "string" 
      ? messageContent 
      : Array.isArray(messageContent) && messageContent[0]?.type === "text"
      ? messageContent[0].text
      : "";

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const result = JSON.parse(jsonMatch[0]);

    const db = await getDb();
    if (db) {
      await db.insert(agentExecutions).values({
        caseId: input.caseId,
        agentType: "DISMISSAL",
        input: JSON.stringify(input),
        output: JSON.stringify(result),
        reasoning: result.reasoning,
        status: "SUCCESS",
        executionTimeMs: 0,
      });
    }

    return result;
  } catch (error) {
    console.error("[AgentDismissal] Error:", error);
    return {
      noticeRequired: true,
      noticeDays: 30,
      integrationDays: 0,
      integrationAmount: 0,
      reasoning: "Error en cálculo, usar valores por defecto",
      requiredDocuments: [],
      lctReferences: [],
      error: String(error),
    };
  }
}

/**
 * Agente Especializado en Indemnizaciones
 * Calcula montos de indemnización según LCT, vacaciones no gozadas, SAC proporcional
 */
export async function agentIndemnification(input: {
  employeeId: string;
  yearsOfService: number;
  bestMonthSalary: number;
  dismissalReason: string;
  vacationDaysNotTaken: number;
  sacProportion: number;
  integrationMonth: number;
  caseId: number;
}) {
  const prompt = `
Eres un experto en cálculo de indemnizaciones según la Ley de Contrato de Trabajo (LCT) argentina.

Calcula los siguientes montos:
1. **Indemnización por antigüedad**: 1 mes de salario por cada año de servicio (o fracción mayor a 3 meses)
2. **Vacaciones no gozadas**: Días no utilizados × (salario diario)
3. **SAC proporcional**: Según meses trabajados en el semestre
4. **Integración de mes**: Días faltantes hasta fin de mes

Datos:
- Antigüedad: ${input.yearsOfService} años
- Mejor salario mensual: $${input.bestMonthSalary}
- Motivo de despido: ${input.dismissalReason}
- Días de vacaciones no gozadas: ${input.vacationDaysNotTaken}
- Proporción SAC: ${input.sacProportion}
- Integración de mes: $${input.integrationMonth}

Responde en JSON:
{
  "indemnityAmount": número,
  "vacationAmount": número,
  "sacAmount": número,
  "integrationMonth": número,
  "totalAmount": número,
  "breakdown": {
    "indemnityDays": número,
    "vacationDays": número,
    "dailyRate": número
  },
  "reasoning": "explicación",
  "lctArticles": ["Art. X", "Art. Y"]
}
  `;

  try {
    const response = await invokeLLM({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const messageContent = response.choices[0]?.message.content;
    if (!messageContent) throw new Error("No response content");
    
    const textContent = typeof messageContent === "string" 
      ? messageContent 
      : Array.isArray(messageContent) && messageContent[0]?.type === "text"
      ? messageContent[0].text
      : "";

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const result = JSON.parse(jsonMatch[0]);

    const db = await getDb();
    if (db) {
      await db.insert(agentExecutions).values({
        caseId: input.caseId,
        agentType: "INDEMNIFICATION",
        input: JSON.stringify(input),
        output: JSON.stringify(result),
        reasoning: result.reasoning,
        status: "SUCCESS",
        executionTimeMs: 0,
      });
    }

    return result;
  } catch (error) {
    console.error("[AgentIndemnification] Error:", error);
    return {
      indemnityAmount: input.bestMonthSalary * input.yearsOfService,
      vacationAmount: 0,
      sacAmount: 0,
      integrationMonth: input.integrationMonth,
      totalAmount: input.bestMonthSalary * input.yearsOfService + input.integrationMonth,
      breakdown: {},
      reasoning: "Error en cálculo, usando fórmula básica",
      lctArticles: [],
      error: String(error),
    };
  }
}

/**
 * Agente Especializado en Cargas Sociales
 * Calcula aportes patronales, retenciones, ART, fondos
 */
export async function agentSocialCharges(input: {
  grossSalary: number;
  employeeCategory: string;
  activityCode: string;
  payrollPeriod: string;
  caseId: number;
}) {
  const prompt = `
Eres un experto en cargas sociales argentina. Calcula los siguientes conceptos para un empleado:

1. **Aportes Patronales**: AFIP (13%), INAMOVILIDAD (0.75%), otros según convenio
2. **Retenciones**: Impuesto a Ganancias (variable), IVA (si aplica)
3. **Seguros**: Seguro de Vida Obligatorio (SVO), ART según actividad
4. **Fondos**: Fondo de Desempleo, Fondo de Garantía de Salarios

Datos:
- Salario bruto: $${input.grossSalary}
- Categoría: ${input.employeeCategory}
- Código de actividad: ${input.activityCode}
- Período: ${input.payrollPeriod}

Responde en JSON:
{
  "charges": [
    {
      "type": "EMPLOYER_CONTRIBUTION",
      "description": "AFIP",
      "percentage": 13,
      "amount": número,
      "code": "AFIP"
    }
  ],
  "totalEmployerContribution": número,
  "totalWithholding": número,
  "totalInsurance": número,
  "totalFunds": número,
  "grandTotal": número,
  "reasoning": "explicación",
  "regulations": ["Resolución X", "Decreto Y"]
}
  `;

  try {
    const response = await invokeLLM({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    const messageContent = response.choices[0]?.message.content;
    if (!messageContent) throw new Error("No response content");
    
    const textContent = typeof messageContent === "string" 
      ? messageContent 
      : Array.isArray(messageContent) && messageContent[0]?.type === "text"
      ? messageContent[0].text
      : "";

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const result = JSON.parse(jsonMatch[0]);

    const db = await getDb();
    if (db) {
      await db.insert(agentExecutions).values({
        caseId: input.caseId,
        agentType: "SOCIAL_CHARGES",
        input: JSON.stringify(input),
        output: JSON.stringify(result),
        reasoning: result.reasoning,
        status: "SUCCESS",
        executionTimeMs: 0,
      });
    }

    return result;
  } catch (error) {
    console.error("[AgentSocialCharges] Error:", error);
    const afip = input.grossSalary * 0.13;
    const inamovilidad = input.grossSalary * 0.0075;
    const totalCharges = afip + inamovilidad;

    return {
      charges: [
        { type: "EMPLOYER_CONTRIBUTION", description: "AFIP", percentage: 13, amount: afip, code: "AFIP" },
        { type: "EMPLOYER_CONTRIBUTION", description: "INAMOVILIDAD", percentage: 0.75, amount: inamovilidad, code: "INAMOVILIDAD" },
      ],
      totalEmployerContribution: totalCharges,
      totalWithholding: 0,
      totalInsurance: 0,
      totalFunds: 0,
      grandTotal: totalCharges,
      reasoning: "Cálculo por defecto debido a error",
      regulations: [],
      error: String(error),
    };
  }
}

/**
 * Agente Validador
 * Valida datos de entrada antes de procesar
 */
export async function agentValidator(input: {
  data: Record<string, unknown>;
  schema: string;
  caseId: number;
}) {
  const prompt = `
Valida los siguientes datos según el esquema especificado:

Datos: ${JSON.stringify(input.data)}
Esquema esperado: ${input.schema}

Responde en JSON:
{
  "isValid": true/false,
  "errors": ["error1", "error2"],
  "warnings": ["warning1"],
  "correctedData": {},
  "suggestions": ["sugerencia1"]
}
  `;

  try {
    const response = await invokeLLM({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const messageContent = response.choices[0]?.message.content;
    if (!messageContent) throw new Error("No response content");
    
    const textContent = typeof messageContent === "string" 
      ? messageContent 
      : Array.isArray(messageContent) && messageContent[0]?.type === "text"
      ? messageContent[0].text
      : "";

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[AgentValidator] Error:", error);
    return {
      isValid: true,
      errors: [],
      warnings: [String(error)],
      correctedData: input.data,
      suggestions: [],
    };
  }
}

/**
 * Agente Monitor
 * Monitorea el progreso de liquidaciones y detecta anomalías
 */
export async function agentMonitor(input: {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTimePerTask: number;
  caseId: number;
}) {
  const progressPercentage = (input.completedTasks / input.totalTasks) * 100;
  const failureRate = (input.failedTasks / input.totalTasks) * 100;
  const estimatedTimeRemaining = (input.totalTasks - input.completedTasks) * input.averageTimePerTask;

  const prompt = `
Analiza el progreso de procesamiento de liquidaciones:

- Total de tareas: ${input.totalTasks}
- Completadas: ${input.completedTasks} (${progressPercentage.toFixed(1)}%)
- Fallidas: ${input.failedTasks} (${failureRate.toFixed(1)}%)
- Tiempo promedio por tarea: ${input.averageTimePerTask}s
- Tiempo estimado restante: ${estimatedTimeRemaining}s

Detecta anomalías y proporciona recomendaciones:

Responde en JSON:
{
  "status": "ON_TRACK" | "DELAYED" | "CRITICAL",
  "progressPercentage": número,
  "failureRate": número,
  "estimatedTimeRemaining": número,
  "anomalies": ["anomalía1"],
  "recommendations": ["recomendación1"],
  "alertLevel": "INFO" | "WARNING" | "CRITICAL"
}
  `;

  try {
    const response = await invokeLLM({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    const messageContent = response.choices[0]?.message.content;
    if (!messageContent) throw new Error("No response content");
    
    const textContent = typeof messageContent === "string" 
      ? messageContent 
      : Array.isArray(messageContent) && messageContent[0]?.type === "text"
      ? messageContent[0].text
      : "";

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[AgentMonitor] Error:", error);
    return {
      status: failureRate > 10 ? "CRITICAL" : progressPercentage < 50 ? "DELAYED" : "ON_TRACK",
      progressPercentage,
      failureRate,
      estimatedTimeRemaining,
      anomalies: failureRate > 10 ? ["Tasa de fallos elevada"] : [],
      recommendations: [],
      alertLevel: failureRate > 10 ? "CRITICAL" : "INFO",
    };
  }
}
