# Harborline IT — AI-powered MSP marketing site (demo + template)

A demo marketing site for **Harborline IT**, a *fictional* managed IT services company serving small
medical and dental offices in South Florida. It doubles as a reusable template: every client-specific
detail lives in **`config/brand.ts`**.

> Status: **Phase 2 of 6** (config + marketing site + IT Risk Check lead magnet). The full setup, deployment and
> "launch a new client in under an hour" guide arrives in Phase 6.

## Quick start

Requires Node.js 20.19+ (22 LTS recommended).

```bash
cd harborline-it
cp .env.example .env.local
npm install            # also generates the Prisma client
npm run db:push        # creates the local SQLite database (dev.db)
npm run dev            # http://localhost:3000
```

Production build: `npm run build && npm run start`.

Browse saved leads in a local database UI: `npm run db:studio`.

## Where things live

| Path | What it is |
| --- | --- |
| `config/brand.ts` | **The one file to edit per client**: company info, colors, logo text, services, pricing, FAQ, tone of voice, page copy |
| `src/app/` | Pages: home (`page.tsx`), `about/`, `contact/`, `risk-check/` (quiz + report) |
| `prisma/schema.prisma` | Database tables: `Lead`, `RiskAssessment`, `ContactRequest` |
| `src/lib/` | Database client, lead saving, Risk Check scoring, form validation |
| `src/components/sections/` | Home page sections (hero, problems, services, why us, pricing, FAQ, CTA) |
| `src/components/layout/` | Header, mobile menu, footer, demo banner |
| `src/app/icon.tsx`, `opengraph-image.tsx` | Favicon and social share image, generated from the config |

## IT Risk Check (lead magnet)

`/risk-check` asks 10 questions defined in `brand.riskCheck.questions`. Each answer has points;
the score is points earned ÷ points possible × 100, and `brand.riskCheck.bands` turns the score into a
label ("Well protected", "At risk", ...). After the last question, the visitor sees their score and enters
name, business, email and phone to unlock the full report at `/risk-check/report/<id>`.

- The server recomputes the score from the answers; the browser's number is only a preview.
- One `Lead` per email address. Retakes add another `RiskAssessment` to the same lead.
- Each assessment stores a snapshot of the questions and answers, so editing the quiz later never breaks old reports.
- The contact form also saves to the database (`Lead` + `ContactRequest`).

## Demo rules

- Harborline IT, its team, phone number (555-01xx) and testimonials are invented.
- Testimonials with `sample: true` always display a visible **Sample** label.
- `demo.enabled: true` shows a site-wide demo banner and blocks search-engine indexing.
- No stock photos or third-party logos: icons are hand-drawn SVGs and visuals are built in CSS.
