import { ItemModel } from '../../model/item.model';

export interface ItemService {
	getItems(): Promise<ItemModel[]>;
	getItemById(id: number): Promise<ItemModel>;
}
