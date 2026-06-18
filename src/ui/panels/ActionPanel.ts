import type { ActionDef } from '../../systems/ActionSystem'
import type { GameState } from '../../state/types'

export class ActionPanel {
  private el: HTMLElement;
  private onAction: ((id: string) => void) | null = null;
  private onUnavailable: ((msg: string) => void) | null = null;

  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'action-panel';
  }

  getElement(): HTMLElement {
    return this.el;
  }

  show(
    locationName: string,
    actions: ActionDef[],
    state: GameState,
    onAction: (id: string) => void,
    onUnavailable?: (msg: string) => void,
  ): void {
    this.onAction = onAction;
    this.onUnavailable = onUnavailable ?? null;
    this.el.classList.add('is-open');

    const btns = actions.map((action) => {
      const avail = action.available(state);
      const detail = avail ? action.detail : action.unavailableReason(state);
      const disabledClass = avail ? '' : ' disabled';
      return `
        <button class="action-btn${disabledClass}" data-action-id="${action.id}" ${avail ? '' : 'aria-disabled="true"'}>
          <span class="action-label">${action.label}</span>
          <span class="action-detail">${detail}</span>
        </button>
      `;
    }).join('');

    this.el.innerHTML = `
      <div class="action-header">
        <span class="action-location">${locationName}</span>
        <span class="action-hint">ACTIONS</span>
      </div>
      <div class="action-list">
        ${btns}
      </div>
    `;

    // Wire click listeners
    this.el.querySelectorAll<HTMLButtonElement>('.action-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('disabled')) {
          const reason = btn.querySelector('.action-detail')?.textContent ?? '';
          if (reason && this.onUnavailable) this.onUnavailable(reason);
          return;
        }
        const id = btn.dataset.actionId;
        if (id && this.onAction) this.onAction(id);
      });
    });
  }

  update(actions: ActionDef[], state: GameState): void {
    const btns = this.el.querySelectorAll<HTMLButtonElement>('.action-btn');
    btns.forEach((btn) => {
      const id = btn.dataset.actionId;
      if (!id) return;
      const action = actions.find((a) => a.id === id);
      if (!action) return;

      const avail = action.available(state);
      const detail = avail ? action.detail : action.unavailableReason(state);

      if (avail) {
        btn.classList.remove('disabled');
        btn.removeAttribute('aria-disabled');
      } else {
        btn.classList.add('disabled');
        btn.setAttribute('aria-disabled', 'true');
      }

      const detailEl = btn.querySelector<HTMLElement>('.action-detail');
      if (detailEl) detailEl.textContent = detail;
    });
  }

  hide(): void {
    this.el.innerHTML = '';
    this.el.classList.remove('is-open');
    this.onAction = null;
  }
}
