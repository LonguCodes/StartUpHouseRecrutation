import { request, mongo } from './setup';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';

let zombieEntity;
let zombieModel;

beforeEach(async () => {
	zombieEntity = (
		await mongo.collection('zombie').insertOne({
			name: 'test',
			createDate: DateTime.now().toUTC().toJSDate(),
			items: []
		})
	).ops[0];
	zombieModel = {
		id: zombieEntity._id.toString(),
		name: zombieEntity.name,
		create_date: DateTime.fromJSDate(
			new Date(zombieEntity.createDate)
		).toISO()
	};
});

afterEach(async () => {
	await mongo.collection('zombie').deleteMany({});
});

describe('Should be able interact with zombies', () => {
	describe('Should be able to get information about zombies', () => {
		it('should be able to get all zombies', async () => {
			const { body } = await request.get('/zombie').expect(200);
			expect(body).toEqual([zombieModel]);
		});

		it('should be able to get zombie by id', async () => {
			const { body } = await request
				.get(`/zombie/${zombieModel.id}`)
				.expect(200);
			expect(body).toEqual(zombieModel);
		});

		it('should be able to get items of a zombie', async () => {
			await mongo
				.collection('zombie')
				.updateOne(
					{ _id: new ObjectId(zombieModel.id) },
					{ $set: { items: [1] } }
				);
			const { body } = await request
				.get(`/zombie/${zombieModel.id}/items`)
				.expect(200);
			expect(body).toEqual([
				{
					id: 1,
					name: 'Diamond Sword',
					price: 100
				}
			]);
		});

		it('should be able to get items of a zombie', async () => {
			const { body } = await request
				.get(`/zombie/${zombieModel.id}/items`)
				.expect(200);
			expect(body).toEqual([]);
		});

		it('should be able to get total prices of items of a zombie', async () => {
			const { body } = await request
				.get(`/zombie/${zombieModel.id}/items/total`)
				.expect(200);
			expect(body).toEqual({
				pricePLN: 0,
				priceEUR: 0,
				priceUSD: 0,
				zombieId: zombieModel.id
			});
		});
	});
	describe('Should be able to modify zombies', () => {
		it('should be able to get total prices of items of a zombie', async () => {
			await mongo
				.collection('zombie')
				.updateOne(
					{ _id: new ObjectId(zombieModel.id) },
					{ $set: { items: [1] } }
				);
			const { body } = await request
				.get(`/zombie/${zombieModel.id}/items/total`)
				.expect(200);
			expect(body).toEqual({
				pricePLN: 100,
				priceEUR: 100 / 4.4,
				priceUSD: 100 / 3.5,
				zombieId: zombieModel.id
			});
		});

		it('should be able to create new zombie', async () => {
			await request.post('/zombie').send({ name: 'test2' }).expect(200);
			const zombies = await mongo.collection('zombie').find({}).toArray();
			expect(zombies.length).toEqual(2);
			const createdZombie = zombies[1];
			expect(createdZombie).toHaveProperty('createDate');
			expect(createdZombie.items).toEqual([]);
			expect(createdZombie.name).toEqual('test2');
		});

		it('should not be able to create new zombie with additional properties', async () => {
			await request
				.post('/zombie')
				.send({ name: 'test2', age: 1 })
				.expect(400);
			const zombies = await mongo.collection('zombie').find({}).toArray();
			expect(zombies.length).toEqual(1);
		});

		it('should not be able to create new zombie without a name', async () => {
			await request.post('/zombie').send({}).expect(400);
			const zombies = await mongo.collection('zombie').find({}).toArray();
			expect(zombies.length).toEqual(1);
		});

		it('should be able to remove a zombie', async () => {
			await request.delete(`/zombie/${zombieModel.id}`).expect(204);
			const zombies = await mongo.collection('zombie').find({}).toArray();
			expect(zombies.length).toEqual(0);
		});

		it('should not be able to remove a non-existing zombie', async () => {
			await request
				.delete('/zombie/121212121212121212121212')
				.expect(404);
			const zombies = await mongo.collection('zombie').find({}).toArray();
			expect(zombies.length).toEqual(1);
		});

		it('should be able to update a zombie', async () => {
			await request
				.patch(`/zombie/${zombieModel.id}`)
				.send({ name: 'barry' })
				.expect(204);
			const zombies = await mongo.collection('zombie').find({}).toArray();
			expect(zombies.length).toEqual(1);
			const zombie = zombies[0];
			expect(zombie.name).toEqual('barry');
		});

		it('should not be able to update a non-existing zombie', async () => {
			await request
				.patch('/zombie/121212121212121212121212')
				.send({ name: 'barry' })
				.expect(404);
		});

		it('should not be able to update a zombie with incorrect data', async () => {
			await request
				.patch('/zombie/${zombieModel.id}')
				.send({ name: 'barry', age: 10 })
				.expect(400);
		});
	});
});
