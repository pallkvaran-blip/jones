export interface PlayerCharacterDef {
  id: string
  name: string
  gender: 'male' | 'female'
  tagline: string
  portrait: string  // path relative to BASE_URL, e.g. 'assets/portraits/player_alex.png'
}

export const PLAYER_CHARACTERS: PlayerCharacterDef[] = [
  {
    id: 'player_alex',
    name: 'Alex',
    gender: 'male',
    tagline: 'The Everyman',
    portrait: 'assets/portraits/player_alex.png',
  },
  {
    id: 'player_marcus',
    name: 'Marcus',
    gender: 'male',
    tagline: 'The Go-Getter',
    portrait: 'assets/portraits/player_marcus.png',
  },
  {
    id: 'player_daniel',
    name: 'Daniel',
    gender: 'male',
    tagline: 'The Thinker',
    portrait: 'assets/portraits/player_daniel.png',
  },
  {
    id: 'player_victor',
    name: 'Victor',
    gender: 'male',
    tagline: 'The Veteran',
    portrait: 'assets/portraits/player_victor.png',
  },
  {
    id: 'player_emma',
    name: 'Emma',
    gender: 'female',
    tagline: 'The Optimist',
    portrait: 'assets/portraits/player_emma.png',
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
