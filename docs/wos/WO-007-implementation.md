# WO-007: Controles de Usuario y Explicabilidad

**Status:** ✅ Implemented  
**Module:** `identity` (new)  
**Secondary:** `governance`, `audit`  
**Date:** 2026-07-21

## Overview

Implements user-facing controls for data privacy, AI decision transparency, and audit trails for all control changes.

## Entities

| Entity | Table | Description |
|--------|-------|-------------|
| UserControl | `identity_user_controls` | User privacy/control settings |
| ExplainabilityRecord | `identity_explainability_records` | Explanations for algorithmic decisions |
| ControlAuditLog | `identity_control_audit_logs` | Audit trail of control changes |

## API Endpoints

### User Controls (`/api/identity/controls`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a user control |
| GET | `/?userId=` | List controls for a user |
| GET | `/:id` | Get control details |
| PATCH | `/:id` | Update control |
| POST | `/:id/enable` | Enable control |
| POST | `/:id/disable` | Disable control |
| DELETE | `/:id` | Revoke control |
| GET | `/:id/audit` | Get audit trail |

### Explainability (`/api/identity/explainability`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create explainability record |
| GET | `/?userId=&limit=` | List records for user |
| GET | `/:id` | Get record details |
| POST | `/:id/review` | Review a record |
| POST | `/:id/dispute` | Dispute a record |
| POST | `/:id/rate` | Rate a record (0-5) |
| GET | `/decision/:type` | Get records by decision type |

## Files Created

src/modules/identity/ ├── entities/ │ ├── user-control.entity.ts │ ├── explainability-record.entity.ts │ └── control-audit-log.entity.ts ├── dto/ │ ├── create-user-control.dto.ts │ ├── update-user-control.dto.ts │ └── create-explainability.dto.ts ├── services/ │ ├── user-control.service.ts │ └── explainability.service.ts ├── controllers/ │ ├── user-control.controller.ts │ └── explainability.controller.ts └── identity.module.ts
