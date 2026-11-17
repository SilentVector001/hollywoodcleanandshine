# Harborline IT — AI-powered MSP marketing site (demo + template)

A demo marketing site for **Harborline IT**, a *fictional* managed IT services company serving small
medical and dental offices in South Florida. It doubles as a reusable template: every client-specific
detail lives in **`config/brand.ts`**.

> Status: **Phase 3 of 6** (config + marketing site + IT Risk Check + AI chat assistant). The full setup, deployment and
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
| `prisma/schema.prisma` | Database tables: `Lead`, `RiskAssessment`, `ContactRequest`, `ChatSession`, `ChatMessage` |
| `src/lib/` | Database client, lead saving, Risk Check scoring, form validation |
| `src/lib/assistant/` | Chat assistant: knowledge sheet, Claude call, free demo mode, rate limits |
| `src/app/api/chat/` | Chat endpoint and the in-chat "book a call" endpoint |
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

## AI chat assistant

A chat button sits on every page. The assistant answers **only** from `config/brand.ts` (company facts,
services, pricing, FAQ, onboarding steps, Risk Check), keeps answers short, never invents prices or
promises, and offers a free 15-minute call when a visitor shows interest. An in-chat form collects
name, business, email, phone and a preferred time. Every conversation is saved (`ChatSession` +
`ChatMessage`) and linked to the lead once we know who it is, including visitors who took the
Risk Check earlier in the same browser.

**Two modes, chosen automatically:**

| | Demo mode (default) | Live AI mode |
| --- | --- | --- |
| When | `ANTHROPIC_API_KEY` is empty | `ANTHROPIC_API_KEY` is set |
| How it answers | Matches the question to the closest FAQ/config entry (keywords + synonyms) | Claude reads the full config as a fact sheet and answers in its own words |
| Cost | Free | Pay-as-you-go Anthropic API usage (typically a few cents per conversation) |
| Shows | A "Demo mode" notice in the chat | No notice |

To turn on live AI: create a key at console.anthropic.com, add it to `.env.local`
(`ANTHROPIC_API_KEY=...`), and restart `npm run dev` (or rebuild/redeploy in production).
The model defaults to `claude-opus-5-5` and can be changed with `ANTHROPIC_MODEL`.

**Built-in safeguards:** 600-character message cap; 30 messages per conversation; 10 new
conversations and 60 messages per visitor per hour (visitor IPs are stored only as salted hashes);
a polite fallback with the phone number if the AI is unavailable. Tune these in
`src/lib/assistant/guard.ts`.

## Shareable static preview

`npm run build && npm run preview:build` writes `preview/dist/index.html`: one self-contained page
that runs entirely in the browser (no server or database). It reuses the real components; the
Risk Check and chat run in demo mode and nothing is saved. Handy for sending a quick look to
someone before the site is deployed. The real site is unaffected.

## Demo rules

- Harborline IT, its team, phone number (555-01xx) and testimonials are invented.
- Testimonials with `sample: true` always display a visible **Sample** label.
- `demo.enabled: true` shows a site-wide demo banner and blocks search-engine indexing.
- No stock photos or third-party logos: icons are hand-drawn SVGs and visuals are built in CSS.
