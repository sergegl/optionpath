import type { StrategyTemplate, WatchlistItem } from "../../db/types";
import { Card } from "../../ui/Card";
import { Field } from "./BuilderFormBits";

type Props = {
  strategies: StrategyTemplate[];
  watchlist: WatchlistItem[];
  selectedStrategyId: string;
  onSelectStrategy: (id: string) => void;
  symbol: string;
  onSymbolChange: (symbol: string) => void;
  underlyingPrice: number;
  onUnderlyingPriceChange: (price: number) => void;
};

export function BuilderSetupCard({
  strategies,
  watchlist,
  selectedStrategyId,
  onSelectStrategy,
  symbol,
  onSymbolChange,
  underlyingPrice,
  onUnderlyingPriceChange,
}: Props) {
  return (
    <Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Strategy">
          <select
            className="input-control"
            onChange={(event) => onSelectStrategy(event.target.value)}
            value={selectedStrategyId}
          >
            {strategies.map((strategy) => (
              <option key={strategy.id} value={strategy.id}>
                {strategy.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Symbol">
          <input
            className="input-control uppercase"
            onChange={(event) => onSymbolChange(event.target.value)}
            value={symbol}
          />
        </Field>
        <Field label="Sample watchlist">
          <select
            className="input-control"
            onChange={(event) => onSymbolChange(event.target.value)}
            value={symbol}
          >
            {watchlist.map((item) => (
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
            onChange={(event) => onUnderlyingPriceChange(Number(event.target.value))}
            step="0.5"
            type="number"
            value={underlyingPrice}
          />
        </Field>
      </div>
    </Card>
  );
}
