import { RefreshCw } from "lucide-react";
import { formatPrice } from "../../domain/options/calculations";
import { mockMarketDataProvider } from "../../services/marketData/mockProvider";
import type { UnderlyingQuote } from "../../services/marketData/types";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { MiniMetric } from "./MarketFormBits";

type Props = {
  quote: UnderlyingQuote;
  onRefresh: () => void;
};

export function MarketQuoteCard({ quote, onRefresh }: Props) {
  return (
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
              <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">
                Selected ticker
              </p>
              <h2 className="mt-2 text-5xl font-black leading-none">{quote.symbol}</h2>
            </div>
            <div>
              <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">
                Underlying price
              </p>
              <p className="number mt-2 text-4xl font-black leading-none">
                {formatPrice(quote.lastPrice)}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            {quote.name ?? "Manual symbol"} values are used only for simulated expiration scenarios.
            This quote is not live market data.
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
              value={
                quote.change === undefined
                  ? "--"
                  : `${quote.change >= 0 ? "+" : ""}${formatPrice(quote.change)}`
              }
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
            onClick={onRefresh}
            size="sm"
          >
            Refresh mock quote
          </Button>
        </div>
      </div>
    </Card>
  );
}
