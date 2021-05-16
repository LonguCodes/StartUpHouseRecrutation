export interface CacheManager {
	exists(key: string): Promise<boolean>;
	set(key: string, value: any, ttl?: number): Promise<void>;
	get<T>(key: string): Promise<T>;
}
