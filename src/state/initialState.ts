import type { GameState, Difficulty, CareerTrack } from './types'

export function createInitialState(name: string, difficulty: Difficulty): GameState {
  const difficultySettings = {
    easy:   { money: 1500, maxWeeks: 30 },
    normal: { money: 750,  maxWeeks: 24 },
    hard:   { money: 250,  maxWeeks: 20 },
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
      money: settings.money,
      hunger: 80,
      energy: 80,
      health: 80,
      morale: 80,
      jobId: null,
      careerTrack: null,
      jobPerformance: 0,
      jobTenure: 0,
      experience,
      education: 0,
      bankBalance: 0,
      debt: 0,
      creditScore: 650,
      portfolio: {},
      housingId: 'apartment_basic',
      isOwner: false,
      propertyValue: 0,
      wardrobe: 1,
      hasComputer: false,
      hasTransport: false,
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
      stockPrices: {},
      stockHistory: {},
    },
    goals: {
      targetWealth: 50000,
      targetEducation: 3,
      targetCareerRank: 3,
      targetHappiness: 70,
    },
    goalsMet: {
      targetWealth: false,
      targetEducation: false,
      targetCareerRank: false,
      targetHappiness: false,
    },
    activeEvents: [],
    eventLog: [],
    currentLocationId: 'home',
    difficulty,
    isGameOver: false,
    winCondition: null,
    lossReason: null,
  };
}
