import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
//

import type { User } from '@modules/auth/domain/auth.domain.js';
import { IdentityEntity } from '@modules/auth/infrastructure/persistence/typeorm/identity.entity.js';

@Entity({ name: 'users' })
export class UserEntity implements User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', length: 100 })
	name!: string;

	@Column({ type: 'varchar', unique: true })
	email!: string;

	@Column({ name: 'photo_url', type: 'varchar', nullable: true })
	photoUrl?: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date;

	@OneToMany(
		() => IdentityEntity,
		(identity) => identity.user,
	)
	identities?: IdentityEntity[];
}