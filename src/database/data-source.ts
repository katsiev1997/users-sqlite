import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Post } from '../post/entities/post.entity.js';
import { User } from '../user/entities/user.entity.js';

/** CLI TypeORM (migration:generate / migration:run) не поднимает Nest — читаем .env сами. */
config({ path: '.env' });

const port = Number(process.env.DB_PORT ?? 5432);

/**
 * Отдельный DataSource для команд typeorm в package.json.
 * Настройки должны совпадать с TypeOrmModule.forRootAsync в AppModule.
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number.isFinite(port) ? port : 5432,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'users',
  entities: [User, Post],
  // После nest build миграции лежат в dist/database/migrations/
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
});
