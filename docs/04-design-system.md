# Design System — "Ọ̀nà" (path)

Optimistic, modern, Nigerian without being flag-themed. Warm paper background, deep green ink, sunny accents, adire-inspired line patterns used sparingly in headers and empty states.

## Colour tokens
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #F7F5EF (warm paper) | #0F1412 | page |
| `--surface` | #FFFFFF | #171D1A | cards |
| `--surface-2` | #EFEDE5 | #1F2622 | wells, chips |
| `--ink` | #10201A | #ECF1EE | text |
| `--ink-2` | #4A5852 | #A7B3AD | secondary text |
| `--line` | #E2DFD5 | #2A332E | borders |
| `--brand` | #0B7A4B (deep green) | #3FCB8A | primary actions |
| `--brand-ink` | #FFFFFF | #06130D | on brand |
| `--sun` | #F5B301 | #F7C548 | highlights, celebrate |
| `--clay` | #E2572B | #FF7A50 | urgent / safety |

### Status palette (always icon + label, never colour alone)
| Group | Colour | Statuses |
|---|---|---|
| New | Slate #64748B | Reported, Under Review |
| Confirmed | Indigo #4F46E5 | Verified, Assigned |
| Inspection | Violet #8B5CF6 | Inspection Scheduled, Inspected |
| Planned | Amber #D97706 | Work Planned, Scheduled |
| Active | Blue #0EA5E9 | In Progress |
| Done | Green #16A34A | Completed, Monitoring |
| Attention | Clay #E2572B | Reopened, Urgent |
| Blocked | Stone #78716C | Unable to Proceed |

## Typography
- Display / headings: **Bricolage Grotesque** (fallback system-ui) — characterful, friendly.
- Body / UI: **Inter** — legible on low-end Android.
- Scale: 12 / 14 / 16 (base) / 18 / 22 / 28 / 36. Line-height 1.5 body, 1.15 display. Never below 14px for content.

## Spacing, radius, grid
- 4-pt scale: 4, 8, 12, 16, 20, 24, 32, 40, 56.
- Radius: 10 (inputs, chips), 16 (cards), 24 (sheets, hero), full (pills, FAB).
- Mobile: 16px gutters, single column, bottom nav 64px + safe-area. Desktop portal: 248px sidebar, 12-col fluid content, 24px gutters.
- Elevation: one soft shadow (`0 1px 2px rgb(16 32 26 / .06), 0 4px 16px rgb(16 32 26 / .06)`); rely on borders more than shadows.

## Motion
150ms ease-out for state, 250ms for sheets; respect `prefers-reduced-motion`. Confetti only on resolved non-emergency reports the user submitted/followed.

## Components (variants)
- **Button**: primary / secondary / ghost / danger; sm / md / lg; icon-only; loading.
- **Input, Textarea, Select, Search, LocationField** (map thumbnail + "Change"), **UploadField** (camera / gallery / video / voice tiles).
- **Chip** (filter, selectable), **SegmentedControl**, **Tabs** (underline + pill).
- **Card**: base, **ReportCard** (compact / feed / list-row), **CommunityCard**, **ProjectCard**, **StatCard**, **AnnouncementCard**.
- **StatusBadge** (per status, sm/md), **SeverityBadge**, **AuthorityTag**.
- **ProgressTracker** (horizontal stepper for mobile cards, vertical with timestamps on detail).
- **Timeline** (parcel style: date column, dot, title, body, actor, optional photo / delay callout).
- **BeforeAfter** slider.
- **MapView** + **MapPin** (shape per status group), **SimpleMap** list fallback.
- **BottomNav** (5 items, raised center Report), **Sidebar**, **TopBar**.
- **Table** + **Pagination** (portal only), **Modal**, **Drawer/Sheet**, **Toast**, **EmptyState** (illustrated), **Skeleton**, **ErrorState**, **ConfirmState**.
- **Charts**: bar, line, donut, KPI tile, sparkline (portal + transparency).
