# Roles, Sitemap & Journeys

## 1. User roles

| Role | Key permissions | Surface |
|---|---|---|
| **Citizen** | Report, confirm ("I'm affected too"), add evidence, follow, confirm resolution, choose public identity | Citizen |
| **Community Representative** | Citizen + post community updates, flag stale reports, endorse urgency (weighted, not decisive) | Citizen |
| **Government Officer** | Triage, verify, reject (with reason), merge, transfer, assign inspector, schedule, approve work, public updates, internal notes | Gov Portal |
| **Department / Agency Admin** | Manage its officers, inspectors, contractors, SLAs; sees only its jurisdiction | Gov Portal |
| **Field Inspector** | See assigned inspections, capture evidence (GPS + timestamp), assess, recommend outcome | Inspector App |
| **Contractor / Maintenance Team** | See assigned work orders, start/pause, progress, blockers, extension requests, completion evidence | Field Team App |
| **Platform Administrator** | Users, agencies, jurisdictions, routing rules, categories, moderation, audit logs | Admin |
| Optional orgs: LGA / State / Federal officials, Utilities (DisCos, Water Boards), CDAs, NGOs | scoped variants of the above | — |

Authorisation is **role × jurisdiction scope** (e.g. Officer @ Lagos State Public Works sees reports routed to that agency; Inspector sees only own inspections).

## 2. Sitemap

### Citizen (bottom nav: Home · Explore · **Report** · My Reports · Community)
```
/onboarding            welcome → language → location → notifications
/                      Home feed
/explore               Map + list, filters
/report                5-step flow: category → evidence → location → details (+severity) → review
/report/success/[ref]
/issue/[ref]           Public issue page: tracker, timeline, before/after, confirm
/issue/[ref]/confirm-fix
/my-reports            tabs: Active · Resolved · Following
/community/[slug]      Community page
/impact                Impact + before/after gallery
/notifications
/profile               identity prefs, language, low-data mode, badges, impact
/learn                 "Who handles what?"
/projects/[id]         Public project details
```
### Government portal (sidebar)
`/gov` Dashboard · `/gov/reports` · `/gov/reports/[ref]` · `/gov/inspections` · `/gov/work-orders` · `/gov/work-orders/[id]` · `/gov/projects` · `/gov/schedule` · `/gov/map` · `/gov/communities` · `/gov/contractors` · `/gov/departments` · `/gov/analytics` · `/gov/announcements` · `/gov/settings`
### Inspector
`/inspector` (Today · Upcoming · Urgent · Done) · `/inspector/[id]` · `/inspector/[id]/submit`
### Field team
`/team` (Assigned · In progress · Done) · `/team/[id]`
### Admin
`/admin` users · agencies · jurisdictions · LGAs/communities · categories · routing rules · moderation · audit log

## 3. Citizen journey
1. Notices a problem → opens app (Home shows big **Report an issue** button).
2. Picks a category tile (15 icons). Urgent categories show the emergency banner.
3. Adds photo/video/voice (optional, encouraged; compressed in low-data mode).
4. Confirms location (GPS → pin on map → shows Street, Community, LGA, State). **Duplicate check runs here** → "This may already be reported" → *I'm affected too / Add photo / Follow / Different problem*.
5. Title + smart prompts (how long? blocking access? safety risk?) + AI "Help me describe" → severity chips.
6. Review & choose public identity → Submit.
7. Success: reference, likely authority with plain-language reason, next expected update ("within 3 working days").
8. Receives notifications at each step; opens the issue page to see parcel-style timeline.
9. On completion: before/after slider, "Has this actually been fixed?" → Yes / Partially / No / Can't confirm. Confetti only for non-emergency resolved reports.

## 4. Government workflow
```
New → [Verify] → Verified → [Route/Assign] → Assigned
   ↘ [Reject + reason] → Closed (friendly explanation to citizen)
   ↘ [Merge] → merged into parent (confirmations + followers carried over)
   ↘ [Transfer] → new agency (visible in timeline)
   ↘ [Request info] → Awaiting citizen
Assigned → [Schedule inspection: inspector, date, window, priority, notes] → Inspection Scheduled
Inspected → [Review findings] → Approve work (create Work Order: scope, team, start/target dates, estimate, funding source*)
          → Request re-inspection | Escalate | No action (explained)
Work Order → Scheduled → In Progress → Completed (requires photos + note + date)
Completed → Monitoring (citizen confirmations, 14 days) → Closed | Resolution under review → Reopened
```
*internal only.

## 5. Inspector workflow
Today list (sorted by priority & route) → open inspection → Navigate → **Start inspection** (auto GPS + time stamp) → photos/video/notes → confirm problem or mark invalid → assess severity → outcome (No action / Maintenance / Repair / Replacement / Major project / Emergency / Transfer) → scope estimate → **Submit**. Works offline; syncs when connected.

## 6. Contractor / maintenance workflow
Assigned job → directions → **Start job** (citizens see "Work has started") → progress updates (stage-based: Started / About halfway / Nearly done — percentages optional) with photos → report blocker / request extension (requires reason; feeds Delay record) → **Mark complete** (photos + note required) → officer verifies → citizen confirmation opens.
