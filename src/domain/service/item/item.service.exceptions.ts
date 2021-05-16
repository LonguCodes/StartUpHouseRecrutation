import { HttpError, HttpErrors, SudoHttpError } from '../../../core/errors';
import { Constructor } from 'injectable-js';

export class ItemNotFoundError extends SudoHttpError {
	get httpErrorClass(): Constructor<HttpError> {
		return HttpErrors.NotFound;
	}
}
