import type { LearningLevel, Lesson, SimulatedTrade, StrategyTemplate, Tutorial, WatchlistItem } from "../types";
import { db } from "../dexie";

export type PathProgress = {
  tutorial: Tutorial;
  totalLessons: number;
  completedLessons: number;
  percent: number;
};

export type DashboardData = {
  paths: PathProgress[];
  nextLesson: Lesson | null;
  recentTrades: Array<SimulatedTrade & { strategy?: StrategyTemplate }>;
  watchlist: WatchlistItem[];
  totalTrades: number;
  openTradeCount: number;
  completedLessonCount: number;
  totalLessonCount: number;
  lastSavedAt?: string;
};

export async function getDashboardData(): Promise<DashboardData> {
  const [tutorials, lessons, progress, trades, strategies, watchlist, settings] =
    await Promise.all([
      db.tutorials.orderBy("order").toArray(),
      db.lessons.orderBy("order").toArray(),
      db.userProgress.toArray(),
      db.simulatedTrades.orderBy("updatedAt").reverse().toArray(),
      db.strategyTemplates.toArray(),
      db.watchlists.orderBy("symbol").toArray(),
      db.appSettings.get("local"),
    ]);

  const completedLessonIds = new Set(
    progress.filter((item) => item.status === "completed").map((item) => item.lessonId),
  );
  const inProgressLessonIds = new Set(
    progress.filter((item) => item.status === "in_progress").map((item) => item.lessonId),
  );

  const strategiesById = new Map(strategies.map((strategy) => [strategy.id, strategy]));

  const paths = tutorials.map((tutorial) => {
    const tutorialLessons = lessons.filter((lesson) => lesson.tutorialId === tutorial.id);
    const completedLessons = tutorialLessons.filter((lesson) =>
      completedLessonIds.has(lesson.id),
    ).length;

    return {
      tutorial,
      totalLessons: tutorialLessons.length,
      completedLessons,
      percent:
        tutorialLessons.length === 0 ? 0 : (completedLessons / tutorialLessons.length) * 100,
    };
  });

  const nextLesson =
    lessons.find((lesson) => inProgressLessonIds.has(lesson.id)) ??
    lessons.find((lesson) => !completedLessonIds.has(lesson.id)) ??
    null;

  const recentTrades = trades.slice(0, 4).map((trade) => ({
    ...trade,
    strategy: strategiesById.get(trade.strategyId),
  }));

  return {
    paths,
    nextLesson,
    recentTrades,
    watchlist: watchlist.slice(0, 5),
    totalTrades: trades.length,
    openTradeCount: trades.filter((trade) => trade.status === "open").length,
    completedLessonCount: completedLessonIds.size,
    totalLessonCount: lessons.length,
    lastSavedAt: settings?.lastOpenedAt,
  };
}

export async function updateDashboardVisit() {
  const settings = await db.appSettings.get("local");

  await db.appSettings.put({
    id: "local",
    hasCompletedSeed: settings?.hasCompletedSeed ?? true,
    lastOpenedAt: settings?.lastOpenedAt,
    lastDashboardVisitAt: new Date().toISOString(),
  });
}

export function getLevelLabel(level: LearningLevel) {
  return level[0].toUpperCase() + level.slice(1);
}

