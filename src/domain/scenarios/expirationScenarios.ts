import type { SimulatedTradeLeg } from "../../db/types";
import { payoffAtPrice } from "../options/calculations";

export const defaultPriceMoves = [-20, -10, -5, 0, 5, 10, 20] as const;

export type ExpirationScenarioRow = {
  priceMovePercent: number;
  projectedUnderlyingPrice: number;
  expirationProfitLoss: number;
  percentOfMaxRisk?: number;
};

export function generateExpirationScenarios(
  legs: SimulatedTradeLeg[],
  underlyingPrice: number,
  maxLoss: number | "unlimited" | "unknown",
  priceMoves: readonly number[] = defaultPriceMoves,
): ExpirationScenarioRow[] {
  return priceMoves.map((priceMovePercent) => {
    const projectedUnderlyingPrice = roundPrice(underlyingPrice * (1 + priceMovePercent / 100));
    const expirationProfitLoss = roundCurrency(payoffAtPrice(legs, projectedUnderlyingPrice));
    const percentOfMaxRisk =
      typeof maxLoss === "number" && maxLoss > 0
        ? roundPrice((expirationProfitLoss / maxLoss) * 100)
        : undefined;

    return {
      priceMovePercent,
      projectedUnderlyingPrice,
      expirationProfitLoss,
      percentOfMaxRisk,
    };
  });
}

export function daysToExpiration(expiration: string, fromDate = new Date()) {
  const [year, month, day] = expiration.split("-").map(Number);

  if (!year || !month || !day) {
    return 0;
  }

  const today = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const target = Date.UTC(year, month - 1, day);
  return Math.max(0, Math.ceil((target - today) / 86_400_000));
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function roundPrice(value: number) {
  return Math.round(value * 100) / 100;
}
