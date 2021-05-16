import { Db, FilterQuery, ObjectId } from 'mongodb';
import { ZombieRepository } from './zombie.repository';
import { ZombieEntity } from '../../entity/zombie.entity';
import { DatasourceBindings } from '../../datasource/bindings';
import { BindingLifetime, inject, injectable } from 'injectable-js';
import { GlobalContainer } from '../../../core/container/global';
import { DateTime } from 'luxon';

@injectable('ZombieRepositoryMongo', GlobalContainer, BindingLifetime.Transient)
export class ZombieRepositoryMongo implements ZombieRepository {
	private readonly collectionName = 'zombie';

	constructor(
		@inject.fromBindingKey(DatasourceBindings.MongoDatabase) private db: Db
	) {}

	async updateOne(entity: Partial<ZombieEntity>): Promise<void> {
		const id = entity._id;
		delete entity._id;
		await this.db
			.collection(this.collectionName)
			.updateOne({ _id: new ObjectId(id) }, { $set: entity });
	}
	async deleteOne(id: string): Promise<void> {
		await this.db
			.collection(this.collectionName)
			.deleteOne({ _id: new ObjectId(id) });
	}

	async getAll(): Promise<ZombieEntity[]> {
		return this.db
			.collection<ZombieEntity>(this.collectionName)
			.find()
			.toArray();
	}

	getById(id: string): Promise<ZombieEntity> {
		return this.db
			.collection<ZombieEntity>(this.collectionName)
			.findOne({ _id: new ObjectId(id) } as FilterQuery<ZombieEntity>);
	}

	async createOne(entity: Partial<ZombieEntity>): Promise<ZombieEntity> {
		entity.createDate = DateTime.now().toUTC().toJSDate();
		entity.items = [];
		const result = await this.db
			.collection<ZombieEntity>(this.collectionName)
			.insertOne(entity as ZombieEntity);
		entity._id = result.insertedId;
		return entity as ZombieEntity;
	}
}
