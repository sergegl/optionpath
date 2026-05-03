# 04 - Dashboard

## Purpose

Give the user a clear starting point, summarize progress, and make the next best action obvious.

## User Stories

- As a new user, I want to start with the first beginner lesson.
- As a returning user, I want to resume where I left off.
- As a user with saved simulated trades, I want to review recent trades quickly.
- As a learner, I want to see progress without feeling judged or overwhelmed.

## UX Flow

New user:

1. Dashboard shows beginner path start.
2. Primary action opens first tutorial.
3. Secondary action opens Strategy Library.

Returning user:

1. Dashboard shows next incomplete lesson.
2. Recent simulated trades are listed.
3. Journal reminders appear for open simulated trades with no recent note.

## UI Requirements

Sections:

- Next action panel.
- Learning progress strip.
- Strategy path cards: Beginner, Intermediate, Advanced.
- Recent simulated trades.
- Watchlist/sample symbols.
- Risk literacy or glossary prompt.

Required metrics:

- completed lessons
- current path
- saved simulated trades
- open journal items

## Data Model

Reads:

- `userProgress`
- `lessons`
- `tutorials`
- `simulatedTrades`
- `journalEntries`
- `watchlists`
- `riskAcknowledgements`

Writes:

- none required except optional `appSettings.lastDashboardVisitAt`

## State Rules

- Dashboard never blocks on noncritical data.
- If progress data is empty, show beginner-oriented content.
- If simulated trades exist without journal entries, show a journal prompt.
- Advanced path can be visible but should indicate that risk acknowledgement may be required before interactive advanced builders.

## Domain Logic

Derived values:

- next lesson
- path completion percent
- recent trade list
- journal attention list
- next recommended tutorial level

Dashboard should not perform payoff calculations directly. Use domain services or repository-derived summaries.

## Error and Empty States

- No progress: show "Start with option contracts" action.
- No trades: show "Build a simulated trade" action.
- No watchlist: show sample symbols or add-symbol action.
- Database read failure: show partial dashboard with retry.

## Accessibility Requirements

- Main action is reachable early in the tab order.
- Progress is not color-only; include text or numeric value.
- Metric cards use headings and labels, not unlabeled numbers.
- Recent trades list uses semantic list or table markup depending on density.

## Tests

- New user dashboard state.
- Returning user with incomplete lesson.
- Recent trades render in updated order.
- Journal prompt appears for trade without recent note.
- Empty sections render useful actions.
- Mobile layout does not overlap controls or metrics.

## Definition of Done

- User can understand where to start within a few seconds.
- Progress and recent activity are visible.
- Dashboard routes correctly into Learn, Builder, Library, and Journal.
- Empty states feel intentional.

