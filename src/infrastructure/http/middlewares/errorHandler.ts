import type { NextFunction, Request, Response } from 'express';
//

import { env } from '@config/env.js';
import { HttpError } from '@infrastructure/http/errors/HttpError.js';
import { DomainError } from '@modules/shared/domain/errors/DomainError.js';
import type { Logger } from '@modules/shared/domain/logger.domain.js';

export const createErrorHandler =
	(logger: Logger) =>
	(err: Error, _req: Request, res: Response, _next: NextFunction): void => {
		// Handles known, operational errors.
		if (err instanceof HttpError && err.isOperational) {
			logger.warn({ message: 'Operational Error', error: err });
			res.status(err.statusCode).json({
				status: 'error',
				message: err.message,
			});
			return;
		} else if (err instanceof DomainError) {
			logger.error({
				message: err.message,
				error: err,
				metadata: err.metadata,
			});
			res.status(500).json({
				status: 'error',
				message: 'An internal server error occurred.',
			});
			return;
		}

		logger.error({ message: 'Unexpected Error', error: err });

		if (env.NODE_ENV === 'production') {
			res.status(500).json({
				status: 'error',
				message: 'An unexpected server error occurred.',
			});
			return;
		}

		// In a development environment, send the full error for easier debugging.
		res.status(500).json({
			status: 'error',
			message: err.message,
			stack: err.stack,
		});
	};
