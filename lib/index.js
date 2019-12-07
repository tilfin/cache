"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Key-Value based cache map for sync
 */
class Cache {
    /**
     * Constructor
     *
     * @param options cache options
     */
    constructor(options = {}) {
        this.defaultTtl = options.defaultTtl || 0;
        this.map = new Map();
        this.onDelete = options.onDelete || (() => { });
    }
    /**
     * Set caching value
     *
     * @param key the key
     * @param value cache target
     * @param ttl Time-To-Live milliseconds
     */
    set(key, value, ttl) {
        const _ttl = ttl !== undefined ? ttl : this.defaultTtl;
        const expires = _ttl === 0 ? 0 : new Date().getTime() + _ttl;
        this.map.set(key, { value, expires });
    }
    /**
     * Get cached value
     *
     * @param key the key of target
     * @return cached value or undefined
     */
    get(key) {
        const entry = this.map.get(key);
        if (entry === undefined)
            return undefined;
        const { value, expires } = entry;
        if (expires > 0 && expires < new Date().getTime()) {
            this.onDelete(value);
            this.map.delete(key);
            return undefined;
        }
        return value;
    }
    /**
     * Delete cached value
     *
     * @param key the key of target
     * @return Whether it was cached
     */
    delete(key) {
        const entry = this.map.get(key);
        if (entry === undefined)
            return false;
        const { value } = entry;
        this.onDelete(value);
        this.map.delete(key);
        return true;
    }
    /**
     * Delete all entries
     */
    clear() {
        for (const { value } of this.map.values()) {
            this.onDelete(value);
        }
        this.map.clear();
    }
}
exports.Cache = Cache;
/**
 * Key-Value based cache map for async
 */
class CacheAsync {
    /**
     * Constructor
     *
     * @param options cache options
     */
    constructor(options = {}) {
        this.defaultTtl = options.defaultTtl || 0;
        this.map = new Map();
        this.onDelete = options.onDelete || (async () => { });
    }
    /**
     * Set caching value
     *
     * @param key the key
     * @param value cache target
     * @param ttl Time-To-Live milliseconds
     */
    async set(key, value, ttl) {
        const _ttl = ttl !== undefined ? ttl : this.defaultTtl;
        const expires = _ttl === 0 ? 0 : new Date().getTime() + _ttl;
        this.map.set(key, { value, expires });
    }
    /**
     * Get cached value
     *
     * @param key the key of target
     * @return cached value or undefined
     */
    async get(key) {
        const entry = this.map.get(key);
        if (entry === undefined)
            return undefined;
        const { value, expires } = entry;
        if (expires > 0 && expires < new Date().getTime()) {
            this.map.delete(key);
            await this.onDelete(value);
            return undefined;
        }
        return value;
    }
    /**
     * Delete cached value
     *
     * @param key the key of target
     * @return Whether it was cached
     */
    async delete(key) {
        const entry = this.map.get(key);
        if (entry === undefined)
            return false;
        const { value } = entry;
        await this.onDelete(value);
        this.map.delete(key);
        return true;
    }
    /**
     * Delete all entries
     */
    async clear() {
        for await (const { value } of this.map.values()) {
            this.onDelete(value);
        }
        this.map.clear();
    }
}
exports.CacheAsync = CacheAsync;
