import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, CircleAlert, NotebookPen, Save } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getRiskCopy,
  hasRiskAcknowledgement,
  saveRiskAcknowledgement,
} from "../../db/repositories/riskRepository";
import { getBuilderSeedData, saveSimulatedTrade } from "../../db/repositories/tradeRepository";
import type { RiskAcknowledgement, StrategyTemplate, StrategyTemplateLeg, WatchlistItem } from "../../db/types";
import {
  createDefaultLegs,
  defaultExpiration,
  toPreviewTradeLegs,
  type BuilderLeg,
} from "../../domain/options/defaultLegs";
import {
  calculateStrategyMetrics,
  formatCurrency,
  formatPrice,
  validateTradeDraft,
} from "../../domain/options/calculations";
import { Badge } from "../../ui/Badge";
import { Button, LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { StatusMessage } from "../../ui/StatusMessage";
import { StrategyStoryPanel } from "../library/StrategyStoryPanel";
import { PayoffChart } from "../payoff/PayoffChart";

type BuilderSeed = {
  strategies: StrategyTemplate[];
  templateLegs: StrategyTemplateLeg[];
  watchlist: WatchlistItem[];
};

export function StrategyBuilderPage() {
  const [searchParams] = useSearchParams();
  const [seed, setSeed] = useState<BuilderSeed | null>(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState("");
  const [symbol, setSymbol] = useState("SPY");
  const [underlyingPrice, setUnderlyingPrice] = useState(100);
  const [legs, setLegs] = useState<BuilderLeg[]>([]);
  const [thesis, setThesis] = useState("");
  const [exitPlan, setExitPlan] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedTradeId, setSavedTradeId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getBuilderSeedData().then((nextSeed) => {
      if (!mounted) return;

      const sortedStrategies = [...nextSeed.strategies].sort((left, right) => left.name.localeCompare(right.name));
      const requestedStrategy = searchParams.get("strategy");
      const requestedSymbol = searchParams.get("symbol")?.trim().toUpperCase();
      const requestedPrice = Number(searchParams.get("price"));
      const initialStrategy =
        sortedStrategies.find((strategy) => strategy.id === requestedStrategy || strategy.slug === requestedStrategy) ??
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
  const canSave = validationErrors.length === 0 && Boolean(selectedStrategy) && (!requiresAcknowledgement || acknowledged);

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

  if (!seed || !selectedStrategy) {
    return <Card className="min-h-96 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <Badge tone="primary">Strategy builder</Badge>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">Build a simulated trade</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
            Choose a strategy, edit the legs, and save the model locally. This screen does not send
            orders or connect to a brokerage.
          </p>
        </div>
        <LinkButton to="/library">Browse library</LinkButton>
      </header>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,0.95fr)_minmax(28rem,1.05fr)]">
        <div className="space-y-6">
          <Card>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Strategy">
                <select
                  className="input-control"
                  onChange={(event) => setSelectedStrategyId(event.target.value)}
                  value={selectedStrategyId}
                >
                  {seed.strategies.map((strategy) => (
                    <option key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Symbol">
                <input className="input-control uppercase" onChange={(event) => setSymbol(event.target.value)} value={symbol} />
              </Field>
              <Field label="Sample watchlist">
                <select className="input-control" onChange={(event) => setSymbol(event.target.value)} value={symbol}>
                  {seed.watchlist.map((item) => (
                    <option key={item.id} value={item.symbol}>
                      {item.symbol}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Underlying price">
                <input
                  className="input-control"
                  min="1"
                  onChange={(event) => setUnderlyingPrice(Number(event.target.value))}
                  step="0.5"
                  type="number"
                  value={underlyingPrice}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <Badge tone="neutral">Leg editor</Badge>
                <h2 className="mt-3 text-2xl font-black">{selectedStrategy.name}</h2>
              </div>
              <Badge tone={selectedStrategy.assignmentRisk === "none" ? "neutral" : "warning"}>
                {selectedStrategy.assignmentRisk === "none" ? "No assignment" : "Assignment possible"}
              </Badge>
            </div>

            <div className="space-y-3">
              {legs.map((leg, index) => (
                <LegEditor
                  index={index}
                  key={`${selectedStrategy.id}-${index}-${leg.type}-${leg.action}`}
                  leg={leg}
                  onChange={(nextLeg) =>
                    setLegs((currentLegs) =>
                      currentLegs.map((currentLeg, currentIndex) => (currentIndex === index ? nextLeg : currentLeg)),
                    )
                  }
                />
              ))}
            </div>
          </Card>

          <Card>
            <Badge tone="support">Trade plan</Badge>
            <div className="mt-4 grid gap-4">
              <Field label="Entry thesis">
                <textarea
                  className="input-control min-h-28 resize-y py-3"
                  onChange={(event) => setThesis(event.target.value)}
                  placeholder="Why does this simulated trade fit the educational setup?"
                  value={thesis}
                />
              </Field>
              <Field label="Exit plan">
                <textarea
                  className="input-control min-h-24 resize-y py-3"
                  onChange={(event) => setExitPlan(event.target.value)}
                  placeholder="What would invalidate the idea, and what would you review at expiration?"
                  value={exitPlan}
                />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge tone="primary">Payoff preview</Badge>
                <h2 className="mt-3 text-2xl font-black">Expiration model</h2>
              </div>
              <Badge tone={metrics.netCredit >= 0 ? "profit" : "loss"}>
                {metrics.netCredit >= 0 ? "net credit" : "net debit"} {formatCurrency(Math.abs(metrics.netCredit))}
              </Badge>
            </div>

            <PayoffChart
              breakevens={metrics.breakevens}
              currentUnderlyingPrice={underlyingPrice}
              maxLoss={metrics.maxLoss}
              maxProfit={metrics.maxProfit}
              points={metrics.points}
              title={`${selectedStrategy.name} payoff`}
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="Max profit" value={formatMetric(metrics.maxProfit)} />
              <Metric label="Max loss" value={formatMetric(metrics.maxLoss)} />
              <Metric
                label="Breakevens"
                value={metrics.breakevens.length ? metrics.breakevens.map(formatPrice).join(", ") : "None"}
              />
            </div>
          </Card>

          <Card tone="muted">
            <div className="mb-4 flex items-center gap-2">
              <CircleAlert aria-hidden="true" className="size-5 text-warning" />
              <h2 className="text-xl font-black">Risk summary</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {metrics.riskLabels.map((label) => (
                <Badge key={label} tone={label.includes("Assignment") || label.includes("Short") ? "warning" : "neutral"}>
                  {label}
                </Badge>
              ))}
              <Badge tone="support">Simulated only</Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{selectedStrategy.useCase}</p>
            <StrategyStoryPanel className="mt-5 bg-white/70" compact strategyId={selectedStrategy.id} />

            {requiresAcknowledgement ? (
              <label className="mt-5 flex gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm leading-6">
                <input
                  checked={acknowledged}
                  className="mt-1 size-4"
                  onChange={(event) => void handleRiskAcknowledgementChange(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  <strong>{acknowledgementCopy?.title ?? "Risk acknowledgement"}:</strong>{" "}
                  {acknowledgementCopy?.body ??
                    "I understand this is an advanced or assignment-sensitive simulated strategy and the model is educational only."}
                </span>
              </label>
            ) : null}
          </Card>

          {validationErrors.length ? (
            <StatusMessage title="Fix required fields before saving" tone="warning">
              <ul className="list-disc pl-5">
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </StatusMessage>
          ) : null}

          {saveState === "saved" ? (
            <StatusMessage title="Simulated trade saved" tone="success">
              The trade is stored locally in IndexedDB.{" "}
              {savedTradeId ? (
                <Link className="font-bold text-primary-ink underline" to={`/journal/${savedTradeId}`}>
                  Open journal.
                </Link>
              ) : null}
            </StatusMessage>
          ) : null}

          {saveState === "error" ? (
            <StatusMessage title="Save failed" tone="warning">
              The draft stayed on screen. Check local storage permissions and try again.
            </StatusMessage>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={!canSave || saveState === "saving"} icon={<Save className="size-4" />} onClick={() => save("draft")}>
              Save draft
            </Button>
            <Button
              disabled={!canSave || saveState === "saving"}
              icon={<NotebookPen className="size-4" />}
              onClick={() => save("open")}
              variant="primary"
            >
              Save open simulation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegEditor({
  leg,
  index,
  onChange,
}: {
  leg: BuilderLeg;
  index: number;
  onChange: (leg: BuilderLeg) => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-white/72 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone={leg.action === "buy" ? "primary" : "warning"}>{leg.action}</Badge>
          <Badge tone="neutral">{leg.type}</Badge>
        </div>
        <span className="font-mono text-xs font-bold uppercase text-muted">Leg {index + 1}</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        <Field label="Action">
          <select className="input-control" onChange={(event) => onChange({ ...leg, action: event.target.value as BuilderLeg["action"] })} value={leg.action}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </Field>
        <Field label="Type">
          <select className="input-control" onChange={(event) => onChange({ ...leg, type: event.target.value as BuilderLeg["type"] })} value={leg.type}>
            <option value="call">Call</option>
            <option value="put">Put</option>
            <option value="stock">Stock</option>
          </select>
        </Field>
        <Field label={leg.type === "stock" ? "Shares" : "Contracts"}>
          <input
            className="input-control"
            min="1"
            onChange={(event) => onChange({ ...leg, quantity: Number(event.target.value) })}
            step="1"
            type="number"
            value={leg.quantity}
          />
        </Field>
        {leg.type === "stock" ? (
          <Field label="Stock price">
            <input
              className="input-control"
              min="1"
              onChange={(event) => onChange({ ...leg, price: Number(event.target.value) })}
              step="0.5"
              type="number"
              value={leg.price ?? 0}
            />
          </Field>
        ) : (
          <>
            <Field label="Strike">
              <input
                className="input-control"
                min="1"
                onChange={(event) => onChange({ ...leg, strike: Number(event.target.value) })}
                step="0.5"
                type="number"
                value={leg.strike ?? 0}
              />
            </Field>
            <Field label="Premium">
              <input
                className="input-control"
                min="0"
                onChange={(event) => onChange({ ...leg, premium: Number(event.target.value) })}
                step="0.05"
                type="number"
                value={leg.premium ?? 0}
              />
            </Field>
            <Field label="Expiration">
              <input
                className="input-control"
                onChange={(event) => onChange({ ...leg, expiration: event.target.value })}
                type="date"
                value={leg.expiration ?? defaultExpiration}
              />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/72 p-3">
      <p className="font-mono text-[0.65rem] font-bold uppercase text-muted">{label}</p>
      <p className="number mt-2 text-xl font-black leading-tight">{value}</p>
    </div>
  );
}

function formatMetric(value: number | "unlimited" | "unknown") {
  if (typeof value === "number") return formatCurrency(value);
  return value;
}

type RiskContext = RiskAcknowledgement["context"];

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
