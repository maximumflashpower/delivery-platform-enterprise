# WO-012: Cola de Moderación y Códigos de Razón

**Status:** ✅ Implemented  
**Module:** `trust-safety` (extended)  
**Secondary:** `audit`, `support-claims`  
**Date:** 2026-07-21

## Overview

Automated content moderation workflow with configurable reason codes and prioritization.

## New Entities

| Entity | Table | Description |
|--------|-------|-------------|
| ModerationQueueItem | `trust_safety_moderation_queue` | Items awaiting review |
| ReasonCode | `trust_safety_reason_codes` | Predefined violation categories |

## New Endpoints

### Moderation Queue (`/api/trust-safety/moderation`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/report` | Report content |
| GET | `/queue` | Get queue items |
| GET | `/:id` | Item details |
| PATCH | `/:id/status` | Update status |
| POST | `/:id/escalate` | Escalate review |
| GET | `/stats` | Queue statistics |

### Reason Codes (`/api/trust-safety/reasons`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create reason code |
| GET | `/` | List reason codes |
| GET | `/:id` | Code details |
| GET | `/code/:code` | By code value |
| DELETE | `/:id` | Deactivate code |

## Features

- **Priority-based queue**: Items sorted by priority weight + age
- **Configurable reason codes**: 5 pre-defined codes with severity levels
- **Auto-actions**: Automatic flagging/removal based on reason
- **Statistics tracking**: Pending, in-review, resolved counts
