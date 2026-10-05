import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module.js';

/** Корневой модуль: подключение БД и импорт feature-модулей. */
@Module({
  imports: [
    // forRoot — одно подключение к БД на всё приложение (см. docs/typeorm-i-entity.md)
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      // Подхватывает entity из TypeOrmModule.forFeature() в feature-модулях
      autoLoadEntities: true,
      // true: таблицы создаются/меняются по entity при старте (только для учёбы и dev)
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
