import { Constructor } from 'injectable-js';

export abstract class SudoHttpError extends Error {
	constructor(private _message?: string) {
		super();
	}
	abstract get httpErrorClass(): Constructor<HttpError>;

	get httpError(): HttpError {
		return new this.httpErrorClass(this._message);
	}
}

export abstract class HttpError extends Error {
	constructor(private _message?: string) {
		super();
	}

	abstract get code(): number;

	get message(): string {
		return this._message ?? Object.getPrototypeOf(this).constructor.name;
	}
}

export namespace HttpErrors {
	export class InternalError extends HttpError {
		get code() {
			return 500;
		}
	}

	export class BadRequest extends HttpError {
		get code() {
			return 400;
		}
	}

	export class Unauthorized extends HttpError {
		get code() {
			return 401;
		}
	}

	export class Forbidden extends HttpError {
		get code() {
			return 403;
		}
	}

	export class NotFound extends HttpError {
		get code() {
			return 404;
		}
	}
}
