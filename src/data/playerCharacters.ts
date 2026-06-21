export interface PlayerCharacterDef {
  id: string
  name: string
  gender: 'male' | 'female'
  tagline: string
  portrait: string  // path relative to BASE_URL, e.g. 'assets/portraits/player_tyler.png'
}

export const PLAYER_CHARACTERS: PlayerCharacterDef[] = [
  {
    id: 'player_tyler',
    name: 'Tyler',
    gender: 'male',
    tagline: 'The Cool Guy',
    portrait: 'assets/portraits/player_tyler.png',
  },
  {
    id: 'player_rex',
    name: 'Rex',
    gender: 'male',
    tagline: 'The Punk',
    portrait: 'assets/portraits/player_rex.png',
  },
  {
    id: 'player_ash',
    name: 'Ash',
    gender: 'male',
    tagline: 'The Brooder',
    portrait: 'assets/portraits/player_ash.png',
  },
  {
    id: 'player_victor',
    name: 'Victor',
    gender: 'male',
    tagline: 'The Veteran',
    portrait: 'assets/portraits/player_victor.png',
  },
  {
    id: 'player_vera',
    name: 'Vera',
    gender: 'female',
    tagline: 'The Elder',
    portrait: 'assets/portraits/player_vera.png',
  },
  {
    id: 'player_zoe',
    name: 'Zoe',
    gender: 'female',
    tagline: 'The Rebel',
    portrait: 'assets/portraits/player_zoe.png',
  },
  {
    id: 'player_maya',
    name: 'Maya',
    gender: 'female',
    tagline: 'The Strategist',
    portrait: 'assets/portraits/player_maya.png',
  },
  {
    id: 'player_rosa',
    name: 'Rosa',
    gender: 'female',
    tagline: 'The Heart',
    portrait: 'assets/portraits/player_rosa.png',
  },
]

export function getPlayerCharacter(id: string): PlayerCharacterDef | undefined {
  return PLAYER_CHARACTERS.find((c) => c.id === id)
}
