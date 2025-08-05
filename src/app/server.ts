import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
//

import { AppDataSource } from '@config/data-source.js';
import { env } from '@config/env.js';
import { routes } from '@config/routes.config.js';
import { createErrorHandler } from '@infrastructure/http/middlewares/errorHandler.js';
import { configurePassport } from '@infrastructure/security/passport.adapter.js';
//

import { AuthenticateWithExternalProviderUseCase } from '@modules/auth/application/authenticate-with-external-provider.use-case.js';
import { DefaultAuthController } from '@modules/auth/infrastructure/http/auth.controller.js';
import { createAuthRouter } from '@modules/auth/infrastructure/http/auth.routes.js';
import { PostgresAuthRepository } from '@modules/auth/infrastructure/persistence/typeorm/auth.postgres.repository.js';
//

import { JwtTokenService } from '@infrastructure/security/jwt.token.service.js';
import { GenerateTokensUseCase } from '@modules/auth/application/generate-tokens.use-case.js';
import { winstonLogger } from '@modules/shared/infrastructure/logger/winston.logger.js';

const bootstrap = async (): Promise<void> => {
	try {
		await AppDataSource.initialize();

		const app = express();
		const errorHandler = createErrorHandler(winstonLogger);

		app.disable('x-powered-by');
		app.use(cors());
		app.use(express.json());
		app.use(cookieParser());
		app.use(errorHandler);

		const postgresAuthRepository = new PostgresAuthRepository(AppDataSource);
		const jwtTokenService = new JwtTokenService();

		// UseCases
		const authenticateWithExternalProviderUseCase =
			new AuthenticateWithExternalProviderUseCase(postgresAuthRepository);
		const generateTokensUseCase = new GenerateTokensUseCase(jwtTokenService);

		// Controllers
		const authController = new DefaultAuthController(generateTokensUseCase);

		configurePassport(authenticateWithExternalProviderUseCase);
		app.use(passport.initialize());

		// ROUTES
		const authRouter = createAuthRouter(authController);
		app.use(routes.auth.fullPath, authRouter);

		app.use(errorHandler);

		// --- RUN ---
		const server = app.listen(env.PORT, () => {
			const address = server.address();
			if (address && typeof address === 'object') {
				winstonLogger.info({
					message: `Server running on port http://localhost:${address.port}`,
				});
			} else {
				winstonLogger.info({
					message: `Server is runnig`,
				});
			}
		});
	} catch (error) {
		if (error instanceof Error) {
			winstonLogger.error({
				message: 'Error during application bootstrap',
				error,
			});
		} else {
			winstonLogger.error({
				message: 'An unknown Error occurred during application bootstrap',
				metadata: { error },
			});
		}
		process.exit(1);
	}
};

bootstrap();
