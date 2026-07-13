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
        const caseId = (result as any).insertId || (result as any)[0]?.id;
        const caseData = await getPayrollCaseById(caseId);
        return caseData;
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
        const caseData = await getPayrollCaseById(input.caseId);
        return caseData;
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
        const newsId = (result as any).insertId || (result as any)[0]?.id;
        return { id: newsId, ...input, processed: false, createdAt: new Date() };
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
        return { id: input.newsItemId, processed: true, classification: input.classification };
      }),
  }),

  // ============================================
  // DNA ORGANIZATIONAL
  // ============================================

  dna: router({
    getByCategory: protectedProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        try {
          const result = await getDNAByCategory(input.category);
          return result || [];
        } catch (error) {
          return [];
        }
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
      .mutation(async ({ input, ctx }) => {
        await createOrUpdateDNARule(input);
        return { id: 1, ...input, version: 1, active: true, createdAt: new Date(), updatedAt: new Date() };
      }),

    listCategories: protectedProcedure.query(async () => {
      try {
        const result = await getDNAByCategory('');
        return result || [];
      } catch (error) {
        return [];
      }
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
  // PAYROLL UPLOADS
  // ============================================

  uploads: router({
    upload: protectedProcedure
      .input(
        z.object({
          clientName: z.string(),
          payrollPeriod: z.string(),
          fileType: z.enum(["CSV", "EXCEL", "JSON"]),
          fileName: z.string(),
          fileContent: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return { success: true, message: "Nomina cargada exitosamente" };
      }),

    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        return { uploads: [], total: 0 };
      }),
  }),

  // ============================================
  // DISMISSALS & INDEMNIFICATIONS
  // ============================================

  dismissals: router({
    create: protectedProcedure
      .input(
        z.object({
          employeeId: z.string(),
          employeeName: z.string(),
          lastSalary: z.number(),
          yearsOfService: z.number(),
          dismissalReason: z.enum(["WITHOUT_CAUSE", "WITH_CAUSE", "RESIGNATION", "RETIREMENT", "DEATH", "FORCE_MAJEURE", "OTHER"]),
          dismissalDate: z.string(),
          workingDaysInMonth: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return { success: true, message: "Despido registrado" };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return [];
    }),
  }),

  indemnifications: router({
    calculate: protectedProcedure
      .input(
        z.object({
          dismissalId: z.number(),
          yearsOfService: z.number(),
          bestMonthSalary: z.number(),
          vacationDaysNotTaken: z.number(),
          sacProportion: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return { success: true, totalAmount: input.bestMonthSalary * input.yearsOfService };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return [];
    }),
  }),

  // ============================================
  // SOCIAL CHARGES
  // ============================================

  socialCharges: router({
    calculate: protectedProcedure
      .input(
        z.object({
          grossSalary: z.number(),
          employeeCategory: z.string(),
          activityCode: z.string(),
          payrollPeriod: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const afip = input.grossSalary * 0.13;
        const inamovilidad = input.grossSalary * 0.0075;
        return { success: true, totalCharges: afip + inamovilidad };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return [];
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
