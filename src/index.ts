export interface CacheOptions<T> {
  /**
   * default Time-To-Live milliseconds
   */
  defaultTtl?: number

  /***
   * callback on delete
   * 
   * @param item deleting target
   */
  onDelete?: (item: T) => void
}

/**
 * Key-Value based cache map for sync
 */
export class Cache<T> {
  private map: Map<string, { value: T; expires: number }>
  private defaultTtl: number
  private onDelete: (item: T) => void

  /**
   * Constructor
   *
   * @param options cache options
   */
  constructor(options: CacheOptions<T> = {}) {
    this.defaultTtl = options.defaultTtl || 0
    this.map = new Map()
    this.onDelete = options.onDelete || (() => {})
  }

  /**
   * Set caching value
   *
   * @param key the key
   * @param value cache target 
   * @param ttl Time-To-Live milliseconds
   */
  set(key: string, value: T, ttl?: number) {
    const _ttl = ttl !== undefined ? ttl : this.defaultTtl
    const expires = _ttl === 0 ? 0 : new Date().getTime() + _ttl
    this.map.set(key, { value, expires })
  }

  /**
   * Get cached value
   *
   * @param key the key of target
   * @return cached value or undefined
   */
  get(key: string): T | undefined {
    const entry = this.map.get(key)
    if (entry === undefined) return undefined

    const { value, expires } = entry
    if (expires > 0 && expires < new Date().getTime()) {
      this.onDelete(value)
      this.map.delete(key)
      return undefined
    }

    return value
  }

  /**
   * Delete cached value
   *
   * @param key the key of target
   * @return Whether it was cached
   */
  delete(key: string): boolean {
    const entry = this.map.get(key)
    if (entry === undefined) return false

    const { value } = entry
    this.onDelete(value)
    this.map.delete(key)
    return true
  }

  /**
   * Delete all entries
   */
  clear() {
    for (const { value } of this.map.values()) {
      this.onDelete(value)
    }
    this.map.clear()
  }
}

export interface CacheAsyncOptions<T> {
  /**
   * default Time-To-Live milliseconds
   */
  defaultTtl?: number

  /***
   * callback on delete
   */
  onDelete?: (item: T) => Promise<void>
}

/**
 * Key-Value based cache map for async
 */
export class CacheAsync<T> {
  private map: Map<string, { value: T; expires: number }>
  private defaultTtl: number
  private onDelete: (item: T) => Promise<void>

  /**
   * Constructor
   *
   * @param options cache options
   */
  constructor(options: CacheAsyncOptions<T> = {}) {
    this.defaultTtl = options.defaultTtl || 0
    this.map = new Map()
    this.onDelete = options.onDelete || (async () => {})
  }

  /**
   * Set caching value
   *
   * @param key the key
   * @param value cache target 
   * @param ttl Time-To-Live milliseconds
   */
  async set(key: string, value: T, ttl?: number): Promise<void> {
    const _ttl = ttl !== undefined ? ttl : this.defaultTtl
    const expires = _ttl === 0 ? 0 : new Date().getTime() + _ttl
    this.map.set(key, { value, expires })
  }

  /**
   * Get cached value
   *
   * @param key the key of target
   * @return cached value or undefined
   */
  async get(key: string): Promise<T | undefined> {
    const entry = this.map.get(key)
    if (entry === undefined) return undefined

    const { value, expires } = entry
    if (expires > 0 && expires < new Date().getTime()) {
      this.map.delete(key)
      await this.onDelete(value)
      return undefined
    }

    return value
  }

  /**
   * Delete cached value
   *
   * @param key the key of target
   * @return Whether it was cached
   */
  async delete(key: string): Promise<boolean> {
    const entry = this.map.get(key)
    if (entry === undefined) return false

    const { value } = entry
    await this.onDelete(value)
    this.map.delete(key)
    return true
  }

  /**
   * Delete all entries
   */
  async clear() {
    for await (const { value } of this.map.values()) {
      this.onDelete(value)
    }
    this.map.clear()
  }
}
