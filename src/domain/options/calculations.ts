import type { SimulatedTradeLeg, StrategyTemplate } from "../../db/types";

export type PayoffPoint = {
  underlyingPrice: number;
  profitLoss: number;
};

export type DomainValidationError = {
  code: string;
  message: string;
  field?: string;
};

export type StrategyMetrics = {
  netCredit: number;
  netDebitCredit: number;
  maxProfit: number | "unlimited" | "unknown";
  maxLoss: number | "unlimited" | "unknown";
  breakevens: number[];
  assignmentRisk: "none" | "possible" | "material";
  riskLabels: string[];
  summary: {
    maxProfit: string;
    maxLoss: string;
    breakevens: string;
    currentScenario: string;
  };
  points: PayoffPoint[];
};

const MULTIPLIER = 100;
const POINT_COUNT = 56;

export function calculateStrategyMetrics(
  strategy: StrategyTemplate | undefined,
  legs: SimulatedTradeLeg[],
  underlyingPrice: number,
): StrategyMetrics {
  const normalizedLegs = normalizeLegs(legs);
  const points = generatePayoffPoints(normalizedLegs, underlyingPrice);
  const netCredit = calculateNetOptionCredit(normalizedLegs);
  const specificMetrics = inferSpecificMetrics(strategy, normalizedLegs, points);
  const breakevens = specificMetrics.breakevens.length
    ? specificMetrics.breakevens
    : findBreakevens(points);
  const assignmentRisk = inferAssignmentRisk(strategy, normalizedLegs);
  const riskLabels = getRiskLabels(strategy, normalizedLegs, specificMetrics.maxLoss);
  const currentScenario = payoffAtPrice(normalizedLegs, underlyingPrice);

  const metrics = {
    netCredit,
    netDebitCredit: netCredit,
    maxProfit: specificMetrics.maxProfit,
    maxLoss: specificMetrics.maxLoss,
    breakevens,
    assignmentRisk,
    riskLabels,
    points,
  };

  return {
    ...metrics,
    summary: {
      maxProfit: formatMetricValue(metrics.maxProfit),
      maxLoss: formatMetricValue(metrics.maxLoss),
      breakevens: formatBreakevens(metrics.breakevens),
      currentScenario: `${formatCurrency(currentScenario)} at ${formatPrice(underlyingPrice)}`,
    },
  };
}

export function payoffAtPrice(legs: SimulatedTradeLeg[], underlyingPrice: number) {
  return normalizeLegs(legs).reduce((total, leg) => total + legPayoffAtPrice(leg, underlyingPrice), 0);
}

export function optionIntrinsicValue(type: "call" | "put", strike: number, underlyingPrice: number) {
  return type === "call"
    ? Math.max(0, underlyingPrice - strike)
    : Math.max(0, strike - underlyingPrice);
}

export function validateTradeDraft(legs: SimulatedTradeLeg[], underlyingPrice: number, symbol: string) {
  return validateTradeDraftDetailed(legs, underlyingPrice, symbol).map((error) => error.message);
}

export function validateTradeDraftDetailed(
  legs: SimulatedTradeLeg[],
  underlyingPrice: number,
  symbol: string,
): DomainValidationError[] {
  const errors: DomainValidationError[] = [];

  if (!symbol.trim()) {
    errors.push({ code: "symbol_required", message: "Symbol is required.", field: "symbol" });
  }

  if (underlyingPrice <= 0 || Number.isNaN(underlyingPrice)) {
    errors.push({
      code: "underlying_invalid",
      message: "Underlying price must be greater than zero.",
      field: "underlyingPrice",
    });
  }

  if (legs.length === 0) {
    errors.push({ code: "legs_required", message: "At least one leg is required.", field: "legs" });
  }

  legs.forEach((leg, index) => {
    const label = `Leg ${index + 1}`;
    const fieldPrefix = `legs.${index}`;

    if (!Number.isInteger(leg.quantity) || leg.quantity <= 0) {
      errors.push({
        code: "quantity_invalid",
        message: `${label} quantity must be a positive whole number.`,
        field: `${fieldPrefix}.quantity`,
      });
    }

    if (leg.type === "stock") {
      if (!leg.price || leg.price <= 0) {
        errors.push({
          code: "stock_price_invalid",
          message: `${label} stock price must be greater than zero.`,
          field: `${fieldPrefix}.price`,
        });
      }
      return;
    }

    if (!leg.strike || leg.strike <= 0) {
      errors.push({
        code: "strike_invalid",
        message: `${label} strike must be greater than zero.`,
        field: `${fieldPrefix}.strike`,
      });
    }

    if (leg.premium === undefined || leg.premium < 0) {
      errors.push({
        code: "premium_invalid",
        message: `${label} premium must be zero or greater.`,
        field: `${fieldPrefix}.premium`,
      });
    }

    if (!leg.expiration) {
      errors.push({
        code: "expiration_required",
        message: `${label} expiration is required.`,
        field: `${fieldPrefix}.expiration`,
      });
    }
  });

  return errors;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(roundCurrency(value));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatMetricValue(value: number | "unlimited" | "unknown") {
  return typeof value === "number" ? formatCurrency(value) : value;
}

export function formatBreakevens(values: number[]) {
  return values.length ? values.map(formatPrice).join(", ") : "None found";
}

function normalizeLegs(legs: SimulatedTradeLeg[]) {
  return legs.map((leg) => ({
    ...leg,
    quantity: Number(leg.quantity) || 0,
    strike: leg.strike === undefined ? undefined : Number(leg.strike),
    premium: leg.premium === undefined ? undefined : Number(leg.premium),
    price: leg.price === undefined ? undefined : Number(leg.price),
  }));
}

function legPayoffAtPrice(leg: SimulatedTradeLeg, underlyingPrice: number) {
  if (leg.type === "stock") {
    const entryPrice = leg.price ?? underlyingPrice;
    const direction = leg.action === "buy" ? 1 : -1;
    return (underlyingPrice - entryPrice) * leg.quantity * direction;
  }

  const strike = leg.strike ?? underlyingPrice;
  const premium = leg.premium ?? 0;
  const intrinsic = optionIntrinsicValue(leg.type, strike, underlyingPrice);
  const longPayoff = (intrinsic - premium) * leg.quantity * MULTIPLIER;

  return leg.action === "buy" ? longPayoff : -longPayoff;
}

function calculateNetOptionCredit(legs: SimulatedTradeLeg[]) {
  return roundCurrency(
    legs.reduce((total, leg) => {
      if (leg.type === "stock") {
        return total;
      }

      const premiumValue = (leg.premium ?? 0) * leg.quantity * MULTIPLIER;
      return total + (leg.action === "sell" ? premiumValue : -premiumValue);
    }, 0),
  );
}

function generatePayoffPoints(legs: SimulatedTradeLeg[], underlyingPrice: number): PayoffPoint[] {
  const strikes = legs
    .map((leg) => leg.strike)
    .filter((strike): strike is number => typeof strike === "number" && strike > 0);
  const stockPrices = legs
    .map((leg) => leg.price)
    .filter((price): price is number => typeof price === "number" && price > 0);
  const anchors = [underlyingPrice, ...strikes, ...stockPrices].filter((value) => value > 0);
  const minAnchor = Math.min(...anchors, underlyingPrice);
  const maxAnchor = Math.max(...anchors, underlyingPrice, 1);
  const min = Math.max(1, Math.min(minAnchor * 0.55, ...strikes.map((strike) => strike * 0.75)));
  const max = Math.max(maxAnchor * 1.55, ...strikes.map((strike) => strike * 1.3));
  const step = (max - min) / POINT_COUNT;

  const sampledPoints = Array.from({ length: POINT_COUNT + 1 }, (_, index) => {
    const price = min + step * index;
    return {
      underlyingPrice: Number(price.toFixed(2)),
      profitLoss: roundCurrency(payoffAtPrice(legs, price)),
    };
  });

  return upsertPoint(sampledPoints, {
    underlyingPrice: roundPrice(underlyingPrice),
    profitLoss: roundCurrency(payoffAtPrice(legs, underlyingPrice)),
  });
}

function upsertPoint(points: PayoffPoint[], point: PayoffPoint) {
  const withoutDuplicate = points.filter((item) => item.underlyingPrice !== point.underlyingPrice);
  return [...withoutDuplicate, point].sort((left, right) => left.underlyingPrice - right.underlyingPrice);
}

function inferSpecificMetrics(
  strategy: StrategyTemplate | undefined,
  legs: SimulatedTradeLeg[],
  points: PayoffPoint[],
): Pick<StrategyMetrics, "maxProfit" | "maxLoss" | "breakevens"> {
  const optionLegs = legs.filter((leg) => leg.type !== "stock");
  const stockLeg = legs.find((leg) => leg.type === "stock");
  const longOptions = optionLegs.filter((leg) => leg.action === "buy");
  const shortOptions = optionLegs.filter((leg) => leg.action === "sell");
  const netCredit = calculateNetOptionCredit(legs);
  const estimated = estimateFromPoints(points);

  if (strategy?.maxProfitText.toLowerCase().includes("model-dependent")) {
    return { maxProfit: "unknown", maxLoss: Math.max(0, -netCredit), breakevens: findBreakevens(points) };
  }

  switch (strategy?.id) {
    case "strategy-long-call": {
      const call = firstOption(legs, "buy", "call");
      const premium = premiumValue(call);
      return {
        maxProfit: "unlimited",
        maxLoss: premium,
        breakevens: call?.strike !== undefined ? [roundPrice(call.strike + (call.premium ?? 0))] : [],
      };
    }
    case "strategy-long-put": {
      const put = firstOption(legs, "buy", "put");
      const premium = premiumValue(put);
      return {
        maxProfit: put?.strike !== undefined ? roundCurrency((put.strike - (put.premium ?? 0)) * put.quantity * MULTIPLIER) : estimated.maxProfit,
        maxLoss: premium,
        breakevens: put?.strike !== undefined ? [roundPrice(put.strike - (put.premium ?? 0))] : [],
      };
    }
    case "strategy-covered-call": {
      const shortCall = firstOption(legs, "sell", "call");
      const stock = stockLeg;
      const shares = stock?.quantity ?? 0;
      const premium = premiumValue(shortCall);
      return {
        maxProfit:
          shortCall?.strike !== undefined && stock?.price !== undefined
            ? roundCurrency((shortCall.strike - stock.price) * shares + premium)
            : estimated.maxProfit,
        maxLoss: stock?.price !== undefined ? roundCurrency(stock.price * shares - premium) : estimated.maxLoss,
        breakevens: stock?.price !== undefined && shares > 0 ? [roundPrice(stock.price - premium / shares)] : [],
      };
    }
    case "strategy-cash-secured-put": {
      const shortPut = firstOption(legs, "sell", "put");
      const premium = premiumValue(shortPut);
      return {
        maxProfit: premium,
        maxLoss:
          shortPut?.strike !== undefined
            ? roundCurrency(shortPut.strike * shortPut.quantity * MULTIPLIER - premium)
            : estimated.maxLoss,
        breakevens:
          shortPut?.strike !== undefined ? [roundPrice(shortPut.strike - (shortPut.premium ?? 0))] : [],
      };
    }
    case "strategy-protective-put": {
      const put = firstOption(legs, "buy", "put");
      const stock = stockLeg;
      const shares = stock?.quantity ?? 0;
      const premium = premiumValue(put);
      return {
        maxProfit: "unlimited",
        maxLoss:
          stock?.price !== undefined && put?.strike !== undefined
            ? roundCurrency((stock.price - put.strike) * shares + premium)
            : estimated.maxLoss,
        breakevens: stock?.price !== undefined && shares > 0 ? [roundPrice(stock.price + premium / shares)] : [],
      };
    }
    default:
      break;
  }

  const verticalMetrics = inferVerticalSpreadMetrics(strategy, optionLegs, netCredit);
  if (verticalMetrics) {
    return verticalMetrics;
  }

  const ironCondorMetrics = inferIronCondorMetrics(strategy, optionLegs, netCredit);
  if (ironCondorMetrics) {
    return ironCondorMetrics;
  }

  if (longOptions.length === optionLegs.length && optionLegs.length > 1) {
    return {
      maxProfit: estimated.maxProfit,
      maxLoss: Math.abs(Math.min(netCredit, 0)),
      breakevens: findBreakevens(points),
    };
  }

  if (shortOptions.some((leg) => leg.type === "call") && longOptions.length === 0) {
    return { maxProfit: netCredit, maxLoss: "unlimited", breakevens: findBreakevens(points) };
  }

  return estimated;
}

function inferVerticalSpreadMetrics(
  strategy: StrategyTemplate | undefined,
  optionLegs: SimulatedTradeLeg[],
  netCredit: number,
): Pick<StrategyMetrics, "maxProfit" | "maxLoss" | "breakevens"> | null {
  if (optionLegs.length !== 2 || !strategy?.id.includes("spread")) {
    return null;
  }

  const [left, right] = optionLegs;
  if (left.type !== right.type || left.strike === undefined || right.strike === undefined) {
    return null;
  }

  const width = Math.abs(right.strike - left.strike) * Math.max(left.quantity, right.quantity) * MULTIPLIER;
  const debit = Math.max(0, -netCredit);
  const credit = Math.max(0, netCredit);

  const isDebitSpread =
    strategy.tradeStyle === "debit" ||
    strategy.id === "strategy-bull-call-spread" ||
    strategy.id === "strategy-bear-put-spread";

  if (isDebitSpread) {
    const longLeg = optionLegs.find((leg) => leg.action === "buy");
    const breakeven =
      longLeg?.strike === undefined
        ? []
        : [roundPrice(longLeg.type === "call" ? longLeg.strike + debit / MULTIPLIER : longLeg.strike - debit / MULTIPLIER)];
    return {
      maxProfit: roundCurrency(width - debit),
      maxLoss: debit,
      breakevens: breakeven,
    };
  }

  const shortLeg = optionLegs.find((leg) => leg.action === "sell");
  const breakeven =
    shortLeg?.strike === undefined
      ? []
      : [roundPrice(shortLeg.type === "call" ? shortLeg.strike + credit / MULTIPLIER : shortLeg.strike - credit / MULTIPLIER)];
  return {
    maxProfit: credit,
    maxLoss: roundCurrency(width - credit),
    breakevens: breakeven,
  };
}

function inferIronCondorMetrics(
  strategy: StrategyTemplate | undefined,
  optionLegs: SimulatedTradeLeg[],
  netCredit: number,
): Pick<StrategyMetrics, "maxProfit" | "maxLoss" | "breakevens"> | null {
  if (strategy?.id !== "strategy-iron-condor" || optionLegs.length !== 4) {
    return null;
  }

  const shortPut = firstOption(optionLegs, "sell", "put");
  const longPut = firstOption(optionLegs, "buy", "put");
  const shortCall = firstOption(optionLegs, "sell", "call");
  const longCall = firstOption(optionLegs, "buy", "call");

  if (
    shortPut?.strike === undefined ||
    longPut?.strike === undefined ||
    shortCall?.strike === undefined ||
    longCall?.strike === undefined
  ) {
    return null;
  }

  const putWidth = Math.abs(shortPut.strike - longPut.strike) * MULTIPLIER;
  const callWidth = Math.abs(longCall.strike - shortCall.strike) * MULTIPLIER;
  const widestWidth = Math.max(putWidth, callWidth);

  return {
    maxProfit: netCredit,
    maxLoss: roundCurrency(widestWidth - netCredit),
    breakevens: [roundPrice(shortPut.strike - netCredit / MULTIPLIER), roundPrice(shortCall.strike + netCredit / MULTIPLIER)],
  };
}

function estimateFromPoints(points: PayoffPoint[]): Pick<StrategyMetrics, "maxProfit" | "maxLoss" | "breakevens"> {
  const values = points.map((point) => point.profitLoss);
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;

  return {
    maxProfit: roundCurrency(max),
    maxLoss: roundCurrency(Math.abs(min)),
    breakevens: findBreakevens(points),
  };
}

function findBreakevens(points: PayoffPoint[]) {
  const breakevens: number[] = [];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];

    if (previous.profitLoss === 0) {
      breakevens.push(previous.underlyingPrice);
      continue;
    }

    if (
      (previous.profitLoss < 0 && current.profitLoss > 0) ||
      (previous.profitLoss > 0 && current.profitLoss < 0)
    ) {
      const progress =
        Math.abs(previous.profitLoss) /
        (Math.abs(previous.profitLoss) + Math.abs(current.profitLoss));
      const breakeven =
        previous.underlyingPrice +
        (current.underlyingPrice - previous.underlyingPrice) * progress;
      breakevens.push(roundPrice(breakeven));
    }
  }

  return Array.from(new Set(breakevens)).slice(0, 4);
}

function inferAssignmentRisk(strategy: StrategyTemplate | undefined, legs: SimulatedTradeLeg[]) {
  if (strategy?.assignmentRisk) {
    return strategy.assignmentRisk;
  }

  return legs.some((leg) => leg.action === "sell" && leg.type !== "stock") ? "possible" : "none";
}

function getRiskLabels(
  strategy: StrategyTemplate | undefined,
  legs: SimulatedTradeLeg[],
  maxLoss: number | "unlimited" | "unknown",
) {
  const labels = new Set<string>();

  if (strategy?.riskType === "premium") labels.add("Premium at risk");
  if (strategy?.riskType === "defined") labels.add("Defined risk");
  if (strategy?.riskType === "stock_backed") labels.add("Stock downside remains");
  if (strategy?.riskType === "cash_backed") labels.add("Assignment possible");
  if (strategy?.requiredAcknowledgementContext === "simplified_model") labels.add("Simplified model");
  if (
    strategy?.maxProfitText.toLowerCase().includes("capped") ||
    strategy?.id === "strategy-covered-call" ||
    strategy?.id === "strategy-collar" ||
    legs.some((leg) => leg.action === "sell" && leg.type === "call")
  ) {
    labels.add("Upside capped");
  }
  if (maxLoss === "unlimited") labels.add("Undefined upside risk");
  if (legs.some((leg) => leg.action === "sell" && leg.type !== "stock")) labels.add("Short option leg");

  return Array.from(labels);
}

function premiumValue(leg: SimulatedTradeLeg | undefined) {
  if (!leg || leg.type === "stock") {
    return 0;
  }

  return roundCurrency((leg.premium ?? 0) * leg.quantity * MULTIPLIER);
}

function firstOption(
  legs: SimulatedTradeLeg[],
  action: SimulatedTradeLeg["action"],
  type: "call" | "put",
) {
  return legs.find((leg) => leg.action === action && leg.type === type);
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function roundPrice(value: number) {
  return Math.round(value * 100) / 100;
}
