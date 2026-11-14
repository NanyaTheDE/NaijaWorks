# NaijaWorks — Product Architecture

> Working name: **NaijaWorks** — "See it. Report it. Watch it get fixed."
> A civic infrastructure platform that turns a citizen's report into a visible, traceable government work journey.

## 1. Product surfaces

| Surface | Users | Form factor | Purpose |
|---|---|---|---|
| **Citizen App** | Citizens, Community Reps | Mobile-first web (PWA) | Report, track, confirm, explore, learn |
| **Government Operations Portal** | Gov Officers, Departments/Agencies | Desktop web | Triage, route, assign, schedule, approve, monitor |
| **Inspector App** | Field Inspectors | Mobile web (PWA, offline-tolerant) | Run inspections, capture evidence, recommend action |
| **Field Team App** | Contractors, Maintenance Teams | Mobile web (PWA) | Execute work orders, post progress, report blockers |
| **Admin Portal** | Platform Admins | Desktop web | Users, agencies, jurisdictions, routing rules, moderation, audit |
| **Public Transparency** | Anyone (no login) | Responsive web | Aggregated dashboards, public projects, public issue pages |

All surfaces live in **one Next.js monorepo app** with route groups per surface, sharing one domain layer and one design system:

```
app/
  (citizen)/        → /            home, explore, report, my-reports, community, profile, issue/[ref]
  (gov)/gov/        → /gov         dashboard, reports, inspections, work-orders, projects, analytics…
  (field)/inspector → /inspector   today, inspection/[id]
  (field)/team      → /team        jobs, job/[id]
  (admin)/admin     → /admin       users, agencies, jurisdictions, routing, moderation, audit
  (public)/data     → /data        transparency dashboards, /projects/[id]
lib/
  domain/           pure types, status machine, routing engine (no UI, no I/O)
  api/              repository interfaces + adapters (mock adapter now, HTTP adapter later)
  i18n/             en, pcm (Nigerian Pidgin); keys, not strings, in components
components/
  ui/               design-system primitives
  civic/            domain components (ReportCard, StatusBadge, Timeline, ProgressTracker…)
```

## 2. Layered architecture

```
┌──────────── UI (React Server + Client Components) ────────────┐
│  route groups per surface · design system · i18n              │
├──────────── Application services (lib/api) ──────────────────┤
│  ReportsRepo · InspectionsRepo · WorkOrdersRepo · ProjectsRepo │
│  NotificationsRepo · RoutingService · MediaService             │
│  → interface only; adapter chosen by env (mock | http)         │
├──────────── Domain (lib/domain) ──────────────────────────────┤
│  entities · status state-machine · routing rules · SLA calc    │
└───────────────────────────────────────────────────────────────┘
          ↓ later
  REST/GraphQL backend · Postgres + PostGIS · object storage
  Map tiles (OSM/Mapbox) · SMS/WhatsApp/USSD gateways · IdP (NIN/BVN-free phone OTP)
```

**Rule:** components never import mock data. They call repositories (`getReportsRepo()`), which today return seeded Nigerian mock data and tomorrow call real APIs. Map rendering sits behind a `MapView` interface so the provider (Leaflet/OSM, Mapbox, Google) is swappable; a **list-based "simple map"** fallback serves low-data mode.

## 3. Cross-cutting concerns

- **Audit:** every government state change writes `StatusHistory` (public) + `AuditLog` (internal, immutable).
- **Privacy:** reporter identity mode (`first_name | community_member | private`) is applied at the serialisation boundary; phone/address never leave the internal API.
- **Offline / low data:** drafts persisted locally (IndexedDB), queued submission on reconnect, client-side image compression (≤ 300 KB), text-first mode toggle.
- **i18n:** `en` and `pcm` from day one; keys namespaced per surface; locale-aware dates (`en-NG`).
- **Accessibility:** WCAG 2.2 AA, 44px min tap targets, status never conveyed by colour alone (icon + label).
- **Future channels:** WhatsApp / SMS / USSD / call centre map to the same `CreateReport` command; reference format `NW-<STATE>-<6 chars>` is short enough to read out on a call.

## 4. MVP scope (build order)

The single golden path, end to end:

Citizen reports → routing engine picks authority → officer verifies & assigns → inspection scheduled → inspector submits findings → officer approves work & creates work order → field team starts, posts progress → completion with evidence → before/after shown → citizens confirm fix (or reopen).

Out of MVP: real maps SDK, real auth, WhatsApp/SMS/USSD, budgets beyond a single estimate field, contractor bidding.
