import type { GameState, LocationId } from '../state/types'
import { applyWeeklyEconomy } from './EconomySystem'
import { pickRandomWeekendEvent } from '../data/weekendEvents'
import { pickRoughNightEventId } from '../data/lifeEvents'

const HUNGER_PER_TIME_UNIT = 0.6

export function consumeTime(state: GameState, units: number): GameState {
  const stateWithHunger = {
    ...state,
    player: {
      ...state.player,
      hunger: Math.max(0, state.player.hunger - units * HUNGER_PER_TIME_UNIT),
    },
  }
  const newUnits = stateWithHunger.calendar.timeUnits - units;

  if (newUnits > 0) {
    let result: GameState = {
      ...stateWithHunger,
      calendar: { ...stateWithHunger.calendar, timeUnits: newUnits },
    };
    // Starvation onset mid-day: advanceDay won't run, so check here
    if (result.player.hunger <= 0 && !result.player.isStarving && !result.pendingLifeEventId && !result.isGameOver) {
      result = {
        ...result,
        player: { ...result.player, isStarving: true },
        pendingLifeEventId: 'starving_warning',
      }
    }
    return result;
  }

  // Time ran out for this day — advance the day
  return advanceDay(stateWithHunger);
}

/** When starving, each energy point spent also bleeds health and morale. */
export function applyStarvationEnergyDrain(prevEnergy: number, state: GameState): GameState {
  if (!state.player.isStarving) return state
  const lost = Math.max(0, prevEnergy - state.player.energy)
  if (lost === 0) return state
  const drain = Math.max(1, Math.floor(lost * 0.4))
  return {
    ...state,
    player: {
      ...state.player,
      health: Math.max(0, state.player.health - drain),
      morale: Math.max(0, state.player.morale - drain),
    },
  }
}

/** Call after any energy-depleting action/move. Triggers rough night if energy hit 0 away from home. */
export function applyEnergyCheck(state: GameState): GameState {
  if (
    state.player.energy <= 0 &&
    state.currentLocationId !== 'home' &&
    !state.isGameOver &&
    !state.pendingLifeEventId
  ) {
    return {
      ...state,
      currentLocationId: 'home' as LocationId,
      pendingLifeEventId: pickRoughNightEventId(),
    }
  }
  return state
}

export function advanceDay(state: GameState): GameState {
  if (state.currentLocationId !== 'home' && state.player.energy <= 0) {
    state = {
      ...state,
      currentLocationId: 'home' as LocationId,
      pendingLifeEventId: pickRoughNightEventId(),
    }
  }

  let newDay = state.calendar.day + 1;
  const newTimeUnits = 100;

  const coffeeMakerBonus = state.player.hasCoffeeMaker ? 10 : 0;
  const updatedPlayer = {
    ...state.player,
    morale: Math.max(0, state.player.morale - 5),
    energy: Math.min(100, Math.max(0, state.player.energy - 5) + coffeeMakerBonus),
    money: state.player.money + (state.player.hasComputer ? 50 : 0),
  };

  const nextState: GameState = {
    ...state,
    player: updatedPlayer,
    calendar: {
      ...state.calendar,
      day: newDay,
      timeUnits: newTimeUnits,
    },
  };

  // Starvation logic
  let finalState = nextState

  if (finalState.player.hunger <= 0) {
    if (!finalState.player.isStarving) {
      // First day of starvation — show warning
      finalState = {
        ...finalState,
        player: { ...finalState.player, isStarving: true },
        pendingLifeEventId: finalState.pendingLifeEventId ?? 'starving_warning',
      }
    } else {
      // Already starving — bleed health each day
      const newHealth = Math.max(0, finalState.player.health - 15)
      finalState = {
        ...finalState,
        player: { ...finalState.player, health: newHealth },
      }
    }
  } else if (finalState.player.isStarving) {
    // Eating again — clear starvation flag
    finalState = {
      ...finalState,
      player: { ...finalState.player, isStarving: false },
    }
  }

  // Low health warning (fires once when health first drops to/below 20)
  if (finalState.player.health <= 20 && finalState.player.health > 0 && !finalState.player.lowHealthWarned) {
    finalState = {
      ...finalState,
      player: { ...finalState.player, lowHealthWarned: true },
      pendingLifeEventId: finalState.pendingLifeEventId ?? 'low_health_warning',
    }
  }

  // Reset lowHealthWarned if health recovers above 30
  if (finalState.player.health > 30 && finalState.player.lowHealthWarned) {
    finalState = {
      ...finalState,
      player: { ...finalState.player, lowHealthWarned: false },
    }
  }

  // Death check — health hit 0
  if (finalState.player.health <= 0 && !finalState.isGameOver) {
    finalState = {
      ...finalState,
      isGameOver: true,
      winCondition: 'lost',
      lossReason: finalState.player.isStarving ? 'You starved to death.' : 'Your health failed.',
    }
  }

  if (newDay > 5) {
    // Pause for the weekend event; week advances when the player resolves it
    return {
      ...finalState,
      calendar: { ...finalState.calendar, day: 6 },
      pendingWeekendEventId: pickRandomWeekendEvent().id,
    };
  }

  return finalState;
}

export function advanceWeek(state: GameState): GameState {
  const newWeek = state.calendar.week + 1;

  if (newWeek > state.calendar.maxWeeks) {
    return {
      ...state,
      calendar: {
        ...state.calendar,
        day: 1,
        week: newWeek,
        timeUnits: 100,
      },
      isGameOver: true,
      winCondition: 'won',
      lossReason: null,
    };
  }

  // Advance season every 13 weeks
  let season = state.calendar.season;
  const seasons = ['spring', 'summer', 'fall', 'winter'] as const;
  const seasonIndex = Math.floor((newWeek - 1) / 13) % 4;
  season = seasons[seasonIndex];

  let weekState: GameState = {
    ...state,
    calendar: { ...state.calendar, week: newWeek, day: 1, timeUnits: 100, season },
  };

  weekState = applyWeeklyEconomy(weekState);

  // 2-player: trigger turn handoff when a week completes
  if (weekState.numPlayers === 2 && !weekState.isGameOver && !weekState.pendingTurnHandoff) {
    weekState = { ...weekState, pendingTurnHandoff: true };
  }

  return weekState;
}
