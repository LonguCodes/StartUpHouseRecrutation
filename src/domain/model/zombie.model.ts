import { DateTime } from 'luxon';
import { ZombieEntity } from '../../infrastructure/entity/zombie.entity';
import { staticImplements } from '../../core/utilities';
import { Model, ModelStatic } from '../../core/types';

@staticImplements<ModelStatic<ZombieEntity>>()
export class ZombieModel implements Model {
	id: string;
	name: string;
	create_date: DateTime;

	static fromEntity(entity: ZombieEntity) {
		const model = new ZombieModel();
		model.name = entity.name;
		model.create_date = DateTime.fromJSDate(entity.createDate);
		model.id = entity._id;
		return model;
	}

	static fromData(entity: Record<string, any>) {
		const model = new ZombieModel();
		model.name = entity.name;
		model.create_date = DateTime.fromJSDate(entity.createDate);
		model.id = entity.id;
		return model;
	}

	toEntity() {
		const entity = new ZombieEntity();
		entity.name = this.name;
		entity.createDate = this.create_date.toJSDate();
		entity._id = this.id;
		return entity;
	}
}
