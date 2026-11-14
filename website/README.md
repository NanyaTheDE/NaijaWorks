# NaijaWorks website

The public marketing site for NaijaWorks: what it is, how a report travels from photo to confirmed fix, who handles what in Nigerian government, community impact, and what the platform offers government teams.

It is a separate Next.js app from the product in `../src`, with its own `package.json`, so it can be built and deployed on its own.

## Run

```bash
cd website && npm install && npm run dev
```

Then open http://localhost:3001.

## Deploy (Vercel)

Import the GitHub repo into Vercel and set **Root Directory** to `website`. Vercel detects Next.js; no other settings are needed.

Buttons that open the app ("Report an issue", "Try the portal demo") go to `/launching` until the app is live. When it is, set the environment variable `NEXT_PUBLIC_APP_URL` (for example `https://app.naijaworks.ng`) in Vercel and redeploy.

## Pages

| Route | What it covers |
|---|---|
| `/` | Hero with a live report tracker demo, the four promises, how it works, "Who fixes this?" explainer, before/after slider, confirmations vs. popularity, badges, government teaser, accessibility, FAQ |
| `/how-it-works` | Dated parcel-style timeline (with a delay example), the four roles, every status with meaning / who / next, "Has this actually been fixed?", privacy and safety |
| `/who-handles-what` | Federal, state, LGA and utility responsibilities, interactive explainer, transparent transfers, stalled projects, electricity routing |
| `/impact` | Impact counters, before/after gallery, transparency funnel, community score with its caveat, honest data limitations |
| `/for-government` | Portal preview, workflow, features, field apps, rejection reasons, audit log |
| `/launching` | "The app is launching soon" page that app buttons use until `NEXT_PUBLIC_APP_URL` is set |

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
