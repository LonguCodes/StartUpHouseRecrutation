import { BindingKey, BindingLifetime } from 'injectable-js';
import { ZoneContainer } from '../container/zone';

export namespace RouteBindings {
	export const Context = new BindingKey(
		'RouteContext',
		BindingLifetime.Value,
		ZoneContainer
	);
}
