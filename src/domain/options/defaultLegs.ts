import type { SimulatedTradeLeg, StrategyTemplate, StrategyTemplateLeg } from "../../db/types";

export type BuilderLeg = Omit<SimulatedTradeLeg, "id" | "tradeId">;

export const defaultExpiration = "2026-06-19";

export function createDefaultLegs(
  strategy: StrategyTemplate,
  templateLegs: StrategyTemplateLeg[],
  underlyingPrice: number,
): BuilderLeg[] {
  return sortTemplateLegs(strategy, templateLegs).map((template, index) => {
    if (template.type === "stock") {
      return {
        action: template.action,
        type: template.type,
        quantity: template.quantity,
        price: underlyingPrice,
      };
    }

    return {
      action: template.action,
      type: template.type,
      quantity: template.quantity,
      strike: getDefaultStrike(strategy.id, template, underlyingPrice),
      premium: defaultPremium(template.action, index),
      expiration: defaultExpiration,
    };
  });
}

function sortTemplateLegs(strategy: StrategyTemplate, templateLegs: StrategyTemplateLeg[]) {
  return [...templateLegs].sort((left, right) => legRank(strategy, left) - legRank(strategy, right));
}

function legRank(strategy: StrategyTemplate, leg: StrategyTemplateLeg) {
  const role = leg.role.toLowerCase();

  if (leg.type === "stock") return 0;

  if (strategy.id === "strategy-bull-call-spread" || strategy.id === "strategy-bear-put-spread") {
    return leg.action === "buy" ? 1 : 2;
  }

  if (strategy.id === "strategy-bull-put-spread" || strategy.id === "strategy-bear-call-spread") {
    return leg.action === "sell" ? 1 : 2;
  }

  if (strategy.id === "strategy-collar") {
    if (leg.type === "put") return 1;
    if (leg.type === "call") return 2;
  }

  if (strategy.id === "strategy-iron-condor") {
    if (role.includes("lower")) return 1;
    if (role.includes("short put")) return 2;
    if (role.includes("short call")) return 3;
    if (role.includes("upper")) return 4;
  }

  if (strategy.id === "strategy-butterfly") {
    if (role.includes("lower")) return 1;
    if (role.includes("middle")) return 2;
    if (role.includes("upper")) return 3;
  }

  return leg.action === "buy" ? 1 : 2;
}

export function toPreviewTradeLegs(legs: BuilderLeg[]): SimulatedTradeLeg[] {
  return legs.map((leg, index) => ({
    ...leg,
    id: `preview-${index}`,
    tradeId: "preview",
  }));
}

function getDefaultStrike(strategyId: string, template: StrategyTemplateLeg, underlyingPrice: number) {
  const rounded = Math.round(underlyingPrice / 5) * 5;
  const role = template.role.toLowerCase();

  if (strategyId === "strategy-long-call") return rounded + 5;
  if (strategyId === "strategy-long-put") return rounded - 5;
  if (strategyId === "strategy-covered-call") return rounded + 10;
  if (strategyId === "strategy-cash-secured-put") return rounded - 5;
  if (strategyId === "strategy-protective-put") return rounded - 5;

  if (strategyId === "strategy-bull-call-spread") {
    return role.includes("higher") ? rounded + 10 : rounded;
  }

  if (strategyId === "strategy-bear-put-spread") {
    return role.includes("lower") ? rounded - 10 : rounded;
  }

  if (strategyId === "strategy-bull-put-spread") {
    return role.includes("lower") ? rounded - 15 : rounded - 5;
  }

  if (strategyId === "strategy-bear-call-spread") {
    return role.includes("higher") ? rounded + 15 : rounded + 5;
  }

  if (strategyId === "strategy-collar") {
    return template.type === "put" ? rounded - 5 : rounded + 10;
  }

  if (strategyId === "strategy-iron-condor") {
    if (role.includes("lower")) return rounded - 15;
    if (role.includes("short put")) return rounded - 5;
    if (role.includes("short call")) return rounded + 5;
    if (role.includes("upper")) return rounded + 15;
  }

  if (strategyId === "strategy-long-straddle") return rounded;

  if (strategyId === "strategy-long-strangle") {
    return template.type === "put" ? rounded - 5 : rounded + 5;
  }

  if (strategyId === "strategy-butterfly") {
    if (role.includes("lower")) return rounded - 10;
    if (role.includes("upper")) return rounded + 10;
    return rounded;
  }

  if (strategyId === "strategy-calendar-spread") return rounded;

  if (strategyId === "strategy-diagonal-spread") {
    return role.includes("short") ? rounded + 5 : rounded;
  }

  return rounded;
}

function defaultPremium(action: BuilderLeg["action"], index: number) {
  const base = action === "buy" ? 3 : 1.6;
  return Number(Math.max(0.35, base - index * 0.25).toFixed(2));
}
