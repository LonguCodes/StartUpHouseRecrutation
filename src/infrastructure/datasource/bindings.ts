import Redis from 'ioredis';
import { BindingKey, BindingLifetime } from 'injectable-js';
import { GlobalContainer } from '../../core/container/global';
import { AxiosInstance } from 'axios';
import { Db, MongoClient } from 'mongodb';

export namespace DatasourceBindings {
	export const RedisUrl = new BindingKey<string>(
		'datasource.redis.url',
		BindingLifetime.Value,
		GlobalContainer
	);

	export const RedisClient = new BindingKey<Redis.Redis>(
		'datasource.redis',
		BindingLifetime.Value,
		GlobalContainer
	);

	export const Axios = new BindingKey<AxiosInstance>(
		'Axios',
		BindingLifetime.Value,
		GlobalContainer
	);

	export const MongoDatabase = new BindingKey<Db>(
		'Mongo',
		BindingLifetime.Value,
		GlobalContainer
	);
	export const MongoDatabaseName = new BindingKey<string>(
		'MongoDatabaseName',
		BindingLifetime.Value,
		GlobalContainer
	);
	export const MongoUrl = new BindingKey<string>(
		'MongoUrl',
		BindingLifetime.Value,
		GlobalContainer
	);
	export const MongoClient = new BindingKey<MongoClient>(
		'MongoClient',
		BindingLifetime.Value,
		GlobalContainer
	);
}
