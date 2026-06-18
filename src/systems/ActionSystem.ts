import type { GameState, LocationId } from '../state/types'
import { consumeTime } from './TimeSystem'
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
  detail: 'Education+0.3, Energy-8 | 12t',
  timeCost: 12,
  available: (state) => state.player.energy >= 8,
  unavailableReason: (s) => `Too tired to study (${Math.round(s.player.energy)}) — rest first!`,
  apply(state) {
    const pets = state.player.pets ?? [];
    return {
      ...state,
      player: {
        ...state.player,
        education: state.player.education + 0.3 + petStudyEduBonus(pets),
        energy: cap(state.player.energy - 8),
        morale: cap(state.player.morale + petMoraleBonus(pets)),
      },
    };
  },
};

const sleepAction: ActionDef = {
  id: 'sleep',
  label: 'Sleep',
  detail: 'Energy+40, Morale+5 | 20t',
  timeCost: 20,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    const pets = state.player.pets ?? [];
    return {
      ...state,
      player: {
        ...state.player,
        energy: cap(state.player.energy + 40 + petSleepEnergyBonus(pets)),
        morale: cap(state.player.morale + 5 + petMoraleBonus(pets)),
      },
    };
  },
};

const restAction: ActionDef = {
  id: 'rest',
  label: 'Rest',
  detail: 'Energy+15, Morale+10 | 10t',
  timeCost: 10,
  available: () => true,
  unavailableReason: () => '',
  apply(state) {
    const pets = state.player.pets ?? [];
    return {
      ...state,
      player: {
        ...state.player,
        energy: cap(state.player.energy + 15 + petSleepEnergyBonus(pets)),
        morale: cap(state.player.morale + 10 + petMoraleBonus(pets)),
      },
    };
  },
};

const cookMealAction: ActionDef = {
  id: 'cook_meal',
  label: 'Cook a Meal',
  detail: 'Hunger+40, -$15 | 8t',
  timeCost: 8,
  available: (state) => state.player.money >= 15,
  unavailableReason: () => 'Need $15',
  apply(state) {
    const pets = state.player.pets ?? [];
    return {
      ...state,
      player: {
        ...state.player,
        hunger: cap(state.player.hunger + 40),
        money: state.player.money - 15,
        morale: cap(state.player.morale + petMoraleBonus(pets)),
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

  // 40% chance of a work event modal
  if (Math.random() < 0.4) {
    const eventId = rollWorkEvent(track);
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
    detail: `Energy-20, +$${pay} | 25t`,
    timeCost: 25,
    available: (s) => s.player.energy >= 20,
    unavailableReason: (s) => `Not enough energy (${Math.round(s.player.energy)}) — go home and sleep!`,
    apply: applyWorkShift,
  };
}

const quitJobAction: ActionDef = {
  id: 'quit_job',
  label: 'Quit Job',
  detail: 'Leave your current position | 5t',
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
      detail: 'Education+0.2 | 15t',
      timeCost: 15,
      available: () => true,
      unavailableReason: () => '',
      apply(s) {
        return addLog({ ...s, player: { ...s.player, education: s.player.education + 0.2 } }, 'Studied independently — Education +0.2')
      },
    }]
  }

  return available.map(c => ({
    id: `course_${c.id}`,
    label: c.title,
    detail: `Edu+${c.eduPoints} | -$${c.cost} | ${c.timeCost}t`,
    timeCost: c.timeCost,
    available: (s: GameState) => s.player.money >= c.cost && s.player.energy >= 10,
    unavailableReason: (s: GameState) => {
      if (s.player.money < c.cost) return `Need $${c.cost}`
      return `Need Energy≥10`
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
function makeRepayAction(amount: number | 'all'): ActionDef {
  const isAll = amount === 'all'
  return {
    id: isAll ? 'repay_all' : `repay_${amount}`,
    label: isAll ? 'Repay All Debt' : `Repay $${amount}`,
    detail: isAll ? 'Clear all debt | 5t' : `Debt -$${amount} | 5t`,
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
      return addLog({
        ...state,
        player: {
          ...state.player,
          money: state.player.money - repay,
          debt: state.player.debt - repay,
          creditScore: Math.min(850, state.player.creditScore + 10),
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
  detail: 'Move cash → bank | 5t',
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
  detail: 'Bank→cash $200 | 5t',
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
  label: 'Personal Loan $1k',
  detail: '+$1000, Debt+1000, CreditScore-20 | 10t',
  timeCost: 10,
  available: (state) => state.player.creditScore >= 550 && state.player.debt < 8000,
  unavailableReason: (state) => {
    if (state.player.creditScore < 550) return 'Need CreditScore≥550';
    return 'Too much existing debt';
  },
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        money: state.player.money + 1000,
        debt: state.player.debt + 1000,
        creditScore: state.player.creditScore - 20,
      },
    };
  },
};

function makePropertyLoanAction(amount: number, minScore: number, scoreDrop: number): ActionDef {
  const label = `Property Loan $${(amount / 1000).toFixed(0)}k`;
  return {
    id: `property_loan_${amount}`,
    label,
    detail: `+$${amount.toLocaleString()}, Debt+${amount.toLocaleString()}, 5%/wk | 15t`,
    timeCost: 15,
    available: (s) => s.player.creditScore >= minScore && s.player.debt + amount <= 120000,
    unavailableReason: (s) => {
      if (s.player.creditScore < minScore) return `CreditScore≥${minScore}`;
      return 'Max debt $120k';
    },
    apply(s) {
      return addLog({
        ...s,
        player: { ...s.player, money: s.player.money + amount, debt: s.player.debt + amount, creditScore: s.player.creditScore - scoreDrop },
      }, `${label}: +$${amount.toLocaleString()}`);
    },
  };
}

const propertyLoan10k = makePropertyLoanAction(10000, 600, 30);
const propertyLoan25k = makePropertyLoanAction(25000, 650, 40);
const propertyLoan50k = makePropertyLoanAction(50000, 700, 60);

// --- GROCERY actions ---
const buyGroceriesAction: ActionDef = {
  id: 'buy_groceries',
  label: 'Buy Groceries',
  detail: 'Hunger+60, Health+5, -$30 | 6t',
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
  detail: 'Hunger+25, -$10 | 3t',
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
  detail: 'HasComputer, Morale+10, -$800 | 8t',
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
  detail: 'Morale+5 | 4t',
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

// --- CLOTHING actions ---
const buyOutfitAction: ActionDef = {
  id: 'buy_outfit',
  label: 'Buy an Outfit',
  detail: 'Wardrobe+1, Morale+15, -$60 | 5t',
  timeCost: 5,
  available: (state) => state.player.money >= 60,
  unavailableReason: () => 'Need $60',
  apply(state) {
    return {
      ...state,
      player: {
        ...state.player,
        wardrobe: state.player.wardrobe + 1,
        morale: cap(state.player.morale + 15),
        money: state.player.money - 60,
      },
    };
  },
};

const windowShopAction: ActionDef = {
  id: 'window_shop',
  label: 'Window Shop',
  detail: 'Morale+5 | 3t',
  timeCost: 3,
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

// --- RESTAURANT actions ---
const eatMealAction: ActionDef = {
  id: 'eat_meal',
  label: 'Eat a Meal',
  detail: 'Hunger+50, Morale+15, Energy+5, -$25 | 6t',
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
  detail: 'Hunger+25, Morale+5, -$12 | 3t',
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
  detail: 'Sell computer for $400 | 8t',
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
  detail: 'Morale+3 | 4t',
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
  detail: `$${tier.weeklyRent}/wk | E+${tier.dayEnergyBonus}/day | 10t`,
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
  detail: `$${tier.purchaseCost.toLocaleString()} | E+${tier.dayEnergyBonus}/day | 15t`,
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
  detail: 'Get 70% back, move to studio | 15t',
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
  detail: 'Morale+3 | 5t',
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
  detail: 'Health+30, -$80 | 15t',
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
  detail: 'Health+15, -$20 | 5t',
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
    const shares = state.player.portfolio[stock] ?? 0

    actions.push({
      id: `buy_${stock}`,
      label: `Buy ${stock}`,
      detail: `${name} $${price.toFixed(0)} ${changeStr} | 5t`,
      timeCost: 5,
      available: (s) => s.player.money >= (s.economy.stockPrices[stock] ?? 0),
      unavailableReason: () => `Need $${price.toFixed(0)}`,
      apply(s) {
        const p = s.economy.stockPrices[stock] ?? 0
        return addLog({
          ...s,
          player: {
            ...s.player,
            money: s.player.money - p,
            portfolio: { ...s.player.portfolio, [stock]: (s.player.portfolio[stock] ?? 0) + 1 },
          },
        }, `Bought 1 share of ${stock} @ $${p.toFixed(0)}`)
      },
    })

    actions.push({
      id: `sell_${stock}`,
      label: `Sell ${stock}`,
      detail: shares > 0
        ? `${shares} shares → $${(shares * price).toFixed(0)} | 5t`
        : 'No shares owned',
      timeCost: 5,
      available: (s) => (s.player.portfolio[stock] ?? 0) > 0,
      unavailableReason: () => 'No shares owned',
      apply(s) {
        const n = s.player.portfolio[stock] ?? 0
        const p = s.economy.stockPrices[stock] ?? 0
        const proceeds = n * p
        const newPortfolio = { ...s.player.portfolio }
        delete newPortfolio[stock]
        return addLog({
          ...s,
          player: { ...s.player, money: s.player.money + proceeds, portfolio: newPortfolio },
        }, `Sold ${n} shares of ${stock} for $${proceeds.toFixed(0)}`)
      },
    })
  }

  return actions
}

// --- PET SHOP actions (employment location) ---
const PET_SHOP_ACTIONS: ActionDef[] = PETS.map((pet) => ({
  id: `buy_pet_${pet.id}`,
  label: `Adopt ${pet.name}`,
  detail: `${pet.species} — $${pet.price} | 10t`,
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
// Returns [Apply] if unemployed, [Work, Quit] if employed here, or a disabled
// "Employed Elsewhere" stub if employed somewhere else.
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

  if (player.jobId !== null) {
    return [{
      id: 'employed_elsewhere',
      label: 'Apply for Job',
      detail: 'Quit current job first',
      timeCost: 0,
      available: () => false,
      unavailableReason: () => 'Already employed',
      apply: (s) => s,
    }];
  }

  const firstTier = CAREER_JOBS[locJob.track].tiers[0];
  const required = locJob.requiredCourses ?? []
  return [{
    id: `apply_${locationId}`,
    label: 'Apply for Job',
    detail: `${locJob.titles[0]} – $${firstTier.dailyPay}/shift | 5t`,
    timeCost: 5,
    available: () => true,
    unavailableReason: () => '',
    apply(s) {
      const completed = s.player.completedCourses ?? []
      const hasAll = required.every(c => completed.includes(c))
      if (!hasAll) {
        const hasAny = required.some(c => completed.includes(c))
        return { ...s, pendingLifeEventId: hasAny ? 'job_rejected_experience' : 'job_rejected_education' }
      }
      return addLog({
        ...s,
        player: {
          ...s.player,
          jobId: locationId,
          careerTrack: locJob.track,
          jobTenure: 0,
          jobRank: 1,
        },
      }, `Hired as ${locJob.titles[0]}!`);
    },
  }];
}

export function getActionsForLocation(locationId: LocationId, state: GameState): ActionDef[] {
  switch (locationId) {
    case 'home':
      return [sleepAction, restAction, cookMealAction, studyAtHomeAction];

    case 'employment':
      return [...PET_SHOP_ACTIONS, ...getJobActions(locationId, state)];

    case 'university':
      return [...getCourseActions(state), ...getJobActions(locationId, state)];

    case 'bank':
      return [depositAllAction, withdraw200Action, takeLoanAction, propertyLoan10k, propertyLoan25k, propertyLoan50k, repay200Action, repayAllAction, ...getJobActions(locationId, state)];

    case 'grocery':
      return [buyGroceriesAction, quickSnackAction, ...getJobActions(locationId, state)];

    case 'electronics':
      return [buyComputerAction, browseElectronicsAction, ...getJobActions(locationId, state)];

    case 'clothing':
      return [buyOutfitAction, windowShopAction, ...getJobActions(locationId, state)];

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

export function checkGoals(state: GameState): GameState {
  const { player, goals } = state;

  const portfolioValue = Object.entries(player.portfolio).reduce(
    (sum, [stock, shares]) => sum + shares * (state.economy.stockPrices[stock] ?? 0), 0
  )
  const totalWealth = player.money + player.bankBalance + portfolioValue - player.debt

  const newlyMet = {
    targetWealth: totalWealth >= goals.targetWealth,
    targetEducation: player.education >= goals.targetEducation,
    targetCareerRank: player.jobRank >= goals.targetCareerRank,
    targetHappiness: player.hunger >= 70 && player.energy >= 70 && player.health >= 70 && player.morale >= 70,
  };

  // Goals once met stay met
  const goalsMet = {
    targetWealth: state.goalsMet.targetWealth || newlyMet.targetWealth,
    targetEducation: state.goalsMet.targetEducation || newlyMet.targetEducation,
    targetCareerRank: state.goalsMet.targetCareerRank || newlyMet.targetCareerRank,
    targetHappiness: state.goalsMet.targetHappiness || newlyMet.targetHappiness,
  };

  // Health failure check
  if (player.health <= 0) {
    return {
      ...state,
      goalsMet,
      isGameOver: true,
      winCondition: 'lost',
      lossReason: 'Your health failed.',
    };
  }

  // All goals met?
  const allMet = goalsMet.targetWealth && goalsMet.targetEducation && goalsMet.targetCareerRank && goalsMet.targetHappiness;
  if (allMet) {
    return {
      ...state,
      goalsMet,
      isGameOver: true,
      winCondition: 'won',
      lossReason: null,
    };
  }

  return { ...state, goalsMet };
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

  const afterAction = action.apply(state);
  const afterTime = consumeTime(afterAction, action.timeCost);
  return checkGoals(afterTime);
}
