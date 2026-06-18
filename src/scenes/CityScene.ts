import Phaser from 'phaser'
import { getStore } from '../state/store'
import { locations, getLocationById, BOARD_W, FRAME } from '../data/locations'
import { consumeTime } from '../systems/TimeSystem'
import { executeAction } from '../systems/ActionSystem'
import { audioSystem } from '../systems/AudioSystem'
import { Avatar } from '../entities/Avatar'
import { LocationSprite } from '../entities/LocationSprite'
import { HUD } from '../ui/HUD'
import type { LocationId } from '../state/types'

const GAME_W = 960
const GAME_H = 540
const BOARD_H = GAME_H

export class CityScene extends Phaser.Scene {
  private avatar!: Avatar
  private locationSprites: Map<LocationId, LocationSprite> = new Map()
  private hud!: HUD
  private streetGraphics!: Phaser.GameObjects.Graphics
  private frameGraphics!: Phaser.GameObjects.Graphics
  private nightOverlay!: Phaser.GameObjects.Rectangle
  private overlayText: Phaser.GameObjects.Text | null = null
  private unsubscribeStore: (() => void) | null = null
  private muteButton: HTMLButtonElement | null = null

  constructor() {
    super({ key: 'CityScene' })
  }

  create(): void {
    const store = getStore()
    const state = store.getState()

    // --- Base background ---
    this.add.rectangle(BOARD_W / 2, BOARD_H / 2, BOARD_W, BOARD_H, 0x232733).setDepth(0)
    // HUD backing strip behind the DOM panel.
    this.add
      .rectangle(BOARD_W + (GAME_W - BOARD_W) / 2, BOARD_H / 2, GAME_W - BOARD_W, BOARD_H, 0x0d0d17)
      .setDepth(0)

    // --- Streets / sidewalks (the board surface) ---
    this.streetGraphics = this.add.graphics().setDepth(1)
    this.drawStreets()

    // --- Location buildings ---
    for (const loc of locations) {
      const sprite = new LocationSprite(this, loc)
      sprite.setDepth(5)
      this.locationSprites.set(loc.id, sprite)

      sprite.on('locationClicked', (id: LocationId) => {
        this.handleLocationClick(id)
      })
    }

    // Initial active location indicator.
    const activeLoc = this.locationSprites.get(state.currentLocationId)
    if (activeLoc) activeLoc.setLocationActive(true)

    // --- Avatar (starts on the current location's doorstep) ---
    const startSprite = this.locationSprites.get(state.currentLocationId)
    const startLoc = getLocationById(state.currentLocationId)
    const start = startSprite ? startSprite.getCenter() : { x: startLoc.cx, y: startLoc.cy }
    this.avatar = new Avatar(this, start.x, start.y)

    // --- Day/night ambient tint overlay (over the board, under banners) ---
    this.nightOverlay = this.add
      .rectangle(BOARD_W / 2, BOARD_H / 2, BOARD_W, BOARD_H, 0x101a3a, 0)
      .setDepth(30)
    this.nightOverlay.setBlendMode(Phaser.BlendModes.MULTIPLY)
    this.updateAmbient(state.calendar.timeUnits)

    // --- Beveled board frame (drawn on top of everything board-side) ---
    this.frameGraphics = this.add.graphics().setDepth(40)
    this.drawFrame()

    // --- HUD ---
    this.hud = new HUD()
    this.hud.mount()
    this.hud.update(state)

    // Show actions for initial location (home)
    this.hud.showActions(state.currentLocationId, state, (id) => this.handleAction(id))

    // --- Mute button ---
    this.createMuteButton()

    // --- Store subscription (unchanged wiring) ---
    this.unsubscribeStore = store.subscribe((newState) => {
      this.hud.update(newState)
      this.updateAmbient(newState.calendar.timeUnits)

      if (newState.isGameOver) {
        this.time.delayedCall(500, () => {
          this.scene.start('GameOverScene')
        })
      }
    })
  }

  private handleAction(actionId: string): void {
    const store = getStore()
    const state = store.getState()
    store.setState((_s) => executeAction(actionId, state.currentLocationId, state))
  }

  /** Drive a semi-transparent tint by time of day: morning clear → dusk → night. */
  private updateAmbient(timeUnits: number): void {
    // timeUnits: 100 = morning (clear), 50 = golden dusk, 0 = night.
    let color: number
    let alpha: number
    if (timeUnits >= 50) {
      const t = (timeUnits - 50) / 50 // 1=morning, 0=dusk
      // dusk gold -> clear
      const r = Math.round(0xff * (1 - t) + 0xff * t)
      const g = Math.round(0xb0 * (1 - t) + 0xff * t)
      const b = Math.round(0x6a * (1 - t) + 0xff * t)
      color = (r << 16) | (g << 8) | b
      alpha = (1 - t) * 0.28
    } else {
      const t = timeUnits / 50 // 1=dusk, 0=deep night
      const r = Math.round(0x20 * (1 - t) + 0xff * t)
      const g = Math.round(0x28 * (1 - t) + 0xb0 * t)
      const b = Math.round(0x5a * (1 - t) + 0x6a * t)
      color = (r << 16) | (g << 8) | b
      alpha = 0.28 + (1 - t) * 0.34
    }
    this.nightOverlay.setFillStyle(color)
    this.nightOverlay.setAlpha(alpha)
  }

  private drawStreets(): void {
    const g = this.streetGraphics
    g.clear()

    const ASPHALT = 0x2b2f3a
    const SIDEWALK = 0x9aa0ad
    const SIDEWALK_DARK = 0x7f8593
    const LINE = 0xf2c94c

    // Asphalt fills the whole board interior.
    g.fillStyle(ASPHALT, 1)
    g.fillRect(FRAME, FRAME, BOARD_W - FRAME * 2, BOARD_H - FRAME * 2)

    // Road centerlines run down the streets between columns and across rows.
    // Column gaps centers (between the 4 building columns + edges).
    const colCenters = [24, 196, 366, 536, 702]
    const rowCenters = [26, 186, 346, BOARD_H - 26]

    const roadW = 18

    // Vertical roads
    for (const cx of colCenters) {
      g.fillStyle(0x363b48, 1)
      g.fillRect(cx - roadW / 2, FRAME, roadW, BOARD_H - FRAME * 2)
      // dashed yellow center line
      g.fillStyle(LINE, 0.9)
      for (let y = FRAME + 6; y < BOARD_H - FRAME; y += 16) {
        g.fillRect(cx - 1, y, 2, 8)
      }
    }
    // Horizontal roads
    for (const cy of rowCenters) {
      g.fillStyle(0x363b48, 1)
      g.fillRect(FRAME, cy - roadW / 2, BOARD_W - FRAME * 2, roadW)
      g.fillStyle(LINE, 0.9)
      for (let x = FRAME + 6; x < BOARD_W - FRAME; x += 16) {
        g.fillRect(x, cy - 1, 8, 2)
      }
    }

    // Sidewalks bordering each building footprint.
    for (const loc of locations) {
      const pad = 6
      g.fillStyle(SIDEWALK, 1)
      g.fillRect(loc.x - pad, loc.y - pad, loc.width + pad * 2, loc.height + pad * 2 + 26)
      g.fillStyle(SIDEWALK_DARK, 1)
      g.fillRect(loc.x - pad, loc.y + loc.height + pad + 24, loc.width + pad * 2, 2)
    }

    // Crosswalk stripes at intersections (where roads cross).
    g.fillStyle(0xe6e6ee, 0.55)
    for (const cx of colCenters) {
      for (const cy of rowCenters) {
        for (let i = -2; i <= 2; i++) {
          g.fillRect(cx + i * 4 - 1, cy - roadW / 2, 2, roadW)
        }
      }
    }
  }

  private drawFrame(): void {
    const g = this.frameGraphics
    g.clear()
    const t = FRAME
    // Outer dark border
    g.fillStyle(0x14141f, 1)
    g.fillRect(0, 0, BOARD_W, t)
    g.fillRect(0, BOARD_H - t, BOARD_W, t)
    g.fillRect(0, 0, t, BOARD_H)
    g.fillRect(BOARD_W - t, 0, t, BOARD_H)
    // Inner highlight bevel (top/left light, bottom/right dark)
    g.fillStyle(0x4a4a66, 1)
    g.fillRect(t - 3, t - 3, BOARD_W - (t - 3) * 2, 3)
    g.fillRect(t - 3, t - 3, 3, BOARD_H - (t - 3) * 2)
    g.fillStyle(0x080810, 1)
    g.fillRect(t - 3, BOARD_H - t, BOARD_W - (t - 3) * 2, 3)
    g.fillRect(BOARD_W - t, t - 3, 3, BOARD_H - (t - 3) * 2)
  }

  private handleLocationClick(id: LocationId): void {
    audioSystem.playSFX('click')

    const store = getStore()
    const state = store.getState()

    if (state.currentLocationId === id) {
      this.showToast(`You are at ${getLocationById(id).name}`)
      return
    }

    if (this.avatar.isCurrentlyMoving()) return

    const targetSprite = this.locationSprites.get(id)
    if (!targetSprite) return

    const prevSprite = this.locationSprites.get(state.currentLocationId)
    if (prevSprite) prevSprite.setLocationActive(false)

    // Hide actions while traveling
    this.hud.hideActions()

    const targetCenter = targetSprite.getCenter()

    // Distance-proportional time cost and tween duration.
    const startPos = this.avatar.getPosition()
    const dist = Math.sqrt(
      (targetCenter.x - startPos.x) ** 2 + (targetCenter.y - startPos.y) ** 2,
    )
    const timeCost = Math.max(3, Math.min(12, Math.round(dist / 50)))
    const moveDuration = Math.max(400, Math.min(1400, Math.round(dist * 2.2)))
    const startTimeUnits = state.calendar.timeUnits

    audioSystem.playSFX('move')

    this.avatar.moveTo(
      targetCenter.x,
      targetCenter.y,
      () => {
        // Finalize: rebase on startTimeUnits so consumeTime handles day/week correctly.
        audioSystem.playSFX('arrive')
        store.setState((s) => {
          const rebased = { ...s, calendar: { ...s.calendar, timeUnits: startTimeUnits } }
          const afterMove = consumeTime(rebased, timeCost)
          const withLocation = { ...afterMove, currentLocationId: id }

          const dayAdvanced =
            withLocation.calendar.day !== s.calendar.day ||
            withLocation.calendar.week !== s.calendar.week
          const weekAdvanced = withLocation.calendar.week !== s.calendar.week

          if (weekAdvanced) {
            audioSystem.playSFX('weekEnd')
            this.showDayBanner(`Week ${withLocation.calendar.week}`)
          } else if (dayAdvanced) {
            audioSystem.playSFX('dayEnd')
            this.showDayBanner(
              `Day ${withLocation.calendar.day} — ${this.getDayName(withLocation.calendar.day)}`,
            )
          }

          return withLocation
        })
        targetSprite.setLocationActive(true)
        // Show actions for the new location
        const newState = store.getState()
        this.hud.showActions(id, newState, (actionId) => this.handleAction(actionId))
      },
      (progress) => {
        // Smoothly interpolate timeUnits as the avatar walks.
        store.setState((s) => ({
          ...s,
          calendar: {
            ...s.calendar,
            timeUnits: Math.max(0, startTimeUnits - progress * timeCost),
          },
        }))
      },
      moveDuration,
    )
  }

  private getDayName(day: number): string {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days[Math.max(0, Math.min(6, day - 1))]
  }

  private showToast(message: string): void {
    if (this.overlayText) {
      this.overlayText.destroy()
      this.overlayText = null
    }

    const text = this.add.text(BOARD_W / 2, BOARD_H / 2, message, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: { x: 14, y: 10 },
      align: 'center',
    })
    text.setOrigin(0.5, 0.5)
    text.setResolution(3)
    text.setDepth(50)
    this.overlayText = text

    this.tweens.add({
      targets: text,
      alpha: { from: 1, to: 0 },
      delay: 1500,
      duration: 500,
      onComplete: () => {
        text.destroy()
        if (this.overlayText === text) this.overlayText = null
      },
    })
  }

  private showDayBanner(message: string): void {
    const text = this.add.text(BOARD_W / 2, BOARD_H / 2, message, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '18px',
      color: '#F5A623',
      backgroundColor: 'rgba(0,0,0,0.85)',
      padding: { x: 20, y: 14 },
      align: 'center',
    })
    text.setOrigin(0.5, 0.5)
    text.setResolution(3)
    text.setDepth(50)
    text.setAlpha(0)

    this.tweens.add({
      targets: text,
      alpha: { from: 0, to: 1 },
      y: { from: BOARD_H / 2 + 35, to: BOARD_H / 2 },
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: text,
          alpha: 0,
          delay: 1800,
          duration: 500,
          onComplete: () => text.destroy(),
        })
      },
    })
  }

  private createMuteButton(): void {
    const uiRoot = document.getElementById('ui-root')
    if (!uiRoot) return

    this.muteButton = document.createElement('button')
    this.muteButton.id = 'mute-btn'
    this.muteButton.textContent = '🔊'
    this.muteButton.style.cssText = `
      position: fixed;
      top: 8px;
      right: 250px;
      width: 32px;
      height: 32px;
      background: rgba(13,13,23,0.9);
      border: 2px solid #3a3a52;
      color: #e0e0e0;
      font-size: 16px;
      cursor: pointer;
      z-index: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      padding: 0;
    `

    this.muteButton.addEventListener('click', () => {
      const muted = !audioSystem.isMuted()
      audioSystem.setMuted(muted)
      if (this.muteButton) {
        this.muteButton.textContent = muted ? '🔇' : '🔊'
      }
    })

    uiRoot.appendChild(this.muteButton)
  }

  shutdown(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore()
      this.unsubscribeStore = null
    }
    this.hud.unmount()
    audioSystem.stopBGM()

    if (this.muteButton?.parentNode) {
      this.muteButton.parentNode.removeChild(this.muteButton)
      this.muteButton = null
    }
  }
}
