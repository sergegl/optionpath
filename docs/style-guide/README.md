# OptionPath Style Guide

This guide keeps OptionPath visually consistent as new lessons, strategy cards, and simulator features are added.

## Product Feel

OptionPath should feel calm, instructional, and finance-aware. It is a learning tool, not a trading terminal and not a marketing landing page.

Use:

- clear hierarchy
- compact but readable layouts
- plain English labels
- direct risk language
- restrained color
- tactile educational visuals

Avoid:

- hype language
- brokerage-style order ticket pressure
- decorative finance stock-photo filler
- oversized cards inside other cards
- gradients as the main visual idea
- visuals that imply profit certainty

## Core Palette

Use the Tailwind tokens already defined in `tailwind.config.js`.

| Token | Color | Use |
| --- | --- | --- |
| `canvas` | `#f7f8f5` | App background |
| `ink` | `#121512` | Primary text and dark panels |
| `muted` | `#5d655e` | Secondary text |
| `line` | `#d9ded6` | Borders and grid lines |
| `panel` | `#ffffff` | Main surfaces |
| `panel-muted` | `#eef1ea` | Quiet secondary surfaces |
| `primary` | `#09a66d` | Positive learning action and primary accents |
| `support` | `#2357ff` | Secondary educational highlights |
| `warning` | `#c87900` | Assignment, obligation, and caution |
| `profit` | `#087f5b` | Positive P/L states |
| `loss` | `#c92a2a` | Negative P/L states |

## Typography

- Use bold display type for page titles and major section titles.
- Use smaller, tighter headings inside cards and panels.
- Keep letter spacing normal.
- Use the mono style only for labels, chips, symbols, numbers, and compact metadata.
- Keep body copy plain and concrete.

## Components

- Cards should use an 8px radius.
- Do not nest large cards inside cards.
- Use badges for level, risk, data status, and simulation labels.
- Use lucide icons for button actions when an icon exists.
- Keep financial tables dense but aligned with tabular numbers.
- Show data freshness, provider status, and simulation-only status near market-backed views.

## Visual Asset Direction

The visual language is called **Tactile Finance Storyboard**.

It uses:

- off-white paper surfaces
- subtle grid lines
- rounded rectangles
- ink, green, blue, and copper accents
- simple payoff lines
- small finance objects only when they teach the concept

See [Image Generation Guide](image-generation.md) for strategy card image rules and reusable prompts.
