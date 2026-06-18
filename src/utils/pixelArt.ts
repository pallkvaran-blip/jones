import Phaser from 'phaser'

// Chunky retro pixel-art drawing helpers.
// Everything is authored on a "virtual pixel" grid; each virtual pixel is
// PX real pixels wide/tall, so art stays crisp and blocky under pixelArt mode.

export const PX = 3

export function px(n: number): number {
  return n * PX
}

/**
 * FacadeBuilder wraps a Phaser.GameObjects.Graphics and draws using
 * virtual-pixel grid coordinates. When finished, call `generate(key)` to bake
 * the drawing into a texture sized to the virtual grid (gridW × gridH) * PX.
 */
export class FacadeBuilder {
  private g: Phaser.GameObjects.Graphics
  readonly gridW: number
  readonly gridH: number

  constructor(scene: Phaser.Scene, gridW: number, gridH: number) {
    this.gridW = gridW
    this.gridH = gridH
    this.g = scene.make.graphics({ x: 0, y: 0 })
  }

  private color(hex: string | number): number {
    if (typeof hex === 'number') return hex
    return Phaser.Display.Color.HexStringToColor(hex).color
  }

  /** Fill a block of virtual pixels. */
  rect(gx: number, gy: number, gw: number, gh: number, color: string | number, alpha = 1): this {
    this.g.fillStyle(this.color(color), alpha)
    this.g.fillRect(px(gx), px(gy), px(gw), px(gh))
    return this
  }

  /** Hollow rectangle outline, `thickness` in virtual pixels. */
  outline(gx: number, gy: number, gw: number, gh: number, color: string | number, thickness = 1): this {
    const c = this.color(color)
    this.g.fillStyle(c, 1)
    // top, bottom, left, right
    this.g.fillRect(px(gx), px(gy), px(gw), px(thickness))
    this.g.fillRect(px(gx), px(gy + gh - thickness), px(gw), px(thickness))
    this.g.fillRect(px(gx), px(gy), px(thickness), px(gh))
    this.g.fillRect(px(gx + gw - thickness), px(gy), px(thickness), px(gh))
    return this
  }

  /** Checkerboard of single virtual pixels for shading / brick texture. */
  dither(gx: number, gy: number, gw: number, gh: number, colorA: string | number, colorB: string | number): this {
    const a = this.color(colorA)
    const b = this.color(colorB)
    for (let yy = 0; yy < gh; yy++) {
      for (let xx = 0; xx < gw; xx++) {
        this.g.fillStyle((xx + yy) % 2 === 0 ? a : b, 1)
        this.g.fillRect(px(gx + xx), px(gy + yy), PX, PX)
      }
    }
    return this
  }

  /** A few horizontal shading bands across a region (top lightest → bottom darkest). */
  vGradientBands(gx: number, gy: number, gw: number, gh: number, colors: Array<string | number>): this {
    const bands = colors.length
    const bandH = gh / bands
    for (let i = 0; i < bands; i++) {
      this.g.fillStyle(this.color(colors[i]), 1)
      this.g.fillRect(px(gx), px(gy + Math.round(i * bandH)), px(gw), px(Math.ceil(bandH) + 1))
    }
    return this
  }

  /** Framed window with optional warm lit glass and a cross mullion. */
  window(gx: number, gy: number, gw: number, gh: number, frameColor: string | number, glassColor: string | number, lit = false): this {
    this.rect(gx, gy, gw, gh, frameColor)
    const glass = lit ? 0xffe9a8 : this.color(glassColor)
    this.rect(gx + 1, gy + 1, gw - 2, gh - 2, glass)
    // subtle diagonal highlight in glass
    this.g.fillStyle(lit ? 0xfff4d0 : 0xffffff, lit ? 1 : 0.18)
    this.g.fillRect(px(gx + 1), px(gy + 1), px(Math.max(1, Math.floor(gw / 3))), PX)
    // cross mullion
    const midX = gx + Math.floor(gw / 2)
    const midY = gy + Math.floor(gh / 2)
    this.rect(midX, gy + 1, 1, gh - 2, frameColor)
    this.rect(gx + 1, midY, gw - 2, 1, frameColor)
    return this
  }

  /** Door with frame, panel and a small knob. */
  door(gx: number, gy: number, gw: number, gh: number, frameColor: string | number, panelColor: string | number): this {
    this.rect(gx, gy, gw, gh, frameColor)
    this.rect(gx + 1, gy + 1, gw - 2, gh - 1, panelColor)
    // panel inset lines
    this.outline(gx + 2, gy + 3, gw - 4, gh - 5, frameColor)
    // knob
    this.rect(gx + gw - 3, gy + Math.floor(gh / 2), 1, 1, 0xffe066)
    return this
  }

  /** Striped shop awning with scalloped bottom edge. */
  awning(gx: number, gy: number, gw: number, gh: number, stripeA: string | number, stripeB: string | number): this {
    for (let xx = 0; xx < gw; xx++) {
      this.g.fillStyle(this.color(Math.floor(xx / 2) % 2 === 0 ? stripeA : stripeB), 1)
      this.g.fillRect(px(gx + xx), px(gy), PX, px(gh))
    }
    // scalloped bottom: little triangles/notches
    for (let xx = 0; xx < gw; xx += 2) {
      this.g.fillStyle(this.color(Math.floor(xx / 2) % 2 === 0 ? stripeA : stripeB), 1)
      this.g.fillRect(px(gx + xx), px(gy + gh), px(2), PX)
    }
    return this
  }

  /** Offset-brick pattern over a region. */
  brickWall(gx: number, gy: number, gw: number, gh: number, base: string | number, mortar: string | number): this {
    this.rect(gx, gy, gw, gh, base)
    const m = this.color(mortar)
    const brickH = 4
    for (let row = 0; row * brickH < gh; row++) {
      const y = gy + row * brickH
      // horizontal mortar line
      this.g.fillStyle(m, 1)
      this.g.fillRect(px(gx), px(y), px(gw), PX)
      // vertical mortar joints, offset every other row
      const offset = row % 2 === 0 ? 0 : 4
      for (let x = gx - offset; x < gx + gw; x += 8) {
        if (x >= gx && x < gx + gw) {
          this.g.fillRect(px(x), px(y), PX, px(brickH))
        }
      }
    }
    return this
  }

  /** A blank sign plate (text drawn separately by the scene). */
  signBoard(gx: number, gy: number, gw: number, gh: number, bg: string | number, border: string | number): this {
    this.rect(gx, gy, gw, gh, border)
    this.rect(gx + 1, gy + 1, gw - 2, gh - 2, bg)
    return this
  }

  /** Filled circle in virtual pixels (handy for medallions, balls, knobs). */
  circle(gcx: number, gcy: number, gr: number, color: string | number): this {
    this.g.fillStyle(this.color(color), 1)
    this.g.fillCircle(px(gcx), px(gcy), px(gr))
    return this
  }

  /** Filled triangle in virtual pixels (pediments, arrows, roofs). */
  triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: string | number): this {
    this.g.fillStyle(this.color(color), 1)
    this.g.fillTriangle(px(x1), px(y1), px(x2), px(y2), px(x3), px(y3))
    return this
  }

  /** Bake into a named texture and dispose the working graphics. */
  generate(key: string): void {
    if (this.g.scene.textures.exists(key)) {
      this.g.scene.textures.remove(key)
    }
    this.g.generateTexture(key, px(this.gridW), px(this.gridH))
    this.g.destroy()
  }
}
