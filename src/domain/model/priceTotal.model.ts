import { DateTime } from 'luxon';
import { ZombieEntity } from '../../infrastructure/entity/zombie.entity';
import { ItemEntity } from '../../infrastructure/entity';
import { Model } from '../../core/types';

export class PriceTotalModel implements Model {
	zombieId: string;
	pricePLN: number;
	priceEUR: number;
	priceUSD: number;

	setPrices(data: {
		PLN: number;
		EUR: number;
		USD: number;
	}): PriceTotalModel {
		this.pricePLN = data.PLN;
		this.priceEUR = data.EUR;
		this.priceUSD = data.USD;
		return this;
	}
}
