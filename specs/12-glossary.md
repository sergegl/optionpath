# 12 - Glossary

## Purpose

Provide a quick, searchable reference for options terms used throughout lessons, strategy descriptions, and builder warnings.

## User Stories

- As a beginner, I want plain-English definitions of options terms.
- As a learner in a lesson, I want to open a term without losing my place.
- As an intermediate user, I want formulas and examples for key concepts.

## Required Terms

- Option contract
- Call
- Put
- Strike
- Premium
- Expiration
- Exercise
- Assignment
- Intrinsic value
- Extrinsic value
- In the money
- At the money
- Out of the money
- Breakeven
- Debit
- Credit
- Spread
- Covered call
- Cash-secured put
- Protective put
- Delta
- Gamma
- Theta
- Vega
- Implied volatility
- Open interest
- Volume

## UI Requirements

Glossary page:

- Search input.
- Category filter.
- Alphabetical list.
- Definition panel or detail route.

Term detail:

- Plain-English definition.
- Why it matters.
- Simple example.
- Related terms.
- Related lessons.

Contextual use:

- Lessons can link to glossary terms.
- Builder risk warnings can link to glossary terms.
- Links should open without losing user progress.

## Data Model

Glossary can be static TypeScript seed data for MVP.

```ts
type GlossaryTerm = {
  id: string;
  term: string;
  slug: string;
  category: "contract" | "pricing" | "risk" | "strategy" | "greeks" | "market";
  shortDefinition: string;
  fullDefinition: string;
  example?: string;
  relatedTermIds: string[];
  relatedLessonIds: string[];
};
```

## State Rules

- Search state is local UI state.
- Glossary data is read-only in MVP.
- Contextual glossary opens should not reset lesson or builder state.

## Domain Logic

No options calculations should be implemented inside glossary components. Use examples supplied in content or domain helpers for formula examples.

## Error and Empty States

- No search results: show reset search action.
- Term not found: show glossary home link.
- Related lesson missing: hide broken link.

## Accessibility Requirements

- Search input has visible label.
- Terms use semantic headings.
- Definition content must not be hidden behind hover-only interactions.
- Contextual popovers must be keyboard accessible and dismissible.

## Tests

- Renders required terms.
- Search finds matching terms.
- Category filter works.
- Related term links work.
- Lesson glossary link opens expected term.
- No-results state appears.

## Definition of Done

- Required terms are present.
- Glossary is searchable and readable.
- Lessons and warnings can link to terms.
- Mobile layout is clean and easy to scan.

