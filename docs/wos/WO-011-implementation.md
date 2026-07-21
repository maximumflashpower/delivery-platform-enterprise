# WO-011: Votación, Asambleas y Salud Comunitaria

**Status:** ✅ Implemented  
**Module:** `governance` (completed)  
**Secondary:** `chat`, `realtime`  
**Date:** 2026-07-21

## Overview

Complete governance system with assemblies, proposals, ballots, voting, and community health metrics.

## Entities Registered

| Entity | Table | Description |
|--------|-------|-------------|
| Assembly | `assemblies` | Community assemblies |
| Proposal | `proposals` | Governance proposals |
| Vote | `votes` | Individual votes |
| Ballot | `ballots` | Voting ballots with options |
| CommunityHealthMetric | `community_health_metrics` | Community health indicators |
| ComplianceRecord | `compliance_records` | Compliance tracking |
| DomainOwner | `domain_owners` | Domain ownership |
| GovernancePolicy | `governance_policies` | Policy definitions |
| PolicyConsent | `policy_consents` | User policy consent |

## New Components (WO-011)

### BallotService (`ballot.service.ts`)
- `create()` — Create ballot with options
- `findByAssembly()` — List ballots for assembly
- `findById()` — Get ballot details
- `close()` — Close ballot with results
- `cancel()` — Cancel open ballot
- `getResults()` — Parse and return results

### BallotController (`/api/governance/ballots`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create ballot |
| GET | `/?assemblyId=` | List by assembly |
| GET | `/:id` | Ballot details |
| POST | `/:id/close` | Close ballot |
| POST | `/:id/cancel` | Cancel ballot |
| GET | `/:id/results` | Get results |

## Module Registration

All governance entities, services, and controllers are now registered in GovernanceModule:
- 9 entities in TypeOrmModule.forFeature()
- 8 services
- 8 controllers
