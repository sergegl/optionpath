# 16 - Training Visuals and Plain Language

## Purpose

Make the learning experience more visual, easier to understand, and more pleasant without making the product feel like a game or implying investment advice. Lessons should use clear images, diagrams, and simplified wording to help users understand options concepts before they see formulas or payoff charts.

## Design Skill Direction

Design lane: **Tactile Finance Storyboard**.

This borrows from the redesign skill's education and finance guidance:

- Use tactile storyboard pacing for lessons: clear visual panels, annotated examples, and human-friendly sequence.
- Keep the finance shell serious: restrained colors, compact labels, strong contrast, no decorative clutter.
- Use bold type for lesson hierarchy, not for hype.
- Use asymmetry in lesson layouts so pages feel designed, but keep the stepper and actions predictable.
- Use media only when it teaches a concept. Avoid stock-photo finance filler.

Selected trend signals:

- Tactile, human surfaces for training cards and visual lesson panels.
- Bold typography for key concepts and plain-language summaries.
- Asymmetrical layout for lesson panels on desktop.
- Accessibility and lightweight assets as design constraints.

## Product Boundary

These visuals are educational aids only. They must not:

- show live market data
- imply a recommendation
- promise profit or safety
- use fake brokerage screenshots
- make simulated trades look executable

## Current Content Audit

The current beginner lessons are structurally sound but mostly text-only. Each lesson step has:

```ts
type LessonStep = {
  id: string;
  lessonId: string;
  order: number;
  type: "concept" | "example" | "interactive" | "checkpoint" | "quiz" | "summary";
  title: string;
  body: string;
  payload?: unknown;
};
```

The best injection point is the existing `payload` object. We can add visual metadata without changing the main lesson model immediately.

Recommended payload extension:

```ts
type LessonVisualPayload = {
  visual?: {
    kind: "concept_image" | "diagram" | "formula_card" | "payoff_story" | "risk_scene" | "matching_cards";
    assetId?: string;
    title: string;
    caption: string;
    alt: string;
    callouts?: Array<{
      label: string;
      body: string;
      glossaryTermId?: string;
    }>;
  };
  plainLanguage?: {
    oneLine: string;
    analogy?: string;
    avoidSaying?: string[];
  };
};
```

## Visual Injection Map

| Lesson | Step | Visual | Simplified language goal |
| --- | --- | --- | --- |
| Option Contracts | What a contract controls | One contract card connected to 100 share tiles | "One option contract is usually tied to 100 shares." |
| Option Contracts | Contract multiplier | Formula card: premium x contracts x 100 | Show why a quoted $2.40 becomes $240 per contract. |
| Calls and Puts | Rights and obligations | Two-panel diagram: buyer has a right, seller has an obligation | Separate "right" from "must do if assigned." |
| Calls and Puts | Simple comparison | Call and put directional arrows around a strike marker | Show call above strike, put below strike. |
| Strike, Expiration, Premium | The three trade inputs | Annotated option ticket | Make strike, expiration, and premium feel like fields on a contract. |
| Strike, Expiration, Premium | Debit and credit | Money-in/money-out cards | Explain paid premium versus received premium. |
| Intrinsic and Extrinsic | Intrinsic value | Stacked value bar | "Premium can be real exercise value plus time value." |
| Intrinsic and Extrinsic | Extrinsic value | Before/after bar with stock at 105 and strike 100 | Show $7 premium = $5 intrinsic + $2 extrinsic. |
| Long Call | Profile | Rising payoff line with premium floor | Bullish idea, limited loss, breakeven. |
| Long Put | Profile | Falling-market payoff story | Bearish idea, limited loss, breakeven. |
| Covered Call | Profile | Stock stack with a capped upside gate | Income plus capped upside and stock downside. |
| Cash-Secured Put | Profile | Cash reserve next to possible share assignment | Premium received, obligation to buy shares, cash backing. |
| Protective Put | Profile | Stock stack with a downside floor | Protection costs premium but limits modeled downside. |
| Beginner Review | Quiz | Strategy matching cards | Match visual risk profiles instead of reading dense definitions again. |

Future lesson visual map:

| Path | Visual pattern |
| --- | --- |
| Vertical spreads | Two strike rails with max profit/loss zones shaded. |
| Collars | Stock line between capped upside and protected downside. |
| Iron condor | Range tent with short strikes highlighted. |
| Straddles and strangles | Big-move zone outside the middle. |
| Calendar and diagonal spreads | Layered expirations with time labels. |
| Greeks | Small dashboard cards for delta, theta, vega, gamma with one plain sentence each. |

## Feature 16.1 - Training Visual Asset System

### Purpose

Provide reusable visual assets for lesson steps, glossary terms, and strategy cards.

### User Stories

- As a beginner, I want images that explain the concept before the math.
- As a visual learner, I want repeated visual patterns so concepts feel familiar.
- As a maintainer, I want visuals referenced by metadata, not hardcoded inside every lesson component.

### Asset Types

- `concept_image`: generated bitmap or static illustration for one idea.
- `diagram`: code-native SVG or HTML diagram for educational structure.
- `formula_card`: typographic calculation block.
- `payoff_story`: simplified payoff shape with labels, separate from the detailed chart.
- `risk_scene`: visual explanation of assignment, capped upside, downside floor, or undefined risk.
- `matching_cards`: visual answer cards for quizzes and reviews.

### Data Model

Static visual registry:

```ts
type TrainingVisualAsset = {
  id: string;
  kind: LessonVisualPayload["visual"]["kind"];
  src?: string;
  component?: "contractTiles" | "optionTicket" | "valueStack" | "payoffStory" | "riskScene";
  alt: string;
  caption: string;
  dominantTone: "primary" | "support" | "warning" | "neutral";
};
```

Recommended files:

- `src/data/trainingVisuals.ts`
- `src/features/tutorials/LearningVisualBlock.tsx`
- `src/assets/training/`

### UI Requirements

- Visuals render above or beside the step body.
- Desktop lesson layout can use a two-column panel: text on one side, visual on the other.
- Mobile layout stacks visual first for concept steps, then explanation.
- Every visual has a caption and alt text.
- Formula cards use text, not image-only formulas.

### Acceptance Criteria

- At least one visual can render from `LessonStep.payload.visual`.
- Missing asset ID shows the lesson text without crashing.
- Visual block works in concept, example, checkpoint, quiz, and summary steps.
- Mobile width has no horizontal overflow.

## Feature 16.2 - Plain-Language Lesson Rewrite Layer

### Purpose

Rewrite lessons so the first sentence is simple, concrete, and non-intimidating. Technical terms should come after the mental model.

### Language Rules

- Start with a plain-English idea.
- Use one concrete number example per concept.
- Define jargon right where it first appears.
- Keep formulas in short blocks.
- Prefer "what happens" over abstract finance wording.
- Keep risk visible in the same step as the strategy.
- Avoid hype words such as "easy profit", "safe income", "guaranteed", or "win".

### Rewrite Pattern

Each concept step should follow:

1. Plain one-line idea.
2. Visual or analogy.
3. Concrete example.
4. Technical term.
5. Risk or boundary note.

Example rewrite:

Current:

> One listed equity option contract typically controls 100 shares. That multiplier means a $2.00 quoted premium usually represents $200 before fees.

Proposed:

> Think of one option contract as a handle attached to 100 shares. If the option is quoted at $2.00, one contract costs about $200 before fees because $2.00 is priced per share.

### Data Model

Add optional payload fields:

```ts
plainLanguage: {
  oneLine: string;
  analogy?: string;
  formulaLabel?: string;
  formulaText?: string;
}
```

### Acceptance Criteria

- Every beginner lesson has a `plainLanguage.oneLine`.
- Every formula has a written explanation.
- No beginner step requires prior knowledge of "moneyness", "assignment", "intrinsic", or "extrinsic" before defining it.
- Copy remains educational and non-promotional.

## Feature 16.3 - Visual Lesson Step Renderer

### Purpose

Upgrade the tutorial engine so it can render text, visual panels, captions, callouts, formulas, and glossary links from structured lesson payloads.

### UI Requirements

- Use a consistent `LearningVisualBlock` component.
- Use a compact `ConceptCallout` component for definitions.
- Use a `FormulaCard` component for calculations.
- Use `GlossaryLink` chips for terms such as strike, premium, assignment, intrinsic value, and extrinsic value.
- Keep buttons at the bottom of the lesson card.

### Desktop Layout

- Concept and example steps: `minmax(0, 1fr) 22rem`.
- Interactive steps: main explanation above, interactive controls below or to the side.
- Quiz steps: question cards full width, with optional matching visuals.

### Mobile Layout

- Stack visual, one-line summary, body, bullets, actions.
- Keep visual panels no taller than needed.
- Use stable aspect ratios so images do not shift the layout when loading.

### Acceptance Criteria

- Existing lessons still render when no visual payload exists.
- Visual steps use the available horizontal space on large screens.
- No text overlaps visual panels.
- Keyboard navigation remains unchanged.

## Feature 16.4 - Visual Glossary Cards

### Purpose

Reuse lesson visuals in the glossary so terms are easier to remember.

### User Stories

- As a beginner, I want a picture or mini-diagram next to difficult terms.
- As a learner inside a lesson, I want a quick definition without losing my place.

### Terms to Prioritize

- Option contract
- Call
- Put
- Strike
- Premium
- Expiration
- Assignment
- Intrinsic value
- Extrinsic value
- Breakeven
- Debit
- Credit
- Covered call
- Cash-secured put
- Protective put

### UI Requirements

- Glossary detail pane shows a small visual card when a term has one.
- Related lesson links remain below the definition.
- Visual card uses the same asset registry as lessons.

### Acceptance Criteria

- At least 10 glossary terms have visual metadata.
- Glossary still works with search and category filters.
- Visual cards have alt text.

## Feature 16.5 - Strategy Story Cards

### Purpose

Add visual summary cards for common strategies so learners can recognize the shape and risk profile before opening the builder.

### Strategy Card Fields

```ts
type StrategyStory = {
  strategyId: string;
  plainSummary: string;
  visualAssetId: string;
  keyRisk: string;
  bestForLearning: string;
};
```

### Beginner Strategy Story Examples

- Long call: "You pay a premium for upside exposure. If the stock does not rise enough, the premium can be lost."
- Long put: "You pay a premium for downside exposure. If the stock does not fall enough, the premium can be lost."
- Covered call: "You own shares and sell a call. You collect premium, but your upside is capped."
- Cash-secured put: "You collect premium and keep cash ready in case you must buy shares."
- Protective put: "You own shares and buy a put to create a downside floor."

### Acceptance Criteria

- Strategy library cards can show an optional visual story.
- Strategy detail pages show the story card before the payoff chart.
- Builder preselected strategies can show the same story in the risk summary panel.

## Feature 16.6 - Content QA and Readability Review

### Purpose

Create a repeatable review process for educational accuracy, plain language, accessibility, and risk tone.

### QA Checklist

- The first sentence can be understood by a beginner.
- Every jargon term is defined before or when used.
- Every visual has alt text and a caption.
- Every strategy step states max loss or key risk where possible.
- No copy implies certainty, advice, or a live trading workflow.
- Each lesson has at least one concrete number example.
- Each quiz answer includes feedback or explanation.

### Tests and Checks

- Render all lesson steps with and without visual payloads.
- Verify all visual asset IDs resolve.
- Verify all glossary term IDs resolve.
- Check mobile overflow at 390px width.
- Check keyboard flow through lesson stepper, visual links, quiz answers, and actions.

## Implementation Phases

### Phase 1 - Visual Infrastructure

- Add `trainingVisuals.ts`.
- Add `LearningVisualBlock`, `FormulaCard`, and `ConceptCallout`.
- Extend tutorial payload typing.
- Render visual payloads in `LessonStepContent`.

### Phase 2 - Beginner Visual Pass

- Add visuals for all 10 beginner lessons.
- Rewrite beginner lesson copy using the plain-language pattern.
- Add formula cards for multiplier, debit/credit, breakeven, intrinsic/extrinsic value.

### Phase 3 - Glossary and Strategy Reuse

- Add visual cards to high-priority glossary terms.
- Add strategy story metadata for beginner strategies.
- Reuse visual assets on strategy detail pages.

### Phase 4 - QA and Polish

- Browser smoke test desktop and mobile.
- Verify no visual causes layout overflow.
- Review copy for risk tone and beginner readability.
- Export a screenshot set for the first beginner path.

## Definition of Done

- Beginner lessons feel visually guided instead of text-only.
- Users can understand the main concept from the visual, caption, and first sentence.
- Visual assets are reusable across lessons, glossary, strategy library, and builder panels.
- All visuals are accessible, responsive, and educational.
- Language is simpler without removing risk context or technical correctness.

