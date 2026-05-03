# 06 - Beginner Tutorial Content

## Purpose

Define the first educational path that teaches core options mechanics and the most common beginner strategies.

## User Stories

- As a beginner, I want to understand what an option contract is.
- As a beginner, I want to know the difference between calls and puts.
- As a learner, I want to understand premium, strike, expiration, breakeven, and assignment.
- As a learner, I want to practice common strategies before saving simulated trades.

## Beginner Path

Lessons:

1. Option Contracts
2. Calls and Puts
3. Strike, Expiration, and Premium
4. Intrinsic and Extrinsic Value
5. Long Call
6. Long Put
7. Covered Call
8. Cash-Secured Put
9. Protective Put
10. Beginner Review

## Lesson Requirements

### Option Contracts

Must teach:

- One listed equity option contract usually controls 100 shares.
- A call gives the holder the right to buy at the strike.
- A put gives the holder the right to sell at the strike.
- Options expire.
- Premium is paid by buyers and received by sellers.

Interaction:

- User adjusts number of contracts and sees share exposure.

### Calls and Puts

Must teach:

- Calls generally benefit from upward movement.
- Puts generally benefit from downward movement.
- Buyers have rights.
- Sellers have obligations if assigned.

Interaction:

- Compare simple call and put payoff at expiration.

### Strike, Expiration, and Premium

Must teach:

- Strike price.
- Expiration date.
- Premium and contract multiplier.
- Total debit or credit.

Interaction:

- User changes premium and contract count to see total cost.

### Intrinsic and Extrinsic Value

Must teach:

- Intrinsic value for calls and puts.
- Extrinsic value as premium minus intrinsic value.
- ITM, ATM, and OTM.

Interaction:

- User moves underlying price and sees moneyness change.

### Long Call

Must teach:

- Bullish directional strategy.
- Max loss is premium paid.
- Upside can be substantial.
- Breakeven is strike plus premium.
- Time decay can hurt.

Practice:

- Build and save a simulated long call.

### Long Put

Must teach:

- Bearish directional strategy.
- Max loss is premium paid.
- Breakeven is strike minus premium.
- Gains increase as underlying falls, down to zero.

Practice:

- Build and save a simulated long put.

### Covered Call

Must teach:

- Long stock plus short call.
- Premium income.
- Upside is capped above short call strike.
- Shares may be called away.
- Downside stock risk remains.

Practice:

- Build a simulated covered call with stock position.

### Cash-Secured Put

Must teach:

- Short put backed by cash to buy shares if assigned.
- Premium income.
- Assignment risk.
- Downside exposure if stock falls.

Practice:

- Build a simulated cash-secured put.

### Protective Put

Must teach:

- Long stock plus long put.
- Put creates downside protection below strike.
- Protection has a premium cost.
- Upside remains, reduced by premium.

Practice:

- Build a simulated protective put.

### Beginner Review

Must include:

- Short quiz.
- Identify bullish, bearish, hedge, and income use cases.
- Match strategies to risk profiles.
- Prompt user to try Strategy Builder.

## Tone and Content Rules

- Use educational language, not trade recommendations.
- Avoid profit hype.
- Show concrete numbers for every concept.
- Include risk notes in the same step as the strategy.
- Use simple examples before introducing jargon.

## Data Model

Seed into:

- `tutorials`
- `lessons`
- `lessonSteps`
- `strategyTemplates`
- `strategyTemplateLegs`

## State Rules

- Beginner lessons do not require risk acknowledgement before viewing.
- Practice saves are optional.
- User can complete a lesson without saving a trade.
- Review completion marks beginner path complete.

## Accessibility Requirements

- Content must be readable without charts.
- Formula examples must be written in text.
- Glossary links must have clear link text.
- Quiz answers use standard form controls.

## Tests

- All beginner lessons seed correctly.
- Lesson order is stable.
- Each strategy lesson includes a practice action.
- Quiz scoring persists.
- Glossary links resolve.
- Builder opens with correct strategy preselected from practice action.

## Definition of Done

- Beginner path can be completed end to end.
- User can build at least long call, long put, covered call, cash-secured put, and protective put from lesson actions.
- Beginner content is clear, risk-aware, and non-promotional.

