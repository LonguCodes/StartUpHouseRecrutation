export interface ExchangeRepository {
	getExchangeByCode(code: 'EUR' | 'USD'): Promise<number>;
}
