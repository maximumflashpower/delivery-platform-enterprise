# WO-029: Control de Uso de Voz/Imagen en Modelos

## Resumen
Sistema de consentimiento y control sobre el uso de datos biométricos (voz e imagen) en entrenamiento e inferencia de modelos de IA. Incluye captura de consentimientos, verificación antes de uso, auditoría de usage y catálogo de datos.

## Módulos Afectados
| Rol | Módulo | Endpoints |
|-----|--------|-----------|
| Principal | `privacy-consent` | 6 (biometric consent) |
| Principal | `biometric-security` | 7 (verification & auditing) |
| Secundario | `ml-pipeline` | Integración futura |

## Archivos Creados

### privacy-consent
| Archivo | Descripción |
|---------|-------------|
| `entities/biometric-consent.entity.ts` | Registro de consentimientos biométricos |
| `dto/biometric-consent.dto.ts` | DTOs: GiveConsent, RevokeConsent, CheckConsent |
| `services/biometric-consent.service.ts` | Grant, revoke, check, findByUser, stats |
| `controllers/biometric-consent.controller.ts` | 6 endpoints REST |

### biometric-security
| Archivo | Descripción |
|---------|-------------|
| `entities/biometric-usage-log.entity.ts` | Log de uso de datos biométricos |
| `entities/biometric-data-catalog.entity.ts` | Catálogo de datos biométricos almacenados |
| `dto/biometric-verification.dto.ts` | DTOs: LogUsage, ApproveUsage, DenyUsage, CatalogData |
| `services/biometric-verification.service.ts` | LogUsage, approve, deny, catalog, trackAccess, stats |
| `controllers/biometric-verification.controller.ts` | 7 endpoints REST |

## Endpoints (+13)

### Privacy Consent - Biometric
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/privacy-consent/biometric/stats` | Estadísticas de consentimientos |
| GET | `/api/privacy-consent/biometric/user/{userId}` | Consents por usuario |
| GET | `/api/privacy-consent/biometric/{id}` | Detalle por ID |
| POST | `/api/privacy-consent/biometric/grant` | Otorgar consentimiento |
| POST | `/api/privacy-consent/biometric/revoke` | Revocar consentimiento |
| POST | `/api/privacy-consent/biometric/check` | Verificar si tiene consentimiento válido |

### Biometric Security - Verification & Auditing
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/biometric-security/usage/stats` | Estadísticas de uso |
| GET | `/api/biometric-security/usage/logs` | Listar todos los logs |
| POST | `/api/biometric-security/usage/log` | Registrar uso biométrico |
| POST | `/api/biometric-security/usage/{logId}/approve` | Aprobar uso pendiente |
| POST | `/api/biometric-security/usage/{logId}/deny` | Denegar uso |
| POST | `/api/biometric-security/catalog` | Catalogar dato biométrico |
| POST | `/api/biometric-security/catalog/{catalogId}/track-access` | Trackear acceso |

## Entities

### biometric_consents
- `userId` (UUID) — Usuario que da consentimiento
- `biometricType` — voice | image | facial_features | voice_print | combined
- `status` — given | revoked | expired | pending_verification
- `captureMethod` — self_upload | admin_capture | third_party | api_import
- `usageContext` — research | development | production | testing
- `retentionPeriod` — none | 30_days | 90_days | 1_year | permanent
- `expiresAt` — Fecha de expiración (nullable)

### biometric_usage_logs
- `consentId` (UUID) — Referencia al consentimiento
- `userId` (UUID) — Usuario afectado
- `biometricType` — Tipo de dato biométrico usado
- `operationType` — training | inference | verification | identification | analysis
- `modelId`, `modelName` — Modelo que consumió el dato
- `approvalStatus` — approved | denied | manual_review_required
- `approvedByUserId` — Quién aprobó (nullable)
- `rejectionReason` — Razón de denegación (nullable)

### biometric_data_catalog
- `userId`, `biometricType` — Identificación del dato
- `dataSource` — Origen del dato
- `dataTreatment` — raw | anonymized | pseudonymized | encrypted
- `storageLocation` — Ubicación física/lógica
- `accessCount` — Contador de accesos
- `lastAccessedAt` — Último acceso
- `isDeleted` — Soft delete

## Smoke Tests (9/10 PASADOS)
| Test | Resultado | Datos |
|------|-----------|-------|
| Stats inicial | ✅ | totalConsents: 0 |
| Grant consent | ✅ | ID: 1f799282..., status: given |
| Check consent | ✅ | hasValidConsent: true |
| Find by user | ✅ | Array con 1 consent |
| Log usage | ✅ | ID: 5e9dd97e..., approvalStatus: approved |
| Stats usage | ✅ | totalLogs: 1, byType: {voice: 1} |
| Catalog data | ✅ | ID: dad57846..., dataTreatment: anonymized |
| Track access | ⚠️ | Usó logId en lugar de catalogId (bug del test) |
| Stats post-grant | ✅ | activeConsents: 1 |
| Revoke consent | ✅ | status: revoked |

## Dependencias
- TypeORM (Repository pattern)
- class-validator (@IsUUID, @IsString, @IsIn, @IsOptional)

## Fecha de Implementación
2026-07-22
