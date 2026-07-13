# Guía de Uso para Supervisores - SNISSI

## Introducción

Esta guía está dirigida a supervisores que revisan y aprueban resultados de agentes en el sistema SNISSI.

## Roles y Responsabilidades

Como supervisor, usted es responsable de:

1. **Revisar resultados de agentes**: Validar que los análisis sean correctos
2. **Tomar decisiones**: Aprobar, rechazar o modificar resultados
3. **Registrar aprendizaje**: Documentar decisiones para mejorar el sistema
4. **Garantizar calidad**: Asegurar precisión en liquidaciones

## Flujo de Trabajo Diario

### 1. Revisar Dashboard

Al iniciar sesión:
1. Ir a **Dashboard Principal**
2. Revisar:
   - Casos activos
   - Agentes en ejecución
   - Anomalías detectadas
   - Notificaciones pendientes

### 2. Revisar Bandeja de Aprobaciones

1. Ir a **Supervisión Humana**
2. Ver lista de casos pendientes de aprobación
3. Ordenar por prioridad o fecha

### 3. Revisar Caso Individual

1. Hacer clic en el caso
2. Revisar:
   - Información del cliente
   - Período de liquidación
   - Novedades aplicables
   - Resultados de agentes

## Panel de Supervisión Humana

### Estructura

El panel muestra:

| Elemento | Descripción |
|----------|-------------|
| Caso | ID y cliente |
| Etapa | Etapa actual del flujo |
| Resultado del Agente | Análisis/cálculo realizado |
| Razonamiento | Por qué el agente llegó a esa conclusión |
| Botones de Acción | Aprobar, Rechazar, Modificar |

### Revisar Resultado de Agente

1. Leer el resultado completo
2. Revisar el razonamiento
3. Comparar con:
   - Histórico del empleado
   - Políticas de la organización
   - Normativa vigente

### Opciones de Decisión

#### Aprobar

Si el resultado es correcto:
1. Hacer clic en **Aprobar**
2. El caso avanza a la siguiente etapa
3. Se registra la aprobación en auditoría

#### Rechazar

Si el resultado es incorrecto:
1. Hacer clic en **Rechazar**
2. Ingresar motivo en el campo **Razonamiento**
3. Opcionalmente, crear una regla de aprendizaje
4. El caso vuelve a la etapa anterior

#### Modificar

Si el resultado necesita ajustes:
1. Hacer clic en **Modificar**
2. Editar los valores necesarios
3. Ingresar explicación de cambios
4. Crear regla de aprendizaje si es aplicable
5. Guardar cambios

## Registrar Aprendizaje Organizacional

### Cuándo Registrar Aprendizaje

Registre aprendizaje cuando:
- Rechaza un resultado de agente
- Modifica un resultado
- Detecta un patrón de error
- Identifica una excepción a una regla

### Cómo Registrar Aprendizaje

1. En el panel de decisión, hacer clic en **Registrar Aprendizaje**
2. Completar:
   - **Categoría**: LEARNING, CRITERION, RULE, etc.
   - **Clave**: Nombre descriptivo (ej: OVERTIME_EXCEPTION_CASE_123)
   - **Valor**: Descripción detallada de la regla
3. Guardar

### Ejemplo de Aprendizaje

**Caso**: Empleado con horas extra no fue calculado correctamente

**Decisión**: Rechazar y modificar

**Aprendizaje Registrado**:
- Categoría: LEARNING
- Clave: OVERTIME_CALCULATION_EXCEPTION_SENIOR_STAFF
- Valor: "Para empleados con más de 10 años de antigüedad, las horas extra se calculan con factor 1.5x en lugar de 1.25x según acuerdo colectivo 2026"

Este aprendizaje será considerado por el Agente Preliquidador en futuros casos.

## Revisión de Casos Complejos

### Casos que Requieren Atención Especial

1. **Anomalías Detectadas**: El Agente Auditor marcó inconsistencias
2. **Cambios Normativos**: Nueva legislación afecta el cálculo
3. **Excepciones**: Situaciones fuera del flujo normal
4. **Errores Previos**: Correcciones de liquidaciones anteriores

### Proceso para Casos Complejos

1. Revisar **Detalle del Caso** → **Auditoría**
2. Ver timeline completo de acciones
3. Revisar ejecuciones de agentes anteriores
4. Consultar ADN Organizacional si es necesario
5. Tomar decisión informada

## Consultar ADN Organizacional

### Cuándo Consultar

Consulte el ADN cuando:
- Necesita verificar una política
- Quiere entender una regla de cálculo
- Busca criterios de validación
- Necesita una plantilla

### Cómo Acceder

1. Ir a **ADN Organizacional**
2. Buscar por categoría o palabra clave
3. Revisar versión y fecha de actualización
4. Aplicar conocimiento a su decisión

## Gestión de Novedades

### Revisar Bandeja de Novedades

1. Ir a **Bandeja de Novedades**
2. Ver lista de novedades sin procesar
3. Revisar clasificación propuesta por agente
4. Aceptar o corregir clasificación

### Tipos de Novedad

| Tipo | Descripción | Acción |
|------|-------------|--------|
| HIRING | Nuevo empleado | Crear liquidación inicial |
| TERMINATION | Fin de contrato | Liquidación final |
| SALARY_CHANGE | Cambio de salario | Recalcular liquidación |
| BENEFIT_CHANGE | Cambio de beneficios | Actualizar conceptos |
| LEAVE | Licencia/Permiso | Ajustar período |
| PROMOTION | Ascenso | Cambiar categoría |

## Escalado de Problemas

### Cuándo Escalar

Escale un caso cuando:
- No puede tomar una decisión
- Requiere autorización de nivel superior
- Detecta un error del sistema
- Necesita consultar normativa externa

### Cómo Escalar

1. En el caso, hacer clic en **Escalar**
2. Seleccionar nivel (Supervisor, Manager, Director)
3. Ingresar motivo
4. El caso se asigna a nivel superior

## Reportes y Análisis

### Generar Reporte de Caso

1. Ir a **Detalle del Caso**
2. Hacer clic en **Exportar Reporte**
3. Seleccionar formato (PDF, Excel)
4. Descargar

### Contenido del Reporte

- Información del cliente
- Período de liquidación
- Cálculos por concepto
- Decisiones tomadas
- Aprendizajes registrados

### Análisis de Tendencias

Regularmente, revisar:
- Tasa de aprobación vs rechazo
- Tipos de anomalías más comunes
- Patrones de error de agentes
- Mejoras en calidad

## Mejores Prácticas

### 1. Revisión Cuidadosa

- No aprobar sin revisar completamente
- Verificar cálculos manualmente si es necesario
- Consultar histórico del empleado
- Comparar con casos similares

### 2. Documentación

- Siempre ingresar razonamiento detallado
- Registrar aprendizaje cuando sea relevante
- Usar lenguaje claro y específico
- Incluir referencias a normativa si aplica

### 3. Consistencia

- Aplicar criterios uniformes
- Consultar ADN para decisiones
- Escaldar excepciones apropiadamente
- Mantener estándares de calidad

### 4. Comunicación

- Informar al cliente de cambios
- Coordinar con otros supervisores
- Reportar problemas del sistema
- Participar en mejora continua

## Resolución de Problemas

### No Puedo Acceder al Sistema

1. Verificar credenciales
2. Verificar conexión a Internet
3. Limpiar cookies del navegador
4. Contactar administrador

### No Veo Casos Pendientes

1. Verificar que está en la vista correcta
2. Actualizar página (F5)
3. Verificar filtros aplicados
4. Contactar administrador

### Resultado de Agente Parece Incorrecto

1. Revisar razonamiento del agente
2. Consultar ADN para entender la lógica
3. Comparar con casos anteriores
4. Registrar aprendizaje si es necesario

### No Puedo Registrar Aprendizaje

1. Verificar que tiene permisos de supervisor
2. Completar todos los campos requeridos
3. Verificar que la categoría es válida
4. Contactar administrador

## Contacto de Soporte

Para asistencia:
- Email: supervisors@snissi.local
- Chat: Sistema de mensajería interna
- Teléfono: +1-XXX-XXX-XXXX

## Preguntas Frecuentes

### P: ¿Puedo deshacer una decisión?

R: No directamente. Si necesita cambiar una decisión, contacte al administrador para escalar el caso.

### P: ¿Cuánto tiempo tengo para revisar un caso?

R: No hay límite de tiempo, pero se recomienda revisar dentro de 24 horas para mantener el flujo.

### P: ¿Qué pasa si rechazo un caso?

R: El caso vuelve a la etapa anterior para que el agente lo reanalice considerando su feedback.

### P: ¿Cómo mejora el sistema con mi feedback?

R: Cada aprendizaje registrado se agrega al ADN Organizacional, que los agentes consultan en futuros casos.

### P: ¿Puedo ver decisiones de otros supervisores?

R: Sí, en el log de auditoría de cada caso puede ver todas las decisiones tomadas.
