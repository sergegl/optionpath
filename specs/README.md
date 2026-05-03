# Feature Specifications

This folder breaks the options education and simulated trading app into reviewable, buildable feature specs. Each spec defines the purpose, user stories, UX flow, UI requirements, data model, state rules, domain logic, error states, accessibility requirements, tests, and definition of done.

## Product Boundary

The first version is a local-first education and simulation app. It does not connect to brokerages, place live trades, make personalized recommendations, or store brokerage credentials. Optional market-data API keys are allowed only under an explicit user-controlled setting. All trade construction is simulated and educational.

## Implementation Order

1. App Shell + Navigation
2. Design System
3. Local Database Layer
4. Options Domain Logic
5. Strategy Library
6. Payoff Chart
7. Strategy Builder
8. Tutorial Engine
9. Beginner Tutorial Content
10. Dashboard
11. Progress + Quiz System
12. Simulated Trade Journal
13. Glossary
14. Risk Acknowledgements
15. Import, Export + Backup
16. Training Visuals + Plain Language
17. Real Market Simulation

## Spec Index

- [01 - App Shell + Navigation](01-app-shell-navigation.md)
- [02 - Local Database Layer](02-local-database-layer.md)
- [03 - Design System](03-design-system.md)
- [04 - Dashboard](04-dashboard.md)
- [05 - Tutorial Engine](05-tutorial-engine.md)
- [06 - Beginner Tutorial Content](06-beginner-tutorial-content.md)
- [07 - Strategy Library](07-strategy-library.md)
- [08 - Strategy Builder](08-strategy-builder.md)
- [09 - Options Domain Logic](09-options-domain-logic.md)
- [10 - Payoff Chart](10-payoff-chart.md)
- [11 - Simulated Trade Journal](11-simulated-trade-journal.md)
- [12 - Glossary](12-glossary.md)
- [13 - Progress + Quiz System](13-progress-quiz-system.md)
- [14 - Risk Acknowledgements](14-risk-acknowledgements.md)
- [15 - Import, Export + Backup](15-import-export-backup.md)
- [16 - Training Visuals + Plain Language](16-training-visuals-and-plain-language.md)
- [17 - Real Market Simulation](17-real-market-simulation.md)

## Shared Terms

- **Simulated trade**: A saved educational trade model created inside the app.
- **Option leg**: One buy or sell call/put component of a strategy.
- **Strategy template**: A reusable definition for a common strategy.
- **Lesson step**: A single unit of tutorial content or interaction.
- **Risk acknowledgement**: A local record that the user saw and accepted a specific educational risk disclosure.
- **Defined risk**: A trade where the maximum loss can be calculated at entry.
- **Undefined risk**: A trade where loss may be open-ended or not capped by the option structure alone.
- **Market snapshot**: The quote, option chain rows, provider, timestamp, and assumptions saved with a simulated trade.

## Global UX Rules

- Label all app-generated trades as simulated.
- Show max loss before any save action where the value can be calculated.
- Surface assignment and early exercise notes for short option strategies.
- Prefer plain English explanations with technical detail available nearby.
- Keep dense financial data scannable with compact labels and consistent alignment.
- Never imply profit certainty or personalized investment advice.
