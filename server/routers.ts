import { COOKIE_NAME } from "../shared/const";
import { z } from "zod"; // Asegurar que z esté disponible para modules.router
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { payrollRouter } from "./payroll.router";
import {
  taxesRouter,
  accountingRouter,
  economyRouter,
  billingRouter,
  clientsEmployeesRouter,
  coordinatorRouter,
} from "./modules.router";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  payroll: payrollRouter,
  taxes: taxesRouter,
  accounting: accountingRouter,
  economy: economyRouter,
  billing: billingRouter,
  clients: clientsEmployeesRouter,
  coordinator: coordinatorRouter,
});

export type AppRouter = typeof appRouter;
