# WO-033: Centro de Riesgo Sistémico de la Plataforma

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `analytics-observability` (principal), `trust-safety`, `audit` (secundarios)

## Resumen
Sistema centralizado para monitorear, detectar y gestionar riesgos sistémicos en la plataforma mediante indicadores, correlaciones y gestión de incidentes.

## Entidades (3)
- `SystemicRiskIndicator` — Indicadores de riesgo (financial, operational, security, etc.)
- `RiskCorrelation` — Relaciones causales entre indicadores
- `RiskIncident` — Incidentes activados por indicadores

## Endpoints (15)

### Indicators (11)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/analytics/systemic-risk/indicators | GET | List indicators |
| /api/analytics/systemic-risk/indicators/stats | GET | Get systemic risk stats |
| /api/analytics/systemic-risk/indicators/:id | GET | Get indicator |
| /api/analytics/systemic-risk/indicators | POST | Create indicator |
| /api/analytics/systemic-risk/indicators/:id | PATCH | Update indicator |
| /api/analytics/systemic-risk/indicators/:id/acknowledge | POST | Acknowledge indicator |
| /api/analytics/systemic-risk/indicators/:id/resolve | POST | Resolve with mitigation plan |

### Correlations (3)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/analytics/systemic-risk/correlations | GET | List correlations |
| /api/analytics/systemic-risk/correlations/indicator/:indicatorId | GET | Correlations by indicator |
| /api/analytics/systemic-risk/correlations | POST | Create correlation |

### Incidents (4)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/analytics/systemic-risk/incidents | GET | List incidents |
| /api/analytics/systemic-risk/incidents/:id | GET | Get incident |
| /api/analytics/systemic-risk/incidents | POST | Create incident |
| /api/analytics/systemic-risk/incidents/:id/investigate | POST | Start investigating |
| /api/analytics/systemic-risk/incidents/:id/resolve | POST | Resolve incident |

## Smoke Tests ✅
- CREATE indicator → ACKNOWLEDGE → UPDATE → RESOLVE
- CREATE second indicator + correlation (causal, 0.78 coefficient)
- CREATE incident → INVESTIGATE → RESOLVE
- Stats tracking all operations

## Enums
- `IndicatorCategory`: financial, operational, security, compliance, reputation, platform
- `IndicatorSeverity`: info, low, medium, high, critical
- `IndicatorTrend`: improving, stable, worsening, volatile
- `IndicatorStatus`: active, acknowledged, resolved, archived
- `CorrelationType`: positive, negative, causal, spurious
- `IncidentStatus`: detected, investigating, mitigating, resolved, closed
