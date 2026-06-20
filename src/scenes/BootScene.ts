import Phaser from 'phaser'
import { locations } from '../data/locations'
import type { LocationDef, FacadeKind } from '../data/locations'
import { FacadeBuilder, PX } from '../utils/pixelArt'

// Virtual-pixel grid per building (footprint 150×140 real px, PX=3 => 50×46).
const GW = 50
const GH = 46

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    // No external assets — everything is generated programmatically.
  }

  async create(): Promise<void> {
    this.createTextures()
    await this.ensureFont()
    this.scene.start('MenuScene')
  }

  /** Race document.fonts ready against a short timeout so we never hang. */
  private async ensureFont(): Promise<void> {
    try {
      const load = Promise.all([
        document.fonts.load('10px "Press Start 2P"'),
        document.fonts.ready,
      ])
      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1500))
      await Promise.race([load, timeout])
    } catch {
      // Font failed to load — fall back to monospace, keep going.
    }
  }

  private createTextures(): void {
    // ASSET: replace generated pixel facades with real sprite sheet here
    for (const loc of locations) {
      this.buildFacade(loc)
    }
    this.buildAvatar()
    this.buildShadow()
  }

  // --- Avatar (2-frame 8-bit pixel dog) ---------------------------------------

  private buildAvatar(): void {
    // 14 wide × 16 tall virtual pixels — golden dog sprite
    const W = 14
    const H = 16
    const F  = '#d4a857'   // base golden fur
    const Li = '#ead07a'   // light fur  (chest / muzzle highlight)
    const Dk = '#9a7030'   // dark fur   (ears / body shading)
    const Dp = '#5e3c14'   // deep shadow
    const No = '#100c08'   // nose & eye colour
    const Eh = '#fff8d0'   // eye specular highlight

    const draw = (b: FacadeBuilder, legSwap: boolean) => {
      // TAIL (right side, curves upward)
      b.rect(12, 2, 1, 1, Dk)
      b.rect(12, 3, 1, 3, F)
      b.rect(11, 6, 2, 1, Dk)

      // EARS  (floppy, flanking the head)
      b.rect(1,  2, 2, 5, Dk)   // left ear
      b.rect(10, 2, 2, 5, Dk)   // right ear
      b.rect(11, 2, 1, 5, Dp)   // right ear deep shadow

      // HEAD fill
      b.rect(3,  0, 8, 6, F)
      b.rect(2,  1, 1, 4, F)    // widen slightly at sides
      b.rect(10, 1, 1, 4, F)

      // MUZZLE  (lighter golden)
      b.rect(4, 2, 6, 4, Li)

      // EYES
      b.rect(3, 1, 2, 2, No)    // left eye
      b.rect(3, 1, 1, 1, Eh)    // left specular
      b.rect(9, 1, 2, 2, No)    // right eye
      b.rect(9, 1, 1, 1, Eh)    // right specular

      // NOSE
      b.rect(5, 3, 4, 2, No)
      b.rect(6, 3, 1, 1, '#3a1828')

      // CHIN
      b.rect(4, 5, 6, 1, Li)

      // NECK
      b.rect(5, 6, 4, 2, F)

      // BODY
      b.rect(2,  8, 10, 5, F)   // main fill
      b.rect(4,  8,  6, 4, Li)  // lighter chest / belly
      b.rect(2,  8,  2, 5, Dk)  // left shading
      b.rect(10, 8,  2, 5, Dk)  // right shading
      b.rect(2,  12, 10, 1, Dp) // base shadow stripe

      // FRONT LEGS  (swap for walk cycle)
      if (!legSwap) {
        b.rect(2, 13, 3, 3, F)
        b.rect(9, 13, 3, 3, F)
      } else {
        b.rect(2, 12, 3, 4, F)   // left leg reaches one row lower
        b.rect(9, 13, 3, 3, F)
      }
      // paw tips
      b.rect(2, 15, 3, 1, Dk)
      b.rect(9, 15, 3, 1, Dk)
    }

    const f0 = new FacadeBuilder(this, W, H)
    draw(f0, false)
    f0.generate('avatar-0')

    const f1 = new FacadeBuilder(this, W, H)
    draw(f1, true)
    f1.generate('avatar-1')
  }

  private buildShadow(): void {
    const g = this.make.graphics({ x: 0, y: 0 })
    g.fillStyle(0x000000, 0.28)
    g.fillEllipse(14 * PX, 4 * PX, 24 * PX, 6 * PX)
    if (this.textures.exists('soft-shadow')) this.textures.remove('soft-shadow')
    g.generateTexture('soft-shadow', 28 * PX, 8 * PX)
    g.destroy()
  }

  // --- Building facades ------------------------------------------------------

  private buildFacade(loc: LocationDef): void {
    const b = new FacadeBuilder(this, GW, GH)
    const p = loc.palette
    const dispatch: Record<FacadeKind, () => void> = {
      home: () => this.facadeHome(b, p),
      bank: () => this.facadeBank(b, p),
      employment: () => this.facadeEmployment(b, p),
      university: () => this.facadeUniversity(b, p),
      grocery: () => this.facadeGrocery(b, p),
      electronics: () => this.facadeElectronics(b, p),
      clothing: () => this.facadeClothing(b, p),
      restaurant: () => this.facadeRestaurant(b, p),
      pawn: () => this.facadePawn(b, p),
      realty: () => this.facadeRealty(b, p),
      hospital: () => this.facadeHospital(b, p),
      stockexchange: () => this.facadeStock(b, p),
    }
    dispatch[loc.facade]()
    // Blank sign plate area at the very bottom (name text drawn by CityScene).
    b.generate(`building-${loc.id}`)
  }

  // 1. Apartment — brick, window grid, stoop, roof tank + antenna.
  private facadeHome(b: FacadeBuilder, p: Record<string, string>): void {
    // flat roof
    b.rect(2, 6, 46, 4, p.roof)
    // water tank
    b.rect(6, 1, 6, 6, p.trim)
    b.rect(6, 0, 6, 1, p.frame)
    b.rect(7, 7, 1, 2, p.frame)
    b.rect(10, 7, 1, 2, p.frame)
    // TV antenna
    b.rect(40, 0, 1, 7, p.frame)
    b.rect(37, 1, 7, 1, p.frame)
    b.rect(38, 3, 5, 1, p.frame)
    // brick body
    b.brickWall(2, 10, 46, 34, p.brick, p.mortar)
    b.dither(2, 32, 46, 12, p.brick, p.brickDark)
    // window grid (4 storeys × 4 windows), some lit
    const litSet = new Set(['1-0', '2-2', '0-3', '3-1'])
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const wx = 5 + c * 11
        const wy = 12 + r * 7
        b.window(wx, wy, 7, 5, p.frame, p.glass, litSet.has(`${c}-${r}`))
      }
    }
    // stoop / steps + door
    b.rect(20, 39, 10, 5, p.trim)
    b.door(22, 33, 6, 8, p.frame, p.door)
    b.rect(19, 43, 12, 1, p.brickDark)
  }

  // 2. Bank — stone temple, pediment, columns, steps, gold $ medallion.
  private facadeBank(b: FacadeBuilder, p: Record<string, string>): void {
    // pediment (triangle)
    b.triangle(25, 0, 6, 10, 44, 10, p.stone)
    b.triangle(25, 2, 9, 10, 41, 10, p.stoneDark)
    // gold $ medallion in pediment
    b.circle(25, 7, 3, p.gold)
    b.circle(25, 7, 2, p.goldDark)
    b.rect(24, 5, 1, 5, p.gold)
    b.rect(23, 5, 3, 1, p.gold)
    b.rect(23, 8, 3, 1, p.gold)
    // entablature
    b.rect(5, 10, 40, 4, p.stoneDark)
    b.rect(5, 13, 40, 1, p.shadow)
    // columns
    for (let i = 0; i < 4; i++) {
      const cx = 8 + i * 9
      b.rect(cx, 14, 4, 22, p.stone)
      b.rect(cx, 14, 1, 22, p.shadow)
      b.rect(cx + 3, 14, 1, 22, p.shadow)
      b.dither(cx + 1, 14, 2, 22, p.stone, p.stoneDark)
    }
    // wall behind / between visible as dark
    b.rect(5, 36, 40, 4, p.stoneDark)
    // double bronze doors (center)
    b.door(20, 24, 5, 12, p.goldDark, p.door)
    b.door(25, 24, 5, 12, p.goldDark, p.door)
    // wide steps
    b.rect(3, 40, 44, 2, p.step)
    b.rect(1, 42, 48, 2, p.stoneDark)
  }

  // 3. Employment — tan civic brick, flag, jobs board, arched entrance.
  private facadeEmployment(b: FacadeBuilder, p: Record<string, string>): void {
    // cornice / roof
    b.rect(2, 6, 46, 4, p.roof)
    // flag pole + flag
    b.rect(8, 0, 1, 7, p.frame)
    b.rect(9, 1, 6, 4, p.flag)
    b.triangle(15, 1, 15, 5, 12, 3, p.roof)
    // brick body
    b.brickWall(2, 10, 46, 34, p.brick, p.mortar)
    b.dither(2, 30, 46, 14, p.brick, p.brickDark)
    // arched entrance (door + arch)
    b.rect(20, 30, 10, 14, p.frame)
    b.circle(25, 30, 5, p.frame)
    b.door(22, 32, 6, 12, p.frame, p.door)
    // windows
    for (let c = 0; c < 3; c++) {
      const wx = 6 + c * 8
      b.window(wx, 14, 6, 7, p.frame, p.glass, c === 1)
    }
    b.window(38, 14, 6, 7, p.frame, p.glass, false)
    // jobs / notice board beside the door
    b.signBoard(32, 30, 10, 10, '#f2ead2', p.frame)
    for (let i = 0; i < 3; i++) b.rect(34, 32 + i * 2, 6, 1, p.brickDark)
  }

  // 4. University — collegiate, central clock tower, arched windows, pennants.
  private facadeUniversity(b: FacadeBuilder, p: Record<string, string>): void {
    // wings
    b.rect(2, 14, 46, 30, p.stone)
    b.dither(2, 32, 46, 12, p.stone, p.stoneDark)
    b.rect(2, 14, 46, 2, p.trim)
    // central clock tower
    b.rect(19, 0, 12, 18, p.stoneDark)
    b.triangle(25, -2, 17, 4, 33, 4, p.roof)
    b.rect(18, 3, 14, 1, p.roof)
    // clock face
    b.circle(25, 9, 3, p.clock)
    b.circle(25, 9, 3, p.clock)
    b.rect(25, 7, 1, 3, p.frame) // hand
    b.rect(25, 9, 2, 1, p.frame) // hand
    b.rect(24, 8, 1, 1, p.frame)
    // pennant flags on tower
    b.rect(18, 0, 1, 5, p.frame)
    b.rect(13, 1, 5, 3, p.pennant)
    b.rect(31, 0, 1, 5, p.frame)
    b.rect(32, 1, 5, 3, p.pennant)
    // tall arched windows
    for (let c = 0; c < 4; c++) {
      const wx = 5 + c * 11
      if (c === 1 || c === 2) continue // center occupied by entrance
      b.rect(wx, 18, 7, 18, p.frame)
      b.rect(wx + 1, 19, 5, 16, p.glass)
      b.circle(wx + 3, 19, 3, p.glass)
    }
    // arched entrance
    b.rect(20, 24, 10, 20, p.frame)
    b.circle(25, 24, 5, p.frame)
    b.door(22, 28, 6, 16, p.frame, p.roof)
    // steps
    b.rect(3, 43, 44, 1, p.trim)
  }

  // 5. Grocery — green/white striped awning, display window, produce crates.
  private facadeGrocery(b: FacadeBuilder, p: Record<string, string>): void {
    b.rect(2, 4, 46, 6, p.wallDark)
    b.rect(2, 10, 46, 34, p.wall)
    b.dither(2, 32, 46, 12, p.wall, p.wallDark)
    // sign band
    b.signBoard(6, 5, 38, 4, '#f7f3e6', p.frame)
    // striped awning
    b.awning(4, 12, 42, 4, p.awningA, p.awningB)
    // big display window
    b.rect(6, 18, 24, 16, p.frame)
    b.rect(7, 19, 22, 14, p.glass)
    // goods on shelves inside window
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        b.rect(8 + c * 4, 20 + r * 5, 3, 3, c % 2 === 0 ? p.apple : p.orange)
      }
    }
    // door
    b.door(34, 24, 8, 18, p.frame, p.wallDark)
    b.rect(35, 26, 6, 1, p.glass)
    // produce crates with apples/oranges on the sidewalk
    b.rect(6, 36, 10, 6, p.crate)
    b.rect(18, 37, 10, 5, p.crate)
    for (let i = 0; i < 4; i++) b.circle(8 + i * 2, 37, 1, p.apple)
    for (let i = 0; i < 4; i++) b.circle(20 + i * 2, 38, 1, p.orange)
  }

  // 6. Electronics — dark modern shopfront, glowing display, neon, dish.
  private facadeElectronics(b: FacadeBuilder, p: Record<string, string>): void {
    b.rect(2, 6, 46, 38, p.wall)
    b.dither(2, 30, 46, 14, p.wall, p.wallDark)
    b.rect(2, 6, 46, 2, p.wallDark)
    // satellite dish on roof
    b.circle(40, 4, 4, p.dish)
    b.circle(40, 4, 2, p.wallDark)
    b.rect(39, 4, 1, 4, p.dish)
    // neon sign strip
    b.rect(5, 9, 40, 3, p.neon)
    b.rect(5, 9, 40, 1, '#9bffe8')
    // glowing blue display window with a monitor showing a screen
    b.rect(6, 16, 26, 20, p.frame)
    b.rect(7, 17, 24, 18, p.glow)
    // monitor
    b.rect(12, 20, 14, 10, '#0e2230')
    b.rect(13, 21, 12, 8, p.screen)
    b.rect(14, 22, 5, 1, p.neon)
    b.rect(14, 24, 8, 1, p.neon)
    b.rect(14, 26, 4, 1, p.neon)
    b.rect(16, 30, 6, 1, '#0e2230') // stand
    // door
    b.door(36, 22, 8, 20, p.frame, p.wallDark)
    b.rect(37, 24, 6, 8, p.glow)
  }

  // 7. Clothing — boutique, scalloped awning, mannequin, hanging sign.
  private facadeClothing(b: FacadeBuilder, p: Record<string, string>): void {
    b.rect(2, 6, 46, 38, p.wall)
    b.dither(2, 30, 46, 14, p.wall, p.wallDark)
    b.rect(2, 6, 46, 2, p.wallDark)
    // scalloped fancy awning
    b.awning(4, 13, 42, 5, p.awningA, p.awningB)
    // hanging sign with shirt emblem
    b.rect(33, 8, 1, 4, p.frame)
    b.signBoard(30, 4, 14, 5, p.sign, p.frame)
    b.rect(35, 5, 4, 3, p.wallDark) // shirt emblem
    b.rect(34, 5, 1, 1, p.wallDark)
    b.rect(39, 5, 1, 1, p.wallDark)
    // big display window with mannequin silhouette
    b.rect(6, 20, 22, 22, p.frame)
    b.rect(7, 21, 20, 20, p.glass)
    // mannequin
    b.circle(16, 26, 2, p.mannequin)
    b.rect(14, 28, 5, 8, p.mannequin)
    b.rect(13, 29, 1, 4, p.mannequin)
    b.rect(19, 29, 1, 4, p.mannequin)
    // door
    b.door(32, 24, 10, 18, p.frame, p.wallDark)
    b.rect(34, 26, 6, 6, p.glass)
  }

  // 8. Fast Food — rooftop burger sign, red/yellow facade, menu windows.
  private facadeRestaurant(b: FacadeBuilder, p: Record<string, string>): void {
    // rooftop burger sign (stacked bands = bun/lettuce/patty/bun)
    b.rect(16, 0, 18, 2, p.bunTop) // top bun
    b.rect(15, 1, 20, 1, p.bunTop)
    b.rect(16, 2, 18, 1, p.lettuce) // lettuce
    b.rect(16, 3, 18, 2, p.patty) // patty
    b.rect(16, 5, 18, 2, p.bun) // bottom bun
    b.rect(24, 7, 2, 3, p.frame) // sign post
    // facade
    b.rect(2, 10, 46, 4, p.yellow)
    b.rect(2, 14, 46, 30, p.wall)
    b.dither(2, 32, 46, 12, p.wall, p.wallDark)
    // big windows with menu board
    b.rect(5, 18, 18, 18, p.frame)
    b.rect(6, 19, 16, 16, p.glass)
    // menu board lines
    b.signBoard(8, 21, 12, 12, '#fff7e0', p.frame)
    for (let i = 0; i < 4; i++) b.rect(10, 23 + i * 2, 8, 1, p.wallDark)
    // door
    b.door(28, 22, 10, 20, p.yellow, p.wall)
    b.rect(30, 24, 6, 8, p.glass)
    // counter stripe
    b.rect(2, 36, 46, 2, p.yellow)
  }

  // 9. Pawn — grungy, three gold balls, barred windows, neon PAWN.
  private facadePawn(b: FacadeBuilder, p: Record<string, string>): void {
    b.rect(2, 6, 46, 4, p.roof)
    b.rect(2, 10, 46, 34, p.wall)
    b.dither(2, 10, 46, 34, p.wall, p.wallDark)
    // classic three gold balls hanging sign
    b.rect(36, 6, 1, 3, p.frame)
    b.circle(34, 11, 3, p.gold)
    b.circle(38, 11, 3, p.gold)
    b.circle(36, 14, 3, p.gold)
    b.circle(34, 11, 1, p.goldDark)
    b.circle(38, 11, 1, p.goldDark)
    b.circle(36, 14, 1, p.goldDark)
    // neon PAWN area
    b.signBoard(6, 11, 22, 5, '#1a1416', p.frame)
    b.rect(8, 13, 18, 1, p.neon)
    // barred windows
    for (let c = 0; c < 2; c++) {
      const wx = 7 + c * 13
      b.rect(wx, 20, 10, 12, p.frame)
      b.rect(wx + 1, 21, 8, 10, p.glass)
      for (let i = 0; i < 4; i++) b.rect(wx + 1 + i * 2, 21, 1, 10, p.bar)
    }
    // door
    b.door(34, 26, 8, 16, p.frame, p.roof)
    b.rect(3, 43, 44, 1, p.wallDark)
  }

  // 10. Realty — office, listing-card windows, FOR SALE lawn sign.
  private facadeRealty(b: FacadeBuilder, p: Record<string, string>): void {
    b.rect(2, 6, 46, 5, p.roof)
    b.rect(2, 11, 46, 33, p.wall)
    b.dither(2, 32, 46, 12, p.wall, p.wallDark)
    // sign band
    b.signBoard(6, 7, 38, 3, '#eef5ff', p.frame)
    // big windows full of property listing cards
    for (let win = 0; win < 2; win++) {
      const wx = 6 + win * 20
      b.rect(wx, 14, 16, 20, p.frame)
      b.rect(wx + 1, 15, 14, 18, p.glass)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          b.rect(wx + 2 + c * 7, 16 + r * 6, 5, 4, p.card)
          b.rect(wx + 3, 17 + r * 6, 3, 1, p.wallDark)
        }
      }
    }
    // door
    b.door(20, 30, 10, 12, p.frame, p.roof)
    // FOR SALE lawn sign with little house emblem
    b.rect(33, 36, 1, 6, '#8a6a3a')
    b.signBoard(30, 32, 12, 6, p.sign, p.frame)
    b.triangle(36, 32, 33, 35, 39, 35, p.house) // little house roof
    b.rect(34, 35, 4, 2, p.house)
  }

  // 11. Hospital — white building, big red cross, ambulance bay, flag.
  private facadeHospital(b: FacadeBuilder, p: Record<string, string>): void {
    b.rect(2, 6, 46, 4, p.mint)
    b.rect(2, 10, 46, 34, p.wall)
    b.dither(2, 34, 46, 10, p.wall, p.wallDark)
    // red-cross flag
    b.rect(8, 0, 1, 7, p.frame)
    b.rect(9, 1, 5, 4, '#f2f2ea')
    b.rect(11, 1, 1, 4, p.cross)
    b.rect(9, 2, 5, 1, p.cross)
    // large red cross emblem
    b.rect(20, 12, 4, 12, p.cross)
    b.rect(16, 16, 12, 4, p.cross)
    // neat windows
    for (let c = 0; c < 3; c++) {
      b.window(5 + c * 5, 26, 4, 5, p.frame, p.glass, c === 1)
    }
    for (let c = 0; c < 3; c++) {
      b.window(30 + c * 5, 14, 4, 5, p.frame, p.glass, false)
    }
    // ambulance bay / garage door
    b.rect(30, 26, 16, 16, p.garage)
    b.outline(30, 26, 16, 16, p.frame)
    for (let i = 0; i < 4; i++) b.rect(30, 28 + i * 3, 16, 1, p.frame)
  }

  // 12. Stock Exchange — columned, green up-arrow, digital ticker board.
  private facadeStock(b: FacadeBuilder, p: Record<string, string>): void {
    // pediment
    b.triangle(25, 0, 6, 9, 44, 9, p.stone)
    b.triangle(25, 2, 9, 9, 41, 9, p.stoneDark)
    // big green up-arrow emblem in pediment
    b.triangle(25, 2, 20, 7, 30, 7, p.up)
    b.rect(23, 6, 4, 2, p.up)
    // entablature
    b.rect(4, 9, 42, 3, p.trim)
    // columns
    for (let i = 0; i < 5; i++) {
      const cx = 6 + i * 8
      b.rect(cx, 12, 3, 12, p.stone)
      b.rect(cx, 12, 1, 12, p.stoneDark)
    }
    // digital ticker board (green & red number blocks)
    b.rect(4, 24, 42, 10, p.board)
    b.outline(4, 24, 42, 10, p.trim)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 9; c++) {
        const up = (c + r) % 3 !== 0
        b.rect(6 + c * 4, 26 + r * 4, 3, 2, up ? p.up : p.down)
      }
    }
    // base + door
    b.rect(4, 34, 42, 10, p.stoneDark)
    b.door(21, 36, 8, 8, p.trim, p.door)
    b.rect(2, 43, 46, 1, p.stoneDark)
  }
}
