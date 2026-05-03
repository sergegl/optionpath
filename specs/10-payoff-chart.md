# 10 - Payoff Chart

## Purpose

Visualize simulated strategy profit/loss across underlying prices at expiration, with breakeven markers, zero line, max profit/loss cues, and accessible text summaries.

## User Stories

- As a beginner, I want to see how profit and loss change as price moves.
- As a learner, I want to identify breakeven points quickly.
- As a mobile user, I want chart information to remain readable.
- As a screen reader user, I want a text summary of the chart.

## UI Requirements

Chart must show:

- X-axis: underlying price.
- Y-axis: profit/loss.
- Zero P/L line.
- Current underlying price marker.
- Breakeven markers.
- Profit and loss regions.
- Hover/focus tooltip with price and P/L.

Controls:

- Underlying price range selector when useful.
- Toggle for per-contract vs total position if supported.
- Optional scenario presets.

## Data Inputs

```ts
type PayoffChartProps = {
  points: PayoffPoint[];
  currentUnderlyingPrice: number;
  breakevens: number[];
  maxProfit: number | "unlimited" | "unknown";
  maxLoss: number | "unlimited" | "unknown";
  title: string;
};
```

## State Rules

- Chart is derived from domain output.
- Chart does not mutate trade state.
- Recompute when legs, underlying price, quantity, strike, premium, or stock leg changes.
- On small screens, reduce nonessential gridlines before reducing readability.

## Domain Logic

No payoff math should live in the chart component. The chart receives points and metrics from `domain/options`.

## Error and Empty States

- No legs: show instructional empty chart state.
- Invalid strategy: show validation message instead of chart.
- Unknown max profit/loss: show "unknown" text and omit max marker.
- Too few points: show fallback summary.

## Accessibility Requirements

- Include a text summary near the chart:
  - max profit
  - max loss
  - breakevens
  - current underlying scenario P/L
- Tooltip data must also be available through keyboard focus or a table-like summary.
- Profit and loss regions must use color plus labels or patterns.
- Chart must not be the only way to understand risk.

## Visual Requirements

- Profit color and loss color must be distinct.
- Breakeven markers should be visually prominent but not overpower the curve.
- Current price marker should be clearly labeled.
- Use tabular numbers in tooltip.
- Avoid decorative chart shadows or low-contrast gridlines.

## Tests

- Renders empty state.
- Renders payoff curve with zero line.
- Renders breakeven markers.
- Updates when input points change.
- Tooltip displays correct formatted value.
- Text summary matches metrics.
- Mobile chart remains readable.
- Reduced-motion mode disables animated transitions.

## Definition of Done

- Payoff chart works inside Strategy Builder and Strategy Detail.
- Chart output is accessible through text.
- Chart remains readable on mobile.
- Visual treatment matches design system.

