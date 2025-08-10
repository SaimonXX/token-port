import type {
	AuthTokens,
	TokenService,
	UserProfileDTO,
} from '@modules/auth/domain/auth.domain.js';

export class GenerateTokensUseCase {
	constructor(private readonly tokenService: TokenService) {}

	/**
	 * Executes the token generation logic for a given user.
	 * @param user - The user for whom to generate tokens.
	 * @returns A promise that resolves to an AuthTokens object.
	 */
	public async execute(user: UserProfileDTO): Promise<AuthTokens> {
		return await this.tokenService.generateAuthTokens(user);
	}
}
