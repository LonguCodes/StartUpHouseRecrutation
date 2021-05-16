import { ItemEntity } from '../../entity';

export interface ItemRepository {
	getAll(): Promise<ItemEntity[]>;
	getById(id: number): Promise<ItemEntity>;
}
