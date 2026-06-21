export interface PetDef {
  id: string
  name: string
  species: string
  price: number
  homeMoraleBonus: number   // morale added on every home action
  homeSleepEnergyBonus: number  // extra energy added when sleeping/resting
  homeStudyEduBonus: number     // extra education when studying at home
  description: string
  portrait?: string
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
    portrait: '/assets/portraits/pet_ozzy.png',
    // Ozzy: fluffy cream/wheat colored face, round dark eyes, black nose, floppy ears
    palette: [
      'transparent', // 0
      '#2a1500',     // 1 very dark brown
      '#f5e8c0',     // 2 cream/wheat fur
      '#d4a455',     // 3 wheat/tan fur
      '#a07830',     // 4 darker tan fur
      '#c8a038',     // 5 medium tan
      '#6a3808',     // 6 dark brown (nose/eyes)
      '#1a0a00',     // 7 near black (pupils)
      '#e8d4a0',     // 8 light cream highlight
      '#f0e8d0',     // 9 pale cream
      '#b08830',     // 10 ear fur darker
      '#ffffff',     // 11 eye white highlight
    ],
    pixels: [
      // Row 0: fluffy top of head
      [0, 0, 3, 4, 3, 2, 2, 2, 2, 2, 3, 4, 3, 0, 0, 0],
      // Row 1: fluffy head top
      [0, 3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0, 0],
      // Row 2: floppy ears begin
      [3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0],
      // Row 3: floppy ears / face top
      [4, 10, 3, 9, 2, 2, 2, 2, 2, 2, 2, 9, 3, 10, 4, 0],
      // Row 4: ears down / forehead fur
      [4, 10, 3, 9, 8, 2, 2, 2, 2, 2, 8, 9, 3, 10, 4, 0],
      // Row 5: ears / brow fur
      [3, 10, 3, 2, 2, 2, 3, 2, 3, 2, 2, 2, 3, 10, 3, 0],
      // Row 6: ears / eye area fur
      [3, 10, 2, 2, 3, 3, 2, 2, 2, 3, 3, 2, 2, 10, 3, 0],
      // Row 7: round dark eyes
      [3, 10, 2, 2, 7, 6, 2, 2, 2, 6, 7, 2, 2, 10, 3, 0],
      // Row 8: eye shine / under eyes
      [3, 10, 2, 2, 6, 11, 2, 2, 2, 11, 6, 2, 2, 10, 3, 0],
      // Row 9: cheek fur / muzzle top
      [0, 3, 2, 8, 2, 2, 2, 2, 2, 2, 2, 8, 2, 3, 0, 0],
      // Row 10: muzzle area
      [0, 3, 2, 2, 9, 9, 9, 9, 9, 9, 9, 2, 2, 3, 0, 0],
      // Row 11: nose on muzzle
      [0, 3, 2, 2, 9, 9, 6, 6, 6, 9, 9, 2, 2, 3, 0, 0],
      // Row 12: nostrils / upper lip
      [0, 3, 3, 2, 9, 9, 7, 9, 7, 9, 9, 2, 3, 3, 0, 0],
      // Row 13: mouth
      [0, 0, 3, 2, 9, 2, 2, 2, 2, 2, 9, 2, 3, 0, 0, 0],
      // Row 14: chin fur
      [0, 0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0, 0],
      // Row 15: chest fur
      [0, 0, 3, 4, 3, 2, 2, 2, 2, 2, 3, 4, 3, 0, 0, 0],
      // Row 16: chest fluff
      [0, 3, 4, 3, 3, 2, 2, 2, 2, 3, 3, 4, 3, 0, 0, 0],
      // Row 17: paws visible
      [0, 3, 3, 4, 3, 3, 2, 2, 3, 3, 4, 3, 3, 0, 0, 0],
      // Row 18: front paws
      [0, 0, 3, 3, 4, 3, 3, 3, 3, 4, 3, 3, 0, 0, 0, 0],
      // Row 19: paw toes
      [0, 0, 0, 6, 3, 6, 3, 3, 6, 3, 6, 0, 0, 0, 0, 0],
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
    portrait: '/assets/portraits/pet_whiskers.png',
    // Whiskers: orange striped face, green eyes, white muzzle, pink nose, pointy ears
    palette: [
      'transparent', // 0
      '#1a0800',     // 1 very dark
      '#ff8c3a',     // 2 orange fur
      '#ff6a00',     // 3 darker orange stripe
      '#e05500',     // 4 deep orange
      '#ffd0a0',     // 5 white/cream muzzle
      '#2e8c00',     // 6 green eyes
      '#111111',     // 7 black pupils
      '#ff9999',     // 8 pink nose
      '#ffb060',     // 9 lighter orange
      '#00aa00',     // 10 bright green eye
      '#ffffff',     // 11 eye highlight
    ],
    pixels: [
      // Row 0: pointy ears top
      [0, 0, 4, 2, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 0, 0],
      // Row 1: pointy ears
      [0, 3, 4, 2, 3, 0, 0, 0, 0, 3, 2, 4, 3, 0, 0, 0],
      // Row 2: ears wider
      [0, 3, 3, 4, 2, 2, 2, 2, 2, 2, 4, 3, 3, 0, 0, 0],
      // Row 3: ear base / head top
      [0, 3, 2, 3, 2, 2, 2, 2, 2, 2, 3, 2, 3, 0, 0, 0],
      // Row 4: forehead with stripes
      [0, 2, 9, 2, 2, 2, 2, 2, 2, 2, 2, 9, 2, 0, 0, 0],
      // Row 5: tabby stripes on forehead
      [0, 2, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 2, 0, 0, 0],
      // Row 6: brow / eye prep
      [0, 2, 2, 2, 3, 3, 2, 2, 3, 3, 2, 2, 2, 0, 0, 0],
      // Row 7: bright green eyes
      [0, 1, 2, 2, 10, 6, 2, 2, 2, 6, 10, 2, 2, 1, 0, 0],
      // Row 8: eyes with pupil and highlight
      [0, 1, 2, 2, 6, 7, 11, 2, 11, 7, 6, 2, 2, 1, 0, 0],
      // Row 9: under eyes / whisker area
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
      // Row 10: stripe pattern on cheeks
      [0, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0],
      // Row 11: muzzle white area begins
      [0, 1, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 1, 0, 0],
      // Row 12: pink nose on white muzzle
      [0, 1, 2, 5, 5, 8, 8, 8, 8, 8, 5, 5, 2, 1, 0, 0],
      // Row 13: nostrils / mouth
      [0, 1, 2, 5, 5, 5, 7, 5, 7, 5, 5, 5, 2, 1, 0, 0],
      // Row 14: chin
      [0, 0, 1, 2, 5, 5, 5, 5, 5, 5, 5, 2, 1, 0, 0, 0],
      // Row 15: neck fur
      [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
      // Row 16: chest / tabby stripe
      [0, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 0, 0, 0],
      // Row 17: chest fur
      [0, 2, 2, 3, 2, 5, 5, 5, 5, 2, 3, 2, 2, 0, 0, 0],
      // Row 18: lower chest
      [0, 0, 2, 2, 5, 5, 2, 2, 5, 5, 2, 2, 0, 0, 0, 0],
      // Row 19: paws
      [0, 0, 0, 2, 5, 2, 2, 2, 2, 5, 2, 0, 0, 0, 0, 0],
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
    portrait: '/assets/portraits/pet_polly.png',
    // Polly: bright green feathers, yellow beak, orange/red around eyes, crest feathers
    palette: [
      'transparent', // 0
      '#0a1f00',     // 1 very dark green
      '#2d8c1e',     // 2 bright green feathers
      '#1a6010',     // 3 dark green
      '#e83535',     // 4 red around eyes
      '#f5c200',     // 5 yellow beak
      '#4dd0e1',     // 6 light blue wing accent
      '#f0f0e0',     // 7 pale feather highlight
      '#c8a800',     // 8 dark yellow beak
      '#ff6600',     // 9 orange-red
      '#44cc44',     // 10 lighter green
      '#ffdd00',     // 11 bright yellow crest tips
    ],
    pixels: [
      // Row 0: crest feathers (bright tips)
      [0, 0, 0, 3, 11, 3, 11, 11, 11, 3, 11, 3, 0, 0, 0, 0],
      // Row 1: crest feathers
      [0, 0, 3, 5, 3, 2, 3, 2, 3, 2, 3, 5, 3, 0, 0, 0],
      // Row 2: crest base / head top
      [0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0],
      // Row 3: head
      [0, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0],
      // Row 4: forehead feathers
      [0, 3, 2, 10, 2, 2, 2, 2, 2, 2, 10, 2, 2, 3, 0, 0],
      // Row 5: face feathers
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      // Row 6: eye ring (red/orange) start
      [0, 3, 2, 2, 4, 9, 4, 2, 4, 9, 4, 2, 2, 3, 0, 0],
      // Row 7: eyes (dark with highlight)
      [0, 3, 2, 2, 9, 1, 7, 2, 7, 1, 9, 2, 2, 3, 0, 0],
      // Row 8: eye ring bottom
      [0, 3, 2, 2, 4, 9, 4, 2, 4, 9, 4, 2, 2, 3, 0, 0],
      // Row 9: cheek feathers
      [0, 3, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 3, 0, 0],
      // Row 10: beak area
      [0, 1, 3, 2, 2, 2, 5, 5, 5, 2, 2, 2, 3, 1, 0, 0],
      // Row 11: beak upper
      [0, 0, 3, 2, 2, 5, 8, 8, 8, 5, 2, 2, 3, 0, 0, 0],
      // Row 12: beak hook
      [0, 0, 3, 2, 2, 8, 8, 8, 8, 8, 2, 2, 3, 0, 0, 0],
      // Row 13: lower beak
      [0, 0, 3, 2, 2, 2, 5, 5, 5, 2, 2, 2, 3, 0, 0, 0],
      // Row 14: chin / throat
      [0, 0, 1, 3, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0, 0],
      // Row 15: breast feathers
      [0, 0, 3, 2, 10, 2, 2, 2, 2, 10, 2, 2, 3, 0, 0, 0],
      // Row 16: chest / wing feathers
      [0, 3, 6, 3, 2, 2, 2, 2, 2, 2, 2, 3, 6, 3, 0, 0],
      // Row 17: wing accent
      [0, 3, 6, 3, 3, 2, 2, 2, 2, 3, 3, 6, 3, 3, 0, 0],
      // Row 18: lower wing
      [0, 1, 3, 6, 3, 3, 2, 2, 3, 3, 6, 3, 3, 1, 0, 0],
      // Row 19: wing tips / feet
      [0, 0, 1, 3, 6, 3, 3, 3, 3, 6, 3, 1, 0, 0, 0, 0],
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
    portrait: '/assets/portraits/pet_bubbles.png',
    // Bubbles: rectangular aquarium frame viewed head-on, blue water, colorful fish inside
    palette: [
      'transparent', // 0
      '#0a0a3a',     // 1 dark frame
      '#3ab4d4',     // 2 blue water
      '#1a5a7a',     // 3 darker water
      '#aae8f8',     // 4 light water highlight
      '#f0a000',     // 5 orange fish
      '#ff4040',     // 6 red fish
      '#22a044',     // 7 green plant
      '#1a7a34',     // 8 dark green plant
      '#c8c8c8',     // 9 frame highlight
      '#f5f090',     // 10 yellow fish
      '#ffffff',     // 11 bubble white
    ],
    pixels: [
      // Row 0: top frame thick bar
      [1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 0],
      // Row 1: top frame
      [1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 0, 0],
      // Row 2: water start
      [1, 1, 2, 4, 4, 4, 4, 4, 4, 4, 2, 2, 1, 1, 0, 0],
      // Row 3: fish area top
      [1, 1, 2, 2, 5, 5, 5, 2, 2, 2, 4, 2, 1, 1, 0, 0],
      // Row 4: orange fish
      [1, 1, 2, 5, 5, 5, 5, 5, 2, 11, 2, 2, 1, 1, 0, 0],
      // Row 5: orange fish tail
      [1, 1, 2, 2, 5, 5, 5, 2, 2, 2, 2, 2, 1, 1, 0, 0],
      // Row 6: middle water
      [1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 0, 0],
      // Row 7: red fish swimming
      [1, 1, 2, 2, 6, 6, 6, 2, 10, 10, 2, 2, 1, 1, 0, 0],
      // Row 8: red and yellow fish
      [1, 1, 2, 6, 6, 6, 6, 6, 10, 10, 10, 2, 1, 1, 0, 0],
      // Row 9: fish tails / bubbles
      [1, 1, 2, 2, 6, 6, 2, 11, 10, 10, 2, 2, 1, 1, 0, 0],
      // Row 10: lower water / plant
      [1, 1, 2, 2, 11, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0],
      // Row 11: plant area
      [1, 1, 2, 8, 7, 7, 2, 2, 7, 8, 2, 2, 1, 1, 0, 0],
      // Row 12: plants growing
      [1, 1, 2, 8, 7, 8, 7, 7, 8, 7, 8, 2, 1, 1, 0, 0],
      // Row 13: gravel / plants
      [1, 1, 3, 8, 8, 7, 8, 8, 7, 8, 8, 3, 1, 1, 0, 0],
      // Row 14: gravel
      [1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0],
      // Row 15: bottom frame start
      [1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0],
      // Row 16: bottom frame
      [1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 0, 0],
      // Row 17: bottom frame thick bar
      [1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 0],
      // Row 18: stand/base
      [0, 0, 1, 1, 9, 9, 9, 9, 9, 1, 1, 0, 0, 0, 0, 0],
      // Row 19: stand feet
      [0, 0, 0, 1, 1, 9, 9, 9, 1, 1, 0, 0, 0, 0, 0, 0],
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
