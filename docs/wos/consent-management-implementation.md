WO-021: Consentimiento y Preferencias del Usuario (Consent Management Panel)

Estado: ✅ Implementado
Fecha: Julio 2026
Módulos: consent-management (nuevo)

    Nota: Originalmente WO-021 se definía como "Modos Sensoriales y Lectura Fácil". Esta implementación corresponde al sistema centralizado de gestión de consentimientos GDPR que complementa WO-005 y WO-018.

Resumen

Sistema centralizado para gestión de consents (GDPR), preferencias de usuario y notificaciones, con auditoría completa y histórico de cambios.
Componentes
Entidades (4)

    Consent: Registros de consentimiento con estado, propósito, versión
    UserPreference: Preferencias flexibles (categorías y claves arbitrarias)
    NotificationPreference: Configuración por canal (email/push/SMS)
    ConsentHistory: Audit trail completo de todos los cambios

Enums (6)

    ConsentStatus: granted, revoked, expired, pending
    ConsentMethod: web_form, api, mobile_app, physical
    PreferenceCategory: communications, privacy, marketing, etc.
    NotificationChannel: email, push, sms, in_app
    FrequencySettings: immediate, hourly, daily, weekly
    HistoryActionType: grant, revoke, update, expire

DTOs (7)

    GrantConsentDto, RevokeConsentDto
    SetUserPreferenceDto, BulkPreferenceUpdateDto
    SetNotificationPreferenceDto
    ListConsentsQueryDto

Endpoints (14)
Método	Endpoint	Descripción
GET	/api/consent-management/stats	Estadísticas globales
POST	/api/consent-management/consents/grant	Otorgar consentimiento
POST	/api/consent-management/consents/{id}/revoke	Revocar consentimiento
GET	/api/consent-management/consents	Listar consentimientos
GET	/api/consent-management/consents/{id}	Detalle específico
GET	/api/consent-management/consents/active	Solo activos
GET	/api/consent-management/consents/{id}/history	Histórico
POST	/api/consent-management/preferences	Set preferencia única
POST	/api/consent-management/preferences/bulk	Set múltiple
GET	/api/consent-management/preferences/{category}/{key}	Obtener preferencia
DELETE	/api/consent-management/preferences/{category}/{key}	Eliminar
POST	/api/consent-management/notifications	Set notificación
GET	/api/consent-management/notifications	Listar notificaciones
GET	/api/consent-management/notifications/check	Verificar permiso
Características Técnicas

    SQLite Compatible: Todos los tipos compatibles (varchar, datetime, json)
    Type Safe: Strict TypeScript con type assertions donde necesario
    Audit Trail: Historial completo de cambios de consentimiento
    Soft Deletes: Preferencias con lógica de eliminación segura
    Default Values: Preferencias con fallback si no existen

Smoke Test Exitoso
POST /api/consent-management/consents/grant
→ { "id": "...", "status": "granted", "purpose": "marketing" }

POST /api/consent-management/preferences
→ { "id": "...", "category": "communications", "key": "email_frequency" }

GET /api/consent-management/stats
→ { "totalConsents": 1, "grantedConsents": 1, ... }

