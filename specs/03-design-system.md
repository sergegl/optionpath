# 03 - Design System

## Purpose

Create a coherent visual and interaction system that makes the app feel like a serious, clean, intuitive options education product.

## Design Lane

**Neo Terminal Editorial**

Use a finance-tool foundation with editorial clarity:

- structured layouts
- sharp typography
- compact metrics
- chart-forward composition
- calm surfaces
- one high-signal accent color

## User Stories

- As a beginner, I want the interface to feel understandable and not intimidating.
- As an intermediate user, I want dense trade information to be easy to scan.
- As a mobile user, I want controls that remain usable on a small screen.
- As a keyboard user, I want every control to have clear focus and state.

## Visual Tokens

Recommended palette:

```txt
background: #f7f8f5
surface: #ffffff
surface-muted: #eef1ea
ink: #121512
ink-muted: #5d655e
line: #d9ded6
primary: #09a66d
primary-ink: #053f2b
support: #2357ff
warning: #c87900
danger: #b42318
profit: #087f5b
loss: #c92a2a
```

Typography:

- Display: condensed or strong sans-serif for major headings.
- Body: highly readable sans-serif.
- Utility: mono or tabular-number style for metrics, labels, and prices.
- Use tabular numerals for prices, strikes, premiums, and percentages.

Spacing:

- 4px base.
- 8px radius maximum for cards and panels.
- Dense controls may use 6px radius.
- Avoid oversized rounded pill UI unless it is a segmented control or badge.

## Core Components

Required:

- App shell
- Button
- Icon button
- Input
- Number input
- Select
- Segmented control
- Slider
- Toggle
- Checkbox
- Tabs
- Stepper
- Badge
- Metric tile
- Strategy card
- Trade leg row
- Payoff chart shell
- Modal
- Toast/status message
- Empty state
- Risk callout

## Component Rules

Buttons:

- Primary: main next action.
- Secondary: neutral actions.
- Ghost/icon: navigation and compact controls.
- Destructive: reset/delete only.
- Include icons for tool actions when a lucide icon exists.

Cards:

- Use for repeated items, strategy summaries, lessons, and saved trades.
- Do not nest cards inside cards.
- Keep radii at 8px or less.

Forms:

- Labels are always visible.
- Validation messages appear near the relevant field.
- Numeric inputs align values consistently.
- Use sliders only when approximate adjustment is acceptable.

Charts:

- Profit and loss colors must be distinct.
- Do not rely on color alone.
- Show breakeven markers and zero line.

## Layout Rules

- Use full-width app sections with constrained inner content.
- Avoid landing-page hero patterns.
- The first screen is the working dashboard.
- Keep chart and controls visible together on desktop when possible.
- On mobile, stack controls above chart with sticky action footer only when needed.

## Motion Rules

- Use 160ms to 240ms for hover and control transitions.
- Animate chart updates subtly.
- Use motion to clarify selection and progression.
- Respect `prefers-reduced-motion`.
- No ambient motion that distracts from financial data.

## Accessibility Requirements

- Text must meet contrast requirements.
- Focus ring must be visible on all interactive elements.
- All icon-only buttons require accessible labels and tooltips.
- Forms must associate labels and descriptions.
- Do not encode profit/loss only through color.
- Text must not overflow controls at 320px width.

## Tests

- Component visual smoke checks.
- Keyboard interaction tests for tabs, steppers, segmented controls, and modals.
- Contrast audit for major surfaces.
- Responsive checks at mobile, tablet, and desktop widths.
- Reduced-motion check.

## Definition of Done

- Shared components cover all MVP screens.
- Components are documented by usage in the app.
- No screen invents one-off styling for common controls.
- Dense financial data remains readable on mobile and desktop.

