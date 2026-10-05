import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity (сущность) — класс-модель одной таблицы в БД.
 * TypeORM по декораторам создаёт таблицу и маппит строки ↔ объекты User.
 * Подробнее: docs/typeorm-i-entity.md
 */
@Entity('users')
export class User {
  /** Первичный ключ; SQLite сам увеличивает id для каждой новой строки. */
  @PrimaryGeneratedColumn()
  id: number;

  /** @Column — обычное поле таблицы; type/length задают тип колонки в SQL. */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /** unique: true — два пользователя не могут иметь один и тот же email. */
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
}
