import Dexie, { type EntityTable } from "dexie";
import type {
  AppSettings,
  JournalEntry,
  Lesson,
  LessonStep,
  QuizAttempt,
  RiskAcknowledgement,
  SimulatedTrade,
  SimulatedTradeLeg,
  StrategyTemplate,
  StrategyTemplateLeg,
  Tutorial,
  UserProgress,
  WatchlistItem,
} from "./types";

export class OptionPathDatabase extends Dexie {
  tutorials!: EntityTable<Tutorial, "id">;
  lessons!: EntityTable<Lesson, "id">;
  lessonSteps!: EntityTable<LessonStep, "id">;
  userProgress!: EntityTable<UserProgress, "id">;
  strategyTemplates!: EntityTable<StrategyTemplate, "id">;
  strategyTemplateLegs!: EntityTable<StrategyTemplateLeg, "id">;
  simulatedTrades!: EntityTable<SimulatedTrade, "id">;
  simulatedTradeLegs!: EntityTable<SimulatedTradeLeg, "id">;
  journalEntries!: EntityTable<JournalEntry, "id">;
  quizAttempts!: EntityTable<QuizAttempt, "id">;
  watchlists!: EntityTable<WatchlistItem, "id">;
  riskAcknowledgements!: EntityTable<RiskAcknowledgement, "id">;
  appSettings!: EntityTable<AppSettings, "id">;

  constructor() {
    super("optionpath-local");

    this.version(1).stores({
      tutorials: "id, level, order",
      lessons: "id, tutorialId, level, order",
      lessonSteps: "id, lessonId, order",
      userProgress: "id, lessonId, status, updatedAt",
      strategyTemplates: "id, level, category, outlook, riskType",
      strategyTemplateLegs: "id, strategyId, action, type",
      simulatedTrades: "id, strategyId, symbol, status, createdAt, updatedAt",
      simulatedTradeLegs: "id, tradeId, action, type, strike, expiration",
      journalEntries: "id, tradeId, createdAt, updatedAt",
      quizAttempts: "id, lessonId, createdAt",
      watchlists: "id, symbol, createdAt",
      riskAcknowledgements: "id, context, createdAt",
      appSettings: "id",
    });
  }
}

export const db = new OptionPathDatabase();

