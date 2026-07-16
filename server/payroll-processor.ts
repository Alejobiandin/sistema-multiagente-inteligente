export interface EmployeePayrollData {
  employeeId: string;
  employeeName: string;
  hoursWorked: number;
  hourlyRate: number;
  overtimeHours?: number;
  absenceDays?: number;
  advancePayment?: number;
  bonuses?: number;
  deductions?: number;
  convention?: string;
}

export interface PayrollCalculation {
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  overtimePay: number;
  bonuses: number;
  grossSalary: number;
  afipRetention: number;
  healthInsurance: number;
  pensionFund: number;
  unionFee: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  employerAfip: number;
  employerHealth: number;
  employerPension: number;
  art: number;
  unemploymentFund: number;
  totalEmployerCharges: number;
  convention: string;
  calculatedAt: Date;
  validationErrors: string[];
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    if (Object.values(row).some((v) => v)) {
      rows.push(row);
    }
  }

  return rows;
}

export function parsePayrollFile(
  fileContent: string,
  fileType: "csv" | "json" | "excel"
): EmployeePayrollData[] {
  try {
    if (fileType === "csv") {
      const rows = parseCSV(fileContent);
      return rows.map((row) => ({
        employeeId: row.employeeId || row.employee_id || "",
        employeeName: row.employeeName || row.employee_name || "",
        hoursWorked: parseFloat(row.hoursWorked || row.hours_worked || "0"),
        hourlyRate: parseFloat(row.hourlyRate || row.hourly_rate || "0"),
        overtimeHours: parseFloat(row.overtimeHours || row.overtime_hours || "0"),
        absenceDays: parseFloat(row.absenceDays || row.absence_days || "0"),
        advancePayment: parseFloat(row.advancePayment || row.advance_payment || "0"),
        bonuses: parseFloat(row.bonuses || "0"),
        deductions: parseFloat(row.deductions || "0"),
        convention: row.convention || "SIN_CONVENIO",
      }));
    } else if (fileType === "json") {
      return JSON.parse(fileContent);
    }
    throw new Error("Unsupported file type");
  } catch (error) {
    throw new Error(`Error parsing payroll file: ${error}`);
  }
}

export function validatePayrollData(
  data: EmployeePayrollData[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  data.forEach((employee, index) => {
    if (!employee.employeeId) {
      errors.push(`Row ${index + 1}: Missing employeeId`);
    }
    if (!employee.employeeName) {
      errors.push(`Row ${index + 1}: Missing employeeName`);
    }
    if (employee.hoursWorked < 0 || employee.hoursWorked > 240) {
      errors.push(`Row ${index + 1}: Invalid hoursWorked (0-240 expected)`);
    }
    if (employee.hourlyRate <= 0) {
      errors.push(`Row ${index + 1}: Invalid hourlyRate (must be > 0)`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function calculatePayroll(
  employee: EmployeePayrollData
): PayrollCalculation {
  const validationErrors: string[] = [];

  if (!employee.employeeId || !employee.employeeName) {
    validationErrors.push("Missing employee identification");
  }
  if (employee.hoursWorked < 0 || employee.hoursWorked > 240) {
    validationErrors.push("Invalid hours worked");
  }
  if (employee.hourlyRate <= 0) {
    validationErrors.push("Invalid hourly rate");
  }

  const basicSalary = employee.hoursWorked * employee.hourlyRate;
  const overtimeHours = Math.max(0, employee.hoursWorked - 160);
  const overtimePay = overtimeHours * employee.hourlyRate * 1.5;
  const bonuses = employee.bonuses || 0;
  const grossSalary = basicSalary + overtimePay + bonuses;

  const afipRetention = grossSalary * 0.17;
  const healthInsurance = grossSalary * 0.03;
  const pensionFund = grossSalary * 0.11;
  const unionFee = grossSalary * 0.01;
  const otherDeductions = employee.deductions || 0;

  const totalDeductions =
    afipRetention +
    healthInsurance +
    pensionFund +
    unionFee +
    otherDeductions -
    (employee.advancePayment || 0);

  const netSalary = Math.max(0, grossSalary - totalDeductions);

  const employerAfip = grossSalary * 0.105;
  const employerHealth = grossSalary * 0.06;
  const employerPension = grossSalary * 0.16;
  const art = grossSalary * 0.015;
  const unemploymentFund = grossSalary * 0.015;

  const totalEmployerCharges =
    employerAfip + employerHealth + employerPension + art + unemploymentFund;

  return {
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    basicSalary,
    overtimePay,
    bonuses,
    grossSalary,
    afipRetention,
    healthInsurance,
    pensionFund,
    unionFee,
    otherDeductions,
    totalDeductions,
    netSalary,
    employerAfip,
    employerHealth,
    employerPension,
    art,
    unemploymentFund,
    totalEmployerCharges,
    convention: employee.convention || "SIN_CONVENIO",
    calculatedAt: new Date(),
    validationErrors,
  };
}

export function processPayrollBatch(
  employees: EmployeePayrollData[]
): PayrollCalculation[] {
  return employees.map((employee) => calculatePayroll(employee));
}

export function generatePayrollSummary(calculations: PayrollCalculation[]) {
  const totalGrossSalary = calculations.reduce((sum, c) => sum + c.grossSalary, 0);
  const totalDeductions = calculations.reduce((sum, c) => sum + c.totalDeductions, 0);
  const totalNetSalary = calculations.reduce((sum, c) => sum + c.netSalary, 0);
  const totalEmployerCharges = calculations.reduce(
    (sum, c) => sum + c.totalEmployerCharges,
    0
  );

  return {
    employeeCount: calculations.length,
    totalGrossSalary,
    totalDeductions,
    totalNetSalary,
    totalEmployerCharges,
    totalCost: totalGrossSalary + totalEmployerCharges,
    averageSalary: totalGrossSalary / calculations.length,
    calculatedAt: new Date(),
  };
}
