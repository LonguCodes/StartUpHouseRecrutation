import KoaRouter from '@koa/router';
import { Route } from './types';
import { Constructor, DIContainer } from 'injectable-js';

export type RouteType = 'get' | 'post' | 'patch' | 'delete' | 'put';

export abstract class RouteRegistry {
	private static routes: Route[] = [];

	public static registerRoute(
		type: RouteType,
		path: string,
		controller: Constructor,
		methodName: string
	) {
		RouteRegistry.routes.push({ type, path, controller, methodName });
	}

	public static applyRoutes(router: KoaRouter) {
		const sorted = [...RouteRegistry.routes].sort((a, b) =>
			a.path.localeCompare(b.path)
		);
		for (const route of sorted) {
			while (route.path.endsWith('/'))
				route.path = route.path.substr(0, route.path.length - 1);
			router[route.type](route.path, (context) =>
				DIContainer.instantiate(route.controller)[route.methodName](
					context
				)
			);
		}
		return router;
	}
}
