export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1)
}

export function weightedRandom<T>(items: Array<{ item: T; weight: number }>): T {
  const totalWeight = items.reduce((sum, entry) => sum + entry.weight, 0)
  let random = Math.random() * totalWeight
  for (const entry of items) {
    random -= entry.weight
    if (random <= 0) {
      return entry.item
    }
  }
  return items[items.length - 1].item
}
