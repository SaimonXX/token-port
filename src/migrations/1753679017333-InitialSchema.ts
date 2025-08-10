import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1753679017333 implements MigrationInterface {
	name = 'InitialSchema1753679017333';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "identities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" character varying(50) NOT NULL, "provider_key" character varying NOT NULL, "password" character varying, "user_id" uuid, CONSTRAINT "UQ_fc5c1139276bc3e553867d8a89d" UNIQUE ("provider_key"), CONSTRAINT "PK_7b2f8cccf4ac6a2d7e6e9e8b1f6" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "identities" ADD CONSTRAINT "FK_88e77c008cfcfa6a87027a99bde" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "identities" DROP CONSTRAINT "FK_88e77c008cfcfa6a87027a99bde"`,
		);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TABLE "identities"`);
	}
}
