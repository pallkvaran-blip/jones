export interface CharacterDef {
  name: string
  // 12–16 palette entries: [0]=transparent, rest are colors used in the portrait
  palette: string[]
  // 20 rows × 16 cols, each value is a palette index (0 = skip/transparent)
  pixels: number[][]
  lines: string[]
}

export const CHARACTERS: Record<string, CharacterDef> = {
  home: {
    name: 'Harold',
    // Harold: casual middle-aged guy, messy brown hair, stubble, home clothes
    palette: [
      'transparent', // 0
      '#2a1200',     // 1 very dark brown (hair shadow)
      '#f0c090',     // 2 skin tone
      '#7a4a20',     // 3 medium brown hair
      '#a06830',     // 4 lighter brown hair
      '#d09060',     // 5 skin highlight
      '#c08050',     // 6 skin shadow
      '#5a8ac8',     // 7 blue shirt
      '#3a6aaa',     // 8 darker blue shirt
      '#e0a070',     // 9 warm skin
      '#b07840',     // 10 stubble
      '#ffffff',     // 11 white undershirt
    ],
    pixels: [
      [0, 0, 1, 3, 3, 4, 3, 1, 1, 3, 4, 3, 1, 0, 0, 0],
      [0, 1, 3, 4, 3, 3, 4, 4, 4, 3, 3, 4, 3, 1, 0, 0],
      [0, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 0, 0],
      [0, 3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 2, 6, 6, 2, 2, 2, 6, 6, 2, 2, 1, 0, 0],
      [0, 3, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 3, 0, 0],
      [0, 3, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 10, 10, 2, 2, 2, 2, 2, 10, 10, 2, 3, 0, 0],
      [0, 3, 9, 2, 2, 1, 1, 1, 1, 1, 2, 2, 9, 3, 0, 0],
      [0, 3, 2, 10, 2, 2, 2, 2, 2, 2, 2, 10, 2, 3, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0],
      [0, 0, 7, 11, 11, 11, 2, 2, 11, 11, 11, 7, 0, 0, 0, 0],
      [0, 7, 8, 7, 7, 11, 11, 11, 11, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 11, 11, 7, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "My couch won't judge you.",
      "Napping is basically free energy recovery.",
      "Home-cooked meals beat takeout any day.",
      "Pro tip: elastic waistbands change lives.",
    ],
  },

  employment: {
    name: 'Rex',
    // Rex: pet shop owner, dark hair, green apron, friendly smile
    palette: [
      'transparent', // 0
      '#1a0800',     // 1 very dark brown
      '#f5c8a0',     // 2 skin tone
      '#3a1800',     // 3 dark hair
      '#5a3010',     // 4 medium dark hair
      '#e8b888',     // 5 skin highlight
      '#c8986c',     // 6 skin shadow
      '#2e7d32',     // 7 green apron
      '#1b5e20',     // 8 dark green apron
      '#f0e0d0',     // 9 white undershirt
      '#8d6e63',     // 10 beard shadow
      '#4caf50',     // 11 apron highlight
    ],
    pixels: [
      [0, 0, 1, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3, 1, 0, 0],
      [0, 1, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 1, 0],
      [0, 3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0, 0],
      [0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0],
      [0, 3, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 3, 0, 0],
      [0, 3, 2, 2, 1, 2, 5, 2, 5, 2, 1, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 1, 1, 1, 1, 1, 2, 2, 5, 3, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0],
      [0, 0, 7, 9, 9, 9, 2, 2, 9, 9, 9, 7, 0, 0, 0, 0],
      [0, 7, 8, 7, 7, 9, 9, 9, 9, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 11, 7, 7, 7, 7, 7, 7, 11, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 11, 7, 7, 7, 7, 11, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "Every apartment needs a furry friend.",
      "Ozzy has been here 3 years. Very loyal.",
      "Pets don't care about your credit score.",
      "They make the bad days bearable.",
    ],
  },

  university: {
    name: 'Prof. Aldric',
    // Prof. Aldric: elderly professor, grey hair, round glasses, dark academic robes
    palette: [
      'transparent', // 0
      '#222222',     // 1 dark
      '#f0d5b0',     // 2 pale aged skin
      '#999999',     // 3 silver/grey hair
      '#cccccc',     // 4 light grey hair
      '#e8c898',     // 5 skin highlight
      '#c8a878',     // 6 skin shadow
      '#1a2040',     // 7 dark academic robe
      '#2a3050',     // 8 robe lighter
      '#d4a017',     // 9 gold robe trim
      '#7ab8e0',     // 10 glasses lens tint
      '#555555',     // 11 glasses frame
    ],
    pixels: [
      [0, 0, 3, 4, 3, 4, 4, 4, 4, 4, 4, 3, 4, 3, 0, 0],
      [0, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3, 4, 3, 0],
      [0, 3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 3, 0, 0],
      [0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0],
      [0, 3, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 3, 0, 0],
      [0, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1, 0, 0],
      [0, 3, 2, 11, 11, 11, 2, 11, 2, 11, 11, 11, 2, 3, 0, 0],
      [0, 3, 11, 10, 1, 10, 11, 11, 11, 10, 1, 10, 11, 3, 0, 0],
      [0, 3, 2, 11, 11, 11, 2, 11, 2, 11, 11, 11, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3, 2, 3, 0, 0],
      [0, 3, 6, 2, 2, 1, 1, 1, 1, 1, 2, 2, 6, 3, 0, 0],
      [0, 3, 2, 4, 4, 2, 2, 2, 2, 2, 4, 4, 2, 3, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0],
      [0, 0, 7, 7, 9, 9, 2, 2, 9, 9, 7, 7, 0, 0, 0, 0],
      [0, 7, 8, 7, 9, 7, 7, 7, 7, 7, 9, 7, 8, 7, 0, 0],
      [7, 8, 7, 7, 9, 7, 7, 7, 7, 7, 9, 7, 7, 8, 7, 0],
      [7, 7, 8, 7, 9, 7, 7, 7, 7, 7, 9, 7, 8, 7, 7, 0],
      [0, 7, 7, 8, 9, 7, 7, 7, 7, 9, 7, 8, 7, 7, 0, 0],
    ],
    lines: [
      "Education compounds like interest. Invest wisely.",
      "Every class is a deposit in your future.",
      "I have tenure. It is very, very powerful.",
      "My students call me intimidating. I prefer 'motivating'.",
    ],
  },

  bank: {
    name: 'Sandra',
    // Sandra: professional banker, dark styled hair, navy suit, small earrings
    palette: [
      'transparent', // 0
      '#0d0d0d',     // 1 near black
      '#f5c8a0',     // 2 skin tone
      '#1a1a1a',     // 3 dark hair
      '#333333',     // 4 hair highlight
      '#e8b888',     // 5 skin highlight
      '#c89868',     // 6 skin shadow
      '#1e3060',     // 7 navy suit
      '#162448',     // 8 dark navy
      '#d4a017',     // 9 gold earrings
      '#f0f0f0',     // 10 white blouse
      '#8899cc',     // 11 suit highlight
    ],
    pixels: [
      [0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0],
      [0, 1, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 1, 0],
      [0, 3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0, 0],
      [0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0],
      [0, 3, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 3, 0, 0],
      [9, 3, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 3, 9, 0],
      [9, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 9, 0],
      [9, 3, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 3, 9, 0],
      [0, 3, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 1, 2, 1, 2, 1, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 3, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0],
      [0, 0, 7, 10, 10, 10, 2, 2, 10, 10, 10, 7, 0, 0, 0, 0],
      [0, 7, 8, 7, 7, 10, 10, 10, 10, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 10, 10, 7, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "Debt has feelings. They're expensive.",
      "Compound interest: the 8th wonder of the world.",
      "Your credit score is basically your reputation.",
      "Your future self called. Save more.",
    ],
  },

  grocery: {
    name: 'Dmitri',
    // Dmitri: grocery worker, dark hair, green apron/cap, friendly look
    palette: [
      'transparent', // 0
      '#1a0a00',     // 1 dark brown
      '#f5b8a0',     // 2 warm skin tone
      '#3a1800',     // 3 dark hair
      '#5a2a08',     // 4 medium dark hair
      '#e8a888',     // 5 skin highlight
      '#c88868',     // 6 skin shadow
      '#2e7d32',     // 7 green apron/cap
      '#1b5e20',     // 8 dark green
      '#f5f5f5',     // 9 white shirt
      '#4caf50',     // 10 green cap highlight
      '#81c784',     // 11 lighter green accent
    ],
    pixels: [
      [0, 0, 7, 7, 10, 10, 10, 10, 10, 10, 7, 7, 0, 0, 0, 0],
      [0, 7, 10, 7, 7, 7, 7, 7, 7, 7, 7, 10, 7, 0, 0, 0],
      [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0],
      [0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0],
      [0, 3, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 3, 0, 0],
      [0, 3, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 1, 2, 2, 2, 2, 2, 1, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 3, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0],
      [0, 0, 7, 9, 9, 9, 2, 2, 9, 9, 9, 7, 0, 0, 0, 0],
      [0, 7, 8, 7, 7, 9, 9, 9, 9, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 11, 7, 7, 7, 7, 11, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "An apple a day is cheaper than a doctor.",
      "Groceries: the fuel behind every hustle.",
      "Never shop on an empty stomach. Trust me.",
      "Potatoes go with absolutely everything.",
    ],
  },

  electronics: {
    name: 'Kenji',
    // Kenji: tech store guy, black hair, glasses (blue tint), blue shirt
    palette: [
      'transparent', // 0
      '#111111',     // 1 black
      '#fcd5b0',     // 2 skin tone
      '#111111',     // 3 black hair (same as 1)
      '#2a2a2a',     // 4 dark hair highlight
      '#ffe0c0',     // 5 skin highlight
      '#d8b090',     // 6 skin shadow
      '#2a4c7a',     // 7 blue shirt
      '#1a3060',     // 8 dark blue shirt
      '#00e5ff',     // 9 glasses lens blue
      '#333333',     // 10 glasses frame
      '#60a0d0',     // 11 shirt highlight
    ],
    pixels: [
      [0, 0, 1, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3, 1, 0, 0],
      [0, 1, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 1, 0],
      [0, 3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0, 0],
      [0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0],
      [0, 3, 2, 10, 10, 10, 2, 10, 2, 10, 10, 10, 2, 3, 0, 0],
      [0, 3, 10, 9, 1, 9, 10, 10, 10, 9, 1, 9, 10, 3, 0, 0],
      [0, 3, 2, 10, 10, 10, 2, 10, 2, 10, 10, 10, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 1, 2, 2, 1, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 3, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0],
      [0, 0, 7, 7, 7, 7, 2, 2, 7, 7, 7, 7, 0, 0, 0, 0],
      [0, 7, 8, 7, 7, 7, 11, 11, 7, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 11, 11, 7, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "This computer will genuinely change your life.",
      "Buy now. Regret? Not in my vocabulary.",
      "Tech depreciates. Your skills don't.",
      "I've rebuilt my PC from scratch 7 times. For fun.",
    ],
  },

  clothing: {
    name: 'Valentina',
    // Valentina: fashionable, red-tipped dark hair, big earrings, pink jacket
    palette: [
      'transparent', // 0
      '#220000',     // 1 very dark
      '#f5c8a0',     // 2 skin tone
      '#cc2200',     // 3 red hair tips
      '#111111',     // 4 dark hair base
      '#e8b888',     // 5 skin highlight
      '#c89868',     // 6 skin shadow
      '#e91e8c',     // 7 pink jacket
      '#c0156e',     // 8 dark pink
      '#ffd700',     // 9 gold earrings
      '#ff6060',     // 10 lipstick
      '#ff8080',     // 11 lip highlight
    ],
    pixels: [
      [0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 0, 0, 0],
      [0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 0, 0],
      [3, 4, 4, 3, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 3, 0],
      [3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0],
      [0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 0, 0],
      [0, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0],
      [0, 4, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 4, 0, 0],
      [9, 4, 2, 2, 1, 2, 5, 2, 5, 2, 1, 2, 2, 4, 9, 0],
      [9, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 9, 0],
      [9, 4, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 4, 9, 0],
      [9, 4, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 4, 9, 0],
      [0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 0, 0],
      [0, 4, 5, 2, 10, 10, 11, 10, 11, 10, 10, 2, 5, 4, 0, 0],
      [0, 4, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 4, 0, 0],
      [0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 0, 0, 0],
      [0, 0, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0],
      [0, 7, 8, 7, 7, 2, 2, 2, 2, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 2, 2, 7, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0],
      [3, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 3, 0, 0],
    ],
    lines: [
      "Dress for the job you want, not the debt you have.",
      "Confidence is an outfit. Wear it every single day.",
      "Fashion fades. Style is eternal.",
      "We can't put a price on fabulous. Actually we can.",
    ],
  },

  restaurant: {
    name: 'Lenny',
    // Lenny: fast food worker, chef's hat, red shirt, cheerful grin
    palette: [
      'transparent', // 0
      '#1a0a00',     // 1 dark brown
      '#f5c8a0',     // 2 skin tone
      '#e8a878',     // 3 warm skin shadow
      '#c0392b',     // 4 red shirt
      '#9b1a10',     // 5 dark red shirt
      '#f5c200',     // 6 chef hat yellow band
      '#f8f8f8',     // 7 white chef hat
      '#d0d0d0',     // 8 chef hat shadow
      '#d4a017',     // 9 hat band gold
      '#ffffff',     // 10 bright white
      '#ff6060',     // 11 rosy cheeks
    ],
    pixels: [
      [0, 0, 10, 7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 0, 0, 0],
      [0, 10, 7, 7, 8, 7, 7, 7, 7, 7, 8, 7, 7, 10, 0, 0],
      [0, 10, 7, 8, 7, 7, 7, 7, 7, 7, 7, 8, 7, 10, 0, 0],
      [0, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 0, 0],
      [0, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0],
      [0, 1, 11, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0],
      [0, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0],
      [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 0, 0, 0, 0],
      [0, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0, 0],
      [4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 0, 0],
      [4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 0, 0],
      [0, 4, 4, 5, 4, 4, 4, 4, 4, 4, 5, 4, 4, 0, 0, 0],
    ],
    lines: [
      "You literally cannot work on an empty stomach.",
      "Today's special? Whatever's still in the back.",
      "Eat good, feel good, work good. Simple math.",
      "I started as a dishwasher. Now I manage the dishwasher.",
    ],
  },

  pawn: {
    name: 'Duke',
    // Duke: tough-looking pawn shop owner, stubble, dark vest, sly expression
    palette: [
      'transparent', // 0
      '#111111',     // 1 black
      '#e8b88a',     // 2 skin tone
      '#333333',     // 3 dark hair (short/scruffy)
      '#555555',     // 4 grey stubble
      '#d09068',     // 5 skin shadow
      '#c0c0c0',     // 6 silver
      '#3a2010',     // 7 dark vest
      '#2a1000',     // 8 very dark vest
      '#ffffff',     // 9 white shirt under vest
      '#888888',     // 10 stubble shadow
      '#f0a060',     // 11 skin highlight
    ],
    pixels: [
      [0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0],
      [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0],
      [0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1, 0, 0],
      [0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 6, 2, 2, 2, 2, 2, 6, 2, 2, 1, 0, 0],
      [0, 1, 2, 5, 2, 2, 2, 2, 2, 2, 2, 5, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 5, 2, 5, 2, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 5, 5, 5, 5, 5, 2, 2, 2, 1, 0, 0],
      [0, 1, 4, 10, 4, 2, 2, 2, 2, 2, 4, 10, 4, 1, 0, 0],
      [0, 1, 2, 4, 2, 2, 1, 2, 2, 1, 2, 4, 2, 1, 0, 0],
      [0, 1, 4, 4, 10, 2, 1, 1, 1, 2, 10, 4, 4, 1, 0, 0],
      [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 7, 9, 9, 9, 2, 2, 9, 9, 9, 7, 0, 0, 0, 0],
      [0, 7, 8, 7, 7, 9, 9, 9, 9, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 9, 9, 7, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "Everything has value. Absolutely everything.",
      "One man's junk is my entire inventory.",
      "I never ask where it came from.",
      "The economy is organized trading. I'm very organized.",
    ],
  },

  realty: {
    name: 'Clarissa',
    // Clarissa: real estate agent, styled brown hair, navy blazer, pearl necklace
    palette: [
      'transparent', // 0
      '#111111',     // 1 dark
      '#f5c8a0',     // 2 skin tone
      '#6b3a1f',     // 3 brown hair
      '#8a5a30',     // 4 lighter brown hair
      '#e8b888',     // 5 skin highlight
      '#c89868',     // 6 skin shadow
      '#1e3060',     // 7 navy blazer
      '#162448',     // 8 dark navy
      '#f0f0f0',     // 9 white blouse
      '#e8e8e8',     // 10 pearl necklace
      '#d4a017',     // 11 gold accent
    ],
    pixels: [
      [0, 0, 3, 4, 3, 3, 4, 4, 4, 4, 3, 3, 4, 3, 0, 0],
      [0, 3, 4, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 4, 3, 0],
      [3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0],
      [3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 3, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0],
      [0, 3, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 3, 0, 0],
      [0, 3, 2, 2, 1, 5, 2, 2, 2, 5, 1, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 1, 2, 2, 2, 1, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 3, 0, 0],
      [0, 0, 3, 10, 10, 2, 2, 2, 2, 2, 10, 10, 3, 0, 0, 0],
      [0, 0, 7, 9, 9, 9, 2, 2, 9, 9, 9, 7, 0, 0, 0, 0],
      [0, 7, 8, 7, 7, 9, 9, 9, 9, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 9, 9, 7, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "Location, location, location. Also: location.",
      "Real estate always goes up. Eventually.",
      "A mortgage is just a very long subscription.",
      "Your home is your biggest asset. Buy wisely.",
    ],
  },

  hospital: {
    name: 'Dr. Chen',
    // Dr. Chen: doctor, dark hair, white coat, stethoscope visible
    palette: [
      'transparent', // 0
      '#111111',     // 1 black
      '#fcd5b0',     // 2 light skin tone
      '#1a1a1a',     // 3 black hair
      '#333333',     // 4 dark hair highlight
      '#ffe0c0',     // 5 skin highlight
      '#d0a888',     // 6 skin shadow
      '#f0f0f0',     // 7 white coat
      '#d8d8d8',     // 8 coat shadow
      '#00796b',     // 9 teal scrubs
      '#c0392b',     // 10 red cross / stethoscope
      '#b0b0b0',     // 11 stethoscope metal
    ],
    pixels: [
      [0, 0, 1, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3, 1, 0, 0],
      [0, 1, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 1, 0],
      [0, 3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0, 0],
      [0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0],
      [0, 3, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 3, 0, 0],
      [0, 3, 2, 2, 1, 2, 5, 2, 5, 2, 1, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 6, 2, 6, 2, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 5, 2, 2, 2, 1, 1, 1, 2, 2, 2, 5, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0],
      [0, 10, 7, 7, 7, 7, 2, 2, 7, 7, 7, 7, 10, 0, 0, 0],
      [0, 7, 8, 7, 7, 7, 10, 10, 7, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 11, 11, 7, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "Prevention is always cheaper than treatment.",
      "Eat, sleep, hydrate. In that exact order.",
      "Your health bar is your most important stat.",
      "Stress kills careers early. Get regular checkups.",
    ],
  },

  stockexchange: {
    name: 'Max',
    // Max: wall street trader, slicked back hair, expensive tie, intense eyes
    palette: [
      'transparent', // 0
      '#111111',     // 1 black
      '#f5c8a0',     // 2 skin tone
      '#2a1800',     // 3 very dark hair
      '#3a2810',     // 4 dark hair highlight
      '#e8b888',     // 5 skin highlight
      '#c89868',     // 6 skin shadow
      '#1a1a2a',     // 7 dark suit
      '#0a0a1a',     // 8 very dark suit
      '#d4a017',     // 9 gold tie
      '#c08000',     // 10 dark gold tie
      '#f0f0f0',     // 11 white shirt
    ],
    pixels: [
      [0, 0, 1, 3, 3, 4, 3, 3, 3, 3, 4, 3, 3, 1, 0, 0],
      [0, 1, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3, 3, 1, 0],
      [0, 3, 4, 3, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 0, 0],
      [0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0],
      [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0],
      [0, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1, 0, 0],
      [0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0],
      [0, 1, 2, 5, 2, 2, 2, 2, 2, 2, 2, 5, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 6, 2, 6, 2, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
      [0, 1, 5, 2, 2, 1, 2, 2, 2, 1, 2, 2, 5, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0],
      [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 7, 11, 11, 9, 9, 9, 9, 9, 11, 11, 7, 0, 0, 0],
      [0, 7, 8, 7, 7, 7, 9, 10, 9, 7, 7, 8, 7, 0, 0, 0],
      [7, 8, 7, 7, 7, 7, 9, 10, 9, 7, 7, 7, 8, 7, 0, 0],
      [7, 7, 8, 7, 7, 7, 9, 9, 9, 7, 7, 8, 7, 7, 0, 0],
      [0, 7, 7, 8, 7, 7, 7, 7, 7, 7, 8, 7, 7, 0, 0, 0],
    ],
    lines: [
      "Buy low. Sell when you inevitably panic.",
      "The market is always right. Until it isn't.",
      "Diversification: owning stuff you don't understand.",
      "My tie costs more than your portfolio. Let's fix that.",
    ],
  },
}

export function getCharacter(locationId: string): CharacterDef | undefined {
  return CHARACTERS[locationId]
}
