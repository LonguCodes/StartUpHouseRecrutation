import { createApplication, startApplication } from './app';
import { DatasourceBindings } from './infrastructure/datasource';
import destroyable from 'server-destroy';
import { Server } from 'http';
import Koa from "koa";

// DatasourceBindings.MongoDatabaseName.value = 'StartUpHouse';
// DatasourceBindings.MongoUrl.value = `mongodb://${process.env.DATABASE_URL}`;
// DatasourceBindings.RedisUrl.value = process.env.CACHE_URL;

const app = new Koa();
app.listen(3000);
console.log('Server started on port 3000');

// startApplication()aa s
// 	.then((app) => {
// 		return new Promise((resolve) => {
// 			const server = app.listen(3000, () => {
// 				resolve(server);
// 			});
// 		});
// 	})
// 	.then((server: Server) => {
// 		console.log('Server started on port 3000');
// 	})
// 	.catch((e) => {
// 		console.info(e);
// 		console.error('Failed to start the server');
// 		process.exit();
// 	});
