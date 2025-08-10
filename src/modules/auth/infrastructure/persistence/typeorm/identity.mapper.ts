import type { Identity } from '../../../domain/auth.domain.js';
import type { IdentityEntity } from './identity.entity.js';

const IdentityMapper = {
	toDomain(entity: IdentityEntity): Identity {
		const identity: Identity = {
			id: entity.id,
			provider: entity.provider,
			providerKey: entity.providerKey,
			user: entity.user,
		};

		if (entity.password) {
			identity.password = entity.password;
		}

		return identity;
	},
};

export { IdentityMapper };
