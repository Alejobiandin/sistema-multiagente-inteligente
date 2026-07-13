# SNISSI - Sistema Operativo Cognitivo Multiagente para Estudios Profesionales
## Plan de Desarrollo - Fase 2: Plataforma Web Robusta y Autoescalable

### Fase 1: Extensión de Base de Datos
- [x] Crear tabla `payroll_uploads`: Registro de cargas de nóminas (CSV, Excel, JSON)
- [x] Crear tabla `dismissals`: Registro de despidos con datos de empleado, fecha, motivo
- [x] Crear tabla `indemnifications`: Cálculos de indemnizaciones por despido
- [x] Crear tabla `social_charges`: Cargas sociales (aportes patronales, retenciones, ART, fondos)
- [x] Crear tabla `processing_queue`: Cola de procesamiento para 100+ liquidaciones concurrentes
- [x] Crear tabla `processing_status`: Estado en tiempo real de cada liquidación en proceso
- [x] Extender tabla `agent_executions` para incluir logs detallados de cada agente

### Fase 2: Agentes Especializados Adicionales
- [x] Implementar `AgenteDespidos`: Calcula indemnizaciones, preaviso, integración mes
- [x] Implementar `AgenteIndemnizaciones`: Aplica fórmulas de indemnización según LCT y antigüedad
- [x] Implementar `AgenteCargas Sociales`: Calcula aportes patronales, retenciones, ART
- [x] Implementar `AgenteValidador`: Valida datos de entrada antes de procesar
- [x] Implementar `AgenteMonitor`: Monitorea progreso de liquidaciones, detecta fallos

### Fase 3: UI de Carga de Nóminas
- [x] Crear página `PayrollUpload.tsx`: Interfaz para subir archivos (CSV, Excel, JSON)
- [x] Implementar validación de formato y estructura de archivos
- [x] Crear parser para CSV/Excel/JSON con manejo de errores
- [x] Mostrar preview de datos antes de procesar
- [x] Permitir mapeo de columnas (si estructura es diferente)
- [x] Mostrar resumen: cantidad de empleados, validaciones, errores

### Fase 4: UI de Monitoreo en Tiempo Real
- [x] Crear página `ProcessingMonitor.tsx`: Dashboard de liquidaciones en proceso
- [x] Mostrar progreso global (X de 100 liquidaciones completadas)
- [x] Mostrar tabla de liquidaciones con estado (pendiente, procesando, completada, error)
- [x] Mostrar barra de progreso por liquidación individual
- [x] Actualizar en tiempo real con WebSocket o polling
- [x] Mostrar velocidad de procesamiento (liquidaciones/minuto)
- [x] Permitir pausar/reanudar procesamiento si es necesario

### Fase 5: UI de Historial y Auditoría
- [x] Crear página `PayrollHistory.tsx`: Acceso a liquidaciones pasadas
- [x] Filtrar por: fecha, cliente, empleado, estado, tipo (liquidación/despido/indemnización)
- [x] Mostrar detalles de cada liquidación (salario, descuentos, neto, etc.)
- [x] Crear página `DismissalHistory.tsx`: Historial de despidos
- [x] Crear página `IndemnificationHistory.tsx`: Historial de indemnizaciones
- [x] Mostrar log de auditoría: qué hizo cada agente, cuándo, por qué

### Fase 6: UI de Descarga y Exportación
- [x] Implementar descarga de liquidaciones en PDF (formato profesional)
- [x] Implementar descarga en Excel (con múltiples hojas: liquidaciones, cargas sociales, resumen)
- [x] Implementar descarga de despidos en PDF
- [x] Implementar descarga de indemnizaciones en PDF
- [x] Generar comprobante de pago (recibo de liquidación)
- [x] Generar declaración jurada de cargas sociales

### Fase 7: Sistema de Supervisión Humana
- [x] Crear página `FailedProcessing.tsx`: Cola de liquidaciones con error
- [x] Mostrar motivo del error y sugerencia de corrección
- [x] Permitir editar datos y reintentar procesamiento
- [x] Mostrar qué hizo el agente y dónde falló
- [x] Crear formulario para corregir manualmente si es necesario
- [x] Registrar correcciones como aprendizaje en ADN

### Fase 8: Optimización para Concurrencia
- [x] Implementar cola de procesamiento (queue) para 100+ liquidaciones
- [x] Usar Heartbeat de Manus para procesamiento en background
- [x] Implementar connection pooling para BD
- [x] Optimizar queries para acceso concurrente
- [x] Implementar caché de ADN para reducir consultas
- [x] Usar WebSocket para actualizaciones en tiempo real (vs polling)
- [x] Implementar rate limiting y throttling de agentes

### Fase 9: Cargas Sociales Completas
- [x] Implementar cálculo de aportes patronales (AFIP, INAMOVILIDAD, etc.)
- [x] Implementar cálculo de retenciones (Impuesto a Ganancias, IVA)
- [x] Implementar cálculo de Seguro de Vida Obligatorio (SVO)
- [x] Implementar cálculo de ART (Aseguradoras de Riesgos del Trabajo)
- [x] Implementar cálculo de Fondo de Desempleo
- [x] Implementar cálculo de Fondo de Garantía de Salarios
- [x] Crear tabla de parámetros de cargas sociales (actualizables)
- [x] Integrar con ADN para aplicar reglas específicas por cliente

### Fase 10: Validación y Pruebas
- [x] Prueba unitaria: Cálculo de liquidación simple
- [x] Prueba unitaria: Cálculo con horas extra
- [x] Prueba unitaria: Cálculo con descuentos
- [x] Prueba unitaria: Cálculo de cargas sociales
- [x] Prueba unitaria: Cálculo de despido e indemnización
- [x] Prueba de integración: Flujo completo de liquidación
- [x] Prueba de carga: 100 liquidaciones simultáneas
- [x] Prueba de carga: 500 liquidaciones en lote
- [x] Validar que no hay pérdida de datos en caso de fallo
- [x] Validar que los cálculos son correctos según LCT y CCT

### Fase 11: Documentación y Entrega
- [x] Documentar API de carga de nóminas
- [x] Documentar formato esperado de archivos (CSV, Excel, JSON)
- [x] Documentar flujo de procesamiento
- [x] Crear guía de usuario para supervisores
- [x] Crear guía de administración del sistema
- [x] Crear guía de troubleshooting

## Notas Técnicas

### Cargas Sociales Incluidas
1. **Aportes Patronales**:
   - AFIP (13%)
   - INAMOVILIDAD (0.75%)
   - Otros según convenio

2. **Retenciones**:
   - Impuesto a Ganancias (variable según salario)
   - IVA (si aplica)
   - Otros según normativa

3. **Seguros**:
   - Seguro de Vida Obligatorio (SVO)
   - ART (según actividad)

4. **Fondos**:
   - Fondo de Desempleo
   - Fondo de Garantía de Salarios

### Escalabilidad
- Usar Heartbeat para procesar liquidaciones en background
- Implementar cola con prioridades (despidos urgentes, liquidaciones normales)
- Connection pooling para BD
- Caché de ADN y parámetros
- WebSocket para actualizaciones en tiempo real

### Robustez
- Reintentos automáticos en caso de fallo de agente
- Transacciones atómicas para garantizar consistencia
- Backup automático de liquidaciones procesadas
- Logging detallado de cada paso
- Alertas a supervisor en caso de error crítico
