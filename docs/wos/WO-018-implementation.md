# WO-018: Control de Usuario sobre Anuncios

**Status:** ✅ Implemented  
**Module:** `ad-control` (privacy-consent, configuration)  
**Secondary:** `governance`  
**Date:** 2026-07-22

## Overview

Sistema de control granular para que los usuarios gestionen sus preferencias publicitarias y consentimiento de anuncios.

## New Modules

| Module | Description |
|--------|-------------|
| `ad-control` | Módulo principal con 3 sub-sistemas |

## New Entities

| Entity | Table | Description |
|--------|-------|-------------|
| AdPreference | `ad_preferences` | Preferencias por categoría de anuncio |
| AdConsentRecord | `ad_consent_records` | Historial de consentimientos publicitarios |
| AdControlSetting | `ad_control_settings` | Configuración global de controles de anuncios |

## New Endpoints

### Ad Preferences (`/api/privacy-consent/ad-preferences`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List preferences (optionally filtered by user/category) |
| GET | `/user/:userId` | Get all preferences for a user |
| GET | `/:id` | Get single preference by ID |
| POST | `/` | Create new preference |
| PATCH | `/:id` | Partially update preference |
| PUT | `/bulk/:userId` | Bulk upsert preferences for a user |
| POST | `/reset/:userId` | Reset all preferences to defaults |
| DELETE | `/:id` | Delete preference |

### Ad Consent Records (`/api/privacy-consent/ad-consents`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List consent records |
| GET | `/user/:userId` | Get all consents for a user |
| GET | `/:id` | Get single consent by ID |
| POST | `/` | Create consent record |
| PATCH | `/:id` | Update consent |
| PATCH | `/:id/revoke` | Revoke consent |
| DELETE | `/:id` | Delete consent record |

### Ad Control Settings (`/api/configuration/ad-controls`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all settings |
| GET | `/key/:key` | Get setting by key |
| GET | `/:id` | Get single setting by ID |
| POST | `/` | Create setting |
| PUT | `/:id` | Update setting |
| PUT | `/key/:key` | Update setting by key |
| DELETE | `/:id` | Delete setting |

## Ad Categories Supported

- `commercial` — Standard commercial advertising
- `political` — Political campaign and issue ads
- `sponsored_content` — Native/sponsored editorial
- `affiliate` — Affiliate marketing content
- `behavioral` — Behavioral/targeted ads
- `contextual` — Context-based matching ads

## Consent Types

- `personalized` — Personalized advertising
- `frequency_capping` — Frequency limits
- `behavioral_targeting` — Behavioral profiling
- `third_party_sharing` — Data sharing with partners

## Total Endpoints Added

**8 + 7 + 7 = 22 endpoints** across 3 controllers

## Files Created

src/modules/ad-control/ ├── ad-control.constants.ts ├── ad-control.module.ts ├── controllers/ │ ├── ad-preference.controller.ts │ ├── ad-consent.controller.ts │ └── ad-control-setting.controller.ts ├── dto/ │ ├── bulk-update-ad-preference.dto.ts │ ├── create-ad-consent-record.dto.ts │ ├── create-ad-control-setting.dto.ts │ ├── create-ad-preference.dto.ts │ ├── update-ad-consent-record.dto.ts │ ├── update-ad-control-setting.dto.ts │ └── update-ad-preference.dto.ts ├── entities/ │ ├── ad-consent-record.entity.ts │ ├── ad-control-setting.entity.ts │ └── ad-preference.entity.ts └── services/ ├── ad-consent.service.ts ├── ad-control-setting.service.ts └── ad-preference.service.ts

## Integration Points

- Registered in `app.module.ts` as `AdControlModule`
- Works alongside `PrivacyConsentModule` for unified consent management
- Integrates with `Configuration` module for global settings
