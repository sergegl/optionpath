import { CircleAlert } from "lucide-react";
import {
  formatBreakevens,
  formatCurrency,
  formatMetricValue,
  formatPrice,
} from "../../domain/options/calculations";
import type { StrategyMetrics } from "../../domain/options/calculations";
import type { ExpirationScenarioRow } from "../../domain/scenarios/expirationScenarios";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { clsx } from "../../ui/clsx";
import { MiniMetric, formatSignedCurrency } from "./MarketFormBits";

type Props = {
  metrics: StrategyMetrics;
  scenarioRows: ExpirationScenarioRow[];
  dte: number;
};

export function MarketScenarioCard({ metrics, scenarioRows, dte }: Props) {
  return (
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
          {metrics.netCredit >= 0 ? "Credit" : "Debit"}{" "}
          {formatCurrency(Math.abs(metrics.netCredit))}
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
          This is an expiration payoff model, not a quote, recommendation, or probability forecast.
          Live chains and before-expiration estimates require a market-data provider.
        </p>
      </div>
    </Card>
  );
}
