import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { HeroStat } from "./MarketFormBits";
import { MarketManualQuoteCard } from "./MarketManualQuoteCard";
import { MarketQuoteCard } from "./MarketQuoteCard";
import { MarketScenarioCard } from "./MarketScenarioCard";
import { MarketStrategyCard } from "./MarketStrategyCard";
import { MarketSymbolSearchCard } from "./MarketSymbolSearchCard";
import { useMarketSimulator } from "./useMarketSimulator";

export function MarketSimulatorPage() {
  const market = useMarketSimulator();

  if (!market.seed || !market.selectedStrategy) {
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
                <p className="font-mono text-[0.68rem] font-bold uppercase text-white/55">
                  Data mode
                </p>
                <h2 className="mt-3 text-2xl font-black leading-tight">Mock and manual only</h2>
              </div>
              <Badge className="border-white/15 bg-white/10 text-white">No orders</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-white/10">
            <HeroStat
              label="Provider"
              value={market.quote.provider === "mock" ? "Mock" : "Manual"}
            />
            <HeroStat label="DTE" value={`${market.dte}`} />
            <HeroStat label="Rows" value={`${market.scenarioRows.length}`} />
          </div>
        </Card>
      </header>

      <div className="grid gap-6 2xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="space-y-6">
          <MarketSymbolSearchCard
            onApplyMockQuote={market.applyMockQuote}
            onQueryChange={market.setQuery}
            query={market.query}
            quote={market.quote}
            searchResults={market.searchResults}
          />

          <MarketManualQuoteCard
            manualPrice={market.manualPrice}
            manualSymbol={market.manualSymbol}
            onApplyManual={market.applyManualQuote}
            onManualPriceChange={market.setManualPrice}
            onManualSymbolChange={market.setManualSymbol}
          />
        </aside>

        <div className="space-y-6">
          <MarketQuoteCard onRefresh={market.refreshMockQuote} quote={market.quote} />

          <MarketStrategyCard
            builderPath={market.builderPath}
            expiration={market.expiration}
            legs={market.legs}
            onChangeLeg={market.updateLeg}
            onExpirationChange={market.updateExpiration}
            onSelectStrategy={market.setSelectedStrategyId}
            selectedStrategy={market.selectedStrategy}
            selectedStrategyId={market.selectedStrategyId}
            strategies={market.seed.strategies}
          />

          <MarketScenarioCard
            dte={market.dte}
            metrics={market.metrics}
            scenarioRows={market.scenarioRows}
          />
        </div>
      </div>
    </div>
  );
}
