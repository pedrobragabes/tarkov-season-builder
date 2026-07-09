# Tarkov Season Builder

Unofficial Escape from Tarkov seasonal modifier build planner.

The first supported season is **Season 1: Kord Breach**. The app lets players plan a modifier build before playing by clicking traits directly on the official modifier board image, tracking available points, and blocking incompatible traits.

## Features

- Global modifiers are always active.
- Builds start with 0 available points.
- Negative modifiers add points.
- Positive modifiers spend points.
- Positive modifiers cannot be selected without enough points.
- Opposite traits block each other, such as stamina buffs versus stamina debuffs.
- Selected traits use a stronger highlight color.
- Build state is stored in the URL hash so it can be shared.
- Uses the official Kord Breach modifier image as the clickable build board.

## Tech Stack

- Next.js
- React
- CSS Modules through the App Router global stylesheet
- Vercel-ready deployment

## Getting Started

Install dependencies:

```bash
npm install
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

## Future Seasons

This repository is intended to support future Escape from Tarkov seasons in the same app instead of creating a separate repository for each season. A later update can move season data into separate files, for example:

```txt
seasons/
  kord-breach.js
  season-two.js
```

Then the UI can expose a season selector while keeping one domain, one Vercel project, and one codebase.

## Disclaimer

This is an unofficial fan project. Escape from Tarkov and related names, images, and trademarks belong to Battlestate Games. Modifier values may change before or during a season for balancing reasons.
