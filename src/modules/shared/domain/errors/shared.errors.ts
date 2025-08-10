import {
	DomainError,
	type DomainErrorOptions,
} from '@modules/shared/domain/errors/DomainError.js';

export class AppError extends DomainError {
	constructor(message: string, options?: DomainErrorOptions) {
		super(message, 'APP_ERROR', options);
	}
}
