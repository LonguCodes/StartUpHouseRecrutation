import { ItemRepository } from './item.repository';
import { DatasourceBindings } from '../../datasource';
import { BindingLifetime, inject, injectable } from 'injectable-js';
import { GlobalContainer } from '../../../core/container/global';
import { AxiosInstance } from 'axios';
import { ItemEntity } from '../../entity';
import { DateTime } from 'luxon';
import { CacheBindings } from '../../datasource/cache/bindings';
import { CacheManager } from '../../datasource/cache/cacheManager';
import { cache } from '../../datasource/cache/decorators';

function getTimeTillEndOnDay() {
	return Math.round(
		DateTime.now()
			.toUTC()
			.endOf('day')
			.diff(DateTime.now().toUTC())
			.as('seconds')
	);
}

function getItemKey(itemId: number) {
	return `items:${itemId}`;
}

@injectable(
	'ItemRepositoryExternal',
	GlobalContainer,
	BindingLifetime.Transient
)
export class ItemRepositoryExternal implements ItemRepository {
	constructor(
		@inject.fromBindingKey(DatasourceBindings.Axios)
		private axios: AxiosInstance,
		@inject.fromBindingKey(CacheBindings.Manager)
		private cache: CacheManager
	) {}

	@cache(() => CacheBindings.Manager.value, {
		key: () => 'items',
		ttl: getTimeTillEndOnDay
	})
	async getAll(): Promise<ItemEntity[]> {

		const result = await this.axios.get(
			'https://zombie-items-api.herokuapp.com/api/items'
		);

		const items = result.data.items as ItemEntity[];
		await Promise.all(
			items.map((x) =>
				this.cache.set(getItemKey(x.id), x, getTimeTillEndOnDay())
			)
		);
		return items;
	}

	@cache(() => CacheBindings.Manager.value, {
		key: getItemKey,
		ttl: getTimeTillEndOnDay
	})
	async getById(id: number): Promise<ItemEntity> {
		const result = await this.axios.get(
			'https://zombie-items-api.herokuapp.com/api/items'
		);
		return result.data.items.find((x) => x.id === id) as ItemEntity;
	}
}
