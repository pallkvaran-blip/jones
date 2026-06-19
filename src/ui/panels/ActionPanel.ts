import type { ActionDef } from '../../systems/ActionSystem'
import type { GameState } from '../../state/types'
import { getCharacter } from '../../data/characters'
import { getPet } from '../../data/pets'

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

  private buildPortraitDataUrl(sprite: { palette: string[], pixels: number[][] }): string {
    const SCALE = 3;
    const canvas = document.createElement('canvas');
    canvas.width = 16 * SCALE;  // 48
    canvas.height = 20 * SCALE; // 60
    const ctx = canvas.getContext('2d')!;
    for (let r = 0; r < sprite.pixels.length; r++) {
      for (let c = 0; c < sprite.pixels[r].length; c++) {
        const idx = sprite.pixels[r][c];
        if (idx === 0) continue;
        ctx.fillStyle = sprite.palette[idx];
        ctx.fillRect(c * SCALE, r * SCALE, SCALE, SCALE);
      }
    }
    return canvas.toDataURL();
  }

  private buildCharSection(locationId: string, state: GameState): string {
    const char = getCharacter(locationId);
    if (!char) return '';

    const dataUrl = this.buildPortraitDataUrl(char);
    const line = char.lines[Math.floor(Math.random() * char.lines.length)];
    const displayName = locationId === 'home' ? state.player.name : char.name;

    let petRows = '';
    if (locationId === 'home') {
      const playerPets = state.player.pets ?? [];
      for (const petId of playerPets) {
        const pet = getPet(petId);
        if (!pet) continue;
        const petUrl = this.buildPortraitDataUrl(pet);
        const petLine = pet.sounds[Math.floor(Math.random() * pet.sounds.length)];
        petRows += `
          <div class="pet-row">
            <div class="char-header">
              <img class="char-portrait" src="${petUrl}" width="48" height="60" alt="${pet.name}">
              <span class="char-name">${pet.name}</span>
            </div>
            <div class="char-speech pet-speech">${petLine}</div>
          </div>
        `;
      }
    }

    return `
      <div class="char-section">
        <div class="char-header">
          <img class="char-portrait" src="${dataUrl}" width="48" height="60" alt="${displayName}">
          <span class="char-name">${displayName}</span>
        </div>
        <div class="char-speech">${line}</div>
        ${petRows}
      </div>
    `;
  }

  show(
    locationId: string,
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

    const charSection = this.buildCharSection(locationId, state);

    this.el.innerHTML = `
      <div class="action-header">
        <span class="action-location">${locationName}</span>
        <span class="action-hint">ACTIONS</span>
      </div>
      ${charSection}
      <div class="action-list">
        ${btns}
      </div>
    `;

    // Use pointerdown to capture start position, pointerup to fire — this lets the
    // browser recognise a vertical scroll gesture before we commit to a tap action.
    this.el.querySelectorAll<HTMLButtonElement>('.action-btn').forEach((btn) => {
      let startY = 0;
      let dragged = false;

      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        startY = e.clientY;
        dragged = false;
      });

      btn.addEventListener('pointermove', (e) => {
        if (Math.abs(e.clientY - startY) > 8) dragged = true;
      });

      btn.addEventListener('pointerup', (e) => {
        e.stopPropagation();
        if (dragged) return;
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
