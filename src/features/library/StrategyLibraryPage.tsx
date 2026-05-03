import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getFilteredStrategies } from "../../db/repositories/strategyRepository";
import type { LearningLevel, StrategyOutlook, StrategyRiskType, StrategyTemplate } from "../../db/types";
import { Badge } from "../../ui/Badge";
import { LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { StrategyStoryPanel } from "./StrategyStoryPanel";
import { EditorialImage } from "../visuals/EditorialImage";

const levels: Array<LearningLevel | "all"> = ["all", "beginner", "intermediate", "advanced"];
const outlooks: Array<StrategyOutlook | "all"> = ["all", "bullish", "bearish", "neutral", "volatile", "hedge"];
const riskTypes: Array<StrategyRiskType | "all"> = [
  "all",
  "defined",
  "premium",
  "stock_backed",
  "cash_backed",
  "undefined",
];

export function StrategyLibraryPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LearningLevel | "all">("all");
  const [outlook, setOutlook] = useState<StrategyOutlook | "all">("all");
  const [riskType, setRiskType] = useState<StrategyRiskType | "all">("all");
  const [strategies, setStrategies] = useState<StrategyTemplate[]>([]);

  useEffect(() => {
    let mounted = true;

    getFilteredStrategies({ query, level, outlook, riskType }).then((nextStrategies) => {
      if (mounted) setStrategies(nextStrategies);
    });

    return () => {
      mounted = false;
    };
  }, [query, level, outlook, riskType]);

  const grouped = useMemo(() => {
    return {
      beginner: strategies.filter((strategy) => strategy.level === "beginner"),
      intermediate: strategies.filter((strategy) => strategy.level === "intermediate"),
      advanced: strategies.filter((strategy) => strategy.level === "advanced"),
    };
  }, [strategies]);

  return (
    <div className="space-y-6">
      <header className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-center">
        <div>
          <Badge tone="support">Strategy library</Badge>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">Common options trades</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
            Browse educational strategy templates by level, outlook, and risk type. Build actions open
            simulated trades only.
          </p>
        </div>
        <EditorialImage
          alt="Abstract map of option strategy categories arranged by outlook and risk."
          className="xl:self-start"
          imageClassName="aspect-[16/10]"
          src="/visuals/strategy-library-map.jpg"
        />
      </header>

      <Card>
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_11rem_11rem_12rem]">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
              <Search aria-hidden="true" className="size-4" />
              Search
            </span>
            <input
              className="min-h-11 w-full rounded-lg border border-line bg-white px-3 font-semibold outline-none transition focus:border-support"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="calls, income, hedge"
              value={query}
            />
          </label>
          <SelectFilter label="Level" onChange={setLevel} options={levels} value={level} />
          <SelectFilter label="Outlook" onChange={setOutlook} options={outlooks} value={outlook} />
          <SelectFilter label="Risk type" onChange={setRiskType} options={riskTypes} value={riskType} />
        </div>
      </Card>

      {strategies.length === 0 ? (
        <Card>
          <h2 className="text-2xl font-black">No strategies match those filters</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Clear one or more filters to return to the full catalog.</p>
        </Card>
      ) : (
        (Object.keys(grouped) as Array<keyof typeof grouped>).map((group) =>
          grouped[group].length ? (
            <section className="space-y-3" key={group}>
              <h2 className="text-2xl font-black capitalize">{group}</h2>
              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {grouped[group].map((strategy) => (
                  <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
              </div>
            </section>
          ) : null,
        )
      )}
    </div>
  );
}

function StrategyCard({ strategy }: { strategy: StrategyTemplate }) {
  return (
    <Card className="flex min-h-80 flex-col justify-between">
      <div>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge tone={strategy.level === "advanced" ? "warning" : strategy.level === "beginner" ? "primary" : "support"}>
            {strategy.level}
          </Badge>
          <Badge tone="neutral">{strategy.outlook}</Badge>
          <Badge tone={strategy.assignmentRisk === "none" ? "neutral" : "warning"}>
            {strategy.assignmentRisk === "none" ? "no assignment" : "assignment possible"}
          </Badge>
        </div>
        <h3 className="text-2xl font-black">{strategy.name}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{strategy.summary}</p>
        <StrategyStoryPanel className="mt-5" compact strategyId={strategy.id} />
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="font-mono text-[0.68rem] font-bold uppercase text-muted">Max loss</dt>
            <dd className="mt-1 font-bold text-ink">{strategy.maxLossText}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] font-bold uppercase text-muted">Breakeven</dt>
            <dd className="mt-1 font-bold text-ink">{strategy.breakevenText}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <LinkButton icon={<ArrowRight className="size-4" />} to={`/builder?strategy=${strategy.id}`} variant="primary">
          Build
        </LinkButton>
        <LinkButton icon={<BookOpen className="size-4" />} to={`/library/${strategy.slug}`}>
          Details
        </LinkButton>
      </div>
    </Card>
  );
}

function SelectFilter<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
        <Filter aria-hidden="true" className="size-4" />
        {label}
      </span>
      <select
        className="min-h-11 w-full rounded-lg border border-line bg-white px-3 font-semibold capitalize outline-none transition focus:border-support"
        onChange={(event) => onChange(event.target.value as T)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replace("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
