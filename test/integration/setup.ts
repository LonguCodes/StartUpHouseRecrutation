

import '../mocks/cache';
import '../mocks/workers/item/setup';
import '../mocks/workers/exchange/setup';
import supertest from 'supertest';
import { before, after } from '../mocks/database';
import { startApplication } from '../../src/app';
import { DatasourceBindings } from '../../src/infrastructure/datasource';
import { Db } from 'mongodb';
import { Redis } from 'ioredis';

export let mongo: Db;
export let redis: Redis;

export let server;
export let request;

beforeAll(async () => {
	DatasourceBindings.RedisUrl.value = 'none';


	try {
		await before();
		app = await startApplication();
		server = app.listen(3000);
		request = supertest(server);
		mongo = DatasourceBindings.MongoDatabase.value;
		redis = DatasourceBindings.RedisClient.value;
	} catch (e) {
		console.log(e);
	}
});

afterAll(async () => {
	try {
		await after();
		server?.close();
		DatasourceBindings.MongoClient.value.close();
		DatasourceBindings.RedisClient.value.disconnect();
	} catch (e) {
		console.log(e);
	}
});
export let app;
