import { ArrowRight } from "lucide-react";
import type { StrategyTemplate } from "../../db/types";
import { defaultExpiration, type BuilderLeg } from "../../domain/options/defaultLegs";
import { Badge } from "../../ui/Badge";
import { LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Field } from "./MarketFormBits";

type Props = {
  strategies: StrategyTemplate[];
  selectedStrategy: StrategyTemplate;
  selectedStrategyId: string;
  onSelectStrategy: (id: string) => void;
  expiration: string;
  onExpirationChange: (next: string) => void;
  legs: BuilderLeg[];
  onChangeLeg: (index: number, leg: BuilderLeg) => void;
  builderPath: string;
};

export function MarketStrategyCard({
  strategies,
  selectedStrategy,
  selectedStrategyId,
  onSelectStrategy,
  expiration,
  onExpirationChange,
  legs,
  onChangeLeg,
  builderPath,
}: Props) {
  return (
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
        <Field label="Expiration">
          <input
            className="input-control"
            onChange={(event) => onExpirationChange(event.target.value)}
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
            onChange={(nextLeg) => onChangeLeg(index, nextLeg)}
          />
        ))}
      </div>
    </Card>
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
            onChange={(event) =>
              onChange({ ...leg, action: event.target.value as BuilderLeg["action"] })
            }
            value={leg.action}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </Field>
        <Field label="Type">
          <select
            className="input-control"
            onChange={(event) =>
              onChange({ ...leg, type: event.target.value as BuilderLeg["type"] })
            }
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
