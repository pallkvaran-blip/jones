import Phaser from 'phaser'
import type { LocationDef } from '../data/locations'
import type { TransportType } from '../state/types'

// Street grid geometry — mirrors CityScene.drawStreets()
const H_STREETS = [176, 348, 520] as const  // horizontal street y-centers (rows 0-2)
const V_STREETS = [178, 360, 542] as const  // vertical street x-centers (gaps between columns)

function getBuildingRow(loc: LocationDef): 0 | 1 | 2 {
  if (loc.y < 180) return 0
  if (loc.y < 360) return 1
  return 2
}

/** Returns world-space waypoints the pawn should follow from one building to another. */
export function buildRoute(
  from: LocationDef,
  to: LocationDef,
): Array<{ x: number; y: number }> {
  const fromRow = getBuildingRow(from)
  const toRow   = getBuildingRow(to)
  const fromHY  = H_STREETS[fromRow]
  const toHY    = H_STREETS[toRow]

  const pts: Array<{ x: number; y: number }> = []

  pts.push({ x: from.cx, y: from.cy })   // start at doorstep
  pts.push({ x: from.cx, y: fromHY })    // pull onto horizontal street

  if (fromRow === toRow) {
    if (from.cx !== to.cx) {
      pts.push({ x: to.cx, y: fromHY })  // drive along horizontal street
    }
  } else {
    // Use vertical street closest to the midpoint of the journey
    const midX = (from.cx + to.cx) / 2
    let vx: number = V_STREETS[0]
    let best = Math.abs(V_STREETS[0] - midX)
    for (const v of V_STREETS) {
      const d = Math.abs(v - midX)
      if (d < best) { best = d; vx = v }
    }
    pts.push({ x: vx,     y: fromHY })   // turn at intersection
    pts.push({ x: vx,     y: toHY   })   // drive along vertical street
    pts.push({ x: to.cx,  y: toHY   })   // turn onto target horizontal street
  }

  pts.push({ x: to.cx, y: to.cy })       // arrive at doorstep

  // Drop consecutive duplicates that would create zero-length segments
  return pts.filter((p, i) => i === 0 || p.x !== pts[i - 1].x || p.y !== pts[i - 1].y)
}

export function routeLength(pts: Array<{ x: number; y: number }>): number {
  let d = 0
  for (let i = 1; i < pts.length; i++) {
    d += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
  }
  return d
}

function textureKeyFor(transport: TransportType): string {
  if (transport === 'walking') return 'walker'
  if (transport === 'bicycle') return 'bicycle'
  return 'car'
}

export class Pawn {
  private scene: Phaser.Scene
  private container: Phaser.GameObjects.Container
  private sprite: Phaser.GameObjects.Image
  private shadow: Phaser.GameObjects.Image
  private isMoving = false

  constructor(scene: Phaser.Scene, x: number, y: number, transport: TransportType = 'walking') {
    this.scene = scene

    this.shadow = scene.add.image(0, 5, 'soft-shadow')
    this.shadow.setOrigin(0.5, 0.5)
    this.shadow.setScale(transport === 'walking' ? 0.4 : 0.55)

    this.sprite = scene.add.image(0, 0, textureKeyFor(transport))
    this.sprite.setOrigin(0.5, 0.5)

    this.container = scene.add.container(x, y, [this.shadow, this.sprite])
    this.container.setDepth(20)
  }

  setTransport(transport: TransportType): void {
    this.sprite.setTexture(textureKeyFor(transport))
    this.shadow.setScale(transport === 'walking' ? 0.4 : 0.55)
  }

  getPosition(): { x: number; y: number } {
    return { x: this.container.x, y: this.container.y }
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y)
  }

  isCurrentlyMoving(): boolean {
    return this.isMoving
  }

  driveRoute(
    waypoints: Array<{ x: number; y: number }>,
    onComplete: () => void,
    onUpdate?: (progress: number) => void,
    totalDuration = 1000,
  ): void {
    if (this.isMoving || waypoints.length < 2) return
    this.isMoving = true

    const total = routeLength(waypoints)
    if (total === 0) {
      this.isMoving = false
      onComplete()
      return
    }

    this.container.setPosition(waypoints[0].x, waypoints[0].y)

    const driveSegment = (idx: number, distSoFar: number): void => {
      if (idx >= waypoints.length - 1) {
        this.isMoving = false
        onComplete()
        return
      }

      const from = waypoints[idx]
      const to   = waypoints[idx + 1]
      const dx   = to.x - from.x
      const dy   = to.y - from.y
      const segDist = Math.hypot(dx, dy)

      if (segDist < 0.5) {
        driveSegment(idx + 1, distSoFar)
        return
      }

      // Rotate sprite and shadow to face the direction of travel
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      this.sprite.setAngle(angle)
      this.shadow.setAngle(angle)

      const segDuration = (segDist / total) * totalDuration

      this.scene.tweens.add({
        targets: this.container,
        x: to.x,
        y: to.y,
        duration: segDuration,
        ease: 'Linear',
        onUpdate: (tween) => {
          if (onUpdate) {
            onUpdate(Math.min(1, (distSoFar + segDist * tween.progress) / total))
          }
        },
        onComplete: () => {
          driveSegment(idx + 1, distSoFar + segDist)
        },
      })
    }

    driveSegment(0, 0)
  }

  destroy(): void {
    this.container.destroy()
  }
}
