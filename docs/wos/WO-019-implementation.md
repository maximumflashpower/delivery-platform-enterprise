# WO-019: Portal DSAR y Borrado Selectivo

**Estado**: ✅ Implementado  
**Fecha**: Julio 2026  
**Módulos**: `privacy-consent`, `identity` (secundario: `audit`)

## Resumen

Implementación del Data Subject Access Request (DSAR) portal para cumplir con GDPR y regulaciones similares de privacidad.

## Funcionalidades

- **Portal DSAR**: Interfaz para que usuarios soliciten exportación completa de sus datos
- **Borrado Selectivo**: Usuarios pueden elegir qué datos eliminar (vs. borrado completo)
- **Request Workflow**: Estado de las solicitudes DSAR (pending/in-progress/completed/rejected)
- **Data Export**: Generación de exportaciones estructuradas en formato JSON/CSV
- **Audit Trail**: Registro completo de todas las acciones DSAR para compliance

## Endpoints Implementados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/privacy-consent/requests/submit` | Nueva solicitud DSAR |
| GET | `/api/privacy-consent/requests/user/{userId}` | Listar solicitudes por usuario |
| GET | `/api/privacy-consent/requests/{id}` | Detalle de solicitud específica |
| POST | `/api/privacy-consent/requests/{id}/start` | Iniciar procesamiento |
| POST | `/api/privacy-consent/requests/{id}/complete` | Completar exportación |
| POST | `/api/privacy-consent/requests/{id}/reject` | Rechazar solicitud |

## Entidades TypeORM

- `DsarRequest`: Solicitudes DSAR con estado, fechas, y metadata

## Integración

- Registrado en `app.module.ts` como `DsarPortalModule`
- Conecta con `identity` para obtener datos de usuario
- Conecta con `audit` para registro de compliance

## Smoke Test Exitoso

json GET /api/privacy-consent/requests/user/{userId} → [] (vacío, listo para uso)

