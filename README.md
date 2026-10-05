# users-postgres

Небольшой NestJS API для пользователей. Данные хранятся в **SQLite** через **TypeORM**. Swagger UI: `/api`.

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run start:dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

Переменные окружения (см. `.env.example`):

| Переменная | Описание |
|------------|----------|
| `PORT` | Порт HTTP (по умолчанию `3000`) |
| `DB_DATABASE` | Путь к файлу SQLite (по умолчанию `data.sqlite`) |
| `DB_SYNCHRONIZE` | `true` — создавать/обновлять таблицы по entity при старте (только для разработки) |

После первого запуска в корне проекта появится файл `data.sqlite`.

## Как здесь работает TypeORM

**TypeORM** — это ORM: она связывает классы TypeScript с таблицами в БД, а строки — с объектами. Ручной SQL почти не нужен; используется **репозиторий** (`save`, `find`, `remove` и т.д.).

### 1. Entity — схема таблицы

**Entity** описывает одну таблицу. Пример: класс `User` → таблица `users`.

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
}
```

Декораторы задают TypeORM имена колонок, типы, ключи и ограничения. Entity не содержит HTTP-логику — только модель данных для БД.

### 2. Глобальное подключение — `AppModule`

`TypeOrmModule.forRootAsync()` открывает одно подключение ко всему приложению. Настройки берутся из `ConfigService` / `.env`:

- `better-sqlite3` — драйвер SQLite;
- `autoLoadEntities: true` — подхватывает entity, зарегистрированные в feature-модулях;
- `synchronize` — при `true` TypeORM при старте создаёт или меняет таблицы по entity (удобно для обучения и локальной разработки; в production обычно используют миграции).

### 3. Feature-модуль — регистрация entity

`TypeOrmModule.forFeature([User])` в `UserModule` позволяет Nest внедрять `Repository<User>` в сервисы этого модуля.

### 4. Сервис — CRUD через репозиторий

`UserService` получает `Repository<User>` через `@InjectRepository(User)`:

| Метод | Что делает TypeORM |
|-------|---------------------|
| `create(dto)` + `save()` | INSERT |
| `find()` / `findOne()` | SELECT |
| `merge()` + `save()` | UPDATE |
| `remove()` | DELETE |

Типичное создание: DTO из контроллера → `repository.create(dto)` (объект в памяти) → `repository.save(user)` (запись в SQLite).

### 5. Entity и DTO — в чём разница

| | Entity | DTO |
|---|--------|-----|
| Назначение | Хранение в БД | Вход/выход API |
| Где лежит | `entities/` | `dto/` |
| Валидация | По желанию | `class-validator` в контроллере |

Контроллер проверяет **DTO**, сервис сохраняет **entity**. Формат API отделён от структуры таблицы.

### Путь запроса (POST `/users`)

1. Клиент отправляет JSON `{ "name", "email" }`.
2. `ValidationPipe` проверяет `CreateUserDto`.
3. `UserService.create()` → `repository.create` + `save`.
4. TypeORM выполняет `INSERT INTO users ...`.
5. В ответе — сохранённый `User` (с `id`) в JSON.

### Что посмотреть в коде

| Файл | О чём |
|------|--------|
| `src/user/entities/user.entity.ts` | Описание таблицы |
| `src/app.module.ts` | Подключение к БД |
| `src/user/user.module.ts` | Регистрация entity |
| `src/user/user.service.ts` | Работа с репозиторием |

Подробнее: [docs/typeorm-i-entity.md](./docs/typeorm-i-entity.md).

## Скрипты

```bash
npm run start:dev   # режим с перезапуском при изменениях
npm run test        # unit-тесты
npm run test:e2e    # e2e-тесты
```
