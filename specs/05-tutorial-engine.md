# 05 - Tutorial Engine

## Purpose

Provide a reusable system for step-by-step lessons that can combine explanation, examples, interactions, quizzes, and builder actions.

## User Stories

- As a beginner, I want options concepts broken into small steps.
- As a learner, I want to interact with examples instead of only reading.
- As a returning user, I want completed steps to remain complete.
- As an advanced learner, I want lessons to unlock more complex simulations.

## Lesson Structure

```ts
type Lesson = {
  id: string;
  tutorialId: string;
  level: "beginner" | "intermediate" | "advanced";
  title: string;
  summary: string;
  estimatedMinutes: number;
  order: number;
  requiredAcknowledgementContext?: string;
};

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

## Step Types

Concept:

- Explanation with key terms.
- Optional inline glossary links.

Example:

- Static example using sample prices.
- Shows simplified calculation.

Interactive:

- User changes strike, premium, price, or strategy assumption.
- Uses domain logic for real-time feedback.

Checkpoint:

- One or more confirmations before moving on.
- Used for risk-heavy topics.

Quiz:

- Single-choice or multiple-choice.
- Immediate explanation after answer.

Summary:

- Key takeaways.
- Next suggested lesson or builder action.

## UX Flow

1. User opens lesson.
2. Engine loads lesson and steps.
3. User advances through steps.
4. Progress saves after each completed step.
5. Quiz result saves at end.
6. Completion state updates.
7. User is offered the next lesson or a builder practice action.

## UI Requirements

- Persistent lesson header with title, level, estimated time, and progress.
- Stepper that shows current step and completed steps.
- Main content area.
- Optional interactive panel.
- Previous and next actions.
- End-of-lesson completion summary.

## Data Model

Reads:

- `lessons`
- `lessonSteps`
- `userProgress`
- `quizAttempts`
- `riskAcknowledgements`

Writes:

- `userProgress`
- `quizAttempts`
- `riskAcknowledgements` when required

## State Rules

- User can move backward without losing completed state.
- Step completion persists after refresh.
- Quiz can be retried, but previous attempts are retained.
- Lessons can be visible even if not completed in sequence, but recommended path ordering should remain clear.
- Advanced interactive lessons may require risk acknowledgement before interactive actions.

## Domain Logic

The tutorial engine can call domain modules for:

- payoff examples
- breakeven examples
- strategy risk labels
- assignment warnings

It must not duplicate options formulas inside lesson UI components.

## Error and Empty States

- Lesson missing: show not-found with return to Learn.
- Step payload invalid: show lesson error and report developer diagnostic in console.
- Progress save failure: allow user to continue but show local-save warning.
- Quiz save failure: let user retry save.

## Accessibility Requirements

- Stepper must be navigable by keyboard.
- Current step should be announced by heading.
- Quiz answers must use accessible form controls.
- Interactive examples must expose calculated result text, not chart-only output.
- Completion messages should not rely only on animation.

## Tests

- Loads lesson and steps in order.
- Saves step progress.
- Restores current progress after refresh.
- Handles quiz attempt and explanation.
- Handles required acknowledgement.
- Missing lesson state.
- Keyboard navigation through lesson controls.

## Definition of Done

- Any seeded lesson can be rendered by the engine.
- Progress persists.
- Quiz attempts persist.
- Interactive steps can use shared domain logic.
- Lesson UI works on mobile and desktop.

