import { DateTime } from 'luxon';
import { ZombieEntity } from '../../infrastructure/entity/zombie.entity';
import { ItemEntity } from '../../infrastructure/entity';
import { staticImplements } from '../../core/utilities';
import { Model, ModelStatic } from '../../core/types';

@staticImplements<ModelStatic<ItemEntity>>()
export class ItemModel implements Model {
	id: number;
	name: string;
	price: number;

	static fromEntity(entity: ItemEntity) {
		const model = new ItemModel();
		model.id = entity.id;
		model.name = entity.name;
		model.price = entity.price;
		return model;
	}

	static fromData(entity: Record<string, any>) {
		const model = new ItemModel();
		model.id = entity.id;
		model.name = entity.name;
		model.price = entity.price;
		return model;
	}

	toEntity() {
		const entity = new ItemEntity();
		entity.id = this.id;
		entity.name = this.name;
		entity.price = this.price;
		return entity;
	}
}
