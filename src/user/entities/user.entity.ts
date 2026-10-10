import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Post } from '../../post/entities/post.entity.js';

/**
 * Entity (сущность) — класс-модель таблицы users.
 * TypeORM маппит строки БД ↔ объекты User; схема таблицы задаётся миграциями.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  /** unique — ограничение UNIQUE в PostgreSQL на колонку email. */
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /**
   * OneToMany — «обратная» сторона связи; физически FK только в таблице posts.
   * Строковое имя 'Post' вместо () => Post — без циклического import в ESM.
   */
  @OneToMany('Post', 'author')
  posts: Post[];
}
