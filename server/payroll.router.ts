import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import {
  createPayrollCase,
  getPayrollCaseById,
  listPayrollCases,
  updatePayrollCaseStage,
  createNewsItem,
  listNewsItems,
  updateNewsItemProcessed,
  getDNAByCategory,
  createOrUpdateDNARule,
  getAgentExecutionHistory,
  getCaseAuditLog,
  createHumanApproval,
  updateHumanApproval,
  getPendingApprovals,
  createDocument,
  getCaseDocuments,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
} from "./db";
import {
  orchestrateAgents,
  executeNormativeInterpreterAgent,
  executePreLiquidatorAgent,
  executeAuditorAgent,
  executeCommunicatorAgent,
} from "./agents";

export const payrollRouter = router({
  // ============================================
  // PAYROLL CASES
  // ============================================
  
  cases: router({
    create: protectedProcedure
      .input(
        z.object({
          clientId: z.number(),
          clientName: z.string(),
          payrollPeriod: z.string(),
          employeeCount: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createPayrollCase(input);
        return { success: true, caseId: (result as any).insertId };
      }),

    list: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          currentStage: z.string().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        return await listPayrollCases(input);
      }),

    getById: protectedProcedure
      .input(z.object({ caseId: z.number() }))
      .query(async ({ input }) => {
        return await getPayrollCaseById(input.caseId);
      }),

    transitionStage: protectedProcedure
      .input(
        z.object({
          caseId: z.number(),
          newStage: z.string(),
          status: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await updatePayrollCaseStage(input.caseId, input.newStage, input.status);
        
        // Log de auditoría
        return { success: true };
      }),

    executeAgents: protectedProcedure
      .input(
        z.object({
          caseId: z.number(),
          stage: z.string(),
          input: z.any(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await orchestrateAgents(input.caseId, input.stage, input.input);
        return result;
      }),
  }),

  // ============================================
  // NEWS ITEMS (NOVEDADES)
  // ============================================

  news: router({
    create: protectedProcedure
      .input(
        z.object({
          caseId: z.number().optional(),
          newsType: z.string(),
          content: z.string(),
          source: z.string(),
          priority: z.string().optional(),
          attachmentUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createNewsItem(input);
        return { success: true, newsId: (result as any).insertId };
      }),

    list: protectedProcedure
      .input(
        z.object({
          caseId: z.number().optional(),
          processed: z.boolean().optional(),
          limit: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        return await listNewsItems(input);
      }),

    classify: protectedProcedure
      .input(
        z.object({
          newsItemId: z.number(),
          classification: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await updateNewsItemProcessed(input.newsItemId, input.classification);
        return { success: true };
      }),
  }),

  // ============================================
  // DNA ORGANIZATIONAL
  // ============================================

  dna: router({
    getByCategory: protectedProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await getDNAByCategory(input.category);
      }),

    updateRule: protectedProcedure
      .input(
        z.object({
          category: z.string(),
          key: z.string(),
          value: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createOrUpdateDNARule(input);
        return { success: true };
      }),

    listCategories: protectedProcedure.query(async () => {
      return [
        "TECHNICAL_CRITERIA",
        "INTERNAL_RULES",
        "POLICIES",
        "TEMPLATES",
        "JURISPRUDENCE",
        "WORKFLOWS",
        "LEARNING",
      ];
    }),
  }),

  // ============================================
  // AGENT EXECUTIONS
  // ============================================

  agents: router({
    getHistory: protectedProcedure
      .input(
        z.object({
          caseId: z.number(),
          agentType: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return await getAgentExecutionHistory(input.caseId, input.agentType);
      }),
  }),

  // ============================================
  // AUDIT LOG
  // ============================================

  audit: router({
    getCaseLog: protectedProcedure
      .input(z.object({ caseId: z.number() }))
      .query(async ({ input }) => {
        return await getCaseAuditLog(input.caseId);
      }),
  }),

  // ============================================
  // HUMAN APPROVALS
  // ============================================

  approvals: router({
    getPending: protectedProcedure
      .input(z.object({ supervisorId: z.number().optional() }))
      .query(async ({ input, ctx }) => {
        const supervisorId = input.supervisorId || ctx.user?.id;
        return await getPendingApprovals(supervisorId);
      }),

    submit: protectedProcedure
      .input(
        z.object({
          approvalId: z.number(),
          decision: z.enum(["APPROVED", "REJECTED", "MODIFIED"]),
          reasoning: z.string(),
          modifications: z.any().optional(),
          learnedRule: z.string().optional(),
          learnedRuleCategory: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await updateHumanApproval(input.approvalId, {
          decision: input.decision,
          reasoning: input.reasoning,
          modifications: input.modifications,
          learnedRule: input.learnedRule,
          learnedRuleCategory: input.learnedRuleCategory,
        });

        // Si hay una regla aprendida, actualizarla en el ADN
        if (input.learnedRule && input.learnedRuleCategory) {
          await createOrUpdateDNARule({
            category: input.learnedRuleCategory,
            key: `learned_${Date.now()}`,
            value: input.learnedRule,
            description: `Learned from approval decision by user ${ctx.user?.id}`,
          });
        }

        return { success: true };
      }),
  }),

  // ============================================
  // DOCUMENTS
  // ============================================

  documents: router({
    create: protectedProcedure
      .input(
        z.object({
          caseId: z.number(),
          filename: z.string(),
          fileKey: z.string(),
          url: z.string(),
          documentType: z.string(),
          mimeType: z.string().optional(),
          fileSize: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await createDocument({
          ...input,
          uploadedBy: ctx.user?.id,
        });
        return { success: true, documentId: (result as any).insertId };
      }),

    list: protectedProcedure
      .input(z.object({ caseId: z.number() }))
      .query(async ({ input }) => {
        return await getCaseDocuments(input.caseId);
      }),
  }),

  // ============================================
  // NOTIFICATIONS
  // ============================================

  notifications: router({
    list: protectedProcedure
      .input(z.object({ unreadOnly: z.boolean().optional() }))
      .query(async ({ input, ctx }) => {
        return await getUserNotifications(ctx.user?.id || 0, input.unreadOnly);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await markNotificationAsRead(input.notificationId);
        return { success: true };
      }),
  }),
});
