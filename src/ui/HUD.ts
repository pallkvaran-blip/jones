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
  private currentActionIds: string = '';
  private onActionCallback: ((id: string) => void) | null = null;
  private onUnavailableCallback: ((msg: string) => void) | null = null;

  constructor() {
    this.root = document.getElementById('ui-root') ?? document.body;
    this.statsPanel = new StatsPanel();
    this.actionPanel = new ActionPanel();
  }

  mount(): void {
    if (this.mounted) return;
    // Panels live in their dedicated layout slots — not inside the canvas overlay.
    const leftSlot  = document.getElementById('left-slot')  ?? this.root;
    const rightSlot = document.getElementById('right-slot') ?? this.root;
    leftSlot.appendChild(this.actionPanel.getElement());
    rightSlot.appendChild(this.statsPanel.getElement());
    this.mounted = true;
  }

  update(state: GameState): void {
    if (!this.mounted) return;
    this.statsPanel.update(state);

    const locDef = locations.find(l => l.id === state.currentLocationId);
    if (locDef) this.statsPanel.updateLocationName(locDef.name);

    if (this.currentLocationId && this.onActionCallback) {
      const newActions = getActionsForLocation(this.currentLocationId, state);
      // Include pets in fingerprint so new adoptions re-render the home panel
      const newIds = newActions.map(a => a.id).join(',') + '|' + (state.player.pets ?? []).join(',');
      if (newIds !== this.currentActionIds) {
        // Action set changed (e.g. applied for job, upgraded housing, new pet) — full re-render
        this.currentActionIds = newIds;
        const name = locations.find(l => l.id === this.currentLocationId)?.name ?? this.currentLocationId!;
        this.actionPanel.show(this.currentLocationId!, name, newActions, state, this.onActionCallback, this.onUnavailableCallback ?? undefined);
      } else {
        this.actionPanel.update(newActions, state);
      }
    }
  }

  showActions(
    locationId: LocationId,
    state: GameState,
    onAction: (id: string) => void,
    onUnavailable?: (msg: string) => void,
  ): void {
    this.currentLocationId = locationId;
    this.onActionCallback = onAction;
    this.onUnavailableCallback = onUnavailable ?? null;
    const locDef = locations.find(l => l.id === locationId);
    const locationName = locDef ? locDef.name : locationId;
    const actions = getActionsForLocation(locationId, state);
    this.currentActionIds = actions.map(a => a.id).join(',') + '|' + (state.player.pets ?? []).join(',');
    this.actionPanel.show(locationId, locationName, actions, state, onAction, onUnavailable);
  }

  hideActions(): void {
    this.currentLocationId = null;
    this.currentActionIds = '';
    this.onActionCallback = null;
    this.onUnavailableCallback = null;
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
