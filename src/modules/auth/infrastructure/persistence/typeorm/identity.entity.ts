import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
//

import type { Identity } from '@modules/auth/domain/auth.domain.js';
import { UserEntity } from '@modules/auth/infrastructure/persistence/typeorm/user.entity.js';

@Entity({ name: 'identities' })
export class IdentityEntity implements Identity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', length: 50 })
	provider!: string;

	@Column({ name: 'provider_key', type: 'varchar', unique: true })
	providerKey!: string;

	@Column({ type: 'varchar', nullable: true })
	password?: string;

	@ManyToOne(
		() => UserEntity,
		(user) => user.identities,
		{ onDelete: 'CASCADE' },
	)
	@JoinColumn({ name: 'user_id' })
	user?: UserEntity;
}
