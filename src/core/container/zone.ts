import { AsyncLocalStorage } from 'async_hooks';
import { v4 } from 'uuid';
import { DIContainer } from 'injectable-js';

const storage = new AsyncLocalStorage<ZoneContainer>();

export function withZone(zoneBody: () => any) {
	const container = new ZoneContainer();
	return storage.run(container, zoneBody);
}

export class ZoneContainer {
	private id: string;
	private _container: DIContainer;

	constructor() {
		this._container = new DIContainer();
		this.id = v4();
	}

	static get get(): DIContainer {
		const container = storage.getStore() as ZoneContainer | undefined;
		if (!container) throw new Error('No zone found');
		return container._container;
	}
}
