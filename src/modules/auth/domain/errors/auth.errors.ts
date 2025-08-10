import {
	DomainError,
	type DomainErrorOptions,
} from '@modules/shared/domain/errors/DomainError.js';

export class ExternalProfileInvalidEmailError extends DomainError {
	constructor(provider: string, options?: DomainErrorOptions) {
		super(
			`The profile from ${provider} must have a verified email.`,
			'EXTERNAL_PROFILE_INVALID_EMAIL',
			options,
		);
	}
}

export class EmailAlreadyLinkedError extends DomainError {
	constructor(email: string, provider: string, options?: DomainErrorOptions) {
		super(
			`The email ${email} is already associated with a different authentication method.`,
			'EMAIL_ALREADY_LINKED',
			{
				...options,
				metadata: {
					email,
					provider,
					...options?.metadata,
				},
			},
		);
	}
}

export class UserCreationError extends DomainError {
	constructor(options?: DomainErrorOptions) {
		super('Failed to create user.', 'USER_CREATION_FAILED', options);
	}
}
