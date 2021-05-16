import { ZombieEntity } from '../../../../src/infrastructure/entity';
import { ZombieModel } from '../../../../src/domain/model/zombie.model';
import { DateTime } from 'luxon';
import { ItemModel } from '../../../../src/domain/model/item.model';

describe('Should be able to use model hydration and dehydration', () => {
	it('Should be to hydrate model', () => {
		const entity = new ZombieEntity();
		entity.name = 'bob';
		entity._id = '121212121212121212121212';
		entity.items = [1, 2];
		entity.createDate = new Date();

		const model = ZombieModel.fromEntity(entity);
		expect(model).toEqual({
			name: 'bob',
			id: '121212121212121212121212',
			create_date: DateTime.fromJSDate(entity.createDate)
		});
		expect(model).toBeInstanceOf(ZombieModel);
	});

	it('Should be to dehydrate model', () => {
		const model = new ZombieModel();
		model.name = 'bob';
		model.id = '121212121212121212121212';
		model.create_date = DateTime.now();

		const entity = model.toEntity();
		expect(entity).toEqual({
			name: 'bob',
			_id: '121212121212121212121212',
			createDate: model.create_date.toJSDate()
		});
		expect(entity).toBeInstanceOf(ZombieEntity);
	});
});
