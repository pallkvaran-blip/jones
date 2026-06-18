export class TurnHandoffOverlay {
  private el: HTMLElement | null = null

  show(
    finishedPlayerName: string,
    nextPlayerName: string,
    week: number,
    onReady: () => void,
  ): void {
    this.hide()
    const pf = `'Press Start 2P', 'Courier New', monospace`
    const el = document.createElement('div')
    el.style.cssText = `
      position: fixed; inset: 0;
      background: #0d0d17;
      z-index: 400;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      font-family: ${pf};
      pointer-events: all;
    `
    el.innerHTML = `
      <div style="color:#8a8aa6; font-size:7px; letter-spacing:2px;">WEEK ${week} COMPLETE</div>
      <div style="color:#f5a623; font-size:14px; letter-spacing:2px; text-shadow:2px 2px 0 #000;">${finishedPlayerName}</div>
      <div style="color:#e8e8f0; font-size:7px; letter-spacing:1px; text-align:center; line-height:2;">
        Hand the device to<br>
        <span style="color:#f5a623;">${nextPlayerName}</span>
      </div>
      <button id="handoff-ready-btn" style="
        margin-top: 12px;
        padding: 14px 28px;
        background: #f5a623;
        border: 3px solid #ffd24a;
        box-shadow: inset -3px -3px 0 #b87d20;
        color: #14141f;
        font-size: 10px;
        letter-spacing: 2px;
        cursor: pointer;
        font-family: ${pf};
      ">READY</button>
    `
    document.getElementById('ui-root')?.appendChild(el)
    this.el = el
    document.getElementById('handoff-ready-btn')?.addEventListener('click', () => {
      this.hide()
      onReady()
    })
  }

  hide(): void {
    if (this.el?.parentNode) this.el.parentNode.removeChild(this.el)
    this.el = null
  }
}
