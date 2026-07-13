# SNISSI - Sistema Operativo Cognitivo Multiagente para Estudios Profesionales

## Fase 1: MVP Payroll Multiagente

### Base de Datos y Esquema
- [x] Crear tabla `payroll_cases` con campos: id, clientId, status (enum), currentStage, createdAt, updatedAt, metadata
- [x] Crear tabla `case_stages` con registro de transiciones: caseId, stage, startedAt, completedAt, notes
- [x] Crear tabla `news_items` (novedades laborales): id, caseId, type, content, source, attachmentUrl, createdAt
- [x] Crear tabla `dna_organizational` (ADN organizacional): id, category, key, value, version, createdAt, updatedAt
- [x] Crear tabla `agent_executions` (trazabilidad de agentes): id, caseId, agentType, input, output, status, timestamp
- [x] Crear tabla `audit_log` (trazabilidad completa): id, caseId, action, actor, details, timestamp
- [x] Crear tabla `human_approvals` (supervisión humana): id, caseId, stage, decision (approve/reject/modify), reasoning, learnedRule, timestamp
- [x] Crear tabla `documents` (almacenamiento de documentos): id, caseId, filename, fileKey, url, documentType, uploadedAt
- [x] Crear tabla `notifications` (notificaciones): id, userId, type, caseId, read, createdAt

### Backend - Routers tRPC
- [x] Crear router `cases`: list, create, getById, updateStatus, transitionStage
- [x] Crear router `news`: create, list, classify, attachDocument
- [x] Crear router `agents`: executeAgent, getAgentStatus, getAgentHistory
- [x] Crear router `dna`: getOrganizationalDNA, updateRule, addPolicy, listCategories
- [x] Crear router `approvals`: submitApproval, recordLearning, getApprovalQueue
- [x] Crear router `documents`: upload, list, getDownloadUrl, delete
- [x] Crear router `audit`: getCaseAuditLog, getSystemAuditLog, exportReport
- [x] Crear router `notifications`: list, markAsRead, getUnreadCount

### Backend - Agentes IA
- [x] Implementar Agente Interpretador Normativo: analiza normativa, detecta cambios, clasifica impacto
- [x] Implementar Agente Preliquidador: calcula conceptos, genera borradores, valida parámetros
- [x] Implementar Agente Auditor: detecta anomalías, compara históricos, valida coherencia
- [x] Implementar Agente Comunicador: procesa novedades, genera alertas, interpreta documentación
- [x] Crear orquestador de agentes: coordina ejecución secuencial/paralela según etapa
- [x] Integrar LLM (Claude/OpenAI): llamadas con context, memory y structured output

### Frontend - Dashboard Principal
- [x] Crear layout principal con sidebar y topbar
- [x] Mostrar métricas: casos activos, agentes en ejecución, anomalías detectadas
- [x] Mostrar estado de agentes en tiempo real (running, idle, error)
- [x] Mostrar casos recientes y próximos a vencer
- [x] Gráficos de progreso por etapa del flujo

### Frontend - Gestión de Casos
- [x] Crear página de lista de casos con filtros (status, stage, cliente)
- [x] Crear formulario de creación de caso
- [x] Crear vista detallada de caso con timeline de etapas
- [x] Mostrar estado actual y permitir transición manual (si aplica)
- [x] Mostrar agentes ejecutándose en el caso

### Frontend - Bandeja de Novedades
- [x] Crear formulario de carga de novedades laborales
- [x] Permitir adjuntar documentos (PDF, Word, etc.)
- [x] Mostrar lista de novedades clasificadas por tipo
- [x] Permitir vincular novedades a casos existentes
- [x] Mostrar clasificación automática (propuesta por agente)

### Frontend - Panel de Supervisión Humana (Human-in-the-Loop)
- [x] Crear cola de aprobaciones pendientes
- [x] Mostrar resultado del agente con razonamiento
- [x] Permitir: aprobar, rechazar, modificar resultado
- [x] Formulario para registrar aprendizaje organizacional
- [x] Mostrar historial de decisiones por caso

### Frontend - ADN Organizacional
- [x] Crear vista de repositorio de reglas y políticas
- [x] Permitir crear/editar reglas (solo admin)
- [x] Mostrar categorías: criterios técnicos, reglas internas, políticas, plantillas
- [x] Permitir buscar y filtrar por categoría
- [x] Mostrar versión y fecha de última actualización

### Frontend - Trazabilidad y Reportes
- [x] Crear vista de log de auditoría por caso
- [x] Mostrar: acción, actor, timestamp, detalles
- [x] Permitir filtrar por rango de fechas y tipo de acción
- [ ] Crear reporte exportable (PDF) con resumen de caso
- [ ] Crear reporte de liquidación (preliquidación + aprobaciones)

### Almacenamiento de Documentos
- [x] Implementar upload de documentos a S3 (via manus-upload-file)
- [x] Guardar referencias en tabla `documents`
- [x] Permitir descargar documentos desde UI
- [x] Validar tipos de archivo permitidos

### Notificaciones
- [x] Implementar notificación cuando agente detecta anomalía
- [x] Implementar notificación cuando caso requiere aprobación humana
- [x] Implementar notificación cuando se completa etapa crítica
- [x] Crear panel de notificaciones en UI
- [x] Integrar con sistema de notificaciones Manus (si aplica)

### Pruebas y Validación
- [x] Escribir tests para routers tRPC principales
- [x] Escribir tests para lógica de agentes
- [x] Escribir tests para transiciones de estado
- [x] Validar flujo end-to-end: crear caso → ejecutar agentes → aprobar → cerrar
- [x] Validar trazabilidad: verificar que todas las acciones se registran

### Documentación y Entrega
- [ ] Documentar API de agentes
- [ ] Documentar estructura del ADN organizacional
- [ ] Crear guía de uso para supervisores
- [ ] Crear guía de administración del sistema
- [ ] Preparar datos de ejemplo/demo

