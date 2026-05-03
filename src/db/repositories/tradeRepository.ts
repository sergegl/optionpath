import type { JournalEntry, SimulatedTrade, SimulatedTradeLeg, StrategyTemplate, TradeStatus } from "../types";
import { db } from "../dexie";

export type TradeSummary = SimulatedTrade & {
  strategy?: StrategyTemplate;
  journalEntryCount: number;
};

export type TradeDetail = {
  trade: SimulatedTrade;
  legs: SimulatedTradeLeg[];
  journalEntries: JournalEntry[];
  strategy?: StrategyTemplate;
};

export async function saveSimulatedTrade(input: {
  strategyId: string;
  symbol: string;
  underlyingPrice: number;
  status: TradeStatus;
  legs: Array<Omit<SimulatedTradeLeg, "id" | "tradeId">>;
  thesis?: string;
  exitPlan?: string;
}) {
  const now = new Date().toISOString();
  const tradeId = `trade-${crypto.randomUUID()}`;

  const trade: SimulatedTrade = {
    id: tradeId,
    strategyId: input.strategyId,
    symbol: input.symbol.trim().toUpperCase(),
    underlyingPrice: input.underlyingPrice,
    status: input.status,
    entryNotes: input.thesis,
    createdAt: now,
    updatedAt: now,
  };

  const legs: SimulatedTradeLeg[] = input.legs.map((leg, index) => ({
    ...leg,
    id: `trade-leg-${tradeId}-${index + 1}`,
    tradeId,
  }));

  const journalEntries: JournalEntry[] = [];

  if (input.thesis) {
    journalEntries.push({
      id: `journal-${tradeId}-thesis`,
      tradeId,
      type: "thesis",
      body: input.thesis,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (input.exitPlan) {
    journalEntries.push({
      id: `journal-${tradeId}-exit`,
      tradeId,
      type: "exit_plan",
      body: input.exitPlan,
      createdAt: now,
      updatedAt: now,
    });
  }

  await db.transaction("rw", [db.simulatedTrades, db.simulatedTradeLegs, db.journalEntries], async () => {
    await db.simulatedTrades.add(trade);
    await db.simulatedTradeLegs.bulkAdd(legs);

    if (journalEntries.length) {
      await db.journalEntries.bulkAdd(journalEntries);
    }
  });

  return tradeId;
}

export async function getBuilderSeedData() {
  const [strategies, templateLegs, watchlist] = await Promise.all([
    db.strategyTemplates.toArray(),
    db.strategyTemplateLegs.toArray(),
    db.watchlists.orderBy("symbol").toArray(),
  ]);

  return { strategies, templateLegs, watchlist };
}

export async function getJournalTrades(): Promise<TradeSummary[]> {
  const [trades, strategies, journalEntries] = await Promise.all([
    db.simulatedTrades.orderBy("updatedAt").reverse().toArray(),
    db.strategyTemplates.toArray(),
    db.journalEntries.toArray(),
  ]);
  const strategiesById = new Map(strategies.map((strategy) => [strategy.id, strategy]));
  const journalCountByTrade = journalEntries.reduce((map, entry) => {
    map.set(entry.tradeId, (map.get(entry.tradeId) ?? 0) + 1);
    return map;
  }, new Map<string, number>());

  return trades.map((trade) => ({
    ...trade,
    strategy: strategiesById.get(trade.strategyId),
    journalEntryCount: journalCountByTrade.get(trade.id) ?? 0,
  }));
}

export async function getTradeDetail(tradeId: string): Promise<TradeDetail | null> {
  const trade = await db.simulatedTrades.get(tradeId);
  if (!trade) return null;

  const [legs, journalEntries, strategy] = await Promise.all([
    db.simulatedTradeLegs.where("tradeId").equals(tradeId).toArray(),
    db.journalEntries.where("tradeId").equals(tradeId).toArray(),
    db.strategyTemplates.get(trade.strategyId),
  ]);

  return {
    trade,
    legs,
    journalEntries: journalEntries.sort((left, right) => left.createdAt.localeCompare(right.createdAt)),
    strategy,
  };
}

export async function upsertJournalEntry(input: {
  tradeId: string;
  type: JournalEntry["type"];
  body: string;
}) {
  const now = new Date().toISOString();
  const existing = await db.journalEntries
    .where("tradeId")
    .equals(input.tradeId)
    .filter((entry) => entry.type === input.type)
    .first();
  const entry: JournalEntry = {
    id: existing?.id ?? `journal-${input.tradeId}-${input.type}`,
    tradeId: input.tradeId,
    type: input.type,
    body: input.body,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await db.transaction("rw", [db.journalEntries, db.simulatedTrades], async () => {
    await db.journalEntries.put(entry);
    const trade = await db.simulatedTrades.get(input.tradeId);
    if (trade) {
      await db.simulatedTrades.put({ ...trade, updatedAt: now });
    }
  });

  return entry;
}

export async function updateTradeStatus(tradeId: string, status: TradeStatus) {
  const trade = await db.simulatedTrades.get(tradeId);
  if (!trade) return null;

  const updated = { ...trade, status, updatedAt: new Date().toISOString() };
  await db.simulatedTrades.put(updated);
  return updated;
}

export async function deleteTrade(tradeId: string) {
  await db.transaction("rw", [db.simulatedTrades, db.simulatedTradeLegs, db.journalEntries], async () => {
    await db.simulatedTrades.delete(tradeId);
    await db.simulatedTradeLegs.where("tradeId").equals(tradeId).delete();
    await db.journalEntries.where("tradeId").equals(tradeId).delete();
  });
}
