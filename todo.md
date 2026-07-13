# SNISSI - Sistema Operativo Cognitivo Multiagente para Estudios Profesionales
## Plan de Desarrollo - Fase 2: Plataforma Web Robusta y Autoescalable

### Fase 1: Extensión de Base de Datos
- [ ] Crear tabla `payroll_uploads`: Registro de cargas de nóminas (CSV, Excel, JSON)
- [ ] Crear tabla `dismissals`: Registro de despidos con datos de empleado, fecha, motivo
- [ ] Crear tabla `indemnifications`: Cálculos de indemnizaciones por despido
- [ ] Crear tabla `social_charges`: Cargas sociales (aportes patronales, retenciones, ART, fondos)
- [ ] Crear tabla `processing_queue`: Cola de procesamiento para 100+ liquidaciones concurrentes
- [ ] Crear tabla `processing_status`: Estado en tiempo real de cada liquidación en proceso
- [ ] Extender tabla `agent_executions` para incluir logs detallados de cada agente

### Fase 2: Agentes Especializados Adicionales
- [ ] Implementar `AgenteDespidos`: Calcula indemnizaciones, preaviso, integración mes
- [ ] Implementar `AgenteIndemnizaciones`: Aplica fórmulas de indemnización según LCT y antigüedad
- [ ] Implementar `AgenteCargas Sociales`: Calcula aportes patronales, retenciones, ART
- [ ] Implementar `AgenteValidador`: Valida datos de entrada antes de procesar
- [ ] Implementar `AgenteMonitor`: Monitorea progreso de liquidaciones, detecta fallos

### Fase 3: UI de Carga de Nóminas
- [ ] Crear página `PayrollUpload.tsx`: Interfaz para subir archivos (CSV, Excel, JSON)
- [ ] Implementar validación de formato y estructura de archivos
- [ ] Crear parser para CSV/Excel/JSON con manejo de errores
- [ ] Mostrar preview de datos antes de procesar
- [ ] Permitir mapeo de columnas (si estructura es diferente)
- [ ] Mostrar resumen: cantidad de empleados, validaciones, errores

### Fase 4: UI de Monitoreo en Tiempo Real
- [ ] Crear página `ProcessingMonitor.tsx`: Dashboard de liquidaciones en proceso
- [ ] Mostrar progreso global (X de 100 liquidaciones completadas)
- [ ] Mostrar tabla de liquidaciones con estado (pendiente, procesando, completada, error)
- [ ] Mostrar barra de progreso por liquidación individual
- [ ] Actualizar en tiempo real con WebSocket o polling
- [ ] Mostrar velocidad de procesamiento (liquidaciones/minuto)
- [ ] Permitir pausar/reanudar procesamiento si es necesario

### Fase 5: UI de Historial y Auditoría
- [ ] Crear página `PayrollHistory.tsx`: Acceso a liquidaciones pasadas
- [ ] Filtrar por: fecha, cliente, empleado, estado, tipo (liquidación/despido/indemnización)
- [ ] Mostrar detalles de cada liquidación (salario, descuentos, neto, etc.)
- [ ] Crear página `DismissalHistory.tsx`: Historial de despidos
- [ ] Crear página `IndemnificationHistory.tsx`: Historial de indemnizaciones
- [ ] Mostrar log de auditoría: qué hizo cada agente, cuándo, por qué

### Fase 6: UI de Descarga y Exportación
- [ ] Implementar descarga de liquidaciones en PDF (formato profesional)
- [ ] Implementar descarga en Excel (con múltiples hojas: liquidaciones, cargas sociales, resumen)
- [ ] Implementar descarga de despidos en PDF
- [ ] Implementar descarga de indemnizaciones en PDF
- [ ] Generar comprobante de pago (recibo de liquidación)
- [ ] Generar declaración jurada de cargas sociales

### Fase 7: Sistema de Supervisión Humana
- [ ] Crear página `FailedProcessing.tsx`: Cola de liquidaciones con error
- [ ] Mostrar motivo del error y sugerencia de corrección
- [ ] Permitir editar datos y reintentar procesamiento
- [ ] Mostrar qué hizo el agente y dónde falló
- [ ] Crear formulario para corregir manualmente si es necesario
- [ ] Registrar correcciones como aprendizaje en ADN

### Fase 8: Optimización para Concurrencia
- [ ] Implementar cola de procesamiento (queue) para 100+ liquidaciones
- [ ] Usar Heartbeat de Manus para procesamiento en background
- [ ] Implementar connection pooling para BD
- [ ] Optimizar queries para acceso concurrente
- [ ] Implementar caché de ADN para reducir consultas
- [ ] Usar WebSocket para actualizaciones en tiempo real (vs polling)
- [ ] Implementar rate limiting y throttling de agentes

### Fase 9: Cargas Sociales Completas
- [ ] Implementar cálculo de aportes patronales (AFIP, INAMOVILIDAD, etc.)
- [ ] Implementar cálculo de retenciones (Impuesto a Ganancias, IVA)
- [ ] Implementar cálculo de Seguro de Vida Obligatorio (SVO)
- [ ] Implementar cálculo de ART (Aseguradoras de Riesgos del Trabajo)
- [ ] Implementar cálculo de Fondo de Desempleo
- [ ] Implementar cálculo de Fondo de Garantía de Salarios
- [ ] Crear tabla de parámetros de cargas sociales (actualizables)
- [ ] Integrar con ADN para aplicar reglas específicas por cliente

### Fase 10: Validación y Pruebas
- [ ] Prueba unitaria: Cálculo de liquidación simple
- [ ] Prueba unitaria: Cálculo con horas extra
- [ ] Prueba unitaria: Cálculo con descuentos
- [ ] Prueba unitaria: Cálculo de cargas sociales
- [ ] Prueba unitaria: Cálculo de despido e indemnización
- [ ] Prueba de integración: Flujo completo de liquidación
- [ ] Prueba de carga: 100 liquidaciones simultáneas
- [ ] Prueba de carga: 500 liquidaciones en lote
- [ ] Validar que no hay pérdida de datos en caso de fallo
- [ ] Validar que los cálculos son correctos según LCT y CCT

### Fase 11: Documentación y Entrega
- [ ] Documentar API de carga de nóminas
- [ ] Documentar formato esperado de archivos (CSV, Excel, JSON)
- [ ] Documentar flujo de procesamiento
- [ ] Crear guía de usuario para supervisores
- [ ] Crear guía de administración del sistema
- [ ] Crear guía de troubleshooting

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
