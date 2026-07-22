# 📋 Mapeo: Work Orders (WO-001 a WO-075) → Módulos del Proyecto

> **Proyecto**: delivery-platform-enterprise  
> **Fecha**: 2026-07-20  
> **Total WOs**: 75 (3 fases)  
> **Total Módulos**: 48  

---

## 🟢 FASE 1 — MVP (WO-001 a WO-024)

| WO | Nombre | Módulo(s) Principal(es) | Módulo(s) Secundario(s) | Estado |
|---|---|---|---|---|
| WO-001 | Capability Registry y Source Authority | `developer-platform`, `configuration` | `governance` | ✅ Implementado |
| WO-002 | Gates de Release y Dueños de Dominio | `feature-flag`, `governance` | `configuration` | ✅ Implementado |
| WO-003 | Registro de Daños, Riesgos y Excepciones | `trust-safety`, `audit` | `support-claims` | ✅ Implementado |
| WO-004 | Autenticación, Sesiones y Recuperación | `auth`, `identity` | — | ✅ Implementado |
| WO-005 | Capa de Datos y Consentimiento Dinámico | `privacy-consent`, `identity` | `configuration` | ✅ Implementado |
| WO-006 | Motor de Interés y Ranking Híbrido | `search`, `analytics` | `ml-pipeline` | ✅ Implementado |
| WO-007 | Controles de Usuario y Explicabilidad | `identity`, `governance` | `audit` | ✅ Implementado |
| WO-008 | Editor Universal y Publicación Multi-formato | `file-storage` | `storage`, `notification` | ✅ Implementado |
| WO-009 | Versionado, Colaboración y Derechos Básicos | `file-storage`, `storage` | `governance` | ✅ Implementado |
| WO-010 | Estructura de Comunidad y Roles | `role-profile`, `identity` | `governance` | ✅ Implementado |
| WO-011 | Votación, Asambleas y Salud Comunitaria | `governance` | `chat`, `realtime` | ✅ Implementado |
| WO-012 | Cola de Moderación y Códigos de Razón | `trust-safety` | `audit`, `support-claims` | ✅ Implementado |
| WO-013 | Evidencia, Apelaciones y Centro para Víctimas | `support-claims`, `trust-safety` | `file-storage`, `audit` | ✅ Implementado |
| WO-014 | Mensajería Segura y Filtros Básicos | `chat`, `realtime` | `trust-safety` | ✅ Implementado |
| WO-015 | Dashboard de Ingresos y Simulador de Payout | `financial-ledger`, `payout` | `analytics` | ✅ Implementado |
| WO-016 | Split por Colaboración y Riesgo de Sponsor | `financial-ledger`, `payout` | `smart-contract` | ✅ Implementado |
| WO-017 | Transparencia Publicitaria y Registro de Patrocinios | `audit`, `governance` | `financial-ledger` | ✅ Implementado |
| WO-018 | Control de Usuario sobre Anuncios | `privacy-consent`, `configuration` | `governance` | ✅ Implementado |
| WO-019 | Portal DSAR y Borrado Selectivo | `dsar-portal` | `privacy-consent`, `identity`, `audit` | ✅ Implementado |
| WO-020 | Panel de Inferencias y Presupuesto de Privacidad | `ml-pipeline`, `analytics` | `privacy-consent` | ✅ Implementado |
| WO-021 | Modos Sensoriales y Lectura Fácil | `accessibility`, `i18n` | `localization` | ✅ Implementado |
| WO-022 | Recuperación post-conflicto y Bienestar | `wellness` | `chat`, `notification` | ✅ Implementado |
| WO-023 | Seguridad de API, Scraping y Partners | `rate-limit`, `integration-gateway`, `webhook` | `audit` | ✅ Implementado |
| WO-024 | Integración MVP y Plan de Degradación | `developer-platform`, `configuration` | `analytics-observability` | ⬜ Pendiente |

---

## 🔵 FASE 2 — CRECIMIENTO (WO-025 a WO-050)

| WO | Nombre | Módulo(s) Principal(es) | Módulo(s) Secundario(s) | Estado |
|---|---|---|---|---|
| WO-025 | Registro de Modelos y Agentes de IA | `ml-pipeline` | `governance`, `audit` | ✅ Implementado |
| WO-026 | Red-Team Continuo de IA Generativa | `ml-pipeline`, `trust-safety` | `analytics` | ⬜ Pendiente |
| WO-027 | Panel de Apelación de Decisiones IA | `support-claims`, `ml-pipeline` | `audit`, `governance` | ⬜ Pendiente |
| WO-028 | Marcado de Contenido Sintético por Nivel | `ml-pipeline`, `governance` | `trust-safety` | ⬜ Pendiente |
| WO-029 | Control de Uso de Voz/Imagen en Modelos | `privacy-consent`, `biometric-security` | `ml-pipeline` | ⬜ Pendiente |
| WO-030 | Pruebas de Seguridad de Agentes con Herramientas | `trust-safety`, `biometric-security` | `ml-pipeline` | ⬜ Pendiente |
| WO-031 | Firewall de Contexto para Agentes IA | `trust-safety`, `rate-limit` | `ml-pipeline` | ⬜ Pendiente |
| WO-032 | Modo IA Sin Memoria por Defecto | `ml-pipeline`, `privacy-consent` | `configuration` | ⬜ Pendiente |
| WO-033 | Centro de Riesgo Sistémico de la Plataforma | `trust-safety`, `analytics-observability` | `audit` | ⬜ Pendiente |
| WO-034 | Simulador de Abuso por Función | `analytics`, `trust-safety` | `ml-pipeline` | ⬜ Pendiente |
| WO-035 | Protocolo de Preservación de Evidencia Grave | `audit`, `file-storage` | `support-claims` | ⬜ Pendiente |
| WO-036 | Escrow de Patrocinios por Hitos | `financial-ledger`, `smart-contract` | `payout` | ⬜ Pendiente |
| WO-037 | Mercado de Servicios de Producción Creativa | `local-services`, `merchant-b2b` | `file-storage` | ⬜ Pendiente |
| WO-038 | Gestor de Facturas y Cumplimiento para Sponsors | `financial-ledger`, `merchant-b2b` | `audit` | ⬜ Pendiente |
| WO-039 | Calculadora de Costo Real de Producción | `financial-ledger`, `analytics` | `merchant-b2b` | ⬜ Pendiente |
| WO-040 | Seguro/Protección de Ingresos con Partner | `financial-ledger`, `payout` | `smart-contract` | ⬜ Pendiente |
| WO-041 | Sistema de Intercomunidades Federadas | `integration-gateway`, `realtime` | `identity` | ⬜ Pendiente |
| WO-042 | Tribunal Comunitario de Apelaciones No Legal | `governance`, `support-claims` | `audit` | ⬜ Pendiente |
| WO-043 | Panel de Riesgo de Captura Económica | `analytics`, `trust-safety` | `financial-ledger` | ⬜ Pendiente |
| WO-044 | Archivo de Memoria Comunitaria Moderada | `file-storage`, `storage` | `governance` | ⬜ Pendiente |
| WO-045 | Programa de Formación de Moderadores | `role-profile`, `configuration` | `trust-safety` | ⬜ Pendiente |
| WO-046 | Métrica de Valor para Creadores Pequeños | `analytics`, `analytics-observability` | `governance` | ⬜ Pendiente |
| WO-047 | Panel de Métricas con Intervalos de Confianza | `analytics`, `analytics-observability` | `ml-pipeline` | ⬜ Pendiente |
| WO-048 | Auditoría de Crecimiento No Orgánico | `audit`, `analytics` | `trust-safety` | ⬜ Pendiente |
| WO-049 | Registro de Hipótesis de Producto | `experimentation`, `configuration` | `governance` | ⬜ Pendiente |
| WO-050 | Auditoría Anual Independiente de Plataforma | `audit`, `governance` | `analytics` | ⬜ Pendiente |

---

## 🟣 FASE 3 — MADUREZ (WO-051 a WO-075)

| WO | Nombre | Módulo(s) Principal(es) | Módulo(s) Secundario(s) | Estado |
|---|---|---|---|---|
| WO-051 | Gestión de Identidad Soberana y DID | `identity`, `auth` | `governance` | ⬜ Pendiente |
| WO-052 | Puente de Dominio Propio y Credenciales Portables | `identity`, `integration-gateway` | `auth` | ⬜ Pendiente |
| WO-053 | Exportación Continua y Backup en Tiempo Real | `file-storage`, `storage` | `audit` | ⬜ Pendiente |
| WO-054 | Migración Asistida a Plataformas Competidoras | `integration-gateway`, `developer-platform` | `identity` | ⬜ Pendiente |
| WO-055 | Federación Total con ActivityPub y Web Monetization | `integration-gateway`, `realtime` | `financial-ledger` | ⬜ Pendiente |
| WO-056 | Interoperabilidad con Estándares de la Industria | `integration-gateway`, `developer-platform` | `governance` | ⬜ Pendiente |
| WO-057 | Programa de Socios e Integraciones Verificadas | `integration-gateway`, `webhook` | `audit` | ⬜ Pendiente |
| WO-058 | Mercado de Plugins y Extensiones | `developer-platform`, `integration-gateway` | `file-storage` | ⬜ Pendiente |
| WO-059 | Mecanismo de Resolución de Disputas entre Socios | `support-claims`, `governance` | `audit` | ⬜ Pendiente |
| WO-060 | Seguro de Responsabilidad Civil para Socios | `financial-ledger`, `payout` | `smart-contract` | ⬜ Pendiente |
| WO-061 | Gestión de Fondos Comunitarios y Presupuestos | `financial-ledger`, `governance` | `audit` | ⬜ Pendiente |
| WO-062 | Auditoría Financiera Anual y Cumplimiento | `audit`, `financial-ledger` | `governance` | ⬜ Pendiente |
| WO-063 | Reporte de Transparencia Pública Automatizado | `analytics`, `audit`, `governance` | — | ⬜ Pendiente |
| WO-064 | Mecanismo de Denuncias Regulatorias (Whistleblowing) | `audit`, `support-claims` | `governance` | ⬜ Pendiente |
| WO-065 | Sistema de Cumplimiento Regional Automatizado | `governance`, `configuration` | `i18n` | ⬜ Pendiente |
| WO-066 | Sistema de Gestión de Crisis y Desastres | `trust-safety`, `analytics-observability`, `notification` | `realtime` | ⬜ Pendiente |
| WO-067 | Sistema de Gestión de Solicitudes Gubernamentales | `governance`, `audit` | `identity` | ⬜ Pendiente |
| WO-068 | Sistema de Gestión de Incidentes de Seguridad | `audit`, `trust-safety`, `auth` | `notification` | ⬜ Pendiente |
| WO-069 | Sistema de Monitoreo de Actividad Sospechosa | `analytics`, `trust-safety`, `audit` | `ml-pipeline` | ⬜ Pendiente |
| WO-070 | Programa de Cumplimiento de Anuncios Políticos | `governance`, `audit` | `financial-ledger` | ⬜ Pendiente |
| WO-071 | Programa de Verificación de Edad y Protección de Menores | `identity`, `auth`, `biometric-security` | `governance` | ⬜ Pendiente |
| WO-072 | Sistema de Gestión de Derechos de Autor y PI | `governance`, `file-storage` | `audit` | ⬜ Pendiente |
| WO-073 | Sistema de Arbitraje y Mediación Avanzado | `support-claims`, `governance` | `audit` | ⬜ Pendiente |
| WO-074 | Programa de Certificación de Calidad y Cumplimiento | `governance`, `configuration` | `analytics` | ⬜ Pendiente |
| WO-075 | Sistema de Preservación de Datos (Legal Hold) | `audit`, `file-storage` | `governance` | ⬜ Pendiente |

---

## 🚛 MÓDULOS DE DOMINIO LOGÍSTICO (Sin WO directo)

Estos módulos son del core business de delivery/logistics y no tienen WO directo en el documento SOCIAL-*:

| Módulo | Función | WO Relacionado | Estado |
|---|---|---|---|
| `delivery-courier` | Gestión de couriers y asignaciones | WO-037 (Mercado de Servicios) | ✅ Implementado |
| `driver-operator` | Gestión de conductores y licencias | WO-003 (Registro de Riesgos) | ✅ Implementado |
| `freight-trucking` | Transporte de carga, carriers, shipments | WO-037 (Mercado de Servicios) | ✅ Implementado |
| `hauling-moving` | Mudanzas y solicitudes de transporte | WO-037 (Mercado de Servicios) | ✅ Implementado |
| `host-travel` | Hosts, listings, reservas (tipo Airbnb) | WO-037 (Mercado de Servicios) | ✅ Implementado |
| `local-services` | Servicios locales, proveedores, bookings | WO-037 (Mercado de Servicios) | ✅ Implementado |
| `merchant-b2b` | Merchants, contratos, facturas B2B | WO-038 (Gestor de Facturas) | ✅ Implementado |
| `mobility-ride` | Rides, vehículos, payouts de conductores | WO-015 (Dashboard de Ingresos) | ✅ Implementado |
| `routing-navigation` | Rutas optimizadas, navegación | WO-006 (Motor de Ranking) | ✅ Implementado |
| `surface-routing` | Routing de superficie | WO-006 (Motor de Ranking) | ✅ Implementado |
| `vehicle-capability` | Capacidades de vehículos | WO-003 (Registro de Riesgos) | ✅ Implementado |
| `carbon-sustainability` | Créditos de carbono, métricas sostenibles | WO-017 (Transparencia) | ✅ Implementado |
| `scheduling` | Jobs programados, colas, schedules | WO-024 (Plan de Degradación) | ✅ Implementado |
| `proof-service` | Proof of delivery, evidencia | WO-013 (Evidencia) | ✅ Implementado |
| `localization` | Traducciones, claves de traducción | WO-021 (Modos Sensoriales) | ✅ Implementado |
| `smart-contract` | Contratos inteligentes, ejecuciones | WO-016 (Split por Colaboración) | ✅ Implementado |
| `gamification` | Achievements, progreso de usuarios | WO-046 (Métrica de Valor) | ✅ Implementado |
| `notification` / `notifications` | Plantillas y notificaciones multicanal | WO-014 (Mensajería) | ✅ Implementado |

---

## 📊 RESUMEN POR MÓDULO

### Módulos más utilizados en WOs (hotspots):

| Módulo | WOs que lo usan | Prioridad |
|---|---|---|
| `governance` | 22 WOs | 🔴 Crítica |
| `audit` | 16 WOs | 🔴 Crítica |
| `trust-safety` | 13 WOs | 🔴 Crítica |
| `financial-ledger` | 11 WOs | 🔴 Crítica |
| `analytics` / `analytics-observability` | 11 WOs | 🟡 Alta |
| `identity` | 10 WOs | 🟡 Alta |
| `ml-pipeline` | 9 WOs | 🟡 Alta |
| `file-storage` / `storage` | 9 WOs | 🟡 Alta |
| `support-claims` | 8 WOs | 🟡 Alta |
| `integration-gateway` | 8 WOs | 🟡 Alta |
| `privacy-consent` | 7 WOs | 🟡 Alta |
| `configuration` | 7 WOs | 🟡 Alta |
| `developer-platform` | 6 WOs | 🟢 Media |
| `auth` | 5 WOs | 🟢 Media |
| `payout` | 5 WOs | 🟢 Media |
| `realtime` | 4 WOs | 🟢 Media |
| `feature-flag` | 1 WO | 🟢 Media |
| `i18n` / `localization` | 3 WOs | 🟢 Media |
| `accessibility` | 1 WO | 🟢 Media |
| `wellness` | 1 WO | 🟢 Media |
| `rate-limit` | 2 WOs | 🟢 Media |
| `webhook` | 2 WOs | 🟢 Media |
| `role-profile` | 2 WOs | 🟢 Media |
| `biometric-security` | 3 WOs | 🟢 Media |
| `experimentation` | 1 WO | 🟢 Media |

### Módulos sin uso en WOs (domain-specific):
`chat`, `delivery-courier`, `driver-operator`, `freight-trucking`, 
`gamification`, `hauling-moving`, `host-travel`, `local-services`, 
`merchant-b2b`, `mobility-ride`, `notification(s)`, `proof-service`, 
`routing-navigation`, `scheduling`, `search`, `smart-contract`, 
`storage`, `surface-routing`, `vehicle-capability`, `carbon-sustainability`

---

## 📈 ESTADÍSTICAS GLOBALES

| Métrica | Valor |
|---|---|
| Total WOs | 75 |
| WOs con módulo existente | 75 (100%) |
| WOs marcados como ✅ Implementado | 7 |
| WOs marcados como ⬜ Pendiente | 68 |
| Módulos del proyecto | 48 |
| Módulos referenciados en WOs | 25 (52%) |
| Módulos domain-specific sin WO | 20 (42%) |
| Módulos más críticos (≥8 WOs) | 5 |
