# 📝 WO-005: Capa de Datos y Consentimiento Dinámico

> **Fecha de Implementación**: 2026-07-20  
> **Módulos**: `privacy-consent`, `identity` (secundario: `configuration`)  
> **Estado**: ✅ Completado

---

## 🎯 Objetivos

Sistema completo de gestión de consentimientos GDPR-compliant con registros de procesamiento y preferencias dinámicas por ámbito.

---

## 🏗️ Entidades Creadas

| Entidad | Tabla | Descripción |
|---|---|---|
| `PrivacyConsent` | `privacy_consents` | Consentimientos (data processing, marketing, analytics, biometric, etc.) |
| `DataProcessingRecord` | `data_processing_records` | Registros de actividad de procesamiento de datos |
| `UserDataRequest` | `user_data_requests` | DSAR (Data Subject Access Requests): acceso, rectificación, eliminación |
| `DynamicPreference` | `dynamic_preferences` | Preferencias configurables por scope |

---

## 🔗 Endpoints API (19 nuevos)

### Privacy Consents
| Método | Ruta |
|---|---|
| POST | `/api/privacy-consent/consents/grant` |
| GET | `/api/privacy-consent/consents/user/:userId` |
| GET | `/api/privacy-consent/consents/user/:userId/active` |
| GET | `/api/privacy-consent/consents/:id` |
| POST | `/api/privacy-consent/consents/:id/withdraw` |
| GET | `/api/privacy-consent/consents/check/:userId` |

### Data Processing
| Método | Ruta |
|---|---|
| POST | `/api/privacy-consent/data-processing` |
| GET | `/api/privacy-consent/data-processing/user/:userId` |
| GET | `/api/privacy-consent/data-processing/:id` |
| PATCH | `/api/privacy-consent/data-processing/:id/end` |
| PATCH | `/api/privacy-consent/data-processing/:id/retention` |

### DSAR Requests
| Método | Ruta |
|---|---|
| POST | `/api/privacy-consent/requests/submit` |
| GET | `/api/privacy-consent/requests/user/:userId` |
| GET | `/api/privacy-consent/requests/:id` |
| PATCH | `/api/privacy-consent/requests/:id/start` |
| PATCH | `/api/privacy-consent/requests/:id/complete` |
| PATCH | `/api/privacy-consent/requests/:id/reject` |

### Dynamic Preferences
| Método | Ruta |
|---|---|
| POST | `/api/privacy-consent/preferences/set` |
| GET | `/api/privacy-consent/preferences/user/:userId` |
| GET | `/api/privacy-consent/preferences/user/:userId/key/:key` |
| DELETE | `/api/privacy-consent/preferences/:userId/key/:key` |

---

## 🌱 Seeds

- 8 privacy consents (data processing, marketing, analytics, biometric, location tracking)
- 4 data processing records
- 3 DSAR requests (access, erasure, portability)
- 7 dynamic preferences (language, timezone, notifications, theme, accessibility)

---

## 📊 Stats

| Métrica | Valor |
|---|---|
| Entidades nuevas | 4 |
| Services nuevos | 4 |
| Controllers nuevos | 4 |
| Endpoints API | 20 |
| Seeds | 22 registros |
| WOs totales | 9/75 |

---

## 🔗 Referencias

- **Functions**: SOCIAL-STRONG-021, 118, SOCIAL-MODERN-047, 048, 262, 359, 437, 438
- **Previo**: WO-003
- **Siguiente**: WO-006 (Motor de Interés y Ranking Híbrido)
