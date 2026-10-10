import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../post/entities/post.entity.js';
import { User } from './entities/user.entity.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

/**
 * Feature-модуль «пользователи».
 * Post зарегистрирован здесь, чтобы UserService мог инжектить Repository<Post> (N+1 demo).
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
