import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Начальная миграция: таблицы users и posts + внешний ключ author_id.
 * Сгенерирована через npm run migration:generate; вручную SQL не правим.
 */
export class InitSchema1791612595206 implements MigrationInterface {
  name = 'InitSchema1791612595206';

  /** Применение миграции — создание объектов в PostgreSQL. */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "author_id" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    // FK posts.author_id → users.id; ON DELETE CASCADE удалит посты при удалении автора
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  /** Откат миграции (npm run migration:revert) — порядок обратный up. */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`,
    );
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
