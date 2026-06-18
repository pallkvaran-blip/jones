import type { GameState } from '../state/types'

export interface StatDelta {
  money?: number
  bankBalance?: number
  health?: number
  morale?: number
  hunger?: number
  energy?: number
  creditScore?: number
  clearJob?: boolean   // if true, set jobId=null, careerTrack=null, jobRank=0
}

export interface EventChoice {
  label: string
  delta: StatDelta
  logMsg: string
  randomWin?: { delta: StatDelta; logMsg: string }  // if set, 50% chance to apply this instead
}

export interface LifeEvent {
  id: string
  title: string
  description: string
  weight: number
  cooldownWeeks: number
  canFire(state: GameState): boolean
  type: 'immediate' | 'choice'
  immediateDelta?: StatDelta
  immediateLog?: string
  choices?: [EventChoice, EventChoice]
}

export const ALL_LIFE_EVENTS: LifeEvent[] = [
  // ── Immediate Bad ──────────────────────────────────────────────────────────
  {
    id: 'pickpocketed',
    title: 'Pickpocketed!',
    description: 'Someone swiped your wallet on the subway. You\'re $100 lighter and feeling violated.',
    weight: 10,
    cooldownWeeks: 4,
    canFire: (s) => s.player.money >= 100,
    type: 'immediate',
    immediateDelta: { money: -100, morale: -10 },
    immediateLog: 'Pickpocketed — lost $100.',
  },
  {
    id: 'car_breakdown',
    title: 'Car Trouble',
    description: 'Your car decided today was a great day to break down. Repair bill: $150.',
    weight: 8,
    cooldownWeeks: 5,
    canFire: (s) => (s.player.hasTransport ?? false) && s.player.money >= 50,
    type: 'immediate',
    immediateDelta: { money: -150, morale: -15 },
    immediateLog: 'Car breakdown — repair cost $150.',
  },
  {
    id: 'pipe_burst',
    title: 'Burst Pipe',
    description: 'A pipe burst in your unit. The landlord says it\'s your problem. That\'s $180 gone.',
    weight: 7,
    cooldownWeeks: 8,
    canFire: (s) => !s.player.isOwner && s.player.housingId !== 'studio',
    type: 'immediate',
    immediateDelta: { money: -180, morale: -10 },
    immediateLog: 'Burst pipe — repairs cost $180.',
  },
  {
    id: 'medical_bill',
    title: 'Unexpected Medical Bill',
    description: 'That clinic visit from last month just sent a bill. $200, payable now.',
    weight: 9,
    cooldownWeeks: 6,
    canFire: (s) => s.player.health < 60 && s.player.money >= 50,
    type: 'immediate',
    immediateDelta: { money: -200, health: 10 },
    immediateLog: 'Medical bill paid — $200, but at least you got a checkup.',
  },
  {
    id: 'rent_hike',
    title: 'Rent Increase Notice',
    description: 'Your landlord just raised the rent. You\'ll need to cover an extra $200 this month.',
    weight: 8,
    cooldownWeeks: 7,
    canFire: (s) => !s.player.isOwner && s.player.money >= 50,
    type: 'immediate',
    immediateDelta: { money: -200, morale: -15 },
    immediateLog: 'Rent hiked — paid extra $200.',
  },
  {
    id: 'stock_dip',
    title: 'Market Correction',
    description: 'Analysts are calling it a "healthy correction." Your portfolio is calling it a disaster.',
    weight: 8,
    cooldownWeeks: 5,
    canFire: (s) => Object.values(s.player.portfolio).some(v => v > 0),
    type: 'immediate',
    immediateDelta: { money: -100, morale: -10 },
    immediateLog: 'Market dip — paper losses hit your morale.',
  },
  // ── Immediate Good ─────────────────────────────────────────────────────────
  {
    id: 'tax_refund',
    title: 'Tax Refund!',
    description: 'A check arrived from the city tax office. Turns out you overpaid. $300 back in your pocket.',
    weight: 8,
    cooldownWeeks: 8,
    canFire: (s) => s.calendar.week >= 4,
    type: 'immediate',
    immediateDelta: { money: 300, morale: 15 },
    immediateLog: 'Tax refund arrived — $300!',
  },
  {
    id: 'found_money',
    title: 'Lucky Day',
    description: 'You found $50 in an old jacket pocket. Today is a good day.',
    weight: 12,
    cooldownWeeks: 3,
    canFire: () => true,
    type: 'immediate',
    immediateDelta: { money: 50, morale: 10 },
    immediateLog: 'Found $50 in an old pocket.',
  },
  {
    id: 'performance_bonus',
    title: 'Performance Bonus',
    description: 'Your manager recognised your hard work. A $200 bonus hits your account.',
    weight: 7,
    cooldownWeeks: 5,
    canFire: (s) => s.player.jobId !== null && s.player.jobRank >= 1,
    type: 'immediate',
    immediateDelta: { money: 200, morale: 15 },
    immediateLog: 'Performance bonus received — $200!',
  },
  {
    id: 'neighbor_food',
    title: 'Neighbourly Gesture',
    description: 'Your neighbour dropped off a home-cooked meal. You didn\'t even know they knew your name.',
    weight: 10,
    cooldownWeeks: 3,
    canFire: () => true,
    type: 'immediate',
    immediateDelta: { hunger: 30, morale: 15 },
    immediateLog: 'Neighbour shared a meal — hunger and morale up.',
  },
  {
    id: 'friend_repaid',
    title: 'Old Debt Repaid',
    description: 'A friend finally paid back that $150 you lent them months ago. Better late than never.',
    weight: 8,
    cooldownWeeks: 6,
    canFire: () => true,
    type: 'immediate',
    immediateDelta: { money: 150, morale: 10 },
    immediateLog: 'Friend repaid $150 loan.',
  },
  // ── Choice Events ──────────────────────────────────────────────────────────
  {
    id: 'overtime_offer',
    title: 'Overtime Opportunity',
    description: 'Your manager asks if you can cover an extra shift this week. Extra pay, but it\'ll cost you.',
    weight: 12,
    cooldownWeeks: 3,
    canFire: (s) => s.player.jobId !== null,
    type: 'choice',
    choices: [
      { label: 'Take the shift', delta: { money: 200, energy: -30, morale: -10 }, logMsg: 'Worked overtime — earned $200 but exhausted.' },
      { label: 'Decline', delta: {}, logMsg: 'Turned down overtime.' },
    ],
  },
  {
    id: 'rival_job_offer',
    title: 'Rival Company Calling',
    description: 'A competitor has heard good things about you. They\'re offering a signing bonus to jump ship — but you\'d start fresh.',
    weight: 7,
    cooldownWeeks: 6,
    canFire: (s) => s.player.jobId !== null && s.player.jobRank >= 2,
    type: 'choice',
    choices: [
      { label: 'Take the offer', delta: { money: 300, morale: 10, creditScore: 5 }, logMsg: 'Took rival job offer — $300 signing bonus, reset to rank 1.' },
      { label: 'Stay loyal', delta: { money: 100, morale: 20 }, logMsg: 'Stayed put — loyalty bonus $100 and morale boost.' },
    ],
  },
  {
    id: 'help_friend_move',
    title: 'Friend Needs Help Moving',
    description: 'Your friend is moving across town and is desperate for help. It\'s a full day\'s work.',
    weight: 10,
    cooldownWeeks: 4,
    canFire: () => true,
    type: 'choice',
    choices: [
      { label: 'Help them', delta: { morale: 25, energy: -25 }, logMsg: 'Helped friend move — good karma, tired body.' },
      { label: 'Can\'t make it', delta: { morale: -5 }, logMsg: 'Skipped helping friend — slight guilt.' },
    ],
  },
  {
    id: 'startup_invest',
    title: 'Startup Investment Pitch',
    description: 'An acquaintance is pitching their startup. "$300 in, and you could triple it" — or lose it all.',
    weight: 7,
    cooldownWeeks: 5,
    canFire: (s) => s.player.money >= 300,
    type: 'choice',
    choices: [
      {
        label: 'Invest $300',
        delta: { money: -300 },
        logMsg: 'Invested $300 in startup — lost it.',
        randomWin: { delta: { money: 600, morale: 20 }, logMsg: 'Startup paid off — $600 returned!' },
      },
      { label: 'Pass', delta: {}, logMsg: 'Passed on startup investment.' },
    ],
  },
  {
    id: 'city_festival',
    title: 'City Street Festival',
    description: 'There\'s a free festival downtown this weekend. Food, music, the works. Costs a bit to enjoy it right.',
    weight: 11,
    cooldownWeeks: 4,
    canFire: (s) => s.player.money >= 20,
    type: 'choice',
    choices: [
      { label: 'Go and enjoy it', delta: { morale: 30, energy: -15, money: -25 }, logMsg: 'Went to the festival — great time.' },
      { label: 'Stay home', delta: {}, logMsg: 'Skipped the festival.' },
    ],
  },
  {
    id: 'gym_offer',
    title: 'Gym Membership Deal',
    description: 'A gym near your place is running a discounted membership drive. $80 for the month.',
    weight: 9,
    cooldownWeeks: 5,
    canFire: (s) => s.player.money >= 80,
    type: 'choice',
    choices: [
      { label: 'Join the gym', delta: { money: -80, health: 20, morale: 10 }, logMsg: 'Joined the gym — health and morale up.' },
      { label: 'Skip it', delta: {}, logMsg: 'Passed on gym membership.' },
    ],
  },
  {
    id: 'layoff_notice',
    title: 'Layoff Notice',
    description: 'Budget cuts. Your position is "at risk." You can fight to keep it or take the severance.',
    weight: 6,
    cooldownWeeks: 8,
    canFire: (s) => s.player.jobId !== null && s.player.jobRank <= 1,
    type: 'choice',
    choices: [
      { label: 'Fight for your job', delta: { morale: -25, energy: -25, health: -10 }, logMsg: 'Fought the layoff — kept the job, barely.' },
      { label: 'Take the severance', delta: { money: 400, morale: -20, clearJob: true }, logMsg: 'Took severance — $400, now job hunting.' },
    ],
  },
  {
    id: 'free_concert',
    title: 'Free Concert Tonight',
    description: 'A band you vaguely like is playing a free show in the park. Goes late though.',
    weight: 12,
    cooldownWeeks: 3,
    canFire: () => true,
    type: 'choice',
    choices: [
      { label: 'Go to the show', delta: { morale: 25, energy: -15 }, logMsg: 'Went to the concert — great night.' },
      { label: 'Early night', delta: { energy: 10 }, logMsg: 'Stayed in, got some rest.' },
    ],
  },
]
