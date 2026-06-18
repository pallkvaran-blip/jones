export type CareerTrack = 'trades' | 'tech' | 'finance' | 'healthcare' | 'creative';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Difficulty = 'short' | 'medium' | 'long';
export type LocationId = 'home' | 'employment' | 'university' | 'bank' | 'grocery' | 'electronics' | 'clothing' | 'restaurant' | 'pawn' | 'realty' | 'hospital' | 'stockexchange';

export interface Player {
  name: string;
  money: number;
  hunger: number;    // 0-100
  energy: number;   // 0-100
  health: number;   // 0-100
  morale: number;   // 0-100
  jobId: string | null;
  careerTrack: CareerTrack | null;
  jobTenure: number;
  experience: Record<CareerTrack, number>;
  education: number;
  bankBalance: number;
  debt: number;
  creditScore: number;
  portfolio: Record<string, number>;
  housingId: string;
  isOwner: boolean;
  propertyValue: number;
  wardrobe: number;
  hasComputer: boolean;
  hasTransport: boolean;
  jobRank: number;
  pets: string[];
  completedCourses: string[];
  isStarving: boolean;
  lowHealthWarned: boolean;
}

export interface Calendar {
  week: number;
  day: number;
  timeUnits: number;   // 0-100 per day
  season: Season;
  maxWeeks: number;
}

export interface Economy {
  inflationAccum: number;
  taxRate: number;
  marketPrices: Record<string, number>;
  stockPrices: Record<string, number>;
  stockHistory: Record<string, number[]>;
}

export interface Goals {
  targetWealth: number;
  targetEducation: number;
  targetCareerRank: number;
  targetHappiness: number;
}

export interface ActiveEvent {
  id: string;
  chainStep: number;
  expiresWeek: number;
  payload: Record<string, unknown>;
}

export interface GameState {
  player: Player;
  calendar: Calendar;
  economy: Economy;
  goals: Goals;
  goalsMet: Record<keyof Goals, boolean>;
  activeEvents: ActiveEvent[];
  eventLog: string[];
  currentLocationId: LocationId;
  difficulty: Difficulty;
  isGameOver: boolean;
  winCondition: 'won' | 'lost' | null;
  lossReason: string | null;
  pendingLifeEventId: string | null;
  pendingWorkEventId: string | null;
  pendingTurnHandoff: boolean;
  numPlayers: 1 | 2;
  activePlayer: 1 | 2;
}
