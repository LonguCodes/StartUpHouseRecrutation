import Koa from 'koa';
import { RouteType } from './registry';
import { ComposableClass } from 'composable-js';
import { Constructor } from 'injectable-js';

export type Resolver = (ctx: Koa.Context) => any;

export interface Route {
	controller: Constructor;
	methodName: string;
	path: string;
	type: RouteType;
}
