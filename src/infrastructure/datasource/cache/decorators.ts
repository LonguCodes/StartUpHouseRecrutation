import _ from 'lodash';
import { ComposableFunction } from 'composable-js';
import { CacheManager } from './cacheManager';
export interface CacheOptions {
	key: (...args: any[]) => string;
	ttl?: number | (() => number);
}

export function cache(
	managerOrGetter: CacheManager | (() => CacheManager),
	options?: CacheOptions
) {
	return ComposableFunction.decorator((original, composable) => {
		options = _.merge(
			{
				key: (arg1: unknown) => arg1.toString()
			},
			options
		);
		const ttl = options.ttl
			? options.ttl instanceof Function
				? options.ttl()
				: options.ttl
			: undefined;

		return async (...args: any[]) => {
			const manager =
				managerOrGetter instanceof Function
					? managerOrGetter()
					: managerOrGetter;

			const key = options.key(...args);
			const exists = await manager.exists(key);
			if (exists) return manager.get(key);
			const result = await original(...args);
			await manager.set(key, result, ttl);
			return result;
		};
	});
}
