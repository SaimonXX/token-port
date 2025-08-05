// --- Behavioral Contracts ---
export interface AuthService {
	findUserById: (id: string) => Promise<User | null>;
}

export interface AuthRepository {
	findUserByEmail(email: string): Promise<UserProfileDTO | null>;
	findUserByIdentity(input: FindIdentityInput): Promise<UserProfileDTO | null>;
	findUserById(id: string): Promise<UserProfileDTO | null>;
	createUserWithIdentity(
		userData: CreateUserInput,
		identityData: CreateIdentityInput,
	): Promise<UserProfileDTO>;
}

export interface TokenService {
	generateAuthTokens(user: UserProfileDTO): Promise<AuthTokens>;
}

// --- Data Shapes
export type Identity = {
	id: string;
	provider: string;
	providerKey: string;
	password?: string;
	user?: User;
};

export type User = {
	id: string;
	name: string;
	email: string;
	photoUrl?: string;
	createdAt: Date;
	updatedAt: Date;
	identities?: Identity[];
};

export type ExternalUserProfile = {
	provider: string;
	providerId: string;
	email: string;
	name: string;
	photoUrl?: string;
};

export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
};

// --- Input Types
export type CreateIdentityInput = Pick<Identity, 'provider' | 'providerKey'>;
export type CreateUserInput = Pick<User, 'name' | 'email' | 'photoUrl'>;

export type FindIdentityInput = Pick<Identity, 'provider' | 'providerKey'>;

// --- Output Types

// --- DTO Types
export type UserProfileDTO = Pick<User, 'id' | 'name' | 'email' | 'photoUrl'>;
