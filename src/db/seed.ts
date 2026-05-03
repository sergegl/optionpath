import { seedLessons, seedLessonSteps, seedTutorials } from "../data/seedLessons";
import { seedStrategies, seedStrategyLegs } from "../data/seedStrategies";
import { seedWatchlist } from "../data/seedWatchlist";
import { db } from "./dexie";

const SETTINGS_ID = "local";

export async function initializeDatabase() {
  const now = new Date().toISOString();

  await db.transaction(
    "rw",
    [
      db.tutorials,
      db.lessons,
      db.lessonSteps,
      db.strategyTemplates,
      db.strategyTemplateLegs,
      db.watchlists,
      db.appSettings,
    ],
    async () => {
      const settings = await db.appSettings.get(SETTINGS_ID);

      await Promise.all([
        db.tutorials.clear(),
        db.lessons.clear(),
        db.lessonSteps.clear(),
        db.strategyTemplates.clear(),
        db.strategyTemplateLegs.clear(),
      ]);

      await db.tutorials.bulkPut(seedTutorials);
      await db.lessons.bulkPut(seedLessons);
      await db.lessonSteps.bulkPut(seedLessonSteps);
      await db.strategyTemplates.bulkPut(seedStrategies);
      await db.strategyTemplateLegs.bulkPut(seedStrategyLegs);

      const existingWatchlistCount = await db.watchlists.count();
      if (existingWatchlistCount === 0) {
        await db.watchlists.bulkPut(seedWatchlist);
      }

      await db.appSettings.put({
        id: SETTINGS_ID,
        hasCompletedSeed: true,
        lastOpenedAt: now,
        lastDashboardVisitAt: settings?.lastDashboardVisitAt,
      });
    },
  );
}
