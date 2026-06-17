import type { GameState } from '../state/types'
import { StatsPanel } from './panels/StatsPanel'
import { locations } from '../data/locations'

export class HUD {
  private root: HTMLElement;
  private statsPanel: StatsPanel;
  private mounted = false;

  constructor() {
    const root = document.getElementById('ui-root');
    if (!root) throw new Error('#ui-root element not found');
    this.root = root;
    this.statsPanel = new StatsPanel();
  }

  mount(): void {
    if (this.mounted) return;
    this.root.appendChild(this.statsPanel.getElement());
    this.mounted = true;
  }

  update(state: GameState): void {
    if (!this.mounted) return;
    this.statsPanel.update(state);

    // Update location name from location definitions
    const locDef = locations.find(l => l.id === state.currentLocationId);
    if (locDef) {
      this.statsPanel.updateLocationName(locDef.name);
    }
  }

  unmount(): void {
    if (!this.mounted) return;
    const el = this.statsPanel.getElement();
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    this.mounted = false;
  }

  isMounted(): boolean {
    return this.mounted;
  }
}
