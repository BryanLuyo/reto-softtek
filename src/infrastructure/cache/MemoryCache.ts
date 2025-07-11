export interface Cache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T, ttlMs: number): void;
}

interface Entry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache<T> implements Cache<T> {
  private store = new Map<string, Entry<T>>();

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}
