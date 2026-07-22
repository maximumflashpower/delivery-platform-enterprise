# WO-019: Portal DSAR y Borrado Selectivo

## Fecha
2026-07-22

## Resumen
Implementación del portal DSAR (Data Subject Access Request) con capacidades de borrado selectivo y exportación de datos.

## Nuevos Endpoints (17)
| Método | Path | Descripción |
|--------|------|-------------|
| POST | /api/dsar-portal/requests | Crear solicitud DSAR |
| GET | /api/dsar-portal/requests | Listar solicitudes |
| GET | /api/dsar-portal/requests/{id} | Obtener solicitud |
| PATCH | /api/dsar-portal/requests/{id}/status | Actualizar estado |
| GET | /api/dsar-portal/requests/user/{userId} | Solicitudes por usuario |
| POST | /api/dsar-portal/deletion-scopes | Crear scope de borrado |
| GET | /api/dsar-portal/deletion-scopes/{requestId} | Scopes por solicitud |
| PATCH | /api/dsar-portal/deletion-scopes/{id} | Actualizar scope |
| DELETE | /api/dsar-portal/deletion-scopes/{id} | Eliminar scope |
| POST | /api/dsar-portal/deletion-scopes/{id}/execute | Ejecutar borrado |
| POST | /api/dsar-portal/export-jobs | Crear job de export |
| GET | /api/dsar-portal/export-jobs/{id} | Estado del job |
| GET | /api/dsar-portal/export-jobs/request/{requestId} | Jobs por solicitud |
| POST | /api/dsar-portal/export-jobs/{id}/generate | Generar export |
| GET | /api/dsar-portal/export-jobs/{id}/download | Descargar export |
| GET | /api/dsar-portal/stats | Estadísticas |

## Nuevas Entidades (3)
1. **DsarRequest** - Solicitudes DSAR con workflow de estados
2. **DeletionScope** - Alcances de borrado selectivo por categoría
3. **DataExportJob** - Jobs de exportación de datos

## Integraciones
- **privacy-consent**: Referencia UserDataRequest existente
- **identity**: Verificación de identidad requerida
- **audit**: Trazabilidad de operaciones

## Cumplimiento GDPR
- Art. 15: Right of access
- Art. 16: Right to rectification
- Art. 17: Right to erasure (right to be forgotten)
- Art. 20: Right to data portability
- Art. 21: Right to object

## Estado
✅ Implementado y funcional
