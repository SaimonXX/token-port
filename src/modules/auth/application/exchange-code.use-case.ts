import type { AuthenticateWithExternalProviderUseCase } from '@modules/auth/application/authenticate-with-external-provider.use-case.js';
import type { TokenExchangeInput } from '@modules/auth/domain/auth.domain.js';
import type { ProviderFactory } from '@modules/shared/domain/oauth.domain.js';

export class ExchangeCodeUseCase {
	constructor(
		private readonly providerFactory: ProviderFactory,
		private readonly authenticateUseCase: AuthenticateWithExternalProviderUseCase,
	) {}

	/**
	 * Exchanges an authorization code from an external provider for a user profile,
	 * then finds or creates the corresponding user in the local database.
	 * This orchestrates the final step of the PKCE authentication flow.
	 * @param input - The DTO containing the authorizationCode, provider, and other necessary data.
	 * @returns A promise that resolves to the authenticated User object.
	 * @throws {DomainError} If the provider is not supported, the code is invalid, or the user cannot be processed.
	 */
	public async execute(input: TokenExchangeInput) {
		const { authorizationCode, codeVerifier, redirectUri } = input;

		const provider = this.providerFactory.getProvider(input.provider);

		const externalUserProfile = await provider.exchangeCodeForProfile({
			authorizationCode,
			codeVerifier,
			redirectUri,
		});

		const userProfile =
			await this.authenticateUseCase.execute(externalUserProfile);

		return userProfile;
	}
}
