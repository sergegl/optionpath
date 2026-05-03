# 11 - Simulated Trade Journal

## Purpose

Help users practice disciplined trade planning and review by recording thesis, risks, exit plan, adjustments, outcome, and lessons learned for simulated trades.

## User Stories

- As a learner, I want to document why I entered a simulated trade.
- As a returning user, I want to review open simulated trades.
- As a learner, I want to compare my planned outcome with what happened.
- As a user, I want to keep notes private and local.

## UX Flow

Journal list:

1. User opens Journal.
2. List shows saved simulated trades grouped by status.
3. User selects a trade.
4. Detail page shows trade metrics, legs, payoff summary, and journal entries.

Journal entry:

1. User adds or edits thesis, exit plan, adjustment plan, or reflection.
2. Entry saves locally.
3. Dashboard can show journal attention prompts.

## UI Requirements

Journal list:

- Filters by status: draft, open, closed, expired.
- Search by symbol or strategy.
- Recent activity sorting.
- Empty state with Builder action.

Journal detail:

- Strategy summary.
- Leg table.
- Payoff chart.
- Risk labels.
- Notes sections:
  - thesis
  - risk plan
  - exit plan
  - adjustment plan
  - result
  - lessons learned
- Status update action.

## Data Model

```ts
type JournalEntry = {
  id: string;
  tradeId: string;
  type: "thesis" | "risk_plan" | "exit_plan" | "adjustment" | "result" | "reflection";
  body: string;
  createdAt: string;
  updatedAt: string;
};
```

Reads:

- `simulatedTrades`
- `simulatedTradeLegs`
- `journalEntries`
- `strategyTemplates`

Writes:

- `journalEntries`
- `simulatedTrades.status`

## State Rules

- Notes autosave can be added only if status is visible and recoverable.
- Manual save is acceptable for MVP.
- Deleting a simulated trade should require confirmation.
- Deleting a trade deletes or archives associated journal entries based on final UX decision.
- Closed and expired trades are still editable for reflection.

## Domain Logic

Journal displays metrics from shared options domain logic.

Journal-specific derived values:

- has exit plan
- has risk plan
- last note date
- needs review prompt

## Error and Empty States

- No trades: show Builder action.
- Trade missing: show not-found and return to Journal.
- Save failure: preserve unsaved note text in component state.
- Delete confirmation required.

## Accessibility Requirements

- Forms use visible labels.
- Long text areas have clear section headings.
- Status changes announce success/failure.
- Trade legs use table markup when tabular.
- Delete confirmation requires explicit action.

## Tests

- Lists saved trades.
- Filters by status.
- Opens journal detail.
- Creates journal entry.
- Edits journal entry.
- Updates trade status.
- Handles missing trade.
- Save failure keeps text.

## Definition of Done

- User can review a saved simulated trade.
- User can add and edit journal notes.
- Dashboard can read journal state.
- Journal remains local and private.

