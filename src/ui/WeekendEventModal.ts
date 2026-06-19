import type { Player } from '../state/types'
import type { WeekendEvent, WeekendOption, WeekendEffects } from '../data/weekendEvents'
import type { EffectChip } from './EventModal'

export class WeekendEventModal {
  private backdrop: HTMLElement | null = null
  private readonly pf = `'Press Start 2P', 'Courier New', monospace`

  show(event: WeekendEvent, player: Player, onChoice: (option: WeekendOption) => void): void {
    this.hide()

    const backdrop = document.createElement('div')
    backdrop.id = 'weekend-modal-backdrop'
    backdrop.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.80);
      z-index: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
      font-family: ${this.pf};
    `

    const optionsHtml = event.options.map((opt, i) => {
      const available = opt.available ? opt.available(player) : true
      const hintHtml = this.buildEffectHints(opt.effects, player, available)
      const disabledStyle = available ? '' : 'opacity: 0.4; cursor: not-allowed;'
      return `
        <button class="weekend-opt-btn" data-idx="${i}" ${available ? '' : 'disabled'} style="
          padding: 10px 12px;
          background: #0e1020;
          border: 2px solid #2a6444;
          color: #e8e8f0;
          font-size: 7px;
          cursor: pointer;
          font-family: ${this.pf};
          text-align: left;
          box-shadow: inset -2px -2px 0 #06060c;
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
          min-width: 130px;
          ${disabledStyle}
        ">
          <span style="font-size: 8px; color: #5de5a0;">${opt.label}</span>
          <span style="font-size: 6px; color: #a0a0b8; line-height: 1.6;">${opt.description}</span>
          ${hintHtml}
        </button>
      `
    }).join('')

    backdrop.innerHTML = `
      <div style="
        background: #14141f;
        border: 3px solid #2a6444;
        box-shadow: inset -3px -3px 0 #06060c, 8px 8px 0 rgba(0,0,0,0.6);
        padding: 22px 20px 18px;
        max-width: 420px;
        width: 92%;
        display: flex;
        flex-direction: column;
        gap: 12px;
      ">
        <div style="font-size:6px; letter-spacing:2px; color:#5de5a0; background:#0a1a0f; border:1px solid #2a6444; display:inline-block; padding:2px 7px; margin-bottom:2px;">&#x1F3D6; WEEKEND</div>
        <div style="color: #5de5a0; font-size: 10px; letter-spacing: 1px; text-shadow: 2px 2px 0 #000;">${event.title}</div>
        <div style="color: #c8c8e0; font-size: 7px; line-height: 1.8; letter-spacing: 0.5px;">${event.description}</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${optionsHtml}
        </div>
      </div>
    `

    document.getElementById('ui-root')?.appendChild(backdrop)
    this.backdrop = backdrop

    // Prevent taps on the dark overlay area from leaking to the canvas / Phaser
    backdrop.addEventListener('pointerdown', (e) => e.stopPropagation())
    backdrop.addEventListener('pointerup', (e) => e.stopPropagation())

    backdrop.querySelectorAll<HTMLButtonElement>('.weekend-opt-btn').forEach(btn => {
      if (btn.disabled) return
      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = '#5de5a0'
        btn.style.background = '#0d1e18'
      })
      btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = '#2a6444'
        btn.style.background = '#0e1020'
      })
      btn.addEventListener('pointerdown', (e) => e.stopPropagation())
      btn.addEventListener('pointerup', (e) => {
        e.stopPropagation()
        const idx = parseInt(btn.dataset.idx ?? '0', 10)
        const option = event.options[idx]
        if (option) onChoice(option)
      })
    })
  }

  showResult(title: string, chips: EffectChip[], onDismiss: () => void): void {
    if (!this.backdrop) return
    const inner = this.backdrop.querySelector<HTMLElement>(':scope > div')
    if (!inner) return

    const chipsHtml = this.buildChipsHtml(chips)
    inner.innerHTML = `
      <div style="font-size:6px; letter-spacing:2px; color:#5de5a0; background:#0a1a0f; border:1px solid #2a6444; display:inline-block; padding:2px 7px;">&#x1F3D6; WEEKEND</div>
      <div style="color: #5de5a0; font-size: 10px; letter-spacing: 1px; text-shadow: 2px 2px 0 #000;">${title}</div>
      <div style="width:100%; height:1px; background:#1a2a20;"></div>
      ${chipsHtml}
      <div style="display:flex; justify-content:flex-end; margin-top:4px;">
        <button id="weekend-ok-btn" style="
          padding: 10px 20px;
          background: #2a6444;
          border: 2px solid #5de5a0;
          box-shadow: inset -2px -2px 0 #143322;
          color: #e8f8f0;
          font-size: 9px;
          cursor: pointer;
          font-family: ${this.pf};
        ">START WEEK</button>
      </div>
    `

    const okBtn = inner.querySelector<HTMLButtonElement>('#weekend-ok-btn')
    if (okBtn) {
      okBtn.addEventListener('mouseenter', () => { okBtn.style.background = '#3a8058' })
      okBtn.addEventListener('mouseleave', () => { okBtn.style.background = '#2a6444' })
      okBtn.addEventListener('pointerdown', (e) => e.stopPropagation())
      okBtn.addEventListener('pointerup', (e) => {
        e.stopPropagation()
        this.hide()
        onDismiss()
      })
    }
  }

  hide(): void {
    if (this.backdrop?.parentNode) {
      this.backdrop.parentNode.removeChild(this.backdrop)
    }
    this.backdrop = null
  }

  private buildEffectHints(effects: WeekendEffects, player: Player, available: boolean): string {
    if (!available) {
      const cost = effects.money != null && effects.money < 0 ? Math.abs(effects.money) : 0
      if (cost > 0 && player.money < cost) {
        return `<span style="font-size:6px; color:#e74c3c; margin-top:2px;">Need $${cost}</span>`
      }
      return ''
    }
    const parts: string[] = []
    if (effects.money != null) {
      parts.push(`<span style="color:${effects.money >= 0 ? '#2ECC71' : '#e74c3c'}">${effects.money >= 0 ? '+$' : '-$'}${Math.abs(effects.money)}</span>`)
    }
    if (effects.hunger != null && effects.hunger !== 0) {
      parts.push(`<span style="color:${effects.hunger > 0 ? '#2ECC71' : '#e74c3c'}">${effects.hunger > 0 ? '+' : ''}${effects.hunger} food</span>`)
    }
    if (effects.energy != null && effects.energy !== 0) {
      parts.push(`<span style="color:${effects.energy > 0 ? '#2ECC71' : '#e74c3c'}">${effects.energy > 0 ? '+' : ''}${effects.energy} energy</span>`)
    }
    if (effects.morale != null && effects.morale !== 0) {
      parts.push(`<span style="color:${effects.morale > 0 ? '#2ECC71' : '#e74c3c'}">${effects.morale > 0 ? '+' : ''}${effects.morale} morale</span>`)
    }
    if (effects.health != null && effects.health !== 0) {
      parts.push(`<span style="color:${effects.health > 0 ? '#2ECC71' : '#e74c3c'}">${effects.health > 0 ? '+' : ''}${effects.health} health</span>`)
    }
    if (!parts.length) return ''
    return `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:3px; font-size:6px;">${parts.join('')}</div>`
  }

  private buildChipsHtml(chips: EffectChip[]): string {
    if (!chips.length) return '<div style="color:#a0a0b8; font-size:7px;">A weekend well spent.</div>'
    const items = chips.map(c => {
      const color = c.good ? '#2ECC71' : '#e74c3c'
      const bg = c.good ? '#0a1a0a' : '#1a0a0a'
      return `<span style="font-size:7px; padding:2px 7px; border:1px solid ${color}; color:${color}; background:${bg};">${c.text}</span>`
    }).join('')
    return `<div style="display:flex; gap:6px; flex-wrap:wrap;">${items}</div>`
  }
}
