export interface CourseDef {
  id: string
  title: string
  description: string
  cost: number
  timeCost: number
  eduPoints: number
  prerequisites: string[]
}

export const COURSES: CourseDef[] = [
  // ── Tier 0: always available ───────────────────────────────────────────────
  {
    id: 'basics',
    title: 'Basic Studies',
    description: 'Reading, writing and numeracy — the foundation for everything else.',
    cost: 50, timeCost: 15, eduPoints: 0.5, prerequisites: [],
  },
  {
    id: 'job_skills',
    title: 'Job Skills Workshop',
    description: 'Interview technique, workplace communication, and how to write a CV.',
    cost: 30, timeCost: 10, eduPoints: 0.3, prerequisites: [],
  },

  // ── Tier 1: requires basics ────────────────────────────────────────────────
  {
    id: 'business_101',
    title: 'Business 101',
    description: 'Introduction to commerce, economics, and how organisations work.',
    cost: 100, timeCost: 20, eduPoints: 0.7, prerequisites: ['basics'],
  },
  {
    id: 'intro_tech',
    title: 'Intro to Technology',
    description: 'Computer fundamentals, troubleshooting, and digital literacy.',
    cost: 100, timeCost: 20, eduPoints: 0.7, prerequisites: ['basics'],
  },
  {
    id: 'health_basics',
    title: 'Health Sciences',
    description: 'Anatomy, patient care basics, and how health services work.',
    cost: 100, timeCost: 20, eduPoints: 0.7, prerequisites: ['basics'],
  },
  {
    id: 'creative_arts',
    title: 'Creative Arts',
    description: 'Design principles, colour theory, and visual communication.',
    cost: 80, timeCost: 15, eduPoints: 0.5, prerequisites: ['basics'],
  },

  // ── Tier 2: requires a tier-1 course ──────────────────────────────────────
  {
    id: 'accounting',
    title: 'Accounting',
    description: 'Financial reporting, bookkeeping, and tax fundamentals.',
    cost: 180, timeCost: 25, eduPoints: 1.0, prerequisites: ['business_101'],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Brand strategy, market research, and advertising basics.',
    cost: 150, timeCost: 20, eduPoints: 0.8, prerequisites: ['business_101'],
  },
  {
    id: 'web_dev',
    title: 'Web Development',
    description: 'Front-end development, HTML/CSS, and basic programming logic.',
    cost: 180, timeCost: 25, eduPoints: 1.0, prerequisites: ['intro_tech'],
  },
  {
    id: 'data_analysis',
    title: 'Data Analysis',
    description: 'Statistics, spreadsheet modelling, and making sense of numbers.',
    cost: 160, timeCost: 22, eduPoints: 0.9, prerequisites: ['intro_tech'],
  },
  {
    id: 'first_aid',
    title: 'First Aid & Care',
    description: 'Emergency response, patient handling, and basic clinical skills.',
    cost: 150, timeCost: 20, eduPoints: 0.8, prerequisites: ['health_basics'],
  },
  {
    id: 'design',
    title: 'Graphic Design',
    description: 'Portfolio building, typography, and digital design tools.',
    cost: 150, timeCost: 20, eduPoints: 0.8, prerequisites: ['creative_arts'],
  },

  // ── Tier 3: advanced ──────────────────────────────────────────────────────
  {
    id: 'finance_adv',
    title: 'Advanced Finance',
    description: 'Investment analysis, risk management, and capital markets.',
    cost: 250, timeCost: 30, eduPoints: 1.5, prerequisites: ['accounting'],
  },
  {
    id: 'software_eng',
    title: 'Software Engineering',
    description: 'Systems design, algorithms, and full-stack development.',
    cost: 250, timeCost: 30, eduPoints: 1.5, prerequisites: ['web_dev'],
  },
  {
    id: 'med_tech',
    title: 'Medical Technology',
    description: 'Diagnostic equipment, clinical procedures, and patient management.',
    cost: 200, timeCost: 25, eduPoints: 1.2, prerequisites: ['first_aid'],
  },
  {
    id: 'nursing',
    title: 'Nursing Program',
    description: 'Advanced patient care, pharmacology, and clinical practice.',
    cost: 280, timeCost: 30, eduPoints: 1.5, prerequisites: ['med_tech'],
  },
]
