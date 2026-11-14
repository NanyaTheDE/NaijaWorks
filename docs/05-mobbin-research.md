# UI research (Mobbin)

Four searches covering the screens where NaijaWorks most needs to feel trustworthy and easy to use. All mobile references are iOS.

## 1. Tracking a report: borrow from delivery tracking

The core promise ("I know what is happening and when") is the same one delivery apps make.

| Reference | What it does |
|---|---|
| [Talabat](https://mobbin.com/screens/06aced2d-ab5a-4169-b943-823630279351) | A top card with a big time estimate, an **On time** pill and a 4-icon stage bar. The full step list sits underneath in a sheet. |
| [Keeta](https://mobbin.com/screens/56299fbf-b2d0-48be-867d-c434ca5af134) | A big arrival window, an **On time** pill and an icon stage bar. The current step is written as a sentence: "Courier on the way to restaurant". |
| [Grab](https://mobbin.com/screens/f35fb2cc-a9f1-42ee-b8e2-889f5ab93b22) | An estimate, a status line and a promise: "We'll let you know when…" |
| [Bolt Food](https://mobbin.com/screens/9509b853-f44c-425e-81c0-c6e96efffe2c), [Shopee](https://mobbin.com/screens/5bd9141f-8c16-4f6b-b743-5ca9b64fe0ce) | A vertical timeline with times in a left column, newest event highlighted. |
| [Walmart](https://mobbin.com/screens/da5c3b1c-2ff5-424f-ab22-dd8009a58e7f), [CVS](https://mobbin.com/screens/6ade5a53-e2a8-423e-b5d9-c135e5bf010c) | A large "Arrives today by 10pm" headline above 4 named stages. |

**Gap in NaijaWorks:** the issue page opened with a full-width photo, and the answer to "what's happening and when?" sat below the fold in a text card.
**Change:** a **status hero card** at the top of the issue page. It shows a big date headline ("Repair by 17 Nov", "Inspection Sat 16 Nov", "Fixed 14 Nov"), an **On track / Delayed / Fixed** pill, a 5-stop icon tracker (Reported → Verified → Inspected → Repair → Fixed) and one plain sentence about what happens next. The detailed timeline stays below.

## 2. Exploring nearby issues: full-bleed map

| Reference | What it does |
|---|---|
| [Places](https://mobbin.com/screens/a975205e-1d5d-48a8-b153-0ad30ccf710a), [Hypelist](https://mobbin.com/screens/cb4a036b-6de9-4a20-9939-8448ae0e613a) | Edge-to-edge map, a floating search bar and filter chips, and a swipeable card for the selected place at the bottom. |
| [Strava](https://mobbin.com/screens/2beaf9fe-79fd-47d7-af98-18b94aee1930) | Floating filter chips, a locate button on the right, a bottom card plus a "118 Routes" sheet handle. |
| [Tabby](https://mobbin.com/screens/5617ab31-7cb2-4aa9-8eb8-707f8e098266) | Floating search and category chips, with a list sheet under the map. |

**Gap:** the map sat in a boxed card under a tall stack of header, search and two chip rows, so it used less than half the screen.
**Change:** an edge-to-edge map with a floating search bar and status chips, a "locate me" button, and a **horizontal card carousel** at the bottom. The tapped pin's card comes first. The list view and low-data mode stay as they were.

## 3. Reporting flow: what we already do well

[Meta AI](https://mobbin.com/flows/44569ba4-dec4-4bf4-9077-1812baf4dbcd), [7-Eleven](https://mobbin.com/flows/4d23bdc2-dde5-4f4b-bfb7-e76c70049093) and [eBay](https://mobbin.com/flows/effcc570-74f3-42b0-93e6-187051aa54bc) all use selectable chips for "what's it about", a dashed photo drop area and a thank-you confirmation. NaijaWorks already does this, and goes further with large visual category tiles, a duplicate check and a next-step screen. **No change.** One thing to keep: 7-Eleven's upload area states its size limit, which fits our low-data mode.

## 4. Government dashboard: show the pipeline, not loose numbers

| Reference | What it does |
|---|---|
| [Jobber](https://mobbin.com/screens/56a6ce1c-8d71-4c1a-89cb-1d07f075424a) | A **Workflow** strip of connected stage cards (Requests → Quotes → Jobs), each with a coloured top edge, a big count and 2 sub-counts ("Overdue (0)"). There's also an activity feed. |
| [Zendesk](https://mobbin.com/screens/0e224b7e-5a88-4339-820d-0658dfb2958c), [Gorgias](https://mobbin.com/screens/3106fddc-e451-4ab5-b899-5794bbceccee) | One clean KPI row above the charts. |
| [Klaviyo](https://mobbin.com/screens/44b25083-c1d3-4b7c-8475-9458ac688882) | Resolved, average response time and average resolution time as three side-by-side cards. |

**Gap:** 9 KPI tiles all looked the same, so an officer couldn't see where work was piling up.
**Change:** a **workflow pipeline** (New → Verified → Inspection → Work → Done), coloured by status group. Each stage card has its count and two "needs action" sub-counts (urgent, overdue, awaiting decision…) and links to that queue. A **Recent activity** feed is added below.
