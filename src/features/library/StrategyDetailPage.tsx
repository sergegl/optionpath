import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getStrategyDetail } from "../../db/repositories/strategyRepository";
import type { Lesson, StrategyTemplate, StrategyTemplateLeg } from "../../db/types";
import { calculateStrategyMetrics } from "../../domain/options/calculations";
import { createDefaultLegs, toPreviewTradeLegs } from "../../domain/options/defaultLegs";
import { Badge } from "../../ui/Badge";
import { LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { StatusMessage } from "../../ui/StatusMessage";
import { PayoffChart } from "../payoff/PayoffChart";
import { StrategyStoryPanel } from "./StrategyStoryPanel";

type Detail = {
  strategy: StrategyTemplate;
  legs: StrategyTemplateLeg[];
  relatedLesson?: Lesson;
};

export function StrategyDetailPage() {
  const { strategyId } = useParams();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!strategyId) {
      setLoading(false);
      return;
    }

    getStrategyDetail(strategyId).then((nextDetail) => {
      if (mounted) {
        setDetail(nextDetail);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [strategyId]);

  if (loading) return <Card className="min-h-96 animate-pulse" />;

  if (!detail) {
    return (
      <StatusMessage title="Strategy not found" tone="warning">
        This strategy is not available in the local catalog.
      </StatusMessage>
    );
  }

  const { strategy, legs, relatedLesson } = detail;
  const previewPrice = 100;
  const previewLegs = createDefaultLegs(strategy, legs, previewPrice);
  const metrics = calculateStrategyMetrics(strategy, toPreviewTradeLegs(previewLegs), previewPrice);

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink" to="/library">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to library
      </Link>

      <Card>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone={strategy.level === "advanced" ? "warning" : "primary"}>{strategy.level}</Badge>
              <Badge tone="neutral">{strategy.outlook}</Badge>
              <Badge tone={strategy.assignmentRisk === "none" ? "neutral" : "warning"}>
                {strategy.assignmentRisk === "none" ? "no assignment" : "assignment possible"}
              </Badge>
            </div>
            <h1 className="text-5xl font-black leading-none tracking-normal">{strategy.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{strategy.summary}</p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{strategy.useCase}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton icon={<ArrowRight className="size-4" />} to={`/builder?strategy=${strategy.id}`} variant="primary">
                Build simulated trade
              </LinkButton>
              {relatedLesson ? (
                <LinkButton icon={<BookOpen className="size-4" />} to={`/learn/${relatedLesson.id}`}>
                  Open lesson
                </LinkButton>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-panel-muted p-4">
            <h2 className="text-xl font-black">Strategy legs</h2>
            <div className="mt-4 space-y-2">
              {legs.map((leg) => (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white/75 p-3" key={leg.id}>
                  <div>
                    <p className="font-bold text-ink">{leg.role}</p>
                    <p className="text-xs font-bold uppercase text-muted">
                      {leg.action} {leg.type}
                    </p>
                  </div>
                  <Badge tone="neutral">x{leg.quantity}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoTile label="Max profit" value={strategy.maxProfitText} />
        <InfoTile label="Max loss" value={strategy.maxLossText} />
        <InfoTile label="Breakeven" value={strategy.breakevenText} />
      </div>

      <StrategyStoryPanel strategyId={strategy.id} />

      <Card>
        <Badge tone="primary">Payoff behavior</Badge>
        <div className="mt-4">
          <PayoffChart
            breakevens={metrics.breakevens}
            currentUnderlyingPrice={previewPrice}
            maxLoss={metrics.maxLoss}
            maxProfit={metrics.maxProfit}
            points={metrics.points}
            title={`${strategy.name} default payoff`}
          />
        </div>
      </Card>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <Card tone="muted">
      <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">{label}</p>
      <p className="mt-3 text-xl font-black leading-tight">{value}</p>
    </Card>
  );
}
