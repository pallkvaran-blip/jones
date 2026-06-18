import type { LifeEvent } from '../data/lifeEvents'

export interface WorkEventShape {
  id: string
  title: string
  description: string
  type: 'choice'
  choices: Array<{ label: string }>
}

export class EventModal {
  private backdrop: HTMLElement | null = null

  show(event: LifeEvent | WorkEventShape, onChoice: (index: number) => void): void {
    this.hide()

    const pf = `'Press Start 2P', 'Courier New', monospace`

    const backdrop = document.createElement('div')
    backdrop.id = 'event-modal-backdrop'
    backdrop.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.72);
      z-index: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
      font-family: ${pf};
    `

    const isChoice = event.type === 'choice' && event.choices

    const btnHtml = isChoice
      ? event.choices!.map((c, i) => `
          <button class="event-choice-btn" data-idx="${i}" style="
            padding: 11px 10px;
            background: #0e1020;
            border: 2px solid #3a3a52;
            color: #e8e8f0;
            font-size: 8px;
            cursor: pointer;
            font-family: ${pf};
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
          font-family: ${pf};
        ">OK</button>`

    backdrop.innerHTML = `
      <div style="
        background: #14141f;
        border: 3px solid #4a4a66;
        box-shadow: inset -3px -3px 0 #06060c, 8px 8px 0 rgba(0,0,0,0.6);
        padding: 22px 20px 18px;
        max-width: 340px;
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 14px;
      ">
        <div style="color: #f5a623; font-size: 10px; letter-spacing: 1px; text-shadow: 2px 2px 0 #000;">${event.title}</div>
        <div style="color: #c8c8e0; font-size: 7px; line-height: 1.8; letter-spacing: 0.5px;">${event.description}</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${btnHtml}
        </div>
      </div>
    `

    document.getElementById('ui-root')?.appendChild(backdrop)
    this.backdrop = backdrop

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
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx ?? '0', 10)
        this.hide()
        onChoice(idx)
      })
    })
  }

  hide(): void {
    if (this.backdrop?.parentNode) {
      this.backdrop.parentNode.removeChild(this.backdrop)
    }
    this.backdrop = null
  }
}
