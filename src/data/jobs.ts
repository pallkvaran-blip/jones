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
  requiredCourses: string[];
}

export interface LocationJobDef {
  track: CareerTrack;
  titles: [string, string, string, string];
  requiredCourses: string[];
  jobTiers?: LocationJobTier[];
}

/** Maps each location to the career track and titles available there. */
export const LOCATION_JOBS: Partial<Record<LocationId, LocationJobDef>> = {
  employment: {
    track: 'creative',
    titles: ['Pet Clerk', 'Pet Handler', 'Dept. Lead', 'Store Mgr'],
    requiredCourses: [],
    jobTiers: [
      { rank: 1, requiredCourses: [] },
      { rank: 2, requiredCourses: ['creative_arts'] },
      { rank: 3, requiredCourses: ['creative_arts', 'design'] },
    ],
  },
  grocery: {
    track: 'trades',
    titles: ['Stock Clerk', 'Cashier', 'Dept. Mgr', 'Store Mgr'],
    requiredCourses: [],
    jobTiers: [
      { rank: 1, requiredCourses: [] },
      { rank: 2, requiredCourses: ['job_skills'] },
      { rank: 3, requiredCourses: ['job_skills', 'business_101'] },
    ],
  },
  restaurant: {
    track: 'creative',
    titles: ['Busboy', 'Server', "Maitre'd", 'Rest. Mgr'],
    requiredCourses: [],
    jobTiers: [
      { rank: 1, requiredCourses: [] },
      { rank: 2, requiredCourses: ['job_skills'] },
      { rank: 3, requiredCourses: ['job_skills', 'business_101'] },
    ],
  },
  pawn: {
    track: 'finance',
    titles: ['Sales Clerk', 'Buyer', 'Store Mgr', 'Owner'],
    requiredCourses: [],
    jobTiers: [
      { rank: 1, requiredCourses: [] },
      { rank: 2, requiredCourses: ['business_101'] },
      { rank: 3, requiredCourses: ['business_101', 'accounting'] },
    ],
  },
  university: {
    track: 'healthcare',
    titles: ['Tutor', 'Lecturer', 'Professor', 'Dept. Chair'],
    requiredCourses: ['job_skills'],
    jobTiers: [
      { rank: 1, requiredCourses: ['job_skills'] },
      { rank: 2, requiredCourses: ['job_skills', 'health_basics'] },
      { rank: 3, requiredCourses: ['job_skills', 'health_basics', 'first_aid'] },
    ],
  },
  clothing: {
    track: 'creative',
    titles: ['Sales Assoc', 'Buyer', 'Designer', 'Creative Dir'],
    requiredCourses: [],
    jobTiers: [
      { rank: 1, requiredCourses: [] },
      { rank: 2, requiredCourses: ['creative_arts'] },
      { rank: 3, requiredCourses: ['creative_arts', 'design'] },
    ],
  },
  hospital: {
    track: 'healthcare',
    titles: ['Orderly', 'Technician', 'Nurse', 'Doctor'],
    requiredCourses: ['health_basics'],
    jobTiers: [
      { rank: 1, requiredCourses: ['health_basics'] },
      { rank: 2, requiredCourses: ['health_basics', 'first_aid'] },
      { rank: 3, requiredCourses: ['health_basics', 'first_aid', 'med_tech'] },
    ],
  },
  bank: {
    track: 'finance',
    titles: ['Teller', 'Loan Officer', 'Asst. Mgr', 'Branch Mgr'],
    requiredCourses: ['business_101'],
    jobTiers: [
      { rank: 1, requiredCourses: ['business_101'] },
      { rank: 2, requiredCourses: ['business_101', 'accounting'] },
      { rank: 3, requiredCourses: ['business_101', 'accounting', 'finance_adv'] },
    ],
  },
  electronics: {
    track: 'tech',
    titles: ['Support Tech', 'Developer', 'Senior Dev', 'Lead Eng.'],
    requiredCourses: ['intro_tech'],
    jobTiers: [
      { rank: 1, requiredCourses: ['intro_tech'] },
      { rank: 2, requiredCourses: ['intro_tech', 'web_dev'] },
      { rank: 3, requiredCourses: ['intro_tech', 'web_dev', 'software_eng'] },
    ],
  },
  realty: {
    track: 'finance',
    titles: ['Agent', 'Sr. Agent', 'Broker', 'Principal'],
    requiredCourses: ['accounting'],
    jobTiers: [
      { rank: 1, requiredCourses: ['business_101'] },
      { rank: 2, requiredCourses: ['business_101', 'accounting'] },
      { rank: 3, requiredCourses: ['accounting', 'finance_adv'] },
    ],
  },
  stockexchange: {
    track: 'finance',
    titles: ['Jr. Trader', 'Trader', 'Portfolio Mgr', 'Partner'],
    requiredCourses: ['finance_adv'],
    jobTiers: [
      { rank: 1, requiredCourses: ['accounting', 'finance_adv'] },
      { rank: 2, requiredCourses: ['accounting', 'finance_adv', 'data_analysis'] },
      { rank: 3, requiredCourses: ['accounting', 'finance_adv', 'software_eng'] },
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
