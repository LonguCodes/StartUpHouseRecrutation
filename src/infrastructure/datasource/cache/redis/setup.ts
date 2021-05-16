import Redis from 'ioredis';
import { DatasourceBindings } from '../../bindings';
import { CacheBindings } from '../bindings';
import { RedisCacheManager } from './cacheManager.redis';



export async function createRedisConnection() {
	const url = DatasourceBindings.RedisUrl.value;
	if (!url) throw new Error('Redis connection can not be established');
	const client = new Redis(url);
	DatasourceBindings.RedisClient.value = client;
	CacheBindings.Manager.value = new RedisCacheManager(client);
	return client;
}
