# WO-038: Gestor de Facturas y Cumplimiento para Sponsors

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `financial-ledger` (principal), `merchant-b2b`, `audit` (secundarios)

## Endpoints Invoice (11)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/financial/sponsor-invoices/stats | GET | Stats |
| /api/financial/sponsor-invoices | GET | List |
| /api/financial/sponsor-invoices/:id | GET | Get by ID |
| /api/financial/sponsor-invoices | POST | Create |
| /api/financial/sponsor-invoices/:id/send | POST | Send |
| /api/financial/sponsor-invoices/:id/pay | POST | Mark paid |
| /api/financial/sponsor-invoices/:id/status | PATCH | Update status |
| /api/financial/sponsor-invoices/:id/dispute | POST | Submit dispute |
| /api/financial/sponsor-invoices/:id/cancel | POST | Cancel |
| /api/financial/sponsor-invoices/:id/compliance | PATCH | Compliance check |
| /api/financial/sponsor-invoices/:id/line-items | POST | Add line item |

## Endpoints Compliance (11)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/financial/sponsor-compliance/stats | GET | Stats |
| /api/financial/sponsor-compliance/sponsor/:sponsorId/summary | GET | Sponsor summary |
| /api/financial/sponsor-compliance | GET | List |
| /api/financial/sponsor-compliance/sponsor/:sponsorId | GET | By sponsor |
| /api/financial/sponsor-compliance/:id | GET | Get by ID |
| /api/financial/sponsor-compliance | POST | Create |
| /api/financial/sponsor-compliance/:id | PATCH | Update |
| /api/financial/sponsor-compliance/:id/pass | POST | Pass verification |
| /api/financial/sponsor-compliance/:id/fail | POST | Fail verification |
| /api/financial/sponsor-compliance/:id/remediation | POST | Require remediation |
| /api/financial/sponsor-compliance/:id/exemption | POST | Grant exemption |

## Workflow
INVOICE: CREATE → SEND → COMPLIANCE_CHECK → PAY/DISPUTE/EXPIRE
COMPLIANCE: CREATE → PASS/FAIL/REMEDIATION/EXEMPTION
