export interface HousingTier {
  id: string;
  name: string;
  weeklyRent: number;
  upgradeCost: number;
  moraleBonus: number;
  description: string;
}

export const HOUSING_TIERS: HousingTier[] = [
  {
    id: 'apartment_basic',
    name: 'Basic Apartment',
    weeklyRent: 100,
    upgradeCost: 0,
    moraleBonus: 0,
    description: 'A cramped but affordable apartment.',
  },
  {
    id: 'apartment_nice',
    name: 'Nice Apartment',
    weeklyRent: 250,
    upgradeCost: 400,
    moraleBonus: 5,
    description: 'A comfortable apartment with modern fittings.',
  },
  {
    id: 'townhouse',
    name: 'Townhouse',
    weeklyRent: 500,
    upgradeCost: 1500,
    moraleBonus: 10,
    description: 'A stylish townhouse in a decent neighbourhood.',
  },
  {
    id: 'house',
    name: 'House',
    weeklyRent: 900,
    upgradeCost: 5000,
    moraleBonus: 15,
    description: 'Your own house with a garden.',
  },
  {
    id: 'mansion',
    name: 'Mansion',
    weeklyRent: 2000,
    upgradeCost: 18000,
    moraleBonus: 25,
    description: 'A grand mansion with multiple rooms.',
  },
  {
    id: 'palace',
    name: 'Palace',
    weeklyRent: 4500,
    upgradeCost: 50000,
    moraleBonus: 40,
    description: 'An opulent palace — the pinnacle of luxury.',
  },
];

export function getHousingTier(id: string): HousingTier | undefined {
  return HOUSING_TIERS.find(t => t.id === id);
}

export function getNextHousingTier(id: string): HousingTier | undefined {
  const idx = HOUSING_TIERS.findIndex(t => t.id === id);
  if (idx === -1 || idx >= HOUSING_TIERS.length - 1) return undefined;
  return HOUSING_TIERS[idx + 1];
}
