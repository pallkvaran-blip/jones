import type { CareerTrack, LocationId } from '../state/types'

export interface JobTier {
  rank: number;
  title: string;
  dailyPay: number;
  shiftsToPromote: number; // Infinity means no promotion
  wardrobeRequired: number;
}

export interface CareerDef {
  name: string;
  tiers: JobTier[];
}

export interface LocationJobTier {
  rank: number;
  requiredEducation: number;
}

export interface LocationJobDef {
  track: CareerTrack;
  titles: [string, string, string, string];
  jobTiers?: LocationJobTier[];
}

/** Maps each location to the career track and titles available there. */
export const LOCATION_JOBS: Partial<Record<LocationId, LocationJobDef>> = {
  employment: {
    track: 'creative',
    titles: ['Pet Clerk', 'Pet Handler', 'Dept. Lead', 'Store Mgr'],
    jobTiers: [
      { rank: 1, requiredEducation: 0 },
      { rank: 2, requiredEducation: 1.0 },
      { rank: 3, requiredEducation: 2.5 },
    ],
  },
  grocery: {
    track: 'trades',
    titles: ['Stock Clerk', 'Cashier', 'Dept. Mgr', 'Store Mgr'],
    jobTiers: [
      { rank: 1, requiredEducation: 0 },
      { rank: 2, requiredEducation: 0.5 },
      { rank: 3, requiredEducation: 1.5 },
    ],
  },
  restaurant: {
    track: 'creative',
    titles: ['Busboy', 'Server', "Maitre'd", 'Rest. Mgr'],
    jobTiers: [
      { rank: 1, requiredEducation: 0 },
      { rank: 2, requiredEducation: 0.5 },
      { rank: 3, requiredEducation: 1.5 },
    ],
  },
  pawn: {
    track: 'finance',
    titles: ['Sales Clerk', 'Buyer', 'Store Mgr', 'Owner'],
    jobTiers: [
      { rank: 1, requiredEducation: 0 },
      { rank: 2, requiredEducation: 1.0 },
      { rank: 3, requiredEducation: 2.0 },
    ],
  },
  university: {
    track: 'healthcare',
    titles: ['Tutor', 'Lecturer', 'Professor', 'Dept. Chair'],
    jobTiers: [
      { rank: 1, requiredEducation: 1.0 },
      { rank: 2, requiredEducation: 2.0 },
      { rank: 3, requiredEducation: 3.5 },
    ],
  },
  clothing: {
    track: 'creative',
    titles: ['Sales Assoc', 'Buyer', 'Designer', 'Creative Dir'],
    jobTiers: [
      { rank: 1, requiredEducation: 0 },
      { rank: 2, requiredEducation: 1.0 },
      { rank: 3, requiredEducation: 2.5 },
    ],
  },
  hospital: {
    track: 'healthcare',
    titles: ['Orderly', 'Technician', 'Nurse', 'Doctor'],
    jobTiers: [
      { rank: 1, requiredEducation: 1.5 },
      { rank: 2, requiredEducation: 3.0 },
      { rank: 3, requiredEducation: 5.0 },
    ],
  },
  bank: {
    track: 'finance',
    titles: ['Teller', 'Loan Officer', 'Asst. Mgr', 'Branch Mgr'],
    jobTiers: [
      { rank: 1, requiredEducation: 1.0 },
      { rank: 2, requiredEducation: 2.5 },
      { rank: 3, requiredEducation: 4.0 },
    ],
  },
  electronics: {
    track: 'tech',
    titles: ['Support Tech', 'Developer', 'Senior Dev', 'Lead Eng.'],
    jobTiers: [
      { rank: 1, requiredEducation: 1.0 },
      { rank: 2, requiredEducation: 2.5 },
      { rank: 3, requiredEducation: 4.0 },
    ],
  },
  realty: {
    track: 'finance',
    titles: ['Agent', 'Sr. Agent', 'Broker', 'Principal'],
    jobTiers: [
      { rank: 1, requiredEducation: 1.0 },
      { rank: 2, requiredEducation: 2.5 },
      { rank: 3, requiredEducation: 4.0 },
    ],
  },
  stockexchange: {
    track: 'finance',
    titles: ['Jr. Trader', 'Trader', 'Portfolio Mgr', 'Partner'],
    jobTiers: [
      { rank: 1, requiredEducation: 2.0 },
      { rank: 2, requiredEducation: 3.5 },
      { rank: 3, requiredEducation: 5.0 },
    ],
  },
};

export const CAREER_JOBS: Record<CareerTrack, CareerDef> = {
  trades: {
    name: 'Construction',
    tiers: [
      { rank: 1, title: 'Laborer',     dailyPay: 90,  shiftsToPromote: 5,        wardrobeRequired: 0 },
      { rank: 2, title: 'Apprentice',  dailyPay: 130, shiftsToPromote: 8,        wardrobeRequired: 0 },
      { rank: 3, title: 'Journeyman',  dailyPay: 185, shiftsToPromote: 12,       wardrobeRequired: 0 },
      { rank: 4, title: 'Foreman',     dailyPay: 260, shiftsToPromote: Infinity, wardrobeRequired: 1 },
    ],
  },
  tech: {
    name: 'Tech',
    tiers: [
      { rank: 1, title: 'Jr. Dev',    dailyPay: 110, shiftsToPromote: 5,        wardrobeRequired: 0 },
      { rank: 2, title: 'Developer',  dailyPay: 160, shiftsToPromote: 8,        wardrobeRequired: 0 },
      { rank: 3, title: 'Sr. Dev',    dailyPay: 230, shiftsToPromote: 12,       wardrobeRequired: 0 },
      { rank: 4, title: 'Team Lead',  dailyPay: 320, shiftsToPromote: Infinity, wardrobeRequired: 1 },
    ],
  },
  finance: {
    name: 'Finance',
    tiers: [
      { rank: 1, title: 'Teller',    dailyPay: 100, shiftsToPromote: 5,        wardrobeRequired: 1 },
      { rank: 2, title: 'Analyst',   dailyPay: 155, shiftsToPromote: 8,        wardrobeRequired: 1 },
      { rank: 3, title: 'Manager',   dailyPay: 225, shiftsToPromote: 12,       wardrobeRequired: 2 },
      { rank: 4, title: 'Director',  dailyPay: 340, shiftsToPromote: Infinity, wardrobeRequired: 2 },
    ],
  },
  healthcare: {
    name: 'Healthcare',
    tiers: [
      { rank: 1, title: 'Aide',        dailyPay: 95,  shiftsToPromote: 5,        wardrobeRequired: 0 },
      { rank: 2, title: 'Technician',  dailyPay: 145, shiftsToPromote: 8,        wardrobeRequired: 0 },
      { rank: 3, title: 'Nurse',       dailyPay: 210, shiftsToPromote: 12,       wardrobeRequired: 1 },
      { rank: 4, title: 'Doctor',      dailyPay: 380, shiftsToPromote: Infinity, wardrobeRequired: 1 },
    ],
  },
  creative: {
    name: 'Creative',
    tiers: [
      { rank: 1, title: 'Intern',         dailyPay: 60,  shiftsToPromote: 5,        wardrobeRequired: 0 },
      { rank: 2, title: 'Designer',       dailyPay: 110, shiftsToPromote: 8,        wardrobeRequired: 1 },
      { rank: 3, title: 'Art Dir.',       dailyPay: 175, shiftsToPromote: 12,       wardrobeRequired: 2 },
      { rank: 4, title: 'Creative Dir.',  dailyPay: 270, shiftsToPromote: Infinity, wardrobeRequired: 2 },
    ],
  },
};
