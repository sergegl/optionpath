import { getStrategyStory, getTrainingVisualAsset } from "../../data/trainingVisuals";
import { Badge } from "../../ui/Badge";
import { clsx } from "../../ui/clsx";
import { LearningVisualBlock } from "../tutorials/LearningVisualBlock";

type StrategyStoryPanelProps = {
  className?: string;
  compact?: boolean;
  strategyId: string;
};

export function StrategyStoryPanel({ className, compact = false, strategyId }: StrategyStoryPanelProps) {
  const story = getStrategyStory(strategyId);
  const visualAsset = getTrainingVisualAsset(story?.visualAssetId);

  if (!story) return null;

  if (compact) {
    return (
      <div className={clsx("rounded-lg border border-line bg-panel-muted p-3", className)}>
        <div className="grid gap-3 sm:grid-cols-[4.75rem_minmax(0,1fr)]">
          <MiniStrategySignal strategyId={strategyId} />
          <div className="min-w-0">
            <Badge tone="support">Story</Badge>
            <p className="mt-2 text-sm font-bold leading-6 text-ink">{story.plainSummary}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-muted">{story.keyRisk}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("rounded-lg border border-line bg-panel-muted p-4", className)}>
      <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
        {visualAsset ? <LearningVisualBlock asset={visualAsset} /> : null}
        <div>
          <Badge tone="support">Strategy story</Badge>
          <p className="mt-3 text-2xl font-black leading-tight">{story.plainSummary}</p>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-mono text-[0.68rem] font-bold uppercase text-muted">Key risk</dt>
              <dd className="mt-1 font-bold text-ink">{story.keyRisk}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.68rem] font-bold uppercase text-muted">Best for learning</dt>
              <dd className="mt-1 font-bold text-ink">{story.bestForLearning}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function MiniStrategySignal({ strategyId }: { strategyId: string }) {
  const variant =
    strategyId === "strategy-long-put"
      ? "put"
      : strategyId === "strategy-covered-call"
        ? "cap"
        : strategyId === "strategy-cash-secured-put"
          ? "cash"
          : strategyId === "strategy-protective-put"
            ? "floor"
            : "call";

  return (
    <div className="relative min-h-20 overflow-hidden rounded-lg border border-line bg-white/82 p-2">
      <div className="absolute inset-x-3 bottom-5 h-1 rounded-full bg-ink/18" />
      <div className="absolute bottom-3 left-5 top-3 w-1 rounded-full bg-ink/18" />
      {variant === "call" ? <span className="absolute bottom-7 left-5 h-1 w-14 origin-left -rotate-[28deg] rounded-full bg-primary" /> : null}
      {variant === "put" ? <span className="absolute bottom-7 left-5 h-1 w-14 origin-left rotate-[28deg] rounded-full bg-support" /> : null}
      {variant === "cap" ? (
        <>
          <span className="absolute left-4 right-4 top-4 h-7 rounded-md border border-warning/30 bg-warning/10" />
          <span className="absolute left-4 right-4 top-10 h-7 rounded-md border border-line bg-panel-muted" />
        </>
      ) : null}
      {variant === "cash" ? (
        <>
          <span className="absolute left-3 top-3 rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-sm font-black text-primary-ink">$</span>
          <span className="absolute right-3 top-7 rounded-md border border-warning/30 bg-warning/10 px-2 py-1 text-xs font-black text-[#744700]">Put</span>
        </>
      ) : null}
      {variant === "floor" ? (
        <>
          <span className="absolute left-4 right-4 bottom-8 h-7 rounded-md border border-primary/25 bg-primary/10" />
          <span className="absolute bottom-7 left-4 right-4 h-1 rounded-full bg-support" />
        </>
      ) : null}
    </div>
  );
}
