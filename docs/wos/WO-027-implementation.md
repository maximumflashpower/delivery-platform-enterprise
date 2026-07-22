# WO-027: Panel de Apelación de Decisiones IA

## Resumen
Implementación del módulo de apelación de decisiones automatizadas tomadas por IA, permitiendo revisión humana, escalado a junta y estadísticas.

## Módulos Afectados
- **Principal:** support-claims
- **Sub-módulo:** ia-decision-appeal

## Archivos Creados
| Archivo | Descripción |
|---------|-------------|
| `entities/ia-decision-appeal.entity.ts` | Entidad con campos de decisión IA, review humano y escalado |
| `dto/ia-decision-appeal.dto.ts` | DTOs: CreateIaDecisionAppeal, HumanReview, EscalateToBoard |
| `services/ia-decision-appeal.service.ts` | Servicio con CRUD, review, escalate y stats |
| `controllers/ia-decision-appeal.controller.ts` | Controller con 8 endpoints |

## Archivos Modificados
- `support-claims.module.ts` — Registrada entidad, servicio y controller

## Endpoints (+8)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/support-claims/ia-appeals` | Listar todas las apelaciones IA |
| GET | `/api/support-claims/ia-appeals/stats` | Estadísticas de apelaciones |
| GET | `/api/support-claims/ia-appeals/{id}` | Detalle de apelación por ID |
| GET | `/api/support-claims/ia-appeals/by-appeal/{appealId}` | Buscar por appeal ID |
| GET | `/api/support-claims/ia-appeals/by-decision/{decisionId}` | Buscar por decisión IA |
| POST | `/api/support-claims/ia-appeals` | Crear apelación de decisión IA |
| POST | `/api/support-claims/ia-appeals/{id}/start-review` | Iniciar revisión humana |
| POST | `/api/support-claims/ia-appeals/{id}/complete-review` | Completar review con decisión |
| POST | `/api/support-claims/ia-appeals/{id}/escalate` | Escalar a junta revisora |

## Entity: ia_decision_appeals
Campos principales:
- `appealId` (UUID) — Referencia al appeal principal
- `decisionId` (UUID, nullable) — Referencia a la decisión IA
- `modelName`, `modelId` — Identificación del modelo
- `decisionType` — content_moderation | risk_assessment | policy_violation | safety_flag
- `confidenceScore` (float, 0-1) — Confianza del modelo
- `aiReasoning` (text, nullable) — Razonamiento del modelo
- `reviewStatus` — pending_review | under_human_review | upheld | overturned | escalated
- `humanReviewerId`, `humanReviewNotes`, `reviewedAt` — Datos de revisión humana
- `requiresBoardReview`, `escalatedAt` — Escalado a junta

## Smoke Tests
1. ✅ Stats (vacío inicial)
2. ✅ Crear apelación con UUID válido
3. ✅ Completar review humana (overturn)
4. ✅ Stats post-test (1 apelación, 1 overturned, avg confidence 0.92)

## Dependencias
- TypeORM (Repository pattern)
- class-validator (@IsUUID, @IsNumber, @IsString, @IsObject)

## Fecha de Implementación
2026-07-22
