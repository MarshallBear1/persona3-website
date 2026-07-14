# Consumer Health Hackathon Portal

A desktop-first event portal for the Consumer Health Hackathon, built as a game-inspired React experience.

**Live site:** [persona3-website-inky.vercel.app](https://persona3-website-inky.vercel.app)

## Features

- Animated game-style start screen and event menu
- Hackathon brief, judging scheme, prizes, and schedule
- Player creation with role selection and access-code gating
- Team creation, matching, roster, and submission workspace
- Sponsor-credit claim instructions
- Playable medical support centre with ticket submission
- Desktop-only access gate for phones and tablets

## Development

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Acknowledgements

- UI starting point: [blairxu13/persona3-website](https://github.com/blairxu13/persona3-website)
- Medical support mini-game engine: [JSLegendDev/Pokemon-p5js](https://github.com/JSLegendDev/Pokemon-p5js), with its MIT license and upstream notes retained in `public/help-game/`
