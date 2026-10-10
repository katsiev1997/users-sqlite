import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { Post } from './entities/post.entity.js';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';

/**
 * Feature-модуль «посты».
 * User в forFeature нужен PostService для проверки authorId при create/update.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
