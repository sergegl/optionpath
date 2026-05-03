# 09 - Options Domain Logic

## Purpose

Centralize options calculations, strategy validation, payoff modeling, risk labels, and educational summaries outside the UI.

## User Stories

- As a learner, I want payoff numbers to be consistent everywhere.
- As a developer, I want option math testable without rendering UI.
- As a user, I want the app to warn me when a strategy has assignment or undefined-risk concerns.

## Core Types

```ts
type OptionType = "call" | "put";
type LegAction = "buy" | "sell";

type OptionLeg = {
  id: string;
  action: LegAction;
  type: OptionType;
  quantity: number;
  strike: number;
  premium: number;
  expiration: string;
};

type PayoffPoint = {
  underlyingPrice: number;
  profitLoss: number;
};

type StrategyMetrics = {
  netDebitCredit: number;
  maxProfit: number | "unlimited" | "unknown";
  maxLoss: number | "unlimited" | "unknown";
  breakevens: number[];
  assignmentRisk: "none" | "possible" | "material";
  riskLabels: string[];
};
```

## Calculation Rules

Use expiration payoff for MVP.

Contract multiplier:

```txt
equity option multiplier = 100
```

Intrinsic value:

```txt
call intrinsic = max(0, underlyingPrice - strike)
put intrinsic = max(0, strike - underlyingPrice)
```

Single option leg P/L:

```txt
long option = (intrinsic - premium) * quantity * 100
short option = (premium - intrinsic) * quantity * 100
```

Stock leg P/L:

```txt
long stock = (underlyingPrice - entryPrice) * shares
short stock = (entryPrice - underlyingPrice) * shares
```

Total strategy P/L:

```txt
sum(option leg P/L) + stock leg P/L
```

Net debit/credit:

```txt
buy option premium = debit
sell option premium = credit
net = credits - debits
```

## Required Strategy Metrics

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

For complex time-spread strategies, MVP may show expiration payoff for the near-term assumption and label the model as simplified.

## Validation Rules

- Reject negative prices, strikes, premiums, or quantities.
- Warn on zero premium but allow for educational examples.
- Require compatible expirations for vertical spreads.
- Require stock leg for covered call and protective put.
- Require cash-secured label for short put beginner strategy.
- Identify naked short calls and undefined-risk short option structures.

## Risk Labels

Examples:

- "Premium at risk"
- "Defined risk"
- "Assignment possible"
- "Stock downside remains"
- "Upside capped"
- "Undefined upside risk"
- "Simplified model"

## Error Handling

Domain functions should return typed results or throw typed validation errors. UI components decide presentation.

```ts
type DomainValidationError = {
  code: string;
  message: string;
  field?: string;
};
```

## Accessibility Requirements

Domain output should include text summaries for chart-only concepts:

- max profit summary
- max loss summary
- breakeven summary
- risk labels

## Tests

Unit test required:

- Long call payoff, max loss, breakeven.
- Long put payoff, max loss, breakeven.
- Covered call capped upside.
- Cash-secured put assignment/downside summary.
- Protective put downside floor.
- Vertical spread max profit/loss.
- Iron condor defined risk.
- Invalid leg validation.
- Short call undefined-risk detection.
- Payoff curve point generation.

## Definition of Done

- UI screens use shared domain functions.
- Core strategy calculations have unit tests.
- Risk labels are consistent across Builder, Library, Lessons, and Journal.
- Complex strategies with simplified assumptions are clearly labeled.

