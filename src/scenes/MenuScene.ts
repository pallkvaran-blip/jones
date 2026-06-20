import Phaser from 'phaser'
import { initStore, getStore } from '../state/store'
import { createInitialState } from '../state/initialState'
import { audioSystem } from '../systems/AudioSystem'
import { getHighScores } from '../data/highScores'
import { formatMoney } from '../utils/format'
import type { Difficulty } from '../state/types'

export class MenuScene extends Phaser.Scene {
  private selectedDifficulty: Difficulty = 'medium';
  private numPlayers: 1 | 2 = 1;
  private player2Name: string = '';
  private nameInput: HTMLInputElement | null = null;
  private menuContainer: HTMLElement | null = null;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d0d17, 0x0d0d17, 0x1a1a3e, 0x1a1a3e, 1);
    bg.fillRect(0, 0, 960, 540);

    // Draw some decorative city silhouette
    this.drawCitySilhouette();

    // DOM overlay for the menu
    this.createMenuDOM();
  }

  private drawCitySilhouette(): void {
    const g = this.add.graphics();
    g.fillStyle(0x0d0d2a, 0.8);

    // Simple building silhouettes at the bottom
    const buildings = [
      { x: 0,   w: 60,  h: 120 },
      { x: 70,  w: 45,  h: 90 },
      { x: 125, w: 80,  h: 160 },
      { x: 215, w: 50,  h: 100 },
      { x: 275, w: 100, h: 140 },
      { x: 385, w: 60,  h: 180 },
      { x: 455, w: 90,  h: 110 },
      { x: 555, w: 70,  h: 150 },
      { x: 635, w: 55,  h: 95  },
      { x: 700, w: 100, h: 130 },
    ];

    for (const b of buildings) {
      g.fillRect(b.x, 540 - b.h, b.w, b.h);
    }
    // a couple extra to span the wider canvas
    g.fillRect(810, 540 - 150, 80, 150);
    g.fillRect(900, 540 - 110, 60, 110);

    // Stars
    g.fillStyle(0xFFFFFF, 0.6);
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * 960;
      const sy = Math.random() * 240;
      g.fillRect(sx, sy, 2, 2);
    }
  }

  private createMenuDOM(): void {
    const uiRoot = document.getElementById('ui-root');
    if (!uiRoot) return;

    this.menuContainer = document.createElement('div');
    this.menuContainer.id = 'menu-overlay';
    this.menuContainer.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      pointer-events: auto;
      z-index: 200;
      overflow-y: auto;
    `;

    const pf = `'Press Start 2P', 'Courier New', monospace`;
    this.menuContainer.innerHTML = `
      <div style="text-align:center; margin-bottom: 4px; font-family:${pf};">
        <h1 style="
          font-family:${pf};
          font-size: clamp(40px, 9vw, 72px);
          letter-spacing: 6px;
          color: #F5A623;
          text-shadow: 4px 4px 0 #000, 0 0 24px rgba(245,166,35,0.4);
          margin: 0;
          line-height: 1;
        ">FUSI</h1>
        <p style="
          color: #8a8aa6;
          font-size: 8px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 14px;
          font-family:${pf};
        ">Life in the Fast Lane</p>
      </div>

      <div style="
        background: #14141f;
        border: 3px solid #4a4a66;
        box-shadow: inset -3px -3px 0 #06060c, 6px 6px 0 rgba(0,0,0,0.5);
        padding: 22px 26px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        min-width: 280px;
        max-width: 360px;
        width: 90%;
        font-family:${pf};
      ">
        <div>
          <label style="display:block; color:#8a8aa6; font-size:8px; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; font-family:${pf};">Your Name</label>
          <input
            id="player-name-input"
            type="text"
            placeholder="ENTER NAME"
            maxlength="20"
            style="
              width: 100%;
              padding: 10px 10px;
              background: #06060c;
              border: 2px solid #3a3a52;
              color: #e8e8f0;
              font-size: 10px;
              outline: none;
              font-family:${pf};
              box-sizing: border-box;
            "
          />
          <div id="name-error" style="
            display: none;
            color: #E74C3C;
            font-size: 7px;
            margin-top: 5px;
            font-family:${pf};
            letter-spacing: 1px;
          ">&#9888; PLEASE ENTER YOUR NAME</div>
        </div>

        <div>
          <label style="display:block; color:#8a8aa6; font-size:8px; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; font-family:${pf};">Players</label>
          <div style="display:flex; gap:8px; margin-bottom: 8px;">
            <button class="players-btn selected" data-players="1" style="flex:1; padding:10px 2px; background:#3a2a0a; border:2px solid #F5A623; color:#F5A623; font-size:8px; cursor:pointer; font-family:${pf}; box-shadow: 0 0 8px #F5A623;">1P</button>
            <button class="players-btn" data-players="2" style="flex:1; padding:10px 2px; background:#1a1a2e; border:2px solid #4a4a66; color:#8a8aa6; font-size:8px; cursor:pointer; font-family:${pf};">2P</button>
          </div>
          <div id="player2-name-container" style="display:none;">
            <label style="display:block; color:#8a8aa6; font-size:8px; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; font-family:${pf};">Player 2 Name</label>
            <input
              id="player2-name-input"
              type="text"
              placeholder="ENTER NAME"
              maxlength="20"
              style="
                width: 100%;
                padding: 10px 10px;
                background: #06060c;
                border: 2px solid #3a3a52;
                color: #e8e8f0;
                font-size: 10px;
                outline: none;
                font-family:${pf};
                box-sizing: border-box;
              "
            />
            <div id="player2-name-error" style="
              display: none;
              color: #E74C3C;
              font-size: 7px;
              margin-top: 5px;
              font-family:${pf};
              letter-spacing: 1px;
            ">&#9888; PLEASE ENTER PLAYER 2 NAME</div>
          </div>
        </div>

        <div>
          <label style="display:block; color:#8a8aa6; font-size:8px; letter-spacing:1px; text-transform:uppercase; margin-bottom:10px; font-family:${pf};">Lifespan</label>
          <div style="display:flex; gap:8px;">
            <button class="diff-btn" data-diff="short" style="flex:1; padding:10px 2px; background:#2a0f0c; border:2px solid #E74C3C; color:#E74C3C; font-size:8px; cursor:pointer; font-family:${pf};">SHORT</button>
            <button class="diff-btn selected" data-diff="medium" style="flex:1; padding:10px 2px; background:#3a2a0a; border:2px solid #F5A623; color:#F5A623; font-size:8px; cursor:pointer; font-family:${pf};">MED</button>
            <button class="diff-btn" data-diff="long" style="flex:1; padding:10px 2px; background:#0e2417; border:2px solid #2ECC71; color:#2ECC71; font-size:8px; cursor:pointer; font-family:${pf};">LONG</button>
          </div>
        </div>

        <button id="start-game-btn" style="
          padding: 14px;
          background: #F5A623;
          border: 3px solid #ffd24a;
          box-shadow: inset -3px -3px 0 #b87d20;
          color: #14141f;
          font-size: 11px;
          letter-spacing: 2px;
          cursor: pointer;
          font-family:${pf};
          text-transform: uppercase;
        ">START</button>

        <button id="high-scores-btn" style="
          padding: 10px 14px;
          background: #0e0e1c;
          border: 2px solid #4a4a66;
          color: #8a8aa6;
          font-size: 8px;
          letter-spacing: 2px;
          cursor: pointer;
          font-family:${pf};
          text-transform: uppercase;
        ">HIGH SCORES</button>
      </div>
    `;

    uiRoot.appendChild(this.menuContainer);

    // Get reference to name input
    this.nameInput = document.getElementById('player-name-input') as HTMLInputElement;
    if (this.nameInput) {
      this.nameInput.focus();
    }

    // Players toggle buttons
    const playersBtns = this.menuContainer.querySelectorAll<HTMLButtonElement>('.players-btn');
    playersBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.numPlayers = (parseInt(btn.dataset['players'] ?? '1', 10) as 1 | 2);
        this.updatePlayersButtons(playersBtns);
        const p2Container = document.getElementById('player2-name-container') as HTMLElement | null;
        if (p2Container) {
          p2Container.style.display = this.numPlayers === 2 ? 'block' : 'none';
        }
        audioSystem.playSFX('click');
      });
    });

    // Difficulty button listeners
    const diffBtns = this.menuContainer.querySelectorAll<HTMLButtonElement>('.diff-btn');
    diffBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedDifficulty = (btn.dataset['diff'] as Difficulty) ?? 'medium';
        this.updateDifficultyButtons(diffBtns);
        audioSystem.playSFX('click');
      });
    });

    // Start button
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
      startBtn.addEventListener('mouseenter', () => {
        (startBtn as HTMLElement).style.background = '#FFB84D';
        (startBtn as HTMLElement).style.transform = 'scale(1.02)';
      });
      startBtn.addEventListener('mouseleave', () => {
        (startBtn as HTMLElement).style.background = '#F5A623';
        (startBtn as HTMLElement).style.transform = 'scale(1)';
      });
    }

    // High scores button
    const hsBtn = document.getElementById('high-scores-btn');
    if (hsBtn) {
      hsBtn.addEventListener('click', () => this.showHighScores());
      hsBtn.addEventListener('mouseenter', () => {
        (hsBtn as HTMLElement).style.borderColor = '#8a8aa6';
        (hsBtn as HTMLElement).style.color = '#c8c8e0';
      });
      hsBtn.addEventListener('mouseleave', () => {
        (hsBtn as HTMLElement).style.borderColor = '#4a4a66';
        (hsBtn as HTMLElement).style.color = '#8a8aa6';
      });
    }

    // Enter key starts game; clear error when typing
    if (this.nameInput) {
      this.nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.startGame();
      });
      this.nameInput.addEventListener('input', () => {
        const errorEl = document.getElementById('name-error') as HTMLElement | null;
        if (errorEl) errorEl.style.display = 'none';
        if (this.nameInput) this.nameInput.style.borderColor = '#3a3a52';
      });
    }

    const p2Input = document.getElementById('player2-name-input') as HTMLInputElement | null;
    if (p2Input) {
      p2Input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.startGame();
      });
      p2Input.addEventListener('input', () => {
        const errorEl = document.getElementById('player2-name-error') as HTMLElement | null;
        if (errorEl) errorEl.style.display = 'none';
        p2Input.style.borderColor = '#3a3a52';
      });
    }
  }

  private updatePlayersButtons(buttons: NodeListOf<HTMLButtonElement>): void {
    buttons.forEach(btn => {
      const num = parseInt(btn.dataset['players'] ?? '1', 10);
      const selected = num === this.numPlayers;
      if (selected) {
        btn.style.background = '#3a2a0a';
        btn.style.border = '2px solid #F5A623';
        btn.style.color = '#F5A623';
        btn.style.boxShadow = '0 0 8px #F5A623';
      } else {
        btn.style.background = '#1a1a2e';
        btn.style.border = '2px solid #4a4a66';
        btn.style.color = '#8a8aa6';
        btn.style.boxShadow = 'none';
      }
    });
  }

  private updateDifficultyButtons(buttons: NodeListOf<HTMLButtonElement>): void {
    const colors: Record<Difficulty, { dim: string; lit: string; border: string; color: string }> = {
      short:  { dim: '#2a0f0c', lit: '#4a1a14', border: '#E74C3C', color: '#E74C3C' },
      medium: { dim: '#3a2a0a', lit: '#5a4010', border: '#F5A623', color: '#F5A623' },
      long:   { dim: '#0e2417', lit: '#1a4a2c', border: '#2ECC71', color: '#2ECC71' },
    };

    buttons.forEach(btn => {
      const diff = (btn.dataset['diff'] as Difficulty) ?? 'medium';
      const c = colors[diff];
      const selected = diff === this.selectedDifficulty;
      btn.style.background = selected ? c.lit : c.dim;
      btn.style.border = `2px solid ${c.border}`;
      btn.style.color = c.color;
      btn.style.boxShadow = selected ? `0 0 8px ${c.border}` : 'none';
    });
  }

  private startGame(): void {
    const p1Name = this.nameInput?.value.trim() ?? '';

    if (!p1Name) {
      const nameInput = document.getElementById('player-name-input') as HTMLInputElement | null;
      const errorEl = document.getElementById('name-error') as HTMLElement | null;
      if (nameInput) nameInput.style.borderColor = '#E74C3C';
      if (errorEl) errorEl.style.display = 'block';
      if (nameInput) nameInput.focus();
      return;
    }

    const p2Name = this.numPlayers === 2
      ? (document.getElementById('player2-name-input') as HTMLInputElement)?.value.trim() ?? ''
      : '';

    if (this.numPlayers === 2 && !p2Name) {
      const p2Input = document.getElementById('player2-name-input') as HTMLInputElement | null;
      const errorEl = document.getElementById('player2-name-error') as HTMLElement | null;
      if (p2Input) p2Input.style.borderColor = '#E74C3C';
      if (errorEl) errorEl.style.display = 'block';
      if (p2Input) p2Input.focus();
      return;
    }

    const state1 = createInitialState(p1Name, this.selectedDifficulty);
    state1.numPlayers = this.numPlayers;
    state1.activePlayer = 1;

    initStore(state1);

    if (this.numPlayers === 2) {
      const state2 = createInitialState(p2Name, this.selectedDifficulty);
      state2.numPlayers = 2;
      state2.activePlayer = 1;
      getStore().initTwoPlayer(state1, state2);
    }

    // Start audio (must be on user gesture)
    audioSystem.playBGM();

    // Remove menu DOM
    if (this.menuContainer?.parentNode) {
      this.menuContainer.parentNode.removeChild(this.menuContainer);
    }
    this.menuContainer = null;

    this.scene.start('CityScene');
  }

  private showHighScores(): void {
    const uiRoot = document.getElementById('ui-root');
    if (!uiRoot) return;

    const pf = `'Press Start 2P', 'Courier New', monospace`;
    const scores = getHighScores();

    const diffLabels: Record<Difficulty, string> = { short: 'SHORT (4 WKS)', medium: 'MEDIUM (8 WKS)', long: 'LONG (12 WKS)' };
    const diffColors: Record<Difficulty, string> = { short: '#E74C3C', medium: '#F5A623', long: '#2ECC71' };

    const buildTable = (diff: Difficulty): string => {
      const entries = scores[diff];
      const color = diffColors[diff];
      const rows = entries.length > 0
        ? entries.map((e, i) => {
            const medal = i === 0 ? '&#x1F947;' : i === 1 ? '&#x1F948;' : i === 2 ? '&#x1F949;' : `${i + 1}.`;
            const outcomeColor = e.winCondition === 'won' ? '#2ECC71' : '#E74C3C';
            const outcomeIcon = e.winCondition === 'won' ? '&#x2713;' : '&#x2717;';
            return `
              <div style="display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid #1a1a2e; font-size:7px;">
                <span style="min-width:20px; text-align:center;">${medal}</span>
                <span style="flex:1; color:#e8e8f0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${e.playerName}</span>
                <span style="color:#ffd24a; min-width:70px; text-align:right;">${formatMoney(e.money)}</span>
                <span style="color:${outcomeColor}; min-width:12px; text-align:center;">${outcomeIcon}</span>
                <span style="color:${color}; min-width:14px; text-align:right;">${e.grade}</span>
              </div>
            `;
          }).join('')
        : `<div style="color:#4a4a66; font-size:7px; padding:10px 0; text-align:center;">No scores yet.</div>`;

      return `
        <div style="flex:1; min-width:200px;">
          <div style="font-size:7px; color:${color}; letter-spacing:1px; margin-bottom:8px; padding-bottom:4px; border-bottom:2px solid ${color};">${diffLabels[diff]}</div>
          ${rows}
        </div>
      `;
    };

    const overlay = document.createElement('div');
    overlay.id = 'hs-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.88);
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ${pf};
    `;

    overlay.innerHTML = `
      <div style="
        background: #14141f;
        border: 3px solid #4a4a66;
        box-shadow: inset -3px -3px 0 #06060c, 8px 8px 0 rgba(0,0,0,0.5);
        padding: 24px 22px 18px;
        max-width: 720px;
        width: 94%;
        display: flex;
        flex-direction: column;
        gap: 16px;
      ">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div style="font-size:11px; color:#F5A623; letter-spacing:2px; text-shadow:2px 2px 0 #000;">HIGH SCORES</div>
          <button id="hs-close-btn" style="
            padding:6px 12px;
            background:#1a1a2e;
            border:2px solid #4a4a66;
            color:#8a8aa6;
            font-size:8px;
            cursor:pointer;
            font-family:${pf};
          ">CLOSE</button>
        </div>
        <div style="font-size:6px; color:#4a4a66; letter-spacing:1px;">RANKED BY TOTAL CASH &amp; SAVINGS</div>
        <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start;">
          ${buildTable('short')}
          ${buildTable('medium')}
          ${buildTable('long')}
        </div>
      </div>
    `;

    uiRoot.appendChild(overlay);

    const closeBtn = document.getElementById('hs-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      });
      closeBtn.addEventListener('mouseenter', () => {
        (closeBtn as HTMLElement).style.borderColor = '#8a8aa6';
        (closeBtn as HTMLElement).style.color = '#e8e8f0';
      });
      closeBtn.addEventListener('mouseleave', () => {
        (closeBtn as HTMLElement).style.borderColor = '#4a4a66';
        (closeBtn as HTMLElement).style.color = '#8a8aa6';
      });
    }

    overlay.addEventListener('pointerdown', (e) => {
      if (e.target === overlay) overlay.parentNode?.removeChild(overlay);
    });
  }

  shutdown(): void {
    if (this.menuContainer?.parentNode) {
      this.menuContainer.parentNode.removeChild(this.menuContainer);
    }
  }
}
