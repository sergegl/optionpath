import type { Lesson, LessonStep, Tutorial } from "../db/types";
import type { LessonVisualPayload } from "./trainingVisuals";

export const seedTutorials: Tutorial[] = [
  {
    id: "tutorial-beginner",
    title: "Options Foundations",
    level: "beginner",
    summary: "Start with what an option is, how calls and puts work, and the first few simple trades you can build with them.",
    order: 1,
  },
  {
    id: "tutorial-intermediate",
    title: "Defined-Risk Spreads",
    level: "intermediate",
    summary: "Move from single-option trades to combinations like vertical spreads and collars, and start planning for assignment.",
    order: 2,
  },
  {
    id: "tutorial-advanced",
    title: "Volatility and Adjustments",
    level: "advanced",
    summary: "Build multi-leg trades, think about how volatility affects them, and learn the basics of adjusting a position.",
    order: 3,
  },
];

export const seedLessons: Lesson[] = [
  {
    id: "lesson-option-contracts",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Option Contracts",
    summary: "Learn what one option contract controls and why one contract usually represents 100 shares.",
    estimatedMinutes: 6,
    order: 1,
  },
  {
    id: "lesson-calls-puts",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Calls and Puts",
    summary: "Compare what option buyers and sellers can do — and what they may be required to do.",
    estimatedMinutes: 8,
    order: 2,
  },
  {
    id: "lesson-strike-expiration-premium",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Strike, Expiration, and Premium",
    summary: "Learn the three numbers that define every option trade before you do any payoff math.",
    estimatedMinutes: 7,
    order: 3,
  },
  {
    id: "lesson-intrinsic-extrinsic",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Intrinsic and Extrinsic Value",
    summary: "See how an option's price splits into real exercise value and the time value layered on top.",
    estimatedMinutes: 7,
    order: 4,
  },
  {
    id: "lesson-long-call",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Long Call",
    summary: "Build a bullish trade where the most you can lose is the premium you paid up front.",
    estimatedMinutes: 9,
    order: 5,
  },
  {
    id: "lesson-long-put",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Long Put",
    summary: "Build a bearish trade where the most you can lose is the premium, and see how downside moves change the payoff.",
    estimatedMinutes: 9,
    order: 6,
  },
  {
    id: "lesson-covered-call",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Covered Call",
    summary: "Sell a call against shares you already own to collect premium — and accept a cap on the upside.",
    estimatedMinutes: 10,
    order: 7,
  },
  {
    id: "lesson-cash-secured-put",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Cash-Secured Put",
    summary: "Sell a put while setting aside enough cash to buy the shares if you get assigned.",
    estimatedMinutes: 10,
    order: 8,
  },
  {
    id: "lesson-protective-put",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Protective Put",
    summary: "Buy a put on top of stock you own to set a floor on how far the position can fall.",
    estimatedMinutes: 8,
    order: 9,
  },
  {
    id: "lesson-beginner-review",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Beginner Review",
    summary: "Match each beginner strategy to its risk shape so you can pick the right one for a given outlook.",
    estimatedMinutes: 6,
    order: 10,
  },
];

const lessonContent: Record<
  string,
  Array<{
    type: LessonStep["type"];
    title: string;
    body: string;
    payload?: LessonVisualPayload & Record<string, unknown>;
  }>
> = {
  "lesson-option-contracts": [
    {
      type: "concept",
      title: "What a contract controls",
      body: "One option contract is a handle attached to 100 shares of stock. Option prices are quoted per share, so a $2.00 quote means one contract costs about $200 before fees.",
      payload: {
        visual: { assetId: "visual-contract-100-shares" },
        plainLanguage: {
          oneLine: "One standard equity option contract is usually tied to 100 shares.",
          analogy: "The contract is the handle. The 100 shares are what the handle controls.",
        },
        bullets: [
          "A call gives the buyer the right to buy 100 shares at a set price (called the strike).",
          "A put gives the buyer the right to sell 100 shares at the strike.",
          "Every option has an expiration date, so timing is part of the risk.",
        ],
      },
    },
    {
      type: "interactive",
      title: "Contract multiplier",
      body: "Option prices look small because they are quoted per share. To get the actual dollar cost, multiply the quote by the number of contracts and then by 100.",
      payload: {
        visual: { assetId: "visual-contract-multiplier" },
        plainLanguage: {
          oneLine: "Per-share quote × contracts × 100 = total dollars.",
          formulaLabel: "Example",
          formulaText: "$2.40 × 2 contracts × 100 = $480",
        },
        example: "premium * contracts * 100",
      },
    },
    {
      type: "checkpoint",
      title: "Key checkpoint",
      body: "The quoted premium is per share, but the trade value uses the 100-share multiplier. A small-looking quote can still represent a real-money trade.",
      payload: {
        plainLanguage: {
          oneLine: "A small quote can still represent a much larger trade value.",
          keyRisk: "Always convert the per-share quote to total dollars before comparing risk.",
        },
      },
    },
  ],
  "lesson-calls-puts": [
    {
      type: "concept",
      title: "Rights and obligations",
      body: "When you buy an option, you get a choice — you can use it or let it expire. When you sell an option, the other side has the choice, and you may be forced to act. Being forced to act is called assignment.",
      payload: {
        visual: { assetId: "visual-rights-obligations" },
        plainLanguage: {
          oneLine: "Option buyers get to choose. Option sellers may be required to act.",
          keyRisk: "Selling an option (a 'short' option) creates an assignment obligation.",
        },
        bullets: [
          "A bought call gains value when the stock goes up.",
          "A bought put gains value when the stock goes down.",
          "If you sold an option (a 'short' option), it can be assigned before expiration.",
        ],
      },
    },
    {
      type: "example",
      title: "Simple comparison",
      body: "Think of the strike price as a line in the sand. A 100 call starts paying off when the stock goes above 100. A 100 put starts paying off when the stock goes below 100.",
      payload: {
        visual: { assetId: "visual-call-put-direction" },
        plainLanguage: {
          oneLine: "Calls look above the strike. Puts look below the strike.",
        },
      },
    },
    {
      type: "checkpoint",
      title: "Key checkpoint",
      body: "When you buy an option, the most you can lose is the premium you paid. When you sell an option, you take on an obligation to act if you get assigned.",
      payload: {
        plainLanguage: {
          oneLine: "Buying an option risks the premium. Selling an option adds the obligation to act.",
        },
      },
    },
  ],
  "lesson-strike-expiration-premium": [
    {
      type: "concept",
      title: "The three trade inputs",
      body: "Every option trade starts with three numbers: the strike, the expiration date, and the premium. The strike is the price at which you could buy or sell the shares. The expiration is the last day the option is valid. The premium is what the option costs.",
      payload: {
        visual: { assetId: "visual-option-ticket" },
        plainLanguage: {
          oneLine: "Strike, expiration, and premium are the three basic fields on every option ticket.",
        },
      },
    },
    {
      type: "example",
      title: "Debit and credit",
      body: "Buying an option sends money out — that is called paying a debit. Selling an option brings money in — that is called receiving a credit. Selling also adds the obligation to act if assigned. One option quoted at $1.75 costs $175 before fees.",
      payload: {
        visual: { assetId: "visual-debit-credit-flow" },
        plainLanguage: {
          oneLine: "A debit is money paid out. A credit is money received.",
          formulaLabel: "One-contract example",
          formulaText: "$1.75 × 100 = $175",
        },
      },
    },
    {
      type: "checkpoint",
      title: "Key checkpoint",
      body: "Any option strategy can be broken into legs — each leg is one buy or sell of an option (or stock). Each leg has the same six fields: action, option type, strike, premium, quantity, and expiration.",
      payload: {
        plainLanguage: {
          oneLine: "A strategy is just a list of legs, and each leg has the same basic fields.",
        },
      },
    },
  ],
  "lesson-intrinsic-extrinsic": [
    {
      type: "concept",
      title: "Intrinsic value",
      body: "Intrinsic value is what an option would be worth if you exercised it right now. A call has intrinsic value when the stock is above the strike. A put has intrinsic value when the stock is below the strike.",
      payload: {
        visual: { assetId: "visual-intrinsic-extrinsic-stack" },
        plainLanguage: {
          oneLine: "Intrinsic value is the option's built-in exercise value.",
        },
      },
    },
    {
      type: "example",
      title: "Extrinsic value",
      body: "Extrinsic value is the rest of the premium — the part that comes from time and uncertainty. If a 100 call trades for $7.00 while the stock is at $105, the $5.00 above the strike is intrinsic and the remaining $2.00 is extrinsic.",
      payload: {
        visual: { assetId: "visual-intrinsic-extrinsic-stack" },
        plainLanguage: {
          oneLine: "Extrinsic value is the extra part of the premium tied to time and uncertainty.",
          formulaLabel: "Value split",
          formulaText: "$7 premium = $5 intrinsic + $2 extrinsic",
        },
      },
    },
    {
      type: "checkpoint",
      title: "Key checkpoint",
      body: "Premium can include intrinsic value, extrinsic value, or both. An option that has no exercise value yet (out-of-the-money, or OTM) is made up entirely of extrinsic value.",
      payload: {
        plainLanguage: {
          oneLine: "Premium can be built-in value, time value, or both.",
        },
      },
    },
  ],
  "lesson-long-call": [
    {
      type: "concept",
      title: "Long call profile",
      body: "A long call means you bought a call (the word 'long' just means you own it). It is a bullish trade — you make money if the stock goes up. You pay the premium up front, and that premium is the most this simplified model says you can lose.",
      payload: {
        visual: { assetId: "visual-long-call-story" },
        plainLanguage: {
          oneLine: "A long call pays premium for the chance to profit if the stock rises.",
          formulaLabel: "Expiration breakeven",
          formulaText: "strike + premium",
          keyRisk: "If the stock does not rise enough by expiration, you can lose the entire premium.",
        },
        strategyId: "strategy-long-call",
      },
    },
    {
      type: "example",
      title: "Example",
      body: "Suppose you buy a 100 call for $3.00. The modeled max loss is $300 (because $3 × 100 = $300). The breakeven is 103 — the stock has to cover the 100 strike plus the $3 premium before the trade turns profitable at expiration.",
      payload: {
        plainLanguage: {
          oneLine: "The stock has to clear strike + premium before the expiration model turns positive.",
          formulaLabel: "Breakeven example",
          formulaText: "100 + 3 = 103",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder with a long call already set up and try changing the strike or the premium. Watch how the payoff line moves.",
      payload: { strategyId: "strategy-long-call", actionLabel: "Practice long call" },
    },
  ],
  "lesson-long-put": [
    {
      type: "concept",
      title: "Long put profile",
      body: "A long put means you bought a put. It is a bearish trade — you make money if the stock goes down. You pay the premium up front, and that premium is the most this simplified model says you can lose.",
      payload: {
        visual: { assetId: "visual-long-put-story" },
        plainLanguage: {
          oneLine: "A long put pays premium for the chance to profit if the stock falls.",
          formulaLabel: "Expiration breakeven",
          formulaText: "strike − premium",
          keyRisk: "If the stock does not fall enough by expiration, you can lose the entire premium.",
        },
        strategyId: "strategy-long-put",
      },
    },
    {
      type: "example",
      title: "Example",
      body: "Suppose you buy a 100 put for $2.50. The modeled max loss is $250. The breakeven is 97.50 — the stock has to fall below the strike by enough to cover the $2.50 premium.",
      payload: {
        plainLanguage: {
          oneLine: "The stock has to fall below strike − premium before the expiration model turns positive.",
          formulaLabel: "Breakeven example",
          formulaText: "100 − 2.50 = 97.50",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder with a long put already set up and compare what happens at different stock prices.",
      payload: { strategyId: "strategy-long-put", actionLabel: "Practice long put" },
    },
  ],
  "lesson-covered-call": [
    {
      type: "concept",
      title: "Covered call profile",
      body: "A covered call starts with 100 shares (or more) that you already own. You sell a call against those shares to collect premium. The trade-off: if the stock rises above the strike, the buyer can use their right and you have to sell your shares at the strike — that is called assignment, and it caps your upside.",
      payload: {
        visual: { assetId: "visual-covered-call-story" },
        plainLanguage: {
          oneLine: "A covered call gives up some upside in exchange for premium income.",
          keyRisk: "You still own the stock, so you still take the downside. Assignment can force you to sell the shares at the strike.",
        },
        strategyId: "strategy-covered-call",
      },
    },
    {
      type: "example",
      title: "Example",
      body: "Suppose you own 100 shares at $100 and sell a 110 call for $2.00. You collect $200 in premium right away. But if the stock rises above 110, the call can be assigned and you have to sell your shares at $110 — even if the stock keeps rising past that.",
      payload: {
        plainLanguage: {
          oneLine: "Premium comes in now, but the short call creates an obligation to sell at the strike.",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder and look at the downside of a covered call. The premium softens losses a little, but the stock can still fall.",
      payload: { strategyId: "strategy-covered-call", actionLabel: "Practice covered call" },
    },
  ],
  "lesson-cash-secured-put": [
    {
      type: "concept",
      title: "Cash-secured put profile",
      body: "A cash-secured put means you sell a put and set aside enough cash to buy 100 shares if you get assigned. You collect the premium right away. If the stock falls below the strike at expiration, you may have to buy the shares at the strike price.",
      payload: {
        visual: { assetId: "visual-cash-secured-put-story" },
        plainLanguage: {
          oneLine: "A cash-secured put collects premium while reserving cash for possible assignment.",
          keyRisk: "After assignment, you own the shares — and you take any further losses if the stock keeps falling.",
        },
        strategyId: "strategy-cash-secured-put",
      },
    },
    {
      type: "checkpoint",
      title: "Assignment risk",
      body: "If assigned, the put seller has to buy 100 shares at the strike, even if the stock has dropped well below it. That is why the trade is cash-secured — you keep the cash on hand instead of treating the premium as free income.",
      payload: {
        visual: { assetId: "visual-rights-obligations" },
        plainLanguage: {
          oneLine: "Assignment is the moment your put-selling obligation turns into actually buying the shares.",
          keyRisk: "The premium you collect is capped, but the stock loss after assignment is not.",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder and compare the premium received with the dollar amount you would owe if assigned.",
      payload: {
        strategyId: "strategy-cash-secured-put",
        actionLabel: "Practice cash-secured put",
      },
    },
  ],
  "lesson-protective-put": [
    {
      type: "concept",
      title: "Protective put profile",
      body: "A protective put starts with shares you already own. You buy a put as insurance — it sets a floor on how far the position can lose. The cost of that protection is the premium you pay for the put.",
      payload: {
        visual: { assetId: "visual-protective-put-story" },
        plainLanguage: {
          oneLine: "A protective put buys a downside floor under a stock you already own.",
          keyRisk: "The protection costs premium, so the stock has to rise a bit further before you break even.",
        },
        strategyId: "strategy-protective-put",
      },
    },
    {
      type: "example",
      title: "Example",
      body: "Suppose you own 100 shares at $100 and buy a 95 put for $2.00. If the stock falls below 95, the put limits how much further you can lose. The protection costs $200 — so the position only starts to break even above $102.",
      payload: {
        plainLanguage: {
          oneLine: "The put floor helps below the strike, but the protection is not free.",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder and try moving the protective put strike up and down. Watch how the downside floor changes — and how the breakeven moves with it.",
      payload: { strategyId: "strategy-protective-put", actionLabel: "Practice protective put" },
    },
  ],
  "lesson-beginner-review": [
    {
      type: "quiz",
      title: "Strategy match",
      body: "Use the risk shape first. Long calls and long puts risk only the premium paid. Covered calls cap your upside in exchange for premium. Cash-secured puts hold cash in case of assignment. Protective puts add a floor under a stock you own.",
      payload: {
        visual: { assetId: "visual-beginner-strategy-match" },
        plainLanguage: {
          oneLine: "Each beginner strategy has a different risk shape — pick the one that matches your outlook.",
        },
        questions: [
          {
            id: "beginner-review-profile",
            prompt: "Which beginner strategy caps upside because it includes a short call against shares?",
            choices: ["Long call", "Covered call", "Long put", "Protective put"],
            answer: "Covered call",
          },
        ],
      },
    },
    {
      type: "summary",
      title: "Next step",
      body: "Use the strategy library or the builder to compare these strategies side by side. Keep all trades simulated until you can explain the max loss and breakeven of each one without checking the app.",
      payload: {
        plainLanguage: {
          oneLine: "Before modeling advanced trades, make sure the basic risk shapes feel familiar.",
        },
      },
    },
  ],
};

export const seedLessonSteps: LessonStep[] = seedLessons.flatMap((lesson) =>
  (lessonContent[lesson.id] ?? []).map((step, index) => ({
    id: `${lesson.id}-step-${index + 1}`,
    lessonId: lesson.id,
    order: index + 1,
    ...step,
  })),
);
