# SNISSI - Rediseño de Interfaz: Centro de Control Moderno

## Fase 1: Dashboard Principal Rediseñado
- [ ] Crear nuevo Home.tsx como Centro de Control
- [ ] Diseñar tarjetas de áreas (Liquidación, Impuestos, Auditoría, Contabilidad, Economía)
- [ ] Mostrar estado de cada área: tareas pendientes, agentes activos, progreso
- [ ] Mostrar alertas/anomalías detectadas por agentes
- [ ] Diseño moderno, estético, llamativo con gradientes y animaciones

## Fase 2: Panel de Agentes Activos
- [ ] Crear página AgentsPanel.tsx
- [ ] Mostrar lista de agentes: nombre, área, tarea actual, progreso, tiempo estimado
- [ ] Actualización en tiempo real
- [ ] Hacer clic en agente para ver detalles/historial
- [ ] Indicadores visuales de estado (activo, idle, error)

## Fase 3: Interfaz de Diálogo con Agentes
- [ ] Crear componente ChatWithAgent.tsx (chat bidireccional)
- [ ] Crear componente TaskPanel.tsx (tareas con respuestas)
- [ ] Integrar ambas en una interfaz unificada
- [ ] Mostrar historial de conversaciones
- [ ] Permitir enviar instrucciones y recibir respuestas de agentes

## Fase 4: Sistema de Designación de Tareas
- [ ] Crear componente TaskAssignment.tsx
- [ ] Implementar arrastrar-soltar de tareas entre áreas
- [ ] Crear formulario de "Nueva Tarea" con campos: área, tipo, descripción, agentes
- [ ] Validar y enviar tareas a la cola
- [ ] Mostrar confirmación y asignación

## Fase 5: Personalización de Workspace
- [ ] Crear página Settings.tsx para personalización
- [ ] Permitir configurar: tema, densidad de información, widgets visibles
- [ ] Guardar preferencias por usuario
- [ ] Aplicar preferencias en todas las vistas
- [ ] Opción de "Resetear a default"

## Fase 6: Integración Completa
- [ ] Actualizar App.tsx con nuevas rutas
- [ ] Crear layout principal que integre todas las vistas
- [ ] Asegurar navegación fluida entre secciones
- [ ] Sincronizar estado global (Redux/Context)
- [ ] Pruebas de flujo completo

## Fase 7: Pruebas y Ajustes Finales
- [ ] Pruebas visuales en diferentes dispositivos
- [ ] Ajustes de diseño según feedback
- [ ] Optimizar performance
- [ ] Crear checkpoint final
