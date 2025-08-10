import Express from 'express';
import passport from 'passport';
//

import { routes } from '@config/routes.config.js';
import type { DefaultAuthController } from '@modules/auth/infrastructure/http/auth.controller.js';

const createAuthRouter = (authController: DefaultAuthController) => {
	const router = Express.Router();
	const endpoints = routes.auth.endpoints;

	// --- Local Authentication (Email/Password) ---
	// router.post('/login', authController.login);
	// router.post('/register', authController.register);

	// --- Google OAuth ---
	router.get(
		`/${endpoints.google.path}`,
		(req, res, next) => {
			const state = req.query.state as string | undefined

			const authenticator = passport.authenticate('google', {
				scope: ['profile', 'email'],
				session: false,
				state
			})

			authenticator(req, res, next)
		}
	);
	router.get(
		`/${endpoints.googleCallback.path}`,
		passport.authenticate('google', {
			failureRedirect: '/login-failed',
			session: false,
		}),
		authController.externalProviderCallback,
	);

	// --- GitHub OAuth ---
	router.get(
		`/${endpoints.github.path}`,
		passport.authenticate('github', { scope: ['user:email'], session: false }),
	);
	router.get(
		`/${endpoints.githubCallback.path}`,
		passport.authenticate('github', {
			failureRedirect: '/login-failed',
			session: false,
		}),
		authController.externalProviderCallback,
	);

	// --- Ruta de fallo ---
	// router.get('/login-failed', authController.loginFailed);

	return router;
};

export { createAuthRouter };
