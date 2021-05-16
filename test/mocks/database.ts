import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatasourceBindings } from '../../src/infrastructure/datasource';

let server: MongoMemoryServer;
export async function before() {
	server = new MongoMemoryServer();
	DatasourceBindings.MongoDatabaseName.value = await server.getDbName();
	DatasourceBindings.MongoUrl.value = await server.getUri();
}

export async function after() {
	await server.stop();
}
