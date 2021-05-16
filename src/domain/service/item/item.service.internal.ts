import { ItemModel } from '../../model/item.model';

import { BindingLifetime, inject, injectable } from 'injectable-js';
import { GlobalContainer } from '../../../core/container/global';
import ItemRepository from '../../../infrastructure/repository/item';
import { ItemService } from './item.service';
import { ItemNotFoundError } from './item.service.exceptions';

@injectable('ItemServiceInternal', GlobalContainer, BindingLifetime.Transient)
export class ItemServiceInternal implements ItemService {
	constructor(
		@inject('ItemRepositoryExternal', GlobalContainer)
		private itemRepository: ItemRepository
	) {}

	async getItemById(id: number): Promise<ItemModel> {
		const result = await this.itemRepository.getById(id);
		if (!result) throw new ItemNotFoundError(`Item ${id} not found`);
		return ItemModel.fromEntity(result);
	}

	async getItems(): Promise<ItemModel[]> {
		const results = await this.itemRepository.getAll();
		return results.map((result) => ItemModel.fromEntity(result));
	}
}
