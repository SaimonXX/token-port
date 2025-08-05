export type DomainErrorOptions = {
	cause?: Error;
	metadata?: Record<string, unknown>;
};

export class DomainError extends Error {
	public readonly code: string;
	public readonly metadata?: Record<string, unknown>;

	constructor(message: string, code: string, options?: DomainErrorOptions) {
		super(message, { cause: options?.cause });

		this.name = this.constructor.name;
		this.code = code;
		this.metadata = options?.metadata;

		Error.captureStackTrace(this, this.constructor);
	}
}
