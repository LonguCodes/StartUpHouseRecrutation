import Koa from 'koa';
import joi from 'joi';
import { del, get, patch, post } from '../../../core/routes/decorators';
import { inject } from 'injectable-js';
import { ZombieService } from '../../../domain/service/zombie/zombie.service';
import { GlobalContainer } from '../../../core/container/global';
import { PriceTotalModel } from '../../../domain/model/priceTotal.model';
import { ItemModel } from '../../../domain/model/item.model';
import { ZombieModel } from '../../../domain/model/zombie.model';
import { DateTime } from 'luxon';
import { ItemService } from '../../../domain/service/item/item.service';

export class ItemResource {
	constructor(
		@inject('ItemServiceInternal', GlobalContainer)
		private itemService: ItemService
	) {}

	@get('/item/:id')
	fetchItemById(ctx: Koa.Context): Promise<ItemModel> {
		const { id } = ctx.params;
		return this.itemService.getItemById(id);
	}

	@get('/item')
	fetchItems(): Promise<ItemModel[]> {
		return this.itemService.getItems();
	}
}
