import { HttpError } from '@infrastructure/http/errors/HttpError.js';

export class HttpNotFoundError extends HttpError {
	constructor(message: string = 'Not Found') {
		super(message, 404);
	}
}
export class HttpBadRequestError extends HttpError {
	constructor(message: string = 'Bad Request') {
		super(message, 400);
	}
}
export class HttpUnauthorizedError extends HttpError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401);
	}
}
