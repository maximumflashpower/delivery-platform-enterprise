# Delivery Platform Enterprise

Plataforma empresarial multi-dominio de entrega construida con **NestJS + TypeScript + TypeORM**.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Docker](#docker)
- [Testing](#testing)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API](#api)
- [Licencia](#licencia)

## Características

- ✅ 40+ módulos NestJS con arquitectura modular
- ✅ ~100 entidades TypeORM
- ✅ 275 rutas API REST documentadas
- ✅ Swagger/OpenAPI en `/docs`
- ✅ SQLite (dev) / PostgreSQL (prod)
- ✅ JWT Auth + Guards
- ✅ WebSockets (tiempo real)
- ✅ Feature Flags con rollouts
- ✅ Machine Learning Pipeline
- ✅ Biometría, Blockchain, Gamification
- ✅ Sostenibilidad y créditos de carbono

## Arquitectura

┌─────────────────────────────────────────────┐ │ API Gateway │ │ (NestJS + Express) │ ├─────────────────────────────────────────────┤ │ Foundation │ Domain Business │ │ - Identity │ - Driver Operator │ │ - Auth │ - Delivery Courier │ │ - Financial │ - Merchant B2B │ │ - Payout │ - Freight Trucking │ │ - Trust Safety │ - Host Travel │ ├─────────────────────────────────────────────┤ │ Modern Features │ Cross-Cutting │ │ - ML Pipeline │ - Notifications │ │ - Biometrics │ - Audit │ │ - Chat (WS) │ - Search │ │ - Gamification │ - Scheduling │ │ - Smart Contract│ - Governance │ │ - Wellness │ - Feature Flags │ │ - Realtime │ - Rate Limiting │ └─────────────────────────────────────────────┘

## Requisitos

- Node.js v18+
- npm v9+
- SQLite 3.x (desarrollo)
- PostgreSQL 14+ (producción)
- Docker (opcional)

## Instalación

bash
Clonar el repositorio

git clone <repo-url> cd delivery-platform-enterprise
Instalar dependencias

npm install
Copiar variables de entorno

cp .env.example .env
Iniciar en modo desarrollo

npm run start:dev

La aplicación estará disponible en:
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`
- Health: `http://localhost:3000/api/health`

## Uso

bash
Desarrollo (hot reload)

npm run start:dev
Producción

npm run build npm run start:prod
Migraciones

npm run migration:run npm run migration:generate -- src/migrations/MigrationName
TypeORM CLI

npm run typeorm -- schema:sync

## Docker

bash
Desarrollo (SQLite)

docker compose up app-dev
Producción (PostgreSQL)

docker compose --profile prod up

## Testing

bash
Tests unitarios

npm run test
Tests en watch mode

npm run test:watch
Coverage

npm run test:cov
Tests E2E

npm run test:e2e

## Estructura del Proyecto

delivery-platform-enterprise/ ├── src/ │ ├── common/ # Shared code (base entity, guards, decorators, dto) │ ├── config/ # Configuration (TypeORM, JWT, Redis, Swagger) │ ├── modules/ # Feature modules (40+) │ │ ├── accessibility/ │ │ ├── auth/ │ │ ├── chat/ │ │ ├── identity/ │ │ ├── ... │ ├── migrations/ # TypeORM migrations │ ├── app.module.ts │ └── main.ts ├── test/ │ ├── e2e/ # End-to-end tests │ ├── unit/ # Unit tests │ └── fixtures/ # Test data ├── infrastructure/ # Deployment configs │ ├── database/ │ ├── deployment/ │ └── observability/ ├── docs/ # Documentation ├── Dockerfile ├── docker-compose.yml └── package.json

## API

La API expone 275 rutas bajo el prefijo `/api`. La documentación completa está disponible en Swagger (`/docs`).

### Endpoints principales

| Módulo | Endpoint | Descripción |
|--------|----------|-------------|
| Health | `/api/health` | Estado del servidor |
| Identity | `/api/identity/*` | Usuarios, roles, sesiones |
| Auth | `/api/auth/*` | Login, registro |
| Chat | `/api/chat/*` | Mensajería en tiempo real |
| Governance | `/api/governance/*` | Políticas y compliance |
| Wellness | `/api/wellness/*` | Bienestar y actividades |

## Licencia

MIT
