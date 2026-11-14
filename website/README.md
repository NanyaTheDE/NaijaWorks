# NaijaWorks website

The public marketing site for NaijaWorks: what it is, how a report travels from photo to confirmed fix, who handles what in Nigerian government, community impact, and what the platform offers government teams.

It is a separate Next.js app from the product in `../src`, so the two can ship independently. It has no `node_modules` of its own and resolves packages from the parent folder.

## Run

From the repository root:

```bash
node node_modules/next/dist/bin/next dev website -p 3001
```

Then open http://localhost:3001. Calls to action ("Report an issue", "Try the portal demo") link to the app, set with `NEXT_PUBLIC_APP_URL` (default `http://localhost:3000`).

## Pages

| Route | What it covers |
|---|---|
| `/` | Hero with a live report tracker demo, the four promises, how it works, "Who fixes this?" explainer, before/after slider, confirmations vs. popularity, badges, government teaser, accessibility, FAQ |
| `/how-it-works` | Dated parcel-style timeline (with a delay example), the four roles, every status with meaning / who / next, "Has this actually been fixed?", privacy and safety |
| `/who-handles-what` | Federal, state, LGA and utility responsibilities, interactive explainer, transparent transfers, stalled projects, electricity routing |
| `/impact` | Impact counters, before/after gallery, transparency funnel, community score with its caveat, honest data limitations |
| `/for-government` | Portal preview, workflow, features, field apps, rejection reasons, audit log |

## Structure

```
src/content/site.ts      all copy and demo figures (swap for a CMS or the public-data API)
src/components/ui.tsx    server-safe primitives: Btn, SectionHead, PageHero, IconTile…
src/components/client.tsx  interactive bits: Header, language toggle (English / Pidgin), tracker demo,
                         before/after slider, "Who fixes this?", count-up, scroll reveal
src/components/sections.tsx  marquee, story cards, gov dashboard preview, CTA band, footer
src/components/Icon.tsx, Scene.tsx  copied from the app's design system
```

Design follows `docs/04-design-system.md` ("Ọ̀nà": warm paper, deep green, sun yellow, clay, adire-inspired patterns used sparingly). Fonts (Bricolage Grotesque, Inter) load from Google Fonts at runtime and fall back to system fonts offline. Motion respects `prefers-reduced-motion`; confetti only plays on the "Fixed" step of the demo.
