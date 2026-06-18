export interface PetDef {
  id: string
  name: string
  species: string
  price: number
  homeMoraleBonus: number   // morale added on every home action
  homeSleepEnergyBonus: number  // extra energy added when sleeping/resting
  homeStudyEduBonus: number     // extra education when studying at home
  description: string
  palette: string[]
  pixels: number[][]
  sounds: string[]
}

export const PETS: PetDef[] = [
  {
    id: 'ozzy',
    name: 'Ozzy',
    species: 'Wheaten Terrier',
    price: 200,
    homeMoraleBonus: 8,
    homeSleepEnergyBonus: 0,
    homeStudyEduBonus: 0,
    description: 'Fluffy, loyal, endlessly enthusiastic. Morale+8 on home actions.',
    palette: ['transparent','#2a1500','#f5e8c0','#d4a455','#a07830','#c8a038','#6a3808','#1a0a00'],
    pixels: [
      [0,3,3,3,3,3,3,0],
      [3,3,3,3,3,3,3,3],
      [3,3,2,2,2,2,3,3],
      [3,2,6,2,2,6,2,3],
      [3,2,2,2,2,2,2,3],
      [3,3,2,7,7,2,3,3],
      [3,3,3,3,3,3,3,3],
      [0,3,3,3,3,3,3,0],
      [0,3,3,3,3,3,3,0],
      [0,3,3,3,3,3,3,0],
      [0,3,3,0,0,3,3,0],
      [0,1,3,0,0,3,1,0],
    ],
    sounds: [
      'Woof! *wag wag*',
      'Walk time?? Walk time??',
      '*stares at your food intensely*',
      'Best. Day. EVER.',
    ],
  },
  {
    id: 'whiskers',
    name: 'Whiskers',
    species: 'Orange Tabby',
    price: 150,
    homeMoraleBonus: 5,
    homeSleepEnergyBonus: 8,
    homeStudyEduBonus: 0,
    description: 'Aloof but secretly devoted. Morale+5 home, Energy+8 when you sleep.',
    palette: ['transparent','#1a0800','#ff8c3a','#ff6a00','#e05500','#ffd0a0','#2e7d00','#111111'],
    pixels: [
      [0,0,2,3,3,2,0,0],
      [0,2,2,2,2,2,2,0],
      [2,2,5,5,5,5,2,2],
      [2,5,6,5,5,6,5,2],
      [2,5,5,5,5,5,5,2],
      [2,5,5,7,7,5,5,2],
      [0,2,2,2,2,2,2,0],
      [0,2,3,2,2,3,2,0],
      [0,2,3,3,3,3,2,0],
      [0,2,2,2,2,2,2,2],
      [0,2,2,0,0,2,2,2],
      [0,7,2,0,0,2,7,0],
    ],
    sounds: [
      '...',
      '*knocks thing off table*',
      'Feed me. Now.',
      '*ignores you royally*',
    ],
  },
  {
    id: 'polly',
    name: 'Polly',
    species: 'Green Parrot',
    price: 250,
    homeMoraleBonus: 4,
    homeSleepEnergyBonus: 0,
    homeStudyEduBonus: 0.1,
    description: 'Surprisingly motivating. Morale+4 home, Education+0.1 when you study.',
    palette: ['transparent','#0a1f00','#2d8c1e','#1a6010','#e83535','#f5c200','#4dd0e1','#f0f0e0'],
    pixels: [
      [0,0,4,4,4,4,0,0],
      [0,4,4,4,4,4,4,0],
      [0,4,7,4,4,7,4,0],
      [0,4,5,5,5,5,4,0],
      [0,0,4,4,4,4,0,0],
      [2,2,4,4,4,4,2,2],
      [2,2,2,4,4,2,2,2],
      [2,2,2,2,2,2,2,2],
      [0,2,3,6,6,3,2,0],
      [0,0,3,6,6,3,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
    ],
    sounds: [
      'Polly wants a paycheck!',
      'BUY LOW! SELL HIGH! SQUAWK!',
      'Study harder! SQUAWK!',
      'Pretty bird earns dividends!',
    ],
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    species: 'Fish Tank',
    price: 80,
    homeMoraleBonus: 3,
    homeSleepEnergyBonus: 0,
    homeStudyEduBonus: 0,
    description: 'Calming blue light. Morale+3 on every home action.',
    palette: ['transparent','#0a0a3a','#3ab4d4','#1a5a7a','#aae8f8','#f0a000','#ff4040','#22a044'],
    pixels: [
      [1,4,4,4,4,4,4,1],
      [1,4,4,4,4,4,4,1],
      [1,2,2,2,2,2,2,1],
      [1,2,5,5,5,2,2,1],
      [1,2,6,5,5,5,2,1],
      [1,2,2,5,2,2,2,1],
      [1,2,2,2,2,2,2,1],
      [1,3,7,2,7,7,3,1],
      [1,3,7,7,3,7,7,1],
      [1,3,3,3,3,3,3,1],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,0],
    ],
    sounds: [
      '*blub blub*',
      '*swims in peaceful circles*',
      '...',
      '*blub*',
    ],
  },
]

export function getPet(id: string): PetDef | undefined {
  return PETS.find(p => p.id === id)
}
