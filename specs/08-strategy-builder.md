# 08 - Strategy Builder

## Purpose

Guide users through building a simulated options trade by selecting an outlook, risk preference, strategy, symbol, expiration, strikes, premiums, and journal-ready plan.

## User Stories

- As a beginner, I want the app to guide me to appropriate strategy types.
- As an intermediate user, I want to edit option legs directly.
- As a learner, I want to see payoff and risk update as I change assumptions.
- As a user, I want to save a simulated trade and review it later.

## UX Flow

1. Choose market outlook.
2. Choose risk preference.
3. Select strategy.
4. Pick or enter symbol.
5. Set underlying price.
6. Configure legs.
7. Review payoff chart and risk summary.
8. Add thesis and exit plan.
9. Save as draft or open simulated trade.

## UI Requirements

Controls:

- Segmented control for outlook.
- Segmented control for risk type.
- Strategy picker.
- Symbol input or sample symbol select.
- Expiration select/date input.
- Leg editor rows.
- Number inputs for strike, premium, quantity, and underlying price.
- Payoff chart.
- Risk summary panel.
- Save actions.

Builder states:

- Guided mode for beginners.
- Advanced leg editor for intermediate and advanced users.
- Strategy prefilled when opened from Library or Tutorial.

## Data Model

```ts
type BuilderDraft = {
  strategyId: string;
  symbol: string;
  underlyingPrice: number;
  legs: OptionLeg[];
  stockLeg?: StockLeg;
  thesis?: string;
  exitPlan?: string;
  adjustmentPlan?: string;
};

type StockLeg = {
  action: "buy" | "sell";
  shares: number;
  entryPrice: number;
};
```

Writes:

- `simulatedTrades`
- `simulatedTradeLegs`
- optional initial `journalEntries`
- optional `riskAcknowledgements`

## State Rules

- Active draft can live in React state until saved.
- Saved trades must be written transactionally with legs.
- Strategy templates prefill expected leg count and action/type.
- User can edit strikes and premiums after prefill.
- Undefined-risk and advanced strategies require acknowledgement before save.
- Save disabled until required fields are valid.

## Validation Rules

- Symbol is required.
- Underlying price must be greater than 0.
- Quantity must be positive integer.
- Strike must be greater than 0 for option legs.
- Premium must be greater than or equal to 0.
- Expiration is required.
- Multi-leg strategies must have compatible expirations unless strategy explicitly allows different expirations.
- Spread strikes must respect strategy direction where applicable.

## Domain Logic

Builder calls domain modules for:

- payoff curve
- max profit
- max loss
- breakevens
- net debit/credit
- assignment risk
- strategy validation

Builder should not calculate these inline.

## Error and Empty States

- No strategy selected: show guided start.
- Invalid leg: mark row and summarize issue.
- Save failure: keep draft in memory and allow retry.
- Missing sample data: allow manual entry.
- Advanced strategy gated: show acknowledgement flow.

## Accessibility Requirements

- All leg editor fields have visible labels or accessible row labels.
- Validation errors are associated with fields.
- Chart values are summarized in text.
- Save status is announced only when meaningful.
- Keyboard users can add, remove, and reorder legs where supported.

## Tests

- Guided selection recommends appropriate strategies.
- Opens prefilled from strategy detail.
- Edits leg fields and updates payoff.
- Validates required fields.
- Saves trade and legs transactionally.
- Save failure keeps draft.
- Acknowledgement gate blocks advanced save until accepted.

## Definition of Done

- User can build and save core beginner strategies.
- Payoff and risk update when assumptions change.
- Saved trades reload in Journal and Dashboard.
- Builder works on desktop and mobile.

