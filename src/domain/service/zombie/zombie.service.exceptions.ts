import { HttpError, HttpErrors, SudoHttpError } from '../../../core/errors';
import { Constructor } from 'injectable-js';

export class ZombieNotFoundError extends SudoHttpError {
	get httpErrorClass(): Constructor<HttpError> {
		return HttpErrors.NotFound;
	}
}

export class ZombieOverloadedError extends SudoHttpError {
	get httpErrorClass(): Constructor<HttpError> {
		return HttpErrors.BadRequest;
	}
}