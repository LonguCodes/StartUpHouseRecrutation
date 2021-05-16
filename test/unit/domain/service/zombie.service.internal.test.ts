import {
	ZombieNotFoundError,
	ZombieService,
	ZombieServiceInternal
} from '../../../../src/domain/service';
import {
	ZombieRepositoryMongo,
	ExchangeRepositoryExternal,
	ItemRepositoryExternal,
	ExchangeRepository
} from '../../../../src/infrastructure/repository';

import { classMock } from '../../../mocks/classMock';
import ZombieRepository from '../../../../src/infrastructure/repository/zombie';
import ItemRepository from '../../../../src/infrastructure/repository/item';
import { ZombieEntity } from '../../../../src/infrastructure/entity';
import { ZombieModel } from '../../../../src/domain/model/zombie.model';

let service: ZombieService;
let zombieRepository: jest.Mocked<ZombieRepository>;
let exchangeRepository: jest.Mocked<ExchangeRepository>;
let itemRepository: jest.Mocked<ItemRepository>;

const validZombieEntity: ZombieEntity = {
	_id: '121212121212121212121212',
	name: 'bill',
	items: [1, 2],
	createDate: new Date()
};

const validZombieModel: ZombieModel = ZombieModel.fromEntity({
	_id: '121212121212121212121212',
	name: 'bill',
	items: [1, 2],
	createDate: new Date()
});

beforeAll(() => {
	zombieRepository = classMock(ZombieRepositoryMongo);
	exchangeRepository = classMock(ExchangeRepositoryExternal);
	itemRepository = classMock(ItemRepositoryExternal);
	service = new ZombieServiceInternal(
		zombieRepository,
		itemRepository,
		exchangeRepository
	);
});

afterEach(() => {
	jest.clearAllMocks();
});
describe('Should be able to get all zombies', () => {
	it('should be able to get empty array', async () => {
		zombieRepository.getAll.mockResolvedValueOnce([]);
		await expect(service.getZombies()).resolves.toEqual([]);
		expect(zombieRepository.getAll).toHaveBeenCalledTimes(1);
	});

	it('should be able to get non-empty array', async () => {
		zombieRepository.getAll.mockResolvedValueOnce([validZombieEntity]);
		await expect(service.getZombies()).resolves.toEqual([
			ZombieModel.fromEntity(validZombieEntity)
		]);
		expect(zombieRepository.getAll).toHaveBeenCalledTimes(1);
	});
});

describe('Should be able to get zombie by id', () => {
	it('should be able to get zombie by id', async () => {
		zombieRepository.getById.mockResolvedValueOnce(validZombieEntity);
		await expect(
			service.getZombieById(validZombieEntity._id)
		).resolves.toEqual(ZombieModel.fromEntity(validZombieEntity));
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
	});

	it('should not be able to get non-existing zombie', async () => {
		await expect(
			service.getZombieById(validZombieEntity._id)
		).rejects.toThrow(ZombieNotFoundError);
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
	});
});

describe('Should be able to delete zombie', () => {
	it('should be able to delete zombie', async () => {
		zombieRepository.getById.mockResolvedValueOnce(validZombieEntity);
		await expect(
			service.deleteZombie(validZombieEntity._id)
		).resolves.toEqual(undefined);
		expect(zombieRepository.deleteOne).toHaveBeenCalledTimes(1);
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
	});

	it('should not be able to delete non-existing zombie', async () => {
		await expect(
			service.deleteZombie(validZombieEntity._id)
		).rejects.toThrow(ZombieNotFoundError);
		expect(zombieRepository.deleteOne).toHaveBeenCalledTimes(0);
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
	});
});

describe('Should be able to update zombie', () => {
	it('should be able to update zombie', async () => {
		zombieRepository.getById.mockResolvedValueOnce(validZombieEntity);
		await expect(service.updateZombie(validZombieModel)).resolves.toEqual(
			undefined
		);
		expect(zombieRepository.updateOne).toHaveBeenCalledTimes(1);
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
	});

	it('should not be able to update non-existing zombie', async () => {
		await expect(service.updateZombie(validZombieModel)).rejects.toThrow(
			ZombieNotFoundError
		);
		expect(zombieRepository.updateOne).toHaveBeenCalledTimes(0);
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
	});
});

describe('Should be able to get items of a zombie', () => {
	it('should be able to get items of a zombie', async () => {
		const items = [
			{ id: 1, name: 'test', price: 1 },
			{ id: 2, name: 'test2', price: 2 },
			{ id: 3, name: 'test3', price: 3 }
		];
		zombieRepository.getById.mockResolvedValueOnce(validZombieEntity);
		itemRepository.getAll.mockResolvedValueOnce(items);
		await expect(
			service.getZombieItemsById(validZombieModel.id)
		).resolves.toEqual([items[0], items[1]]);
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
		expect(itemRepository.getAll).toHaveBeenCalledTimes(1);
	});

	it('should not be able to get items of a non-existing zombie', async () => {
		await expect(
			service.getZombieItemsById(validZombieModel.id)
		).rejects.toThrow(ZombieNotFoundError);
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
		expect(itemRepository.getAll).toHaveBeenCalledTimes(0);
	});
});

describe('Should be able to get item totals of a zombie', () => {
	it('should be able to get item totals of a zombie', async () => {
		const items = [
			{ id: 1, name: 'test', price: 1 },
			{ id: 2, name: 'test2', price: 2 },
			{ id: 3, name: 'test3', price: 3 }
		];
		zombieRepository.getById.mockResolvedValueOnce(validZombieEntity);
		itemRepository.getAll.mockResolvedValueOnce(items);
		exchangeRepository.getExchangeByCode.mockImplementation(async (x) => {
			if (x === 'EUR') return 2;
			if (x === 'USD') return 3;
		});
		await expect(
			service.getZombieItemsTotalPrice(validZombieModel.id)
		).resolves.toEqual({
			pricePLN: 3,
			priceEUR: 3 / 2,
			priceUSD: 1,
			zombieId: validZombieModel.id
		});
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
		expect(itemRepository.getAll).toHaveBeenCalledTimes(1);
		expect(exchangeRepository.getExchangeByCode).toHaveBeenCalledTimes(2);
	});

	it('should not be able to get item totals of a non-existing zombie', async () => {
		await expect(
			service.getZombieItemsTotalPrice(validZombieModel.id)
		).rejects.toThrow(ZombieNotFoundError);
		expect(zombieRepository.getById).toHaveBeenCalledTimes(1);
		expect(itemRepository.getAll).toHaveBeenCalledTimes(0);
		expect(exchangeRepository.getExchangeByCode).toHaveBeenCalledTimes(0);
	});
});
