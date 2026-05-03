import { useEffect, useMemo, useState } from "react";
import { getBuilderSeedData } from "../../db/repositories/tradeRepository";
import type { StrategyTemplate, StrategyTemplateLeg } from "../../db/types";
import { calculateStrategyMetrics } from "../../domain/options/calculations";
import {
  createDefaultLegs,
  defaultExpiration,
  toPreviewTradeLegs,
  type BuilderLeg,
} from "../../domain/options/defaultLegs";
import {
  daysToExpiration,
  generateExpirationScenarios,
} from "../../domain/scenarios/expirationScenarios";
import {
  createManualQuote,
  getMockQuote,
  searchMockSymbols,
} from "../../services/marketData/mockProvider";
import type { SymbolSearchResult, UnderlyingQuote } from "../../services/marketData/types";

type MarketSeed = {
  strategies: StrategyTemplate[];
  templateLegs: StrategyTemplateLeg[];
};

export function useMarketSimulator() {
  const [seed, setSeed] = useState<MarketSeed | null>(null);
  const [query, setQuery] = useState("SPY");
  const [quote, setQuote] = useState<UnderlyingQuote>(() => getMockQuote("SPY"));
  const [manualSymbol, setManualSymbol] = useState("SPY");
  const [manualPrice, setManualPrice] = useState(100);
  const [selectedStrategyId, setSelectedStrategyId] = useState("");
  const [expiration, setExpiration] = useState(defaultExpiration);
  const [legs, setLegs] = useState<BuilderLeg[]>([]);

  useEffect(() => {
    let mounted = true;

    getBuilderSeedData().then((nextSeed) => {
      if (!mounted) return;

      const sortedStrategies = [...nextSeed.strategies].sort((left, right) =>
        left.name.localeCompare(right.name),
      );
      const beginnerStrategy =
        sortedStrategies.find((strategy) => strategy.id === "strategy-long-call") ??
        sortedStrategies.find((strategy) => strategy.level === "beginner") ??
        sortedStrategies[0];

      setSeed({ strategies: sortedStrategies, templateLegs: nextSeed.templateLegs });
      setSelectedStrategyId(beginnerStrategy?.id ?? "");
    });

    return () => {
      mounted = false;
    };
  }, []);

  const searchResults = useMemo(() => searchMockSymbols(query), [query]);
  const selectedStrategy = useMemo(
    () => seed?.strategies.find((strategy) => strategy.id === selectedStrategyId),
    [seed?.strategies, selectedStrategyId],
  );
  const previewLegs = useMemo(() => toPreviewTradeLegs(legs), [legs]);
  const metrics = useMemo(
    () => calculateStrategyMetrics(selectedStrategy, previewLegs, quote.lastPrice),
    [previewLegs, quote.lastPrice, selectedStrategy],
  );
  const scenarioRows = useMemo(
    () => generateExpirationScenarios(previewLegs, quote.lastPrice, metrics.maxLoss),
    [metrics.maxLoss, previewLegs, quote.lastPrice],
  );
  const primaryExpiration =
    legs.find((leg) => leg.type !== "stock" && leg.expiration)?.expiration ?? expiration;
  const dte = daysToExpiration(primaryExpiration);
  const builderPath = selectedStrategy
    ? `/builder?strategy=${selectedStrategy.id}&symbol=${encodeURIComponent(quote.symbol)}&price=${quote.lastPrice.toFixed(2)}`
    : "/builder";

  useEffect(() => {
    if (!seed || !selectedStrategy) return;

    const templateLegs = seed.templateLegs.filter((leg) => leg.strategyId === selectedStrategy.id);
    setLegs(
      createDefaultLegs(selectedStrategy, templateLegs, quote.lastPrice).map((leg) =>
        leg.type === "stock" ? leg : { ...leg, expiration },
      ),
    );
  }, [quote.lastPrice, quote.symbol, seed, selectedStrategy]);

  function applyMockQuote(result: SymbolSearchResult) {
    const next = getMockQuote(result.symbol);
    setQuote(next);
    setManualSymbol(result.symbol);
    setManualPrice(next.lastPrice);
  }

  function applyManualQuote() {
    if (manualPrice <= 0) return;
    setQuote(createManualQuote(manualSymbol, manualPrice));
  }

  function refreshMockQuote() {
    if (quote.provider !== "mock") return;
    setQuote(getMockQuote(quote.symbol));
  }

  function updateExpiration(nextExpiration: string) {
    setExpiration(nextExpiration);
    setLegs((currentLegs) =>
      currentLegs.map((leg) =>
        leg.type === "stock" ? leg : { ...leg, expiration: nextExpiration },
      ),
    );
  }

  function updateLeg(index: number, nextLeg: BuilderLeg) {
    setLegs((currentLegs) =>
      currentLegs.map((currentLeg, currentIndex) =>
        currentIndex === index ? nextLeg : currentLeg,
      ),
    );
  }

  return {
    seed,
    selectedStrategy,
    selectedStrategyId,
    setSelectedStrategyId,
    query,
    setQuery,
    quote,
    manualSymbol,
    setManualSymbol,
    manualPrice,
    setManualPrice,
    applyMockQuote,
    applyManualQuote,
    refreshMockQuote,
    expiration,
    updateExpiration,
    legs,
    updateLeg,
    searchResults,
    metrics,
    scenarioRows,
    dte,
    builderPath,
  };
}
