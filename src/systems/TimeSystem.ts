import type { GameState } from '../state/types'
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

  if (newDay > 7) {
    return advanceWeek(nextState);
  }

  return nextState;
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

  const weekState: GameState = {
    ...state,
    calendar: { ...state.calendar, week: newWeek, day: 1, timeUnits: 100, season },
  };

  let weeklyState = applyWeeklyEconomy(weekState);

  const event = rollLifeEvent(weeklyState)
  if (event) {
    weeklyState = { ...weeklyState, pendingLifeEventId: event.id }
  }

  return weeklyState;
}
