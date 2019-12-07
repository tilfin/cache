export interface CacheOptions<T> {
    /**
     * default Time-To-Live milliseconds
     */
    defaultTtl?: number;
    /***
     * callback on delete
     *
     * @param item deleting target
     */
    onDelete?: (item: T) => void;
}
/**
 * Key-Value based cache map for sync
 */
export declare class Cache<T> {
    private map;
    private defaultTtl;
    private onDelete;
    /**
     * Constructor
     *
     * @param options cache options
     */
    constructor(options?: CacheOptions<T>);
    /**
     * Set caching value
     *
     * @param key the key
     * @param value cache target
     * @param ttl Time-To-Live milliseconds
     */
    set(key: string, value: T, ttl?: number): void;
    /**
     * Get cached value
     *
     * @param key the key of target
     * @return cached value or undefined
     */
    get(key: string): T | undefined;
    /**
     * Delete cached value
     *
     * @param key the key of target
     * @return Whether it was cached
     */
    delete(key: string): boolean;
    /**
     * Delete all entries
     */
    clear(): void;
}
export interface CacheAsyncOptions<T> {
    /**
     * default Time-To-Live milliseconds
     */
    defaultTtl?: number;
    /***
     * callback on delete
     */
    onDelete?: (item: T) => Promise<void>;
}
/**
 * Key-Value based cache map for async
 */
export declare class CacheAsync<T> {
    private map;
    private defaultTtl;
    private onDelete;
    /**
     * Constructor
     *
     * @param options cache options
     */
    constructor(options?: CacheAsyncOptions<T>);
    /**
     * Set caching value
     *
     * @param key the key
     * @param value cache target
     * @param ttl Time-To-Live milliseconds
     */
    set(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * Get cached value
     *
     * @param key the key of target
     * @return cached value or undefined
     */
    get(key: string): Promise<T | undefined>;
    /**
     * Delete cached value
     *
     * @param key the key of target
     * @return Whether it was cached
     */
    delete(key: string): Promise<boolean>;
    /**
     * Delete all entries
     */
    clear(): Promise<void>;
}
