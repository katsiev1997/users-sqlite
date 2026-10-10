import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

/**
 * Точка входа приложения.
 * NestFactory поднимает DI-контейнер из AppModule и HTTP-сервер Express под капотом.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Глобальная валидация: любой @Body() / @Query() с DTO проверяется class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // query ?page=1 → number (нужен @Type в DTO)
      whitelist: true, // поля без декораторов в DTO не попадут в объект
      forbidNonWhitelisted: true, // лишние поля в JSON → 400 Bad Request
    }),
  );

  // OpenAPI-документация; UI доступен по /api
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription(
      'CRUD пользователей и постов (PostgreSQL, миграции, QueryBuilder)',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
await bootstrap();
