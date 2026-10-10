import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PostService } from './post.service.js';

/**
 * REST API для постов, префикс /posts.
 * Контроллер не обращается к БД напрямую — только PostService.
 */
@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /** POST /posts — создать пост (в теле authorId — id пользователя-автора). */
  @Post()
  @ApiOperation({ summary: 'Create post' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  /** GET /posts — все посты с вложенным объектом author. */
  @Get()
  @ApiOperation({ summary: 'List posts' })
  findAll() {
    return this.postService.findAll();
  }

  /** GET /posts/:id — один пост; ParseIntPipe отклонит нечисловой id. */
  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  /** PATCH /posts/:id — частичное обновление полей поста и/или автора. */
  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  /** DELETE /posts/:id — удаление строки из таблицы posts. */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
