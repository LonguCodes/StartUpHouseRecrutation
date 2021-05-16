import { request } from './setup';

describe('Should be able to get items', () => {
	it('should be able to get all items', () => {
		return request.get('/item').expect(200, [
			{
				id: 1,
				name: 'Diamond Sword',
				price: 100
			},
			{
				id: 2,
				name: 'Trident',
				price: 200
			}
		]);
	});

	it('should be able to get item by id', () => {
		return request.get('/item/1').expect(200, {
			id: 1,
			name: 'Diamond Sword',
			price: 100
		});
	});

	it('should not be able to get non-existing item by id', () => {
		return request.get('/item/3').expect(404);
	});
});
