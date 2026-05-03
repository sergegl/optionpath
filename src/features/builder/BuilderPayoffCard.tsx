import type { StrategyTemplate } from "../../db/types";
import { formatCurrency, formatPrice } from "../../domain/options/calculations";
import type { StrategyMetrics } from "../../domain/options/calculations";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { PayoffChart } from "../payoff/PayoffChart";
import { Metric, formatMetric } from "./BuilderFormBits";

type Props = {
  strategy: StrategyTemplate;
  metrics: StrategyMetrics;
  underlyingPrice: number;
};

export function BuilderPayoffCard({ strategy, metrics, underlyingPrice }: Props) {
  return (
    <Card>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="primary">Payoff preview</Badge>
          <h2 className="mt-3 text-2xl font-black">Expiration model</h2>
        </div>
        <Badge tone={metrics.netCredit >= 0 ? "profit" : "loss"}>
          {metrics.netCredit >= 0 ? "net credit" : "net debit"}{" "}
          {formatCurrency(Math.abs(metrics.netCredit))}
        </Badge>
      </div>

      <PayoffChart
        breakevens={metrics.breakevens}
        currentUnderlyingPrice={underlyingPrice}
        maxLoss={metrics.maxLoss}
        maxProfit={metrics.maxProfit}
        points={metrics.points}
        title={`${strategy.name} payoff`}
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Max profit" value={formatMetric(metrics.maxProfit)} />
        <Metric label="Max loss" value={formatMetric(metrics.maxLoss)} />
        <Metric
          label="Breakevens"
          value={
            metrics.breakevens.length ? metrics.breakevens.map(formatPrice).join(", ") : "None"
          }
        />
      </div>
    </Card>
  );
}
