import Express from 'express';
//

import { routes } from '@config/routes.config.js';
import type { DefaultAuthController } from '@modules/auth/infrastructure/http/auth.controller.js';

const createAuthRouter = (authController: DefaultAuthController) => {
	const router = Express.Router();
	const endpoints = routes.auth.endpoints;

	router.post(
		`/${endpoints.tokenExchange.path}`,
		authController.exchangeCode
	)
	return router;
};

export { createAuthRouter };
