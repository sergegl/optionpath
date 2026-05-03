# 15 - Import, Export + Backup

## Purpose

Allow users to back up, restore, reset, and move their local app data without requiring an account.

## User Stories

- As a local-first user, I want to export my progress and journal.
- As a user changing browsers or machines, I want to import my saved data.
- As a learner experimenting with the app, I want to reset local data.
- As a privacy-conscious user, I want to know what data is exported.

## UX Flow

Export:

1. User opens Settings.
2. User selects Export local data.
3. App builds JSON export.
4. User downloads file.

Import:

1. User selects Import local data.
2. App validates file format and version.
3. App previews data counts.
4. User chooses merge or replace.
5. App writes data transactionally.

Reset:

1. User selects Reset local data.
2. App shows confirmation.
3. User confirms.
4. App clears user data and restores seed content.

## Export Contents

Include:

- app version
- export timestamp
- schema version
- user progress
- simulated trades
- simulated trade legs
- journal entries
- quiz attempts
- watchlists
- risk acknowledgements
- app settings

Exclude:

- secrets
- brokerage credentials
- API keys
- any data not stored by MVP

## Data Model

```ts
type AppExport = {
  appName: "OptionPath";
  appVersion: string;
  schemaVersion: number;
  exportedAt: string;
  data: {
    userProgress: UserProgress[];
    simulatedTrades: SimulatedTrade[];
    simulatedTradeLegs: OptionLegRecord[];
    journalEntries: JournalEntry[];
    quizAttempts: QuizAttempt[];
    watchlists: WatchlistItem[];
    riskAcknowledgements: RiskAcknowledgement[];
    appSettings: AppSettings[];
  };
};
```

## State Rules

- Export is read-only.
- Import validates before writing.
- Replace mode clears user data before importing.
- Merge mode preserves existing records unless imported record has newer `updatedAt`.
- Seed content is restored after reset.
- Failed import must not leave partial data.

## Validation Rules

- Require known `appName`.
- Require supported schema version.
- Validate required arrays.
- Validate IDs and foreign key relationships where practical.
- Reject files that are too large for reasonable local import.

## Error and Empty States

- Invalid file type.
- Unsupported schema version.
- Corrupt JSON.
- Import conflict.
- Transaction failure.
- Export failure due to browser limitation.

## Accessibility Requirements

- File input has visible label.
- Import preview uses readable counts.
- Reset confirmation is explicit and keyboard accessible.
- Success and failure messages are announced.

## Tests

- Exports expected data.
- Export excludes seed-only data where appropriate.
- Rejects invalid JSON.
- Rejects unsupported schema.
- Imports valid data in replace mode.
- Imports valid data in merge mode.
- Failed import rolls back.
- Reset clears user records and restores seeds.

## Definition of Done

- User can export local app data.
- User can import compatible data.
- User can reset local data safely.
- No secret fields are included in export format.

