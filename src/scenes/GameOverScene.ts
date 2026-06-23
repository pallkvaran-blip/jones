import Phaser from 'phaser'
import { getStore, initStore } from '../state/store'
import { createInitialState } from '../state/initialState'
import { audioSystem } from '../systems/AudioSystem'
import { formatMoney } from '../utils/format'
import { showHighScoresOverlay } from '../ui/HighScoresOverlay'
import { addHighScore, getHighScores, getPlayerRank } from '../data/highScores'
import type { GameState, Player, TransportType } from '../state/types'
import { getHousingTier } from '../data/housing'

// ── Net worth / Grade helpers ─────────────────────────────────────────────────

const VEHICLE_VALUE: Record<TransportType, number> = {
  walking:   0,
  bicycle:   200,
  suv:       1000,
  sportscar: 2500,
}

function assetsValue(player: Player): number {
  const housingValue   = getHousingTier(player.housingId)?.purchaseCost ?? 0
  const vehicleValue   = VEHICLE_VALUE[player.transport] ?? 0
  const electronicsValue = (player.hasComputer  ? 350 : 0)
                         + (player.hasCoffeeMaker ? 200 : 0)
                         + (player.hasTV          ? 250 : 0)
                         + (player.hasTreadmill   ? 150 : 0)
  return housingValue + vehicleValue + electronicsValue
}

function calcNetWorth(state: GameState): number {
  const { player, economy } = state
  const portfolioValue = Object.entries(player.portfolio).reduce(
    (sum, [stock, shares]) => sum + shares * (economy.stockPrices[stock] ?? 0), 0
  )
  return player.money + player.bankBalance + portfolioValue + assetsValue(player) - player.debt
}

/** A thin colored bar that animates from empty to `pct`% when the screen mounts. */
function animFillBar(pct: number, color: string, delayMs = 0): string {
  const p = Math.min(100, Math.max(0, Math.round(pct)))
  return `
    <div style="height:6px; background:#2a2a3e; border:1px solid #3a3a52; overflow:hidden; margin:3px 0 2px;">
      <div class="go-fill" data-pct="${p}" style="width:0; height:100%; background:${color}; transition:width 1100ms cubic-bezier(0.2,0.8,0.2,1) ${delayMs}ms;"></div>
    </div>
  `
}

function getRankTitle(netWorth: number, won: boolean): { title: string; color: string; blurb: string } {
  if (!won) {
    if (netWorth >= 8000)  return { title: 'CUT SHORT', color: '#F5A623', blurb: 'Doing well — until it all caught up with you.' }
    if (netWorth >= 0)     return { title: 'ROUGH RUN', color: '#FF8C00', blurb: 'The city is unforgiving. Run it back.' }
    return { title: 'IN THE RED', color: '#E74C3C', blurb: 'Buried in debt. Next time, watch the basics.' }
  }
  if (netWorth >= 50000) return { title: 'TYCOON',        color: '#FFD700', blurb: 'Absolutely loaded. The city is yours.' }
  if (netWorth >= 20000) return { title: 'MOGUL',         color: '#2ECC71', blurb: 'Seriously wealthy. Hard to argue with that.' }
  if (netWorth >= 8000)  return { title: 'ENTREPRENEUR',  color: '#00BFFF', blurb: 'A solid fortune built from nothing.' }
  if (netWorth >= 2000)  return { title: 'GO-GETTER',     color: '#F5A623', blurb: 'In the black and climbing.' }
  if (netWorth >= 0)     return { title: 'SURVIVOR',      color: '#FF8C00', blurb: 'You made it to the finish — barely.' }
  return { title: 'IN THE RED', color: '#E74C3C', blurb: 'Survived, but the debts outweigh the wins.' }
}

interface Achievement { icon: string; label: string }

function getAchievements(state: GameState): Achievement[] {
  const { player, economy } = state
  const out: Achievement[] = []
  const portfolioValue = Object.entries(player.portfolio).reduce(
    (sum, [stock, shares]) => sum + shares * (economy.stockPrices[stock] ?? 0), 0
  )
  const netWorth = calcNetWorth(state)

  // Housing
  if (player.housingId === 'mansion')       out.push({ icon: '&#x1F3DB;&#xFE0F;', label: 'Mansion Owner' })
  else if (player.housingId === 'house')    out.push({ icon: '&#x1F3E1;', label: 'Homeowner' })
  else if (player.housingId === 'own_apt')  out.push({ icon: '&#x1F3E0;', label: 'Own Place' })

  // Career
  if (player.jobRank >= 4)      out.push({ icon: '&#x1F451;', label: 'Top of the Ladder' })
  else if (player.jobRank >= 1) out.push({ icon: '&#x1F4BC;', label: 'Worker' })

  // Education
  if (player.education >= 20)      out.push({ icon: '&#x1F393;', label: 'Academic' })
  else if (player.education >= 10) out.push({ icon: '&#x1F393;', label: 'Scholar' })
  else if (player.education >= 4)  out.push({ icon: '&#x1F4DA;', label: 'Educated' })

  // Investments
  if (portfolioValue >= 5000)    out.push({ icon: '&#x1F4C8;', label: 'Big Investor' })
  else if (portfolioValue > 0)   out.push({ icon: '&#x1F4C8;', label: 'Investor' })

  // Transport
  if (player.transport === 'sportscar')    out.push({ icon: '&#x1F3CE;&#xFE0F;', label: 'Sports Car' })
  else if (player.transport === 'suv')     out.push({ icon: '&#x1F699;', label: 'Got Wheels' })

  // Pets
  if (player.pets.length >= 2)      out.push({ icon: '&#x1F43E;', label: 'Pet Lover' })
  else if (player.pets.length === 1) out.push({ icon: '&#x1F43E;', label: 'Pet Parent' })

  // Electronics
  const gadgets = [player.hasComputer, player.hasCoffeeMaker, player.hasTV, player.hasTreadmill].filter(Boolean).length
  if (gadgets >= 4)      out.push({ icon: '&#x1F5A5;&#xFE0F;', label: 'Fully Equipped' })

  // Wealth milestones
  if (netWorth >= 50000)      out.push({ icon: '&#x1F48E;', label: 'Big League' })
  else if (netWorth >= 10000) out.push({ icon: '&#x1F4B0;', label: 'Five Figures' })

  // Debt free finisher
  if (player.debt === 0 && state.winCondition === 'won') out.push({ icon: '&#x2705;', label: 'Debt Free' })

  return out
}

function statBar(value: number, max = 100, color = '#4a9eff', delayMs = 0): string {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
  return `
    <div style="flex:1; height:6px; background:#2a2a3e; border:1px solid #3a3a52; overflow:hidden;">
      <div class="go-fill" data-pct="${pct}" style="width:0; height:100%; background:${color}; transition:width 1100ms cubic-bezier(0.2,0.8,0.2,1) ${delayMs}ms;"></div>
    </div>
  `
}

function moneyBreakdown(state: GameState, animated = false): string {
  const { player, economy } = state
  const portfolioValue = Object.entries(player.portfolio).reduce(
    (sum, [stock, shares]) => sum + shares * (economy.stockPrices[stock] ?? 0), 0
  )
  const assets = assetsValue(player)
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

  const netWorth = player.money + player.bankBalance + portfolioValue + assets - player.debt
  const nwColor = netWorth >= 0 ? '#ffd24a' : '#e74c3c'

  // $10k cash on hand fills the bar; $50k net worth (TYCOON) fills the net-worth bar.
  const cashBar = animated ? animFillBar((player.money / 10000) * 100, '#ffd24a', 350) : ''
  const nwBar = animated
    ? animFillBar(netWorth > 0 ? (netWorth / 50000) * 100 : 0, netWorth >= 0 ? '#2ECC71' : '#e74c3c', 650)
    : ''

  return `
    ${row('Cash', player.money, '#ffd24a')}
    ${cashBar}
    ${row('Savings', player.bankBalance, '#ffd24a')}
    ${row('Investments', portfolioValue, '#a0d8a0')}
    ${row('Assets', assets, '#a0d8a0')}
    ${player.debt > 0 ? row('Debt', -player.debt, '#e74c3c') : ''}
    <div style="border-top:1px solid #3a3a52; margin:6px 0;"></div>
    <div style="display:flex; justify-content:space-between; gap:8px; font-size:8px; font-family:${pf};">
      <span style="color:#8a8aa6;">NET WORTH</span>
      <span style="color:${nwColor}; font-weight:bold;">${formatMoney(netWorth)}</span>
    </div>
    ${nwBar}
  `
}

function buildInlineLeaderboard(
  entries: Array<{ playerName: string; score: number }>,
  highlightIdx: number,
  outsideRank: number,
  playerName: string,
  playerScore: number,
  diff: string,
): string {
  const pf = `'Press Start 2P', 'Courier New', monospace`
  const diffLabel = diff === 'short' ? 'SHORT' : diff === 'medium' ? 'MEDIUM' : 'LONG'
  const diffColor = diff === 'short' ? '#E74C3C' : diff === 'medium' ? '#F5A623' : '#2ECC71'

  const renderRow = (name: string, score: number, idx: number, highlight: boolean): string => {
    const medal =
      idx === 0 ? '&#x1F947;'
      : idx === 1 ? '&#x1F948;'
      : idx === 2 ? '&#x1F949;'
      : `<span style="color:#b0b0c8; font-size:5px; font-family:${pf};">${idx + 1}.</span>`
    const bg = highlight ? '#1c1c0e' : 'transparent'
    const nameColor = highlight ? '#F5A623' : '#e8e8f0'
    const border = highlight ? 'border-left:3px solid #F5A623;' : 'border-left:3px solid transparent;'
    return `
      <div style="display:flex; align-items:center; gap:8px; padding:4px 6px; background:${bg}; ${border}">
        <span style="min-width:20px; text-align:center; font-size:9px;">${medal}</span>
        <span style="flex:1; color:${nameColor}; font-size:6px; font-family:${pf}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${name}</span>
        <span style="color:#ffd24a; font-size:6px; font-family:${pf}; white-space:nowrap;">${formatMoney(score)}</span>
      </div>
    `
  }

  // If the player is in top 10 (highlightIdx >= 0) but their current score
  // isn't at that position yet (Supabase race condition), inject a synthetic
  // row so the player always sees their own name highlighted.
  const display = entries.slice(0, 10).map(e => ({ ...e }))
  if (highlightIdx >= 0) {
    const slotEntry = display[highlightIdx]
    const slotMatchesCurrent = slotEntry && slotEntry.playerName === playerName && slotEntry.score === playerScore
    if (!slotMatchesCurrent) {
      display.splice(highlightIdx, 0, { playerName, score: playerScore })
      if (display.length > 10) display.pop()
    }
  }

  const topRows = display.map((e, i) => renderRow(e.playerName, e.score, i, i === highlightIdx)).join('')

  let tail = ''
  if (outsideRank > 0) {
    tail = `
      <div style="color:#3a3a5a; font-size:5px; padding:3px 8px; letter-spacing:2px; font-family:${pf};">• • •</div>
      <div style="display:flex; align-items:center; gap:8px; padding:4px 6px; background:#1c1c0e; border-left:3px solid #F5A623;">
        <span style="min-width:20px; text-align:right; color:#b0b0c8; font-size:5px; font-family:${pf};">${outsideRank}.</span>
        <span style="flex:1; color:#F5A623; font-size:6px; font-family:${pf}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${playerName}</span>
        <span style="color:#ffd24a; font-size:6px; font-family:${pf}; white-space:nowrap;">${formatMoney(playerScore)}</span>
      </div>
    `
  }

  const empty = entries.length === 0
    ? `<div style="color:#4a4a66; font-size:6px; font-family:${pf}; padding:20px 0; text-align:center;">No scores yet.</div>`
    : ''

  return `
    <div style="font-size:5px; color:${diffColor}; letter-spacing:2px; text-transform:uppercase; font-family:${pf}; margin-bottom:8px; padding-bottom:4px; border-bottom:1px solid ${diffColor}44;">
      High Scores — ${diffLabel}
    </div>
    ${empty}
    ${topRows}
    ${tail}
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

    // Hide side panels — they're not relevant on the game-over screen.
    // Phaser does not auto-invoke shutdown(), so wire it to the event to
    // guarantee the slots are restored when we leave this scene.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this)
    const leftSlot = document.getElementById('left-slot')
    const rightSlot = document.getElementById('right-slot')
    if (leftSlot) leftSlot.style.visibility = 'hidden'
    if (rightSlot) rightSlot.style.visibility = 'hidden'

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

        <div style="
          text-align:center;
          margin-top:16px;
          font-size:6px;
          color:#8a8aa6;
          letter-spacing:1px;
          line-height:1.8;
        ">
          <span style="color:#ffd24a;">&#x2605;</span>
          Enjoyed Hustle City? Please consider leaving a rating &mdash; it really helps!
          <span style="color:#ffd24a;">&#x2605;</span>
        </div>
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

      const rank = getRankTitle(netWorth, survived)
      const titleColor = survived ? '#F5A623' : '#E74C3C'
      const titleText = survived ? 'YOU MADE IT!' : 'GAME OVER'
      const subtitleText = state.lossReason ?? rank.blurb
      const nwColor = netWorth >= 0 ? '#ffd24a' : '#e74c3c'
      const achievements = getAchievements(state)

      const achievementBadges = achievements.length > 0
        ? achievements.map(a => `
            <div style="
              display:flex; align-items:center; gap:6px;
              background:#1a1a2e; border:2px solid #3a3a52;
              box-shadow: inset -2px -2px 0 #06060c;
              padding:6px 9px; font-size:7px; color:#e8e8f0;
            ">
              <span style="font-size:11px; line-height:1;">${a.icon}</span>
              <span style="letter-spacing:1px;">${a.label}</span>
            </div>
          `).join('')
        : `<div style="color:#4a4a66; font-size:7px; font-style:italic;">No milestones this run — aim higher next time.</div>`;

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
            border: 3px solid ${rank.color};
            box-shadow: inset -3px -3px 0 #06060c, 0 0 16px ${rank.color}44;
            padding: 14px 20px;
            margin-bottom: 12px;
          ">
            <!-- Rank badge -->
            <div style="text-align:center; min-width:96px;">
              <div style="font-size:5px; color:#8a8aa6; text-transform:uppercase; letter-spacing:2px; margin-bottom:6px;">Final Rank</div>
              <div style="
                font-size: 14px;
                color: ${rank.color};
                text-shadow: 2px 2px 0 #000, 0 0 10px ${rank.color}88;
                letter-spacing: 1px;
                line-height: 1.2;
              ">${rank.title}</div>
            </div>

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
              <div id="go-networth" style="font-size:16px; color:${nwColor}; text-shadow:2px 2px 0 #000;">${formatMoney(0)}</div>
            </div>
          </div>

          <!-- ACHIEVEMENTS -->
          <div style="
            background: #10101a;
            border: 2px solid #2a2a42;
            padding: 12px 14px;
            margin-bottom: 12px;
          ">
            <div style="font-size:6px; color:#4a4a66; text-transform:uppercase; letter-spacing:2px; margin-bottom:10px;">What You Built</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${achievementBadges}
            </div>
          </div>

          <!-- MAIN BODY -->
          <div style="display:flex; gap:12px; align-items:flex-start;">

            <!-- LEFT: LEADERBOARD -->
            <div style="
              flex: 1.2;
              background: #10101a;
              border: 2px solid #2a2a42;
              padding: 14px;
              min-height: 220px;
            ">
              <div id="go-leaderboard" style="display:flex; flex-direction:column; gap:2px;">
                <div style="color:#4a4a66; font-size:6px; font-family:${pf}; text-align:center; padding:20px 0;">Loading scores...</div>
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
              ${animFillBar((weeksPlayed / Math.max(1, state.calendar.maxWeeks)) * 100, '#00BFFF', 100)}

              <hr style="border:none; border-top:1px solid #2a2a42; margin:2px 0;" />

              <!-- Money breakdown -->
              ${moneyBreakdown(state, true)}

              <hr style="border:none; border-top:1px solid #2a2a42; margin:2px 0;" />

              <!-- Health bar -->
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#8a8aa6; font-size:6px; text-transform:uppercase;">Health</span>
                  <span style="color:#e8e8f0; font-size:6px;">${state.player.health}</span>
                </div>
                ${statBar(state.player.health, 100, '#2ECC71', 850)}
              </div>

              <!-- Morale bar -->
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#8a8aa6; font-size:6px; text-transform:uppercase;">Morale</span>
                  <span style="color:#e8e8f0; font-size:6px;">${state.player.morale}</span>
                </div>
                ${statBar(state.player.morale, 100, '#9B59B6', 1000)}
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
            <button id="view-scores-btn" style="
              padding: 12px 28px;
              background: #1a1a2e;
              border: 3px solid #4a4a66;
              box-shadow: inset -3px -3px 0 #06060c;
              color: #8a8aa6;
              font-size: 9px;
              letter-spacing: 2px;
              cursor: pointer;
              font-family: ${pf};
              text-transform: uppercase;
              flex-shrink: 0;
            ">HIGH SCORES</button>
          </div>

          <!-- RATING NUDGE -->
          <div style="
            text-align:center;
            margin-top:14px;
            font-size:6px;
            color:#8a8aa6;
            letter-spacing:1px;
            line-height:1.8;
          ">
            <span style="color:#ffd24a;">&#x2605;</span>
            Enjoyed Hustle City? Please consider leaving a rating &mdash; it really helps!
            <span style="color:#ffd24a;">&#x2605;</span>
          </div>
        </div>
      `;

      // Async leaderboard: load scores for this run's difficulty
      ;(async () => {
        await Promise.resolve() // yield so uiRoot.appendChild runs first
        const lbEl = document.getElementById('go-leaderboard')
        if (!lbEl) return
        const _diff = state.difficulty
        const _name = state.player.name
        const _score = netWorth
        try {
          const scores = await getHighScores()
          const entries = scores[_diff]

          // Rank by score, not by name. Name matching is unreliable: a player
          // who has a previous (better) run in the top 10 would be found there
          // and incorrectly treated as "in top 10" for their current (worse) run.
          const betterCount = entries.filter(e => e.score > _score).length
          const inTop10 = betterCount < 10  // fewer than 10 scored strictly higher

          let highlightIdx = -1
          let outsideRank = -1

          if (inTop10) {
            highlightIdx = betterCount  // 0-indexed position for this score
          } else {
            outsideRank = await getPlayerRank(_diff, _score)
          }

          const el2 = document.getElementById('go-leaderboard')
          if (el2?.isConnected) {
            el2.innerHTML = buildInlineLeaderboard(entries, highlightIdx, outsideRank, _name, _score, _diff)
          }
        } catch {
          const el2 = document.getElementById('go-leaderboard')
          if (el2?.isConnected) {
            el2.innerHTML = `<div style="color:#4a4a66; font-size:6px; text-align:center; padding:20px 0;">Scores unavailable.</div>`
          }
        }
      })()
    }

    uiRoot.appendChild(this.uiContainer);

    // Trigger the accomplishment bars to fill once the layout has painted at width:0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.uiContainer?.querySelectorAll<HTMLElement>('.go-fill').forEach((el) => {
          el.style.width = (el.getAttribute('data-pct') ?? '0') + '%';
        });
      });
    });

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

    const hsBtn = document.getElementById('view-scores-btn');
    if (hsBtn) {
      hsBtn.addEventListener('click', () => showHighScoresOverlay());
      hsBtn.addEventListener('mouseenter', () => {
        (hsBtn as HTMLElement).style.borderColor = '#8a8aa6';
        (hsBtn as HTMLElement).style.color = '#e8e8f0';
      });
      hsBtn.addEventListener('mouseleave', () => {
        (hsBtn as HTMLElement).style.borderColor = '#4a4a66';
        (hsBtn as HTMLElement).style.color = '#8a8aa6';
      });
    }

    // Net worth count-up (single player)
    if (state.numPlayers === 1) {
      const nwEl = document.getElementById('go-networth');
      if (nwEl) this.animateCountUp(nwEl, calcNetWorth(state));
    }

    // Confetti payoff for a win
    if (survived && this.uiContainer) {
      this.launchConfetti(this.uiContainer);
    }
  }

  private animateCountUp(el: HTMLElement, target: number): void {
    const duration = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const value = Math.round(target * eased);
      el.textContent = formatMoney(value);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = formatMoney(target);
    };
    requestAnimationFrame(tick);
  }

  private launchConfetti(container: HTMLElement): void {
    if (!document.getElementById('go-confetti-style')) {
      const style = document.createElement('style');
      style.id = 'go-confetti-style';
      style.textContent = `
        @keyframes go-confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0.9; }
        }
      `;
      document.head.appendChild(style);
    }

    const colors = ['#F5A623', '#FFD700', '#2ECC71', '#00BFFF', '#9B59B6', '#E74C3C', '#ffffff'];
    const layer = document.createElement('div');
    layer.style.cssText = `position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:0;`;

    for (let i = 0; i < 70; i++) {
      const piece = document.createElement('div');
      const size = 5 + Math.floor(Math.random() * 7);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const dur = 2.2 + Math.random() * 2.0;
      const delay = Math.random() * 2.5;
      piece.style.cssText = `
        position:absolute;
        top:-20px;
        left:${left}%;
        width:${size}px;
        height:${size * (Math.random() > 0.5 ? 1 : 1.6)}px;
        background:${color};
        opacity:0;
        animation: go-confetti-fall ${dur}s linear ${delay}s infinite;
      `;
      layer.appendChild(piece);
    }
    // Ensure existing content paints above the confetti layer
    Array.from(container.children).forEach((child) => {
      const el = child as HTMLElement;
      el.style.position = el.style.position || 'relative';
      el.style.zIndex = '1';
    });
    container.insertBefore(layer, container.firstChild);
  }

  shutdown(): void {
    const leftSlot = document.getElementById('left-slot')
    const rightSlot = document.getElementById('right-slot')
    if (leftSlot) leftSlot.style.visibility = ''
    if (rightSlot) rightSlot.style.visibility = ''
    if (this.uiContainer?.parentNode) {
      this.uiContainer.parentNode.removeChild(this.uiContainer);
      this.uiContainer = null;
    }
  }
}
