# Option Trading App Plan

## Product Direction

Build an intuitive options education and simulated trade-building app for people who want to learn common options trades safely before moving into advanced strategies. The first version should be a local-first web app, focused on tutorials, guided strategy construction, payoff visualization, journaling, and risk literacy.

Working product name: **OptionPath**

The MVP should not place live trades or connect to a brokerage account. It should teach users how strategies work, let them build simulated trades, and help them understand risk before any future live-trading integration.

## Primary Goals

- Make common options trades understandable through step-by-step guided flows.
- Let users build simulated trades with clear payoff, breakeven, max loss, and max profit views.
- Organize learning from beginner to advanced without overwhelming new users.
- Store progress, journals, and simulated trades locally with a durable local NoSQL database.
- Keep the app clean, fast, professional, and trustworthy.

## Target Users

- Beginners learning calls, puts, covered calls, cash-secured puts, and protective puts.
- Intermediate users learning vertical spreads, collars, and defined-risk income strategies.
- Advanced learners exploring iron condors, straddles, strangles, butterflies, calendars, diagonals, and trade adjustments.

## Design Direction

Design lane: **Neo Terminal Editorial**

The app should feel like a serious finance tool with an approachable education layer. The UI should be clean, dense enough for trading information, and visually distinctive without feeling noisy.

Design principles:

- Strong, readable typography with mono-style labels for trade metrics.
- Neutral graphite and white base palette with one electric primary accent.
- Restrained warning color for risk, assignment, and loss states.
- Compact panels, clear steppers, tabs, segmented controls, sliders, toggles, and chart surfaces.
- Purposeful motion for selected strategy states, payoff chart updates, and guided progress.
- Accessible contrast, keyboard focus states, and reduced-motion support.

## Application Architecture

Use a frontend-first modular SPA architecture.

Recommended stack:

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Dexie.js**
- **IndexedDB**
- **Zustand or lightweight React state**
- **Recharts or custom SVG payoff charts**

Suggested structure:

```txt
src/
  app/
    App.tsx
    routes.tsx
    layout/
  ui/
    Button.tsx
    Card.tsx
    Stepper.tsx
    Tabs.tsx
    Badge.tsx
    ChartShell.tsx
  features/
    dashboard/
    tutorials/
    strategy-builder/
    strategy-library/
    journal/
    glossary/
  domain/
    options/
      calculations.ts
      strategies.ts
      riskRules.ts
      payoff.ts
    education/
      progress.ts
  data/
    seedLessons.ts
    seedStrategies.ts
    sampleOptionChains.ts
  db/
    dexie.ts
    repositories/
  lib/
    formatters.ts
    ids.ts
    storage.ts
```

## Local NoSQL Database Plan

Use **Dexie.js over IndexedDB** for the MVP.

Why:

- IndexedDB is the browser-native structured local database.
- Dexie provides a cleaner API, schema versioning, indexes, and reactive queries.
- The MVP data is document-like and local-first: tutorials, progress, simulated trades, journal notes, and settings.
- A repository layer keeps the app ready for future sync without tying UI components directly to IndexedDB.

Initial local stores:

```txt
tutorials
lessons
lessonSteps
userProgress
strategyTemplates
strategyTemplateLegs
simulatedTrades
simulatedTradeLegs
journalEntries
quizAttempts
watchlists
riskAcknowledgements
appSettings
```

Example Dexie schema concept:

```ts
db.version(1).stores({
  tutorials: "id, level, order",
  lessons: "id, tutorialId, level, order",
  lessonSteps: "id, lessonId, order",
  userProgress: "id, lessonId, status, updatedAt",
  strategyTemplates: "id, level, category, outlook, riskType",
  strategyTemplateLegs: "id, strategyId, action, type",
  simulatedTrades: "id, strategyId, symbol, status, createdAt, updatedAt",
  simulatedTradeLegs: "id, tradeId, action, type, strike, expiration",
  journalEntries: "id, tradeId, createdAt, updatedAt",
  quizAttempts: "id, lessonId, createdAt",
  watchlists: "id, symbol, createdAt",
  riskAcknowledgements: "id, context, createdAt",
  appSettings: "id"
});
```

Security boundary:

- Store learning progress, local simulated trades, journals, and preferences locally.
- Do not store brokerage tokens, API keys, account credentials, or sensitive live-trading secrets in IndexedDB.
- If live brokerage trading is added later, use a backend/API layer with secure token handling, audit logs, and server-side validation.

## Core Screens

### 1. Dashboard

Purpose: orient the user and resume the next best action.

Content:

- Current learning path progress.
- Next lesson card.
- Recent simulated trades.
- Strategy confidence and risk-literacy progress.
- Watchlist preview.
- Quick entry into Strategy Builder.

### 2. Tutorial Mode

Purpose: teach options strategies step by step.

Layout:

- Lesson content on one side.
- Interactive trade builder or visual example on the other.
- Stepper navigation.
- Key terms surfaced inline.
- End-of-lesson checklist and quiz.

Beginner tutorial path:

- What is an option contract?
- Calls and puts.
- Strike, expiration, premium, intrinsic value, extrinsic value.
- Long call.
- Long put.
- Covered call.
- Cash-secured put.
- Protective put.

Intermediate tutorial path:

- Debit spreads.
- Credit spreads.
- Bull call spread.
- Bear put spread.
- Bull put spread.
- Bear call spread.
- Collar.
- Managing expiration and assignment.

Advanced tutorial path:

- Iron condor.
- Straddle.
- Strangle.
- Butterfly.
- Calendar spread.
- Diagonal spread.
- Rolling and adjustments.
- Implied volatility and Greeks.

### 3. Strategy Builder

Purpose: help users construct an educational simulated trade.

Flow:

1. Choose outlook: bullish, bearish, neutral, income, hedge.
2. Choose risk preference: defined risk, premium risk, stock-backed, cash-backed, advanced.
3. Choose experience level.
4. Choose symbol from sample data or watchlist.
5. Select expiration and strikes.
6. Review payoff chart, breakeven, max profit, max loss, and risk notes.
7. Save as simulated trade.

Expected controls:

- Segmented controls for outlook and risk type.
- Sliders or number inputs for price, strike, premium, and volatility assumptions.
- Tabs for payoff, legs, risks, and notes.
- Clear warnings for undefined-risk or assignment-sensitive strategies.

### 4. Strategy Library

Purpose: provide a browsable reference of common strategies.

Card fields:

- Strategy name.
- Skill level.
- Market outlook.
- Risk type.
- Max profit/loss summary.
- Common use case.
- Assignment risk note.
- Button to open tutorial or builder.

### 5. Simulated Trade Journal

Purpose: encourage disciplined trade planning and review.

Fields:

- Strategy.
- Symbol.
- Entry thesis.
- Expected move.
- Risk amount.
- Exit plan.
- Adjustment plan.
- Result.
- Lessons learned.

### 6. Glossary

Purpose: quick reference for options terms.

Include:

- Strike
- Premium
- Expiration
- Assignment
- Exercise
- ITM / ATM / OTM
- Intrinsic value
- Extrinsic value
- Implied volatility
- Delta, gamma, theta, vega
- Debit spread
- Credit spread
- Breakeven

## Domain Logic

Keep option calculations separate from the UI.

Core modules:

- Strategy definitions.
- Option leg model.
- Payoff calculation.
- Breakeven calculation.
- Max profit/loss calculation.
- Risk labels.
- Assignment and expiration warnings.
- Quiz/progress scoring.

Example option leg model:

```ts
type OptionLeg = {
  id: string;
  action: "buy" | "sell";
  type: "call" | "put";
  quantity: number;
  strike: number;
  premium: number;
  expiration: string;
};
```

Example simulated trade model:

```ts
type SimulatedTrade = {
  id: string;
  strategyId: string;
  symbol: string;
  underlyingPrice: number;
  status: "draft" | "open" | "closed" | "expired";
  createdAt: string;
  updatedAt: string;
};
```

## MVP Scope

MVP must include:

- App shell and navigation.
- Dashboard.
- Tutorial mode with beginner lessons.
- Strategy library grouped by beginner, intermediate, advanced.
- Strategy builder using sample option data.
- Payoff chart for core strategies.
- Local Dexie/IndexedDB persistence.
- Simulated trade journal.
- Glossary.
- Responsive desktop and mobile layouts.

MVP should exclude:

- Live brokerage connection.
- Real order placement.
- Paid market data integration.
- Account aggregation.
- Tax reporting.
- Real-time alerts.

## Future Scope

Phase 2:

- Cloud sync.
- User accounts.
- Import/export local data.
- More advanced lessons.
- Greeks visualizations.
- Scenario comparison.
- Trade adjustment simulator.

Phase 3:

- Live delayed market data.
- Paper trading integration.
- Broker order preview.
- Risk approval workflows.
- Immutable audit history.

Phase 4:

- Live brokerage execution, only with a secure backend and explicit user approval flows.

## Implementation Roadmap

### Phase 1: Foundation

- Scaffold React + TypeScript + Vite.
- Add Tailwind and base design tokens.
- Add React Router.
- Add Dexie database setup.
- Create domain models.
- Seed tutorial and strategy data.

### Phase 2: Core Experience

- Build app shell.
- Build dashboard.
- Build tutorial mode.
- Build strategy library.
- Build glossary.

### Phase 3: Trading Simulation

- Build strategy builder.
- Add option leg editing.
- Add payoff chart.
- Add risk summary.
- Save simulated trades locally.

### Phase 4: Journal and Progress

- Add journal entries.
- Track lesson progress.
- Add quiz attempts.
- Add risk acknowledgements.
- Add saved watchlist symbols.

### Phase 5: Polish and QA

- Responsive review.
- Keyboard navigation.
- Focus states.
- Reduced motion.
- Empty states.
- Error states.
- Local database migration checks.
- Visual pass on charts and dense data panels.

## Testing Plan

Unit tests:

- Payoff calculations.
- Breakeven calculations.
- Max profit/loss calculations.
- Strategy classification.
- Repository functions.

UI tests:

- Tutorial progression.
- Strategy builder flow.
- Save/load simulated trade.
- Journal creation and editing.
- Local database persistence.

Design QA:

- Desktop viewport.
- Tablet viewport.
- Mobile viewport.
- Contrast checks.
- Text overflow checks.
- Reduced-motion behavior.

## Risk and Compliance Notes

The app should consistently communicate that options involve risk and that simulated trades are educational. It should avoid promising profit, recommending specific securities, or encouraging real trades without context.

Required UX patterns:

- Risk acknowledgements before advanced strategies.
- Clear labeling of simulated data.
- Max loss and assignment warnings where relevant.
- Educational wording instead of personalized financial advice.
- No live brokerage execution in MVP.

## Definition of Done for First Reviewable Build

- User can open the app and understand where to start within a few seconds.
- User can complete a beginner tutorial.
- User can build at least one simulated long call, long put, covered call, and vertical spread.
- User can see a payoff chart and basic trade metrics.
- User can save a simulated trade locally.
- User can add a journal note.
- User can revisit progress after refreshing the browser.
- The interface feels polished, clean, and purpose-built for options education.
