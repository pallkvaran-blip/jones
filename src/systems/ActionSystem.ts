import type { GameState, LocationId, TransportType } from '../state/types'
import { consumeTime, applyEnergyCheck, applyStarvationEnergyDrain } from './TimeSystem'
import { CAREER_JOBS, LOCATION_JOBS } from '../data/jobs'
import { STOCKS, STOCK_NAMES, type StockId } from '../data/stocks'
import { RENTAL_TIERS, OWN_TIERS, getHousingTier } from '../data/housing'
import { PETS } from '../data/pets'
import { rollWorkEvent } from '../data/workEvents'
import { COURSES } from '../data/courses'

function cap(n: number): number {
  return Math.min(100, Math.max(0, n));
}

function petMoraleBonus(pets: string[]): number {
  return PETS.filter(p => pets.includes(p.id)).reduce((sum, p) => sum + p.homeMoraleBonus, 0);
}

function petSleepEnergyBonus(pets: string[]): number {
  return PETS.filter(p => pets.includes(p.id)).reduce((sum, p) => sum + p.homeSleepEnergyBonus, 0);
}

function petStudyEduBonus(pets: string[]): number {
  return PETS.filter(p => pets.includes(p.id)).reduce((sum, p) => sum + p.homeStudyEduBonus, 0);
}


export interface ActionDef {
  id: string;
  label: string;
  detail: string;
  timeCost: number;
  energyCost?: number;
  available(state: GameState): boolean;
  unavailableReason(state: GameState): string;
  apply(state: GameState): GameState;
}

// Helper: push event log entry, keep last 20
function addLog(state: GameState, msg: string): GameState {
  const log = [...state.eventLog, msg].slice(-20);
  return { ...state, eventLog: log };
}

// --- HOME actions ---
const studyAtHomeAction: ActionDef = {
  id: 'study_home',
  label: 'Study at Home',
  detail: 'Education+0.05, Energy-8 | 12m',
  timeCost: 12,
  energyCost: 8,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    const pets = state.player.pets ?? [];
    return {
      ...state,
      player: {
        ...state.player,
        education: state.player.education + 0.05 + petStudyEduBonus(pets),
        energy: cap(state.player.energy - 8),
        morale: cap(state.player.morale + petMoraleBonus(pets)),
      },
    };
  },
};

const sleepAction: ActionDef = {
  id: 'sleep',
  label: 'Sleep',
  detail: 'Fully restores energy | 20m',
  timeCost: 20,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    const pets = state.player.pets ?? [];
    return {
      ...state,
      player: {
        ...state.player,
        energy: cap(100 + petSleepEnergyBonus(pets)),
        morale: cap(state.player.morale + 5 + petMoraleBonus(pets)),
      },
    };
  },
};

// --- JOB SHIFT / QUIT ---
function applyWorkShift(state: GameState): GameState {
  const { player } = state;
  if (!player.careerTrack) return state;
  const track = player.careerTrack;
  const careerDef = CAREER_JOBS[track];
  const tier = careerDef.tiers[player.jobRank - 1];

  let newState: GameState = {
    ...state,
    player: {
      ...state.player,
      energy: cap(player.energy - 20),
      money: player.money + tier.dailyPay,
      jobTenure: player.jobTenure + 1,
    },
  };

  // 7% chance of a work event modal
  if (Math.random() < 0.07) {
    const eventId = rollWorkEvent(track, state.currentLocationId);
    if (eventId) {
      newState = { ...newState, pendingWorkEventId: eventId };
    }
  }

  return newState;
}

function makeWorkShiftAction(pay: number): ActionDef {
  return {
    id: 'work_shift',
    label: 'Work a Shift',
    detail: `Energy-20, +$${pay} | 25m`,
    timeCost: 25,
    energyCost: 20,
    available: () => true,
    unavailableReason: () => '',
    apply: applyWorkShift,
  };
}

const quitJobAction: ActionDef = {
  id: 'quit_job',
  label: 'Quit Job',
  detail: 'Leave your current position | 5m',
  timeCost: 5,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    return addLog({ ...state, player: { ...state.player, jobId: null, careerTrack: null, jobRank: 0, jobTenure: 0 } }, 'Quit your job.');
  },
};

// --- UNIVERSITY: dynamic course actions ---
function getCourseActions(state: GameState): ActionDef[] {
  const completed = state.player.completedCourses ?? []
  const available = COURSES.filter(c =>
    !completed.includes(c.id) &&
    c.prerequisites.every(p => completed.includes(p))
  )

  if (available.length === 0) {
    return [{
      id: 'free_study',
      label: 'Study',
      detail: 'Education+0.1 | 15m',
      timeCost: 15,
      available: () => true,
      unavailableReason: () => '',
      apply(s) {
        return addLog({ ...s, player: { ...s.player, education: s.player.education + 0.1 } }, 'Studied independently — Education +0.1')
      },
    }]
  }

  return available.map(c => ({
    id: `course_${c.id}`,
    label: c.title,
    detail: `Edu+${c.eduPoints} | -$${c.cost} | ${c.timeCost}m`,
    timeCost: c.timeCost,
    energyCost: 10,
    available: (s: GameState) => s.player.money >= c.cost,
    unavailableReason: (s: GameState) => {
      if (s.player.money < c.cost) return `Need $${c.cost}`
      return ''
    },
    apply(s: GameState) {
      return addLog({
        ...s,
        player: {
          ...s.player,
          education: s.player.education + c.eduPoints,
          money: s.player.money - c.cost,
          energy: cap(s.player.energy - 10),
          completedCourses: [...(s.player.completedCourses ?? []), c.id],
        },
      }, `Completed "${c.title}" — Education +${c.eduPoints}`)
    },
  }))
}

// --- BANK actions ---

function getBankSnark(s: GameState, amount: number): string {
  const { player } = s
  if (!player.jobId || player.jobRank < 1) {
    const msgs = [
      'No income, no collateral, no loan.',
      'Come back when someone is paying you.',
      'Employment: none. Loan: also none.',
    ]
    return msgs[amount % msgs.length]
  }
  const locJob = LOCATION_JOBS[player.jobId as LocationId]
  const title = locJob?.titles[player.jobRank - 1] ?? 'your role'
  if (amount >= 50000) {
    const msgs = [
      `A ${title} applying for $50k. Our analyst laughed.`,
      `$50,000 on a ${title}'s pay? That's not finance, that's fiction.`,
      `Bold. Deeply misguided. But bold.`,
    ]
    return msgs[player.jobRank % msgs.length]
  }
  if (amount >= 25000) {
    const msgs = [
      `${title} wages won't clear this desk.`,
      `Not on a ${title}'s salary. Hard pass.`,
      `We'd need a better title than "${title}" for this one.`,
    ]
    return msgs[player.jobRank % msgs.length]
  }
  // $10k
  const msgs = [
    `A ${title}'s income doesn't support $10k yet.`,
    `Try after your first promotion.`,
    `We'll need more than a ${title}'s wage for that.`,
  ]
  return msgs[player.jobRank % msgs.length]
}

function makeRepayAction(amount: number | 'all'): ActionDef {
  const isAll = amount === 'all'
  return {
    id: isAll ? 'repay_all' : `repay_${amount}`,
    label: isAll ? 'Repay All Debt' : `Repay $${amount}`,
    detail: isAll ? 'Clear all debt | 5m' : `Debt -$${amount} | 5m`,
    timeCost: 5,
    available(state) {
      const { money, debt } = state.player
      if (debt <= 0) return false
      return isAll ? money >= debt : money >= (amount as number) && debt >= (amount as number)
    },
    unavailableReason(state) {
      if (state.player.debt <= 0) return 'No debt'
      if (isAll) return `Need $${state.player.debt.toFixed(0)}`
      return `Need $${amount}`
    },
    apply(state) {
      const repay = isAll ? state.player.debt : Math.min(amount as number, state.player.debt)
      const newDebt = state.player.debt - repay
      return addLog({
        ...state,
        player: {
          ...state.player,
          money: state.player.money - repay,
          debt: newDebt,
          creditScore: Math.min(850, state.player.creditScore + 10),
          loanWeekTaken: newDebt <= 0 ? null : state.player.loanWeekTaken,
        },
      }, `Repaid $${repay.toFixed(0)} of debt.`)
    },
  }
}

const repay200Action = makeRepayAction(200)
const repayAllAction  = makeRepayAction('all')

const depositAllAction: ActionDef = {
  id: 'deposit_all',
  label: 'Deposit All Cash',
  detail: 'Move cash → bank | 5m',
  timeCost: 5,
  available: (state) => state.player.money > 0,
  unavailableReason: () => 'No cash to deposit',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        bankBalance: state.player.bankBalance + state.player.money,
        money: 0,
      },
    };
  },
};

const withdraw200Action: ActionDef = {
  id: 'withdraw_200',
  label: 'Withdraw $200',
  detail: 'Bank→cash $200 | 5m',
  timeCost: 5,
  available: (state) => state.player.bankBalance >= 200,
  unavailableReason: () => 'Need $200 in bank',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        bankBalance: state.player.bankBalance - 200,
        money: state.player.money + 200,
      },
    };
  },
};

const takeLoanAction: ActionDef = {
  id: 'take_loan',
  label: 'Personal Loan $250',
  detail: '+$250, due in 4 weeks, 5%/wk interest | 10m',
  timeCost: 10,
  available: (state) => state.player.debt === 0,
  unavailableReason: (state) => {
    if (state.player.debt > 0) return 'Loan already active — repay first';
    return getBankSnark(state, 250);
  },
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        money: state.player.money + 250,
        debt: state.player.debt + 250,
        creditScore: Math.max(0, state.player.creditScore - 20),
        loanWeekTaken: state.calendar.week,
      },
    };
  },
};

// --- GROCERY actions ---
const buyGroceriesAction: ActionDef = {
  id: 'buy_groceries',
  label: 'Buy Groceries',
  detail: 'Hunger+60, Health+5, -$30 | 6m',
  timeCost: 6,
  available: (state) => state.player.money >= 30,
  unavailableReason: () => 'Need $30',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        hunger: cap(state.player.hunger + 60),
        health: cap(state.player.health + 5),
        money: state.player.money - 30,
      },
    };
  },
};

const quickSnackAction: ActionDef = {
  id: 'quick_snack',
  label: 'Quick Snack',
  detail: 'Hunger+25, -$10 | 3m',
  timeCost: 3,
  available: (state) => state.player.money >= 10,
  unavailableReason: () => 'Need $10',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        hunger: cap(state.player.hunger + 25),
        money: state.player.money - 10,
      },
    };
  },
};

// --- ELECTRONICS actions ---
const buyComputerAction: ActionDef = {
  id: 'buy_computer',
  label: 'Buy Computer',
  detail: 'HasComputer, Morale+10, -$800 | 8m',
  timeCost: 8,
  available: (state) => !state.player.hasComputer && state.player.money >= 800,
  unavailableReason: (state) => {
    if (state.player.hasComputer) return 'Already own a computer';
    return 'Need $800';
  },
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        hasComputer: true,
        morale: cap(state.player.morale + 10),
        money: state.player.money - 800,
      },
    };
  },
};

const browseElectronicsAction: ActionDef = {
  id: 'browse_electronics',
  label: 'Browse Electronics',
  detail: 'Morale+5 | 4m',
  timeCost: 4,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        morale: cap(state.player.morale + 5),
      },
    };
  },
};

// --- DEALERSHIP actions ---

function makeBuyVehicleAction(
  id: string,
  label: string,
  transport: TransportType,
  price: number,
  timeCost: number,
): ActionDef {
  return {
    id,
    label,
    detail: `Transport: ${transport.toUpperCase()} | -$${price.toLocaleString()} | ${timeCost}m`,
    timeCost,
    available(state) {
      return state.player.transport !== transport && state.player.money >= price
    },
    unavailableReason(state) {
      if (state.player.transport === transport) return 'Already owned'
      return `Need $${price.toLocaleString()}`
    },
    apply(state) {
      return addLog({
        ...state,
        player: {
          ...state.player,
          transport,
          money: state.player.money - price,
        },
      }, `Bought a ${label} — travel time reduced.`)
    },
  }
}

const browseDealershipAction: ActionDef = {
  id: 'browse_dealership',
  label: 'Browse Inventory',
  detail: 'Morale+5 | 3m',
  timeCost: 3,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    return addLog({ ...state, player: { ...state.player, morale: cap(state.player.morale + 5) } }, 'Browsed the showroom.')
  },
}

const buyBicycleAction   = makeBuyVehicleAction('buy_bicycle',   'Bicycle',    'bicycle',   200,  8)
const buySUVAction       = makeBuyVehicleAction('buy_suv',       'SUV',        'suv',       1000, 10)
const buySportsCarAction = makeBuyVehicleAction('buy_sportscar', 'Sports Car', 'sportscar', 2500, 10)

// --- RESTAURANT actions ---
const eatMealAction: ActionDef = {
  id: 'eat_meal',
  label: 'Eat a Meal',
  detail: 'Hunger+50, Morale+15, Energy+5, -$25 | 6m',
  timeCost: 6,
  available: (state) => state.player.money >= 25,
  unavailableReason: () => 'Need $25',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        hunger: cap(state.player.hunger + 50),
        morale: cap(state.player.morale + 15),
        energy: cap(state.player.energy + 5),
        money: state.player.money - 25,
      },
    };
  },
};

const fastFoodAction: ActionDef = {
  id: 'fast_food',
  label: 'Fast Food',
  detail: 'Hunger+25, Morale+5, -$12 | 3m',
  timeCost: 3,
  available: (state) => state.player.money >= 12,
  unavailableReason: () => 'Need $12',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        hunger: cap(state.player.hunger + 25),
        morale: cap(state.player.morale + 5),
        money: state.player.money - 12,
      },
    };
  },
};

// --- PAWN actions ---
const pawnComputerAction: ActionDef = {
  id: 'pawn_computer',
  label: 'Pawn Computer',
  detail: 'Sell computer for $400 | 8m',
  timeCost: 8,
  available: (state) => state.player.hasComputer,
  unavailableReason: () => 'No computer to pawn',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        hasComputer: false,
        money: state.player.money + 400,
      },
    };
  },
};

const browsePawnAction: ActionDef = {
  id: 'browse_pawn',
  label: 'Browse Pawn Shop',
  detail: 'Morale+3 | 4m',
  timeCost: 4,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        morale: cap(state.player.morale + 3),
      },
    };
  },
};

// --- REALTY actions ---

// Pre-built rental move actions — fixed IDs so partial updates work
const RENT_ACTIONS: ActionDef[] = RENTAL_TIERS.map((tier) => ({
  id: `rent_${tier.id}`,
  label: `Rent: ${tier.name}`,
  detail: `$${tier.weeklyRent}/wk | E+${tier.dayEnergyBonus}/day | 10m`,
  timeCost: 10,
  available: (s: GameState) =>
    !s.player.isOwner && s.player.housingId !== tier.id && s.player.money >= tier.weeklyRent,
  unavailableReason: (s: GameState) => {
    if (s.player.isOwner) return 'Sell property first';
    if (s.player.housingId === tier.id) return 'Current home';
    return `Need $${tier.weeklyRent}`;
  },
  apply(s: GameState) {
    return addLog({ ...s, player: { ...s.player, housingId: tier.id } }, `Rented ${tier.name}!`);
  },
}));

// Pre-built buy actions — fixed IDs
const BUY_ACTIONS: ActionDef[] = OWN_TIERS.map((tier) => ({
  id: `buy_property_${tier.id}`,
  label: `Buy: ${tier.name}`,
  detail: `$${tier.purchaseCost.toLocaleString()} | E+${tier.dayEnergyBonus}/day | 15m`,
  timeCost: 15,
  available: (s: GameState) =>
    !s.player.isOwner && s.player.money + s.player.bankBalance >= tier.purchaseCost,
  unavailableReason: (s: GameState) => {
    if (s.player.isOwner && s.player.housingId === tier.id) return 'Already owned';
    if (s.player.isOwner) return 'Sell property first';
    return `Need $${tier.purchaseCost.toLocaleString()}`;
  },
  apply(s: GameState) {
    const cost = tier.purchaseCost;
    let cash = s.player.money;
    let bank = s.player.bankBalance;
    if (cash >= cost) {
      cash -= cost;
    } else {
      bank -= (cost - cash);
      cash = 0;
    }
    return addLog({
      ...s,
      player: { ...s.player, housingId: tier.id, isOwner: true, money: cash, bankBalance: Math.max(0, bank), propertyValue: cost },
    }, `Bought ${tier.name}!`);
  },
}));

const sellPropertyAction: ActionDef = {
  id: 'sell_property',
  label: 'Sell Property',
  detail: 'Get 70% back, move to studio | 15m',
  timeCost: 15,
  available: (s) => s.player.isOwner,
  unavailableReason: () => 'No property owned',
  apply(s) {
    const proceeds = Math.floor(s.player.propertyValue * 0.7);
    return addLog({
      ...s,
      player: { ...s.player, housingId: 'studio', isOwner: false, money: s.player.money + proceeds, propertyValue: 0 },
    }, `Sold property for $${proceeds}!`);
  },
};

const browseListingsAction: ActionDef = {
  id: 'browse_listings',
  label: 'Browse Listings',
  detail: 'Morale+3 | 5m',
  timeCost: 5,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        morale: cap(state.player.morale + 3),
      },
    };
  },
};

// --- HOSPITAL actions ---
const medicalCheckupAction: ActionDef = {
  id: 'medical_checkup',
  label: 'Medical Checkup',
  detail: 'Health+30, -$80 | 15m',
  timeCost: 15,
  available: (state) => state.player.money >= 80,
  unavailableReason: () => 'Need $80',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        health: cap(state.player.health + 30),
        money: state.player.money - 80,
      },
    };
  },
};

const buyMedicineAction: ActionDef = {
  id: 'buy_medicine',
  label: 'Buy Medicine',
  detail: 'Health+15, -$20 | 5m',
  timeCost: 5,
  available: (state) => state.player.money >= 20,
  unavailableReason: () => 'Need $20',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        health: cap(state.player.health + 15),
        money: state.player.money - 20,
      },
    };
  },
};

// --- STOCK EXCHANGE actions ---
function makeStockActions(state: GameState): ActionDef[] {
  const actions: ActionDef[] = []

  for (const stock of STOCKS) {
    const price = state.economy.stockPrices[stock] ?? 0
    const history = state.economy.stockHistory[stock] ?? []
    const prevPrice = history.length > 0 ? history[history.length - 1] : price
    const changePct = prevPrice > 0 ? ((price - prevPrice) / prevPrice * 100) : 0
    const changeStr = changePct >= 0 ? `+${changePct.toFixed(0)}%` : `${changePct.toFixed(0)}%`
    const name = STOCK_NAMES[stock as StockId]
    const owned = state.player.portfolio[stock] ?? 0

    for (const qty of [5, 10] as const) {
      const cost = Math.round(qty * price)

      actions.push({
        id: `buy_${stock}_${qty}`,
        label: `Buy ${qty} · ${name}`,
        detail: `$${price.toFixed(0)}/share ${changeStr} · total $${cost} | 5m`,
        timeCost: 5,
        available: (s) => s.player.money >= qty * (s.economy.stockPrices[stock] ?? 0),
        unavailableReason: () => `Need $${cost}`,
        apply(s) {
          const p = s.economy.stockPrices[stock] ?? 0
          const total = Math.round(qty * p)
          return addLog({
            ...s,
            player: {
              ...s.player,
              money: s.player.money - total,
              portfolio: { ...s.player.portfolio, [stock]: (s.player.portfolio[stock] ?? 0) + qty },
            },
          }, `Bought ${qty} ${name} @ $${p.toFixed(0)} ea ($${total})`)
        },
      })

      actions.push({
        id: `sell_${stock}_${qty}`,
        label: `Sell ${qty} · ${name}`,
        detail: owned >= qty
          ? `${owned} owned · sell ${qty} → $${Math.round(qty * price)} | 5m`
          : `Need ${qty} shares (have ${owned})`,
        timeCost: 5,
        available: (s) => (s.player.portfolio[stock] ?? 0) >= qty,
        unavailableReason: () => `Need ${qty} shares (have ${owned})`,
        apply(s) {
          const p = s.economy.stockPrices[stock] ?? 0
          const proceeds = Math.round(qty * p)
          const remaining = (s.player.portfolio[stock] ?? 0) - qty
          const newPortfolio = { ...s.player.portfolio }
          if (remaining <= 0) {
            delete newPortfolio[stock]
          } else {
            newPortfolio[stock] = remaining
          }
          return addLog({
            ...s,
            player: { ...s.player, money: s.player.money + proceeds, portfolio: newPortfolio },
          }, `Sold ${qty} ${name} for $${proceeds}`)
        },
      })
    }
  }

  return actions
}

// --- PET SHOP actions (employment location) ---
const PET_SHOP_ACTIONS: ActionDef[] = PETS.map((pet) => ({
  id: `buy_pet_${pet.id}`,
  label: `Adopt ${pet.name}`,
  detail: `${pet.species} — $${pet.price} | 10m`,
  timeCost: 10,
  available: (s: GameState) => !s.player.pets.includes(pet.id) && s.player.money >= pet.price,
  unavailableReason: (s: GameState) => {
    if (s.player.pets.includes(pet.id)) return `Already have ${pet.name}!`;
    return `Need $${pet.price}`;
  },
  apply(s: GameState) {
    return addLog({
      ...s,
      player: {
        ...s.player,
        pets: [...s.player.pets, pet.id],
        money: s.player.money - pet.price,
        morale: cap(s.player.morale + 15),
      },
    }, `Adopted ${pet.name} the ${pet.species}!`);
  },
}));

// --- JOB APPLICATION helper ---
// Returns tier apply buttons if unemployed, [Work, Quit] if employed here.
function getJobActions(locationId: LocationId, state: GameState): ActionDef[] {
  const locJob = LOCATION_JOBS[locationId];
  if (!locJob) return [];

  const { player } = state;

  if (player.jobId === locationId) {
    const careerDef = CAREER_JOBS[locJob.track];
    const tier = careerDef.tiers[player.jobRank - 1];
    const pay = tier?.dailyPay ?? 60;
    return [makeWorkShiftAction(pay), quitJobAction];
  }

  if (!locJob.jobTiers?.length) {
    const firstTier = CAREER_JOBS[locJob.track].tiers[0];
    return [{
      id: `apply_${locationId}`,
      label: `Apply: ${locJob.titles[0]} – $${firstTier.dailyPay}/shift`,
      detail: `Open to all | 5m`,
      timeCost: 5,
      available: () => true,
      unavailableReason: () => '',
      apply(s) {
        const wasEmployed = s.player.jobId !== null
        return addLog({
          ...s,
          pendingLifeEventId: 'job_hired',
          player: {
            ...s.player,
            jobId: locationId,
            careerTrack: locJob.track,
            jobTenure: 0,
            jobRank: 1,
          },
        }, wasEmployed ? `Left old job — hired as ${locJob.titles[0]}!` : `Hired as ${locJob.titles[0]}!`);
      },
    }];
  }

  return locJob.jobTiers.map(jobTier => {
    const careerDef = CAREER_JOBS[locJob.track]
    const careerTier = careerDef.tiers[jobTier.rank - 1]
    const title = locJob.titles[jobTier.rank - 1]
    const pay = careerTier?.dailyPay ?? 60
    const req = jobTier.requiredEducation
    const reqStr = req === 0 ? 'Open to all' : `Edu ≥ ${req.toFixed(1)}`

    return {
      id: `apply_${locationId}_rank${jobTier.rank}`,
      label: `Apply: ${title} – $${pay}/shift`,
      detail: `${reqStr} | 5m`,
      timeCost: 5,
      available: () => true,
      unavailableReason: () => '',
      apply(s: GameState) {
        if (s.player.education < req) {
          return { ...s, pendingLifeEventId: 'job_rejected_education' }
        }
        const wasEmployed = s.player.jobId !== null
        return addLog({
          ...s,
          pendingLifeEventId: 'job_hired',
          player: {
            ...s.player,
            jobId: locationId,
            careerTrack: locJob.track,
            jobTenure: 0,
            jobRank: jobTier.rank,
          },
        }, wasEmployed ? `Left old job — hired as ${title}!` : `Hired as ${title}!`)
      },
    }
  })
}

export function getActionsForLocation(locationId: LocationId, state: GameState): ActionDef[] {
  switch (locationId) {
    case 'home':
      return [sleepAction, studyAtHomeAction];

    case 'employment':
      return [...PET_SHOP_ACTIONS, ...getJobActions(locationId, state)];

    case 'university':
      return [...getCourseActions(state), ...getJobActions(locationId, state)];

    case 'bank':
      return [depositAllAction, withdraw200Action, takeLoanAction, repay200Action, repayAllAction, ...getJobActions(locationId, state)];

    case 'grocery':
      return [buyGroceriesAction, quickSnackAction, ...getJobActions(locationId, state)];

    case 'electronics':
      return [buyComputerAction, browseElectronicsAction, ...getJobActions(locationId, state)];

    case 'dealership':
      return [browseDealershipAction, buyBicycleAction, buySUVAction, buySportsCarAction, ...getJobActions(locationId, state)];

    case 'restaurant':
      return [eatMealAction, fastFoodAction, ...getJobActions(locationId, state)];

    case 'pawn':
      return [pawnComputerAction, browsePawnAction, ...getJobActions(locationId, state)];

    case 'realty':
      return [...RENT_ACTIONS, ...BUY_ACTIONS, sellPropertyAction, browseListingsAction, ...getJobActions(locationId, state)];

    case 'hospital':
      return [medicalCheckupAction, buyMedicineAction, ...getJobActions(locationId, state)];

    case 'stockexchange':
      return [...makeStockActions(state), ...getJobActions(locationId, state)];

    default:
      return [];
  }
}

function checkHealth(state: GameState): GameState {
  if (state.player.health <= 0 && !state.isGameOver) {
    return {
      ...state,
      isGameOver: true,
      winCondition: 'lost',
      lossReason: state.player.isStarving ? 'You starved to death.' : 'Your health failed.',
    };
  }
  return state;
}

export function executeAction(actionId: string, locationId: LocationId, state: GameState): GameState {
  const actions = getActionsForLocation(locationId, state);
  const action = actions.find((a) => a.id === actionId);

  if (!action) {
    return state;
  }

  if (!action.available(state)) {
    return state;
  }

  const prevEnergy = state.player.energy;
  const afterAction = action.apply(state);
  const afterStarvation = applyStarvationEnergyDrain(prevEnergy, afterAction);
  const afterTime = consumeTime(afterStarvation, action.timeCost);
  return applyEnergyCheck(checkHealth(afterTime));
}
