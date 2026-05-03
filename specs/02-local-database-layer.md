# 02 - Local Database Layer

## Purpose

Persist tutorials, strategy templates, user progress, simulated trades, journal entries, quiz attempts, watchlists, settings, and risk acknowledgements locally in the browser.

## Technical Choice

Use **Dexie.js over IndexedDB**.

Reasons:

- IndexedDB is durable browser-native structured storage.
- Dexie provides schema versioning, indexes, transactions, and a cleaner API.
- The MVP is local-first and document-like.
- Repository boundaries make future cloud sync possible.

## User Stories

- As a learner, I want my progress to remain after refreshing the browser.
- As a trader-in-training, I want saved simulated trades and journal notes to persist locally.
- As a privacy-conscious user, I want the app to work without creating an account.
- As a user changing devices, I want to export and import my local data later.

## Stores

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

## Schema Draft

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

## Repository API

Create repositories instead of importing Dexie directly in UI components.

```txt
db/repositories/tutorialRepository.ts
db/repositories/progressRepository.ts
db/repositories/strategyRepository.ts
db/repositories/tradeRepository.ts
db/repositories/journalRepository.ts
db/repositories/quizRepository.ts
db/repositories/settingsRepository.ts
db/repositories/riskRepository.ts
```

Repository rules:

- Return typed domain objects.
- Keep Dexie queries in repository files.
- Use transactions when saving a trade and its legs.
- Keep seed-data repair idempotent.
- Never store secrets, brokerage tokens, or API keys.

## Data Model Highlights

```ts
type EntityBase = {
  id: string;
  createdAt: string;
  updatedAt?: string;
};

type UserProgress = EntityBase & {
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  completedStepIds: string[];
  score?: number;
};

type SimulatedTrade = EntityBase & {
  strategyId: string;
  symbol: string;
  underlyingPrice: number;
  status: "draft" | "open" | "closed" | "expired";
  entryNotes?: string;
};
```

## Seed Data

Seed on first launch:

- tutorial paths
- lessons
- lesson steps
- strategy templates
- strategy template legs
- glossary terms can be static data unless user-editable later

Seed behavior:

- Use stable IDs.
- Do not overwrite user progress.
- Allow seed repair if required records are missing.

## State Rules

- Local database is the source of truth for persisted user data.
- In-memory state can cache active builder selections, but saved trades must come from repositories.
- Use optimistic UI only when a repository operation can be rolled back or retried.
- Database version upgrades must preserve user-created records.

## Error and Empty States

- Storage blocked or unavailable.
- Quota exceeded.
- Corrupt import data.
- Missing seed data.
- Failed transaction while saving a trade.

Each error should produce a user-facing message with a recovery path.

## Accessibility Requirements

- Database error dialogs must be reachable by keyboard.
- Status messages should use appropriate live regions only when action is required.
- Do not auto-dismiss critical persistence errors.

## Tests

- Creates database and stores.
- Seeds initial content once.
- Seed repair does not duplicate records.
- Saves and loads simulated trades with legs.
- Saves and loads progress.
- Saves and loads journal entries.
- Handles transaction failure without partial trade data.
- Migration test from version 1 to next schema version when added.

## Definition of Done

- UI components do not import Dexie directly.
- Refreshing the app preserves progress, trades, and journal entries.
- Seed data is stable and idempotent.
- Error states are handled.
- No secret or live brokerage credential fields exist.

