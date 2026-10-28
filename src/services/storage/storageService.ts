import { AppDataStore, createInitialDataStore } from '../../data/seed';

const STORAGE_KEY = 'MINERALINK_DATA_V1';

export class StorageService {
  private static cachedStore: AppDataStore | null = null;
  private static listeners: Set<(store: AppDataStore) => void> = new Set();

  public static getStore(): AppDataStore {
    if (this.cachedStore) {
      return this.cachedStore;
    }

    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        const initial = createInitialDataStore();
        this.saveStore(initial);
        return initial;
      }
      const parsed = JSON.parse(serialized) as AppDataStore;
      if (!parsed.version || parsed.version !== '1.0.0') {
        const fresh = createInitialDataStore();
        this.saveStore(fresh);
        return fresh;
      }
      this.cachedStore = parsed;
      return parsed;
    } catch (e) {
      console.error('Failed to load MINERALINK store from localStorage, initializing fresh:', e);
      const fresh = createInitialDataStore();
      this.saveStore(fresh);
      return fresh;
    }
  }

  public static saveStore(store: AppDataStore): void {
    try {
      this.cachedStore = store;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      this.notifyListeners(store);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  public static resetStore(): AppDataStore {
    const fresh = createInitialDataStore();
    this.saveStore(fresh);
    return fresh;
  }

  public static exportStoreJson(): string {
    const store = this.getStore();
    return JSON.stringify(store, null, 2);
  }

  public static importStoreJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString) as AppDataStore;
      if (parsed.suppliers && parsed.listings && parsed.purchaseOrders) {
        this.saveStore(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON import:', e);
      return false;
    }
  }

  public static subscribe(listener: (store: AppDataStore) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notifyListeners(store: AppDataStore): void {
    this.listeners.forEach((listener) => {
      try {
        listener(store);
      } catch (err) {
        console.error('Error notifying storage listener:', err);
      }
    });
  }
}
