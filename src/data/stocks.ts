export const STOCKS = ['TECH', 'FOOD', 'PROP', 'HLTH'] as const
export type StockId = typeof STOCKS[number]

export const STOCK_NAMES: Record<StockId, string> = {
  TECH: 'TechCorp',
  FOOD: 'FoodEx',
  PROP: 'PropCity',
  HLTH: 'HealthPlus',
}

// Max weekly price swing as a fraction of current price
export const STOCK_VOLATILITY: Record<StockId, number> = {
  TECH: 0.18,
  FOOD: 0.05,
  PROP: 0.10,
  HLTH: 0.08,
}

export const STOCK_INITIAL_PRICES: Record<StockId, number> = {
  TECH: 120,
  FOOD: 45,
  PROP: 80,
  HLTH: 65,
}
