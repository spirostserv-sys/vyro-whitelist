# VYRO — Whitelist landing page

The pre-launch whitelist / creator-access landing page for VYRO. Deliberately a
**separate project from the main app**: `vyro-app` (the PWA at `index.html`) is
served statically on its own domain, and this Next.js page gets its own.

Keeping them apart is the point — the two need different Vercel build settings,
and pointing one domain at both is what broke production before.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS. No backend.

## Local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Deploying to Vercel

Import this repo as a **new Vercel project**. Framework preset auto-detects as
Next.js (`vercel.json` pins it explicitly); no build settings need changing, and
no environment variables are required.

## What's on the page

Single route, `app/page.tsx`:

- Hero — mark, `AI-JUDGED · 1V1 · RANKED`, headline, 9:16 clip slot, stat row
- "This isn't a workout app." — how the AI judging, ladder, and rivalry work
- Launch Week Challenge — the $500 hook, badged `COMING SOON`
- How it works — four steps
- Waitlist — email capture, plus an invite-code path for creators

## Notes for whoever picks this up

- **Waitlist signups go to `localStorage`, not a server.** Nothing is collected
  anywhere real yet; wire `handleWaitlistSubmit` to a backend before launch or
  the list is per-browser and lost.
- **Creator codes are hardcoded** in `VALID_CREATOR_CODES` and validated
  client-side, so they are readable by anyone who opens devtools. Fine for a
  pre-launch page, not fine as real access control.
- **The stat row is illustrative.** The online figure is a static placeholder
  carried over from the app's welcome screen, not a live count. Leagues (3) and
  exercises (2) match what the app actually ships.
- **The 9:16 slot is empty on purpose** — a real workout clip drops in there.
