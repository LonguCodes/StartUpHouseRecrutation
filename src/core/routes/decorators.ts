import { RouteRegistry, RouteType } from './registry';
import { ComposableFunction } from 'composable-js';

function register(type: RouteType) {
	return (route: string) => (target: any, propertyKey: string) => {
		RouteRegistry.registerRoute(
			type,
			route,
			target.constructor,
			propertyKey
		);
	};
}
export const post = register('post');
export const del = register('delete');
export const patch = register('patch');
export const get = register('get');
