import Koa from 'koa';
import joi from 'joi';
import { del, get, patch, post } from '../../../core/routes/decorators';
import { inject } from 'injectable-js';
import { ZombieService } from '../../../domain/service/zombie/zombie.service';
import { GlobalContainer } from '../../../core/container/global';
import { PriceTotalModel } from '../../../domain/model/priceTotal.model';
import { ItemModel } from '../../../domain/model/item.model';
import { ZombieModel } from '../../../domain/model/zombie.model';
import { HttpErrors } from '../../../core/errors';

export class ZombieResource {
	constructor(
		@inject('ZombieServiceInternal', GlobalContainer)
		private zombieService: ZombieService
	) {}

	@get('/zombie/:id')
	fetchZombieById(ctx: Koa.Context): Promise<ZombieModel> {
		const { id } = ctx.params;
		return this.zombieService.getZombieById(id);
	}

	@get('/zombie')
	fetchZombies(): Promise<ZombieModel[]> {
		return this.zombieService.getZombies();
	}
	@get('/zombie/:id/items')
	fetchZombieItem(ctx: Koa.Context): Promise<ItemModel[]> {
		const { id } = ctx.params;

		return this.zombieService.getZombieItemsById(id);
	}

	@get('/zombie/:id/items/total')
	fetchZombieTotalItemsPrice(ctx: Koa.Context): Promise<PriceTotalModel> {
		const { id } = ctx.params;
		return this.zombieService.getZombieItemsTotalPrice(id);
	}

	@post('/zombie/:zombieId/items/:itemId')
	addItemToZombie(ctx: Koa.Context): Promise<void> {
		const { zombieId, itemId } = ctx.params;
		return this.zombieService.addItemToZombie(zombieId, Number(itemId));
	}

	@del('/zombie/:zombieId/items/:itemId')
	removeItemFromZombie(ctx: Koa.Context): Promise<void> {
		const { zombieId, itemId } = ctx.params;
		return this.zombieService.removeItemFromZombie(zombieId, itemId);
	}

	@post('/zombie')
	addZombie(ctx: Koa.Context): Promise<ZombieModel> {
		const { value: zombie, error } = joi
			.object({
				name: joi.string().required()
			})
			.validate(ctx.request.body, { allowUnknown: false });
		if (error) throw new HttpErrors.BadRequest(error.message);
		return this.zombieService.createZombie(ZombieModel.fromData(zombie));
	}

	@patch('/zombie/:id')
	changeZombie(ctx: Koa.Context): Promise<void> {
		const { id } = ctx.params;
		const { value: zombie, error } = joi
			.object({
				name: joi.string().required()
			})
			.validate(ctx.request.body, { allowUnknown: false });
		if (error) throw new HttpErrors.BadRequest(error.message);
		return this.zombieService.updateZombie(
			ZombieModel.fromData({ ...zombie, id })
		);
	}

	@del('/zombie/:id')
	removeZombie(ctx: Koa.Context): Promise<void> {
		const { id } = ctx.params;
		return this.zombieService.deleteZombie(id);
	}
}
