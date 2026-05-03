import { ChartCandlestick, Search } from "lucide-react";
import type { SymbolSearchResult, UnderlyingQuote } from "../../services/marketData/types";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { clsx } from "../../ui/clsx";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  searchResults: SymbolSearchResult[];
  quote: UnderlyingQuote;
  onApplyMockQuote: (result: SymbolSearchResult) => void;
};

export function MarketSymbolSearchCard({
  query,
  onQueryChange,
  searchResults,
  quote,
  onApplyMockQuote,
}: Props) {
  return (
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
          onChange={(event) => onQueryChange(event.target.value)}
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
              onClick={() => onApplyMockQuote(result)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-black">{result.symbol}</p>
                  <p className="mt-1 text-sm leading-5 text-muted">{result.name}</p>
                </div>
                <Badge tone={result.assetType === "etf" ? "support" : "neutral"}>
                  {result.assetType}
                </Badge>
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
  );
}
