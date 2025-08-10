import type { DataSource, Repository } from 'typeorm';
//

import type {
	AuthRepository,
	CreateIdentityInput,
	CreateUserInput,
	FindIdentityInput,
	UserProfileDTO,
} from '@modules/auth/domain/auth.domain.js';
import { IdentityEntity } from '@modules/auth/infrastructure/persistence/typeorm/identity.entity.js';
import { UserEntity } from '@modules/auth/infrastructure/persistence/typeorm/user.entity.js';
import { UserMapper } from '@modules/auth/infrastructure/persistence/typeorm/user.mapper.js';

// import { winstonLogger } from '@modules/shared/infrastructure/logger/winston.logger.js';

class PostgresAuthRepository implements AuthRepository {
	private readonly dataSource: DataSource;
	private readonly userRepository: Repository<UserEntity>;
	private readonly identityRepository: Repository<IdentityEntity>;

	constructor(dataSource: DataSource) {
		this.dataSource = dataSource;
		this.userRepository = dataSource.getRepository(UserEntity);
		this.identityRepository = dataSource.getRepository(IdentityEntity);
	}

	public async findUserByIdentity(
		input: FindIdentityInput,
	): Promise<UserProfileDTO | null> {
		const { provider, providerKey } = input;
		const userIdentity = await this.identityRepository.findOne({
			where: { provider, providerKey },
			relations: { user: true },
		});
		if (!userIdentity?.user) {
			return null;
		}
		return UserMapper.toUserProfileDTO(userIdentity.user);
	}

	public async findUserByEmail(email: string): Promise<UserProfileDTO | null> {
		const user = await this.userRepository.findOne({
			where: { email },
			relations: { identities: true },
		});
		if (!user) {
			return null;
		}
		return UserMapper.toUserProfileDTO(user);
	}

	public async findUserById(id: string): Promise<UserProfileDTO | null> {
		const user = await this.userRepository.findOne({
			where: { id },
		});
		if (!user) {
			return null;
		}
		return UserMapper.toUserProfileDTO(user);
	}

	public async createUserWithIdentity(
		userData: CreateUserInput,
		identityData: CreateIdentityInput,
	): Promise<UserProfileDTO> {
		const user = await this.dataSource.transaction(
			async (transactionEntityManager) => {
				const newUser = transactionEntityManager.create(UserEntity, userData);
				await transactionEntityManager.save(newUser);

				const newIdentity = transactionEntityManager.create(IdentityEntity, {
					...identityData,
					user: newUser,
				});
				await transactionEntityManager.save(newIdentity);

				return newUser;
			},
		);
		return UserMapper.toUserProfileDTO(user);
	}
}

export { PostgresAuthRepository };
