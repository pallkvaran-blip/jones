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

  let weekState: GameState = {
    ...state,
    calendar: { ...state.calendar, week: newWeek, day: 1, timeUnits: 100, season },
  };

  weekState = applyWeeklyEconomy(weekState);

  // Job performance warning / demotion / firing check (no decay — performance is event-driven)
  const p = weekState.player;
  if (p.jobId !== null) {
    if (p.jobPerformance < 30) {
      const newWarningWeeks = p.jobWarningWeeks + 1;
      if (newWarningWeeks >= 2) {
        // Demote or fire
        if (p.jobRank > 1) {
          weekState = {
            ...weekState,
            player: {
              ...weekState.player,
              jobRank: p.jobRank - 1,
              jobTenure: 0,
              jobWarningWeeks: 0,
              jobPerformance: 50,
            },
            pendingLifeEventId: weekState.pendingLifeEventId ?? 'job_demotion',
          };
        } else {
          weekState = {
            ...weekState,
            player: {
              ...weekState.player,
              jobId: null,
              careerTrack: null,
              jobRank: 0,
              jobTenure: 0,
              jobWarningWeeks: 0,
              jobPerformance: 0,
            },
            pendingLifeEventId: weekState.pendingLifeEventId ?? 'job_fired',
          };
        }
      } else {
        weekState = {
          ...weekState,
          player: { ...weekState.player, jobWarningWeeks: newWarningWeeks },
          pendingLifeEventId: weekState.pendingLifeEventId ?? 'performance_warning',
        };
      }
    } else {
      // Performance is acceptable — reset warning counter
      weekState = {
        ...weekState,
        player: { ...weekState.player, jobWarningWeeks: 0 },
      };
    }
  }

  // Roll a random life event only if no performance event is pending
  if (weekState.pendingLifeEventId === null) {
    const event = rollLifeEvent(weekState);
    if (event) {
      weekState = { ...weekState, pendingLifeEventId: event.id };
    }
  }

  return weekState;
}
