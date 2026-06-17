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
    bg.fillGradientStyle(0x0d0d1a, 0x0d0d1a, 0x1a0033, 0x1a0033, 1);
    bg.fillRect(0, 0, 800, 450);

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
    const titleText = isWin ? '🎉 WEEK COMPLETE!' : "TIME'S UP!";
    const subtitleText = state.lossReason ?? (isWin ? 'Great job!' : 'Game over');

    this.uiContainer.innerHTML = `
      <div style="text-align:center; max-width:500px; padding: 0 20px;">
        <h1 style="
          font-size: clamp(36px, 8vw, 64px);
          font-weight: 900;
          color: ${titleColor};
          text-shadow: 0 0 20px ${titleColor}88;
          letter-spacing: 4px;
          margin-bottom: 8px;
        ">${titleText}</h1>
        <p style="color: #888; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">
          ${subtitleText}
        </p>
      </div>

      <div style="
        background: rgba(13,13,30,0.9);
        border: 1px solid #333;
        border-radius: 8px;
        padding: 24px 32px;
        min-width: 260px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      ">
        <div style="display:flex; justify-content:space-between; color:#e0e0e0;">
          <span style="color:#888; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Player</span>
          <span style="font-weight:600;">${state.player.name}</span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#e0e0e0;">
          <span style="color:#888; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Weeks Survived</span>
          <span style="font-weight:600;">${state.calendar.week - 1} / ${state.calendar.maxWeeks}</span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#e0e0e0;">
          <span style="color:#888; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Final Cash</span>
          <span style="font-weight:600; color:#F5A623;">${formatMoney(state.player.money)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#e0e0e0;">
          <span style="color:#888; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Difficulty</span>
          <span style="font-weight:600; text-transform:capitalize;">${state.difficulty}</span>
        </div>
      </div>

      <button id="play-again-btn" style="
        padding: 14px 40px;
        background: #F5A623;
        border: none;
        border-radius: 6px;
        color: #0d0d1a;
        font-size: 16px;
        font-weight: 900;
        letter-spacing: 2px;
        cursor: pointer;
        font-family: inherit;
        text-transform: uppercase;
        transition: all 0.15s;
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
