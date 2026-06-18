import type { CareerTrack, LocationId } from '../state/types'

export interface JobTier {
  rank: number;
  title: string;
  dailyPay: number;
  shiftsToPromote: number; // Infinity means no promotion
  educationRequired: number;
  wardrobeRequired: number;
}

export interface CareerDef {
  name: string;
  tiers: JobTier[];
}

export interface LocationJobDef {
  track: CareerTrack;
  titles: [string, string, string, string];
}

/** Maps each location to the career track and titles available there. */
export const LOCATION_JOBS: Partial<Record<LocationId, LocationJobDef>> = {
  employment:    { track: 'creative',   titles: ['Line Cook', 'Sous Chef', 'Head Chef', 'Exec. Chef'] },
  university:    { track: 'healthcare', titles: ['Tutor', 'Lecturer', 'Professor', 'Dept. Chair'] },
  bank:          { track: 'finance',    titles: ['Teller', 'Loan Officer', 'Asst. Mgr', 'Branch Mgr'] },
  grocery:       { track: 'trades',     titles: ['Stock Clerk', 'Cashier', 'Dept. Mgr', 'Store Mgr'] },
  electronics:   { track: 'tech',       titles: ['Support Tech', 'Developer', 'Senior Dev', 'Lead Eng.'] },
  clothing:      { track: 'creative',   titles: ['Sales Assoc', 'Buyer', 'Designer', 'Creative Dir'] },
  restaurant:    { track: 'creative',   titles: ['Busboy', 'Server', "Maitre'd", 'Rest. Mgr'] },
  pawn:          { track: 'finance',    titles: ['Sales Clerk', 'Buyer', 'Store Mgr', 'Owner'] },
  realty:        { track: 'finance',    titles: ['Agent', 'Sr. Agent', 'Broker', 'Principal'] },
  hospital:      { track: 'healthcare', titles: ['Orderly', 'Technician', 'Nurse', 'Doctor'] },
  stockexchange: { track: 'finance',    titles: ['Jr. Trader', 'Trader', 'Portfolio Mgr', 'Partner'] },
};

export const CAREER_JOBS: Record<CareerTrack, CareerDef> = {
  trades: {
    name: 'Construction',
    tiers: [
      { rank: 1, title: 'Laborer',     dailyPay: 90,  shiftsToPromote: 5,        educationRequired: 0, wardrobeRequired: 0 },
      { rank: 2, title: 'Apprentice',  dailyPay: 130, shiftsToPromote: 8,        educationRequired: 0, wardrobeRequired: 0 },
      { rank: 3, title: 'Journeyman',  dailyPay: 185, shiftsToPromote: 12,       educationRequired: 1, wardrobeRequired: 0 },
      { rank: 4, title: 'Foreman',     dailyPay: 260, shiftsToPromote: Infinity, educationRequired: 2, wardrobeRequired: 1 },
    ],
  },
  tech: {
    name: 'Tech',
    tiers: [
      { rank: 1, title: 'Jr. Dev',    dailyPay: 110, shiftsToPromote: 5,        educationRequired: 0, wardrobeRequired: 0 },
      { rank: 2, title: 'Developer',  dailyPay: 160, shiftsToPromote: 8,        educationRequired: 1, wardrobeRequired: 0 },
      { rank: 3, title: 'Sr. Dev',    dailyPay: 230, shiftsToPromote: 12,       educationRequired: 2, wardrobeRequired: 0 },
      { rank: 4, title: 'Team Lead',  dailyPay: 320, shiftsToPromote: Infinity, educationRequired: 3, wardrobeRequired: 1 },
    ],
  },
  finance: {
    name: 'Finance',
    tiers: [
      { rank: 1, title: 'Teller',    dailyPay: 100, shiftsToPromote: 5,        educationRequired: 0, wardrobeRequired: 1 },
      { rank: 2, title: 'Analyst',   dailyPay: 155, shiftsToPromote: 8,        educationRequired: 1, wardrobeRequired: 1 },
      { rank: 3, title: 'Manager',   dailyPay: 225, shiftsToPromote: 12,       educationRequired: 2, wardrobeRequired: 2 },
      { rank: 4, title: 'Director',  dailyPay: 340, shiftsToPromote: Infinity, educationRequired: 3, wardrobeRequired: 2 },
    ],
  },
  healthcare: {
    name: 'Healthcare',
    tiers: [
      { rank: 1, title: 'Aide',        dailyPay: 95,  shiftsToPromote: 5,        educationRequired: 0, wardrobeRequired: 0 },
      { rank: 2, title: 'Technician',  dailyPay: 145, shiftsToPromote: 8,        educationRequired: 1, wardrobeRequired: 0 },
      { rank: 3, title: 'Nurse',       dailyPay: 210, shiftsToPromote: 12,       educationRequired: 2, wardrobeRequired: 1 },
      { rank: 4, title: 'Doctor',      dailyPay: 380, shiftsToPromote: Infinity, educationRequired: 3, wardrobeRequired: 1 },
    ],
  },
  creative: {
    name: 'Creative',
    tiers: [
      { rank: 1, title: 'Intern',         dailyPay: 60,  shiftsToPromote: 5,        educationRequired: 0, wardrobeRequired: 0 },
      { rank: 2, title: 'Designer',       dailyPay: 110, shiftsToPromote: 8,        educationRequired: 0, wardrobeRequired: 1 },
      { rank: 3, title: 'Art Dir.',       dailyPay: 175, shiftsToPromote: 12,       educationRequired: 1, wardrobeRequired: 2 },
      { rank: 4, title: 'Creative Dir.',  dailyPay: 270, shiftsToPromote: Infinity, educationRequired: 2, wardrobeRequired: 2 },
    ],
  },
};
