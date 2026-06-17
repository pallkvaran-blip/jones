import Phaser from 'phaser'
import { initStore } from '../state/store'
import { createInitialState } from '../state/initialState'
import { audioSystem } from '../systems/AudioSystem'
import type { Difficulty } from '../state/types'

export class MenuScene extends Phaser.Scene {
  private selectedDifficulty: Difficulty = 'normal';
  private nameInput: HTMLInputElement | null = null;
  private menuContainer: HTMLElement | null = null;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d0d1a, 0x0d0d1a, 0x1a1a3e, 0x1a1a3e, 1);
    bg.fillRect(0, 0, 800, 450);

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
      g.fillRect(b.x, 450 - b.h, b.w, b.h);
    }

    // Stars
    g.fillStyle(0xFFFFFF, 0.6);
    for (let i = 0; i < 50; i++) {
      const sx = Math.random() * 800;
      const sy = Math.random() * 200;
      g.fillRect(sx, sy, 1, 1);
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
    `;

    this.menuContainer.innerHTML = `
      <div style="text-align:center; margin-bottom: 8px;">
        <h1 style="
          font-size: clamp(48px, 10vw, 80px);
          font-weight: 900;
          letter-spacing: 12px;
          color: #F5A623;
          text-shadow: 0 0 20px rgba(245,166,35,0.5), 0 2px 4px rgba(0,0,0,0.8);
          margin: 0;
          line-height: 1;
        ">JONES</h1>
        <p style="
          color: #888;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-top: 6px;
        ">Life in the Fast Lane</p>
      </div>

      <div style="
        background: rgba(13,13,30,0.85);
        border: 1px solid #333;
        border-radius: 8px;
        padding: 24px 32px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 280px;
        max-width: 360px;
        width: 90%;
      ">
        <div>
          <label style="display:block; color:#888; font-size:11px; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">Your Name</label>
          <input
            id="player-name-input"
            type="text"
            placeholder="Enter your name..."
            maxlength="20"
            style="
              width: 100%;
              padding: 10px 12px;
              background: rgba(255,255,255,0.05);
              border: 1px solid #444;
              border-radius: 4px;
              color: #e0e0e0;
              font-size: 15px;
              outline: none;
              font-family: inherit;
            "
          />
        </div>

        <div>
          <label style="display:block; color:#888; font-size:11px; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">Difficulty</label>
          <div style="display:flex; gap:8px;">
            <button class="diff-btn" data-diff="easy" style="flex:1; padding:8px 4px; background:rgba(46,204,113,0.15); border:1px solid #2ECC71; border-radius:4px; color:#2ECC71; font-size:12px; cursor:pointer; font-family:inherit; transition: all 0.15s;">Easy</button>
            <button class="diff-btn selected" data-diff="normal" style="flex:1; padding:8px 4px; background:rgba(245,166,35,0.3); border:2px solid #F5A623; border-radius:4px; color:#F5A623; font-size:12px; cursor:pointer; font-family:inherit; font-weight:700; transition: all 0.15s;">Normal</button>
            <button class="diff-btn" data-diff="hard" style="flex:1; padding:8px 4px; background:rgba(231,76,60,0.15); border:1px solid #E74C3C; border-radius:4px; color:#E74C3C; font-size:12px; cursor:pointer; font-family:inherit; transition: all 0.15s;">Hard</button>
          </div>
        </div>

        <button id="start-game-btn" style="
          padding: 14px;
          background: #F5A623;
          border: none;
          border-radius: 6px;
          color: #0d0d1a;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 2px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          text-transform: uppercase;
        ">START GAME</button>
      </div>
    `;

    uiRoot.appendChild(this.menuContainer);

    // Get reference to name input
    this.nameInput = document.getElementById('player-name-input') as HTMLInputElement;
    if (this.nameInput) {
      this.nameInput.focus();
    }

    // Difficulty button listeners
    const diffBtns = this.menuContainer.querySelectorAll<HTMLButtonElement>('.diff-btn');
    diffBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedDifficulty = (btn.dataset['diff'] as Difficulty) ?? 'normal';
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

    // Enter key starts game
    if (this.nameInput) {
      this.nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.startGame();
      });
    }
  }

  private updateDifficultyButtons(buttons: NodeListOf<HTMLButtonElement>): void {
    const colors: Record<Difficulty, { bg: string; border: string; color: string }> = {
      easy:   { bg: 'rgba(46,204,113,0.15)',  border: '#2ECC71', color: '#2ECC71' },
      normal: { bg: 'rgba(245,166,35,0.15)',  border: '#F5A623', color: '#F5A623' },
      hard:   { bg: 'rgba(231,76,60,0.15)',   border: '#E74C3C', color: '#E74C3C' },
    };

    buttons.forEach(btn => {
      const diff = (btn.dataset['diff'] as Difficulty) ?? 'normal';
      const c = colors[diff];
      if (diff === this.selectedDifficulty) {
        btn.style.background = c.bg.replace('0.15', '0.35');
        btn.style.border = `2px solid ${c.border}`;
        btn.style.color = c.color;
        btn.style.fontWeight = '700';
      } else {
        btn.style.background = c.bg;
        btn.style.border = `1px solid ${c.border}`;
        btn.style.color = c.color;
        btn.style.fontWeight = '400';
      }
    });
  }

  private startGame(): void {
    const playerName = this.nameInput?.value.trim() || 'Player';
    const initialState = createInitialState(playerName, this.selectedDifficulty);
    initStore(initialState);

    // Start audio (must be on user gesture)
    audioSystem.playBGM();

    // Remove menu DOM
    if (this.menuContainer?.parentNode) {
      this.menuContainer.parentNode.removeChild(this.menuContainer);
    }
    this.menuContainer = null;

    this.scene.start('CityScene');
  }

  shutdown(): void {
    if (this.menuContainer?.parentNode) {
      this.menuContainer.parentNode.removeChild(this.menuContainer);
    }
  }
}
