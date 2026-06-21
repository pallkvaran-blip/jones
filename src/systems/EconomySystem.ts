import type { GameState } from '../state/types'
import { STOCKS, STOCK_VOLATILITY, STOCK_DRIFT, type StockId } from '../data/stocks'

const BANK_INTEREST_RATE = 0.02
const DEBT_INTEREST_RATE = 0.05

function log(state: GameState, msg: string): GameState {
  const eventLog = [...state.eventLog, msg].slice(-20)
  return { ...state, eventLog }
}

export function applyWeeklyEconomy(state: GameState): GameState {
  let s = state
  const entries: string[] = []

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

  // --- Loan overdue escalation ---
  if (s.player.debt > 0 && s.player.loanWeekTaken !== null && !s.isGameOver) {
    const dueWeek = s.player.loanWeekTaken + 4
    const weeksOverdue = s.calendar.week - dueWeek

    if (weeksOverdue >= 4) {
      s = { ...s, isGameOver: true, winCondition: 'lost', lossReason: 'Your loan defaulted. The debt collectors took everything.' }
    } else if (weeksOverdue === 3) {
      s = {
        ...s,
        player: {
          ...s.player,
          money: Math.max(0, s.player.money - 150),
          morale: Math.max(0, s.player.morale - 30),
          creditScore: Math.max(0, s.player.creditScore - 50),
        },
        pendingLifeEventId: 'loan_final_warning',
      }
      entries.push('FINAL WARNING — loan default next week!')
    } else if (weeksOverdue === 2) {
      s = {
        ...s,
        player: {
          ...s.player,
          money: Math.max(0, s.player.money - 100),
          morale: Math.max(0, s.player.morale - 20),
          creditScore: Math.max(0, s.player.creditScore - 30),
        },
        pendingLifeEventId: 'loan_overdue_2',
      }
      entries.push('Loan 2nd notice — $100 penalty')
    } else if (weeksOverdue === 1) {
      s = {
        ...s,
        player: {
          ...s.player,
          money: Math.max(0, s.player.money - 50),
          morale: Math.max(0, s.player.morale - 10),
          creditScore: Math.max(0, s.player.creditScore - 20),
        },
        pendingLifeEventId: 'loan_overdue_1',
      }
      entries.push('Loan overdue — $50 penalty')
    }
  }

  // --- Smart TV weekly morale ---
  if (s.player.hasTV) {
    s = { ...s, player: { ...s.player, morale: Math.min(100, s.player.morale + 8) } }
    entries.push('Smart TV +8 morale')
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
    const drift = current * (STOCK_DRIFT[stock as StockId] ?? 0)
    const swing = current * vol * (Math.random() * 2 - 1)
    const newPrice = Math.max(1, Math.round((current + drift + swing) * 100) / 100)
    newHistory[stock] = [...(newHistory[stock] ?? []), current].slice(-8)
    newPrices[stock] = newPrice
  }

  return { ...state, economy: { ...state.economy, stockPrices: newPrices, stockHistory: newHistory } }
}
