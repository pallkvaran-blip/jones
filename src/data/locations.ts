import type { LocationId } from '../state/types'

export interface LocationDef {
  id: LocationId;
  name: string;
  icon: string;       // emoji
  color: string;      // hex fill
  darkColor: string;  // hex for roof/shadow
  x: number;         // map pixel x (in 800×450 space, map area is 0-520)
  y: number;         // map pixel y
  width: number;
  height: number;
  travelCost: number; // time units
  description: string;
}

// Map area: x=0..520, y=30..420
// 4 columns at x=15, 140, 265, 390; 3 rows at y=40, 170, 300
// Building size: 110×100
const COL = [15, 140, 265, 390] as const;
const ROW = [40, 170, 300] as const;
const W = 110;
const H = 100;

export const locations: LocationDef[] = [
  {
    id: 'home',
    name: 'Your Apartment',
    icon: '🏠',
    color: '#6B8CCC',
    darkColor: '#4A6A9E',
    x: COL[0], y: ROW[0], width: W, height: H,
    travelCost: 10,
    description: 'Home sweet home. Rest and recover here.',
  },
  {
    id: 'employment',
    name: 'Employment Office',
    icon: '💼',
    color: '#E8A838',
    darkColor: '#B87D20',
    x: COL[1], y: ROW[0], width: W, height: H,
    travelCost: 10,
    description: 'Find jobs and manage your career.',
  },
  {
    id: 'university',
    name: 'University',
    icon: '🎓',
    color: '#9B59B6',
    darkColor: '#7D3C98',
    x: COL[2], y: ROW[0], width: W, height: H,
    travelCost: 10,
    description: 'Take courses and improve your skills.',
  },
  {
    id: 'bank',
    name: 'City Bank',
    icon: '🏦',
    color: '#2ECC71',
    darkColor: '#1A8A4A',
    x: COL[3], y: ROW[0], width: W, height: H,
    travelCost: 10,
    description: 'Manage savings, loans, and investments.',
  },
  {
    id: 'grocery',
    name: 'Grocery Store',
    icon: '🛒',
    color: '#E74C3C',
    darkColor: '#B03A2E',
    x: COL[0], y: ROW[1], width: W, height: H,
    travelCost: 10,
    description: 'Buy food and household necessities.',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '💻',
    color: '#1ABC9C',
    darkColor: '#148A72',
    x: COL[1], y: ROW[1], width: W, height: H,
    travelCost: 10,
    description: 'Buy computers and tech equipment.',
  },
  {
    id: 'clothing',
    name: 'Clothing Store',
    icon: '👔',
    color: '#F39C12',
    darkColor: '#B7770D',
    x: COL[2], y: ROW[1], width: W, height: H,
    travelCost: 10,
    description: 'Buy clothes to improve your appearance.',
  },
  {
    id: 'restaurant',
    name: 'Fast Food',
    icon: '🍔',
    color: '#E67E22',
    darkColor: '#A04000',
    x: COL[3], y: ROW[1], width: W, height: H,
    travelCost: 10,
    description: 'Grab a quick meal to restore hunger.',
  },
  {
    id: 'pawn',
    name: 'Pawn Shop',
    icon: '💰',
    color: '#95A5A6',
    darkColor: '#717D7E',
    x: COL[0], y: ROW[2], width: W, height: H,
    travelCost: 10,
    description: 'Buy and sell second-hand goods.',
  },
  {
    id: 'realty',
    name: 'Realty Office',
    icon: '🏘️',
    color: '#3498DB',
    darkColor: '#1A6FA8',
    x: COL[1], y: ROW[2], width: W, height: H,
    travelCost: 10,
    description: 'Rent or buy property in the city.',
  },
  {
    id: 'hospital',
    name: 'Hospital',
    icon: '⚕️',
    color: '#48C9B0',
    darkColor: '#1A9880',
    x: COL[2], y: ROW[2], width: W, height: H,
    travelCost: 10,
    description: 'Get medical treatment and checkups.',
  },
  {
    id: 'stockexchange',
    name: 'Stock Exchange',
    icon: '📈',
    color: '#8E44AD',
    darkColor: '#6C3483',
    x: COL[3], y: ROW[2], width: W, height: H,
    travelCost: 10,
    description: 'Trade stocks and grow your portfolio.',
  },
];

export function getLocationById(id: LocationId): LocationDef {
  const loc = locations.find(l => l.id === id);
  if (!loc) throw new Error(`Location not found: ${id}`);
  return loc;
}
