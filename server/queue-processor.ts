/**
 * Sistema de Cola de Procesamiento
 * Maneja 100+ liquidaciones simultáneas con control de concurrencia
 */

import { getDb } from "./db";
import { processingQueue, processingStatus } from "../drizzle/schema";
import { eq } from "drizzle-orm";

interface QueueTask {
  id: number;
  payrollUploadId: number;
  taskType: "VALIDATE" | "LIQUIDATE" | "CALCULATE_CHARGES" | "GENERATE_REPORT" | "EXPORT";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "RETRY";
  retryCount: number;
  maxRetries: number;
  payload: any;
  result?: any;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class QueueProcessor {
  private maxConcurrentTasks = 10; // Ajustable según recursos
  private processingTasks = new Map<number, Promise<void>>();
  private isRunning = false;

  /**
   * Inicia el procesador de cola
   */
  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log("[QueueProcessor] Iniciando procesador de cola");

    // Procesar tareas cada 100ms
    const interval = setInterval(async () => {
      if (this.isRunning) {
        await this.processNextBatch();
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  /**
   * Detiene el procesador de cola
   */
  stop() {
    this.isRunning = false;
    console.log("[QueueProcessor] Deteniendo procesador de cola");
  }

  /**
   * Procesa el siguiente lote de tareas
   */
  private async processNextBatch() {
    const db = await getDb();
    if (!db) return;

    try {
      // Obtener tareas pendientes ordenadas por prioridad
      const pendingTasks = await db
        .select()
        .from(processingQueue)
        .where(eq(processingQueue.status, "PENDING"))
        .limit(this.maxConcurrentTasks - this.processingTasks.size);

      for (const task of pendingTasks) {
        if (this.processingTasks.size >= this.maxConcurrentTasks) break;

        const taskId = task.id;
        const promise = this.processTask(task as QueueTask);

        this.processingTasks.set(taskId, promise);

        // Limpiar cuando se complete
        promise
          .then(() => {
            this.processingTasks.delete(taskId);
          })
          .catch((error) => {
            console.error(`[QueueProcessor] Error en tarea ${taskId}:`, error);
            this.processingTasks.delete(taskId);
          });
      }
    } catch (error) {
      console.error("[QueueProcessor] Error al procesar lote:", error);
    }
  }

  /**
   * Procesa una tarea individual
   */
  private async processTask(task: QueueTask) {
    const db = await getDb();
    if (!db) return;

    try {
      // Marcar como en procesamiento
      await db
        .update(processingQueue)
        .set({
          status: "PROCESSING",
          startedAt: new Date(),
        })
        .where(eq(processingQueue.id, task.id));

      // Actualizar estado de procesamiento
      await this.updateProcessingStatus(task.payrollUploadId, task.taskType, 0);

      // Procesar según tipo de tarea
      let result;
      switch (task.taskType) {
        case "VALIDATE":
          result = await this.validatePayrollData(task);
          break;
        case "LIQUIDATE":
          result = await this.calculateLiquidation(task);
          break;
        case "CALCULATE_CHARGES":
          result = await this.calculateSocialCharges(task);
          break;
        case "GENERATE_REPORT":
          result = await this.generateReport(task);
          break;
        case "EXPORT":
          result = await this.exportResults(task);
          break;
        default:
          throw new Error(`Tipo de tarea desconocido: ${task.taskType}`);
      }

      // Marcar como completado
      await db
        .update(processingQueue)
        .set({
          status: "COMPLETED",
          completedAt: new Date(),
          result: JSON.stringify(result),
        })
        .where(eq(processingQueue.id, task.id));

      // Actualizar estado de procesamiento
      await this.updateProcessingStatus(task.payrollUploadId, "COMPLETED", 100);

      console.log(`[QueueProcessor] Tarea ${task.id} (${task.taskType}) completada`);
    } catch (error) {
      console.error(`[QueueProcessor] Error procesando tarea ${task.id}:`, error);

      // Reintentar si no se alcanzó el máximo
      if (task.retryCount < task.maxRetries) {
        await db
          .update(processingQueue)
          .set({
            status: "RETRY",
            retryCount: task.retryCount + 1,
            errorMessage: String(error),
          })
          .where(eq(processingQueue.id, task.id));
      } else {
        await db
          .update(processingQueue)
          .set({
            status: "FAILED",
            errorMessage: String(error),
            completedAt: new Date(),
          })
          .where(eq(processingQueue.id, task.id));

        await this.updateProcessingStatus(task.payrollUploadId, "FAILED", 0);
      }
    }
  }

  /**
   * Valida datos de nómina
   */
  private async validatePayrollData(task: QueueTask): Promise<any> {
    // Simular validación
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { valid: true, errors: [] };
  }

  /**
   * Calcula liquidación de nómina
   */
  private async calculateLiquidation(task: QueueTask): Promise<any> {
    // Simular cálculo
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      grossSalary: task.payload.salary,
      netSalary: task.payload.salary * 0.85,
      deductions: task.payload.salary * 0.15,
    };
  }

  /**
   * Calcula cargas sociales
   */
  private async calculateSocialCharges(task: QueueTask): Promise<any> {
    // Simular cálculo
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      employerCharges: task.payload.salary * 0.21,
      employeeDeductions: task.payload.salary * 0.17,
    };
  }

  /**
   * Genera reporte
   */
  private async generateReport(task: QueueTask): Promise<any> {
    // Simular generación
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      reportId: `RPT-${Date.now()}`,
      format: "PDF",
      pages: 5,
    };
  }

  /**
   * Exporta resultados
   */
  private async exportResults(task: QueueTask): Promise<any> {
    // Simular exportación
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return {
      exportId: `EXP-${Date.now()}`,
      format: "XLSX",
      rows: 100,
    };
  }

  /**
   * Actualiza el estado de procesamiento
   */
  private async updateProcessingStatus(
    payrollUploadId: number,
    stage: string,
    progress: number
  ) {
    const db = await getDb();
    if (!db) return;

    try {
      await db
        .update(processingStatus)
        .set({
          currentStage: stage,
          progressPercentage: progress.toString(),
          lastUpdate: new Date(),
        })
        .where(eq(processingStatus.payrollUploadId, payrollUploadId));
    } catch (error) {
      console.error("[QueueProcessor] Error actualizando estado:", error);
    }
  }

  /**
   * Agrega una tarea a la cola
   */
  async addTask(
    payrollUploadId: number,
    taskType: "VALIDATE" | "LIQUIDATE" | "CALCULATE_CHARGES" | "GENERATE_REPORT" | "EXPORT",
    payload: any,
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM"
  ) {
    const db = await getDb();
    if (!db) return null;

    try {
      const result = await db.insert(processingQueue).values({
        payrollUploadId,
        taskType,
        priority,
        status: "PENDING",
        payload,
        retryCount: 0,
        maxRetries: 3,
      });

      return result;
    } catch (error) {
      console.error("[QueueProcessor] Error agregando tarea:", error);
      return null;
    }
  }

  /**
   * Obtiene el estado de una carga
   */
  async getUploadStatus(payrollUploadId: number) {
    const db = await getDb();
    if (!db) return null;

    try {
      const status = await db
        .select()
        .from(processingStatus)
        .where(eq(processingStatus.payrollUploadId, payrollUploadId))
        .limit(1);

      const tasks = await db
        .select()
        .from(processingQueue)
        .where(eq(processingQueue.payrollUploadId, payrollUploadId));

      return {
        status: status[0] || null,
        tasks,
        summary: {
          total: tasks.length,
          pending: tasks.filter((t) => t.status === "PENDING").length,
          processing: tasks.filter((t) => t.status === "PROCESSING").length,
          completed: tasks.filter((t) => t.status === "COMPLETED").length,
          failed: tasks.filter((t) => t.status === "FAILED").length,
          retry: tasks.filter((t) => t.status === "RETRY").length,
        },
      };
    } catch (error) {
      console.error("[QueueProcessor] Error obteniendo estado:", error);
      return null;
    }
  }

  /**
   * Obtiene estadísticas del procesador
   */
  getStats() {
    return {
      isRunning: this.isRunning,
      activeTaskCount: this.processingTasks.size,
      maxConcurrentTasks: this.maxConcurrentTasks,
    };
  }
}

// Exportar instancia singleton
export const queueProcessor = new QueueProcessor();

// Iniciar automáticamente
queueProcessor.start();
