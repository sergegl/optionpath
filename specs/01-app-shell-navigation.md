# 01 - App Shell + Navigation

## Purpose

Provide the persistent structure for the app: navigation, route hierarchy, responsive layout, page chrome, global status surfaces, and entry points into the main workflows.

## User Stories

- As a new learner, I want to know where to start immediately.
- As a returning learner, I want to resume my next lesson or recent simulated trade.
- As a mobile user, I want navigation that is reachable without hiding the current task.
- As a keyboard user, I want to move through navigation and page content predictably.

## UX Flow

Default route:

1. User opens the app.
2. App initializes local database and seed data.
3. User lands on Dashboard.
4. User can navigate to Learn, Strategy Builder, Strategy Library, Journal, or Glossary.

Navigation behavior:

- Desktop: fixed left rail with app name, primary routes, and a small local-data status indicator.
- Tablet: compact left rail with icon plus short label.
- Mobile: top bar with app name and bottom navigation for primary routes.

## Route Map

```txt
/
/learn
/learn/:lessonId
/builder
/library
/library/:strategyId
/journal
/journal/:tradeId
/glossary
/settings
```

## UI Requirements

- Use a clean app-shell layout, not a marketing homepage.
- Primary navigation items:
  - Dashboard
  - Learn
  - Builder
  - Library
  - Journal
  - Glossary
- Secondary navigation:
  - Settings
  - Export data
  - Reset local data
- Show a persistent "Simulated" label in the shell.
- Include skip-to-content link for keyboard and screen reader users.
- Current route must be visually and semantically active.
- Page titles must be unique and descriptive.

## Data Model

No dedicated shell table is required.

Reads:

- `appSettings`
- `userProgress`
- `simulatedTrades`

Writes:

- `appSettings.lastOpenedAt`
- optional route resume metadata

## State Rules

- Shell must render after database initialization.
- If seed data is missing, trigger seed repair and show a non-blocking loading state.
- If local database initialization fails, show a recoverable error screen with export/reset options if possible.
- Current navigation state comes from React Router, not duplicated global state.

## Domain Logic

No options math belongs in the shell.

Shell-level derived values:

- learning completion percent
- number of open simulated trades
- last local save timestamp

## Error and Empty States

- Database unavailable: explain that local browser storage is required.
- Private/incognito storage limitation: show local persistence warning.
- No progress yet: route normally to Dashboard with beginner start action.

## Accessibility Requirements

- Use semantic `nav`, `main`, `header`, and page-level `h1`.
- Active nav item uses `aria-current="page"`.
- Keyboard focus must be visible.
- Bottom navigation icons require accessible labels.
- Layout must support 320px width without text overlap.
- No route change should trap focus.

## Tests

- Renders shell on all primary routes.
- Highlights active navigation item.
- Mobile navigation appears under mobile breakpoint.
- Skip link moves focus to main content.
- App handles database init failure.
- App redirects unknown routes to a useful not-found page.

## Definition of Done

- All routes are reachable.
- Desktop and mobile shells are visually polished.
- Route transitions preserve app state.
- Local-data status is visible without being distracting.
- Accessibility checks pass for navigation landmarks and keyboard focus.

