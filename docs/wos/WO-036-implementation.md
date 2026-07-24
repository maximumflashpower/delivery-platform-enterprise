# WO-036: Escrow de Patrocinios por Hitos

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `financial-ledger` (principal), `smart-contract`, `payout` (secundarios)

## Endpoints (11)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/financial/milestone-escrows/stats | GET | Stats |
| /api/financial/milestone-escrows | GET | List |
| /api/financial/milestone-escrows/:id | GET | Get by ID |
| /api/financial/milestone-escrows | POST | Create |
| /api/financial/milestone-escrows/:id/fund | POST | Fund escrow |
| /api/financial/milestone-escrows/:id/milestones/submit | POST | Submit milestone |
| /api/financial/milestone-escrows/:id/milestones/approve | POST | Approve & release |
| /api/financial/milestone-escrows/:id/milestones/reject | POST | Reject milestone |
| /api/financial/milestone-escrows/:id/dispute | POST | Raise dispute |
| /api/financial/milestone-escrows/:id/dispute/resolve | POST | Resolve dispute |
| /api/financial/milestone-escrows/:id/refund-partial | PATCH | Partial refund |

## Workflow
CREATE → FUND → (SUBMIT → APPROVE/REJECT)* → DISPUTE → RESOLVE → COMPLETED/REFUNDED
