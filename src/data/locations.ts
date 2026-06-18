import type { LocationId } from '../state/types'

/** Discriminator telling BootScene which detailed facade to draw. */
export type FacadeKind =
  | 'home'
  | 'bank'
  | 'employment'
  | 'university'
  | 'grocery'
  | 'electronics'
  | 'clothing'
  | 'restaurant'
  | 'pawn'
  | 'realty'
  | 'hospital'
  | 'stockexchange'

export interface LocationPalette {
  [key: string]: string
}

export interface LocationDef {
  id: LocationId
  name: string
  icon: string // emoji (legacy / fallback)
  color: string // hex fill (legacy)
  darkColor: string // hex for roof/shadow (legacy)
  x: number // building top-left x (960×540 space, board area is 0..720)
  y: number // building top-left y
  width: number // building footprint width
  height: number // building footprint height
  cx: number // doorstep point x (where the avatar walks to)
  cy: number // doorstep point y (near the building base / sidewalk)
  facade: FacadeKind // which detailed design BootScene draws
  palette: LocationPalette
  travelCost: number // time units
  description: string
}

// Board area: x 0..720 (right 720..960 reserved for HUD), framed with a 12px bevel.
// 4 columns × 3 rows grid of large tiles. Each building footprint 150w × 140h.
// Streets (~20-28px) run between tiles inside the frame.
export const BOARD_W = 720
export const BUILDING_W = 150
export const BUILDING_H = 140
export const FRAME = 12

// Column left-edges and row top-edges (centered in the 720-wide board interior).
const COL = [12, 194, 376, 558] as const // 32px horizontal streets between columns
const ROW = [20, 192, 364] as const       // 32px vertical streets between rows
const W = BUILDING_W
const H = BUILDING_H

// Doorstep sits just below the building base, on the sidewalk.
function doorstep(x: number, y: number): { cx: number; cy: number } {
  return { cx: x + W / 2, cy: y + H + 10 }
}

interface RawLoc {
  id: LocationId
  name: string
  icon: string
  color: string
  darkColor: string
  col: number
  row: number
  facade: FacadeKind
  palette: LocationPalette
  description: string
}

const RAW: RawLoc[] = [
  {
    id: 'home',
    name: 'Your Apartment',
    icon: '🏠',
    color: '#6B8CCC',
    darkColor: '#4A6A9E',
    col: 0,
    row: 0,
    facade: 'home',
    palette: {
      brick: '#6b7a99',
      brickDark: '#56647f',
      mortar: '#46526b',
      roof: '#3a4252',
      glass: '#3b4a66',
      frame: '#2c3242',
      door: '#7a5234',
      trim: '#aab4c7',
    },
    description: 'Home sweet home. Rest and recover here.',
  },
  {
    id: 'employment',
    name: 'Seafood Grill',
    icon: '🦞',
    color: '#2980B9',
    darkColor: '#1A6A9A',
    col: 1,
    row: 0,
    facade: 'restaurant',
    palette: {
      wall: '#1a5a7a',
      wallDark: '#0e3d57',
      yellow: '#f2c94c',
      bun: '#2aa8c4',
      bunTop: '#3ac0dc',
      patty: '#e07832',
      lettuce: '#2aa870',
      glass: '#a0d8ef',
      frame: '#083040',
    },
    description: 'Fresh seafood served daily. Dine in or work in the kitchen.',
  },
  {
    id: 'university',
    name: 'University',
    icon: '🎓',
    color: '#9B59B6',
    darkColor: '#7D3C98',
    col: 2,
    row: 0,
    facade: 'university',
    palette: {
      stone: '#7c5a86',
      stoneDark: '#634a6e',
      trim: '#cdbcd6',
      roof: '#4a2f57',
      glass: '#cfe4ff',
      frame: '#3a2543',
      clock: '#f2ead2',
      pennant: '#d8b24a',
    },
    description: 'Take courses and improve your skills.',
  },
  {
    id: 'bank',
    name: 'City Bank',
    icon: '🏦',
    color: '#2ECC71',
    darkColor: '#1A8A4A',
    col: 3,
    row: 0,
    facade: 'bank',
    palette: {
      stone: '#e7e0c8',
      stoneDark: '#cdc4a6',
      shadow: '#b3a988',
      roof: '#d8d0b4',
      gold: '#f2c94c',
      goldDark: '#c79a2e',
      door: '#7a5a2e',
      step: '#c9c0a2',
    },
    description: 'Manage savings, loans, and investments.',
  },
  {
    id: 'grocery',
    name: 'Grocery Store',
    icon: '🛒',
    color: '#E74C3C',
    darkColor: '#B03A2E',
    col: 0,
    row: 1,
    facade: 'grocery',
    palette: {
      wall: '#c84a3c',
      wallDark: '#a83a2e',
      awningA: '#2faf5a',
      awningB: '#f2f2ea',
      glass: '#bfe2d6',
      frame: '#5a2a22',
      apple: '#e63b3b',
      orange: '#f29a2e',
      crate: '#8a5a32',
    },
    description: 'Buy food and household necessities.',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '💻',
    color: '#1ABC9C',
    darkColor: '#148A72',
    col: 1,
    row: 1,
    facade: 'electronics',
    palette: {
      wall: '#2b3540',
      wallDark: '#1f2730',
      glow: '#39d6e0',
      screen: '#1a6f8a',
      neon: '#39e0c8',
      frame: '#11161c',
      dish: '#9aa6ad',
    },
    description: 'Buy computers and tech equipment.',
  },
  {
    id: 'clothing',
    name: 'Clothing Store',
    icon: '👔',
    color: '#F39C12',
    darkColor: '#B7770D',
    col: 2,
    row: 1,
    facade: 'clothing',
    palette: {
      wall: '#d24a8a',
      wallDark: '#b03a72',
      awningA: '#f2a23c',
      awningB: '#f7e1c4',
      glass: '#e6d2e6',
      frame: '#5a2240',
      mannequin: '#c9b8cf',
      sign: '#f2c94c',
    },
    description: 'Buy clothes to improve your appearance.',
  },
  {
    id: 'restaurant',
    name: 'Fast Food',
    icon: '🍔',
    color: '#E67E22',
    darkColor: '#A04000',
    col: 3,
    row: 1,
    facade: 'restaurant',
    palette: {
      wall: '#d84a3a',
      wallDark: '#b53a2c',
      yellow: '#f2c94c',
      bun: '#e0a85a',
      bunTop: '#e7b35a',
      patty: '#7a4424',
      lettuce: '#5fb35a',
      glass: '#bfe2ff',
      frame: '#6a241c',
    },
    description: 'Grab a quick meal to restore hunger.',
  },
  {
    id: 'pawn',
    name: 'Pawn Shop',
    icon: '💰',
    color: '#95A5A6',
    darkColor: '#717D7E',
    col: 0,
    row: 2,
    facade: 'pawn',
    palette: {
      wall: '#7e8a8c',
      wallDark: '#677173',
      roof: '#4f5658',
      gold: '#f2c94c',
      goldDark: '#c79a2e',
      glass: '#3a4446',
      bar: '#2c3234',
      neon: '#ff5fae',
      frame: '#2c3234',
    },
    description: 'Buy and sell second-hand goods.',
  },
  {
    id: 'realty',
    name: 'Realty Office',
    icon: '🏘️',
    color: '#3498DB',
    darkColor: '#1A6FA8',
    col: 1,
    row: 2,
    facade: 'realty',
    palette: {
      wall: '#3a86c4',
      wallDark: '#2c6ea8',
      roof: '#1f4f7a',
      glass: '#cfe6f7',
      card: '#f2f2ea',
      frame: '#193a57',
      sign: '#f2f2ea',
      house: '#e0533a',
    },
    description: 'Rent or buy property in the city.',
  },
  {
    id: 'hospital',
    name: 'Hospital',
    icon: '⚕️',
    color: '#48C9B0',
    darkColor: '#1A9880',
    col: 2,
    row: 2,
    facade: 'hospital',
    palette: {
      wall: '#eef5f2',
      wallDark: '#d3e2dc',
      mint: '#b8e0d4',
      cross: '#e23b3b',
      glass: '#bfe2ff',
      frame: '#aebfba',
      garage: '#c4d2cd',
    },
    description: 'Get medical treatment and checkups.',
  },
  {
    id: 'stockexchange',
    name: 'Stock Exchange',
    icon: '📈',
    color: '#8E44AD',
    darkColor: '#6C3483',
    col: 3,
    row: 2,
    facade: 'stockexchange',
    palette: {
      stone: '#5a3a78',
      stoneDark: '#472e60',
      trim: '#c7b8d6',
      roof: '#3a2552',
      up: '#3fd167',
      down: '#e2473b',
      board: '#14101f',
      frame: '#2a1c3a',
      door: '#3a2552',
    },
    description: 'Trade stocks and grow your portfolio.',
  },
]

export const locations: LocationDef[] = RAW.map((r) => {
  const x = COL[r.col]
  const y = ROW[r.row]
  const { cx, cy } = doorstep(x, y)
  return {
    id: r.id,
    name: r.name,
    icon: r.icon,
    color: r.color,
    darkColor: r.darkColor,
    x,
    y,
    width: W,
    height: H,
    cx,
    cy,
    facade: r.facade,
    palette: r.palette,
    travelCost: 10,
    description: r.description,
  }
})

export function getLocationById(id: LocationId): LocationDef {
  const loc = locations.find((l) => l.id === id)
  if (!loc) throw new Error(`Location not found: ${id}`)
  return loc
}
