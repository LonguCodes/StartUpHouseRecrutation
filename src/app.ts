import dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from '@koa/router';
import { withZone } from './core/container/zone';
import { RouteRegistry } from './core/routes/registry';
import { HttpError, HttpErrors, SudoHttpError } from './core/errors';
import './API';
import './infrastructure/repository';
import './domain/service';
import { RouteBindings } from './core/routes/bindings';
import {
	createAxios,
	createDatabaseConnection
} from './infrastructure/datasource';
import { Server } from 'http';
import { createRedisConnection } from './infrastructure/datasource/cache/redis/setup';
import destroyable from 'server-destroy';

export function createApplication(): Koa {
	const app = new Koa();
	const router = new Router();

	RouteRegistry.applyRoutes(router);

	app.use(cors());
	app.use(json());
	app.use(bodyParser());
	app.use(async (ctx, next) => {
		ctx.type = 'application/json';
		try {
			const data = await next();
			ctx.body = JSON.stringify(data);
			if (ctx.body) ctx.status = 200;
			else ctx.status = 204;
		} catch (e: unknown) {
			let error = new HttpErrors.InternalError();
			if (e instanceof SudoHttpError) error = e.httpError;
			if (e instanceof HttpError) error = e;

			if (process.env.DEBUG === 'True') console.debug(e);
			ctx.body = JSON.stringify({
				message: error.message,
				code: error.code
			});
			ctx.status = error.code;
		}
	});
	app.use((ctx, next) =>
		withZone(() => {
			RouteBindings.Context.value = ctx;
			return next();
		})
	);

	app.use(router.routes());
	app.use(router.allowedMethods({ throw: true }));
	app.use(() => {
		throw new HttpErrors.NotFound();
	});

	return app;
}

export async function startApplication(): Promise<Koa> {
	const app = createApplication();
	await createDatabaseConnection();
	await createRedisConnection();
	createAxios();
	return app;
}
