import type {
  AppSettings,
  JournalEntry,
  QuizAttempt,
  RiskAcknowledgement,
  SimulatedTrade,
  SimulatedTradeLeg,
  UserProgress,
  WatchlistItem,
} from "../types";
import { db } from "../dexie";
import { initializeDatabase } from "../seed";

export type AppExport = {
  appName: "OptionPath";
  appVersion: string;
  schemaVersion: number;
  exportedAt: string;
  data: {
    userProgress: UserProgress[];
    simulatedTrades: SimulatedTrade[];
    simulatedTradeLegs: SimulatedTradeLeg[];
    journalEntries: JournalEntry[];
    quizAttempts: QuizAttempt[];
    watchlists: WatchlistItem[];
    riskAcknowledgements: RiskAcknowledgement[];
    appSettings: AppSettings[];
  };
};

export async function buildAppExport(): Promise<AppExport> {
  const [
    userProgress,
    simulatedTrades,
    simulatedTradeLegs,
    journalEntries,
    quizAttempts,
    watchlists,
    riskAcknowledgements,
    appSettings,
  ] = await Promise.all([
    db.userProgress.toArray(),
    db.simulatedTrades.toArray(),
    db.simulatedTradeLegs.toArray(),
    db.journalEntries.toArray(),
    db.quizAttempts.toArray(),
    db.watchlists.toArray(),
    db.riskAcknowledgements.toArray(),
    db.appSettings.toArray(),
  ]);

  return {
    appName: "OptionPath",
    appVersion: "0.1.0",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data: {
      userProgress,
      simulatedTrades,
      simulatedTradeLegs,
      journalEntries,
      quizAttempts,
      watchlists,
      riskAcknowledgements,
      appSettings,
    },
  };
}

export function validateAppExport(value: unknown): value is AppExport {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AppExport>;
  const data = candidate.data as Partial<AppExport["data"]> | undefined;

  return (
    candidate.appName === "OptionPath" &&
    candidate.schemaVersion === 1 &&
    Boolean(data) &&
    Array.isArray(data?.userProgress) &&
    Array.isArray(data?.simulatedTrades) &&
    Array.isArray(data?.simulatedTradeLegs) &&
    Array.isArray(data?.journalEntries) &&
    Array.isArray(data?.quizAttempts) &&
    Array.isArray(data?.watchlists) &&
    Array.isArray(data?.riskAcknowledgements) &&
    Array.isArray(data?.appSettings)
  );
}

export async function importAppExport(appExport: AppExport, mode: "merge" | "replace") {
  await db.transaction(
    "rw",
    [
      db.userProgress,
      db.simulatedTrades,
      db.simulatedTradeLegs,
      db.journalEntries,
      db.quizAttempts,
      db.watchlists,
      db.riskAcknowledgements,
      db.appSettings,
    ],
    async () => {
      if (mode === "replace") {
        await Promise.all([
          db.userProgress.clear(),
          db.simulatedTrades.clear(),
          db.simulatedTradeLegs.clear(),
          db.journalEntries.clear(),
          db.quizAttempts.clear(),
          db.watchlists.clear(),
          db.riskAcknowledgements.clear(),
        ]);
      }

      await Promise.all([
        db.userProgress.bulkPut(appExport.data.userProgress),
        db.simulatedTrades.bulkPut(appExport.data.simulatedTrades),
        db.simulatedTradeLegs.bulkPut(appExport.data.simulatedTradeLegs),
        db.journalEntries.bulkPut(appExport.data.journalEntries),
        db.quizAttempts.bulkPut(appExport.data.quizAttempts),
        db.watchlists.bulkPut(appExport.data.watchlists),
        db.riskAcknowledgements.bulkPut(appExport.data.riskAcknowledgements),
        db.appSettings.bulkPut(appExport.data.appSettings),
      ]);
    },
  );

  await initializeDatabase();
}

export async function resetUserData() {
  await db.transaction(
    "rw",
    [
      db.userProgress,
      db.simulatedTrades,
      db.simulatedTradeLegs,
      db.journalEntries,
      db.quizAttempts,
      db.watchlists,
      db.riskAcknowledgements,
    ],
    async () => {
      await Promise.all([
        db.userProgress.clear(),
        db.simulatedTrades.clear(),
        db.simulatedTradeLegs.clear(),
        db.journalEntries.clear(),
        db.quizAttempts.clear(),
        db.watchlists.clear(),
        db.riskAcknowledgements.clear(),
      ]);
    },
  );

  await initializeDatabase();
}

