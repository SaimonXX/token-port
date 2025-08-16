import type { ExternalUserProfile } from '@modules/auth/domain/auth.domain.js';

export interface OAuthProvider {
	exchangeCodeForProfile: (
		input: ExchangeCodeDataInput,
	) => Promise<ExternalUserProfile>;
}
export type ExchangeCodeDataInput = {
	authorizationCode: string;
	redirectUri: string;
	codeVerifier: string;
};

export type Providers = 'google';
export type ProviderMap = {
	[key in Providers]?: OAuthProvider;
};

export interface ProviderFactory {
	getProvider(providerName: keyof ProviderMap): OAuthProvider;
}
