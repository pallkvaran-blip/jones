import type { CareerTrack } from '../state/types'

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
