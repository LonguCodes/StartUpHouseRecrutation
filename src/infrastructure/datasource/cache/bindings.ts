import { BindingKey, BindingLifetime } from 'injectable-js';
import { GlobalContainer } from '../../../core/container/global';

export namespace CacheBindings {
	export const Manager = new BindingKey(
		'cache.manager',
		BindingLifetime.Value,
		GlobalContainer
	);
}
