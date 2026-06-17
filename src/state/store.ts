import type { GameState } from './types'

type Listener = (state: GameState) => void;

class Store {
  private state: GameState;
  private listeners: Set<Listener> = new Set();

  constructor(initial: GameState) {
    this.state = initial;
  }

  getState(): GameState {
    return this.state;
  }

  setState(updater: (s: GameState) => GameState): void {
    this.state = updater(this.state);
    this.listeners.forEach(l => l(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
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
