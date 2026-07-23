# WO-027: Panel de Apelación de Decisiones IA

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `support-claims` (extensión), `ml-pipeline` (secundario: `audit`, `governance`)

## Resumen
Sistema de apelación para decisiones automatizadas por IA, permitiendo revisión humana.

## Endpoints (8)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/support-claims/ia-appeals | GET | List all IA appeals |
| /api/support-claims/ia-appeals/stats | GET | Statistics |
| /api/support-claims/ia-appeals/{id} | GET | Get by ID |
| /api/support-claims/ia-appeals/by-appeal/{appealId} | GET | By appeal ID |
| /api/support-claims/ia-appeals/by-decision/{decisionId} | GET | By decision ID |
| /api/support-claims/ia-appeals | POST | Create |
| /api/support-claims/ia-appeals/{id}/start-review | POST | Start review |
| /api/support-claims/ia-appeals/{id}/complete-review | POST | Complete review |
| /api/support-claims/ia-appeals/{id}/escalate | POST | Escalate to board |

## Smoke Tests ✅ 7/7 passed
