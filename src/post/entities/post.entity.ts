import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { User } from '../../user/entities/user.entity.js';

/**
 * Сущность «пост» — таблица posts в PostgreSQL.
 * Связана с User через ManyToOne (много постов у одного автора).
 */
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  /**
   * ManyToOne — в таблице posts колонка author_id (FK на users.id).
   * 'User' / 'posts' — строковая связь, чтобы не импортировать User на runtime (ESM cycle).
   */
  @ManyToOne('User', 'posts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  /** Дата создания; timestamptz — с часовым поясом (типично для PostgreSQL). */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
