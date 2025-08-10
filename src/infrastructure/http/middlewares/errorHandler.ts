import type { Request, Response, NextFunction } from 'express';
//

import { env } from '@config/env.js';
import { HttpError } from '@infrastructure/http/errors/HttpError.js';
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
		}

		logger.error({ message: 'Unexpected Error', error: err });

		// In a production environment, send a generic message to avoid leaking details.
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
