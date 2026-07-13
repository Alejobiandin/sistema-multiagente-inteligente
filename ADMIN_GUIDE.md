# Guía de Administración - SNISSI

## Introducción

Esta guía está dirigida a administradores del sistema SNISSI. Cubre configuración, mantenimiento, gestión de usuarios y resolución de problemas.

## Acceso de Administrador

### Requisitos
- Rol de usuario: `admin`
- Acceso a la base de datos (para operaciones avanzadas)
- Acceso al panel de administración

### Cómo Promover un Usuario a Admin

1. Acceder a la base de datos
2. Ejecutar:
```sql
UPDATE users SET role = 'admin' WHERE openId = 'user-open-id';
```

## Gestión del ADN Organizacional

### Agregar Nuevas Reglas

1. Ir a **ADN Organizacional** en el menú principal
2. Hacer clic en **Nueva Regla**
3. Seleccionar categoría:
   - **POLICY**: Directrices generales
   - **RULE**: Normas específicas
   - **CRITERION**: Estándares de validación
   - **TEMPLATE**: Plantillas reutilizables
   - **LEARNING**: Aprendizajes de supervisión
   - **BEST_PRACTICE**: Mejores prácticas

4. Ingresar clave y valor
5. Guardar

### Importancia del ADN

El ADN es la "memoria" del sistema. Cuanto mejor documentado esté:
- Más precisos serán los agentes
- Menos intervención humana será necesaria
- Mejor será el aprendizaje organizacional

### Categorías Recomendadas

| Categoría | Ejemplo | Propósito |
|-----------|---------|----------|
| POLICY | SALARY_POLICY_2026 | Políticas salariales vigentes |
| RULE | OVERTIME_CALCULATION | Cómo calcular conceptos |
| CRITERION | ANOMALY_THRESHOLD | Umbrales de validación |
| TEMPLATE | PAYROLL_REPORT_TEMPLATE | Plantillas de documentos |
| LEARNING | REJECTED_CALCULATION_CASE_123 | Decisiones humanas |
| BEST_PRACTICE | DOCUMENT_VALIDATION_PROCESS | Procesos probados |

## Gestión de Casos

### Estados de Caso

- **ACTIVE**: Caso en procesamiento
- **COMPLETED**: Caso finalizado
- **PAUSED**: Caso pausado (requiere intervención)
- **ARCHIVED**: Caso archivado

### Transiciones de Etapa

El flujo es lineal y no permite saltar etapas:

```
COLLECTION → ANALYSIS → PRE_LIQUIDATION → AUDIT → APPROVAL → EMISSION → PRESENTATION → CLOSED
```

Para pausar un caso en cualquier etapa, contactar al supervisor.

### Archivado de Casos

Los casos se archivan automáticamente 90 días después de cerrados. Para recuperar un caso archivado:

1. Ir a **Gestión de Casos**
2. Filtrar por estado ARCHIVED
3. Hacer clic en el caso
4. Seleccionar **Recuperar de Archivo**

## Supervisión Humana

### Panel de Aprobaciones

El panel muestra:
- Casos pendientes de aprobación
- Resultado del agente
- Razonamiento del agente
- Opciones: Aprobar, Rechazar, Modificar

### Registrar Aprendizaje

Al rechazar o modificar un resultado:

1. Explicar el motivo en el campo **Razonamiento**
2. Opcionalmente, crear una nueva regla en el ADN
3. Guardar

Esta información se convierte automáticamente en aprendizaje organizacional.

## Gestión de Documentos

### Almacenamiento

Los documentos se almacenan en S3 con referencias en la base de datos.

### Tipos de Documento Soportados

- PDF
- Word (.docx)
- Excel (.xlsx)
- Imágenes (JPG, PNG)
- Texto (.txt)

### Límite de Tamaño

- Máximo por archivo: 50 MB
- Máximo por caso: 500 MB

### Descarga de Documentos

Los documentos pueden descargarse desde:
1. Detalle del caso → Pestaña Documentos
2. Bandeja de Novedades → Documento adjunto

## Notificaciones

### Tipos de Notificación

1. **ANOMALY_DETECTED**: Agente detectó anomalía
2. **APPROVAL_REQUIRED**: Caso requiere aprobación humana
3. **STAGE_COMPLETED**: Etapa completada
4. **AGENT_ERROR**: Error en ejecución de agente

### Configuración de Notificaciones

Las notificaciones se envían automáticamente al propietario del proyecto. Para cambiar:

1. Ir a **Configuración** → **Notificaciones**
2. Seleccionar tipos de notificación a recibir
3. Guardar

## Auditoría y Reportes

### Log de Auditoría

Cada acción en el sistema se registra:
- Quién realizó la acción
- Qué acción se realizó
- Cuándo se realizó
- Detalles de la acción

### Acceso a Auditoría

1. Ir a **Detalle del Caso**
2. Pestaña **Auditoría**
3. Ver timeline completo

### Exportar Auditoría

Para exportar el log de auditoría de un caso:

1. Ir a **Detalle del Caso**
2. Pestaña **Auditoría**
3. Hacer clic en **Exportar como PDF**

## Mantenimiento

### Backup de Base de Datos

Se recomienda realizar backups diarios. El sistema Manus realiza backups automáticos.

### Limpieza de Datos Antiguos

Los casos se archivan automáticamente después de 90 días. Los datos archivados se pueden recuperar durante 1 año.

### Monitoreo de Rendimiento

Monitorear regularmente:
- Tiempo de ejecución de agentes (debe ser < 5 segundos)
- Tasa de error de agentes (debe ser < 5%)
- Número de casos en cola

## Resolución de Problemas

### Agente No Responde

1. Verificar conexión a Internet
2. Revisar logs del servidor
3. Reintentar manualmente
4. Si persiste, contactar soporte

### Caso Atascado en Etapa

1. Verificar si hay errores de agente
2. Revisar notificaciones
3. Si es necesario, pausar caso y contactar soporte

### Documentos No Se Descargan

1. Verificar que el documento existe en S3
2. Verificar permisos de acceso
3. Intentar descargar desde navegador diferente
4. Si persiste, contactar soporte

### Notificaciones No Se Reciben

1. Verificar configuración de notificaciones
2. Verificar que el email sea correcto
3. Revisar carpeta de spam
4. Si persiste, contactar soporte

## Seguridad

### Contraseñas

- No compartir credenciales
- Cambiar contraseña regularmente
- Usar contraseñas fuertes

### Acceso a Datos Sensibles

- Solo administradores pueden acceder a la BD
- Todos los accesos se registran en auditoría
- Cumplir con políticas de privacidad

### Backup de Datos

- Los datos se respaldan automáticamente
- Mantener copias en ubicación segura
- Probar restauración regularmente

## Contacto de Soporte

Para reportar problemas o solicitar asistencia:
- Email: support@snissi.local
- Teléfono: +1-XXX-XXX-XXXX
- Portal: https://support.snissi.local

## Cambios Recientes

### Versión 1.0.0 (Actual)

- Lanzamiento inicial del sistema
- 4 agentes IA implementados
- Panel de supervisión humana
- ADN organizacional
- Trazabilidad completa
- Notificaciones automáticas
