# NaijaWorks

**See it. Report it. Watch it get fixed.** A civic infrastructure platform for Nigeria: citizens report problems like bad roads, broken streetlights and blocked drains. Government teams verify, route, inspect, schedule, repair and close each report in the open.

Built with **Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4**.

## Run it

Node 22 is installed locally at `~/.local/node`. Add it to your PATH, then:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

```bash
npm run dev
```

Open http://localhost:3000. Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

Use the **Viewing as** switcher to move between the five surfaces:

| Surface | Route | What to try |
|---|---|---|
| Citizen app | `/` | Onboarding → Home → **Report** (5 steps, duplicate check, "Help me describe") → track the issue |
| Government portal | `/gov` | Pipeline → open a report → Verify → Assign → Schedule inspection → Approve work. Also: post project updates, publish announcements, add contractors |
| Field inspector | `/inspector` | Start inspection (GPS and time recorded) → photos → outcome → submit |
| Field team | `/team` | Start job → progress stage → report delay → mark complete with evidence |
| Public data | `/data` | Aggregated transparency dashboard |

All surfaces share one store, kept in the browser's `localStorage`, so one report moves through every role. *Reset demo data* is on the Profile screen.

## Code map

```
src/
  app/
    (citizen)/          / · explore · report · report/success/[ref] · issue/[ref] · my-reports
                        community/[slug] · impact · notifications · profile · learn · projects/[id]
    gov/                layout (sidebar) · dashboard · reports · reports/[ref] · inspections · work-orders
                        work-orders/[id] · projects · map · analytics · communities · contractors · announcements · audit
    inspector/          today list · [ref] inspection form
    team/               jobs · [id] job
    data/               public transparency page
    globals.css         Tailwind v4 + design tokens (@theme) + component classes (@layer components)
  lib/
    domain/             pure logic and types: statuses, categories, routing engine
    api/repo.ts         Repository interface + MockRepository (seeded, localStorage)
    api/seed.ts         fictional Nigerian mock data; only the mock adapter imports it
    store.tsx           React provider: repository, toasts, modal, confetti
    i18n.ts             English + Naija Pidgin (useT hook)
  components/
    civic/              StatusHero, StatusBadge, ReportRow, Timeline, ProgressTracker, BeforeAfter, MapPin…
    gov/                queues and officer action forms
    shells/             CitizenShell, PortalShell, FieldFrame, RoleSwitcher
    ui/                 Icon, Scene (illustrated evidence placeholders)
```

**Connecting a real backend:** add an `HttpRepository` that implements the `Repository` interface in `src/lib/api/repo.ts`, and create it in `StoreProvider` instead of `MockRepository.load()`. Screens only use the interface.

## Docs

- [docs/01-product-architecture.md](docs/01-product-architecture.md): surfaces, layers, MVP scope
- [docs/02-roles-sitemap-journeys.md](docs/02-roles-sitemap-journeys.md): roles, sitemap, workflows
- [docs/03-status-routing-data.md](docs/03-status-routing-data.md): statuses, routing engine, database model
- [docs/04-design-system.md](docs/04-design-system.md): tokens, type, components
- [docs/05-mobbin-research.md](docs/05-mobbin-research.md): UI research and the redesigns it led to

## Prototype

`prototype/` holds the original zero-dependency version (plain ES modules, run with `python3 serve.py` on port 5173). It is kept for reference; the Next.js app replaces it.

## Known limits

- Data is mock and lives in each browser. There is no backend or auth yet.
- Photos you upload are real (compressed in the browser). Seed photos and the map are illustrations, not real imagery or map tiles.
- Analytics and the public data page use illustrative historical numbers on top of live mock data.
- On this Mac, `curl` can't resolve hostnames (a system DNS issue, possibly the NetBird VPN client), but Node and npm can. Node 22 was downloaded through Python and checked against the official checksum.
