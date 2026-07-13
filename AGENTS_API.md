# API de Agentes IA - SNISSI

## Descripción General

El sistema SNISSI cuenta con cuatro agentes IA especializados que operan de forma coordinada para procesar casos de liquidación de nómina. Cada agente tiene un rol específico en el flujo de trabajo.

## Los Cuatro Agentes

### 1. Agente Interpretador Normativo

**Propósito**: Analizar cambios normativos, detectar impacto en liquidación y clasificar por relevancia.

**Entrada**:
- Texto de normativa o cambio legal
- Contexto del caso (período, empleados afectados)
- Historial de cambios anteriores

**Salida**:
- Análisis de impacto (ALTO, MEDIO, BAJO)
- Áreas afectadas (salario, beneficios, deducciones, etc.)
- Recomendaciones de acción
- Fecha de vigencia

**Ejemplo de uso**:
```typescript
const result = await executeNormativeInterpreterAgent({
  caseId: 123,
  input: {
    normativeText: "Nuevo decreto sobre incremento salarial...",
    affectedAreas: ["SALARY", "BENEFITS"],
    effectiveDate: "2026-08-01"
  }
});
```

### 2. Agente Preliquidador

**Propósito**: Calcular conceptos de nómina, generar borradores de liquidación y validar parámetros.

**Entrada**:
- Datos del empleado (salario, antigüedad, categoría)
- Novedades aplicables (aumentos, descuentos, cambios)
- Período de liquidación
- Parámetros organizacionales del ADN

**Salida**:
- Cálculo detallado por concepto
- Borrador de liquidación
- Validaciones y alertas
- Sugerencias de corrección

**Ejemplo de uso**:
```typescript
const result = await executePreLiquidatorAgent({
  caseId: 123,
  input: {
    employeeId: 456,
    salary: 50000,
    period: "2026-07",
    novelties: [
      { type: "SALARY_INCREASE", amount: 5000 }
    ]
  }
});
```

### 3. Agente Auditor

**Propósito**: Detectar anomalías, comparar con históricos y validar coherencia de cálculos.

**Entrada**:
- Liquidación generada por el Preliquidador
- Histórico del empleado (últimos 12 meses)
- Parámetros de validación del ADN
- Reglas de auditoría

**Salida**:
- Lista de anomalías detectadas
- Comparativas con histórico
- Validación de coherencia
- Recomendación de aprobación/rechazo

**Ejemplo de uso**:
```typescript
const result = await executeAuditorAgent({
  caseId: 123,
  input: {
    liquidation: { /* borrador de liquidación */ },
    employeeHistory: [ /* histórico */ ],
    validationRules: [ /* reglas */ ]
  }
});
```

### 4. Agente Comunicador

**Propósito**: Procesar novedades, generar alertas y interpretar documentación.

**Entrada**:
- Novedades laborales (contrataciones, despidos, cambios)
- Documentación adjunta (PDFs, imágenes)
- Contexto del caso
- Plantillas de comunicación

**Salida**:
- Clasificación de novedad
- Alertas generadas
- Documentación interpretada
- Acciones recomendadas

**Ejemplo de uso**:
```typescript
const result = await executeCommunicatorAgent({
  caseId: 123,
  input: {
    noveltyType: "HIRING",
    content: "Nuevo empleado contratado...",
    attachments: [ /* URLs de documentos */ ]
  }
});
```

## Orquestador de Agentes

El orquestador coordina la ejecución de los agentes según la etapa del caso:

### Flujo por Etapa

1. **COLLECTION**: Agente Comunicador procesa novedades
2. **ANALYSIS**: Agente Interpretador Normativo analiza cambios
3. **PRE_LIQUIDATION**: Agente Preliquidador genera borradores
4. **AUDIT**: Agente Auditor valida liquidaciones
5. **APPROVAL**: Supervisión humana (sin agentes)
6. **EMISSION**: Agente Comunicador genera documentos
7. **PRESENTATION**: Agente Comunicador prepara presentación
8. **CLOSED**: Archivo y cierre

### Ejemplo de Orquestación

```typescript
const result = await orchestrateAgents(
  caseId,
  'PRE_LIQUIDATION',
  {
    employeeData: [ /* datos */ ],
    novelties: [ /* novedades */ ]
  }
);
```

## Integración con LLM

Todos los agentes utilizan Claude 3.5 Sonnet como LLM base. La integración incluye:

- **Context Management**: Cada agente mantiene contexto del caso
- **Structured Output**: Respuestas en formato JSON validado
- **Error Handling**: Reintentos automáticos en caso de fallo
- **Token Optimization**: Uso eficiente de tokens de contexto

## Trazabilidad

Cada ejecución de agente se registra en:
- Tabla `agent_executions`: Entrada, salida, estado, timestamp
- Tabla `audit_log`: Acción, actor (agente), detalles
- Panel de supervisión: Visible para revisión humana

## Aprendizaje Organizacional

Cuando un supervisor humano rechaza o modifica un resultado de agente:
1. La decisión se registra en `human_approvals`
2. Se crea una nueva regla en el ADN organizacional
3. Los agentes futuros consideran esta regla en sus análisis

## Mejores Prácticas

1. **Validación de Entrada**: Siempre validar datos antes de enviar a agentes
2. **Manejo de Errores**: Implementar reintentos con backoff exponencial
3. **Monitoreo**: Revisar regularmente la calidad de salidas de agentes
4. **Feedback**: Proporcionar feedback constante para mejorar el ADN
5. **Documentación**: Mantener registro de decisiones humanas para auditoría

## Limitaciones Conocidas

- Los agentes operan con información del período actual (no predicción futura)
- Requieren validación humana para decisiones críticas
- Dependencia de calidad del ADN organizacional
- Latencia de ~2-5 segundos por ejecución

## Soporte

Para reportar problemas o sugerencias sobre los agentes, contactar al equipo de administración del sistema.
