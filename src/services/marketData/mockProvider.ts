import type { MarketDataProvider, SymbolSearchResult, UnderlyingQuote } from "./types";

type MockSymbol = SymbolSearchResult & {
  quote: {
    lastPrice: number;
    bid: number;
    ask: number;
    previousClose: number;
  };
};

const mockSymbols: MockSymbol[] = [
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    exchange: "NYSE Arca",
    assetType: "etf",
    quote: { lastPrice: 523.42, bid: 523.36, ask: 523.48, previousClose: 520.18 },
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    assetType: "stock",
    quote: { lastPrice: 193.18, bid: 193.12, ask: 193.24, previousClose: 190.96 },
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    assetType: "stock",
    quote: { lastPrice: 421.06, bid: 420.92, ask: 421.18, previousClose: 416.5 },
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    assetType: "stock",
    quote: { lastPrice: 912.4, bid: 912.05, ask: 912.72, previousClose: 898.32 },
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    assetType: "stock",
    quote: { lastPrice: 186.64, bid: 186.5, ask: 186.79, previousClose: 181.22 },
  },
];

export const mockMarketDataProvider: MarketDataProvider = {
  id: "mock",
  label: "Mock sample data",
  async searchSymbols(query) {
    return searchMockSymbols(query);
  },
  async getQuote(symbol) {
    return getMockQuote(symbol);
  },
};

export function searchMockSymbols(query: string) {
  const normalized = normalizeSymbol(query);

  if (!normalized) {
    return mockSymbols.map(stripQuote);
  }

  return mockSymbols
    .filter((item) => {
      const searchable = `${item.symbol} ${item.name}`.toLowerCase();
      return searchable.includes(normalized.toLowerCase());
    })
    .map(stripQuote);
}

export function getMockQuote(symbol: string): UnderlyingQuote {
  const normalized = normalizeSymbol(symbol);
  const match = mockSymbols.find((item) => item.symbol === normalized);

  if (!match) {
    throw new Error(`No mock quote is available for ${normalized || "that symbol"}.`);
  }

  const change = roundPrice(match.quote.lastPrice - match.quote.previousClose);
  const changePercent = roundPrice((change / match.quote.previousClose) * 100);

  return {
    id: `mock-${match.symbol}`,
    symbol: match.symbol,
    name: match.name,
    lastPrice: match.quote.lastPrice,
    bid: match.quote.bid,
    ask: match.quote.ask,
    previousClose: match.quote.previousClose,
    change,
    changePercent,
    provider: "mock",
    dataStatus: "mock",
    fetchedAt: new Date().toISOString(),
  };
}

export function createManualQuote(symbol: string, lastPrice: number): UnderlyingQuote {
  const normalized = normalizeSymbol(symbol);

  return {
    id: `manual-${normalized || "symbol"}`,
    symbol: normalized || "CUSTOM",
    lastPrice,
    provider: "manual",
    dataStatus: "manual",
    fetchedAt: new Date().toISOString(),
  };
}

function stripQuote(item: MockSymbol): SymbolSearchResult {
  return {
    symbol: item.symbol,
    name: item.name,
    exchange: item.exchange,
    assetType: item.assetType,
  };
}

function normalizeSymbol(symbol: string) {
  return symbol.trim().toUpperCase().replace(/[^A-Z.]/g, "").slice(0, 8);
}

function roundPrice(value: number) {
  return Math.round(value * 100) / 100;
}
