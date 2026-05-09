# Image Generation Guide

Use this guide when creating future OptionPath strategy thumbnails, lesson visuals, or glossary images.

## Shared Style

Style name: **Tactile Finance Storyboard**

Visual qualities:

- editorial finance education
- clean vector-like composition
- tactile paper surface
- subtle grid lines
- soft shadows
- rounded rectangles
- no photorealistic trading desk clutter
- no broker UI screenshots
- no profit-promising imagery

## Palette

Use this palette consistently:

- background paper: `#fbfcf8`, `#eef3ec`
- ink: `#121512`
- muted text: `#5d655e`
- borders and grid: `#d9ded6`
- primary green: `#09a66d`
- deep green text: `#053f2b`
- support blue: `#2357ff`
- blue fill: `#eaf0ff`
- warning copper: `#c87900`
- warning fill: `#fff6e8`
- loss red only when needed: `#c92a2a`

## Strategy Thumbnail Rules

Use these rules for images shown inside strategy cards.

- Format: SVG or PNG.
- Preferred source size: 320 x 240.
- Display ratio: 4:3.
- Design for the rendered card slot first: about 120 x 90 on desktop strategy cards.
- Keep visual density very low so it reads at small sizes.
- Use 1 main idea per image.
- Avoid embedded words in card thumbnails.
- If text is unavoidable, use one large one-character or two-character marker only.
- Do not use full-word labels, currency amounts, account-like numbers, or tiny annotations.
- Let the surrounding card copy explain the strategy; the image should only reinforce the shape.
- Do not include real ticker symbols, account balances, or broker controls.
- Do not show fake live quotes.
- Do not use arrows, colors, or labels that imply a recommended trade.
- Prefer bold shapes, large arcs, simple blocks, and clear floors/caps over miniature infographics.

## Current Thumbnail Pattern

Each strategy thumbnail should include:

- a paper background
- a light grid
- one or two rounded finance objects or abstract markers
- one payoff or exposure line
- one obvious risk/benefit cue using shape, not text

The current assets live in:

```text
public/visuals/strategy-cards/
```

## Prompt Template

Use this prompt template for generated bitmap images:

```text
Use case: scientific-educational
Asset type: 320x240 strategy card thumbnail for an options education app
Primary request: Create a clean educational finance illustration for <strategy name>.
Style: Tactile Finance Storyboard, vector-like, editorial, premium but restrained.
Scene/backdrop: off-white paper surface with faint grid lines, subtle depth, rounded shapes.
Subject: <one-sentence strategy concept>.
Palette: #fbfcf8, #eef3ec, #121512, #5d655e, #d9ded6, #09a66d, #053f2b, #2357ff, #eaf0ff, #c87900, #fff6e8.
Composition: one clear focal diagram, generous padding, legible at small card size.
Text: no embedded words. If unavoidable, one large single-character or two-character marker only.
Avoid: photorealistic brokers, trading screens, candlestick clutter, logos, ticker symbols, account balances, profit promises, hype, watermarks.
```

## Strategy-Specific Prompts

### Long Call

```text
Subject: a call contract card, a small premium-risk block, and an upward green payoff line after breakeven.
Text: none.
```

### Long Put

```text
Subject: a put contract card, a premium-risk block, and a blue downward exposure line showing protection or bearish payoff.
Text: none.
```

### Covered Call

```text
Subject: an owned-shares block, a short call cap above the payoff path, and a small income marker.
Text: none.
```

### Cash-Secured Put

```text
Subject: a cash reserve block beside a short put card with a possible assignment path toward shares.
Text: none.
```

### Protective Put

```text
Subject: an owned-shares block paired with a put card and a blue downside floor under the stock path.
Text: none.
```

## QA Checklist

Before committing a new image:

- It matches the 4:3 strategy thumbnail format.
- It still reads clearly around 120px wide and 90px tall.
- No full words or small labels are embedded in the image.
- Removing the card text should still leave one clear visual idea, not a full explanation.
- It uses the shared palette.
- It does not look like a live trading interface.
- It does not imply certainty, safety, or a recommendation.
- It has alt text in the data registry or component.
