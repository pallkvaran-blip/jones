import type { GameState } from '../state/types'
import { ALL_LIFE_EVENTS, type LifeEvent, type StatDelta } from '../data/lifeEvents'

function isOnCooldown(id: string, state: GameState): boolean {
  return state.activeEvents.some(e => e.id === id && e.expiresWeek > state.calendar.week)
}

export function rollLifeEvent(state: GameState): LifeEvent | null {
  const eligible = ALL_LIFE_EVENTS.filter(e => e.canFire(state) && !isOnCooldown(e.id, state))
  if (eligible.length === 0) return null

  // ~40% chance of no event this week
  const noEventWeight = 60
  const totalWeight = eligible.reduce((s, e) => s + e.weight, 0) + noEventWeight
  let roll = Math.random() * totalWeight
  if (roll < noEventWeight) return null
  roll -= noEventWeight

  for (const event of eligible) {
    roll -= event.weight
    if (roll <= 0) return event
  }
  return eligible[eligible.length - 1]
}

function applyDelta(state: GameState, delta: StatDelta, logMsg: string): GameState {
  const p = state.player
  const cap = (v: number, max = 100) => Math.min(max, Math.max(0, v))
  const newPlayer = {
    ...p,
    money: delta.money != null ? Math.max(0, p.money + delta.money) : p.money,
    bankBalance: delta.bankBalance != null ? p.bankBalance + delta.bankBalance : p.bankBalance,
    health: delta.health != null ? cap(p.health + delta.health) : p.health,
    morale: delta.morale != null ? cap(p.morale + delta.morale) : p.morale,
    hunger: delta.hunger != null ? cap(p.hunger + delta.hunger) : p.hunger,
    energy: delta.energy != null ? cap(p.energy + delta.energy) : p.energy,
    creditScore: delta.creditScore != null ? cap(p.creditScore + delta.creditScore) : p.creditScore,
    jobId: delta.clearJob ? null : p.jobId,
    careerTrack: delta.clearJob ? null : p.careerTrack,
    jobRank: delta.clearJob ? 0 : p.jobRank,
  }
  const newEventLog = [logMsg, ...(state.eventLog ?? [])].slice(0, 30)
  return { ...state, player: newPlayer, eventLog: newEventLog }
}

function recordCooldown(event: LifeEvent, state: GameState): GameState {
  const filtered = state.activeEvents.filter(e => e.id !== event.id && e.expiresWeek > state.calendar.week)
  return {
    ...state,
    activeEvents: [
      ...filtered,
      { id: event.id, chainStep: 0, expiresWeek: state.calendar.week + event.cooldownWeeks, payload: {} },
    ],
  }
}

export function applyImmediateEvent(event: LifeEvent, state: GameState): GameState {
  let next = applyDelta(state, event.immediateDelta ?? {}, event.immediateLog ?? event.title)
  next = recordCooldown(event, next)
  next = { ...next, pendingLifeEventId: null }
  return next
}

export function resolveEventChoice(event: LifeEvent, choiceIndex: number, state: GameState): GameState {
  const choice = event.choices![choiceIndex]
  let delta = choice.delta
  let logMsg = choice.logMsg
  if (choice.randomWin && Math.random() < 0.5) {
    delta = choice.randomWin.delta
    logMsg = choice.randomWin.logMsg
  }
  let next = applyDelta(state, delta, logMsg)
  next = recordCooldown(event, next)
  next = { ...next, pendingLifeEventId: null }
  return next
}
