import type { GameState, Difficulty, CareerTrack } from './types'
import { STOCK_INITIAL_PRICES, STOCKS } from '../data/stocks'

export function createInitialState(name: string, difficulty: Difficulty, characterId = 'player_alex'): GameState {
  const difficultySettings = {
    short:  { money: 0, maxWeeks: 4  },
    medium: { money: 0, maxWeeks: 8  },
    long:   { money: 0, maxWeeks: 12 },
  };

  const settings = difficultySettings[difficulty];

  const careerTracks: CareerTrack[] = ['trades', 'tech', 'finance', 'healthcare', 'creative'];
  const experience = careerTracks.reduce((acc, track) => {
    acc[track] = 0;
    return acc;
  }, {} as Record<CareerTrack, number>);

  return {
    player: {
      name,
      characterId,
      money: settings.money,
      hunger: 80,
      energy: 80,
      health: 80,
      morale: 80,
      jobId: null,
      careerTrack: null,
      jobTenure: 0,
      jobRank: 0,
      experience,
      education: 0,
      bankBalance: 0,
      debt: 0,
      creditScore: 650,
      loanWeekTaken: null,
      portfolio: {},
      housingId: 'studio',
      isOwner: false,
      propertyValue: 0,
      wardrobe: 1,
      hasComputer: false,
      hasTransport: false,
      pets: [],
      completedCourses: [],
      isStarving: false,
      lowHealthWarned: false,
    },
    calendar: {
      week: 1,
      day: 1,
      timeUnits: 100,
      season: 'spring',
      maxWeeks: settings.maxWeeks,
    },
    economy: {
      inflationAccum: 0,
      taxRate: 0.25,
      marketPrices: {},
      stockPrices: Object.fromEntries(STOCKS.map(s => [s, STOCK_INITIAL_PRICES[s]])),
      stockHistory: Object.fromEntries(STOCKS.map(s => [s, []])),
    },
    activeEvents: [],
    eventLog: [],
    currentLocationId: 'home',
    difficulty,
    isGameOver: false,
    winCondition: null,
    lossReason: null,
    pendingLifeEventId: null,
    pendingWorkEventId: null,
    pendingWeekendEventId: null,
    pendingTurnHandoff: false,
    numPlayers: 1,
    activePlayer: 1,
    mapSeed: Math.floor(Math.random() * 0xffffffff),
  };
}
