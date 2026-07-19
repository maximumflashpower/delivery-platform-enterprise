# 🚀 Delivery Platform Enterprise

Plataforma empresarial multi-dominio de movilidad y logística construida con **NestJS + TypeScript + TypeORM**.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Variables de Entorno](#variables-de-entorno)
- [Testing](#testing)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Docker](#docker)
- [Licencia](#licencia)

---

## Características

- ✅ **40+ módulos NestJS** con arquitectura modular escalable
- ✅ **49 tablas** en base de datos generadas vía TypeORM
- ✅ **275+ rutas API REST** documentadas con Swagger/OpenAPI
- ✅ **SQLite** (desarrollo) / **PostgreSQL** (producción)
- ✅ **JWT Authentication** con Passport + Guards
- ✅ **WebSockets** para comunicación en tiempo real
- ✅ **Feature Flags** con rollouts percentage-based
- ✅ **Machine Learning Pipeline** con versionado de modelos
- ✅ **Biometría**, **Smart Contracts**, **Gamification**
- ✅ **Sostenibilidad** y créditos de carbono
- ✅ **Rate Limiting** con Throttler
- ✅ **Audit Logging** y **Trust & Safety**
- ✅ **i18n** con soporte multi-idioma
- ✅ **Analytics & Observability** integrados

---

## Arquitectura

┌─────────────────────────────────────────────────────┐ │ API Gateway │ │ (NestJS + Express + Swagger) │ ├─────────────────────────────────────────────────────┤ │ │ │ ┌─────────────────┐ ┌──────────────────────────┐ │ │ │ FOUNDATION │ │ DOMAIN BUSINESS │ │ │ │ │ │ │ │ │ │ • Identity │ │ • Driver Operator │ │ │ │ • Auth (JWT) │ │ • Delivery Courier │ │ │ │ • Financial │ │ • Merchant B2B │ │ │ │ • Payout │ │ • Freight Trucking │ │ │ │ • Trust Safety │ │ • Host Travel │ │ │ │ • Role Profile │ │ • Hauling Moving │ │ │ │ • Vehicle Cap. │ │ • Local Services │ │ │ │ • Mobility Ride │ │ • Support Claims │ │ │ └─────────────────┘ └──────────────────────────┘ │ │ │ │ ┌─────────────────┐ ┌──────────────────────────┐ │ │ │ MODERN FEATURES │ │ CROSS-CUTTING │ │ │ │ │ │ │ │ │ │ • ML Pipeline │ │ • Notifications │ │ │ │ • Biometrics │ │ • Audit Logs │ │ │ │ • Chat (WS) │ │ • Search Engine │ │ │ │ • Gamification │ │ • Scheduling │ │ │ │ • Smart Contract│ │ • Governance │ │ │ │ • Wellness │ │ • Feature Flags │ │ │ │ • Carbon Credit │ │ • Rate Limiting │ │ │ │ • Accessibility │ │ • Realtime Channels │ │ │ │ • Experiment. │ │ • File Storage │ │ │ │ • Analytics │ │ • i18n / Localization │ │ │ └─────────────────┘ └──────────────────────────┘ │ │ │ ├─────────────────────────────────────────────────────┤ │ TypeORM + better-sqlite3 │ │ 49 tablas / dev.db │ └─────────────────────────────────────────────────────┘

---

## Requisitos

| Requisito | Versión mínima |
|-----------|----------------|
| Node.js | v18+ |
| npm | v9+ |
| SQLite | 3.x (incluido con better-sqlite3) |
| PostgreSQL | 14+ (solo producción) |
| Docker | opcional |

---

## Instalación

bash
1. Clonar el repositorio

git clone https://github.com/maximumflashpower/delivery-platform-enterprise.git cd delivery-platform-enterprise
2. Instalar dependencias

npm install
3. Crear archivo de entorno

cp .env.example .env
4. Iniciar en modo desarrollo

npm run start:dev

Una vez iniciado, la aplicación estará disponible en:

| Servicio | URL |
|----------|-----|
| **API** | http://localhost:3000/api |
| **Swagger Docs** | http://localhost:3000/docs |
| **Swagger JSON** | http://localhost:3000/docs-json |
| **Health Check** | http://localhost:3000/api/health |

---

## Uso

### Comandos disponibles

bash
Desarrollo (hot reload con watch mode)

npm run start:dev
Build de producción

npm run build
Ejecutar build de producción

npm run start:prod
Linting

npm run lint

### Migraciones de Base de Datos

bash
Ejecutar migraciones pendientes

npm run migration:run
Generar nueva migración desde cambios en entidades

npm run migration:generate -- src/migrations/NuevaMigration
Sincronizar schema (solo desarrollo)

npm run typeorm -- schema:sync

> ⚠️ **Nota**: En modo desarrollo, `synchronize: true` está activado por defecto. TypeORM crea las tablas automáticamente al iniciar la app. No necesitas ejecutar migraciones manuales en dev.

---

## Base de Datos

### Desarrollo (SQLite)

- **Driver**: `better-sqlite3` v12.x
- **Archivo**: `dev.db` (generado automáticamente en la raíz)
- **Tablas**: 49 tablas creadas vía TypeORM synchronize
- **Tamaño típico**: ~1.1 MB (sin datos seed)

#### Tablas principales

| Categoría | Tablas |
|-----------|--------|
| **Identity** | `identity_users`, `identity_roles`, `identity_sessions`, `identity_devices`, `identity_verifications` |
| **Domain** | `domain_drivers`, `domain_couriers`, `domain_merchants`, `domain_shipments`, `domain_reservations`, `domain_claims` |
| **Financial** | `financial_accounts`, `financial_journal_entries`, `financial_journal_lines`, `payouts` |
| **Modern Features** | `wellness_goals`, `wellness_activities`, `chat_rooms`, `chat_messages`, `achievements` |
| **Infrastructure** | `audit_logs`, `notifications`, `rate_limit_buckets`, `feature_flags`, `webhook_endpoints` |

### Producción (PostgreSQL)

Cambiar la configuración en `src/config/typeorm-config.service.ts`:

typescript type: 'postgres', host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT || '5432'), username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, synchronize: false, // Usar migraciones en producción

---

## API Endpoints

La API expone **275+ rutas** bajo el prefijo `/api`. Documentación interactiva completa en Swagger (`/docs`).

### Endpoints principales

| Módulo | Base Path | Métodos | Descripción |
|--------|-----------|---------|-------------|
| Health | `/api/health` | GET | Estado del servidor |
| Auth | `/api/auth` | POST | Registro, login, refresh, logout, reset password |
| Identity | `/api/identity` | CRUD | Usuarios, roles, sesiones, dispositivos |
| Governance | `/api/governance/policies` | CRUD | Políticas y compliance |
| Chat | `/api/chat/rooms` | CRUD | Salas de mensajería en tiempo real |
| Wellness | `/api/wellness/goals` | CRUD | Objetivos de bienestar corporativo |
| Financial Ledger | `/api/financial-ledger` | CRUD+ | Cuentas, asientos, reportes (trial balance, GL) |
| Payouts | `/api/payout` | CRUD+ | Pagos, procesamiento, stats |
| Trust & Safety | `/api/trust-safety` | CRUD+ | Badges, scores, incidentes |
| Drivers | `/api/drivers` | CRUD+ | Conductores, verificación, stats |
| Couriers | `/api/couriers` | CRUD+ | Mensajeros, activación, stats |
| Merchants | `/api/merchants` | CRUD+ | Comerciantes, aprobación, tiers |
| Shipments | `/api/shipments` | CRUD+ | Envíos, tracking de estado |
| Vehicle Capability | `/api/vehicle-capability` | CRUD+ | Vehículos, capacidad, mantenimiento |
| Mobility Ride | `/api/mobility-ride` | CRUD+ | Viajes, tarifas, asignaciones |
| ML Models | `/api/ml/models` | CRUD | Versionado de modelos de ML |
| Analytics | `/api/analytics/events` | CRUD | Eventos y métricas del sistema |
| Feature Flags | `/api/feature-flags` | CRUD | Flags con rollouts |
| Experiments | `/api/experiments` | CRUD | A/B testing y experimentación |
| Accessibility | `/api/accessibility/profiles` | CRUD | Perfiles de accesibilidad |
| Smart Contracts | `/api/smart-contracts` | CRUD | Contratos inteligentes |
| Gamification | `/api/gamification/achievements` | CRUD | Logros y gamification |
| Carbon Credits | `/api/carbon/credits` | CRUD | Créditos de carbono |
| Biometrics | `/api/biometric/templates` | CRUD | Plantillas biométricas |
| Notifications | `/api/notifications` | CRUD | Notificaciones del sistema |
| Audit Logs | `/api/audit-logs` | CRUD | Logs de auditoría |
| Files | `/api/files` | CRUD | Almacenamiento de archivos |
| Languages | `/api/languages` | CRUD | Idiomas soportados |
| Configurations | `/api/configurations` | CRUD | Configuraciones del sistema |
| Search | `/api/search-*` | CRUD+ | Indexación y búsqueda |
| Scheduling | `/api/schedules` | CRUD+ | Programación de tareas |
| API Keys | `/api/integration/api-keys` | CRUD | Claves de integración |
| Webhooks | `/api/integration/webhooks` | CRUD | Webhooks entrantes |
| Realtime | `/api/realtime/channels` | CRUD | Canales en tiempo real |
| Rate Limiting | `/api/rate-limit/policies` | CRUD | Políticas de rate limiting |
| SLA Configs | `/api/sla-configs` | CRUD+ | Configuraciones de SLA |
| Claims | `/api/claims` | CRUD+ | Reclamos, tickets, status logs |
| Local Services | `/api/service-*` | CRUD+ | Servicios locales, bookings |

---

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

env
============================================
APPLICATION
============================================

PORT=3000 NODE_ENV=development
============================================
DATABASE
============================================

DB_TYPE=better-sqlite3 DB_DATABASE=dev.db
Para PostgreSQL en producción:
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=delivery_platform
============================================
JWT AUTHENTICATION
============================================

JWT_SECRET=tu-clave-secreta-super-segura JWT_EXPIRES_IN=1h JWT_REFRESH_EXPIRES_IN=7d
============================================
RATE LIMITING
============================================

THROTTLE_TTL=60000 THROTTLE_LIMIT=100
============================================
REDIS (opcional)
============================================

REDIS_HOST=localhost REDIS_PORT=6379

> ⚠️ **Importante**: El archivo `.env` está en `.gitignore` y **nunca** debe commitearse al repositorio.

---

## Testing

bash
Tests unitarios

npm run test
Tests en modo watch

npm run test:watch
Coverage report

npm run test:cov
Tests end-to-end

npm run test:e2e

---

## Estructura del Proyecto

delivery-platform-enterprise/ ├── src/ │ ├── common/ # Código compartido │ │ ├── decorators/ # Decoradores personalizados │ │ ├── entities/ # Entidades base (BaseEntity) │ │ ├── guards/ # Guards de autenticación │ │ └── interfaces/ # Interfaces compartidas │ ├── config/ # Configuraciones │ │ ├── app.config.ts # Config de la app │ │ ├── jwt.config.ts # Config de JWT │ │ ├── swagger.config.ts # Config de Swagger │ │ ├── typeorm-config.service.ts # Config de TypeORM │ │ └── ... │ ├── modules/ # Módulos de negocio (40+) │ │ ├── auth/ # Autenticación │ │ ├── identity/ # Gestión de identidad │ │ ├── governance/ # Gobernanza y políticas │ │ ├── chat/ # Mensajería en tiempo real │ │ ├── wellness/ # Bienestar corporativo │ │ ├── ml-pipeline/ # Pipeline de Machine Learning │ │ ├── biometric-security/ # Seguridad biométrica │ │ ├── financial-ledger/ # Libro contable │ │ ├── driver-operator/ # Conductores │ │ ├── delivery-courier/ # Mensajería y entregas │ │ ├── merchant-b2b/ # Comercio B2B │ │ ├── host-travel/ # Hospedaje y viajes │ │ ├── freight-trucking/ # Flete y transporte │ │ ├── support-claims/ # Reclamos y soporte │ │ ├── analytics-observability/ # Analytics │ │ └── ... # 25+ módulos adicionales │ ├── migrations/ # Migraciones TypeORM │ ├── app.module.ts # Módulo raíz │ ├── app.controller.ts # Controller raíz (health) │ └── main.ts # Entry point (bootstrap) ├── test/ # Tests │ ├── e2e/ # End-to-end tests │ └── unit/ # Unit tests ├── infrastructure/ # Infraestructura │ └── database/ # Seeds y scripts DB ├── .gitignore ├── .env.example ├── nest-cli.json ├── package.json ├── tsconfig.json └── README.md

---

## Seguridad

### Medidas implementadas

- ✅ **JWT Authentication** con access + refresh tokens
- ✅ **Rate Limiting** con Throttler (100 req / 60s por IP)
- ✅ **Audit Logging** de eventos críticos
- ✅ **Trust & Safety** con scoring e incidentes
- ✅ **.gitignore** protege credenciales y DB local

### Vulnerabilidades conocidas

GitHub Dependabot reporta vulnerabilidades en dependencias. Estas están documentadas y monitoreadas.

Revisar: https://github.com/maximumflashpower/delivery-platform-enterprise/security/dependabot

---

## Docker

### Desarrollo (SQLite)

bash
Construir y levantar

docker compose up app-dev

### Producción (PostgreSQL)

bash docker compose --profile prod up

---

## Tech Stack

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| NestJS | 10.x | Framework backend modular |
| TypeScript | 5.x | Lenguaje tipado |
| TypeORM | 1.x | ORM y migraciones |
| better-sqlite3 | 12.x | Driver SQLite (dev) |
| Passport + JWT | 10.x | Autenticación |
| Swagger | - | Documentación API |
| Throttler | 5.x | Rate limiting |
| Socket.io | - | WebSockets en tiempo real |
| Winston | - | Logging estructurado |
| class-validator | - | Validación de DTOs |

---

## Licencia

MIT
