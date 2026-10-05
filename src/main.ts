import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

/** Точка входа: создаём HTTP-приложение и слушаем порт. */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe проверяет тело/query-параметры по декораторам class-validator в DTO
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // строки из JSON приводятся к типам полей DTO (например, число)
      whitelist: true, // лишние поля в JSON отбрасываются
      forbidNonWhitelisted: true, // неизвестные поля → 400 Bad Request
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
