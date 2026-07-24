# WO-035: Protocolo de Preservación de Evidencia Grave

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `audit` (principal), `file-storage`, `support-claims` (secundarios)

## Resumen
Protocolo formal para preservar evidencia digital grave con cadena de custodia verificable, sellado criptográfico y control de acceso.

## Entidad
- `EvidencePreservation` — Registro de evidencia preservada con chain of custody

## Endpoints (11)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/audit/evidence-preservations/stats | GET | Stats |
| /api/audit/evidence-preservations | GET | List |
| /api/audit/evidence-preservations/:id | GET | Get by ID |
| /api/audit/evidence-preservations | POST | Create |
| /api/audit/evidence-preservations/:id/collect | POST | Start collection |
| /api/audit/evidence-preservations/:id/seal | POST | Seal with hash |
| /api/audit/evidence-preservations/:id/verify-chain | POST | Verify chain of custody |
| /api/audit/evidence-preservations/:id/release | POST | Release evidence |
| /api/audit/evidence-preservations/:id/access | POST | Record access |
| /api/audit/evidence-preservations/:id/schedule-purge | PATCH | Schedule purge |

## Workflow
CREATE → COLLECT → SEAL (hash checksum) → VERIFY CHAIN → RELEASE / SCHEDULE PURGE

## Severity Levels
standard, elevated, critical, legal_hold

## Evidence Types
digital_record, communication_log, transaction_record, user_data_snapshot, system_log, media_file, metadata_package
