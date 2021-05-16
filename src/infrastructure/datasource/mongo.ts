import { Db, MongoClient } from 'mongodb';
import { DatasourceBindings } from './bindings';

export async function createDatabaseConnection() {
	const url = DatasourceBindings.MongoUrl.value;
	if (!url) throw new Error('Database connection can not be established');
	const client = new MongoClient(url, { useUnifiedTopology: true });

	await client.connect();
	const db = client.db(DatasourceBindings.MongoDatabaseName.value);
	DatasourceBindings.MongoDatabase.value = db;
	DatasourceBindings.MongoClient.value = client;
	return client;
}
