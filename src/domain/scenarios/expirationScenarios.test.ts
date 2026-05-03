import { describe, expect, it } from "vitest";
import type { SimulatedTradeLeg } from "../../db/types";
import { daysToExpiration, generateExpirationScenarios } from "./expirationScenarios";

describe("expiration scenarios", () => {
  it("projects expiration profit and loss across price moves", () => {
    const legs: SimulatedTradeLeg[] = [
      {
        id: "long-call",
        tradeId: "test",
        action: "buy",
        type: "call",
        quantity: 1,
        strike: 100,
        premium: 3,
        expiration: "2026-06-19",
      },
    ];

    const rows = generateExpirationScenarios(legs, 100, 300, [-10, 0, 10]);

    expect(rows).toEqual([
      {
        priceMovePercent: -10,
        projectedUnderlyingPrice: 90,
        expirationProfitLoss: -300,
        percentOfMaxRisk: -100,
      },
      {
        priceMovePercent: 0,
        projectedUnderlyingPrice: 100,
        expirationProfitLoss: -300,
        percentOfMaxRisk: -100,
      },
      {
        priceMovePercent: 10,
        projectedUnderlyingPrice: 110,
        expirationProfitLoss: 700,
        percentOfMaxRisk: 233.33,
      },
    ]);
  });

  it("calculates days to expiration from exact dates", () => {
    expect(daysToExpiration("2026-06-19", new Date("2026-06-01T12:00:00Z"))).toBe(18);
  });
});
