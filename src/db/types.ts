export type LearningLevel = "beginner" | "intermediate" | "advanced";
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type TradeStatus = "draft" | "open" | "closed" | "expired";
export type StrategyOutlook = "bullish" | "bearish" | "neutral" | "volatile" | "hedge";
export type StrategyRiskType =
  | "defined"
  | "premium"
  | "stock_backed"
  | "cash_backed"
  | "undefined";

export type EntityBase = {
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export type Tutorial = {
  id: string;
  title: string;
  level: LearningLevel;
  summary: string;
  order: number;
};

export type Lesson = {
  id: string;
  tutorialId: string;
  level: LearningLevel;
  title: string;
  summary: string;
  estimatedMinutes: number;
  order: number;
  requiredAcknowledgementContext?: string;
};

export type LessonStep = {
  id: string;
  lessonId: string;
  order: number;
  type: "concept" | "example" | "interactive" | "checkpoint" | "quiz" | "summary";
  title: string;
  body: string;
  payload?: unknown;
};

export type UserProgress = EntityBase & {
  lessonId: string;
  status: ProgressStatus;
  completedStepIds: string[];
  score?: number;
};

export type StrategyTemplate = {
  id: string;
  name: string;
  slug: string;
  level: LearningLevel;
  category: "directional" | "income" | "hedge" | "volatility";
  outlook: StrategyOutlook;
  riskType: StrategyRiskType;
  tradeStyle: "debit" | "credit" | "stock_plus_option" | "multi_leg";
  summary: string;
  useCase: string;
  maxProfitText: string;
  maxLossText: string;
  breakevenText: string;
  assignmentRisk: "none" | "possible" | "material";
  requiredAcknowledgementContext?: string;
  lessonId?: string;
};

export type StrategyTemplateLeg = {
  id: string;
  strategyId: string;
  action: "buy" | "sell";
  type: "call" | "put" | "stock";
  role: string;
  quantity: number;
};

export type SimulatedTrade = EntityBase & {
  strategyId: string;
  symbol: string;
  underlyingPrice: number;
  status: TradeStatus;
  entryNotes?: string;
};

export type SimulatedTradeLeg = {
  id: string;
  tradeId: string;
  action: "buy" | "sell";
  type: "call" | "put" | "stock";
  quantity: number;
  strike?: number;
  premium?: number;
  price?: number;
  expiration?: string;
};

export type JournalEntry = EntityBase & {
  tradeId: string;
  type: "thesis" | "risk_plan" | "exit_plan" | "adjustment" | "result" | "reflection";
  body: string;
};

export type QuizAttempt = EntityBase & {
  lessonId: string;
  score: number;
  questionResults: Array<{
    questionId: string;
    selectedChoiceIds: string[];
    correct: boolean;
  }>;
};

export type WatchlistItem = EntityBase & {
  symbol: string;
  label?: string;
};

export type RiskAcknowledgement = EntityBase & {
  context:
    | "advanced_strategies"
    | "short_options"
    | "assignment_risk"
    | "undefined_risk"
    | "simplified_model"
    | "simulated_data";
  strategyId?: string;
  lessonId?: string;
  acceptedTextVersion: string;
};

export type AppSettings = {
  id: string;
  hasCompletedSeed: boolean;
  lastOpenedAt?: string;
  lastDashboardVisitAt?: string;
};
