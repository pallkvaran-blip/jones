import Phaser from 'phaser'
import { getStore, initStore } from '../state/store'
import { createInitialState } from '../state/initialState'
import { audioSystem } from '../systems/AudioSystem'
import { formatMoney } from '../utils/format'
import { addHighScore } from '../data/highScores'
import type { GameState, Player, TransportType } from '../state/types'
import { getHousingTier } from '../data/housing'

// ── Net worth / Grade helpers ─────────────────────────────────────────────────

const VEHICLE_VALUE: Record<TransportType, number> = {
  walking:   0,
  bicycle:   200,
  suv:       1000,
  sportscar: 2500,
}

function calcNetWorth(state: GameState): number {
  const { player, economy } = state
  const portfolioValue = Object.entries(player.portfolio).reduce(
    (sum, [stock, shares]) => sum + shares * (economy.stockPrices[stock] ?? 0), 0
  )
  const housingValue   = getHousingTier(player.housingId)?.purchaseCost ?? 0
  const vehicleValue   = VEHICLE_VALUE[player.transport] ?? 0
  const electronicsValue = (player.hasComputer  ? 350 : 0)
                         + (player.hasCoffeeMaker ? 200 : 0)
                         + (player.hasTV          ? 250 : 0)
                         + (player.hasTreadmill   ? 150 : 0)
  return player.money + player.bankBalance + portfolioValue + housingValue + vehicleValue + electronicsValue - player.debt
}

function getGrade(netWorth: number, lossReason: string | null): string {
  if (lossReason?.includes('starved') || lossReason?.includes('health failed')) return 'F'
  if (netWorth >= 50000) return 'S'
  if (netWorth >= 20000) return 'A'
  if (netWorth >= 8000)  return 'B'
  if (netWorth >= 2000)  return 'C'
  if (netWorth >= 0)     return 'D'
  return 'F'
}

function gradeColor(grade: string): string {
  switch (grade) {
    case 'S': return '#FFD700'
    case 'A': return '#2ECC71'
    case 'B': return '#00BFFF'
    case 'C': return '#F5A623'
    case 'D': return '#FF8C00'
    default:  return '#E74C3C'
  }
}

function gradeTagline(grade: string): string {
  switch (grade) {
    case 'S': return 'Loaded. Pure profit.'
    case 'A': return 'Comfortable. Very comfortable.'
    case 'B': return 'Solid earnings.'
    case 'C': return 'Could be worse.'
    case 'D': return "You're barely in the green."
    default:  return 'In the red. Again.'
  }
}

function statBar(value: number, max = 100, color = '#4a9eff'): string {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
  return `
    <div style="flex:1; height:6px; background:#2a2a3e; border:1px solid #3a3a52; overflow:hidden;">
      <div style="width:${pct}%; height:100%; background:${color};"></div>
    </div>
  `
}

function moneyBreakdown(state: GameState): string {
  const { player, economy } = state
  const portfolioValue = Object.entries(player.portfolio).reduce(
    (sum, [stock, shares]) => sum + shares * (economy.stockPrices[stock] ?? 0), 0
  )
  const pf = `'Press Start 2P', 'Courier New', monospace`

  const row = (label: string, value: number, color = '#e8e8f0') => {
    if (value === 0) return ''
    return `
      <div style="display:flex; justify-content:space-between; gap:8px; font-size:7px; font-family:${pf};">
        <span style="color:#8a8aa6;">${label}</span>
        <span style="color:${color};">${formatMoney(value)}</span>
      </div>
    `
  }

  const netWorth = player.money + player.bankBalance + portfolioValue - player.debt
  const nwColor = netWorth >= 0 ? '#ffd24a' : '#e74c3c'

  return `
    ${row('Cash', player.money, '#ffd24a')}
    ${row('Savings', player.bankBalance, '#ffd24a')}
    ${row('Investments', portfolioValue, '#a0d8a0')}
    ${player.debt > 0 ? row('Debt', -player.debt, '#e74c3c') : ''}
    <div style="border-top:1px solid #3a3a52; margin:6px 0;"></div>
    <div style="display:flex; justify-content:space-between; gap:8px; font-size:8px; font-family:${pf};">
      <span style="color:#8a8aa6;">NET WORTH</span>
      <span style="color:${nwColor}; font-weight:bold;">${formatMoney(netWorth)}</span>
    </div>
  `
}

// ── Scene ─────────────────────────────────────────────────────────────────────

export class GameOverScene extends Phaser.Scene {
  private uiContainer: HTMLElement | null = null;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    audioSystem.stopBGM();

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d0d17, 0x0d0d17, 0x1a0033, 0x1a0033, 1);
    bg.fillRect(0, 0, 960, 540);

    const store = getStore();
    const state = store.getState();

    const survived = state.winCondition === 'won';

    setTimeout(() => {
      audioSystem.playSFX(survived ? 'gameWin' : 'gameLose');
    }, 300);

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
      pointer-events: auto;
      z-index: 200;
      overflow-y: auto;
    `;

    const pf = `'Press Start 2P', 'Courier New', monospace`;

    if (state.numPlayers === 2) {
      const bothStates = store.getBothStates();
      const s1 = bothStates[0]!;
      const s2 = bothStates[1]!;

      for (const s of [s1, s2]) {
        const nw = calcNetWorth(s)
        addHighScore({
          playerName: s.player.name,
          difficulty: s.difficulty,
          money: nw,
          score: nw,
          grade: '',
          winCondition: s.winCondition,
          weeksReached: Math.max(0, s.calendar.week - 1),
          timestamp: Date.now(),
        });
      }

      const renderPlayerCard = (s: GameState, highlight: boolean): string => {
        const nw = calcNetWorth(s)
        const survived2 = s.winCondition === 'won'
        const outcomeColor = survived2 ? '#2ECC71' : '#E74C3C';
        const outcomeText = survived2 ? 'SURVIVED' : 'LOST';
        const borderColor = highlight ? '#F5A623' : '#4a4a66';
        const nameColor = highlight ? '#F5A623' : '#8a8aa6';
        return `
          <div style="
            background: #14141f;
            border: 3px solid ${borderColor};
            box-shadow: inset -3px -3px 0 #06060c${highlight ? ', 0 0 12px #F5A62366' : ''};
            padding: 16px 18px;
            flex: 1;
            min-width: 180px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-family:${pf};
          ">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <div style="color:${nameColor}; font-size:9px; letter-spacing:1px;">${s.player.name}</div>
            </div>
            <div style="color:${outcomeColor}; font-size:8px; letter-spacing:1px;">${outcomeText}</div>
            <hr style="border:none; border-top:1px solid #3a3a52;" />
            ${moneyBreakdown(s)}
            <hr style="border:none; border-top:1px solid #3a3a52;" />
            <div style="display:flex; justify-content:space-between; gap:8px; font-size:7px;">
              <span style="color:#8a8aa6;">Health</span>
              <span>${s.player.health}</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:8px; font-size:7px;">
              <span style="color:#8a8aa6;">Morale</span>
              <span>${s.player.morale}</span>
            </div>
          </div>
        `;
      };

      const nw1 = calcNetWorth(s1)
      const nw2 = calcNetWorth(s2)
      let winnerName = ''
      let p1Wins = false
      let p2Wins = false
      if (nw1 > nw2) { winnerName = s1.player.name; p1Wins = true }
      else if (nw2 > nw1) { winnerName = s2.player.name; p2Wins = true }
      else { winnerName = 'TIE' }

      const winLine = winnerName === 'TIE'
        ? `<div style="color:#8a8aa6; font-size:10px; letter-spacing:2px;">IT'S A TIE!</div>`
        : `<div style="color:#F5A623; font-size:10px; letter-spacing:2px; text-shadow:2px 2px 0 #000;">${winnerName} WINS!</div>`;

      this.uiContainer.innerHTML = `
        <div style="text-align:center; font-family:${pf};">
          <h1 style="
            font-family:${pf};
            font-size: clamp(20px, 5vw, 36px);
            color: #F5A623;
            text-shadow: 4px 4px 0 #000, 0 0 20px #F5A62388;
            letter-spacing: 3px;
            line-height: 1.3;
            margin-bottom: 8px;
          ">GAME OVER</h1>
          ${winLine}
          <div style="color:#8a8aa6; font-size:7px; letter-spacing:1px; margin-top:4px;">Highest net worth wins</div>
        </div>

        <div style="display:flex; gap:16px; max-width:560px; width:90%; align-items:flex-start;">
          ${renderPlayerCard(s1, p1Wins)}
          ${renderPlayerCard(s2, p2Wins)}
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

    } else {
      const netWorth = calcNetWorth(state)

      addHighScore({
        playerName: state.player.name,
        difficulty: state.difficulty,
        money: netWorth,
        score: netWorth,
        grade: '',
        winCondition: state.winCondition,
        weeksReached: Math.max(0, state.calendar.week - 1),
        timestamp: Date.now(),
      });

      const titleColor = survived ? '#F5A623' : '#E74C3C'
      const titleText = survived ? "TIME'S UP!" : 'GAME OVER'
      const subtitleText = state.lossReason ?? 'Final net worth is your score.'
      const nwColor = netWorth >= 0 ? '#ffd24a' : '#e74c3c'

      // Last 8 event log entries
      const recentLog = [...state.eventLog].slice(0, 8);
      const logRows = recentLog.length > 0
        ? recentLog.map(entry => `
            <div style="
              color:#9090b0;
              font-size:6px;
              line-height:1.8;
              border-left:2px solid #2a2a4a;
              padding-left:8px;
              word-break:break-word;
            ">&#x25AA; ${entry}</div>
          `).join('')
        : `<div style="color:#4a4a66; font-size:6px; font-style:italic;">No events logged.</div>`;

      const weeksPlayed = Math.max(0, state.calendar.week - 1);

      this.uiContainer.innerHTML = `
        <div style="
          width: 100%;
          max-width: 920px;
          padding: 16px 20px;
          font-family: ${pf};
          box-sizing: border-box;
        ">

          <!-- HEADER ROW -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #14141f;
            border: 3px solid #4a4a66;
            box-shadow: inset -3px -3px 0 #06060c;
            padding: 14px 20px;
            margin-bottom: 12px;
          ">
            <!-- Title -->
            <div style="text-align:center; flex:1; padding: 0 16px;">
              <div style="
                font-size: 22px;
                color: ${titleColor};
                text-shadow: 3px 3px 0 #000, 0 0 12px ${titleColor}66;
                letter-spacing: 2px;
                margin-bottom: 6px;
              ">${titleText}</div>
              <div style="
                font-size: 7px;
                color: #8a8aa6;
                letter-spacing: 1px;
                text-transform: uppercase;
                font-style: italic;
              ">${subtitleText}</div>
            </div>

            <!-- Net Worth -->
            <div style="text-align:right; min-width:110px;">
              <div style="font-size:6px; color:#8a8aa6; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Net Worth</div>
              <div style="font-size:14px; color:${nwColor}; text-shadow:2px 2px 0 #000;">${formatMoney(netWorth)}</div>
            </div>
          </div>

          <!-- MAIN BODY -->
          <div style="display:flex; gap:12px; align-items:flex-start;">

            <!-- LEFT: YOUR STORY -->
            <div style="
              flex: 1.2;
              background: #10101a;
              border: 2px solid #2a2a42;
              padding: 14px;
              min-height: 220px;
            ">
              <div style="
                font-size:6px;
                color:#4a4a66;
                text-transform:uppercase;
                letter-spacing:2px;
                margin-bottom:10px;
              ">Your Story</div>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${logRows}
              </div>
            </div>

            <!-- RIGHT: STATS -->
            <div style="
              flex: 1;
              background: #14141f;
              border: 3px solid #4a4a66;
              box-shadow: inset -3px -3px 0 #06060c;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 10px;
            ">
              <div style="font-size:9px; color:#F5A623; letter-spacing:1px; margin-bottom:2px;">${state.player.name}</div>

              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#8a8aa6; font-size:7px; text-transform:uppercase;">Weeks</span>
                <span style="color:#e8e8f0; font-size:7px;">${weeksPlayed} / ${state.calendar.maxWeeks}</span>
              </div>

              <hr style="border:none; border-top:1px solid #2a2a42; margin:2px 0;" />

              <!-- Money breakdown -->
              ${moneyBreakdown(state)}

              <hr style="border:none; border-top:1px solid #2a2a42; margin:2px 0;" />

              <!-- Health bar -->
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#8a8aa6; font-size:6px; text-transform:uppercase;">Health</span>
                  <span style="color:#e8e8f0; font-size:6px;">${state.player.health}</span>
                </div>
                ${statBar(state.player.health, 100, '#2ECC71')}
              </div>

              <!-- Morale bar -->
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#8a8aa6; font-size:6px; text-transform:uppercase;">Morale</span>
                  <span style="color:#e8e8f0; font-size:6px;">${state.player.morale}</span>
                </div>
                ${statBar(state.player.morale, 100, '#9B59B6')}
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-top:12px;
            gap:12px;
          ">
            <button id="play-again-btn" style="
              padding: 12px 28px;
              background: #F5A623;
              border: 3px solid #ffd24a;
              box-shadow: inset -3px -3px 0 #b87d20;
              color: #14141f;
              font-size: 9px;
              letter-spacing: 2px;
              cursor: pointer;
              font-family: ${pf};
              text-transform: uppercase;
              flex-shrink: 0;
            ">PLAY AGAIN</button>
          </div>
        </div>
      `;
    }

    uiRoot.appendChild(this.uiContainer);

    const btn = document.getElementById('play-again-btn');
    if (btn) {
      btn.addEventListener('click', () => {
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
