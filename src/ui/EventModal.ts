import type { LifeEvent } from '../data/lifeEvents'

export type EffectChip = { text: string; good: boolean }

export interface WorkEventShape {
  id: string
  title: string
  description: string
  type: 'choice'
  choices: Array<{ label: string }>
}

export class EventModal {
  private backdrop: HTMLElement | null = null
  private readonly pf = `'Press Start 2P', 'Courier New', monospace`

  show(
    event: LifeEvent | WorkEventShape,
    onChoice: (index: number) => void,
    opts?: { label?: string; chips?: EffectChip[] },
  ): void {
    this.hide()

    const backdrop = document.createElement('div')
    backdrop.id = 'event-modal-backdrop'
    backdrop.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.72);
      z-index: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
      font-family: ${this.pf};
    `

    const choices: Array<{ label: string }> | undefined =
      event.type === 'choice'
        ? (event as { choices?: Array<{ label: string }> }).choices
        : undefined
    const isChoice = !!(choices?.length)

    const label = opts?.label ?? ''
    const chips = opts?.chips ?? []

    const labelHtml = label
      ? `<div style="font-size:6px; letter-spacing:2px; color:#f5a623; background:#1a0e00; border:1px solid #f5a623; display:inline-block; padding:2px 7px; margin-bottom:2px;">&#x26A1; ${label}</div>`
      : ''

    const chipsHtml = this.buildChipsHtml(chips)

    const btnHtml = isChoice
      ? choices!.map((c, i) => `
          <button class="event-choice-btn" data-idx="${i}" style="
            padding: 11px 10px;
            background: #0e1020;
            border: 2px solid #3a3a52;
            color: #e8e8f0;
            font-size: 8px;
            cursor: pointer;
            font-family: ${this.pf};
            text-align: left;
            box-shadow: inset -2px -2px 0 #06060c;
            flex: 1;
          ">${c.label}</button>
        `).join('')
      : `<button class="event-choice-btn" data-idx="0" style="
          padding: 11px 14px;
          background: #f5a623;
          border: 2px solid #ffd24a;
          box-shadow: inset -2px -2px 0 #b87d20;
          color: #14141f;
          font-size: 9px;
          cursor: pointer;
          font-family: ${this.pf};
        ">OK</button>`

    const isRoughNight = 'id' in event && (event.id as string).startsWith('rough_night')
    const titleHtml = isRoughNight
      ? `<div style="color:#e74c3c; font-size:7px; letter-spacing:2px; text-transform:uppercase; margin-bottom:2px;">Rough Night</div>
         <div style="color:#f5a623; font-size:10px; letter-spacing:1px; text-shadow:2px 2px 0 #000;">${event.title}</div>
         <div style="color:#8a8aa6; font-size:6px; letter-spacing:0.5px; line-height:1.6;">You ran out of energy and spent the night outside.</div>`
      : `<div style="color:#f5a623; font-size:10px; letter-spacing:1px; text-shadow:2px 2px 0 #000;">${event.title}</div>`

    backdrop.innerHTML = `
      <div style="
        background: #14141f;
        border: 3px solid ${isRoughNight ? '#7a1a1a' : '#4a4a66'};
        box-shadow: inset -3px -3px 0 #06060c, 8px 8px 0 rgba(0,0,0,0.6);
        padding: 22px 20px 18px;
        max-width: 340px;
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 12px;
      ">
        ${labelHtml}
        ${titleHtml}
        <div style="color: #c8c8e0; font-size: 7px; line-height: 1.8; letter-spacing: 0.5px;">${event.description}</div>
        ${chipsHtml}
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${btnHtml}
        </div>
      </div>
    `

    document.getElementById('ui-root')?.appendChild(backdrop)
    this.backdrop = backdrop

    // Prevent taps on the dark overlay area from leaking to the canvas / Phaser
    backdrop.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault() })
    backdrop.addEventListener('pointerup', (e) => e.stopPropagation())

    backdrop.querySelectorAll<HTMLButtonElement>('.event-choice-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (btn.style.background === 'rgb(245, 166, 35)') return
        btn.style.borderColor = '#f5a623'
        btn.style.background = '#1a1a2e'
      })
      btn.addEventListener('mouseleave', () => {
        if (btn.style.background === 'rgb(245, 166, 35)') return
        btn.style.borderColor = '#3a3a52'
        btn.style.background = '#0e1020'
      })
      // preventDefault on pointerdown stops the browser generating a ghost click
      // after the modal closes, which would otherwise land on the Phaser canvas.
      btn.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault() })
      btn.addEventListener('pointerup', (e) => {
        e.stopPropagation()
        const idx = parseInt(btn.dataset.idx ?? '0', 10)
        if (isChoice) {
          onChoice(idx)
        } else {
          this.hide()
          onChoice(idx)
        }
      })
    })
  }

  showResult(
    title: string,
    logMsg: string,
    chips: EffectChip[],
    onDismiss: () => void,
  ): void {
    if (!this.backdrop) return
    const inner = this.backdrop.querySelector<HTMLElement>(':scope > div')
    if (!inner) return

    inner.innerHTML = `
      <div style="color: #f5a623; font-size: 10px; letter-spacing: 1px; text-shadow: 2px 2px 0 #000;">${title}</div>
      <div style="width:100%; height:1px; background:#2a2a3a;"></div>
      <div style="color: #e8e8f0; font-size: 7px; line-height: 1.8; letter-spacing: 0.5px;">${logMsg}</div>
      ${this.buildChipsHtml(chips)}
      <div style="display:flex; justify-content:flex-end;">
        <button id="result-ok-btn" style="
          padding: 10px 20px;
          background: #f5a623;
          border: 2px solid #ffd24a;
          box-shadow: inset -2px -2px 0 #b87d20;
          color: #14141f;
          font-size: 9px;
          cursor: pointer;
          font-family: ${this.pf};
        ">OK</button>
      </div>
    `

    const okBtn = inner.querySelector<HTMLButtonElement>('#result-ok-btn')
    if (okBtn) {
      okBtn.addEventListener('mouseenter', () => { okBtn.style.background = '#ffb830' })
      okBtn.addEventListener('mouseleave', () => { okBtn.style.background = '#f5a623' })
      okBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault() })
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

  private buildChipsHtml(chips: EffectChip[]): string {
    if (!chips.length) return ''
    const items = chips.map(c => {
      const color = c.good ? '#2ECC71' : '#e74c3c'
      const bg = c.good ? '#0a1a0a' : '#1a0a0a'
      return `<span style="font-size:7px; padding:2px 7px; border:1px solid ${color}; color:${color}; background:${bg};">${c.text}</span>`
    }).join('')
    return `<div style="display:flex; gap:6px; flex-wrap:wrap;">${items}</div>`
  }
}
