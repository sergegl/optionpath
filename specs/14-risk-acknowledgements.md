# 14 - Risk Acknowledgements

## Purpose

Ensure advanced, short-option, assignment-sensitive, and undefined-risk educational interactions include explicit risk context before the user proceeds.

## User Stories

- As a learner, I want to understand when a strategy carries assignment risk.
- As a beginner, I want advanced strategies clearly marked.
- As a product owner, I want the app to avoid implying that options trading is simple or risk-free.
- As a user, I want acknowledgements to be clear and not repetitive.

## Acknowledgement Contexts

Initial contexts:

```txt
advanced_strategies
short_options
assignment_risk
undefined_risk
simplified_model
simulated_data
```

## UX Rules

- Show acknowledgement before saving or interactively modeling advanced/undefined-risk strategies.
- Do not block reading educational content unless the content itself is interactive and risk-heavy.
- Keep the message concise and specific to the context.
- Store acknowledgement locally after user accepts.
- Allow user to review acknowledgements in Settings.

## UI Requirements

Risk callout:

- title
- plain-English risk summary
- strategy-specific bullets
- link to glossary or lesson
- acknowledge button
- cancel/back action

Badges:

- Simulated
- Defined risk
- Assignment possible
- Undefined risk
- Simplified model

## Data Model

```ts
type RiskAcknowledgement = {
  id: string;
  context: "advanced_strategies" | "short_options" | "assignment_risk" | "undefined_risk" | "simplified_model" | "simulated_data";
  strategyId?: string;
  lessonId?: string;
  acceptedTextVersion: string;
  createdAt: string;
};
```

## State Rules

- Acknowledgement is required once per context and text version.
- If acknowledgement text changes materially, require acceptance again by version.
- Advanced strategy builder save checks acknowledgement state.
- Simulated-data label should always be visible even after acknowledgement.

## Domain Logic

Risk context can be inferred from strategy metadata and domain risk labels:

- short option legs imply assignment risk.
- naked short call implies undefined risk.
- calendar/diagonal simplified valuation implies simplified model.
- advanced-level templates imply advanced strategy context.

## Error and Empty States

- Failed save of acknowledgement: do not proceed with gated action.
- Missing acknowledgement text: block gated action with generic fallback.
- User cancels: return to previous builder or strategy detail state.

## Accessibility Requirements

- Acknowledgement modal uses proper dialog semantics.
- Focus is trapped only while modal is open.
- Escape and cancel return without accepting.
- Accept action text is explicit.
- Risk content is text-based and readable.

## Tests

- Blocks advanced builder save before acknowledgement.
- Saves acknowledgement.
- Does not repeat same version unnecessarily.
- Requires re-acceptance after version change.
- Detects short-option assignment risk.
- Detects undefined-risk short call.
- Cancel leaves state unchanged.

## Definition of Done

- Risk gates exist for advanced and undefined-risk interactions.
- Acknowledgements persist locally.
- Simulated-data label is always visible.
- Risk language is clear and non-promotional.

