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

  private portraitImg(sprite: { palette: string[], pixels: number[][], portrait?: string }, alt: string, portraitOverride?: string): string {
    const src = portraitOverride ?? sprite.portrait;
    if (src) {
      const url = import.meta.env.BASE_URL + src;
      return `<img class="char-portrait char-portrait--photo" src="${url}" width="80" height="80" alt="${alt}">`;
    }
    const dataUrl = this.buildPortraitDataUrl(sprite);
    return `<img class="char-portrait" src="${dataUrl}" width="48" height="60" alt="${alt}">`;
  }

  private buildElectronicsSection(state: GameState): string {
    const items = [
      { owned: state.player.hasComputer,    icon: '💻', name: 'Computer',     passive: '+$50/day income' },
      { owned: state.player.hasCoffeeMaker, icon: '☕', name: 'Coffee Maker', passive: '+10 energy/morning' },
      { owned: state.player.hasTV,          icon: '📺', name: 'Smart TV',     passive: '+8 morale/week' },
      { owned: state.player.hasTreadmill,   icon: '🏃', name: 'Treadmill',    passive: '+10 max energy' },
    ].filter(i => i.owned);

    if (items.length === 0) return '';

    const rows = items.map(item => `
      <div class="electronics-row">
        <span class="electronics-icon">${item.icon}</span>
        <div class="electronics-info">
          <span class="electronics-name">${item.name}</span>
          <span class="electronics-passive">${item.passive}</span>
        </div>
      </div>
    `).join('');

    return `<div class="electronics-section">${rows}</div>`;
  }

  private buildCharSection(locationId: string, state: GameState): string {
    const char = getCharacter(locationId);
    if (!char) return '';

    const line = char.lines[Math.floor(Math.random() * char.lines.length)];
    const displayName = locationId === 'home' ? state.player.name : char.name;
    const playerPortrait = locationId === 'home' ? `assets/portraits/${state.player.characterId}.png` : undefined;

    let petRows = '';
    let electronicsSection = '';
    if (locationId === 'home') {
      const playerPets = state.player.pets ?? [];
      for (const petId of playerPets) {
        const pet = getPet(petId);
        if (!pet) continue;
        const petLine = pet.sounds[Math.floor(Math.random() * pet.sounds.length)];
        petRows += `
          <div class="pet-row">
            <div class="char-header">
              ${this.portraitImg(pet, pet.name)}
              <span class="char-name">${pet.name}</span>
            </div>
            <div class="char-speech pet-speech">${petLine}</div>
          </div>
        `;
      }
      electronicsSection = this.buildElectronicsSection(state);
    }

    return `
      <div class="char-section">
        <div class="char-header">
          ${this.portraitImg(char, displayName, playerPortrait)}
          <span class="char-name">${displayName}</span>
        </div>
        <div class="char-speech">${line}</div>
        ${petRows}
        ${electronicsSection}
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
      const willDeplete = avail && (action.energyCost ?? 0) > 0 && state.player.energy <= (action.energyCost ?? 0);
      const disabledClass = avail ? '' : ' disabled';
      const warnClass = willDeplete ? ' warn' : '';
      const reason = avail ? '' : action.unavailableReason(state);
      return `
        <button class="action-btn${disabledClass}${warnClass}" data-action-id="${action.id}" data-reason="${reason}" ${avail ? '' : 'aria-disabled="true"'}>
          <span class="action-label">${action.label}</span>
          <span class="action-detail">${action.detail}</span>
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
          const reason = btn.dataset.reason ?? '';
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
      const willDeplete = avail && (action.energyCost ?? 0) > 0 && state.player.energy <= (action.energyCost ?? 0);

      if (avail) {
        btn.classList.remove('disabled');
        btn.removeAttribute('aria-disabled');
        btn.dataset.reason = '';
      } else {
        btn.classList.add('disabled');
        btn.setAttribute('aria-disabled', 'true');
        btn.dataset.reason = action.unavailableReason(state);
      }

      if (willDeplete) {
        btn.classList.add('warn');
      } else {
        btn.classList.remove('warn');
      }
    });
  }

  hide(): void {
    this.el.innerHTML = '';
    this.el.classList.remove('is-open');
    this.onAction = null;
  }
}
