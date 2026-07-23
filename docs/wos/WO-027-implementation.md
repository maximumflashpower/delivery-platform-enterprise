# WO-027: Panel de Apelación de Decisiones IA

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `support-claims` (extensión), `ml-pipeline` (secundario: `audit`, `governance`)

## Resumen

Sistema de apelación para decisiones automatizadas por IA, permitiendo revisión humana de decisiones de moderación de contenido, evaluación de riesgos, violaciones de política y flags de seguridad.

## Funcionalidades

### IA Decision Appeals
- **Creación**: Vinculada a appealId existente, con modelo y decisión IA
- **Decision Types**: content_moderation, risk_assessment, policy_violation, safety_flag
- **Lifecycle**: pending_review → under_human_review → upheld/overturned/escalated
- **AI Context**: modelName, modelId, aiReasoning, confidenceScore

### Human Review Workflow
- **Start Review**: Asigna reviewer, cambia estado a under_human_review
- **Complete Review**: Decisión final: uphold, overturn, request_more_info
- **Escalate**: Escalada a board con urgency level (low/medium/high/critical)

### Statistics Dashboard
- Total/pending/under_review/upheld/overturned/escalated
- Requires board review count
- Average confidence score

## Endpoints (8)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/support-claims/ia-appeals` | GET | List all IA appeals |
| `/api/support-claims/ia-appeals/stats` | GET | Statistics dashboard |
| `/api/support-claims/ia-appeals/{id}` | GET | Get appeal by ID |
| `/api/support-claims/ia-appeals/by-appeal/{appealId}` | GET | Find by appeal ID |
| `/api/support-claims/ia-appeals/by-decision/{decisionId}` | GET | Find by decision ID |
| `/api/support-claims/ia-appeals` | POST | Create IA appeal |
| `/api/support-claims/ia-appeals/{id}/start-review` | POST | Start human review |
| `/api/support-claims/ia-appeals/{id}/complete-review` | POST | Complete review |
| `/api/support-claims/ia-appeals/{id}/escalate` | POST | Escalate to board |

## Smoke Tests ✅
- Stats inicial: ✅ zeros
- Create appeal: ✅ id returned, pending_review
- List all: ✅ 1 appeal
- By appeal ID: ✅ 1 found
- Start review: ✅ under_human_review
- Complete review: ✅ overturned
- Stats final: ✅ total=1, overturned=1, avgConfidence=0.92
