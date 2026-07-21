# WO-013: Evidencia, Apelaciones y Centro para Víctimas

**Status:** ✅ Implemented  
**Module:** `support-claims` (new)  
**Secondary:** `file-storage`, `audit`  
**Date:** 2026-07-21

## Overview

Complete appeal workflow and victim support case management system.

## Entities

| Entity | Table | Description |
|--------|-------|-------------|
| Appeal | `support_claims_appeals` | Content/account action appeals |
| VictimSupportCase | `support_claims_victim_cases` | Victim support cases |
| AppealEvidence | `support_claims_appeal_evidence` | Evidence uploads for appeals |

## Endpoints

### Appeals (`/api/support-claims/appeals`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Submit appeal |
| GET | `/?claimId=` | List by claim/user |
| GET | `/:id` | Appeal details |
| PATCH | `/:id/status` | Update status |
| POST | `/:id/withdraw` | Withdraw appeal |

### Victim Cases (`/api/support-claims/victim-cases`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Open case |
| GET | `/?userId=` | List cases |
| GET | `/urgent` | Urgent cases |
| GET | `/:id` | Case details |
| POST | `/:id/assign` | Assign agent |
| POST | `/:id/close` | Close case |
| GET | `/stats` | Statistics |

### Evidence (`/api/support-claims/appeals/evidence`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Upload evidence |
| GET | `/?appealId=` | List by appeal |
| GET | `/:id` | Evidence details |
| POST | `/:id/verify` | Verify evidence |
