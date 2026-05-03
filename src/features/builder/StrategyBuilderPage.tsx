import { Badge } from "../../ui/Badge";
import { LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { BuilderActions } from "./BuilderActions";
import { BuilderLegEditorCard } from "./BuilderLegEditorCard";
import { BuilderPayoffCard } from "./BuilderPayoffCard";
import { BuilderRiskSummaryCard } from "./BuilderRiskSummaryCard";
import { BuilderSetupCard } from "./BuilderSetupCard";
import { BuilderTradePlanCard } from "./BuilderTradePlanCard";
import { useBuilderState } from "./useBuilderState";

export function StrategyBuilderPage() {
  const builder = useBuilderState();

  if (!builder.seed || !builder.selectedStrategy) {
    return <Card className="min-h-96 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <Badge tone="primary">Strategy builder</Badge>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">
            Build a simulated trade
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
            Choose a strategy, edit the legs, and save the model locally. This screen does not send
            orders or connect to a brokerage.
          </p>
        </div>
        <LinkButton to="/library">Browse library</LinkButton>
      </header>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,0.95fr)_minmax(28rem,1.05fr)]">
        <div className="space-y-6">
          <BuilderSetupCard
            onSelectStrategy={builder.setSelectedStrategyId}
            onSymbolChange={builder.setSymbol}
            onUnderlyingPriceChange={builder.setUnderlyingPrice}
            selectedStrategyId={builder.selectedStrategyId}
            strategies={builder.seed.strategies}
            symbol={builder.symbol}
            underlyingPrice={builder.underlyingPrice}
            watchlist={builder.seed.watchlist}
          />

          <BuilderLegEditorCard
            legs={builder.legs}
            onChangeLeg={builder.updateLeg}
            strategy={builder.selectedStrategy}
          />

          <BuilderTradePlanCard
            exitPlan={builder.exitPlan}
            onExitPlanChange={builder.setExitPlan}
            onThesisChange={builder.setThesis}
            thesis={builder.thesis}
          />
        </div>

        <div className="space-y-6">
          <BuilderPayoffCard
            metrics={builder.metrics}
            strategy={builder.selectedStrategy}
            underlyingPrice={builder.underlyingPrice}
          />

          <BuilderRiskSummaryCard
            acknowledged={builder.acknowledged}
            acknowledgementCopy={builder.acknowledgementCopy}
            metrics={builder.metrics}
            onAcknowledgementChange={(checked) =>
              void builder.handleRiskAcknowledgementChange(checked)
            }
            requiresAcknowledgement={builder.requiresAcknowledgement}
            strategy={builder.selectedStrategy}
          />

          <BuilderActions
            canSave={builder.canSave}
            onSaveDraft={() => void builder.save("draft")}
            onSaveOpen={() => void builder.save("open")}
            savedTradeId={builder.savedTradeId}
            saveState={builder.saveState}
            validationErrors={builder.validationErrors}
          />
        </div>
      </div>
    </div>
  );
}
