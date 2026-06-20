export const STOCKS = ['TECH', 'INDX', 'BOND'] as const
export type StockId = typeof STOCKS[number]

export const STOCK_NAMES: Record<StockId, string> = {
  TECH: 'Tech Sector',
  INDX: 'Index Fund',
  BOND: 'Gov. Bonds',
}

// Max weekly price swing as a fraction of current price
export const STOCK_VOLATILITY: Record<StockId, number> = {
  TECH: 0.22,  // high risk / high reward
  INDX: 0.08,  // moderate, tracks the market
  BOND: 0.02,  // stable, predictable
}

// Slight upward drift per week (+% of price added before random swing)
export const STOCK_DRIFT: Record<StockId, number> = {
  TECH: 0.01,  // slight growth tendency
  INDX: 0.005, // slow steady growth
  BOND: 0.008, // reliable yield
}

export const STOCK_INITIAL_PRICES: Record<StockId, number> = {
  TECH: 50,
  INDX: 80,
  BOND: 60,
}
