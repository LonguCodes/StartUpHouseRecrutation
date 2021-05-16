import { ZombieModel } from '../../model/zombie.model';
import { ItemModel } from '../../model/item.model';
import { PriceTotalModel } from '../../model/priceTotal.model';
import { Identifiable } from '../../../core/types';

export interface ZombieService {
	getZombies(): Promise<ZombieModel[]>;
	getZombieById(id: string): Promise<ZombieModel>;
	getZombieItemsById(id: string): Promise<ItemModel[]>;
	getZombieItemsTotalPrice(id: string): Promise<PriceTotalModel>;
	createZombie(
		zombie: Partial<Omit<Omit<ZombieModel, 'create_date'>, 'id'>>
	): Promise<ZombieModel>;
	updateZombie(zombie: Identifiable<Partial<ZombieModel>>): Promise<void>;
	deleteZombie(id: string): Promise<void>;
	addItemToZombie(zombieId: string, itemId: number): Promise<void>;
	removeItemFromZombie(zombieId: string, itemId: number): Promise<void>;
}
