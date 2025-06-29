import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751197826870 implements MigrationInterface {
    name = 'Migration1751197826870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."key_type_enum" AS ENUM('api_key', 'jwt_secret', 'encryption_key', 'random_token', 'uuid', 'custom')`);
        await queryRunner.query(`CREATE TABLE "key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."key_type_enum" NOT NULL, "value" text NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "expiresAt" TIMESTAMP, "metadata" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "applicationId" uuid NOT NULL, CONSTRAINT "PK_5bd67cf28791e02bf07b0367ace" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "key" ADD CONSTRAINT "FK_94990478b32d346194bca0bc024" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key" DROP CONSTRAINT "FK_94990478b32d346194bca0bc024"`);
        await queryRunner.query(`DROP TABLE "application"`);
        await queryRunner.query(`DROP TABLE "key"`);
        await queryRunner.query(`DROP TYPE "public"."key_type_enum"`);
    }

}
