import {
	ItemEntity,
	ZombieEntity
} from '../../../../src/infrastructure/entity';
import { ZombieModel } from '../../../../src/domain/model/zombie.model';
import { DateTime } from 'luxon';
import { ItemModel } from '../../../../src/domain/model/item.model';

describe('Should be able to use model hydration and dehydration', () => {
	it('Should be to hydrate model', () => {
		const entity = new ItemEntity();
		entity.name = 'stick';
		entity.price = 123;
		entity.id = 1;

		const model = ItemModel.fromEntity(entity);
		expect(model).toEqual({
			name: 'stick',
			id: 1,
			price: 123
		});
		expect(model).toBeInstanceOf(ItemModel);
	});

	it('Should be to dehydrate model', () => {
		const model = new ItemModel();
		model.name = 'stick';
		model.price = 123;
		model.id = 1;

		const entity = model.toEntity();
		expect(entity).toEqual({
			name: 'stick',
			id: 1,
			price: 123
		});
		expect(entity).toBeInstanceOf(ItemEntity);
	});
});
