export class Cache<K, V> {
  private cache: Map<K, { value: V; timestamp: number }> = new Map();
  
  constructor(private ttl: number) {}

  set(key: K, value: V): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: K): V | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }
}