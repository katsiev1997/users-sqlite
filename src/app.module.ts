import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PostModule } from './post/post.module.js';
import { UserModule } from './user/user.module.js';

/**
 * Путь к скомпилированным миграциям в dist/.
 * TypeORM при старте приложения читает *.js из этой папки (не .ts из src/).
 */
const migrationsDir = join(
  fileURLToPath(new URL('.', import.meta.url)),
  'database/migrations/*.js',
);

/** Корневой модуль: конфигурация, PostgreSQL, feature-модули. */
@Module({
  imports: [
    // Загружает .env; ConfigService доступен во всём приложении без повторного импорта
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Асинхронное подключение: параметры БД берём из переменных окружения
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        // Entity из forFeature() в модулях подключаются автоматически
        autoLoadEntities: true,
        // false: схему меняем только миграциями (npm run migration:run), не при каждом старте
        synchronize: false,
        migrations: [migrationsDir],
        // false: миграции запускаем вручную CLI, а не при bootstrap()
        migrationsRun: false,
      }),
    }),
    UserModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
