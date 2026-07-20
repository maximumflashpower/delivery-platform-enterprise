# 📝 WO-006: Motor de Interés y Ranking Híbrido

> **Fecha de Implementación**: 2026-07-20  
> **Módulos**: `search`, `analytics`, `ml-pipeline`  
> **Estado**: ✅ Completado

---

## 🎯 Objetivos

Sistema de ranking híbrido que combina filtrado colaborativo, señales de contenido, popularidad, recencia y personalización para generar recomendaciones.

---

## 🏗️ Entidades Creadas

| Entidad | Tabla | Módulo | Descripción |
|---|---|---|---|
| `InterestSignal` | `interest_signals` | search | Señales de interés de usuarios (views, clicks, purchases, ratings) |
| `RankingModel` | `ranking_models` | search | Modelos de ranking con pesos configurables por estrategia |
| `RankingResult` | `ranking_results` | search | Resultados de ranking con scores desglosados y explicación |
| `RankingMetric` | `ranking_metrics` | analytics | Métricas de performance (CTR, NDCG, precision, conversion) |

---

## 🔗 Endpoints API (16 nuevos)

### Interest Signals
| Método | Ruta |
|---|---|
| POST | `/api/search/interest-signals/record` |
| GET | `/api/search/interest-signals/user/:userId` |
| GET | `/api/search/interest-signals/entity/:entityId` |
| GET | `/api/search/interest-signals/profile/:userId` |

### Ranking Engine
| Método | Ruta |
|---|---|
| POST | `/api/search/ranking/models` |
| GET | `/api/search/ranking/models` |
| GET | `/api/search/ranking/models/:id` |
| PATCH | `/api/search/ranking/models/:id` |
| POST | `/api/search/ranking/models/:id/activate` |
| POST | `/api/search/ranking/rank` |
| GET | `/api/search/ranking/history/:userId` |
| GET | `/api/search/ranking/top/:userId` |

### Ranking Metrics
| Método | Ruta |
|---|---|
| POST | `/api/analytics/ranking-metrics` |
| GET | `/api/analytics/ranking-metrics/model/:modelId` |
| GET | `/api/analytics/ranking-metrics/:id` |
| GET | `/api/analytics/ranking-metrics/model/:modelId/latest` |

---

## 🌱 Seeds

- 3 ranking models (hybrid, collaborative, trending)
- 10 interest signals (views, purchases, ratings, saves, shares, bookmarks)
- 6 ranking metrics (CTR, NDCG, conversion rate, precision@k, engagement)

---

## 📊 Stats

| Métrica | Valor |
|---|---|
| Entidades nuevas | 4 |
| Services nuevos | 3 |
| Controllers nuevos | 3 |
| Endpoints API | 16 |
| Seeds | 19 registros |
| WOs totales | 10/75 |

---

## 🔗 Referencias

- **Functions**: SOCIAL-STRONG-001, 003, 047, SOCIAL-MODERN-012, 286, 288
- **Previo**: WO-005
- **Siguiente**: WO-010 (Estructura de Comunidad y Roles)
