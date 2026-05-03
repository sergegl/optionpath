# 18 - Feature Page Refactor + Repo Hygiene

## Purpose

Reduce the size and responsibility load of the three largest feature pages, and clean up the repository root. This is a polish task: no behavior changes, no new dependencies, no API changes.

## Motivation

Three feature pages have grown past the point where the file can be held in mind at once:

| File | Lines | Responsibilities mixed in one file |
|---|---|---|
| `src/features/market/MarketSimulatorPage.tsx` | 588 | data loading, scenario state, form, render |
| `src/features/builder/StrategyBuilderPage.tsx` | 525 | seed loading, builder state, leg editing, risk acknowledgement, save flow, render |
| `src/features/tutorials/TutorialPages.tsx` | 495 | exports both `LearnPage` and `LessonPage` from one file |

The repository root also has 14 committed PNG screenshots and a `.playwright-mcp/` directory that should not be tracked.

## Scope

In:

- Split the three pages above using a consistent pattern (orchestrator + per-feature hook + sibling components).
- Move repository-root screenshots into `docs/screenshots/`.
- Add `.playwright-mcp/` to `.gitignore`.
- Confirm `dist/` is gitignored.
- Move `dashboard-snapshot.md` into `docs/`.

Out:

- No new dependencies.
- No changes to repository signatures, types in `src/db/types.ts`, or domain math in `src/domain/`.
- No styling changes.
- No new tests for refactored components (existing domain tests are sufficient signal that math did not move; UI flows are smoke-tested manually).
- `OPTION_TRADING_APP_PLAN.md` stays at repo root (may be referenced by path).

## Refactor Pattern

Each target page is restructured as:

```text
features/<feature>/
  <Feature>Page.tsx           ← orchestrator only, ≤ 200 lines
  use<Feature>State.ts        ← all state, effects, derived values, save handlers
  <Feature><Section>.tsx      ← one sibling component per major UI section
```

Rules:

- The orchestrator imports the hook, destructures its return value, and composes sibling components. No `useState`, no `useEffect`, no business logic in the orchestrator.
- Hooks return a single object (named return) so call sites stay readable as the surface grows.
- Sibling components receive props only. They contain no `useEffect` for data loading and no calls into `db/repositories/`.
- Sibling components live in the same folder, not in a `components/` subfolder.

## Per-Page Plan

### StrategyBuilderPage

- Hook: `useBuilderState` owns `seed`, `selectedStrategyId`, `symbol`, `underlyingPrice`, `legs`, `thesis`, `exitPlan`, `acknowledged`, `saveState`, `savedTradeId`, plus the seed-loading effect, derived metrics, and save handler.
- Sibling components extracted from the existing render tree until the orchestrator file is ≤ 200 lines. Section boundaries follow the existing visual sections of the page (strategy picker, leg editor, payoff/metrics, risk acknowledgement, save bar). Final component names chosen during implementation.

### MarketSimulatorPage

- Hook: `useMarketSimulator` owns all current page state and effects.
- Sibling components extracted until the orchestrator file is ≤ 200 lines. Section boundaries follow the existing visual sections of the page. Final component names chosen during implementation.

### TutorialPages

- Split file into `LearnPage.tsx` and `LessonPage.tsx`. Each gets its own folder-level entry. Update `src/app/routes.tsx` imports.
- Hooks extracted only if state grows past trivial (≥ 4 `useState` calls or any non-trivial effect).
- Sibling components extracted until each page file is ≤ 200 lines.

## Repo Hygiene

Verification revealed the existing `.gitignore` already covers everything that looked like clutter:

- `dashboard-*.png`, `builder-*.png`, `payoff-*.png`, `learn-*.png`, `lesson-*.png`, `library-*.png` — all ignored by name patterns. None are tracked.
- `.playwright-mcp/` — already ignored.
- `dashboard-snapshot.md` — already ignored.
- `dist/`, `node_modules/`, `.DS_Store`, `.env*` — already ignored.

The on-disk files at repo root are local artifacts (screenshots from playwright runs, etc.) and are invisible to git. No further action required for hygiene.

The original assessment that these files were "committed at the repo root" was based on `ls` output and was incorrect. `git ls-files` confirms none are tracked.

## Acceptance Criteria

- `npm run build` passes.
- `npm test` passes (existing domain tests).
- Each refactored orchestrator file is ≤ 200 lines.
- No new entries in `package.json` `dependencies` or `devDependencies`.
- `git status` is clean (was already clean before the refactor; no tracked PNGs found).
- `.playwright-mcp/` is listed in `.gitignore` (already present).

## Manual Smoke Tests

After the refactor, run `npm run dev` and verify:

1. Builder flow: pick a strategy, edit a leg, acknowledge risk, save trade, see saved confirmation.
2. Tutorial flow: open `/learn`, click into a lesson, advance through at least two steps.
3. Market flow: open `/market`, run a scenario end-to-end without console errors.

## Risks

- Splitting effect-heavy code can subtly change effect ordering. Mitigation: keep the seed-loading effect inside the hook with the same dependency array as today; verify the save flow manually before declaring the page done.
- Moving screenshots may break a markdown doc that links to them. Mitigation: grep for `.png` references in markdown after the move.

## Definition of Done

- All acceptance criteria met.
- All three smoke tests pass without console errors.
- Branch is ready for review or merge.
