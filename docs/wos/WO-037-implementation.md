# WO-037: Mercado de Servicios de Producción Creativa

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `local-services` (principal), `merchant-b2b`, `file-storage` (secundarios)

## Endpoints (13)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/local-services/creative-marketplace/stats | GET | Stats |
| /api/local-services/creative-marketplace/top-creators | GET | Top rated creators |
| /api/local-services/creative-marketplace/category/:category | GET | Browse by category |
| /api/local-services/creative-marketplace | GET | List all |
| /api/local-services/creative-marketplace/:id | GET | Get by ID |
| /api/local-services/creative-marketplace | POST | Create listing |
| /api/local-services/creative-marketplace/:id | PATCH | Update listing |
| /api/local-services/creative-marketplace/:id/publish | POST | Publish |
| /api/local-services/creative-marketplace/:id/pause | POST | Pause |
| /api/local-services/creative-marketplace/:id/book | POST | Book service |
| /api/local-services/creative-marketplace/:id/complete | POST | Complete project |
| /api/local-services/creative-marketplace/:id/reviews | POST | Add review |
| /api/local-services/creative-marketplace/:id/archive | POST | Archive |

## Workflow
CREATE → PUBLISH → BOOK → COMPLETE → REVIEW → (PAUSE/ARCHIVE)
