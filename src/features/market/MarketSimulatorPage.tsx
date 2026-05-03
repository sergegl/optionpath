import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ChartCandlestick,
  CircleAlert,
  RefreshCw,
  Search,
} from "lucide-react";
import { getBuilderSeedData } from "../../db/repositories/tradeRepository";
import type { StrategyTemplate, StrategyTemplateLeg } from "../../db/types";
import {
  calculateStrategyMetrics,
  formatBreakevens,
  formatCurrency,
  formatMetricValue,
  formatPrice,
} from "../../domain/options/calculations";
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
import { createManualQuote, getMockQuote, mockMarketDataProvider, searchMockSymbols } from "../../services/marketData/mockProvider";
import type { SymbolSearchResult, UnderlyingQuote } from "../../services/marketData/types";
import { Badge } from "../../ui/Badge";
import { Button, LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { clsx } from "../../ui/clsx";

type BuilderSeed = {
  strategies: StrategyTemplate[];
  templateLegs: StrategyTemplateLeg[];
};

export function MarketSimulatorPage() {
  const [seed, setSeed] = useState<BuilderSeed | null>(null);
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
  const primaryExpiration = legs.find((leg) => leg.type !== "stock" && leg.expiration)?.expiration ?? expiration;
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
    setQuote(getMockQuote(result.symbol));
    setManualSymbol(result.symbol);
    setManualPrice(getMockQuote(result.symbol).lastPrice);
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
      currentLegs.map((leg) => (leg.type === "stock" ? leg : { ...leg, expiration: nextExpiration })),
    );
  }

  if (!seed || !selectedStrategy) {
    return <Card className="min-h-96 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <header className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div>
          <Badge tone="primary">Market simulator</Badge>
          <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.96] tracking-normal sm:text-6xl">
            Simulate a ticker before you trade it.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Search a sample ticker or enter your own price, then project expiration profit and loss
            across different stock moves. Live market-data providers come after this workflow is
            reviewed.
          </p>
        </div>
        <Card tone="dark" className="p-0">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[0.68rem] font-bold uppercase text-white/55">Data mode</p>
                <h2 className="mt-3 text-2xl font-black leading-tight">Mock and manual only</h2>
              </div>
              <Badge className="border-white/15 bg-white/10 text-white">No orders</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-white/10">
            <HeroStat label="Provider" value={quote.provider === "mock" ? "Mock" : "Manual"} />
            <HeroStat label="DTE" value={`${dte}`} />
            <HeroStat label="Rows" value={`${scenarioRows.length}`} />
          </div>
        </Card>
      </header>

      <div className="grid gap-6 2xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <Badge tone="support">Ticker</Badge>
                <h2 className="mt-3 text-2xl font-black">Load symbol</h2>
              </div>
              <ChartCandlestick aria-hidden="true" className="size-6 text-primary" />
            </div>

            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Search aria-hidden="true" className="size-4" />
                Search mock list
              </span>
              <input
                className="input-control uppercase"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="AAPL, SPY, MSFT"
                value={query}
              />
            </label>

            <div className="mt-4 space-y-2">
              {searchResults.length ? (
                searchResults.map((result) => (
                  <button
                    className={clsx(
                      "w-full rounded-lg border p-3 text-left transition hover:border-primary/45 hover:bg-primary/5",
                      quote.symbol === result.symbol && quote.provider === "mock"
                        ? "border-primary/35 bg-primary/10"
                        : "border-line bg-white/72",
                    )}
                    key={result.symbol}
                    onClick={() => applyMockQuote(result)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm font-black">{result.symbol}</p>
                        <p className="mt-1 text-sm leading-5 text-muted">{result.name}</p>
                      </div>
                      <Badge tone={result.assetType === "etf" ? "support" : "neutral"}>{result.assetType}</Badge>
                    </div>
                  </button>
                ))
              ) : (
                <p className="rounded-lg border border-line bg-white/72 p-3 text-sm leading-6 text-muted">
                  No mock symbol matched. Use manual mode below.
                </p>
              )}
            </div>
          </Card>

          <Card tone="muted">
            <Badge tone="warning">Manual quote</Badge>
            <div className="mt-4 grid gap-3">
              <Field label="Symbol">
                <input
                  className="input-control uppercase"
                  onChange={(event) => setManualSymbol(event.target.value)}
                  value={manualSymbol}
                />
              </Field>
              <Field label="Underlying price">
                <input
                  className="input-control"
                  min="1"
                  onChange={(event) => setManualPrice(Number(event.target.value))}
                  step="0.01"
                  type="number"
                  value={manualPrice}
                />
              </Field>
              <Button disabled={manualPrice <= 0} onClick={applyManualQuote} variant="secondary">
                Apply manual price
              </Button>
            </div>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={quote.provider === "mock" ? "support" : "warning"}>
                    {quote.provider === "mock" ? mockMarketDataProvider.label : "Manual input"}
                  </Badge>
                  <Badge tone="neutral">Simulation only</Badge>
                </div>
                <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-3">
                  <div>
                    <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">Selected ticker</p>
                    <h2 className="mt-2 text-5xl font-black leading-none">{quote.symbol}</h2>
                  </div>
                  <div>
                    <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">Underlying price</p>
                    <p className="number mt-2 text-4xl font-black leading-none">{formatPrice(quote.lastPrice)}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
                  {quote.name ?? "Manual symbol"} values are used only for simulated expiration
                  scenarios. This quote is not live market data.
                </p>
              </div>

              <div className="rounded-lg border border-line bg-panel-muted p-4">
                <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">Quote context</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniMetric label="Bid" value={quote.bid ? formatPrice(quote.bid) : "--"} />
                  <MiniMetric label="Ask" value={quote.ask ? formatPrice(quote.ask) : "--"} />
                  <MiniMetric
                    label="Change"
                    tone={(quote.change ?? 0) >= 0 ? "profit" : "loss"}
                    value={quote.change === undefined ? "--" : `${quote.change >= 0 ? "+" : ""}${formatPrice(quote.change)}`}
                  />
                  <MiniMetric
                    label="Change %"
                    tone={(quote.changePercent ?? 0) >= 0 ? "profit" : "loss"}
                    value={
                      quote.changePercent === undefined
                        ? "--"
                        : `${quote.changePercent >= 0 ? "+" : ""}${formatPrice(quote.changePercent)}%`
                    }
                  />
                </div>
                <Button
                  className="mt-4 w-full"
                  disabled={quote.provider !== "mock"}
                  icon={<RefreshCw className="size-4" />}
                  onClick={refreshMockQuote}
                  size="sm"
                >
                  Refresh mock quote
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Badge tone="primary">Model inputs</Badge>
                <h2 className="mt-3 text-2xl font-black">Strategy and legs</h2>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <LinkButton icon={<ArrowRight className="size-4" />} to={builderPath} variant="primary">
                  Open in builder
                </LinkButton>
              </div>
            </div>

            <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
              <Field label="Strategy template">
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
              <Field label="Expiration">
                <input
                  className="input-control"
                  onChange={(event) => updateExpiration(event.target.value)}
                  type="date"
                  value={expiration}
                />
              </Field>
            </div>

            <div className="space-y-3">
              {legs.map((leg, index) => (
                <MarketLegEditor
                  index={index}
                  key={`${selectedStrategy.id}-${index}-${leg.type}-${leg.action}`}
                  leg={leg}
                  onChange={(nextLeg) =>
                    setLegs((currentLegs) =>
                      currentLegs.map((currentLeg, currentIndex) =>
                        currentIndex === index ? nextLeg : currentLeg,
                      ),
                    )
                  }
                />
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Badge tone="support">Projection</Badge>
                <h2 className="mt-3 text-2xl font-black">Expiration outcome table</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  These rows estimate P/L at expiration only. Before-expiration price estimates,
                  volatility shocks, and live option chains will come in later phases.
                </p>
              </div>
              <Badge tone={metrics.netCredit >= 0 ? "profit" : "loss"}>
                {metrics.netCredit >= 0 ? "Credit" : "Debit"} {formatCurrency(Math.abs(metrics.netCredit))}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <MiniMetric label="Max profit" value={formatMetricValue(metrics.maxProfit)} />
              <MiniMetric label="Max loss" value={formatMetricValue(metrics.maxLoss)} />
              <MiniMetric label="Breakeven" value={formatBreakevens(metrics.breakevens)} />
              <MiniMetric label="Days to exp." value={`${dte}`} />
            </div>

            <div className="mt-5 overflow-x-auto rounded-lg border border-line">
              <table className="w-full min-w-[42rem] border-collapse bg-white/72 text-left">
                <thead className="bg-panel-muted">
                  <tr className="font-mono text-[0.68rem] font-bold uppercase text-muted">
                    <th className="px-4 py-3">Move</th>
                    <th className="px-4 py-3">Stock price</th>
                    <th className="px-4 py-3">Expiration P/L</th>
                    <th className="px-4 py-3">% max risk</th>
                    <th className="px-4 py-3">Read</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioRows.map((row) => (
                    <tr className="border-t border-line" key={row.priceMovePercent}>
                      <td className="px-4 py-3">
                        <Badge tone={row.priceMovePercent >= 0 ? "profit" : "loss"}>
                          {row.priceMovePercent > 0 ? "+" : ""}
                          {row.priceMovePercent}%
                        </Badge>
                      </td>
                      <td className="number px-4 py-3 font-mono font-bold">
                        {formatPrice(row.projectedUnderlyingPrice)}
                      </td>
                      <td
                        className={clsx(
                          "number px-4 py-3 font-mono text-lg font-black",
                          row.expirationProfitLoss >= 0 ? "text-profit" : "text-loss",
                        )}
                      >
                        {formatSignedCurrency(row.expirationProfitLoss)}
                      </td>
                      <td className="number px-4 py-3 font-mono font-bold text-muted">
                        {row.percentOfMaxRisk === undefined
                          ? "--"
                          : `${row.percentOfMaxRisk > 0 ? "+" : ""}${formatPrice(row.percentOfMaxRisk)}%`}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-muted">
                        {row.expirationProfitLoss > 0
                          ? "Projected profit at expiration"
                          : row.expirationProfitLoss < 0
                            ? "Projected loss at expiration"
                            : "Near breakeven"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex gap-3 rounded-lg border border-warning/25 bg-warning/10 p-3 text-sm leading-6 text-[#744700]">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              <p>
                This is an expiration payoff model, not a quote, recommendation, or probability
                forecast. Live chains and before-expiration estimates require a market-data provider.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MarketLegEditor({
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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Action">
          <select
            className="input-control"
            onChange={(event) => onChange({ ...leg, action: event.target.value as BuilderLeg["action"] })}
            value={leg.action}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </Field>
        <Field label="Type">
          <select
            className="input-control"
            onChange={(event) => onChange({ ...leg, type: event.target.value as BuilderLeg["type"] })}
            value={leg.type}
          >
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
              step="0.01"
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

function MiniMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "profit" | "loss";
}) {
  return (
    <div className="rounded-lg border border-line bg-white/72 p-3">
      <p className="font-mono text-[0.65rem] font-bold uppercase text-muted">{label}</p>
      <p
        className={clsx(
          "number mt-2 break-words text-xl font-black leading-tight",
          tone === "profit" && "text-profit",
          tone === "loss" && "text-loss",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 p-4">
      <p className="font-mono text-[0.62rem] font-bold uppercase text-white/50">{label}</p>
      <p className="number mt-2 text-2xl font-black leading-none text-white">{value}</p>
    </div>
  );
}

function formatSignedCurrency(value: number) {
  return `${value > 0 ? "+" : ""}${formatCurrency(value)}`;
}
