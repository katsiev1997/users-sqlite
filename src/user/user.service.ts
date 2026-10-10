import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { FindUsersQueryDto } from './dto/find-users-query.dto.js';
import { PaginatedUsersResponse } from './dto/paginated-users.response.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

/**
 * Бизнес-логика пользователей.
 * Работа с БД через Repository; для списка с постами — QueryBuilder (join, фильтр, пагинация).
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    /** Нужен для учебного метода findAllWithPostsNaive (демонстрация N+1). */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  /** INSERT: create — объект в памяти, save — запись в PostgreSQL. */
  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Оптимизированный список: один SQL с JOIN постов, фильтром, сортировкой и пагинацией.
   * См. findAllWithPostsNaive — контраст по числу запросов (N+1).
   */
  async findAll(query: FindUsersQueryDto): Promise<PaginatedUsersResponse> {
    const { page, limit, name, sortBy, sortOrder } = query;
    // skip/take в TypeORM соответствуют OFFSET/LIMIT в SQL
    const skip = (page - 1) * limit;

    const qb = this.usersRepository
      .createQueryBuilder('user')
      // LEFT JOIN posts — подтягиваем посты без отсечения пользователей без постов
      .leftJoinAndSelect('user.posts', 'post');

    // ILIKE — регистронезависимый поиск подстроки (PostgreSQL)
    if (name?.trim()) {
      qb.andWhere('user.name ILIKE :name', { name: `%${name.trim()}%` });
    }

    qb.orderBy(`user.${sortBy}`, sortOrder).addOrderBy('post.createdAt', 'DESC');

    // getManyAndCount — данные страницы + общее число строк (для meta.total)
    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  /**
   * Учебный анти-паттерн N+1 (не вызывается из контроллера):
   * 1 SELECT users + N SELECT posts → 1 + N запросов.
   * В findAll() тот же результат даёт один запрос с leftJoinAndSelect.
   */
  async findAllWithPostsNaive(): Promise<User[]> {
    const users = await this.usersRepository.find();
    for (const user of users) {
      user.posts = await this.postsRepository.find({
        where: { author: { id: user.id } },
        order: { createdAt: 'DESC' },
      });
    }
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
