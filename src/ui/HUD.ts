import type { GameState, LocationId } from '../state/types'
import { StatsPanel } from './panels/StatsPanel'
import { ActionPanel } from './panels/ActionPanel'
import { getActionsForLocation } from '../systems/ActionSystem'
import { locations } from '../data/locations'

export class HUD {
  private root: HTMLElement;
  private statsPanel: StatsPanel;
  private actionPanel: ActionPanel;
  private mounted = false;
  private currentLocationId: LocationId | null = null;

  constructor() {
    const root = document.getElementById('ui-root');
    if (!root) throw new Error('#ui-root element not found');
    this.root = root;
    this.statsPanel = new StatsPanel();
    this.actionPanel = new ActionPanel();
  }

  mount(): void {
    if (this.mounted) return;
    this.root.appendChild(this.statsPanel.getElement());
    // Append action panel inside the stats panel element
    this.statsPanel.getElement().appendChild(this.actionPanel.getElement());
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

    // Update action panel if we have a current location
    if (this.currentLocationId) {
      this.actionPanel.update(getActionsForLocation(this.currentLocationId, state), state);
    }
  }

  showActions(
    locationId: LocationId,
    state: GameState,
    onAction: (id: string) => void,
  ): void {
    this.currentLocationId = locationId;
    const locDef = locations.find(l => l.id === locationId);
    const locationName = locDef ? locDef.name : locationId;
    const actions = getActionsForLocation(locationId, state);
    this.actionPanel.show(locationName, actions, state, onAction);
  }

  hideActions(): void {
    this.currentLocationId = null;
    this.actionPanel.hide();
  }

  unmount(): void {
    if (!this.mounted) return;
    this.hideActions();
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
