import { ExchangeRepository } from './exchange.repository';
import { DatasourceBindings } from '../../datasource';
import { AxiosInstance } from 'axios';
import { BindingLifetime, inject, injectable } from 'injectable-js';
import { GlobalContainer } from '../../../core/container/global';

@injectable(
	'ExchangeRepositoryExternal',
	GlobalContainer,
	BindingLifetime.Transient
)
export class ExchangeRepositoryExternal implements ExchangeRepository {
	constructor(
		@inject.fromBindingKey(DatasourceBindings.Axios)
		private axios: AxiosInstance
	) {}

	async getExchangeByCode(code: 'EUR' | 'USD') {
		const result = await this.axios.get(
			`http://api.nbp.pl/api/exchangerates/rates/C/${code}/`
		);
		const rate = result.data.rates[0];
		return rate.bid;
	}
}
