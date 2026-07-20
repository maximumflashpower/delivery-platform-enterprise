# 📝 WO-010: Estructura de Comunidad y Roles

> **Fecha de Implementación**: 2026-07-20  
> **Módulos**: `role-profile`, `identity` (secundario: `governance`)  
> **Estado**: ✅ Completado

---

## 🎯 Objetivos

Sistema completo de gestión de comunidades, membresías, perfiles de usuario y consensos de políticas con soporte para diferentes niveles de privacidad y verificación.

---

## 🏗️ Entidades Creadas

| Entidad | Tabla | Módulo | Descripción |
|---|---|---|---|
| `Community` | `communities` | role-profile | Comunidades públicas/privadas/moderadas con reglas y configuración |
| `CommunityMembership` | `community_memberships` | role-profile | Membresías con estados (pending, approved, suspended, banned) |
| `Profile` | `profiles` | role-profile | Perfiles de usuario con visibilidad, verificación y preferencias |
| `PolicyConsent` | `policy_consents` | governance | Consensos de políticas (términos, privacidad) con historial |

---

## 🔗 Endpoints API (22 nuevos)

### Communities
| Método | Ruta |
|---|---|
| POST | `/api/role-profile/communities` |
| GET | `/api/role-profile/communities` |
| GET | `/api/role-profile/communities/slug/:slug` |
| GET | `/api/role-profile/communities/:id` |
| PATCH | `/api/role-profile/communities/:id` |
| POST | `/api/role-profile/communities/:id/archive` |

### Memberships
| Método | Ruta |
|---|---|
| POST | `/api/role-profile/memberships/join` |
| POST | `/api/role-profile/memberships/approve` |
| POST | `/api/role-profile/memberships/reject` |
| POST | `/api/role-profile/memberships/leave` |
| POST | `/api/role-profile/memberships/suspend` |
| GET | `/api/role-profile/memberships/user/:userId` |
| GET | `/api/role-profile/memberships/community/:communityId` |
| GET | `/api/role-profile/memberships/check/:communityId/:userId` |

### Profiles
| Método | Ruta |
|---|---|
| GET | `/api/role-profile/profiles/user/:userId` |
| PATCH | `/api/role-profile/profiles/user/:userId` |
| POST | `/api/role-profile/profiles/verify/:userId` |
| GET | `/api/role-profile/profiles/:id` |
| GET | `/api/role-profile/profiles/public` |
| DELETE | `/api/role-profile/profiles/:userId` |

### Policy Consents
| Método | Ruta |
|---|---|
| POST | `/api/governance/policy-consents/record` |
| POST | `/api/governance/policy-consents/withdraw` |
| GET | `/api/governance/policy-consents/user/:user_id` |
| GET | `/api/governance/policy-consents/policy/:policy_id` |
| GET | `/api/governance/policy-consents/check/:user_id/:policy_id` |
| GET | `/api/governance/policy-consents/version/:user_id/:policy_id` |

---

## 🌱 Seeds

- 4 communities (public, private, federated)
- 7 memberships (approved, pending, with roles)
- 3 profiles (public, verified users)
- 5 policy consents (agreements and withdrawals tracked)

---

## 📊 Stats

| Métrica | Valor |
|---|---|
| Entidades nuevas | 4 |
| Services nuevos | 4 |
| Controllers nuevos | 4 |
| Endpoints API | 22 |
| Seeds | 19 registros |
| WOs totales | 11/75 |

---

## 🔗 Referencias

- **Functions**: SOCIAL-STRONG-013, 014, SOCIAL-MODERN-025, 190, 303, 251, 300
- **Previo**: WO-006
- **Siguiente**: WO-011 (Votación, Asambleas y Salud Comunitaria)
