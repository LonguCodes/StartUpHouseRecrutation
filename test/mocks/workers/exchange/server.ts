import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { DateTime } from 'luxon';

export const handlers = [
	rest.get(
		'http://api.nbp.pl/api/exchangerates/rates/C/USD/',
		(req, res, ctx) => {
			return res(
				ctx.json({
					table: 'C',
					currency: 'dolar amerykański',
					code: 'USD',
					rates: [
						{
							no: '092/C/NBP/2021',
							effectiveDate: DateTime.now().toISODate(),
							bid: 3.5,
							ask: 3.75
						}
					]
				})
			);
		}
	),
	rest.get(
		'http://api.nbp.pl/api/exchangerates/rates/C/EUR/',
		(req, res, ctx) => {
			return res(
				ctx.json({
					table: 'C',
					currency: 'euro',
					code: 'EUR',
					rates: [
						{
							no: '092/C/NBP/2021',
							effectiveDate: DateTime.now().toISODate(),
							bid: 4.4,
							ask: 4.6
						}
					]
				})
			);
		}
	)
];

export const server = setupServer(...handlers);
