import type { GameState } from '../state/types'
import { STOCKS, STOCK_VOLATILITY, type StockId } from '../data/stocks'

const HOUSING_RENT: Record<string, number> = {
  apartment_basic: 150,
  apartment_nice:  300,
}

const BANK_INTEREST_RATE = 0.02   // 2% weekly on savings
const DEBT_INTEREST_RATE = 0.05   // 5% weekly on debt

function log(state: GameState, msg: string): GameState {
  const eventLog = [...state.eventLog, msg].slice(-20)
  return { ...state, eventLog }
}

export function applyWeeklyEconomy(state: GameState): GameState {
  let s = state
  const entries: string[] = []

  // --- Rent ---
  const rent = HOUSING_RENT[s.player.housingId] ?? 0
  if (rent > 0) {
    if (s.player.money >= rent) {
      s = { ...s, player: { ...s.player, money: s.player.money - rent } }
    } else {
      const cashAvail = s.player.money
      const bankNeeded = rent - cashAvail
      if (s.player.bankBalance >= bankNeeded) {
        s = { ...s, player: { ...s.player, money: 0, bankBalance: s.player.bankBalance - bankNeeded } }
      } else {
        // Can't cover rent — add shortfall to debt, drain all cash/bank
        const shortfall = rent - cashAvail - s.player.bankBalance
        s = { ...s, player: { ...s.player, money: 0, bankBalance: 0, debt: s.player.debt + shortfall } }
        entries.push(`Missed rent! Debt +$${shortfall.toFixed(0)}`)
      }
    }
    entries.push(`Rent -$${rent}`)
  }

  // --- Bank interest on savings ---
  if (s.player.bankBalance > 0) {
    const interest = Math.floor(s.player.bankBalance * BANK_INTEREST_RATE)
    if (interest > 0) {
      s = { ...s, player: { ...s.player, bankBalance: s.player.bankBalance + interest } }
      entries.push(`Interest +$${interest}`)
    }
  }

  // --- Debt interest ---
  if (s.player.debt > 0) {
    const interest = Math.ceil(s.player.debt * DEBT_INTEREST_RATE)
    s = { ...s, player: { ...s.player, debt: s.player.debt + interest } }
    entries.push(`Debt interest +$${interest}`)
  }

  // --- Stock price changes ---
  s = tickStockPrices(s)

  // --- Weekly summary log entry ---
  if (entries.length > 0) {
    s = log(s, `Wk${s.calendar.week}: ${entries.join(' | ')}`)
  }

  return s
}

function tickStockPrices(state: GameState): GameState {
  const newPrices: Record<string, number> = { ...state.economy.stockPrices }
  const newHistory: Record<string, number[]> = { ...state.economy.stockHistory }

  for (const stock of STOCKS) {
    const vol = STOCK_VOLATILITY[stock as StockId]
    const current = newPrices[stock] ?? 0
    const swing = current * vol * (Math.random() * 2 - 1)
    const newPrice = Math.max(1, Math.round((current + swing) * 100) / 100)
    newHistory[stock] = [...(newHistory[stock] ?? []), current].slice(-8)
    newPrices[stock] = newPrice
  }

  return { ...state, economy: { ...state.economy, stockPrices: newPrices, stockHistory: newHistory } }
}
