import { env } from '@config/env.js';
import type { ExternalUserProfile } from '@modules/auth/domain/auth.domain.js';
import {
	ExternalServiceError,
	UnauthorizedError,
} from '@modules/shared/domain/errors/shared.errors.js';
import type {
	ExchangeCodeDataInput,
	OAuthProvider,
} from '@modules/shared/domain/oauth.domain.js';
import { winstonLogger } from '@modules/shared/infrastructure/logger/winston.logger.js';

export class GoogleOAuthProvider implements OAuthProvider {
	private readonly tokenEndpoint = 'https://oauth2.googleapis.com/token';
	private readonly userinfoEndpoint =
		'https://www.googleapis.com/oauth2/v3/userinfo';

	public async exchangeCodeForProfile(
		input: ExchangeCodeDataInput,
	): Promise<ExternalUserProfile> {
		const { authorizationCode, codeVerifier, redirectUri } = input;

		if (!env.ALLOWED_REDIRECT_URIS.includes(redirectUri)) {
			throw new UnauthorizedError('Unauthorized redirectUri', {
				metadata: {
					reason: 'Provided (redirectUri) is not authorized, possible attack',
				},
			});
		}

		try {
			const tokenResponse = await fetch(this.tokenEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					code: authorizationCode,
					client_id: env.GOOGLE_CLIENT_ID,
					client_secret: env.GOOGLE_CLIENT_SECRET,
					redirect_uri: redirectUri,
					code_verifier: codeVerifier,
					grant_type: 'authorization_code',
				}),
			});

			if (!tokenResponse.ok) {
				const errorBody = await tokenResponse.json()
				throw new Error(errorBody.error_description || 'Failed to exchange code for token');
			}
			const tokens = await tokenResponse.json();
			winstonLogger.debug({
				message: 'Fetch to Google result',
				metadata: {
					tokens,
				},
			});

			const profileResponse = await fetch(this.userinfoEndpoint, {
				headers: { Authorization: `Bearer ${tokens.access_token}` },
			});

			if (!profileResponse.ok) {
				throw new Error('Failed to fetch user profile');
			}
			const profile = await profileResponse.json();
			winstonLogger.debug({
				message: 'Fetch 2 to Google for the profile result',
				metadata: {
					profile,
				},
			});

			return {
				provider: 'google',
				providerId: profile.sub,
				email: profile.email,
				name: profile.name,
				photoUrl: profile.picture ?? undefined,
			};
		} catch (err) {
			const error = err as Error;
			throw new ExternalServiceError('Google', {
				cause: error,
				metadata: { message: error.message },
			});
		}
	}
}
