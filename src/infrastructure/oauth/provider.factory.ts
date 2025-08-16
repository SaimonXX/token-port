import { env } from '@config/env.js';
import { GoogleOAuthProvider } from '@infrastructure/oauth/google.provider.js';
import type { OAuthProvider, ProviderFactory, ProviderMap } from '@modules/shared/domain/oauth.domain.js';



export class OAuthProviderFactory implements ProviderFactory {
	private readonly providers: ProviderMap = {};

	constructor() {
		if (env.GOOGLE_CLIENT_ID) {
			this.providers.google = new GoogleOAuthProvider();
		}
		// if (env.X_CLIENT_ID) {
		//   this.providers.x = new XOAuthProvider()
		// }
	}

	public getProvider(providerName: keyof ProviderMap): OAuthProvider {
		const provider = this.providers[providerName];
		if (!provider) {
			throw new Error(
				`Provider ${providerName} is not configured or supported.`,
			);
		}
		return provider;
	}
}
