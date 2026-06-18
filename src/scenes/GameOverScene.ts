import Phaser from 'phaser'
import { getStore, initStore } from '../state/store'
import { createInitialState } from '../state/initialState'
import { audioSystem } from '../systems/AudioSystem'
import { formatMoney } from '../utils/format'

export class GameOverScene extends Phaser.Scene {
  private uiContainer: HTMLElement | null = null;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    audioSystem.stopBGM();

    // Dark background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d0d17, 0x0d0d17, 0x1a0033, 0x1a0033, 1);
    bg.fillRect(0, 0, 960, 540);

    // Get final state
    const store = getStore();
    const state = store.getState();

    // Build DOM overlay
    const uiRoot = document.getElementById('ui-root');
    if (!uiRoot) return;

    this.uiContainer = document.createElement('div');
    this.uiContainer.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      pointer-events: auto;
      z-index: 200;
    `;

    const isWin = state.winCondition === 'won';
    const titleColor = isWin ? '#F5A623' : '#E74C3C';
    const titleText = isWin ? 'YOU WIN!' : "TIME'S UP!";
    const subtitleText = state.lossReason ?? (isWin ? 'All goals achieved!' : 'Game over');
    const pf = `'Press Start 2P', 'Courier New', monospace`;

    // Goals summary rows
    const goalNames = ['Wealth', 'Education', 'Career', 'Happiness'];
    const goalKeys: Array<keyof typeof state.goalsMet> = ['targetWealth', 'targetEducation', 'targetCareerRank', 'targetHappiness'];
    const goalsRows = goalKeys.map((key, i) => {
      const met = state.goalsMet[key];
      const icon = met ? '&#x2713;' : '&#x2717;';
      const color = met ? '#2ECC71' : '#E74C3C';
      return `
        <div style="display:flex; justify-content:space-between; gap:16px; color:#e8e8f0; font-size:8px;">
          <span style="color:#8a8aa6; text-transform:uppercase;">${goalNames[i]}</span>
          <span style="color:${color};">${icon}</span>
        </div>
      `;
    }).join('');

    this.uiContainer.innerHTML = `
      <div style="text-align:center; max-width:560px; padding: 0 20px; font-family:${pf};">
        <h1 style="
          font-family:${pf};
          font-size: clamp(24px, 6vw, 44px);
          color: ${titleColor};
          text-shadow: 4px 4px 0 #000, 0 0 20px ${titleColor}88;
          letter-spacing: 3px;
          line-height: 1.3;
          margin-bottom: 16px;
        ">${titleText}</h1>
        <p style="color: #8a8aa6; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; font-family:${pf};">
          ${subtitleText}
        </p>
      </div>

      <div style="
        background: #14141f;
        border: 3px solid #4a4a66;
        box-shadow: inset -3px -3px 0 #06060c;
        padding: 22px 26px;
        min-width: 280px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-family:${pf};
      ">
        <div style="display:flex; justify-content:space-between; gap:16px; color:#e8e8f0; font-size:8px;">
          <span style="color:#8a8aa6; text-transform:uppercase;">Player</span>
          <span>${state.player.name}</span>
        </div>
        <div style="display:flex; justify-content:space-between; gap:16px; color:#e8e8f0; font-size:8px;">
          <span style="color:#8a8aa6; text-transform:uppercase;">Weeks</span>
          <span>${state.calendar.week - 1} / ${state.calendar.maxWeeks}</span>
        </div>
        <div style="display:flex; justify-content:space-between; gap:16px; color:#e8e8f0; font-size:8px;">
          <span style="color:#8a8aa6; text-transform:uppercase;">Cash</span>
          <span style="color:#ffd24a;">${formatMoney(state.player.money)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; gap:16px; color:#e8e8f0; font-size:8px;">
          <span style="color:#8a8aa6; text-transform:uppercase;">Diff</span>
          <span style="text-transform:capitalize;">${state.difficulty}</span>
        </div>
        <hr style="border:none; border-top:1px solid #3a3a52; margin:2px 0;" />
        <div style="color:#8a8aa6; font-size:7px; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Goals</div>
        ${goalsRows}
      </div>

      <button id="play-again-btn" style="
        padding: 14px 36px;
        background: #F5A623;
        border: 3px solid #ffd24a;
        box-shadow: inset -3px -3px 0 #b87d20;
        color: #14141f;
        font-size: 11px;
        letter-spacing: 2px;
        cursor: pointer;
        font-family:${pf};
        text-transform: uppercase;
      ">PLAY AGAIN</button>
    `;

    uiRoot.appendChild(this.uiContainer);

    const btn = document.getElementById('play-again-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        // Reset with same name and difficulty
        initStore(createInitialState(state.player.name, state.difficulty));
        if (this.uiContainer?.parentNode) {
          this.uiContainer.parentNode.removeChild(this.uiContainer);
          this.uiContainer = null;
        }
        this.scene.start('MenuScene');
      });
      btn.addEventListener('mouseenter', () => {
        (btn as HTMLElement).style.background = '#FFB84D';
        (btn as HTMLElement).style.transform = 'scale(1.05)';
      });
      btn.addEventListener('mouseleave', () => {
        (btn as HTMLElement).style.background = '#F5A623';
        (btn as HTMLElement).style.transform = 'scale(1)';
      });
    }
  }

  shutdown(): void {
    if (this.uiContainer?.parentNode) {
      this.uiContainer.parentNode.removeChild(this.uiContainer);
      this.uiContainer = null;
    }
  }
}
