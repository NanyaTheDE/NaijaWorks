# Status Architecture, Routing & Data Model

## 1. Citizen-facing statuses
Every status has: **meaning**, **who acts**, **what happens next**, **expected time**.

| Status | Meaning (plain) | Who acts | Next | SLA target |
|---|---|---|---|---|
| Reported | We've received it | Platform | Review | 1 working day |
| Under Review | Checking details & who's responsible | Gov officer | Verify / route | 3 working days |
| Verified | Confirmed as a real public issue | Gov officer | Assign | 2 days |
| Assigned | A named authority now owns it | Agency | Schedule inspection | 3 days |
| Inspection Scheduled | An inspector will visit on a date | Inspector | Visit | per date |
| Inspected | Site visited; findings recorded | Gov officer | Decide action | 5 days |
| Work Planned | Repair approved | Agency | Book a team | 7 days |
| Scheduled | Team & dates set | Field team | Start | per date |
| In Progress | Work is happening on site | Field team | Finish | per target |
| Completed | Team says it's done, with photos | Citizens | Confirm fix | 14-day window |
| Monitoring | Watching that the fix holds | Citizens + gov | Close | 14 days |
| Reopened | Citizens say it's not fixed | Gov officer | Re-inspect | 3 days |
| Unable to Proceed | Can't act now — reason always shown | Gov officer | Explained | — |

Government internal statuses add: `awaiting_info`, `routing_review`, `transferred`, `merged`, `rejected`, `awaiting_approval`, `paused`, `resolution_under_review`. Each maps to one citizen status (e.g. `routing_review → Under Review`).

**Delay record:** any date change past target creates `{originalDate, newDate, reason}` shown publicly. Vague words ("Processing", "Pending") are banned unless paired with an explanation.

## 2. Routing engine
Inputs: category, sub-type, coordinates → (state, LGA, community), road ownership layer, utility service areas, jurisdiction rules.

```
1. Resolve location → state, LGA, community, road segment (if any)
2. Find JurisdictionRules where category matches, ordered by specificity:
     road-segment rule  >  LGA rule  >  state rule  >  federal rule  >  category default
3. Electricity: lookup DisCo service area by coordinates; dangerous exposed infra → DisCo + flag NEMSA (regulator) for safety
4. Confidence = rule specificity × location certainty
     ≥ 0.75 → Automatically assigned
     0.4–0.75 → Assigned, flagged "Needs routing review"
     < 0.4 or conflicting → Triage queue
5. Joint responsibility allowed (primary + supporting agency)
6. Every transfer appends a timeline entry with a public reason
```
Example defaults (fictional/representative):
- Federal trunk roads (e.g. Lagos–Ibadan Expressway) → Federal Ministry of Works / FERMA
- State roads → Lagos State Public Works Corporation
- Local streets, markets, waste in LGA → LGA Works / Environmental dept; Lagos waste → LAWMA
- Drainage primary channels → State Ministry of Environment; secondary → LGA
- Public water → State Water Corporation
- Electricity supply / poles / transformers → DisCo by service area (e.g. Eko DisCo, Ikeja Electric)
- Streetlights on state roads → State Electricity Board / Lagos Lights; on local streets → LGA

## 3. Database model (Postgres + PostGIS)
```
users(id, phone, email?, role, locale, low_data, created_at)
citizen_profiles(user_id, display_first_name, default_identity_mode, community_id, points)
government_agencies(id, name, short_name, level[federal|state|lga|utility|regulator], state_id?, lga_id?)
departments(id, agency_id, name)
government_users(user_id, agency_id, department_id, title)
inspectors(user_id, agency_id, zone)
contractors(id, name, kind[contractor|internal_team], agency_ids[], rating_internal)
states(id, name, code)  lgas(id, state_id, name, geom)  communities(id, lga_id, name, slug, geom)
locations(id, point geom, street, landmark, community_id, lga_id, state_id, road_segment_id?)
report_categories(id, key, label_key, icon, default_urgent bool, parent_id?)
reports(id, ref, category_id, title, description, location_id, citizen_severity, validated_severity,
        priority, status_internal, status_public, identity_mode, reporter_id, agency_id?, routing_state,
        routing_confidence, merged_into_id?, people_affected_est, created_at, updated_at)
report_evidence(id, report_id, kind[photo|video|audio], url, uploaded_by, phase[before|inspection|progress|after], taken_at, gps)
report_confirmations(report_id, user_id, kind[affected|resolution_yes|partial|no|unsure], created_at)
report_followers(report_id, user_id)
assignments(id, report_id, agency_id, department_id, kind[primary|joint], state[auto|review|transferred], reason, created_at)
inspections(id, report_id, inspector_id, scheduled_date, window, priority, instructions, started_at, completed_at,
            gps, assessed_severity, outcome, findings_public, findings_internal, scope_estimate)
inspection_evidence(id, inspection_id, kind, url, taken_at, gps)
work_orders(id, ref, report_id?, project_id?, department_id, contractor_id, scope, priority, status,
            start_date, target_date, actual_completion, estimate_ngn*, funding_source*)
progress_updates(id, work_order_id, stage, percent?, note, photos[], author_id, created_at)
delays(id, subject_type, subject_id, original_date, new_date, reason_public, created_at)
projects(id, name, agency_id, location_id, description, start_date, expected_completion, stage)
project_milestones(id, project_id, name, order, status, date)
status_history(id, report_id, status_public, title, body, actor_label, at)   ← drives public timeline
announcements(id, agency_id, kind, title, body, area_geom, starts_at, ends_at)
notifications(id, user_id, kind, report_id?, title, body, read_at, created_at)
jurisdiction_rules(id, category_id, scope_type, scope_id, agency_id, priority, conditions jsonb)
community_updates(id, community_id, author_id, body, moderation_state)
resolution_confirmations → report_confirmations (kind resolution_*)
moderation_cases(id, subject_type, subject_id, reason, state, moderator_id)
audit_logs(id, actor_id, action, subject_type, subject_id, before jsonb, after jsonb, ip, at)  ← append-only
badges(id, key) / user_badges(user_id, badge_id, awarded_at)
```
`*` = internal-only columns, never serialised to public APIs.

## 4. Points & badges (anti-spam)
Points only on **verified outcomes**: report verified (+10), evidence marked useful (+5), resolution confirmation that matches consensus (+5), duplicate correctly linked (+3), stale report refreshed (+3). Zero for unverified/rejected reports. No leaderboards.
Badges: First Reporter, Neighbourhood Helper, Community Observer, Verified Reporter, Infrastructure Watcher, Local Champion.
