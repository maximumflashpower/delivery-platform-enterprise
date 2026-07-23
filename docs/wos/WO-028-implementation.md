# WO-028: Marcado de Contenido Sintético por Nivel

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `ml-pipeline`, `governance` (secundario: `trust-safety`)

## Resumen
Sistema de marcado y detección de contenido sintético generado por IA, con políticas de gobernanza para diferentes niveles de transparencia.

## Endpoints (15)

### Governance — Synthetic Content Policies (8)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/governance/synthetic-content/policies | GET | List policies |
| /api/governance/synthetic-content/policies/active | GET | Active policies |
| /api/governance/synthetic-content/policies/stats | GET | Policy stats |
| /api/governance/synthetic-content/policies/evaluate | POST | Evaluate content |
| /api/governance/synthetic-content/policies | POST | Create policy |
| /api/governance/synthetic-content/policies/{id} | GET | Get policy |
| /api/governance/synthetic-content/policies/{id}/activate | POST | Activate |
| /api/governance/synthetic-content/policies/{id}/deactivate | POST | Deactivate |

### ML Pipeline — Synthetic Content Marking (7)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/ml-pipeline/synthetic-content | GET | List markings |
| /api/ml-pipeline/synthetic-content/stats | GET | Marking stats |
| /api/ml-pipeline/synthetic-content/apply | POST | Apply watermark |
| /api/ml-pipeline/synthetic-content/detect | POST | Detect watermark |
| /api/ml-pipeline/synthetic-content/content/{contentId} | GET | Markings by content |
| /api/ml-pipeline/synthetic-content/{id} | GET | Get marking |
| /api/ml-pipeline/synthetic-content/{id}/flag | POST | Flag suspicious |
| /api/ml-pipeline/synthetic-content/{id}/remove | POST | Remove marking |

## Smoke Tests ✅
