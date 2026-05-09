import { getStrategyStory, getTrainingVisualAsset, type TrainingVisualAsset } from "../../data/trainingVisuals";
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
        <div className="grid grid-cols-[6.75rem_minmax(0,1fr)] items-center gap-4">
          <StrategyStoryImage asset={visualAsset} />
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

function StrategyStoryImage({ asset }: { asset?: TrainingVisualAsset }) {
  return (
    <img
      alt={asset?.alt ?? "Strategy visual thumbnail."}
      className="aspect-[4/3] w-full rounded-lg border border-line bg-white/82 object-cover shadow-[0_10px_24px_rgba(18,21,18,0.06)]"
      decoding="async"
      loading="lazy"
      src={asset?.imageSrc ?? "/visuals/strategy-cards/long-call.svg"}
    />
  );
}
