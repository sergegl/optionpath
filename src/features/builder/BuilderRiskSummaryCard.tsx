import type { StrategyTemplate } from "../../db/types";
import type { StrategyMetrics } from "../../domain/options/calculations";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { CircleAlert } from "lucide-react";
import { StrategyStoryPanel } from "../library/StrategyStoryPanel";

type RiskCopy = { title: string; body: string };

type Props = {
  strategy: StrategyTemplate;
  metrics: StrategyMetrics;
  requiresAcknowledgement: boolean;
  acknowledged: boolean;
  acknowledgementCopy: RiskCopy | null;
  onAcknowledgementChange: (checked: boolean) => void;
};

export function BuilderRiskSummaryCard({
  strategy,
  metrics,
  requiresAcknowledgement,
  acknowledged,
  acknowledgementCopy,
  onAcknowledgementChange,
}: Props) {
  return (
    <Card tone="muted">
      <div className="mb-4 flex items-center gap-2">
        <CircleAlert aria-hidden="true" className="size-5 text-warning" />
        <h2 className="text-xl font-black">Risk summary</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {metrics.riskLabels.map((label) => (
          <Badge
            key={label}
            tone={label.includes("Assignment") || label.includes("Short") ? "warning" : "neutral"}
          >
            {label}
          </Badge>
        ))}
        <Badge tone="support">Simulated only</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{strategy.useCase}</p>
      <StrategyStoryPanel className="mt-5 bg-white/70" compact strategyId={strategy.id} />

      {requiresAcknowledgement ? (
        <label className="mt-5 flex gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm leading-6">
          <input
            checked={acknowledged}
            className="mt-1 size-4"
            onChange={(event) => onAcknowledgementChange(event.target.checked)}
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
  );
}
