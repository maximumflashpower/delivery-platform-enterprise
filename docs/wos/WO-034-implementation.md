# WO-034: Simulador de Abuso por Función

**Estado**: ✅ Implementado
**Fecha**: Julio 2026
**Módulos**: `analytics-observability` (principal), `trust-safety`, `ml-pipeline` (secundarios)

## Resumen
Sistema para ejecutar pruebas de estrés y simulaciones de ataques contra funciones específicas de la API.

## Entidad
- `AbuseSimulation` — Configuración y resultados de simulaciones de ataque

## Endpoints (10)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/analytics/abuse-simulations/stats | GET | Stats |
| /api/analytics/abuse-simulations | GET | List |
| /api/analytics/abuse-simulations/:id | GET | Get by ID |
| /api/analytics/abuse-simulations | POST | Create |
| /api/analytics/abuse-simulations/:id/schedule | POST | Schedule |
| /api/analytics/abuse-simulations/:id/start | POST | Start |
| /api/analytics/abuse-simulations/:id/progress | PATCH | Update progress |
| /api/analytics/abuse-simulations/:id/complete | POST | Complete |
| /api/analytics/abuse-simulations/:id/fail | POST | Fail |
| /api/analytics/abuse-simulations/:id/cancel | POST | Cancel |

## Tipos: rate_limit, auth_brute_force, data_exfiltration, injection_attack, dos, privilege_escalation, function_abuse
