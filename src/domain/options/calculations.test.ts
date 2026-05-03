import { describe, expect, it } from "vitest";
import type { SimulatedTradeLeg, StrategyTemplate } from "../../db/types";
import {
  calculateStrategyMetrics,
  optionIntrinsicValue,
  payoffAtPrice,
  validateTradeDraftDetailed,
} from "./calculations";

const baseStrategy: StrategyTemplate = {
  id: "strategy-long-call",
  name: "Long Call",
  slug: "long-call",
  level: "beginner",
  category: "directional",
  outlook: "bullish",
  riskType: "premium",
  tradeStyle: "debit",
  summary: "",
  useCase: "",
  maxProfitText: "",
  maxLossText: "",
  breakevenText: "",
  assignmentRisk: "none",
};

describe("options domain calculations", () => {
  it("calculates intrinsic value for calls and puts", () => {
    expect(optionIntrinsicValue("call", 100, 108)).toBe(8);
    expect(optionIntrinsicValue("call", 100, 92)).toBe(0);
    expect(optionIntrinsicValue("put", 100, 92)).toBe(8);
    expect(optionIntrinsicValue("put", 100, 108)).toBe(0);
  });

  it("calculates long call payoff, max loss, and breakeven", () => {
    const legs = [optionLeg("buy", "call", 100, 3)];
    const metrics = calculateStrategyMetrics({ ...baseStrategy, id: "strategy-long-call" }, legs, 100);

    expect(payoffAtPrice(legs, 110)).toBe(700);
    expect(metrics.maxProfit).toBe("unlimited");
    expect(metrics.maxLoss).toBe(300);
    expect(metrics.breakevens).toEqual([103]);
  });

  it("calculates long put payoff, max loss, and breakeven", () => {
    const legs = [optionLeg("buy", "put", 100, 2.5)];
    const metrics = calculateStrategyMetrics(
      { ...baseStrategy, id: "strategy-long-put", outlook: "bearish" },
      legs,
      100,
    );

    expect(payoffAtPrice(legs, 90)).toBe(750);
    expect(metrics.maxProfit).toBe(9750);
    expect(metrics.maxLoss).toBe(250);
    expect(metrics.breakevens).toEqual([97.5]);
  });

  it("calculates covered call capped upside", () => {
    const legs: SimulatedTradeLeg[] = [
      stockLeg("buy", 100, 100),
      optionLeg("sell", "call", 110, 2),
    ];
    const metrics = calculateStrategyMetrics(
      {
        ...baseStrategy,
        id: "strategy-covered-call",
        outlook: "neutral",
        riskType: "stock_backed",
        assignmentRisk: "possible",
      },
      legs,
      100,
    );

    expect(payoffAtPrice(legs, 125)).toBe(1200);
    expect(metrics.maxProfit).toBe(1200);
    expect(metrics.maxLoss).toBe(9800);
    expect(metrics.breakevens).toEqual([98]);
    expect(metrics.riskLabels).toContain("Upside capped");
  });

  it("calculates cash-secured put assignment and downside metrics", () => {
    const legs = [optionLeg("sell", "put", 95, 2)];
    const metrics = calculateStrategyMetrics(
      {
        ...baseStrategy,
        id: "strategy-cash-secured-put",
        riskType: "cash_backed",
        assignmentRisk: "material",
      },
      legs,
      100,
    );

    expect(metrics.maxProfit).toBe(200);
    expect(metrics.maxLoss).toBe(9300);
    expect(metrics.breakevens).toEqual([93]);
    expect(metrics.assignmentRisk).toBe("material");
    expect(metrics.riskLabels).toContain("Assignment possible");
  });

  it("calculates protective put downside floor", () => {
    const legs: SimulatedTradeLeg[] = [
      stockLeg("buy", 100, 100),
      optionLeg("buy", "put", 95, 2),
    ];
    const metrics = calculateStrategyMetrics(
      {
        ...baseStrategy,
        id: "strategy-protective-put",
        category: "hedge",
        outlook: "hedge",
        riskType: "defined",
      },
      legs,
      100,
    );

    expect(payoffAtPrice(legs, 80)).toBe(-700);
    expect(metrics.maxProfit).toBe("unlimited");
    expect(metrics.maxLoss).toBe(700);
    expect(metrics.breakevens).toEqual([102]);
  });

  it("calculates vertical spread max profit and max loss", () => {
    const legs = [optionLeg("buy", "call", 100, 4), optionLeg("sell", "call", 110, 1.5)];
    const metrics = calculateStrategyMetrics(
      {
        ...baseStrategy,
        id: "strategy-bull-call-spread",
        level: "intermediate",
        riskType: "defined",
        tradeStyle: "debit",
      },
      legs,
      100,
    );

    expect(metrics.maxProfit).toBe(750);
    expect(metrics.maxLoss).toBe(250);
    expect(metrics.breakevens).toEqual([102.5]);
  });

  it("calculates iron condor as defined risk", () => {
    const legs = [
      optionLeg("buy", "put", 85, 0.5),
      optionLeg("sell", "put", 90, 1.5),
      optionLeg("sell", "call", 110, 1.4),
      optionLeg("buy", "call", 115, 0.4),
    ];
    const metrics = calculateStrategyMetrics(
      {
        ...baseStrategy,
        id: "strategy-iron-condor",
        level: "advanced",
        outlook: "neutral",
        riskType: "defined",
        tradeStyle: "multi_leg",
        assignmentRisk: "possible",
      },
      legs,
      100,
    );

    expect(metrics.maxProfit).toBe(200);
    expect(metrics.maxLoss).toBe(300);
    expect(metrics.breakevens).toEqual([88, 112]);
    expect(metrics.riskLabels).toContain("Defined risk");
  });

  it("returns typed validation errors for invalid legs", () => {
    const errors = validateTradeDraftDetailed([optionLeg("buy", "call", -1, -2)], 0, "");
    const codes = errors.map((error) => error.code);

    expect(codes).toContain("symbol_required");
    expect(codes).toContain("underlying_invalid");
    expect(codes).toContain("strike_invalid");
    expect(codes).toContain("premium_invalid");
  });

  it("detects undefined short call risk when no hedge exists", () => {
    const legs = [optionLeg("sell", "call", 100, 2)];
    const metrics = calculateStrategyMetrics(
      { ...baseStrategy, id: "custom-short-call", riskType: "undefined", assignmentRisk: "possible" },
      legs,
      100,
    );

    expect(metrics.maxLoss).toBe("unlimited");
    expect(metrics.riskLabels).toContain("Undefined upside risk");
  });

  it("generates payoff curve points", () => {
    const metrics = calculateStrategyMetrics(
      { ...baseStrategy, id: "strategy-long-call" },
      [optionLeg("buy", "call", 100, 3)],
      100,
    );

    expect(metrics.points.length).toBeGreaterThan(40);
    expect(metrics.points[0].underlyingPrice).toBeGreaterThan(0);
  });
});

function optionLeg(
  action: "buy" | "sell",
  type: "call" | "put",
  strike: number,
  premium: number,
): SimulatedTradeLeg {
  return {
    id: `${action}-${type}-${strike}`,
    tradeId: "test",
    action,
    type,
    quantity: 1,
    strike,
    premium,
    expiration: "2026-06-19",
  };
}

function stockLeg(action: "buy" | "sell", quantity: number, price: number): SimulatedTradeLeg {
  return {
    id: `${action}-stock`,
    tradeId: "test",
    action,
    type: "stock",
    quantity,
    price,
  };
}

