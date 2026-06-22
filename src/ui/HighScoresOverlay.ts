import { getHighScores } from '../data/highScores'
import { formatMoney } from '../utils/format'
import type { Difficulty } from '../state/types'
import type { HighScoreEntry } from '../data/highScores'

const pf = `'Press Start 2P', 'Courier New', monospace`

const DIFF_LABELS: Record<Difficulty, string> = {
  short:  'SHORT (4 WKS)',
  medium: 'MEDIUM (8 WKS)',
  long:   'LONG (12 WKS)',
}
const DIFF_COLORS: Record<Difficulty, string> = {
  short:  '#E74C3C',
  medium: '#F5A623',
  long:   '#2ECC71',
}

function buildTable(diff: Difficulty, entries: HighScoreEntry[]): string {
  const color = DIFF_COLORS[diff]
  const rows = entries.length > 0
    ? entries.map((e, i) => {
        const medal = i === 0 ? '&#x1F947;'
                    : i === 1 ? '&#x1F948;'
                    : i === 2 ? '&#x1F949;'
                    : `<span style="color:#b0b0c8">${i + 1}.</span>`
        return `
          <div style="display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid #1a1a2e; font-size:7px;">
            <span style="min-width:20px; text-align:center;">${medal}</span>
            <span style="flex:1; color:#e8e8f0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${e.playerName}</span>
            <span style="color:#ffd24a; min-width:70px; text-align:right;">${formatMoney(e.money)}</span>
          </div>
        `
      }).join('')
    : `<div style="color:#4a4a66; font-size:7px; padding:10px 0; text-align:center;">No scores yet.</div>`

  return `
    <div style="flex:1; min-width:200px;">
      <div style="font-size:7px; color:${color}; letter-spacing:1px; margin-bottom:8px; padding-bottom:4px; border-bottom:2px solid ${color};">${DIFF_LABELS[diff]}</div>
      ${rows}
    </div>
  `
}

export function showHighScoresOverlay(): void {
  const uiRoot = document.getElementById('ui-root')
  if (!uiRoot) return

  // Don't stack duplicates
  if (document.getElementById('hs-overlay')) return

  const overlay = document.createElement('div')
  overlay.id = 'hs-overlay'
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.88);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${pf};
  `

  const tablesId = 'hs-tables'
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
      <div style="font-size:6px; color:#4a4a66; letter-spacing:1px;">RANKED BY NET WORTH (CASH + BANK + ASSETS − DEBT)</div>
      <div id="${tablesId}" style="display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start;">
        <div style="color:#4a4a66; font-size:8px; width:100%; text-align:center; padding:20px 0;">Loading...</div>
      </div>
    </div>
  `

  uiRoot.appendChild(overlay)

  getHighScores().then((scores) => {
    const tablesEl = document.getElementById(tablesId)
    if (tablesEl && overlay.parentNode) {
      tablesEl.innerHTML =
        buildTable('short',  scores.short)  +
        buildTable('medium', scores.medium) +
        buildTable('long',   scores.long)
    }
  }).catch(() => {
    const tablesEl = document.getElementById(tablesId)
    if (tablesEl && overlay.parentNode) {
      tablesEl.innerHTML = `<div style="color:#e74c3c; font-size:7px; width:100%; text-align:center; padding:20px 0;">Failed to load scores.</div>`
    }
  })

  const closeBtn = document.getElementById('hs-close-btn')
  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.parentNode?.removeChild(overlay))
    closeBtn.addEventListener('mouseenter', () => {
      (closeBtn as HTMLElement).style.borderColor = '#8a8aa6'
      ;(closeBtn as HTMLElement).style.color = '#e8e8f0'
    })
    closeBtn.addEventListener('mouseleave', () => {
      (closeBtn as HTMLElement).style.borderColor = '#4a4a66'
      ;(closeBtn as HTMLElement).style.color = '#8a8aa6'
    })
  }

  overlay.addEventListener('pointerdown', (e) => {
    if (e.target === overlay) overlay.parentNode?.removeChild(overlay)
  })
}
