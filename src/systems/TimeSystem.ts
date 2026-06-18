import type { GameState, LocationId } from '../state/types'
import { applyWeeklyEconomy } from './EconomySystem'
import { getHousingTier } from '../data/housing'
import { rollLifeEvent } from './EventSystem'

export function consumeTime(state: GameState, units: number): GameState {
  const newUnits = state.calendar.timeUnits - units;

  if (newUnits > 0) {
    return {
      ...state,
      calendar: {
        ...state.calendar,
        timeUnits: newUnits,
      },
    };
  }

  // Time ran out for this day — advance the day
  return advanceDay(state);
}

export function advanceDay(state: GameState): GameState {
  // Only penalise sleeping rough if energy ran out — otherwise just move home
  if (state.currentLocationId !== 'home') {
    if (state.player.energy <= 0 && !state.pendingLifeEventId) {
      state = {
        ...state,
        currentLocationId: 'home' as LocationId,
        pendingLifeEventId: 'slept_on_street',
      }
    } else {
      state = { ...state, currentLocationId: 'home' as LocationId }
    }
  }

  let newDay = state.calendar.day + 1;
  const newTimeUnits = 100;

  const energyBonus = getHousingTier(state.player.housingId)?.dayEnergyBonus ?? 0;

  const updatedPlayer = {
    ...state.player,
    morale: Math.max(0, state.player.morale - 5),
    hunger: Math.max(0, state.player.hunger - 20),
    energy: Math.min(100, Math.max(0, state.player.energy - 5 + energyBonus)),
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

  if (newDay > 7) {
    return advanceWeek(finalState);
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
      winCondition: 'lost',
      lossReason: 'Time has run out!',
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

  // Roll a random life event
  if (weekState.pendingLifeEventId === null) {
    const event = rollLifeEvent(weekState);
    if (event) {
      weekState = { ...weekState, pendingLifeEventId: event.id };
    }
  }

  // 2-player: trigger turn handoff when a week completes
  if (weekState.numPlayers === 2 && !weekState.isGameOver && !weekState.pendingTurnHandoff) {
    weekState = { ...weekState, pendingTurnHandoff: true };
  }

  return weekState;
}
