# WO-040: Seguro/Protección de Ingresos con Partner

**Estado**: ✅ Implementado  
**Fecha**: 2026-07-24  
**Módulos**: `financial-ledger` (principal), `smart-contract` (secundario)

## Resumen
Sistema de protección de ingresos para merchants mediante pólizas con partners aseguradores. Incluye filing de claims, review workflow, deductibles, waiting periods y payout.

## Entidades (2)
1. **IncomeProtectionPolicy** - Póliza con coverage, premiums, deductible, waiting period
2. **ProtectionClaim** - Claims con workflow: filed → reviewed → approved/denied → paid

## Endpoints (14)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/financial/income-protection/stats` | Estadísticas |
| POST | `/api/financial/income-protection/policies` | Crear póliza |
| GET | `/api/financial/income-protection/policies` | Listar pólizas |
| GET | `/api/financial/income-protection/policies/:id` | Detalle |
| POST | `/api/financial/income-protection/policies/:id/activate` | Activar |
| POST | `/api/financial/income-protection/policies/:id/suspend` | Suspender |
| POST | `/api/financial/income-protection/policies/:id/cancel` | Cancelar |
| PATCH | `/api/financial/income-protection/policies/:id/status` | Cambiar estado |
| POST | `/api/financial/income-protection/policies/:id/claims` | File claim |
| GET | `/api/financial/income-protection/policies/:id/claims` | Listar claims |
| GET | `/api/financial/income-protection/claims/:id` | Detalle claim |
| POST | `/api/financial/income-protection/claims/:id/review` | Review claim |
| POST | `/api/financial/income-protection/claims/:id/pay` | Pagar claim |
| DELETE | `/api/financial/income-protection/policies/:id` | Eliminar |

## Workflow
DRAFT → ACTIVE → (file claim) → REVIEW → APPROVED/DENIED → PAID
