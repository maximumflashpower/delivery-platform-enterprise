# WO-021: Modos Sensoriales y Lectura Fácil

**Estado**: ✅ Implementado  
**Fecha**: Julio 2026  
**Módulos**: `accessibility`, `i18n` (secundario: `localization`)

## Resumen

Sistema de accesibilidad universal con perfiles de usuario, modos sensoriales (visual, auditory, motor, cognitive, speech), niveles de severidad, y soporte multilingüe con traducciones.

## Funcionalidades Implementadas

### Modos Sensoriales (Accessibility)
- **Tipos**: visual, auditory, motor, cognitive, speech
- **Niveles**: mild, moderate, severe, profound
- **Profiles**: Configuración personalizada por usuario
- **Settings**: Key-value flexible para ajustes

### Idiomas (i18n)
- **Catálogo**: Soporte completo con códigos ISO
- **Nombres**: DisplayName y nativeName
- **Dirección**: LTR/RTL support
- **Traducciones**: Workflow (pending/reviewed/approved)
- **Versionado**: Control de versiones

## Entidades

- `AccessibilityProfile`: userId, type, level, accommodations
- `AccessibilitySetting`: userId, settingKey, settingValue
- `Language`: code, displayName, nativeName, direction
- `Translation`: translationKeyId, languageId, value, status

## Endpoints (10)

| GET | POST | PUT | DELETE |
|-----|------|-----|--------|
| `/api/accessibility/profiles` | `/api/accessibility/profiles` | `/api/accessibility/profiles/:id` | `/api/accessibility/profiles/:id` |
| `/api/languages` | `/api/languages` | `/api/languages/:id` | `/api/languages/:id` |

## Smoke Test

GET /api/accessibility/profiles → []
GET /api/languages → []
