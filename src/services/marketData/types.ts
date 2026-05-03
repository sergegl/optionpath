export type MarketDataProviderId = "manual" | "mock";

export type MarketDataFreshness = "manual" | "mock" | "unknown";

export type SymbolSearchResult = {
  symbol: string;
  name: string;
  exchange: string;
  assetType: "stock" | "etf";
};

export type UnderlyingQuote = {
  id: string;
  symbol: string;
  name?: string;
  lastPrice: number;
  bid?: number;
  ask?: number;
  previousClose?: number;
  change?: number;
  changePercent?: number;
  provider: MarketDataProviderId;
  dataStatus: MarketDataFreshness;
  fetchedAt: string;
  providerTimestamp?: string;
};

export type MarketDataProvider = {
  id: MarketDataProviderId;
  label: string;
  searchSymbols(query: string): Promise<SymbolSearchResult[]>;
  getQuote(symbol: string): Promise<UnderlyingQuote>;
};
