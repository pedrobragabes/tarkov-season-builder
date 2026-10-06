# Tarkov Season Builder

Unofficial Escape from Tarkov seasonal modifier build planner.

The first supported season is **Season 1: Kord Breach**. The app lets players plan a modifier build before playing by clicking traits directly on the supplied modifier board image, tracking available points, and blocking incompatible traits.

## Features

- Global modifiers are always active.
- Builds start with 0 available points.
- Negative modifiers add points.
- Positive modifiers spend points.
- Positive modifiers cannot be selected without enough points.
- Opposite traits block each other, such as stamina buffs versus stamina debuffs.
- Selected traits use a stronger highlight color.
- Build state is stored in the URL hash so it can be shared.
- Share links can be copied directly.
- Build summaries can be copied as text.
- Selected builds can be downloaded as a highlighted PNG.
- Uses the Kord Breach reference image supplied with this repository as the clickable build board.

## Tech Stack

- Next.js
- React
- Global CSS through the App Router
- Vercel-ready deployment

## Getting Started

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal.

Build for production:

```bash
npm run build
```

## Project Structure

```txt
app/
  globals.css
  layout.jsx
  page.jsx
public/
  kord-breach-reference.png
```

## Data snapshot and future seasons

`lib/kord-breach.mjs` holds the existing Season 1 dataset, board geometry and pure planning rules. Modifier values, effects, conflicts and the two original image files were preserved. This is a supplied snapshot, not a live feed or confirmation of current in-game balance. Verify values in-game before relying on a build. A search restricted to official Tarkov/BSG domains did not return a current modifier table on 2026-10-05; no later season, schedule or balance values were invented.

Additional seasons need a provided or authoritative dataset and a matching board before a selector can be implemented. Existing comma-separated share hashes remain compatible. Hash changes and reloads normalize unknown, duplicate, conflicting and unfunded selections; hashes longer than 4096 characters are ignored.

## Validation and maintenance

Requires Node.js 24.13 or later. Dependencies are pinned to Next.js 16.3.8 and React/React DOM 19.2.8. The full npm audit changed from five findings (including one critical) to zero. Eight Node tests cover points, compatibility, board contracts and 1000 deterministic input combinations. Six browser scenarios verify hash updates, clipboard success/failure, funding removal, reload/reset, responsive accessibility and a real 2397×2149 PNG. These scenarios passed both development and local production; six Axe checks cover empty/selected states at 1440, 390 and 320 pixels. Axe does not certify complete accessibility or embedded image text.

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

CI runs tests and browser scenarios against the production build on Linux, audits dependencies and scans secrets. Playwright/Axe are test-only dependencies that verify actual browser clipboard, hash navigation, layout and downloads without a custom fake browser. Windows/Chromium was used locally; hosted deployment and other browsers require separate verification. Native clipboard denial reports an error; the legacy copy fallback also checks the browser result and restores focus.

## Disclaimer

This is an unofficial fan project. Escape from Tarkov and related names, images, and trademarks belong to Battlestate Games. Modifier values may change before or during a season for balancing reasons.
