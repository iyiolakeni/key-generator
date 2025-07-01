import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751364759257 implements MigrationInterface {
    name = 'Migration1751364759257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."application_environment_enum" AS ENUM('DEVELOPMENT', 'PRODUCTION', 'STAGING')`);
        await queryRunner.query(`ALTER TABLE "application" ADD "environment" "public"."application_environment_enum" NOT NULL DEFAULT 'DEVELOPMENT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "environment"`);
        await queryRunner.query(`DROP TYPE "public"."application_environment_enum"`);
    }

}
