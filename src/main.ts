import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

/** Точка входа: создаём HTTP-приложение и слушаем порт. */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ValidationPipe проверяет тело/query-параметры по декораторам class-validator в DTO
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // строки из JSON приводятся к типам полей DTO (например, число)
      whitelist: true, // лишние поля в JSON отбрасываются
      forbidNonWhitelisted: true, // неизвестные поля → 400 Bad Request
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('CRUD API for users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
await bootstrap();
