import { Redis } from 'ioredis';
import { CacheManager } from '../cacheManager';

export class RedisCacheManager implements CacheManager {
	constructor(private redis: Redis) {}

	async exists(key: string) {
		return (await this.redis.exists(key)) === 1;
	}

	async get<T>(key: string) {
		return JSON.parse(await this.redis.get(key)) as T;
	}

	async set(key: string, value: any, ttl?: number): Promise<void> {
		if (ttl) await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
		else await this.redis.set(key, JSON.stringify(value));
	}
}
