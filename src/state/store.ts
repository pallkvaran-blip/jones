import type { GameState } from './types'

type Listener = (state: GameState) => void;

class Store {
  private states: [GameState, GameState | null];
  private activePlayer: 1 | 2 = 1;
  private listeners: Set<Listener> = new Set();

  constructor(initial: GameState) {
    this.states = [initial, null];
  }

  getState(): GameState {
    return this.states[this.activePlayer - 1]!;
  }

  setState(updater: (s: GameState) => GameState): void {
    this.states[this.activePlayer - 1] = updater(this.states[this.activePlayer - 1]!);
    this.listeners.forEach(l => l(this.states[this.activePlayer - 1]!));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  initTwoPlayer(state1: GameState, state2: GameState): void {
    this.states = [state1, state2];
    this.activePlayer = 1;
  }

  swapToPlayer(player: 1 | 2): void {
    // Switch to the given player and mark their state as pending handoff
    this.activePlayer = player;
    const current = this.states[player - 1];
    if (current) {
      this.states[player - 1] = { ...current, pendingTurnHandoff: true };
    }
    this.listeners.forEach(l => l(this.states[this.activePlayer - 1]!));
  }

  getBothStates(): [GameState, GameState | null] {
    return [this.states[0], this.states[1]];
  }

  getActivePlayer(): 1 | 2 {
    return this.activePlayer;
  }
}

let _store: Store | null = null;

export function initStore(initial: GameState): void {
  _store = new Store(initial);
}

export function getStore(): Store {
  if (!_store) {
    throw new Error('Store not initialized. Call initStore() first.');
  }
  return _store;
}
