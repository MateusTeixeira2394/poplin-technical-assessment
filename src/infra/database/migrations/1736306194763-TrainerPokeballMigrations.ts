import { MigrationInterface, QueryRunner } from "typeorm";

export class TrainerPokeballMigrations1736306194763 implements MigrationInterface {
    name = 'TrainerPokeballMigrations1736306194763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pokeball" ("id" SERIAL NOT NULL, "pokemonId" integer NOT NULL, "trainerId" integer, CONSTRAINT "PK_fd475f9da248b5367421e6d62fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trainer" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8dfa741df6d52a0da8ad93f0c7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pokeball" ADD CONSTRAINT "FK_335671b7abab47746574c7af0b9" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokeball" DROP CONSTRAINT "FK_335671b7abab47746574c7af0b9"`);
        await queryRunner.query(`DROP TABLE "trainer"`);
        await queryRunner.query(`DROP TABLE "pokeball"`);
    }

}
