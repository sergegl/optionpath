import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getRiskCopy,
  hasRiskAcknowledgement,
  saveRiskAcknowledgement,
} from "../../db/repositories/riskRepository";
import { getBuilderSeedData, saveSimulatedTrade } from "../../db/repositories/tradeRepository";
import type {
  RiskAcknowledgement,
  StrategyTemplate,
  StrategyTemplateLeg,
  WatchlistItem,
} from "../../db/types";
import {
  createDefaultLegs,
  toPreviewTradeLegs,
  type BuilderLeg,
} from "../../domain/options/defaultLegs";
import { calculateStrategyMetrics, validateTradeDraft } from "../../domain/options/calculations";

type BuilderSeed = {
  strategies: StrategyTemplate[];
  templateLegs: StrategyTemplateLeg[];
  watchlist: WatchlistItem[];
};

export type SaveState = "idle" | "saving" | "saved" | "error";
export type RiskContext = RiskAcknowledgement["context"];

const riskContexts: readonly RiskContext[] = [
  "advanced_strategies",
  "short_options",
  "assignment_risk",
  "undefined_risk",
  "simplified_model",
  "simulated_data",
];

function getAcknowledgementContext(strategy?: StrategyTemplate): RiskContext | null {
  if (!strategy) return null;

  const configuredContext = strategy.requiredAcknowledgementContext;
  if (configuredContext && riskContexts.includes(configuredContext as RiskContext)) {
    return configuredContext as RiskContext;
  }

  if (strategy.level === "advanced") return "advanced_strategies";
  if (strategy.assignmentRisk !== "none") return "assignment_risk";
  if (strategy.riskType === "undefined") return "undefined_risk";

  return null;
}

export function useBuilderState() {
  const [searchParams] = useSearchParams();
  const [seed, setSeed] = useState<BuilderSeed | null>(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState("");
  const [symbol, setSymbol] = useState("SPY");
  const [underlyingPrice, setUnderlyingPrice] = useState(100);
  const [legs, setLegs] = useState<BuilderLeg[]>([]);
  const [thesis, setThesis] = useState("");
  const [exitPlan, setExitPlan] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedTradeId, setSavedTradeId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getBuilderSeedData().then((nextSeed) => {
      if (!mounted) return;

      const sortedStrategies = [...nextSeed.strategies].sort((left, right) =>
        left.name.localeCompare(right.name),
      );
      const requestedStrategy = searchParams.get("strategy");
      const requestedSymbol = searchParams.get("symbol")?.trim().toUpperCase();
      const requestedPrice = Number(searchParams.get("price"));
      const initialStrategy =
        sortedStrategies.find(
          (strategy) => strategy.id === requestedStrategy || strategy.slug === requestedStrategy,
        ) ??
        sortedStrategies.find((strategy) => strategy.level === "beginner") ??
        sortedStrategies[0];

      setSeed({ ...nextSeed, strategies: sortedStrategies });
      setSelectedStrategyId(initialStrategy?.id ?? "");
      setSymbol(requestedSymbol || nextSeed.watchlist[0]?.symbol || "SPY");
      if (Number.isFinite(requestedPrice) && requestedPrice > 0) {
        setUnderlyingPrice(requestedPrice);
      }
    });

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  const selectedStrategy = useMemo(
    () => seed?.strategies.find((strategy) => strategy.id === selectedStrategyId),
    [seed?.strategies, selectedStrategyId],
  );
  const acknowledgementContext = getAcknowledgementContext(selectedStrategy);
  const acknowledgementCopy = acknowledgementContext ? getRiskCopy(acknowledgementContext) : null;

  useEffect(() => {
    if (!seed || !selectedStrategy) return;

    const templateLegs = seed.templateLegs.filter((leg) => leg.strategyId === selectedStrategy.id);
    setLegs(createDefaultLegs(selectedStrategy, templateLegs, underlyingPrice));
    setSaveState("idle");
    setSavedTradeId(null);
  }, [seed, selectedStrategy, underlyingPrice]);

  useEffect(() => {
    let mounted = true;

    if (!selectedStrategy || !acknowledgementContext) {
      setAcknowledged(false);
      return;
    }

    setAcknowledged(false);
    hasRiskAcknowledgement(acknowledgementContext, selectedStrategy.id)
      .then((accepted) => {
        if (mounted) {
          setAcknowledged(accepted);
        }
      })
      .catch((error: unknown) => {
        console.error("Risk acknowledgement load failed", error);
      });

    return () => {
      mounted = false;
    };
  }, [acknowledgementContext, selectedStrategy]);

  const metrics = useMemo(
    () => calculateStrategyMetrics(selectedStrategy, toPreviewTradeLegs(legs), underlyingPrice),
    [legs, selectedStrategy, underlyingPrice],
  );
  const validationErrors = useMemo(
    () => validateTradeDraft(toPreviewTradeLegs(legs), underlyingPrice, symbol),
    [legs, underlyingPrice, symbol],
  );
  const requiresAcknowledgement = Boolean(acknowledgementContext);
  const canSave =
    validationErrors.length === 0 &&
    Boolean(selectedStrategy) &&
    (!requiresAcknowledgement || acknowledged);

  async function handleRiskAcknowledgementChange(checked: boolean) {
    setAcknowledged(checked);

    if (!checked || !selectedStrategy || !acknowledgementContext) return;

    try {
      await saveRiskAcknowledgement({
        context: acknowledgementContext,
        strategyId: selectedStrategy.id,
      });
    } catch (error) {
      console.error("Risk acknowledgement save failed", error);
      setAcknowledged(false);
    }
  }

  async function save(status: "draft" | "open") {
    if (!selectedStrategy || !canSave) return;

    setSaveState("saving");

    try {
      const tradeId = await saveSimulatedTrade({
        strategyId: selectedStrategy.id,
        symbol,
        underlyingPrice,
        status,
        legs,
        thesis,
        exitPlan,
      });
      setSavedTradeId(tradeId);
      setSaveState("saved");
    } catch (error) {
      console.error("Save simulated trade failed", error);
      setSaveState("error");
    }
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
    symbol,
    setSymbol,
    underlyingPrice,
    setUnderlyingPrice,
    legs,
    updateLeg,
    thesis,
    setThesis,
    exitPlan,
    setExitPlan,
    acknowledged,
    handleRiskAcknowledgementChange,
    requiresAcknowledgement,
    acknowledgementCopy,
    metrics,
    validationErrors,
    canSave,
    saveState,
    savedTradeId,
    save,
  };
}
