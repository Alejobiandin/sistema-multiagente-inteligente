/**
 * Normativa Argentina para Liquidación de Nóminas
 * Incluye: LCT, Convenios, Cargas Sociales, Retenciones
 */

// ============================================
// LEY DE CONTRATO DE TRABAJO (LCT)
// ============================================

export const LCT = {
  // Descanso semanal (Art. 204)
  weeklyRest: {
    minimumHours: 35,
    preferredDay: "Sunday",
    compensationIfWorked: "150%",
  },

  // Feriados (Art. 165)
  holidays: {
    mandatory: [
      { date: "01-01", name: "Año Nuevo" },
      { date: "02-12", name: "Malvinas" },
      { date: "03-24", name: "Memoria, Verdad y Justicia" },
      { date: "04-02", name: "Malvinas (Conmemoración)" },
      { date: "05-01", name: "Día del Trabajo" },
      { date: "05-25", name: "Revolución de Mayo" },
      { date: "06-17", name: "Güemes" },
      { date: "06-20", name: "Bandera Nacional" },
      { date: "07-09", name: "Independencia" },
      { date: "08-17", name: "Muerte del General San Martín" },
      { date: "10-12", name: "Respeto a la Diversidad Cultural" },
      { date: "11-18", name: "Lealtad Nacional" },
      { date: "12-08", name: "Inmaculada Concepción" },
      { date: "12-25", name: "Navidad" },
    ],
    compensation: "100%",
  },

  // Vacaciones (Art. 150)
  vacations: {
    accrual: {
      0: 0, // 0 años
      1: 14, // 1 año: 14 días
      5: 21, // 5 años: 21 días
      10: 28, // 10 años: 28 días
    },
    compensationIfNotTaken: "100%",
    prescriptionYears: 3,
  },

  // Sueldo Anual Complementario (SAC) - Art. 123
  sac: {
    accrual: "50% del mejor mes cada 6 meses",
    paymentMonths: [6, 12], // Junio y Diciembre
    compensationIfNotTaken: "100%",
  },

  // Preaviso (Art. 231-232)
  notice: {
    byEmployer: {
      lessThan3Months: 15, // días
      moreThan3Months: 30, // días
    },
    byEmployee: {
      lessThan3Months: 15, // días
      moreThan3Months: 30, // días
    },
    integrationOfMonth: true, // Si no se cumple, se paga integración
  },

  // Indemnización por Despido sin Causa (Art. 245)
  indemnity: {
    baseCalculation: "1 mes de sueldo por cada año de antigüedad",
    minimumMonths: 1,
    calculation: (yearsOfService: number, bestMonthSalary: number) => {
      return bestMonthSalary * Math.max(1, yearsOfService);
    },
  },

  // Integración de mes (Art. 231)
  integrationOfMonth: {
    description: "Si no se cumple el preaviso, se paga el mes completo",
    percentage: 100,
  },
};

// ============================================
// CARGAS SOCIALES (APORTES Y CONTRIBUCIONES)
// ============================================

export const SOCIAL_CHARGES = {
  // Aportes del empleado (descuentos)
  employeeDeductions: {
    AFIP: {
      code: "01",
      description: "Aporte AFIP",
      percentage: 13,
      notes: "Impuesto a las Ganancias",
    },
    INAMOVILIDAD: {
      code: "02",
      description: "Fondo de Garantía de Salarios",
      percentage: 0.75,
      notes: "Ley 23.271",
    },
    ObraSocial: {
      code: "03",
      description: "Obra Social",
      percentage: 3, // Varía según obra social
      notes: "Aproximado, varía por afiliación",
    },
    SINDICATO: {
      code: "04",
      description: "Aporte Sindical",
      percentage: 0.5, // Varía según sindicato
      notes: "Aproximado, varía por sindicato",
    },
  },

  // Contribuciones del empleador (cargas patronales)
  employerContributions: {
    AFIP: {
      code: "01",
      description: "Contribución AFIP",
      percentage: 13,
      notes: "Contribución patronal",
    },
    INAMOVILIDAD: {
      code: "02",
      description: "Fondo de Garantía de Salarios",
      percentage: 0.75,
      notes: "Ley 23.271",
    },
    ART: {
      code: "03",
      description: "Aseguradora de Riesgos del Trabajo",
      percentage: 3, // Varía según actividad
      notes: "Varía por rama de actividad",
    },
    FONDODESEMPLEO: {
      code: "04",
      description: "Fondo de Desempleo",
      percentage: 0.5,
      notes: "Ley 24.227",
    },
    FONDOCAPACITACION: {
      code: "05",
      description: "Fondo de Capacitación Laboral",
      percentage: 0.75,
      notes: "Ley 24.521",
    },
  },

  // Retenciones especiales
  retentions: {
    IMPUESTOGANANCIA: {
      code: "01",
      description: "Impuesto a las Ganancias",
      calculation: "Según escala progresiva",
      notes: "Se calcula sobre ingresos anuales",
    },
    IVA: {
      code: "02",
      description: "IVA",
      percentage: 0,
      notes: "No aplica a sueldos",
    },
  },
};

// ============================================
// CONVENIOS COLECTIVOS DE TRABAJO (CCT)
// ============================================

export const CONVENIOS = {
  // Comercio (CCT 130/75)
  COMERCIO: {
    code: "130/75",
    name: "Comercio",
    minSalary: 0, // Se actualiza mensualmente
    categories: {
      APRENDIZ: { percentage: 60 },
      VENDEDOR: { percentage: 100 },
      CAJERO: { percentage: 100 },
      SUPERVISOR: { percentage: 120 },
      GERENTE: { percentage: 150 },
    },
    workingHours: 40,
    overtimeCompensation: "150%",
  },

  // Construcción (CCT 30/75)
  CONSTRUCCION: {
    code: "30/75",
    name: "Construcción",
    minSalary: 0,
    categories: {
      PEON: { percentage: 100 },
      OFICIAL: { percentage: 120 },
      MAESTRO: { percentage: 150 },
      CAPATAZ: { percentage: 180 },
    },
    workingHours: 40,
    overtimeCompensation: "150%",
  },

  // Metalúrgica (CCT 260/75)
  METALURGICA: {
    code: "260/75",
    name: "Metalúrgica",
    minSalary: 0,
    categories: {
      APRENDIZ: { percentage: 60 },
      OPERARIO: { percentage: 100 },
      OFICIAL: { percentage: 120 },
      MAESTRO: { percentage: 150 },
    },
    workingHours: 40,
    overtimeCompensation: "150%",
  },

  // Textil (CCT 6/75)
  TEXTIL: {
    code: "6/75",
    name: "Textil",
    minSalary: 0,
    categories: {
      APRENDIZ: { percentage: 60 },
      OPERARIO: { percentage: 100 },
      CAPATAZ: { percentage: 120 },
    },
    workingHours: 40,
    overtimeCompensation: "150%",
  },

  // Gastronómico (CCT 130/75)
  GASTRONOMICO: {
    code: "130/75",
    name: "Gastronómico",
    minSalary: 0,
    categories: {
      MOZO: { percentage: 100 },
      COCINERO: { percentage: 120 },
      CHEF: { percentage: 150 },
      GERENTE: { percentage: 180 },
    },
    workingHours: 40,
    overtimeCompensation: "150%",
  },
};

// ============================================
// FUNCIONES DE CÁLCULO
// ============================================

export function calculateGrossToNet(
  grossSalary: number,
  employeeCategory: string,
  convenioCode?: string
): {
  grossSalary: number;
  employeeDeductions: Record<string, number>;
  netSalary: number;
  totalDeductions: number;
} {
  const employeeDeductions: Record<string, number> = {};
  let totalDeductions = 0;

  // Calcular aportes del empleado
  for (const [key, charge] of Object.entries(SOCIAL_CHARGES.employeeDeductions)) {
    const amount = (grossSalary * charge.percentage) / 100;
    employeeDeductions[key] = amount;
    totalDeductions += amount;
  }

  return {
    grossSalary,
    employeeDeductions,
    netSalary: grossSalary - totalDeductions,
    totalDeductions,
  };
}

export function calculateEmployerCharges(
  grossSalary: number,
  activityCode: string
): {
  totalCharges: number;
  charges: Record<string, number>;
} {
  const charges: Record<string, number> = {};
  let totalCharges = 0;

  // Calcular contribuciones del empleador
  for (const [key, charge] of Object.entries(SOCIAL_CHARGES.employerContributions)) {
    let percentage = charge.percentage;

    // Ajustar ART según actividad
    if (key === "ART") {
      percentage = getARTPercentage(activityCode);
    }

    const amount = (grossSalary * percentage) / 100;
    charges[key] = amount;
    totalCharges += amount;
  }

  return {
    totalCharges,
    charges,
  };
}

export function getARTPercentage(activityCode: string): number {
  // Tabla simplificada de ART por rama de actividad
  const artTable: Record<string, number> = {
    "01": 1.5, // Actividades de bajo riesgo
    "02": 2.5, // Actividades de riesgo medio
    "03": 3.5, // Actividades de alto riesgo
    "04": 4.5, // Actividades de muy alto riesgo
  };

  return artTable[activityCode] || 3; // Default 3%
}

export function calculateIndemnity(
  yearsOfService: number,
  bestMonthSalary: number,
  dismissalReason: string
): {
  indemnity: number;
  vacationDays: number;
  vacationAmount: number;
  sacAmount: number;
  integrationMonth: number;
  totalAmount: number;
} {
  // Indemnización por antigüedad
  const indemnity = bestMonthSalary * Math.max(1, yearsOfService);

  // Vacaciones no tomadas (14 días por año, máximo 28)
  const vacationDays = Math.min(14 * yearsOfService, 28);
  const vacationAmount = (bestMonthSalary / 30) * vacationDays;

  // SAC (50% del mejor mes)
  const sacAmount = bestMonthSalary * 0.5;

  // Integración de mes (si no se cumple preaviso)
  const integrationMonth = dismissalReason === "WITHOUT_CAUSE" ? bestMonthSalary : 0;

  const totalAmount = indemnity + vacationAmount + sacAmount + integrationMonth;

  return {
    indemnity,
    vacationDays,
    vacationAmount,
    sacAmount,
    integrationMonth,
    totalAmount,
  };
}

export function validateEmployeeData(employee: {
  name: string;
  category: string;
  salary: number;
  convenioCode?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!employee.name || employee.name.trim().length === 0) {
    errors.push("El nombre del empleado es requerido");
  }

  if (!employee.category || employee.category.trim().length === 0) {
    errors.push("La categoría del empleado es requerida");
  }

  if (employee.salary <= 0) {
    errors.push("El salario debe ser mayor a 0");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
