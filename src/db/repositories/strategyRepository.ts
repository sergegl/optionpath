import { db } from "../dexie";
import type { LearningLevel, StrategyOutlook, StrategyRiskType } from "../types";

export async function getStrategyTemplates() {
  const strategies = await db.strategyTemplates.toArray();
  return sortStrategies(strategies);
}

export async function getStrategyDetail(slugOrId: string) {
  const directStrategy = await db.strategyTemplates.get(slugOrId);
  const strategy =
    directStrategy ??
    (await db.strategyTemplates.toArray()).find((template) => template.slug === slugOrId);

  if (!strategy) {
    return null;
  }

  const [legs, relatedLesson] = await Promise.all([
    db.strategyTemplateLegs.where("strategyId").equals(strategy.id).toArray(),
    strategy.lessonId ? db.lessons.get(strategy.lessonId) : Promise.resolve(undefined),
  ]);

  return {
    strategy,
    legs,
    relatedLesson,
  };
}

export async function getFilteredStrategies(filters: {
  query?: string;
  level?: LearningLevel | "all";
  outlook?: StrategyOutlook | "all";
  riskType?: StrategyRiskType | "all";
}) {
  const strategies = await getStrategyTemplates();
  const query = filters.query?.trim().toLowerCase();

  return strategies.filter((strategy) => {
    const matchesQuery =
      !query ||
      [strategy.name, strategy.summary, strategy.category, strategy.outlook, strategy.riskType]
        .join(" ")
        .toLowerCase()
        .includes(query);
    const matchesLevel = !filters.level || filters.level === "all" || strategy.level === filters.level;
    const matchesOutlook =
      !filters.outlook || filters.outlook === "all" || strategy.outlook === filters.outlook;
    const matchesRisk =
      !filters.riskType || filters.riskType === "all" || strategy.riskType === filters.riskType;

    return matchesQuery && matchesLevel && matchesOutlook && matchesRisk;
  });
}

function sortStrategies<T extends { level: LearningLevel; name: string }>(strategies: T[]) {
  const levelRank: Record<LearningLevel, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };

  return [...strategies].sort(
    (left, right) => levelRank[left.level] - levelRank[right.level] || left.name.localeCompare(right.name),
  );
}
