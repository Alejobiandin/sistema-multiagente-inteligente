import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

// Mock context con usuario autenticado
function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: 'test-user',
      email: 'test@example.com',
      name: 'Test User',
      loginMethod: 'test',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };
}

describe('Payroll Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe('Cases Router', () => {
    it('should list payroll cases', async () => {
      const result = await caller.payroll.cases.list({ limit: 10 });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should create a new payroll case', async () => {
      const result = await caller.payroll.cases.create({
        clientId: 1,
        clientName: 'Test Client',
        payrollPeriod: '2026-07',
        employeeCount: 50,
      });

      expect(result).toBeDefined();
      expect(result.clientName).toBe('Test Client');
      expect(result.status).toBe('ACTIVE');
      expect(result.currentStage).toBe('COLLECTION');
    });

    it('should get case by id', async () => {
      const created = await caller.payroll.cases.create({
        clientId: 1,
        clientName: 'Test Client',
        payrollPeriod: '2026-07',
        employeeCount: 50,
      });

      const retrieved = await caller.payroll.cases.getById({ caseId: created.id });
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.clientName).toBe('Test Client');
    });

    it('should transition case to next stage', async () => {
      const created = await caller.payroll.cases.create({
        clientId: 1,
        clientName: 'Test Client',
        payrollPeriod: '2026-07',
        employeeCount: 50,
      });

      const transitioned = await caller.payroll.cases.transitionStage({
        caseId: created.id,
        newStage: 'ANALYSIS',
      });

      expect(transitioned.currentStage).toBe('ANALYSIS');
    });
  });

  describe('News Router', () => {
    it('should create a news item', async () => {
      const result = await caller.payroll.news.create({
        newsType: 'SALARY_CHANGE',
        content: 'Test salary change',
        source: 'MANUAL',
        priority: 'MEDIUM',
      });

      expect(result).toBeDefined();
      expect(result.newsType).toBe('SALARY_CHANGE');
      expect(result.processed).toBe(false);
    });

    it('should list news items', async () => {
      await caller.payroll.news.create({
        newsType: 'HIRING',
        content: 'New hire',
        source: 'MANUAL',
        priority: 'HIGH',
      });

      const result = await caller.payroll.news.list({
        processed: false,
        limit: 10,
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should classify a news item', async () => {
      const created = await caller.payroll.news.create({
        newsType: 'BENEFIT_CHANGE',
        content: 'Benefit update',
        source: 'MANUAL',
        priority: 'MEDIUM',
      });

      const classified = await caller.payroll.news.classify({
        newsItemId: created.id,
        classification: 'BENEFIT_CHANGE',
      });

      expect(classified).toBeDefined();
      expect(classified.processed).toBe(true);
    });
  });

  describe('DNA Router', () => {
    it('should update a DNA rule', async () => {
      const result = await caller.payroll.dna.updateRule({
        category: 'POLICY',
        key: 'TEST_POLICY',
        value: 'This is a test policy',
      });

      expect(result).toBeDefined();
      expect(result.key).toBe('TEST_POLICY');
      expect(result.category).toBe('POLICY');
    });

    it('should list DNA categories', async () => {
      await caller.payroll.dna.updateRule({
        category: 'RULE',
        key: 'TEST_RULE',
        value: 'Test rule value',
      });

      const result = await caller.payroll.dna.listCategories(undefined);

      expect(Array.isArray(result)).toBe(true);
      expect(result.some((r: any) => r.category === 'RULE')).toBe(true);
    });
  });

  describe('Approvals Router', () => {
    it('should get pending approvals', async () => {
      const result = await caller.payroll.approvals.getPending({});
      expect(Array.isArray(result)).toBe(true);
    });

    it('should submit an approval decision', async () => {
      // Create a case first
      const caseData = await caller.payroll.cases.create({
        clientId: 1,
        clientName: 'Test Client',
        payrollPeriod: '2026-07',
        employeeCount: 50,
      });

      // Submit approval
      const result = await caller.payroll.approvals.submit({
        approvalId: 1,
        decision: 'APPROVED',
        reasoning: 'Test approval',
        learnedRule: undefined,
      });

      expect(result).toBeDefined();
      expect(result.decision).toBe('APPROVED');
    });
  });

  describe('Audit Router', () => {
    it('should get case audit log', async () => {
      const caseData = await caller.payroll.cases.create({
        clientId: 1,
        clientName: 'Test Client',
        payrollPeriod: '2026-07',
        employeeCount: 50,
      });

      const result = await caller.payroll.audit.getCaseLog({ caseId: caseData.id });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Notifications Router', () => {
    it('should list notifications', async () => {
      const result = await caller.payroll.notifications.list({
        unreadOnly: false,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Agents Router', () => {
    it('should get agent history', async () => {
      const caseData = await caller.payroll.cases.create({
        clientId: 1,
        clientName: 'Test Client',
        payrollPeriod: '2026-07',
        employeeCount: 50,
      });

      const result = await caller.payroll.agents.getHistory({ caseId: caseData.id });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Documents Router', () => {
    it('should list documents', async () => {
      const result = await caller.payroll.documents.list({ limit: 10 });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should create a document reference', async () => {
      const result = await caller.payroll.documents.create({
        caseId: 1,
        filename: 'test.pdf',
        fileKey: 'test-key',
        url: 'https://example.com/test.pdf',
        documentType: 'PAYROLL_REPORT',
      });

      expect(result).toBeDefined();
      expect(result.filename).toBe('test.pdf');
    });
  });
});
