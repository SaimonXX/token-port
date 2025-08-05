import type {
	AuthRepository,
	ExternalUserProfile,
	UserProfileDTO,
} from '@modules/auth/domain/auth.domain.js';
import {
	EmailAlreadyLinkedError,
	UserCreationError,
} from '@modules/auth/domain/errors/auth.errors.js';

export class AuthenticateWithExternalProviderUseCase {
	private readonly authRepository: AuthRepository;

	constructor(authRepository: AuthRepository) {
		this.authRepository = authRepository;
	}

	/**
	 * Finds an existing user by teir external provider ID or creates a new user if one doesn't exist.
	 * @param profile - The generic user profile data from an external provider.
	 * @return The found or newly created user.
	 */
	public async execute(profile: ExternalUserProfile): Promise<UserProfileDTO> {
		const existingUser = await this.authRepository.findUserByIdentity({
			provider: profile.provider,
			providerKey: profile.providerId,
		});
		if (existingUser) {
			return existingUser;
		}

		const userByEmail = await this.authRepository.findUserByEmail(
			profile.email,
		);
		if (userByEmail) {
			throw new EmailAlreadyLinkedError(profile.email, profile.provider);
		}

		const newUser = await this.authRepository.createUserWithIdentity(
			{
				name: profile.name,
				email: profile.email,
				photoUrl: profile.photoUrl
			},
			{
				provider: profile.provider,
				providerKey: profile.providerId,
			},
		);

		if (!newUser) {
			throw new UserCreationError();
		}

		return newUser;
	}
}
