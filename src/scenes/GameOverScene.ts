import Phaser from 'phaser'
import { getStore, initStore } from '../state/store'
import { createInitialState } from '../state/initialState'
import { audioSystem } from '../systems/AudioSystem'
import { formatMoney } from '../utils/format'
import { addHighScore } from '../data/highScores'
import type { GameState, Player, Calendar } from '../state/types'

// ── Score / Grade helpers ─────────────────────────────────────────────────────

function calculateScore(
  player: Player,
  _calendar: Calendar,
  goalsMet: Record<string, boolean>
): number {
  let score = 0
  // Wealth: max 200pts (target is ~50k)
  score += Math.min(200, Math.floor((player.money + player.bankBalance) / 250))
  // Education: max 100pts
  score += Math.min(100, player.education)
  // Career: max 100pts
  score += player.jobRank * 25
  // Morale: max 100pts
  score += Math.min(100, player.morale)
  // Health: max 100pts
  score += Math.min(100, player.health)
  // Goals met: 150pts each, max 600pts
  score += Object.values(goalsMet).filter(Boolean).length * 150
  // Survived to end (not health death)
  if (player.health > 0) score += 100
  return score
}

function getGrade(score: number, _won: boolean, lossReason: string | null): string {
  if (lossReason?.includes('starved') || lossReason?.includes('health failed')) return 'F'
  if (score >= 800) return 'S'
  if (score >= 600) return 'A'
  if (score >= 400) return 'B'
  if (score >= 250) return 'C'
  if (score >= 100) return 'D'
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
    case 'S': return 'Absolutely crushing it.'
    case 'A': return 'Living your best life.'
    case 'B': return 'Solid run.'
    case 'C': return 'You survived. Barely.'
    case 'D': return 'Could be worse.'
    default:  return 'This is the bottom.'
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

// ── Scene ─────────────────────────────────────────────────────────────────────

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

    const isWin = state.winCondition === 'won';

    // Play result SFX after brief delay
    setTimeout(() => {
      audioSystem.playSFX(isWin ? 'gameWin' : 'gameLose');
    }, 300);

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
      pointer-events: auto;
      z-index: 200;
      overflow-y: auto;
    `;

    const pf = `'Press Start 2P', 'Courier New', monospace`;

    if (state.numPlayers === 2) {
      // 2-player results screen
      const bothStates = store.getBothStates();
      const s1 = bothStates[0]!;
      const s2 = bothStates[1]!;

      for (const s of [s1, s2]) {
        const sScore = calculateScore(s.player, s.calendar, s.goalsMet as Record<string, boolean>);
        addHighScore({
          playerName: s.player.name,
          difficulty: s.difficulty,
          money: s.player.money + s.player.bankBalance,
          score: sScore,
          grade: getGrade(sScore, s.winCondition === 'won', s.lossReason),
          winCondition: s.winCondition,
          weeksReached: Math.max(0, s.calendar.week - 1),
          timestamp: Date.now(),
        });
      }

      const renderPlayerCard = (s: GameState, highlight: boolean): string => {
        const cardIsWin = s.winCondition === 'won';
        const outcomeColor = cardIsWin ? '#2ECC71' : '#E74C3C';
        const outcomeText = cardIsWin ? 'WON' : 'LOST';
        const borderColor = highlight ? '#F5A623' : '#4a4a66';
        const nameColor = highlight ? '#F5A623' : '#8a8aa6';

        const cardGoalKeys: Array<keyof typeof s.goalsMet> = ['targetWealth', 'targetEducation', 'targetCareerRank', 'targetHappiness'];
        const cardGoalNames = ['Wealth', 'Edu', 'Career', 'Happy'];
        const cardGoalsRows = cardGoalKeys.map((key, i) => {
          const met = s.goalsMet[key];
          const icon = met ? '&#x2713;' : '&#x2717;';
          const color = met ? '#2ECC71' : '#E74C3C';
          return `
            <div style="display:flex; justify-content:space-between; gap:8px; color:#e8e8f0; font-size:7px;">
              <span style="color:#8a8aa6;">${cardGoalNames[i]}</span>
              <span style="color:${color};">${icon}</span>
            </div>
          `;
        }).join('');

        const metCount = cardGoalKeys.filter(k => s.goalsMet[k]).length;
        const cardScore = calculateScore(s.player, s.calendar, s.goalsMet as Record<string, boolean>);
        const cardGrade = getGrade(cardScore, cardIsWin, s.lossReason);
        const cardGradeColor = gradeColor(cardGrade);

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
              <div style="font-size:20px; color:${cardGradeColor}; text-shadow:2px 2px 0 #000;">${cardGrade}</div>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <div style="color:${outcomeColor}; font-size:8px; letter-spacing:1px;">${outcomeText}</div>
              <div style="font-size:7px; color:#F5A623;">${cardScore.toLocaleString()} pts</div>
            </div>
            <hr style="border:none; border-top:1px solid #3a3a52;" />
            <div style="display:flex; justify-content:space-between; gap:8px; font-size:7px;">
              <span style="color:#8a8aa6;">Cash</span>
              <span style="color:#ffd24a;">${formatMoney(s.player.money)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:8px; font-size:7px;">
              <span style="color:#8a8aa6;">Edu</span>
              <span>${s.player.education}</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:8px; font-size:7px;">
              <span style="color:#8a8aa6;">Rank</span>
              <span>${s.player.jobRank}</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:8px; font-size:7px;">
              <span style="color:#8a8aa6;">Morale</span>
              <span>${s.player.morale}</span>
            </div>
            <hr style="border:none; border-top:1px solid #3a3a52;" />
            <div style="color:#8a8aa6; font-size:6px; margin-bottom:2px;">GOALS (${metCount}/4)</div>
            ${cardGoalsRows}
          </div>
        `;
      };

      // Determine winner
      const s1Goals = (['targetWealth', 'targetEducation', 'targetCareerRank', 'targetHappiness'] as const).filter(k => s1.goalsMet[k]).length;
      const s2Goals = (['targetWealth', 'targetEducation', 'targetCareerRank', 'targetHappiness'] as const).filter(k => s2.goalsMet[k]).length;

      let winnerName = '';
      let p1Wins = false;
      let p2Wins = false;
      if (s1Goals > s2Goals) {
        winnerName = s1.player.name;
        p1Wins = true;
      } else if (s2Goals > s1Goals) {
        winnerName = s2.player.name;
        p2Wins = true;
      } else if (s1.player.money > s2.player.money) {
        winnerName = s1.player.name;
        p1Wins = true;
      } else if (s2.player.money > s1.player.money) {
        winnerName = s2.player.name;
        p2Wins = true;
      } else {
        winnerName = 'TIE';
      }

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
      // 1-player results screen — rich layout with score, grade, story recap
      const score = calculateScore(state.player, state.calendar, state.goalsMet as Record<string, boolean>);
      const grade = getGrade(score, isWin, state.lossReason);
      const gColor = gradeColor(grade);

      addHighScore({
        playerName: state.player.name,
        difficulty: state.difficulty,
        money: state.player.money + state.player.bankBalance,
        score,
        grade,
        winCondition: state.winCondition,
        weeksReached: Math.max(0, state.calendar.week - 1),
        timestamp: Date.now(),
      });
      const tagline = gradeTagline(grade);

      const titleColor = isWin ? '#2ECC71' : '#E74C3C';
      const titleText = isWin ? 'YOU WIN!' : 'GAME OVER';
      const subtitleText = state.lossReason ?? (isWin ? 'All goals achieved!' : "Time's up!");

      const goalNames = ['Wealth', 'Education', 'Career', 'Happiness'];
      const goalKeys: Array<keyof typeof state.goalsMet> = [
        'targetWealth', 'targetEducation', 'targetCareerRank', 'targetHappiness',
      ];

      const goalsRows = goalKeys.map((key, i) => {
        const met = state.goalsMet[key];
        const icon = met ? '&#x2713;' : '&#x2717;';
        const color = met ? '#2ECC71' : '#E74C3C';
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
            <span style="color:#8a8aa6; font-size:7px; text-transform:uppercase; flex:1;">${goalNames[i]}</span>
            <span style="color:${color}; font-size:10px;">${icon}</span>
          </div>
        `;
      }).join('');

      // Last 8 event log entries (newest first)
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
            <!-- Grade -->
            <div style="
              font-size: 48px;
              color: ${gColor};
              text-shadow: 3px 3px 0 #000, 0 0 16px ${gColor}88;
              line-height: 1;
              min-width: 60px;
              text-align: center;
            ">${grade}</div>

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

            <!-- Score -->
            <div style="text-align:right; min-width:100px;">
              <div style="font-size:7px; color:#8a8aa6; text-transform:uppercase; margin-bottom:4px;">Score</div>
              <div style="font-size:14px; color:#F5A623; text-shadow:2px 2px 0 #000;">${score.toLocaleString()}</div>
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
              <!-- Player name -->
              <div style="font-size:9px; color:#F5A623; letter-spacing:1px; margin-bottom:2px;">${state.player.name}</div>

              <!-- Weeks -->
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#8a8aa6; font-size:7px; text-transform:uppercase;">Weeks</span>
                <span style="color:#e8e8f0; font-size:7px;">${weeksPlayed} / ${state.calendar.maxWeeks}</span>
              </div>

              <!-- Money -->
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#8a8aa6; font-size:7px; text-transform:uppercase;">Cash</span>
                <span style="color:#ffd24a; font-size:7px;">${formatMoney(state.player.money)}</span>
              </div>

              <!-- Health bar -->
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#8a8aa6; font-size:6px; text-transform:uppercase;">Health</span>
                  <span style="color:#e8e8f0; font-size:6px;">${state.player.health}</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  ${statBar(state.player.health, 100, '#2ECC71')}
                </div>
              </div>

              <!-- Morale bar -->
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#8a8aa6; font-size:6px; text-transform:uppercase;">Morale</span>
                  <span style="color:#e8e8f0; font-size:6px;">${state.player.morale}</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  ${statBar(state.player.morale, 100, '#9B59B6')}
                </div>
              </div>

              <!-- Education bar -->
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#8a8aa6; font-size:6px; text-transform:uppercase;">Education</span>
                  <span style="color:#e8e8f0; font-size:6px;">${state.player.education}</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  ${statBar(state.player.education, 100, '#3498DB')}
                </div>
              </div>

              <hr style="border:none; border-top:1px solid #2a2a42; margin:2px 0;" />

              <!-- Goals -->
              <div style="font-size:6px; color:#4a4a66; text-transform:uppercase; letter-spacing:1px;">Goals</div>
              ${goalsRows}

              <!-- Win condition / loss reason -->
              <div style="
                font-size:6px;
                color:#6a6a88;
                font-style:italic;
                line-height:1.6;
                margin-top:2px;
              ">${subtitleText}</div>
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
            <div style="font-size:7px; color:#6a6a88; font-style:italic;">${tagline}</div>
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
