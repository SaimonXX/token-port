import type { User, UserProfileDTO } from '../../../domain/auth.domain.js';
import { IdentityMapper } from './identity.mapper.js';
import type { UserEntity } from './user.entity.js';

const UserMapper = {
	toDomain(entity: UserEntity): User {
		return {
			id: entity.id,
			name: entity.name,
			email: entity.email,
			photoUrl: entity.photoUrl,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			identities: entity.identities?.map(IdentityMapper.toDomain) ?? [],
		};
	},
	toUserProfileDTO(user: UserEntity): UserProfileDTO {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			photoUrl: user.photoUrl,
		};
	},
};

export { UserMapper };
