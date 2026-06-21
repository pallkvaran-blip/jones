import Phaser from 'phaser'
import { initStore, getStore } from '../state/store'
import { createInitialState } from '../state/initialState'
import { PLAYER_CHARACTERS } from '../data/playerCharacters'
import { audioSystem } from '../systems/AudioSystem'
import type { Difficulty } from '../state/types'

interface SceneData {
  p1Name: string
  p2Name: string
  numPlayers: 1 | 2
  difficulty: Difficulty
}

export class CharacterSelectScene extends Phaser.Scene {
  private overlay: HTMLElement | null = null
  private p1CharId = 'player_tyler'
  private p2CharId = 'player_vera'
  private selectingPlayer: 1 | 2 = 1
  private sceneData!: SceneData

  constructor() {
    super({ key: 'CharacterSelectScene' })
  }

  init(data: SceneData): void {
    this.sceneData = data
    this.p1CharId = 'player_tyler'
    this.p2CharId = 'player_vera'
    this.selectingPlayer = 1
  }

  create(): void {
    this.buildOverlay()
  }

  private buildOverlay(): void {
    const uiRoot = document.getElementById('ui-root')
    if (!uiRoot) return

    if (this.overlay?.parentNode) this.overlay.parentNode.removeChild(this.overlay)

    const pf = `'Press Start 2P', 'Courier New', monospace`
    const { p1Name, p2Name, numPlayers } = this.sceneData

    const currentName = this.selectingPlayer === 1 ? p1Name : p2Name
    const playerLabel = numPlayers === 2 ? `PLAYER ${this.selectingPlayer}: ${currentName.toUpperCase()}` : currentName.toUpperCase()

    const males = PLAYER_CHARACTERS.filter((c) => c.gender === 'male')
    const females = PLAYER_CHARACTERS.filter((c) => c.gender === 'female')
    const currentCharId = this.selectingPlayer === 1 ? this.p1CharId : this.p2CharId

    const cardHTML = (chars: typeof PLAYER_CHARACTERS) =>
      chars.map((c) => {
        const selected = c.id === currentCharId
        return `
          <button
            class="char-card"
            data-char-id="${c.id}"
            style="
              background: ${selected ? '#1e1e36' : '#0f0f1c'};
              border: 3px solid ${selected ? '#ffe066' : '#2a2a42'};
              box-shadow: ${selected ? '0 0 12px rgba(255,224,102,0.35), inset -2px -2px 0 #06060c' : 'inset -2px -2px 0 #06060c'};
              border-radius: 0;
              padding: 12px 8px 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              width: 140px;
              flex-shrink: 0;
              transition: border-color 0.1s, box-shadow 0.1s;
              font-family: ${pf};
            "
          >
            <img
              src="${import.meta.env.BASE_URL}${c.portrait}"
              width="96" height="96"
              alt="${c.name}"
              style="image-rendering:pixelated; display:block; border: 2px solid ${selected ? '#ffe066' : '#1a1a2e'};"
            />
            <span style="color:${selected ? '#ffe066' : '#e8e8f0'}; font-size:8px; letter-spacing:1px;">${c.name.toUpperCase()}</span>
            <span style="color:#4a4a66; font-size:6px; letter-spacing:1px;">${c.tagline.toUpperCase()}</span>
          </button>
        `
      }).join('')

    const el = document.createElement('div')
    el.id = 'char-select-overlay'
    el.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      pointer-events: auto;
      z-index: 200;
      overflow-y: auto;
      padding: 16px 0;
      box-sizing: border-box;
    `

    el.innerHTML = `
      <div style="font-family:${pf}; text-align:center;">
        <div style="color:#ffe066; font-size:clamp(10px,2vw,14px); letter-spacing:3px; text-shadow:2px 2px 0 #000;">
          CHOOSE YOUR CHARACTER
        </div>
        <div style="color:#6a6a88; font-size:7px; letter-spacing:2px; margin-top:8px;">
          ${playerLabel}
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          ${cardHTML(males)}
        </div>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          ${cardHTML(females)}
        </div>
      </div>

      <div style="display:flex; gap:16px; margin-top:4px;">
        <button id="char-back-btn" style="
          background: #14141f;
          border: 3px solid #2a2a42;
          box-shadow: inset -2px -2px 0 #06060c, 3px 3px 0 rgba(0,0,0,0.5);
          color: #6a6a88;
          font-family: ${pf};
          font-size: 8px;
          letter-spacing: 2px;
          padding: 10px 18px;
          cursor: pointer;
        ">← BACK</button>
        <button id="char-next-btn" style="
          background: #1a1a0a;
          border: 3px solid #ffe066;
          box-shadow: inset -2px -2px 0 #0a0a00, 3px 3px 0 rgba(0,0,0,0.5);
          color: #ffe066;
          font-family: ${pf};
          font-size: 8px;
          letter-spacing: 2px;
          padding: 10px 24px;
          cursor: pointer;
          text-shadow: 1px 1px 0 #000;
        ">${numPlayers === 2 && this.selectingPlayer === 1 ? 'NEXT →' : 'BEGIN ►'}</button>
      </div>
    `

    this.overlay = el
    uiRoot.appendChild(el)

    // Card click handlers
    el.querySelectorAll<HTMLButtonElement>('.char-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.charId
        if (!id) return
        audioSystem.playSFX('click')
        if (this.selectingPlayer === 1) this.p1CharId = id
        else this.p2CharId = id
        this.refreshCards()
      })
    })

    document.getElementById('char-back-btn')?.addEventListener('click', () => {
      audioSystem.playSFX('click')
      if (this.selectingPlayer === 2) {
        this.selectingPlayer = 1
        this.buildOverlay()
      } else {
        this.removeOverlay()
        this.scene.start('MenuScene')
      }
    })

    document.getElementById('char-next-btn')?.addEventListener('click', () => {
      audioSystem.playSFX('click')
      if (this.sceneData.numPlayers === 2 && this.selectingPlayer === 1) {
        this.selectingPlayer = 2
        this.buildOverlay()
      } else {
        this.launchGame()
      }
    })
  }

  private refreshCards(): void {
    const currentCharId = this.selectingPlayer === 1 ? this.p1CharId : this.p2CharId
    const pf = `'Press Start 2P', 'Courier New', monospace`

    this.overlay?.querySelectorAll<HTMLButtonElement>('.char-card').forEach((btn) => {
      const id = btn.dataset.charId
      if (!id) return
      const selected = id === currentCharId
      btn.style.background = selected ? '#1e1e36' : '#0f0f1c'
      btn.style.border = `3px solid ${selected ? '#ffe066' : '#2a2a42'}`
      btn.style.boxShadow = selected
        ? '0 0 12px rgba(255,224,102,0.35), inset -2px -2px 0 #06060c'
        : 'inset -2px -2px 0 #06060c'

      const nameEl = btn.querySelector<HTMLElement>('span:first-of-type')
      if (nameEl) nameEl.style.color = selected ? '#ffe066' : '#e8e8f0'

      const imgEl = btn.querySelector<HTMLImageElement>('img')
      if (imgEl) imgEl.style.border = `2px solid ${selected ? '#ffe066' : '#1a1a2e'}`
    })
  }

  private launchGame(): void {
    const { p1Name, p2Name, numPlayers, difficulty } = this.sceneData

    const state1 = createInitialState(p1Name, difficulty, this.p1CharId)
    state1.numPlayers = numPlayers
    state1.activePlayer = 1
    initStore(state1)

    if (numPlayers === 2) {
      const state2 = createInitialState(p2Name, difficulty, this.p2CharId)
      state2.numPlayers = 2
      state2.activePlayer = 1
      getStore().initTwoPlayer(state1, state2)
    }

    audioSystem.playBGM()
    this.removeOverlay()
    this.scene.start('CityScene')
  }

  private removeOverlay(): void {
    if (this.overlay?.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay)
    }
    this.overlay = null
  }

  shutdown(): void {
    this.removeOverlay()
  }
}
