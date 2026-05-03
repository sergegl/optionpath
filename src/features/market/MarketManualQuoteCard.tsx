import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Field } from "./MarketFormBits";

type Props = {
  manualSymbol: string;
  onManualSymbolChange: (value: string) => void;
  manualPrice: number;
  onManualPriceChange: (value: number) => void;
  onApplyManual: () => void;
};

export function MarketManualQuoteCard({
  manualSymbol,
  onManualSymbolChange,
  manualPrice,
  onManualPriceChange,
  onApplyManual,
}: Props) {
  return (
    <Card tone="muted">
      <Badge tone="warning">Manual quote</Badge>
      <div className="mt-4 grid gap-3">
        <Field label="Symbol">
          <input
            className="input-control uppercase"
            onChange={(event) => onManualSymbolChange(event.target.value)}
            value={manualSymbol}
          />
        </Field>
        <Field label="Underlying price">
          <input
            className="input-control"
            min="1"
            onChange={(event) => onManualPriceChange(Number(event.target.value))}
            step="0.01"
            type="number"
            value={manualPrice}
          />
        </Field>
        <Button disabled={manualPrice <= 0} onClick={onApplyManual} variant="secondary">
          Apply manual price
        </Button>
      </div>
    </Card>
  );
}
