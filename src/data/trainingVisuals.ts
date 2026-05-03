export type TrainingVisualKind =
  | "concept_image"
  | "diagram"
  | "formula_card"
  | "payoff_story"
  | "risk_scene"
  | "matching_cards";

export type TrainingVisualComponent =
  | "contractTiles"
  | "multiplierFormula"
  | "rightsObligations"
  | "callPutDirection"
  | "optionTicket"
  | "moneyFlow"
  | "valueStack"
  | "longCallStory"
  | "longPutStory"
  | "coveredCallStory"
  | "cashSecuredPutStory"
  | "protectivePutStory"
  | "strategyMatch";

export type TrainingVisualAsset = {
  id: string;
  kind: TrainingVisualKind;
  component: TrainingVisualComponent;
  title: string;
  caption: string;
  alt: string;
  dominantTone: "primary" | "support" | "warning" | "neutral";
};

export type LessonVisualPayload = {
  visual?: {
    assetId: string;
    title?: string;
    caption?: string;
    alt?: string;
    callouts?: Array<{
      label: string;
      body: string;
      glossaryTermId?: string;
    }>;
  };
  plainLanguage?: {
    oneLine: string;
    analogy?: string;
    formulaLabel?: string;
    formulaText?: string;
    keyRisk?: string;
  };
};

export type StrategyStory = {
  strategyId: string;
  plainSummary: string;
  visualAssetId: string;
  keyRisk: string;
  bestForLearning: string;
};

export const trainingVisualAssets: TrainingVisualAsset[] = [
  {
    id: "visual-contract-100-shares",
    kind: "diagram",
    component: "contractTiles",
    title: "One contract, 100 shares",
    caption: "The option quote is per share, but the contract usually controls 100 shares.",
    alt: "A single option contract card connected to a grid of 100 share tiles.",
    dominantTone: "primary",
  },
  {
    id: "visual-contract-multiplier",
    kind: "formula_card",
    component: "multiplierFormula",
    title: "Quoted premium becomes trade value",
    caption: "$2.40 x 1 contract x 100 shares equals about $240 before fees.",
    alt: "Formula showing option premium multiplied by contracts and 100 shares.",
    dominantTone: "support",
  },
  {
    id: "visual-rights-obligations",
    kind: "diagram",
    component: "rightsObligations",
    title: "Buyers have rights. Sellers accept obligations.",
    caption: "Buying an option is different from selling one because assignment risk sits with the seller.",
    alt: "Two cards comparing an option buyer right with an option seller obligation.",
    dominantTone: "warning",
  },
  {
    id: "visual-call-put-direction",
    kind: "diagram",
    component: "callPutDirection",
    title: "Calls look up. Puts look down.",
    caption: "At expiration, calls gain intrinsic value above the strike and puts below the strike.",
    alt: "A strike marker with a call arrow above it and a put arrow below it.",
    dominantTone: "support",
  },
  {
    id: "visual-option-ticket",
    kind: "concept_image",
    component: "optionTicket",
    title: "The option ticket",
    caption: "Most option examples come down to action, type, strike, expiration, premium, and quantity.",
    alt: "An annotated option ticket with fields for action, type, strike, expiration, premium, and quantity.",
    dominantTone: "neutral",
  },
  {
    id: "visual-debit-credit-flow",
    kind: "diagram",
    component: "moneyFlow",
    title: "Debit out, credit in",
    caption: "Buyers pay premium. Sellers receive premium and may take on obligations.",
    alt: "Two money-flow cards showing debit paid out and credit received in.",
    dominantTone: "primary",
  },
  {
    id: "visual-intrinsic-extrinsic-stack",
    kind: "formula_card",
    component: "valueStack",
    title: "Premium can have two parts",
    caption: "A $7 option can be $5 intrinsic value plus $2 extrinsic value.",
    alt: "A stacked bar splitting option premium into intrinsic and extrinsic value.",
    dominantTone: "support",
  },
  {
    id: "visual-long-call-story",
    kind: "payoff_story",
    component: "longCallStory",
    title: "Long call story",
    caption: "Pay premium for upside exposure. The premium is the amount at risk in this simplified model.",
    alt: "A payoff story showing a fixed premium loss and rising upside after breakeven.",
    dominantTone: "primary",
  },
  {
    id: "visual-long-put-story",
    kind: "payoff_story",
    component: "longPutStory",
    title: "Long put story",
    caption: "Pay premium for downside exposure. The trade improves as the underlying falls below breakeven.",
    alt: "A payoff story showing long put gains as the underlying moves down.",
    dominantTone: "support",
  },
  {
    id: "visual-covered-call-story",
    kind: "risk_scene",
    component: "coveredCallStory",
    title: "Covered call story",
    caption: "Own shares, collect premium, and accept that upside can be capped at the short call strike.",
    alt: "A stock position with a short call cap above it.",
    dominantTone: "warning",
  },
  {
    id: "visual-cash-secured-put-story",
    kind: "risk_scene",
    component: "cashSecuredPutStory",
    title: "Cash-secured put story",
    caption: "Collect premium while keeping cash ready in case assignment requires buying shares.",
    alt: "A cash reserve beside a short put assignment path.",
    dominantTone: "warning",
  },
  {
    id: "visual-protective-put-story",
    kind: "risk_scene",
    component: "protectivePutStory",
    title: "Protective put story",
    caption: "Own shares and buy a put to create a modeled downside floor.",
    alt: "A stock position with a protective floor below it.",
    dominantTone: "primary",
  },
  {
    id: "visual-beginner-strategy-match",
    kind: "matching_cards",
    component: "strategyMatch",
    title: "Match the shape to the strategy",
    caption: "Each beginner strategy has a different risk shape: premium risk, capped upside, cash-backed obligation, or hedge.",
    alt: "A set of beginner strategy cards showing different risk profiles.",
    dominantTone: "neutral",
  },
];

export const strategyStories: StrategyStory[] = [
  {
    strategyId: "strategy-long-call",
    plainSummary: "You pay a premium for upside exposure. If the stock does not rise enough, the premium can be lost.",
    visualAssetId: "visual-long-call-story",
    keyRisk: "The premium paid is at risk.",
    bestForLearning: "Bullish payoff, breakeven, and premium risk.",
  },
  {
    strategyId: "strategy-long-put",
    plainSummary: "You pay a premium for downside exposure. If the stock does not fall enough, the premium can be lost.",
    visualAssetId: "visual-long-put-story",
    keyRisk: "The premium paid is at risk.",
    bestForLearning: "Bearish payoff, breakeven, and premium risk.",
  },
  {
    strategyId: "strategy-covered-call",
    plainSummary: "You own shares and sell a call. You collect premium, but your upside is capped.",
    visualAssetId: "visual-covered-call-story",
    keyRisk: "Stock downside remains and shares can be called away.",
    bestForLearning: "Income, capped upside, and assignment.",
  },
  {
    strategyId: "strategy-cash-secured-put",
    plainSummary: "You collect premium and keep cash ready in case you must buy shares.",
    visualAssetId: "visual-cash-secured-put-story",
    keyRisk: "Assignment can require buying shares at the strike.",
    bestForLearning: "Credit, assignment, and cash-backed downside.",
  },
  {
    strategyId: "strategy-protective-put",
    plainSummary: "You own shares and buy a put to create a downside floor.",
    visualAssetId: "visual-protective-put-story",
    keyRisk: "The protection costs premium.",
    bestForLearning: "Hedging, floors, and protection cost.",
  },
];

export const glossaryVisualIds: Record<string, string> = {
  "option-contract": "visual-contract-100-shares",
  call: "visual-call-put-direction",
  put: "visual-call-put-direction",
  strike: "visual-option-ticket",
  premium: "visual-contract-multiplier",
  expiration: "visual-option-ticket",
  assignment: "visual-rights-obligations",
  "intrinsic-value": "visual-intrinsic-extrinsic-stack",
  "extrinsic-value": "visual-intrinsic-extrinsic-stack",
  breakeven: "visual-long-call-story",
  debit: "visual-debit-credit-flow",
  credit: "visual-debit-credit-flow",
  "covered-call": "visual-covered-call-story",
  "cash-secured-put": "visual-cash-secured-put-story",
  "protective-put": "visual-protective-put-story",
};

export function getTrainingVisualAsset(assetId?: string) {
  if (!assetId) return undefined;
  return trainingVisualAssets.find((asset) => asset.id === assetId);
}

export function getStrategyStory(strategyId: string) {
  return strategyStories.find((story) => story.strategyId === strategyId);
}

export function getGlossaryVisualAsset(termId: string) {
  return getTrainingVisualAsset(glossaryVisualIds[termId]);
}

