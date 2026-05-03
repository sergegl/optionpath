import type { StrategyTemplate } from "../../db/types";
import { defaultExpiration, type BuilderLeg } from "../../domain/options/defaultLegs";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { Field } from "./BuilderFormBits";

type Props = {
  strategy: StrategyTemplate;
  legs: BuilderLeg[];
  onChangeLeg: (index: number, leg: BuilderLeg) => void;
};

export function BuilderLegEditorCard({ strategy, legs, onChangeLeg }: Props) {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <Badge tone="neutral">Leg editor</Badge>
          <h2 className="mt-3 text-2xl font-black">{strategy.name}</h2>
        </div>
        <Badge tone={strategy.assignmentRisk === "none" ? "neutral" : "warning"}>
          {strategy.assignmentRisk === "none" ? "No assignment" : "Assignment possible"}
        </Badge>
      </div>

      <div className="space-y-3">
        {legs.map((leg, index) => (
          <LegEditor
            index={index}
            key={`${strategy.id}-${index}-${leg.type}-${leg.action}`}
            leg={leg}
            onChange={(nextLeg) => onChangeLeg(index, nextLeg)}
          />
        ))}
      </div>
    </Card>
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
