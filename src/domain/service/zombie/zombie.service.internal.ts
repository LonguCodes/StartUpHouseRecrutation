import { ZombieService } from './zombie.service';
import { ZombieModel } from '../../model/zombie.model';
import { PriceTotalModel } from '../../model/priceTotal.model';
import { ItemModel } from '../../model/item.model';
import { Identifiable } from '../../../core/types';
import ZombieRepository from '../../../infrastructure/repository/zombie';
import { BindingLifetime, inject, injectable } from 'injectable-js';
import { GlobalContainer } from '../../../core/container/global';
import ItemRepository from '../../../infrastructure/repository/item';
import {
	ZombieNotFoundError,
	ZombieOverloadedError
} from './zombie.service.exceptions';
import { ItemNotFoundError } from '../item/item.service.exceptions';
import {
	ExchangeRepository,
	ExchangeRepositoryExternal
} from '../../../infrastructure/repository';

@injectable('ZombieServiceInternal', GlobalContainer, BindingLifetime.Transient)
export class ZombieServiceInternal implements ZombieService {
	constructor(
		@inject('ZombieRepositoryMongo', GlobalContainer)
		private zombieRepository: ZombieRepository,
		@inject('ItemRepositoryExternal', GlobalContainer)
		private itemRepository: ItemRepository,
		@inject('ExchangeRepositoryExternal', GlobalContainer)
		private exchangeRepository: ExchangeRepository
	) {}

	async addItemToZombie(zombieId: string, itemId: number): Promise<void> {
		const zombie = await this.zombieRepository.getById(zombieId);
		if (!zombie)
			throw new ZombieNotFoundError(`Zombie ${zombieId} not found`);
		if (zombie.items.length >= 3)
			throw new ZombieOverloadedError(
				`Zombie ${zombieId} would have too many items`
			);

		const existingItems = await this.itemRepository.getAll();

		if (!existingItems.map((x) => x.id).includes(itemId))
			throw new ItemNotFoundError(`Item ${itemId} not found`);

		zombie.items.push(itemId);
		await this.zombieRepository.updateOne(zombie);
	}

	async createZombie(
		zombie: Partial<Omit<ZombieModel, 'id'>>
	): Promise<ZombieModel> {
		const entity = await this.zombieRepository.createOne(zombie.toEntity());
		return ZombieModel.fromEntity(entity);
	}

	async deleteZombie(id: string): Promise<void> {
		const zombie = await this.zombieRepository.getById(id);
		if (!zombie) throw new ZombieNotFoundError(`Zombie ${id} not found`);
		await this.zombieRepository.deleteOne(id);
	}

	async getZombieById(id: string): Promise<ZombieModel> {
		const zombie = await this.zombieRepository.getById(id);
		if (!zombie) throw new ZombieNotFoundError(`Zombie ${id} not found`);
		return ZombieModel.fromEntity(zombie);
	}

	async getZombieItemsById(id: string): Promise<ItemModel[]> {
		const zombie = await this.zombieRepository.getById(id);
		if (!zombie) throw new ZombieNotFoundError(`Zombie ${id} not found`);
		const items = await this.itemRepository.getAll();
		return items
			.filter((item) => zombie.items.includes(item.id))
			.map((x) => ItemModel.fromEntity(x));
	}

	async getZombieItemsTotalPrice(id: string): Promise<PriceTotalModel> {
		const items = await this.getZombieItemsById(id);

		const priceTotal = new PriceTotalModel();
		priceTotal.zombieId = id;

		const exchanges = {
			PLN: 1,
			EUR: await this.exchangeRepository.getExchangeByCode('EUR'),
			USD: await this.exchangeRepository.getExchangeByCode('USD')
		};
		const totalPrice = items.reduce((a, b) => a + b.price, 0);
		const exchangePrices: typeof exchanges = Object.fromEntries(
			Object.entries(exchanges).map(([k, v]) => [k, totalPrice / v])
		) as typeof exchanges;

		return priceTotal.setPrices(exchangePrices);
	}

	async getZombies(): Promise<ZombieModel[]> {
		const results = await this.zombieRepository.getAll();
		return results.map((x) => ZombieModel.fromEntity(x));
	}

	async removeItemFromZombie(
		zombieId: string,
		itemId: number
	): Promise<void> {
		const zombie = await this.zombieRepository.getById(zombieId);
		if (!zombie)
			throw new ZombieNotFoundError(`Zombie ${zombieId} not found`);

		if (!zombie.items.includes(itemId))
			throw new ItemNotFoundError(`Zombie does not carry item ${itemId}`);

		zombie.items = zombie.items.filter((x) => itemId === x);
		await this.zombieRepository.updateOne(zombie);
	}

	async updateZombie(
		zombie: Identifiable<Partial<ZombieModel>>
	): Promise<void> {
		if (!(await this.zombieRepository.getById(zombie.id)))
			throw new ZombieNotFoundError(`Zombie ${zombie.id} not found`);
		await this.zombieRepository.updateOne(zombie.toEntity());
	}
}
