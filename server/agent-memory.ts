import { getDb } from "./db";
import { agentExecutions, dnaOrganizational } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export interface AgentContext {
  userId: number;
  clientId: number;
  caseId: number;
  agentType: string;
  userPreferences: Record<string, any>;
  previousDecisions: Array<{
    date: Date;
    decision: string;
    reasoning: string;
    outcome: string;
  }>;
  organizationalDNA: Array<{
    category: string;
    key: string;
    value: string;
  }>;
}

export interface AgentMemory {
  taskHistory: Array<{
    taskId: string;
    input: string;
    output: string;
    timestamp: Date;
    success: boolean;
  }>;
  patterns: Map<string, number>;
  learnings: string[];
}

/**
 * Cargar contexto completo del usuario y caso para el agente
 */
export async function loadAgentContext(
  userId: number,
  clientId: number,
  caseId: number,
  agentType: string,
  userPreferences: Record<string, any> = {}
): Promise<AgentContext> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Cargar decisiones previas del usuario
  const previousExecutions: any[] = [];
  try {
    // Implementación simplificada - en producción usar queries reales
    console.log(`[AgentMemory] Cargando contexto para agente ${agentType}`);
  } catch (error) {
    console.error("Error loading previous executions:", error);
  }

  const previousDecisions = previousExecutions.map((exec) => ({
    date: exec.timestamp || new Date(),
    decision: exec.output ? JSON.parse(exec.output as string).decision || "" : "",
    reasoning: exec.output ? JSON.parse(exec.output as string).reasoning || "" : "",
    outcome: exec.status || "unknown",
  }));

  // Cargar ADN organizacional relevante
  const dnaRules: any[] = [];
  try {
    // Implementación simplificada - en producción usar queries reales
    console.log(`[AgentMemory] Cargando ADN organizacional`);
  } catch (error) {
    console.error("Error loading DNA rules:", error);
  }

  const organizationalDNA = dnaRules.map((rule) => ({
    category: rule.category,
    key: rule.key,
    value: rule.value,
  }));

  return {
    userId,
    clientId,
    caseId,
    agentType,
    userPreferences,
    previousDecisions,
    organizationalDNA,
  };
}

/**
 * Crear prompt enriquecido con contexto y memoria
 */
export function buildContextualPrompt(
  context: AgentContext,
  taskDescription: string,
  taskData: any
): string {
  const previousDecisionsText =
    context.previousDecisions.length > 0
      ? `\n\nHistorial de decisiones previas:\n${context.previousDecisions
          .map(
            (d) =>
              `- ${d.date.toISOString()}: ${d.decision} (${d.outcome})\n  Razonamiento: ${d.reasoning}`
          )
          .join("\n")}`
      : "";

  const dnaText =
    context.organizationalDNA.length > 0
      ? `\n\nReglas organizacionales aplicables:\n${context.organizationalDNA
          .map((rule) => `- ${rule.key}: ${rule.value}`)
          .join("\n")}`
      : "";

  const preferencesText =
    Object.keys(context.userPreferences).length > 0
      ? `\n\nPreferencias del usuario:\n${Object.entries(context.userPreferences)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join("\n")}`
      : "";

  return `Contexto del Agente ${context.agentType}:
- Usuario ID: ${context.userId}
- Cliente ID: ${context.clientId}
- Caso ID: ${context.caseId}

Tarea: ${taskDescription}

Datos de la tarea:
${JSON.stringify(taskData, null, 2)}
${previousDecisionsText}${dnaText}${preferencesText}

Por favor, proporciona una respuesta estructurada con:
1. Análisis de la situación
2. Decisión recomendada
3. Razonamiento detallado
4. Posibles riesgos o consideraciones
5. Aprendizajes para futuras tareas`;
}

/**
 * Guardar ejecución del agente con contexto
 */
export async function saveAgentExecution(
  caseId: number,
  agentType: string,
  input: string,
  output: string,
  status: "success" | "error" | "pending" = "success"
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("Database not available, skipping agent execution save");
    return;
  }

  try {
    // Guardar en BD (implementación simplificada)
    console.log(`[AgentMemory] Guardando ejecución: ${agentType} - ${status}`);
  } catch (error) {
    console.error("Error saving agent execution:", error);
  }
}

/**
 * Extraer aprendizajes de una decisión humana
 */
export function extractLearnings(
  decision: string,
  reasoning: string,
  agentOutput: string
): string[] {
  const learnings: string[] = [];

  if (decision === "approved") {
    learnings.push(`Decisión aprobada: ${reasoning}`);
  } else if (decision === "rejected") {
    learnings.push(`Decisión rechazada: ${reasoning}`);
  } else if (decision === "modified") {
    learnings.push(`Decisión modificada: ${reasoning}`);
  }

  return learnings;
}

/**
 * Detectar patrones en decisiones del usuario
 */
export function detectPatterns(
  executionHistory: Array<{
    input: string;
    output: string;
    timestamp: Date;
  }>
): Map<string, number> {
  const patterns = new Map<string, number>();

  executionHistory.forEach((exec) => {
    try {
      const output = JSON.parse(exec.output);
      const pattern = output.decision || "unknown";
      patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
    } catch (e) {
      // Ignore parsing errors
    }
  });

  return patterns;
}

/**
 * Generar sugerencia predictiva basada en patrones
 */
export function generatePredictiveSuggestion(
  patterns: Map<string, number>,
  currentContext: AgentContext
): string | null {
  if (patterns.size === 0) return null;

  // Encontrar el patrón más frecuente
  let mostFrequentPattern = "";
  let maxCount = 0;

  patterns.forEach((count, pattern) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentPattern = pattern;
    }
  });

  if (maxCount >= 3) {
    return `Basado en patrones previos (${maxCount} ocurrencias), se sugiere: ${mostFrequentPattern}`;
  }

  return null;
}
