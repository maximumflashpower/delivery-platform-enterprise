# WO-031: Firewall de Contexto para Agentes IA

## Resumen
Sistema de firewall que controla el contexto (información, instrucciones y datos sensibles) que un agente de IA puede recibir en cada interacción. Previene fugas de información, limita el scope de datos accesibles y aplica reglas de filtrado dinámico según el perfil del agente.

## Módulo Afectado
| Rol | Módulo | Endpoints |
|-----|--------|-----------|
| Principal | `trust-safety` | 12 (context-firewall) |
| Secundario | `rate-limit` | Integración futura |

## Archivos Creados

### Entities
| Archivo | Descripción |
|---------|-------------|
| `entities/context-firewall-rule.entity.ts` | Reglas de filtrado personalizables |
| `entities/context-filter-log.entity.ts` | Logs completos de cada filtrado |
| `entities/agent-context-profile.entity.ts` | Perfil de clearance y políticas por agente |

### DTOs
| Archivo | Descripción |
|---------|-------------|
| `dto/context-firewall.dto.ts` | DTOs: CreateFirewallRule, CreateContextProfile, FilterContext |

### Services
| Archivo | Descripción |
|---------|-------------|
| `services/context-firewall.service.ts` | Rule CRUD, profile management, core filtering engine, audit logs, stats |

### Controllers
| Archivo | Descripción |
|---------|-------------|
| `controllers/context-firewall.controller.ts` | 12 endpoints REST |

## Endpoints (+12)

### Trust Safety - Context Firewall
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/trust-safety/context-firewall/stats` | Estadísticas globales |
| GET | `/api/trust-safety/context-firewall/agents/{agentId}/stats` | Estadísticas por agente |
| GET | `/api/trust-safety/context-firewall/rules/agent/{agentId}` | Reglas por agente |
| GET | `/api/trust-safety/context-firewall/rules/{id}` | Regla por ID |
| GET | `/api/trust-safety/context-firewall/profiles/agent/{agentId}` | Perfil por agente |
| GET | `/api/trust-safety/context-firewall/profiles/{id}` | Perfil por ID |
| GET | `/api/trust-safety/context-firewall/logs/agent/{agentId}` | Logs por agente |
| GET | `/api/trust-safety/context-firewall/logs/{id}` | Log por ID |
| POST | `/api/trust-safety/context-firewall/rules` | Crear regla de firewall |
| POST | `/api/trust-safety/context-firewall/profiles` | Crear perfil de contexto |
| POST | `/api/trust-safety/context-firewall/filter` | **Filtrar contexto (core)** |
| POST | `/api/trust-safety/context-firewall/rules/{id}/delete` | Archivar regla |

## Core Features

### 1. PII Automatic Detection & Redaction

typescript // Detecta y redacta automáticamente: { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN-REDACTED]' } { pattern: /\b[\w.+-]+@[\w-]+.[\w.-]+\b/g, replacement: '[EMAIL-REDACTED]' } { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: '[CARD-REDACTED]' } { pattern: /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, replacement: '[PHONE-REDACTED]' }

### 2. Credential Masking

typescript // Protege credenciales en el contexto: { pattern: /(?:password|passwd|pwd)\s*[=:]\s*\S+/gi, replacement: '[CREDENTIAL-REDACTED]' } { pattern: /(?:api[-]?key|apikey)\s*[=:]\s*\S+/gi, replacement: '[API-KEY-REDACTED]' } { pattern: /(?:token|bearer)\s+[A-Za-z0-9-.~+/=]+/gi, replacement: '[TOKEN-REDACTED]' } { pattern: /(?:secret)\s*[=:]\s*\S+/gi, replacement: '[SECRET-REDACTED]' }

### 3. Custom Rules Engine
Soporta múltiples tipos de reglas por prioridad:

| Rule Type | Descripción | Ejemplo |
|-----------|-------------|---------|
| `keyword` | Match literal de texto | "social security number" |
| `regex` | Expresión regular personalizada | `(sk-[a-zA-Z0-9]{20,})` |
| `url_domain` | Bloqueo de dominios | `competitor\.com` |
| `data_pattern` | Patrones de datos estructurados | UUIDs, hashes específicos |

Acciones posibles: `block`, `allow`, `mask`, `warn`, `redirect`

### 4. System Prompt Protection
Protege instrucciones del sistema para evitar prompt injection:
- Bloquea patrones como "system prompt:", "instructions:", "you are a..."
- Reemplaza con `[PROTECTED]` o `[PROTECTED-INSTRUCTION]`

### 5. Context Profiles
Perfiles de clearance por agente:
- `clearanceLevel`: restricted | standard | elevated | unrestricted
- `maxContextLength`: límite de caracteres (default: 50000)
- `maxRequestsPerMinute`: throttling básico (default: 5)
- Toggle flags: PII filtering, credential filtering, system prompt protection, audit logging

## Entities

### context_firewall_rules
- `agentId` — Agente al que aplica la regla
- `ruleName`, `description` — Metadatos de la regla
- `status` — active | inactive | archived
- `action` — block | allow | mask | warn | redirect
- `ruleType` — keyword | regex | semantic | entity_type | url_domain | data_pattern
- `pattern` — Patrón a matchear (texto o regex)
- `priority` — Orden de aplicación (menor = mayor prioridad)
- `caseSensitive` — Sensibilidad a mayúsculas/minúsculas

### context_filter_logs
- `agentId`, `sessionId` — Identificación de la sesión
- `filterResult` — allowed | filtered | blocked
- `originalContext`, `filteredContext` — Contexto antes y después
- `rulesTriggered`, `triggeredRuleIds` — Reglas que se activaron
- `blockedReason` — Razón si fue bloqueado
- `originalLength`, `filteredLength` — Longitudes antes/después
- `processingTimeMs` — Tiempo de procesamiento en ms

### agent_context_profiles
- `agentId`, `profileName` — Identificación del perfil
- `clearanceLevel` — Nivel de acceso permitido
- `allowedDomains`, `blockedDomains` — Whitelist/blacklist de dominios
- `piiFiltering`, `credentialFiltering`, `systemPromptProtection` — Flags de protección
- `maxContextLength`, `maxRequestsPerMinute` — Límites operativos
- `auditLogging` — Habilitar auditoría

## Flujo de Filtrado

Request Context → Find Profile → Load Active Rules ↓ [PII Filtering] → [Credential Masking] → [System Prompt Protection] ↓ [Apply Custom Rules by Priority] → [Generate Audit Log] ↓ Return: { filterResult, filteredContext, rulesTriggered, logId }

## Smoke Tests (12/12 PASADOS)
| Test | Resultado | Comportamiento Verificado |
|------|-----------|---------------------------|
| Stats globales inicial | ✅ | totalRules: 0, totalLogs: 0 |
| Crear context profile | ✅ | ID: 24953461..., clearance: restricted |
| Crear keyword block rule | ✅ | ID: 6eed1718..., pattern: "social security number" |
| Crear regex mask rule | ✅ | ID: 0b93c83b..., pattern: API key regex |
| Crear domain block rule | ✅ | ID: a8799513..., pattern: competitor.com |
| Contexto limpio (allow) | ✅ | filterResult: allowed, 0 reglas activadas |
| Contexto con PII (filter) | ✅ | Email, teléfono, tarjeta REDACTADOS |
| Contexto bloqueado (block) | ✅ | filterResult: blocked, 1 regla activada |
| Contexto con API key (mask) | ✅ | filterResult: filtered, key MASKED |
| Stats agent post-tests | ✅ | blockedCount: 1, filteredCount: 1, allowedCount: 2 |
| Stats globales post-tests | ✅ | avgProcessingTimeMs: 1.25 |
| Ver logs por agent | ✅ | 4 logs registrados |

## Casos de Uso

### 1. Protección Contra Fugas de Datos
Empresas pueden definir reglas para bloquear palabras clave específicas de propiedad intelectual o datos sensibles.

### 2. Cumplimiento Normativo (GDPR/HIPAA)
PII filtering automático asegura que datos personales nunca lleguen a modelos de IA sin enmascaramiento previo.

### 3. Prevención de Prompt Injection
System prompt protection evita que usuarios maliciosos sobrescriban instrucciones del sistema.

### 4. Auditoría Forense
Logs completos permiten reconstruir qué contexto recibió cada agente en cada sesión.

## Dependencias
- TypeORM (Repository pattern)
- class-validator (@IsUUID, @IsString, @IsIn, @IsOptional, @IsInt, @IsBoolean, @Min)

## Fecha de Implementación
2026-07-22
