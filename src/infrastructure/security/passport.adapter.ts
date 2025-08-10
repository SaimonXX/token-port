import passport from 'passport';
import { Strategy as GitHubStrategy, type Profile } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { VerifyCallback } from 'passport-oauth2';
//

import { env } from '@config/env.js';
import { routes } from '@config/routes.config.js';
import type { AuthenticateWithExternalProviderUseCase } from '@modules/auth/application/authenticate-with-external-provider.use-case.js';
import type { ExternalUserProfile } from '@modules/auth/domain/auth.domain.js';
import { ExternalProfileInvalidEmailError } from '@modules/auth/domain/errors/auth.errors.js';
// import { AppError } from '@modules/shared/domain/errors/shared.errors.js';
import { winstonLogger } from '@modules/shared/infrastructure/logger/winston.logger.js';

const configurePassport = (
	authenticateWithExternalProviderUseCase: AuthenticateWithExternalProviderUseCase,
): void => {
	// --- GOOGLE ---
	passport.use(
		'google',
		new GoogleStrategy(
			{
				clientID: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
				callbackURL: `${env.BACKEND_URL}${routes.auth.endpoints.googleCallback.fullPath}`,
			},
			async (_accessToken, _refreshToken, profile, done) => {
				try {
					const email = profile.emails?.[0];

					if (!email || !email.verified) {
						throw new ExternalProfileInvalidEmailError('Google');
					}

					const externalUserProfile: ExternalUserProfile = {
						provider: 'google',
						providerId: profile.id,
						email: email.value,
						name: profile.displayName,
						photoUrl: profile.photos?.[0].value,
					};

					const user =
						await authenticateWithExternalProviderUseCase.execute(
							externalUserProfile,
						);
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			},
		),
	);

	// --- GITHUB ---
	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
				callbackURL: `${env.BACKEND_URL}${routes.auth.endpoints.githubCallback.fullPath}`,
			},
			async (
				accessToken: string,
				_refreshToken: string,
				profile: Profile,
				done: VerifyCallback,
			) => {
				try {
					const verifiedEmail = await getVerifiedGitHubEmail(accessToken);

					const externalUserProfile: ExternalUserProfile = {
						provider: 'github',
						providerId: profile.id,
						email: verifiedEmail.email,
						name: profile.displayName ?? profile.username,
						photoUrl: profile.photos?.[0].value,
					};

					winstonLogger.debug({
						message: 'Data del perfil de github',
						metadata: {
							externalUserProfile,
							// verifiedEmail,
							profile,
						},
					});

					const user =
						await authenticateWithExternalProviderUseCase.execute(
							externalUserProfile,
						);
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			},
		),
	);
};

interface GitHubEmail {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: 'public' | 'private' | null;
}

const getVerifiedGitHubEmail = async (accessToken: string) => {
	const response = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error();
	}
	const emails = (await response.json()) as GitHubEmail[];

	const verifiedEmail = emails.find((email) => email.primary && email.verified);

	if (!verifiedEmail?.email) {
		throw new ExternalProfileInvalidEmailError('GitHub');
	}

	return verifiedEmail;
};

export { configurePassport };
