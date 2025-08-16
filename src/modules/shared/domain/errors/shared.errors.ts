import {
	DomainError,
	type DomainErrorOptions,
} from '@modules/shared/domain/errors/DomainError.js';

export class AppError extends DomainError {
	constructor(message: string, options?: DomainErrorOptions) {
		super(message, 'APP_ERROR', options);
	}
}

export class ExternalServiceError extends DomainError {
	constructor(message: string, options?: DomainErrorOptions) {
		super(message, 'EXTERNAL_SERVICE_ERROR', options);
	}
}

export class UnauthorizedError extends DomainError {
	constructor(message: string, options?: DomainErrorOptions) {
		super(message, 'UNAUTHORIZED_ERROR', options);
	}
}
