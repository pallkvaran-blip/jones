export interface HousingTier {
  id: string;
  name: string;
  type: 'rent' | 'own';
  weeklyRent: number;
  purchaseCost: number;
  dayEnergyBonus: number;
  weeklyMoraleBonus: number;
  description: string;
}

export const RENTAL_TIERS: HousingTier[] = [
  {
    id: 'studio',
    name: 'Studio',
    type: 'rent',
    weeklyRent: 60,
    purchaseCost: 0,
    dayEnergyBonus: 0,
    weeklyMoraleBonus: 0,
    description: 'A tiny room. Barely qualifies as a home.',
  },
  {
    id: 'apartment_basic',
    name: 'Basic Apt',
    type: 'rent',
    weeklyRent: 140,
    purchaseCost: 0,
    dayEnergyBonus: 5,
    weeklyMoraleBonus: 0,
    description: 'A modest apartment with your own kitchen.',
  },
  {
    id: 'apartment_nice',
    name: 'Nice Apt',
    type: 'rent',
    weeklyRent: 280,
    purchaseCost: 0,
    dayEnergyBonus: 10,
    weeklyMoraleBonus: 5,
    description: 'Comfortable apartment in a good building.',
  },
  {
    id: 'luxury_apt',
    name: 'Luxury Apt',
    type: 'rent',
    weeklyRent: 560,
    purchaseCost: 0,
    dayEnergyBonus: 18,
    weeklyMoraleBonus: 12,
    description: 'Concierge, gym and rooftop pool included.',
  },
  {
    id: 'penthouse',
    name: 'Penthouse',
    type: 'rent',
    weeklyRent: 1100,
    purchaseCost: 0,
    dayEnergyBonus: 28,
    weeklyMoraleBonus: 22,
    description: 'The finest rental money can buy.',
  },
];

export const OWN_TIERS: HousingTier[] = [
  {
    id: 'starter_home',
    name: 'Starter Home',
    type: 'own',
    weeklyRent: 0,
    purchaseCost: 10000,
    dayEnergyBonus: 14,
    weeklyMoraleBonus: 15,
    description: 'Your own front door — no more landlords.',
  },
  {
    id: 'nice_home',
    name: 'Nice Home',
    type: 'own',
    weeklyRent: 0,
    purchaseCost: 32000,
    dayEnergyBonus: 22,
    weeklyMoraleBonus: 25,
    description: 'A lovely home in a great neighbourhood.',
  },
  {
    id: 'mansion',
    name: 'Mansion',
    type: 'own',
    weeklyRent: 0,
    purchaseCost: 80000,
    dayEnergyBonus: 35,
    weeklyMoraleBonus: 40,
    description: 'Gates, gardens, and a 4-car garage.',
  },
];

export const ALL_HOUSING: HousingTier[] = [...RENTAL_TIERS, ...OWN_TIERS];

export function getHousingTier(id: string): HousingTier | undefined {
  return ALL_HOUSING.find(t => t.id === id);
}
