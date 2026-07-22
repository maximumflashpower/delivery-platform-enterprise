# WO-030: Pruebas de Seguridad de Agentes con Herramientas

## Resumen
Sistema para auditar y probar la seguridad de agentes de IA que tienen acceso a herramientas (tool use). Incluye definición de escenarios de prueba, ejecución de tests, registro de hallazgos, e inventario de herramientas con capacidad de quarantine ante fallos de seguridad.

## Módulo Afectado
| Rol | Módulo | Endpoints |
|-----|--------|-----------|
| Principal | `trust-safety` | 16 (9 agent-security + 7 agent-tools) |
| Secundario | `ml-pipeline` | Integración futura |

## Archivos Creados

### Entities
| Archivo | Descripción |
|---------|-------------|
| `entities/agent-security-test.entity.ts` | Definición de escenario de prueba de seguridad |
| `entities/agent-security-result.entity.ts` | Resultados de ejecución de pruebas |
| `entities/agent-tool-inventory.entity.ts` | Catálogo de herramientas disponibles para agentes |

### DTOs
| Archivo | Descripción |
|---------|-------------|
| `dto/agent-security-test.dto.ts` | DTOs: CreateAgentSecurityTest, CreateToolInventory, RegisterResult, QuarantineTool |

### Services
| Archivo | Descripción |
|---------|-------------|
| `services/agent-security-test.service.ts` | CRUD tests, start/complete/cancel, registerResult, stats |
| `services/agent-tool-inventory.service.ts` | CRUD tools, quarantine, enable, restrict, stats |

### Controllers
| Archivo | Descripción |
|---------|-------------|
| `controllers/agent-security-test.controller.ts` | 9 endpoints REST |
| `controllers/agent-tool-inventory.controller.ts` | 7 endpoints REST |

## Endpoints (+16)

### Trust Safety - Agent Security Testing
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/trust-safety/agent-security/stats` | Estadísticas de pruebas de seguridad |
| GET | `/api/trust-safety/agent-security` | Listar todas las pruebas |
| GET | `/api/trust-safety/agent-security/agent/{agentId}` | Buscar pruebas por agente |
| GET | `/api/trust-safety/agent-security/{id}` | Detalle de prueba por ID |
| GET | `/api/trust-safety/agent-security/{id}/results` | Resultados de una prueba |
| POST | `/api/trust-safety/agent-security` | Crear nueva prueba de seguridad |
| POST | `/api/trust-safety/agent-security/{id}/start` | Iniciar ejecución de prueba |
| POST | `/api/trust-safety/agent-security/{id}/complete` | Completar manualmente |
| POST | `/api/trust-safety/agent-security/{id}/cancel` | Cancelar prueba |
| POST | `/api/trust-safety/agent-security/results` | Registrar resultado de prueba |

### Trust Safety - Agent Tool Inventory
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/trust-safety/agent-tools/stats` | Estadísticas del inventario |
| GET | `/api/trust-safety/agent-tools/agent/{agentId}` | Herramientas por agente |
| GET | `/api/trust-safety/agent-tools/{id}` | Detalle de herramienta por ID |
| POST | `/api/trust-safety/agent-tools` | Registrar herramienta en inventario |
| POST | `/api/trust-safety/agent-tools/{id}/quarantine` | Quarantine de herramienta |
| POST | `/api/trust-safety/agent-tools/{id}/enable` | Habilitar herramienta |
| POST | `/api/trust-safety/agent-tools/{id}/restrict` | Restringir herramienta |

## Entities

### agent_security_tests
- `agentId`, `agentName` — Identificación del agente bajo prueba
- `testScenarioName` — Nombre del escenario de ataque
- `status` — pending | running | completed | failed | cancelled
- `riskLevel` — low | medium | high | critical
- `testType` — automated | manual | red_team | fuzz | prompt_injection
- `testDescription` — Descripción del escenario
- `inputPayload` — Payload de entrada para el test
- `toolAccessList` — Lista de herramientas con acceso (JSON)
- `startedAt`, `completedAt`, `durationMs` — Timing de ejecución

### agent_security_results
- `testId`, `agentId` — Referencias a la prueba y agente
- `overallResult` — pass | fail | warning | blocked
- `findingsCount`, `criticalFindings`, `warningsCount` — Conteos de hallazgos
- `summary` — Resumen de resultados
- `findings` — Detalles de cada hallazgo (JSON)
- `remediationNotes` — Notas de remediación
- `securityScore` — Score de 0-100

### agent_tool_inventory
- `agentId`, `toolName`, `toolType` — Identificación de herramienta
- `toolType` — file_access | network_call | database_query | code_execution | external_api | notification | data_read | data_write
- `status` — enabled | disabled | restricted | quarantined
- `riskRating` — low | medium | high | critical
- `permissionsScope` — Alcance de permisos
- `requiresApproval` — Si requiere aprobación previa
- `auditEnabled` — Si el acceso se audita

## Flujo de Uso Típico

1. **Registrar herramientas** → POST `/api/trust-safety/agent-tools`
2. **Definir escenario de prueba** → POST `/api/trust-safety/agent-security`
3. **Iniciar prueba** → POST `/api/trust-safety/agent-security/{id}/start`
4. **Ejecutar tests automatizados** (fuera del sistema)
5. **Registrar resultados** → POST `/api/trust-safety/agent-security/results`
6. **Si falla → Quarantine herramientas riesgosas** → POST `/api/trust-safety/agent-tools/{id}/quarantine`

## Smoke Tests (10/10 PASADOS)
| Test | Resultado | Datos |
|------|-----------|-------|
| Stats inicial tests | ✅ | totalTests: 0 |
| Crear security test | ✅ | ID: c9b09c0b..., status: pending |
| Iniciar test | ✅ | status: running, startedAt set |
| Registrar resultado | ✅ | ID: dfef40fd..., overallResult: fail |
| Ver resultados | ✅ | Array con 1 result |
| Buscar por agent | ✅ | status: failed, durationMs: 34 |
| Registrar tool | ✅ | ID: df1bc1c4..., status: enabled |
| Quarantine tool | ✅ | status: quarantined, permissionsScope actualizado |
| Stats tools | ✅ | totalTools: 1, quarantinedTools: 1 |
| Stats tests post-result | ✅ | avgSecurityScore: 45.5, totalFindings: 2 |

## Fixes Aplicados
- Eliminado duplicado `BiometricSecurityModule` en `app.module.ts`
- Restaurado `NotificationModule` y `RealtimeModule` eliminados por error
- Corregidas entidades para usar `string` en lugar de union types (evitar TypeORM `FindOptionsWhere` conflicts)

## Dependencias
- TypeORM (Repository pattern)
- class-validator (@IsUUID, @IsString, @IsIn, @IsOptional, @IsInt, @IsNumber, @Min, @Max)

## Fecha de Implementación
2026-07-22
