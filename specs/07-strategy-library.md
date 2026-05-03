# 07 - Strategy Library

## Purpose

Provide a browsable catalog of common options strategies with clear summaries, filters, educational notes, and links into tutorials or the strategy builder.

## User Stories

- As a beginner, I want to find strategies that match my skill level.
- As an intermediate user, I want to filter strategies by outlook and risk type.
- As a learner, I want a quick explanation of how each strategy works.
- As a user, I want to open a strategy directly in the builder.

## Strategy Groups

Beginner:

- Long call
- Long put
- Covered call
- Cash-secured put
- Protective put

Intermediate:

- Bull call spread
- Bear put spread
- Bull put spread
- Bear call spread
- Collar

Advanced:

- Iron condor
- Long straddle
- Long strangle
- Butterfly
- Calendar spread
- Diagonal spread

## UI Requirements

Library view:

- Search input.
- Level filter.
- Outlook filter.
- Risk type filter.
- Strategy cards grouped by level.

Strategy card fields:

- name
- level
- outlook
- risk type
- debit/credit label
- max loss summary
- assignment risk badge if relevant
- primary action: Build
- secondary action: Learn

Detail view:

- Strategy overview.
- When traders use it.
- Legs.
- Payoff behavior.
- Max profit/loss summary.
- Breakeven formula.
- Risks and assignment notes.
- Related lessons.

## Data Model

```ts
type StrategyTemplate = {
  id: string;
  name: string;
  slug: string;
  level: "beginner" | "intermediate" | "advanced";
  category: "directional" | "income" | "hedge" | "volatility";
  outlook: "bullish" | "bearish" | "neutral" | "volatile" | "hedge";
  riskType: "defined" | "premium" | "stock_backed" | "cash_backed" | "undefined";
  tradeStyle: "debit" | "credit" | "stock_plus_option" | "multi_leg";
  summary: string;
  useCase: string;
  maxProfitText: string;
  maxLossText: string;
  breakevenText: string;
  assignmentRisk: "none" | "possible" | "material";
  requiredAcknowledgementContext?: string;
};
```

## State Rules

- Filters are local UI state.
- Search matches name, category, outlook, and summary.
- Advanced strategies remain visible even if acknowledgement is required; builder action can be gated.
- Strategy templates are seed data and should not be user-editable in MVP.

## Domain Logic

Library displays strategy metadata. Calculations belong in the options domain module and are invoked for examples only.

## Error and Empty States

- No filter results: show clear reset filters action.
- Strategy missing: show not-found and link back to Library.
- Template data invalid: hide builder action and show developer-safe fallback.

## Accessibility Requirements

- Filter controls have labels.
- Strategy groups use semantic headings.
- Cards must be reachable by keyboard.
- Badges include text, not color-only meaning.
- Detail pages use readable heading hierarchy.

## Tests

- Renders grouped strategy cards.
- Filters by level, outlook, and risk type.
- Search returns expected strategies.
- Build action opens builder with strategy selected.
- Learn action opens related lesson when available.
- Advanced builder action triggers acknowledgement when required.

## Definition of Done

- All MVP strategies are visible.
- Users can filter and inspect strategy details.
- Strategy actions route correctly.
- Risk and assignment labels are clear.

