import { ZombieEntity } from '../../entity/zombie.entity';

export interface ZombieRepository {
	getAll(): Promise<ZombieEntity[]>;
	getById(id: string): Promise<ZombieEntity>;
	createOne(entity: Partial<ZombieEntity>): Promise<ZombieEntity>;
	updateOne(entity: Partial<ZombieEntity>): Promise<void>;
	deleteOne(id: string): Promise<void>;
}
