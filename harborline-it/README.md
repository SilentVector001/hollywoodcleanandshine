# Harborline IT — AI-powered MSP marketing site (demo + template)

A demo marketing site for **Harborline IT**, a *fictional* managed IT services company serving small
medical and dental offices in South Florida. It doubles as a reusable template: every client-specific
detail lives in **`config/brand.ts`**.

> Status: **Phase 1 of 6** (config + marketing site). The full setup, deployment and
> "launch a new client in under an hour" guide arrives in Phase 6.

## Quick start

Requires Node.js 20+.

```bash
cd harborline-it
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

Production build: `npm run build && npm run start`.

## Where things live

| Path | What it is |
| --- | --- |
| `config/brand.ts` | **The one file to edit per client**: company info, colors, logo text, services, pricing, FAQ, tone of voice, page copy |
| `src/app/` | Pages: home (`page.tsx`), `about/`, `contact/` (form + server action) |
| `src/components/sections/` | Home page sections (hero, problems, services, why us, pricing, FAQ, CTA) |
| `src/components/layout/` | Header, mobile menu, footer, demo banner |
| `src/app/icon.tsx`, `opengraph-image.tsx` | Favicon and social share image, generated from the config |

## Demo rules

- Harborline IT, its team, phone number (555-01xx) and testimonials are invented.
- Testimonials with `sample: true` always display a visible **Sample** label.
- `demo.enabled: true` shows a site-wide demo banner and blocks search-engine indexing.
- No stock photos or third-party logos: icons are hand-drawn SVGs and visuals are built in CSS.
