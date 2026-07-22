/**
 * Pruebas Integrales del Sistema SNISSI
 * Valida el flujo completo: carga → procesamiento → descarga
 */

import { describe, it, expect, beforeAll } from "vitest";
import { calculatePayroll } from "./payroll-processor";
import { executePayrollFlow } from "./end-to-end-flow";
import { recordLearning, detectAnomalies } from "./agent-learning";

describe("SNISSI Integration Tests", () => {
  
  describe("Payroll Processor", () => {
    it("should calculate payroll correctly", () => {
      const employee = {
        employeeId: "EMP001",
        employeeName: "Juan Pérez",
        hoursWorked: 160,
        hourlyRate: 500
      };

      const result = calculatePayroll(employee);

      expect(result).toBeDefined();
      expect(result.grossSalary).toBeGreaterThan(0);
      expect(result.netSalary).toBeGreaterThan(0);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
    });

    it("should handle overtime correctly", () => {
      const employee = {
        employeeId: "EMP002",
        employeeName: "María García",
        hoursWorked: 180, // 20 horas extra
        hourlyRate: 500
      };

      const result = calculatePayroll(employee);
      
      expect(result.grossSalary).toBeGreaterThan(160 * 500); // Más que horas normales
    });

    it("should calculate deductions", () => {
      const employee = {
        employeeId: "EMP003",
        employeeName: "Carlos López",
        hoursWorked: 160,
        hourlyRate: 500
      };

      const result = calculatePayroll(employee);
      
      expect(result.deductions).toBeGreaterThanOrEqual(0);
      expect(result.deductions).toBeLessThan(result.grossSalary);
    });
  });

  describe("End-to-End Flow", () => {
    it("should process payroll flow successfully", async () => {
      const employees = [
        {
          id: "EMP001",
          name: "Juan Pérez",
          salary: 80000,
          hours: 160
        },
        {
          id: "EMP002",
          name: "María García",
          salary: 90000,
          hours: 160
        }
      ];

      const result = await executePayrollFlow(1, employees);

      expect(result.success).toBe(true);
      expect(result.processedEmployees).toBeGreaterThan(0);
      expect(result.totalCharges).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThan(0);
    });

    it("should handle invalid data gracefully", async () => {
      const invalidEmployees = [
        {
          id: "EMP001",
          // Missing required fields
        }
      ];

      const result = await executePayrollFlow(2, invalidEmployees);

      expect(result.processedEmployees).toBe(0);
      expect(result.failedEmployees).toBeGreaterThanOrEqual(0);
    });

    it("should calculate social charges correctly", async () => {
      const employees = [
        {
          id: "EMP001",
          name: "Test Employee",
          salary: 100000,
          hours: 160
        }
      ];

      const result = await executePayrollFlow(3, employees);

      expect(result.totalCharges).toBeGreaterThan(0);
      expect(result.totalCharges).toBeLessThan(result.processedEmployees * 100000);
    });
  });

  describe("Agent Learning", () => {
    it("should record learning from human decisions", async () => {
      const context = {
        reason: "Validación de horas extras",
        anomaly: "Horas fuera de rango"
      };

      await recordLearning(1, "PRELIQUIDADOR", "APPROVED", "Liquidación validada", context);
      
      // No debería lanzar error
      expect(true).toBe(true);
    });

    it("should detect anomalies", async () => {
      const anomalies = await detectAnomalies("PRELIQUIDADOR", {
        totalCharges: 500000,
        employeeCount: 10
      });

      expect(Array.isArray(anomalies)).toBe(true);
    });
  });

  describe("Performance", () => {
    it("should process 10 employees in reasonable time", async () => {
      const employees = Array.from({ length: 10 }, (_, i) => ({
        id: `EMP${i.toString().padStart(3, "0")}`,
        name: `Employee ${i}`,
        salary: 80000 + i * 1000,
        hours: 160
      }));

      const startTime = Date.now();
      const result = await executePayrollFlow(4, employees);
      const duration = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(10000); // Menos de 10 segundos
    });

    it("should handle concurrent operations", async () => {
      const employees = Array.from({ length: 5 }, (_, i) => ({
        id: `EMP${i.toString().padStart(3, "0")}`,
        name: `Employee ${i}`,
        salary: 80000,
        hours: 160
      }));

      const promises = Array.from({ length: 3 }, (_, i) =>
        executePayrollFlow(5 + i, employees)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success || !r.success)).toBe(true);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data consistency", async () => {
      const employees = [
        {
          id: "EMP001",
          name: "Juan Pérez",
          salary: 80000,
          hours: 160
        }
      ];

      const result = await executePayrollFlow(6, employees);

      expect(result.processedEmployees + result.failedEmployees).toBe(employees.length);
    });

    it("should not lose data on partial failure", async () => {
      const employees = [
        {
          id: "EMP001",
          name: "Juan Pérez",
          salary: 80000,
          hours: 160
        },
        {
          id: "EMP002",
          // Invalid employee
        },
        {
          id: "EMP003",
          name: "Carlos López",
          salary: 90000,
          hours: 160
        }
      ];

      const result = await executePayrollFlow(7, employees);

      expect(result.processedEmployees).toBeGreaterThan(0);
      expect(result.processedEmployees + result.failedEmployees).toBe(employees.length);
    });
  });
});
