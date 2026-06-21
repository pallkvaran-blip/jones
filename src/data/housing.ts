export interface HousingTier {
  id: string
  name: string
  purchaseCost: number
  sleepEnergyCap: number
  description: string
}

export const HOUSING_TIERS: HousingTier[] = [
  {
    id: 'rental_apt',
    name: 'Rental Apt',
    purchaseCost: 0,
    sleepEnergyCap: 100,
    description: 'Your starting home. Sleep restores up to 100 energy.',
  },
  {
    id: 'own_apt',
    name: 'Own Apartment',
    purchaseCost: 1500,
    sleepEnergyCap: 110,
    description: 'A place to call your own. Sleep restores up to 110 energy.',
  },
  {
    id: 'house',
    name: 'House',
    purchaseCost: 3000,
    sleepEnergyCap: 125,
    description: 'Room to breathe. Sleep restores up to 125 energy.',
  },
  {
    id: 'mansion',
    name: 'Mansion',
    purchaseCost: 5000,
    sleepEnergyCap: 145,
    description: 'The peak of comfort. Sleep restores up to 145 energy.',
  },
]

export function getHousingTier(id: string): HousingTier | undefined {
  return HOUSING_TIERS.find(t => t.id === id)
}
