# WO-039: Calculadora de Costo Real de Producción

**Estado**: ✅ Implementado  
**Fecha**: 2026-07-24  
**Módulos**: `financial-ledger` (principal), `analytics`, `merchant-b2b` (secundarios)

## Resumen
Sistema completo para calcular costos reales de producción incluyendo 8 categorías de costo con workflow de revisión y aprobación.

## Entidades (2)
1. **ProductionCostCalculation** - Cálculo principal con estado, totales por categoría y metadata de aprobación
2. **CostLineItem** - Items individuales por categoría con auto-cálculo de subtotal, descuento e impuestos

## Endpoints (11)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/financial/production-cost-calculator/stats` | Estadísticas globales |
| POST | `/api/financial/production-cost-calculator` | Crear cálculo nuevo |
| GET | `/api/financial/production-cost-calculator` | Listar cálculos |
| GET | `/api/financial/production-cost-calculator/:id` | Detalle por ID |
| GET | `/api/financial/production-cost-calculator/:id/items` | Items del cálculo |
| POST | `/api/financial/production-cost-calculator/:id/items` | Agregar item |
| POST | `/api/financial/production-cost-calculator/recalculate` | Recalcular totales |
| PATCH | `/api/financial/production-cost-calculator/:id/status` | Actualizar estado |
| POST | `/api/financial/production-cost-calculator/:id/review` | Enviar a review |
| POST | `/api/financial/production-cost-calculator/:id/approve` | Aprobar cálculo |
| DELETE | `/api/financial/production-cost-calculator/:id` | Eliminar (soft) |

## Categorías de Costo
- `materials` - Materiales directos
- `labor` - Mano de obra directa
- `logistics` - Transporte y distribución
- `packaging` - Empaquetado
- `overhead` - Gastos generales
- `marketing` - Marketing y publicidad
- `fees` - Fees de plataforma/tarjetas
- `taxes` - Impuestos

## Workflow
DRAFT → (Agregar items) → COMPLETED → (Recalcular) → REVIEWED → (Aprobar) → APPROVED → (30 días) → EXPIRED

## Smoke Tests (10/10 PASADOS)
| Test | Resultado | Comportamiento Verificado |
|------|-----------|---------------------------|
| Stats inicial | ✅ | 0 calculations |
| Crear cálculo | ✅ | Draft, total 0 |
| Agregar materiales | ✅ | Steel Sheet $1,476 |
| Agregar labor | ✅ | Assembly $3,000 |
| Agregar logística | ✅ | Shipping $8,000 |
| Recalcular | ✅ | Grand total calculado |
| Listar items | ✅ | 3 items |
| Review | ✅ | Reviewed |
| Approve | ✅ | Approved, expires in 30 days |
| Stats final | ✅ | 1 approved |

## Características Técnicas
- **Auto-cálculo**: Subtotals y totales con descuento/impuesto automáticos
- **Recálculo incremental**: Totales agregados se recalculan al agregar/modificar items
- **Workflow completo**: Draft → Completed → Reviewed → Approved
- **Expiración**: Cálculos aprobados expiran en 30 días
- **Multi-moneda**: Soporte para USD, EUR, GBP, etc.
- **Soft delete**: Eliminación segura con deletedAt
