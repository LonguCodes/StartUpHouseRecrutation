import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { DateTime } from 'luxon';

export const handlers = [
	rest.get(
		'https://zombie-items-api.herokuapp.com/api/items',
		(req, res, ctx) => {
			return res(
				ctx.json({
					timestamp: DateTime.now().toMillis(),
					items: [
						{
							id: 1,
							name: 'Diamond Sword',
							price: 100
						},
						{
							id: 2,
							name: 'Trident',
							price: 200
						}
					]
				})
			);
		}
	)
];

export const server = setupServer(...handlers);
