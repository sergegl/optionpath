import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { Field } from "./BuilderFormBits";

type Props = {
  thesis: string;
  onThesisChange: (value: string) => void;
  exitPlan: string;
  onExitPlanChange: (value: string) => void;
};

export function BuilderTradePlanCard({
  thesis,
  onThesisChange,
  exitPlan,
  onExitPlanChange,
}: Props) {
  return (
    <Card>
      <Badge tone="support">Trade plan</Badge>
      <div className="mt-4 grid gap-4">
        <Field label="Entry thesis">
          <textarea
            className="input-control min-h-28 resize-y py-3"
            onChange={(event) => onThesisChange(event.target.value)}
            placeholder="Why does this simulated trade fit the educational setup?"
            value={thesis}
          />
        </Field>
        <Field label="Exit plan">
          <textarea
            className="input-control min-h-24 resize-y py-3"
            onChange={(event) => onExitPlanChange(event.target.value)}
            placeholder="What would invalidate the idea, and what would you review at expiration?"
            value={exitPlan}
          />
        </Field>
      </div>
    </Card>
  );
}
