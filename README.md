# OptionPath

OptionPath is a local-first options education and simulation app. It helps users learn common options strategies, build simulated trades, inspect payoff behavior, and journal decisions without connecting to a brokerage or placing orders.

## Current Scope

- Step-by-step beginner options lessons
- Strategy library for common beginner, intermediate, and advanced templates
- Simulated strategy builder with editable option and stock legs
- Expiration payoff chart and max profit/loss summaries
- Local simulated trade journal
- Glossary and risk acknowledgements
- Import/export backup flow
- Training visuals and plain-language lesson aids
- Mock/manual market simulator for ticker-based scenario practice

## Product Boundary

This app is educational and simulation-only.

It does not:

- place trades
- connect to brokerage execution
- provide personalized investment advice
- guarantee market-data freshness
- treat modeled results as predictions

The current market simulator uses mock/manual data only. Live market-data integration is planned behind a provider adapter and should keep API keys out of the client bundle in production.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Dexie / IndexedDB
- React Router
- Vitest
- Lucide icons

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check and build production assets
npm run preview  # Preview the production build locally
npm test         # Run unit tests
```

## Main Routes

- `/` - dashboard
- `/learn` - tutorial library
- `/learn/:lessonId` - lesson steps
- `/builder` - simulated strategy builder
- `/market` - mock/manual ticker scenario simulator
- `/library` - strategy library
- `/library/:strategyId` - strategy detail
- `/journal` - saved simulated trades
- `/journal/:tradeId` - trade journal detail
- `/glossary` - options glossary
- `/settings` - backup/import/export settings

## Project Structure

```text
src/
  app/                 Router and shell layout
  data/                Seed data and static training metadata
  db/                  Dexie database, types, repositories, seed flow
  domain/              Option math, education progress, scenario calculations
  features/            Route-level app features
  services/            Market-data provider abstractions
  styles/              Global Tailwind styles
  ui/                  Shared UI primitives
specs/                 Feature specs and planning docs
public/visuals/        App visual assets
```

## Local Data

OptionPath stores lessons, progress, simulated trades, journal entries, and settings in browser IndexedDB. Data stays in the browser profile unless exported through the settings screen.

## Feature Plans

Detailed feature specs live in [`specs/README.md`](specs/README.md). The real-market simulation plan is documented in [`specs/17-real-market-simulation.md`](specs/17-real-market-simulation.md).

## Validation

Before publishing changes, run:

```bash
npm test
npm run build
```
