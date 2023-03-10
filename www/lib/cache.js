export class Cache {
    constructor(maxSize) {
      this.maxSize = maxSize;
      this.cache = new Map();
      this.cachef = new Map();
    }
  
    async get(key) {
      if (!this.cache.has(key)) {
        const vl = await this.cachef.get(key)();
        this.set(key, vl);
      }
      const value = this.cache.get(key);
      if (value) {
        // Move the item to the end of the Map to mark it as most recently used
        this.cache.delete(key);
        this.cache.set(key, value);
      }
      return value;
    }
  
    set(key, value) {
      // If the cache is at maximum capacity, delete the least recently used item
      if (this.cache.size >= this.maxSize) {
        const keyToDelete = this.cache.keys().next().value;
        this.cache.delete(keyToDelete);
      }
      // Set the new item as the most recently used item
      this.cache.set(key, value);
    }

    set_func(key, func) {
      this.cachef.set(key, func);
    }
  }
  