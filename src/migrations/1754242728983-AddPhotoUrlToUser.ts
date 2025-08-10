import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhotoUrlToUser1754242728983 implements MigrationInterface {
	name = 'AddPhotoUrlToUser1754242728983';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ADD "photo_url" character varying`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "photo_url"`);
	}
}
