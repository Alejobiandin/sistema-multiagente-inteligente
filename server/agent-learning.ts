/**
 * Sistema de Aprendizaje de Agentes
 * Convierte decisiones humanas en reglas del ADN organizacional
 */

import { getDb } from "./db";
import { dnaOrganizational, humanApprovals } from "../drizzle/schema";

export interface LearningPattern {
  pattern: string;
  frequency: number;
  confidence: number;
  lastUpdated: Date;
}

/**
 * Registrar aprendizaje de una decisión humana
 */
export async function recordLearning(
  caseId: number,
  agentType: string,
  decision: "APPROVED" | "REJECTED" | "MODIFIED",
  reasoning: string,
  context: Record<string, any>
): Promise<void> {
  try {
    console.log(`[Learning] Registrando aprendizaje: ${agentType} - ${decision}`);
    
    // Extraer patrón de la decisión
    const pattern = extractPattern(agentType, decision, context);
    
    // Guardar en ADN organizacional
    await saveDNARule(agentType, pattern, reasoning);
    
    // Actualizar estadísticas de aprendizaje
    await updateLearningStats(agentType, decision);
  } catch (error) {
    console.error("[Learning] Error registrando aprendizaje:", error);
  }
}

/**
 * Extraer patrón de una decisión humana
 */
function extractPattern(
  agentType: string,
  decision: string,
  context: Record<string, any>
): string {
  const patterns: Record<string, string> = {
    "PRELIQUIDADOR": `Liquidación rechazada: ${context.reason || "validación fallida"}`,
    "AUDITOR": `Auditoría modificada: ${context.anomaly || "inconsistencia detectada"}`,
    "DESPIDOS": `Despido validado: ${context.dismissalType || "sin causa"}`,
    "INDEMNIZACIONES": `Indemnización ajustada: ${context.adjustment || "cálculo revisado"}`,
    "CARGAS_SOCIALES": `Cargas sociales corregidas: ${context.correction || "parámetro actualizado"}`,
  };
  
  return patterns[agentType] || `Patrón aprendido: ${agentType}`;
}

/**
 * Guardar regla en ADN organizacional
 */
async function saveDNARule(
  category: string,
  key: string,
  value: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Learning] BD no disponible");
    return;
  }

  try {
    console.log(`[Learning] Guardando regla en ADN: ${category}/${key}`);
    // En producción: INSERT INTO dna_organizational (category, key, value, version, createdAt, updatedAt)
    // VALUES (?, ?, ?, 1, NOW(), NOW())
    // ON DUPLICATE KEY UPDATE value = ?, version = version + 1, updatedAt = NOW()
  } catch (error) {
    console.error("[Learning] Error guardando regla:", error);
  }
}

/**
 * Actualizar estadísticas de aprendizaje
 */
async function updateLearningStats(
  agentType: string,
  decision: string
): Promise<void> {
  try {
    console.log(`[Learning] Actualizando estadísticas: ${agentType}`);
    // En producción: UPDATE agent_learning_stats SET ${decision}_count = ${decision}_count + 1
    // WHERE agent_type = ?
  } catch (error) {
    console.error("[Learning] Error actualizando estadísticas:", error);
  }
}

/**
 * Obtener patrones aprendidos para un agente
 */
export async function getLearnedPatterns(agentType: string): Promise<LearningPattern[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Learning] BD no disponible");
    return [];
  }

  try {
    console.log(`[Learning] Recuperando patrones aprendidos: ${agentType}`);
    // En producción: SELECT * FROM dna_organizational WHERE category = ? ORDER BY version DESC
    return [];
  } catch (error) {
    console.error("[Learning] Error recuperando patrones:", error);
    return [];
  }
}

/**
 * Detectar anomalías basadas en patrones aprendidos
 */
export async function detectAnomalies(
  agentType: string,
  currentData: Record<string, any>
): Promise<string[]> {
  try {
    const patterns = await getLearnedPatterns(agentType);
    const anomalies: string[] = [];

    for (const pattern of patterns) {
      if (shouldFlagAsAnomaly(pattern, currentData)) {
        anomalies.push(`Anomalía detectada: ${pattern.pattern}`);
      }
    }

    return anomalies;
  } catch (error) {
    console.error("[Learning] Error detectando anomalías:", error);
    return [];
  }
}

/**
 * Determinar si datos actuales son anomalía
 */
function shouldFlagAsAnomaly(
  pattern: LearningPattern,
  currentData: Record<string, any>
): boolean {
  // Lógica simple: si la confianza es alta y hay desviación, es anomalía
  if (pattern.confidence < 0.8) return false;
  
  // En producción: comparar currentData con patrón esperado
  return false;
}

/**
 * Sugerir acciones basadas en patrones aprendidos
 */
export async function suggestActions(
  agentType: string,
  caseData: Record<string, any>
): Promise<string[]> {
  try {
    const patterns = await getLearnedPatterns(agentType);
    const suggestions: string[] = [];

    for (const pattern of patterns) {
      if (pattern.confidence > 0.9) {
        suggestions.push(`Sugerencia: ${pattern.pattern}`);
      }
    }

    return suggestions;
  } catch (error) {
    console.error("[Learning] Error sugiriendo acciones:", error);
    return [];
  }
}

/**
 * Calcular confianza de un patrón
 */
export function calculateConfidence(
  frequency: number,
  totalDecisions: number
): number {
  if (totalDecisions === 0) return 0;
  const confidence = frequency / totalDecisions;
  return Math.min(confidence, 1.0);
}

/**
 * Exportar aprendizajes como reporte
 */
export async function exportLearnings(
  agentType: string
): Promise<Record<string, any>> {
  try {
    const patterns = await getLearnedPatterns(agentType);
    
    return {
      agentType,
      totalPatterns: patterns.length,
      patterns: patterns.map(p => ({
        pattern: p.pattern,
        frequency: p.frequency,
        confidence: (p.confidence * 100).toFixed(2) + "%",
        lastUpdated: p.lastUpdated
      })),
      generatedAt: new Date()
    };
  } catch (error) {
    console.error("[Learning] Error exportando aprendizajes:", error);
    return {};
  }
}
