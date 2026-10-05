import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module.js';

/** Корневой модуль: подключение БД и импорт feature-модулей. */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // forRootAsync — настройки БД из ConfigService / .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3' as const,
        database: config.getOrThrow<string>('DB_DATABASE'),
        // Подхватывает entity из TypeOrmModule.forFeature() в feature-модулях
        autoLoadEntities: true,
        // true: таблицы создаются/меняются по entity при старте (только для учёбы и dev)
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
