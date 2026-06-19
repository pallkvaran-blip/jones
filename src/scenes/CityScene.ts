import Phaser from 'phaser'
import { getStore } from '../state/store'
import { locations, getLocationById, BOARD_W, FRAME } from '../data/locations'
import { consumeTime, advanceWeek } from '../systems/TimeSystem'
import { executeAction } from '../systems/ActionSystem'
import { audioSystem } from '../systems/AudioSystem'
import { Avatar } from '../entities/Avatar'
import { LocationSprite } from '../entities/LocationSprite'
import { HUD } from '../ui/HUD'
import type { LocationId, GameState } from '../state/types'
import { ALL_LIFE_EVENTS } from '../data/lifeEvents'
import { applyImmediateEvent, resolveEventChoice } from '../systems/EventSystem'
import { EventModal, type EffectChip } from '../ui/EventModal'
import { getWorkEvent } from '../data/workEvents'
import { TurnHandoffOverlay } from '../ui/TurnHandoffOverlay'
import { WeekendEventModal } from '../ui/WeekendEventModal'
import { ALL_WEEKEND_EVENTS } from '../data/weekendEvents'

function stateToChips(before: GameState, after: GameState): EffectChip[] {
  const chips: EffectChip[] = []
  const p1 = before.player
  const p2 = after.player

  if (p1.jobId !== null && p2.jobId === null) chips.push({ text: 'FIRED', good: false })

  const moneyDiff = Math.round(p2.money - p1.money)
  if (Math.abs(moneyDiff) >= 1) {
    chips.push({ text: moneyDiff >= 0 ? `+$${moneyDiff}` : `-$${Math.abs(moneyDiff)}`, good: moneyDiff > 0 })
  }

  const bankDiff = Math.round(p2.bankBalance - p1.bankBalance)
  if (Math.abs(bankDiff) >= 1) {
    chips.push({ text: bankDiff >= 0 ? `Bank +$${bankDiff}` : `Bank -$${Math.abs(bankDiff)}`, good: bankDiff > 0 })
  }

  const moraleDiff = Math.round(p2.morale - p1.morale)
  if (Math.abs(moraleDiff) >= 2) {
    chips.push({ text: `Morale ${moraleDiff >= 0 ? '+' : ''}${moraleDiff}`, good: moraleDiff > 0 })
  }

  const energyDiff = Math.round(p2.energy - p1.energy)
  if (Math.abs(energyDiff) >= 2) {
    chips.push({ text: `Energy ${energyDiff >= 0 ? '+' : ''}${energyDiff}`, good: energyDiff > 0 })
  }

  const healthDiff = Math.round(p2.health - p1.health)
  if (Math.abs(healthDiff) >= 2) {
    chips.push({ text: `Health ${healthDiff >= 0 ? '+' : ''}${healthDiff}`, good: healthDiff > 0 })
  }

  if (p2.pets.length > p1.pets.length) chips.push({ text: 'New pet!', good: true })

  return chips
}

const BOARD_H = 540

export class CityScene extends Phaser.Scene {
  private avatar!: Avatar
  private locationSprites: Map<LocationId, LocationSprite> = new Map()
  private hud!: HUD
  private streetGraphics!: Phaser.GameObjects.Graphics
  private frameGraphics!: Phaser.GameObjects.Graphics
  private overlayText: Phaser.GameObjects.Text | null = null
  private unsubscribeStore: (() => void) | null = null
  private muteButton: HTMLButtonElement | null = null
  private eventModal: EventModal = new EventModal()
  private weekendModal = new WeekendEventModal()
  private lastPendingEventId: string | null = null
  private lastWorkEventId: string | null = null
  private lastWeekendEventId: string | null = null
  private lastLocationId!: LocationId
  private lastCalendarDay!: number
  private lastCalendarWeek!: number
  private turnHandoffOverlay = new TurnHandoffOverlay()
  private lastHandoffState = false

  constructor() {
    super({ key: 'CityScene' })
  }

  create(): void {
    const store = getStore()
    const state = store.getState()
    this.lastLocationId = state.currentLocationId
    this.lastCalendarDay = state.calendar.day
    this.lastCalendarWeek = state.calendar.week

    // --- Base background ---
    this.add.rectangle(BOARD_W / 2, BOARD_H / 2, BOARD_W, BOARD_H, 0x232733).setDepth(0)

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

    // --- Beveled board frame (drawn on top of everything board-side) ---
    this.frameGraphics = this.add.graphics().setDepth(40)
    this.drawFrame()

    // --- HUD ---
    this.hud = new HUD()
    this.hud.mount()
    this.hud.update(state)

    // Show actions for initial location (home)
    this.hud.showActions(state.currentLocationId, state, (id) => this.handleAction(id), (msg) => this.showToast(msg))

    // --- Mute button ---
    this.createMuteButton()

    // --- Store subscription ---
    this.unsubscribeStore = store.subscribe((newState) => {
      const subDayAdvanced = newState.calendar.day !== this.lastCalendarDay || newState.calendar.week !== this.lastCalendarWeek
      const subWeekAdvanced = newState.calendar.week !== this.lastCalendarWeek
      this.lastCalendarDay = newState.calendar.day
      this.lastCalendarWeek = newState.calendar.week
      if (!newState.pendingWeekendEventId && subWeekAdvanced) {
        audioSystem.playSFX('weekEnd')
        this.showDayBanner(`Week ${newState.calendar.week}`)
      } else if (!newState.pendingWeekendEventId && subDayAdvanced) {
        audioSystem.playSFX('dayEnd')
        const sentHome = newState.currentLocationId === 'home' && this.lastLocationId !== 'home'
        const msg = sentHome
          ? `Day ended — you headed home`
          : `Day ${newState.calendar.day} — ${this.getDayName(newState.calendar.day)}`
        this.showDayBanner(msg)
      }

      this.hud.update(newState)

      // Sync sprites + HUD when location changes outside of player movement
      // (e.g. advanceDay teleports the player home at end of day)
      if (newState.currentLocationId !== this.lastLocationId && !this.avatar.isCurrentlyMoving()) {
        this.locationSprites.forEach((sprite, locId) => {
          sprite.setLocationActive(locId === newState.currentLocationId)
        })
        this.hud.showActions(
          newState.currentLocationId,
          newState,
          (id) => this.handleAction(id),
          (msg) => this.showToast(msg),
        )
      }
      this.lastLocationId = newState.currentLocationId

      // Switch to danger BGM if health or hunger critically low
      const isDanger = newState.player.health <= 20 || newState.player.hunger <= 15
      audioSystem.setDangerMode(isDanger)

      if (newState.isGameOver) {
        // In 2-player mode, check if the other player is still alive
        if (newState.numPlayers === 2) {
          const bothStates = store.getBothStates()
          const activeIdx = newState.activePlayer - 1
          const otherIdx = activeIdx === 0 ? 1 : 0
          const otherState = bothStates[otherIdx]

          if (otherState && !otherState.isGameOver) {
            // Other player is still alive — hand off to them
            const currentPlayerName = newState.player.name
            const nextPlayerName = otherState.player.name
            const week = newState.calendar.week
            const nextPlayer = (newState.activePlayer === 1 ? 2 : 1) as 1 | 2

            this.turnHandoffOverlay.show(
              `${currentPlayerName} — GAME OVER`,
              nextPlayerName,
              week,
              () => {
                this.lastHandoffState = false
                store.setState(s => ({ ...s, pendingTurnHandoff: false }))
                store.swapToPlayer(nextPlayer)
              }
            )
            return
          }
        }

        this.time.delayedCall(500, () => {
          this.scene.start('GameOverScene')
        })
        return
      }

      // 2-player turn handoff
      if (newState.pendingTurnHandoff && !this.lastHandoffState) {
        this.lastHandoffState = true
        const bothStates = store.getBothStates()
        const activeIdx = newState.activePlayer - 1
        const otherIdx = activeIdx === 0 ? 1 : 0
        const otherState = bothStates[otherIdx]

        if (otherState && newState.numPlayers === 2) {
          const currentPlayerName = newState.player.name
          const nextPlayerName = otherState.player.name
          const week = newState.calendar.week

          this.turnHandoffOverlay.show(
            currentPlayerName,
            nextPlayerName,
            week,
            () => {
              this.lastHandoffState = false
              // Clear handoff on current player's state, then swap
              store.setState(s => ({ ...s, pendingTurnHandoff: false }))
              const nextPlayer = (newState.activePlayer === 1 ? 2 : 1) as 1 | 2
              store.swapToPlayer(nextPlayer)
            }
          )
        } else {
          // 1-player or no other state — just clear the flag
          store.setState(s => ({ ...s, pendingTurnHandoff: false }))
          this.lastHandoffState = false
        }
      }
      if (!newState.pendingTurnHandoff) this.lastHandoffState = false

      // Life event modal
      if (newState.pendingLifeEventId && newState.pendingLifeEventId !== this.lastPendingEventId) {
        this.lastPendingEventId = newState.pendingLifeEventId
        const event = ALL_LIFE_EVENTS.find(e => e.id === newState.pendingLifeEventId)
        if (event) {
          // Play appropriate SFX for this event
          if (event.id === 'job_fired') {
            audioSystem.playSFX('demotion')
          } else if (event.type === 'immediate' && event.immediateDelta) {
            const d = event.immediateDelta
            if ((d.money != null && d.money > 0) || (d.morale != null && d.morale > 10)) {
              audioSystem.playSFX('eventGood')
            } else if (
              (d.money != null && d.money < 0) ||
              (d.morale != null && d.morale < -10) ||
              (d.health != null && d.health < 0)
            ) {
              audioSystem.playSFX('eventBad')
            }
          }

          if (event.type === 'immediate') {
            // Apply delta first, then show dismissible modal with effect chips
            const resolved = applyImmediateEvent(event, newState)
            store.setState(() => resolved)
            const chips = stateToChips(newState, resolved)
            this.eventModal.show(event, () => { this.lastPendingEventId = null }, { chips })
          } else {
            // Show choice modal — apply delta when user picks, then show result screen
            this.eventModal.show(event, (choiceIdx) => {
              const current = store.getState()
              const next = resolveEventChoice(event, choiceIdx, current)
              store.setState(() => next)
              const logMsg = next.eventLog[0] ?? ''
              const chips = stateToChips(current, next)
              this.eventModal.showResult(event.title, logMsg, chips, () => { this.lastPendingEventId = null })
            })
          }
        }
      }

      // Work event modal
      if (newState.pendingWorkEventId && newState.pendingWorkEventId !== this.lastWorkEventId) {
        this.lastWorkEventId = newState.pendingWorkEventId
        const track = newState.player.careerTrack
        if (track) {
          const workEvent = getWorkEvent(track, newState.pendingWorkEventId)
          if (workEvent) {
            // Clear immediately so it doesn't re-trigger
            store.setState(prev => ({ ...prev, pendingWorkEventId: null }))

            this.eventModal.show(
              {
                id: workEvent.id,
                title: workEvent.title,
                description: workEvent.description,
                type: 'choice',
                choices: workEvent.choices,
              },
              (choiceIdx) => {
                const choice = workEvent.choices[choiceIdx]
                const d = choice.delta
                const fired = d.fired === true
                const beforeState = store.getState()
                store.setState(prev => {
                  const p = prev.player
                  const cap = (v: number) => Math.min(100, Math.max(0, v))
                  return {
                    ...prev,
                    player: {
                      ...p,
                      money: d.money != null ? Math.max(0, p.money + d.money) : p.money,
                      morale: d.morale != null ? cap(p.morale + d.morale) : p.morale,
                      energy: d.energy != null ? cap(p.energy + d.energy) : p.energy,
                      health: d.health != null ? cap(p.health + d.health) : p.health,
                      education: d.education != null ? p.education + d.education : p.education,
                      creditScore: d.creditScore != null ? cap(p.creditScore + d.creditScore) : p.creditScore,
                      pets: d.petId && !p.pets.includes(d.petId) ? [...p.pets, d.petId] : p.pets,
                      jobId: fired ? null : p.jobId,
                      careerTrack: fired ? null : p.careerTrack,
                      jobRank: fired ? 0 : p.jobRank,
                      jobTenure: fired ? 0 : p.jobTenure,
                    },
                    // Don't set pendingLifeEventId here — defer until result dismissed
                    eventLog: [choice.logMsg, ...prev.eventLog].slice(0, 30),
                  }
                })
                const chips = stateToChips(beforeState, store.getState())
                if (fired) audioSystem.playSFX('demotion')
                else if ((d.money ?? 0) > 0 || (d.morale ?? 0) > 10) audioSystem.playSFX('eventGood')
                this.eventModal.showResult(workEvent.title, choice.logMsg, chips, () => {
                  this.lastWorkEventId = null
                  // After result dismissed, trigger job_fired life event if applicable
                  if (fired) store.setState(prev => ({ ...prev, pendingLifeEventId: 'job_fired' }))
                })
              },
              { label: 'WORK EVENT' },
            )
          }
        }
      }

      // Weekend event modal
      if (newState.pendingWeekendEventId && newState.pendingWeekendEventId !== this.lastWeekendEventId) {
        this.lastWeekendEventId = newState.pendingWeekendEventId
        const weekendEvent = ALL_WEEKEND_EVENTS.find(e => e.id === newState.pendingWeekendEventId)
        if (weekendEvent) {
          store.setState(prev => ({ ...prev, pendingWeekendEventId: null }))

          this.weekendModal.show(weekendEvent, newState.player, (option) => {
            const beforeState = store.getState()
            const fx = option.effects
            const cap = (v: number) => Math.min(100, Math.max(0, v))
            store.setState(prev => {
              const p = prev.player
              const updated = {
                ...prev,
                player: {
                  ...p,
                  money:     fx.money     != null ? Math.max(0, p.money     + fx.money)     : p.money,
                  hunger:    fx.hunger    != null ? cap(p.hunger    + fx.hunger)    : p.hunger,
                  energy:    fx.energy    != null ? cap(p.energy    + fx.energy)    : p.energy,
                  health:    fx.health    != null ? cap(p.health    + fx.health)    : p.health,
                  morale:    fx.morale    != null ? cap(p.morale    + fx.morale)    : p.morale,
                  education: fx.education != null ? p.education + fx.education : p.education,
                },
              }
              return advanceWeek(updated)
            })
            const chips = stateToChips(beforeState, store.getState())
            this.weekendModal.showResult(weekendEvent.title, chips, () => { this.lastWeekendEventId = null })
          })
        }
      }
    })
  }

  private handleAction(actionId: string): void {
    const store = getStore()
    const state = store.getState()
    store.setState((_s) => executeAction(actionId, state.currentLocationId, state))

    // Starvation bleed: if starving, energy spent also costs health (30% rate)
    if (state.player.isStarving) {
      const afterState = store.getState()
      const energySpent = Math.max(0, state.player.energy - afterState.player.energy)
      if (energySpent > 0) {
        const healthCost = Math.ceil(energySpent * 0.3)
        store.setState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            health: Math.max(0, prev.player.health - healthCost),
          },
        }))
        // Check for death after bleed
        const afterBleed = store.getState()
        if (afterBleed.player.health <= 0 && !afterBleed.isGameOver) {
          store.setState(prev => ({
            ...prev,
            isGameOver: true,
            winCondition: 'lost' as const,
            lossReason: 'You starved to death.',
          }))
        }
      }
    }
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

    // Road centerlines — COL=[12,194,376,558], BUILDING_W=150 → right edges at 162,344,526,708
    // Street centers: (162+194)/2=178, (344+376)/2=360, (526+558)/2=542
    // ROW=[20,192,364], BUILDING_H=140 → bottom edges at 160,332,504
    // Street centers: (160+192)/2=176, (332+364)/2=348, 504+16=520
    const colCenters = [178, 360, 542]
    const rowCenters = [176, 348, 520]

    const roadW = 20

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
      g.fillRect(loc.x - pad, loc.y - pad, loc.width + pad * 2, loc.height + pad * 2 + 8)
      g.fillStyle(SIDEWALK_DARK, 1)
      g.fillRect(loc.x - pad, loc.y + loc.height + pad + 6, loc.width + pad * 2, 2)
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
    // Ignore map clicks while a modal is open (prevents action buttons propagating to map)
    if (
      document.getElementById('event-modal-backdrop') ||
      document.getElementById('weekend-modal-backdrop')
    ) return

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
    const energyCost = Math.max(2, Math.ceil(timeCost * 0.4))
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
          const withEnergy = { ...afterMove, player: { ...afterMove.player, energy: Math.max(0, afterMove.player.energy - energyCost) } }
          return { ...withEnergy, currentLocationId: id }
        })
        const newState = store.getState()
        targetSprite.setLocationActive(true)
        // Show actions for the new location
        this.hud.showActions(id, newState, (actionId) => this.handleAction(actionId), (msg) => this.showToast(msg))
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
      right: 290px;
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
    this.turnHandoffOverlay.hide()
    audioSystem.stopBGM()

    if (this.muteButton?.parentNode) {
      this.muteButton.parentNode.removeChild(this.muteButton)
      this.muteButton = null
    }
  }
}
