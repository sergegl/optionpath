# 19 - Lessons Plain-Language Pass

## Purpose

Improve the readability of in-app lesson content so that a beginner without a finance background can follow each step on first read. This is a content task: no schema changes, no new lessons, no removed lessons.

## Scope

In:

- All lesson and lesson-step copy in `src/data/seedLessons.ts`.
- Lesson titles and step titles where they use jargon or vague phrasing.
- Step bodies: sentence shortening, jargon replacement, first-mention glossing of terms, concrete examples added where a step is too abstract.

Out:

- Glossary copy (`src/data/glossary.ts`).
- Strategy library copy (`src/data/seedStrategies.ts`).
- Quiz prompts and answers.
- Training visuals (`src/data/trainingVisuals.ts`).
- Tutorial-level metadata (level, order, tutorial groupings).

## Editorial Rules

These are hard rules. A change that violates any of them is rejected.

1. Preserve every `id`, `slug`, `tutorialId`, `lessonId`, `order`, and `level` value. Saved progress points at these IDs.
2. Do not add, remove, merge, or split lesson steps. Step count per lesson stays the same.
3. Sentences should be ≤ 20 words where possible. Allow exceptions when a longer sentence reads naturally.
4. The first time a jargon term appears in a lesson, define it in the same sentence in plain English. Examples:
   - "the strike price — the price at which the option lets you buy or sell"
   - "in-the-money (ITM) — the option would be worth exercising right now"
5. Replace abbreviations on first use within a lesson. ITM, OTM, ATM, IV, P/L, etc. always get the spelled-out form on first appearance.
6. Where a step is purely abstract, add one concrete example with a real-feeling number. Use round numbers (strike 100, premium 2.50) so the math is easy to follow.
7. Prefer concrete verbs ("you buy", "the option pays") over abstract ones ("one acquires", "settlement occurs").
8. Avoid hedging stacks ("might possibly tend to"). Pick one qualifier or none.
9. Never imply profit certainty or personalized investment advice. The product boundary in `specs/README.md` still applies.

## Editorial Latitude

Allowed under "medium pass":

- Reword lesson titles and step titles for clarity.
- Reorder sentences within a step.
- Trim redundant sentences.
- Replace bullet lists with prose, or vice versa, where it improves reading flow.

Not allowed:

- Changing what a step teaches.
- Moving content from one step to another.
- Introducing concepts the original step did not cover.

## Verification

- `npm run build` passes (catches any accidental syntax break in `seedLessons.ts`).
- `npm test` passes (no test depends on lesson copy, but run for safety).
- Manual spot-check in the running app:
  - Open one beginner lesson end to end. Read each step out loud. Each step should be understandable on first read.
  - Open one intermediate lesson. Same check.
  - Confirm step navigation still works (no step IDs changed).

## Risks

- Rewording can shift meaning. Mitigation: keep a side-by-side mental diff for each step; if the rewrite changes what is taught, revert that step and try again.
- A typo in `seedLessons.ts` will break the build (TypeScript type check). Mitigation: run `npm run build` after the rewrite, before commit.

## Definition of Done

- Every lesson step has been read and rewritten or left intact intentionally.
- All editorial rules hold.
- All acceptance checks pass.
- Branch is ready for review or merge.
