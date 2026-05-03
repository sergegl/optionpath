import type { Lesson, LessonStep, Tutorial } from "../db/types";
import type { LessonVisualPayload } from "./trainingVisuals";

export const seedTutorials: Tutorial[] = [
  {
    id: "tutorial-beginner",
    title: "Options Foundations",
    level: "beginner",
    summary: "Learn contracts, calls, puts, premium, expiration, and the first common trades.",
    order: 1,
  },
  {
    id: "tutorial-intermediate",
    title: "Defined-Risk Spreads",
    level: "intermediate",
    summary: "Move from single-leg trades into vertical spreads, collars, and assignment planning.",
    order: 2,
  },
  {
    id: "tutorial-advanced",
    title: "Volatility and Adjustments",
    level: "advanced",
    summary: "Explore multi-leg structures, volatility assumptions, and simplified adjustment planning.",
    order: 3,
  },
];

export const seedLessons: Lesson[] = [
  {
    id: "lesson-option-contracts",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Option Contracts",
    summary: "Understand what one option contract controls and why the contract multiplier matters.",
    estimatedMinutes: 6,
    order: 1,
  },
  {
    id: "lesson-calls-puts",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Calls and Puts",
    summary: "Compare the rights and obligations behind calls, puts, buyers, and sellers.",
    estimatedMinutes: 8,
    order: 2,
  },
  {
    id: "lesson-strike-expiration-premium",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Strike, Expiration, and Premium",
    summary: "Learn the basic variables that define an option trade before payoff math.",
    estimatedMinutes: 7,
    order: 3,
  },
  {
    id: "lesson-intrinsic-extrinsic",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Intrinsic and Extrinsic Value",
    summary: "Separate real exercise value from the remaining time and uncertainty in the premium.",
    estimatedMinutes: 7,
    order: 4,
  },
  {
    id: "lesson-long-call",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Long Call",
    summary: "Build a bullish premium-risk trade and identify its breakeven.",
    estimatedMinutes: 9,
    order: 5,
  },
  {
    id: "lesson-long-put",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Long Put",
    summary: "Build a bearish premium-risk trade and see how downside movement changes payoff.",
    estimatedMinutes: 9,
    order: 6,
  },
  {
    id: "lesson-covered-call",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Covered Call",
    summary: "Combine stock ownership with a short call and understand capped upside.",
    estimatedMinutes: 10,
    order: 7,
  },
  {
    id: "lesson-cash-secured-put",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Cash-Secured Put",
    summary: "Understand short put income, assignment, and cash-backed downside exposure.",
    estimatedMinutes: 10,
    order: 8,
  },
  {
    id: "lesson-protective-put",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Protective Put",
    summary: "Use a long put to define a downside floor for a stock position.",
    estimatedMinutes: 8,
    order: 9,
  },
  {
    id: "lesson-beginner-review",
    tutorialId: "tutorial-beginner",
    level: "beginner",
    title: "Beginner Review",
    summary: "Review the first strategies and match each one to its risk profile.",
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
      body: "Think of one option contract as a handle attached to 100 shares. If the option is quoted at $2.00, one contract costs about $200 before fees because the quote is per share.",
      payload: {
        visual: { assetId: "visual-contract-100-shares" },
        plainLanguage: {
          oneLine: "One standard equity option contract is usually tied to 100 shares.",
          analogy: "The contract is the handle. The shares are what the handle controls.",
        },
        bullets: [
          "Calls give the holder the right to buy at the strike.",
          "Puts give the holder the right to sell at the strike.",
          "Options expire, so timing is part of the risk.",
        ],
      },
    },
    {
      type: "interactive",
      title: "Contract multiplier",
      body: "The premium quote is small because it is quoted per share. The trade value gets bigger when you multiply by contracts and the 100-share multiplier.",
      payload: {
        visual: { assetId: "visual-contract-multiplier" },
        plainLanguage: {
          oneLine: "Premium quote x contracts x 100 gives the modeled option value.",
          formulaLabel: "Example",
          formulaText: "$2.40 x 2 contracts x 100 = $480",
        },
        example: "premium * contracts * 100",
      },
    },
    {
      type: "checkpoint",
      title: "Key checkpoint",
      body: "The quoted premium is per share, but the trade value uses the contract multiplier.",
      payload: {
        plainLanguage: {
          oneLine: "A small quote can still represent a larger trade value.",
          keyRisk: "Always convert premium to total dollars before comparing risk.",
        },
      },
    },
  ],
  "lesson-calls-puts": [
    {
      type: "concept",
      title: "Rights and obligations",
      body: "Buying an option gives you a choice. Selling an option means you may have to act if assigned. That difference is the first big risk idea.",
      payload: {
        visual: { assetId: "visual-rights-obligations" },
        plainLanguage: {
          oneLine: "Buyers choose. Sellers may be required to act.",
          keyRisk: "Short options can create assignment obligations.",
        },
        bullets: [
          "Calls generally benefit from upward price movement.",
          "Puts generally benefit from downward price movement.",
          "Short options can be assigned before expiration.",
        ],
      },
    },
    {
      type: "example",
      title: "Simple comparison",
      body: "Use the strike as the line in the sand. A 100 call starts gaining intrinsic value above 100. A 100 put starts gaining intrinsic value below 100.",
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
      body: "Buying an option limits loss to the premium paid. Selling an option creates an obligation.",
      payload: {
        plainLanguage: {
          oneLine: "Long options risk premium. Short options add obligation risk.",
        },
      },
    },
  ],
  "lesson-strike-expiration-premium": [
    {
      type: "concept",
      title: "The three trade inputs",
      body: "Most option examples start with three fields: strike, expiration, and premium. Strike is the exercise price, expiration is the final date, and premium is the price of the option.",
      payload: {
        visual: { assetId: "visual-option-ticket" },
        plainLanguage: {
          oneLine: "Strike, expiration, and premium are the basic option ticket fields.",
        },
      },
    },
    {
      type: "example",
      title: "Debit and credit",
      body: "Buying premium sends money out. Selling premium brings money in, but it may add obligations. One option at $1.75 is $175 before fees.",
      payload: {
        visual: { assetId: "visual-debit-credit-flow" },
        plainLanguage: {
          oneLine: "A debit is money paid. A credit is money received.",
          formulaLabel: "One-contract example",
          formulaText: "$1.75 x 100 = $175",
        },
      },
    },
    {
      type: "checkpoint",
      title: "Key checkpoint",
      body: "A strategy can be described by its legs: action, option type, strike, premium, quantity, and expiration.",
      payload: {
        plainLanguage: {
          oneLine: "A strategy is a list of legs, and each leg has the same basic fields.",
        },
      },
    },
  ],
  "lesson-intrinsic-extrinsic": [
    {
      type: "concept",
      title: "Intrinsic value",
      body: "Intrinsic value is the value an option already has if it were exercised now. A call has intrinsic value above its strike. A put has intrinsic value below its strike.",
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
      body: "Extrinsic value is the part of premium above intrinsic value. If a 100 call trades for $7.00 while the stock is at $105, $5.00 is intrinsic and $2.00 is extrinsic.",
      payload: {
        visual: { assetId: "visual-intrinsic-extrinsic-stack" },
        plainLanguage: {
          oneLine: "Extrinsic value is the extra part of premium tied to time and uncertainty.",
          formulaLabel: "Value split",
          formulaText: "$7 premium = $5 intrinsic + $2 extrinsic",
        },
      },
    },
    {
      type: "checkpoint",
      title: "Key checkpoint",
      body: "Premium can include both intrinsic value and extrinsic value. Out-of-the-money options are entirely extrinsic.",
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
      body: "A long call is a bullish option trade. You pay premium for upside exposure, and the premium paid is the most this simplified model can lose.",
      payload: {
        visual: { assetId: "visual-long-call-story" },
        plainLanguage: {
          oneLine: "A long call pays premium to look for upside.",
          formulaLabel: "Expiration breakeven",
          formulaText: "strike + premium",
          keyRisk: "If the stock does not rise enough, the premium can be lost.",
        },
        strategyId: "strategy-long-call",
      },
    },
    {
      type: "example",
      title: "Example",
      body: "Buy a 100 call for $3.00. The modeled max loss is $300. The breakeven is 103 because the stock must cover the 100 strike plus the $3 premium.",
      payload: {
        plainLanguage: {
          oneLine: "The stock has to move above strike plus premium before the expiration model turns positive.",
          formulaLabel: "Breakeven example",
          formulaText: "100 + 3 = 103",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder with a long call preselected and change the strike or premium to see the payoff update.",
      payload: { strategyId: "strategy-long-call", actionLabel: "Practice long call" },
    },
  ],
  "lesson-long-put": [
    {
      type: "concept",
      title: "Long put profile",
      body: "A long put is a bearish option trade. You pay premium for downside exposure, and the premium paid is the most this simplified model can lose.",
      payload: {
        visual: { assetId: "visual-long-put-story" },
        plainLanguage: {
          oneLine: "A long put pays premium to look for downside.",
          formulaLabel: "Expiration breakeven",
          formulaText: "strike - premium",
          keyRisk: "If the stock does not fall enough, the premium can be lost.",
        },
        strategyId: "strategy-long-put",
      },
    },
    {
      type: "example",
      title: "Example",
      body: "Buy a 100 put for $2.50. The modeled max loss is $250. The breakeven is 97.50 because the stock must move below the strike enough to cover the premium.",
      payload: {
        plainLanguage: {
          oneLine: "The stock has to move below strike minus premium before the expiration model turns positive.",
          formulaLabel: "Breakeven example",
          formulaText: "100 - 2.50 = 97.50",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder with a long put preselected and compare downside scenarios.",
      payload: { strategyId: "strategy-long-put", actionLabel: "Practice long put" },
    },
  ],
  "lesson-covered-call": [
    {
      type: "concept",
      title: "Covered call profile",
      body: "A covered call starts with shares you own. You sell a call to collect premium, but you accept that your upside can be capped if shares are called away.",
      payload: {
        visual: { assetId: "visual-covered-call-story" },
        plainLanguage: {
          oneLine: "A covered call trades some upside for premium income.",
          keyRisk: "Stock downside remains, and assignment can sell the shares at the strike.",
        },
        strategyId: "strategy-covered-call",
      },
    },
    {
      type: "example",
      title: "Example",
      body: "Own 100 shares at $100 and sell a 110 call for $2.00. The premium helps income, but gains are capped above 110 because the short call can be assigned.",
      payload: {
        plainLanguage: {
          oneLine: "Premium comes in now, but the short call creates a sell-at-the-strike obligation.",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder and inspect the stock downside that remains in a covered call.",
      payload: { strategyId: "strategy-covered-call", actionLabel: "Practice covered call" },
    },
  ],
  "lesson-cash-secured-put": [
    {
      type: "concept",
      title: "Cash-secured put profile",
      body: "A cash-secured put means selling a put while keeping cash ready. You collect premium, but assignment can require buying shares at the strike.",
      payload: {
        visual: { assetId: "visual-cash-secured-put-story" },
        plainLanguage: {
          oneLine: "A cash-secured put collects premium while reserving cash for possible assignment.",
          keyRisk: "Downside exposure remains if the stock falls after assignment.",
        },
        strategyId: "strategy-cash-secured-put",
      },
    },
    {
      type: "checkpoint",
      title: "Assignment risk",
      body: "If assigned, the seller may be required to buy shares at the strike. This is why the trade is modeled as cash-backed instead of free income.",
      payload: {
        visual: { assetId: "visual-rights-obligations" },
        plainLanguage: {
          oneLine: "Assignment is the moment the short put obligation becomes a stock purchase.",
          keyRisk: "The premium is limited, but the stock downside can be much larger.",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder and compare the premium received with the downside obligation.",
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
      body: "A protective put starts with shares you own. You buy a put to create a downside floor, and the cost of that protection is the premium.",
      payload: {
        visual: { assetId: "visual-protective-put-story" },
        plainLanguage: {
          oneLine: "A protective put buys a floor under a stock position.",
          keyRisk: "The hedge costs premium, so breakeven moves higher.",
        },
        strategyId: "strategy-protective-put",
      },
    },
    {
      type: "example",
      title: "Example",
      body: "Own 100 shares at $100 and buy a 95 put for $2.00. The modeled downside below 95 is limited by the put, but the protection still costs $200.",
      payload: {
        plainLanguage: {
          oneLine: "The put floor helps below the strike, but protection is not free.",
        },
      },
    },
    {
      type: "summary",
      title: "Practice",
      body: "Open the builder and see how changing the protective put strike changes the downside floor.",
      payload: { strategyId: "strategy-protective-put", actionLabel: "Practice protective put" },
    },
  ],
  "lesson-beginner-review": [
    {
      type: "quiz",
      title: "Strategy match",
      body: "Use the risk shape first. Long calls and long puts risk premium. Covered calls cap upside. Cash-secured puts reserve cash for assignment. Protective puts add a floor.",
      payload: {
        visual: { assetId: "visual-beginner-strategy-match" },
        plainLanguage: {
          oneLine: "Each beginner strategy has a different risk shape.",
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
      body: "Use the strategy library or builder to compare beginner strategies side by side. Keep trades simulated until you can explain max loss and breakeven without the app.",
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
