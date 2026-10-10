import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { Post } from './entities/post.entity.js';

/**
 * CRUD для постов.
 * Перед сохранением проверяем, что authorId указывает на существующего пользователя.
 */
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Связь ManyToOne: в INSERT уйдёт author_id = author.id
    const author = await this.usersRepository.findOne({
      where: { id: createPostDto.authorId },
    });
    if (!author) {
      throw new NotFoundException(`User #${createPostDto.authorId} not found`);
    }

    const post = this.postsRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      author,
    });
    return this.postsRepository.save(post);
  }

  /** relations: { author: true } — один запрос с JOIN (или eager load), без N+1 в простом списке. */
  findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: { author: true } });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    if (updatePostDto.authorId !== undefined) {
      const author = await this.usersRepository.findOne({
        where: { id: updatePostDto.authorId },
      });
      if (!author) {
        throw new NotFoundException(
          `User #${updatePostDto.authorId} not found`,
        );
      }
      post.author = author;
    }

    // merge обновляет только переданные поля DTO (PATCH-семантика)
    this.postsRepository.merge(post, {
      title: updatePostDto.title,
      content: updatePostDto.content,
    });
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }
}
