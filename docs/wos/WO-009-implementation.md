# WO-009: Versionado, Colaboración y Derechos Básicos

**Status:** ✅ Implemented  
**Module:** `file-storage` (extended)  
**Secondary:** `governance`  
**Date:** 2026-07-21

## Overview

File versioning, real-time collaboration roles, and digital rights management.

## New Entities

| Entity | Table | Description |
|--------|-------|-------------|
| FileVersion | `file_versions` | Version history with rollback |
| FileCollaborator | `file_collaborators` | Collaboration roles per file |
| FileRights | `file_rights` | Digital rights and licensing |

## New Endpoints

### Versions (`/api/file-storage/versions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create version |
| GET | `/file/:fileId` | List versions |
| GET | `/file/:fileId/current` | Current version |
| GET | `/:id` | Version details |
| POST | `/file/:fileId/revert/:versionNumber` | Revert to version |
| GET | `/compare/:v1Id/:v2Id` | Compare versions |

### Collaborators (`/api/file-storage/collaborators`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Add collaborator |
| GET | `/file/:fileId` | List collaborators |
| PATCH | `/:id/role` | Update role |
| POST | `/:id/accept` | Accept invitation |
| DELETE | `/:id` | Remove collaborator |
| GET | `/file/:fileId/permissions/:userId` | Get permissions |

### Rights (`/api/file-storage/rights`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create rights |
| GET | `/file/:fileId` | Get rights |
| GET | `/:id` | Rights details |
| PATCH | `/:id` | Update rights |
| DELETE | `/:id` | Delete rights |
