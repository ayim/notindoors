# ChargingSheet Power Bank Lab

A Vite + React dashboard that ranks and visualizes laptop-ready power banks, wall chargers, rental cars and their USB chrgers, and EVs. It includes burst vs sustained recharge charts, leaderboard views, and lab notes styled with neon/tactical UI cues.

## Tech stack
- React 18 with React Router 7 for routing
- Recharts for data visualizations
- Tailwind CSS for styling
- Vite for build/dev, Vitest + Testing Library for tests

## Getting started
1) Install dependencies: `npm install`
2) Run the dev server: `npm run dev` (opens on `http://localhost:5173`)
3) Run tests: `npm test`
4) Build for production: `npm run build` (artifact in `dist/`)

## Data
- Power bank datasets live in `src/data/powerbanks/`, including burst (20 min) and recharge-time series.
- Charts and scoreboards pull directly from these JSON files; update them to adjust rankings.

## Key screens
- Scoreboard/Leaderboard at `/leaderboard`
- Burst charge (20-minute energy) at `/burst-recharge`
- Recharge time curves at `/recharge-time`

## TODO
- Responsive: adapt the page for mobile breakpoints; verify charts and tables shrink gracefully.
- Leaderboard: add top-3 lists for sustained, burst, and value pick, with clear labeling.
- Layout parity: style the leaderboard to match the quick-recharge and full-recharge patterns, reusing components where possible.

