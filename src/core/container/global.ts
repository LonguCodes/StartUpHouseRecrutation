import { DIContainer } from 'injectable-js';

export class GlobalContainer {
	static _container: DIContainer;

	static get get(): DIContainer {
		if (!this._container) this._container = new DIContainer();
		return this._container;
	}
}
