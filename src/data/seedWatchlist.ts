import type { WatchlistItem } from "../db/types";

const now = "2026-05-02T00:00:00.000Z";

export const seedWatchlist: WatchlistItem[] = [
  {
    id: "watchlist-spy",
    symbol: "SPY",
    label: "S&P 500 ETF sample",
    createdAt: now,
  },
  {
    id: "watchlist-qqq",
    symbol: "QQQ",
    label: "Nasdaq 100 ETF sample",
    createdAt: now,
  },
  {
    id: "watchlist-aapl",
    symbol: "AAPL",
    label: "Large-cap stock sample",
    createdAt: now,
  },
];

