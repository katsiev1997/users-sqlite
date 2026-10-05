import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

/**
 * Feature-модуль «пользователи»: маршруты, сервис и доступ к таблице users.
 */
@Module({
  // forFeature — «этот модуль может использовать Repository<User>»
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
