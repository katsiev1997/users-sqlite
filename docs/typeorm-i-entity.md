# TypeORM и Entity — пояснение для студентов

Официальная документация NestJS: [TypeORM](https://docs.nestjs.com/techniques/database#typeorm-integration).

## Зачем нужен ORM

**ORM** (Object-Relational Mapping) связывает таблицы в базе данных с классами в TypeScript.

| В коде (класс) | В SQLite (таблица) |
|----------------|-------------------|
| `User`         | `users`           |
| `user.name`    | колонка `name`    |
| `user.email`   | колонка `email`   |

Вместо ручного SQL (`INSERT INTO users ...`) вы работаете с объектами и методами репозитория (`save`, `find`, `remove`).

**TypeORM** — одна из популярных ORM для Node.js. В NestJS она подключается пакетом `@nestjs/typeorm`.

## Что такое Entity

**Entity** — это класс, который описывает **структуру одной таблицы** и одну строку этой таблицы.

Файл: `src/user/entities/user.entity.ts`.

- Один класс Entity ≈ одна таблица.
- Экземпляр класса `User` ≈ одна запись (строка) в таблице `users`.
- Декораторы (`@Entity`, `@Column`, …) говорят TypeORM, как создать таблицу и как читать/писать данные.

### Основные декораторы в нашем проекте

| Декоратор | Назначение |
|-----------|------------|
| `@Entity('users')` | Класс привязан к таблице `users`. Имя можно опустить — тогда TypeORM возьмёт имя класса. |
| `@PrimaryGeneratedColumn()` | Первичный ключ `id`, значение генерирует БД (AUTOINCREMENT в SQLite). |
| `@Column(...)` | Обычное поле → колонка в таблице. Параметры задают тип, длину, `unique` и т.д. |

Entity **не содержит** HTTP-логику и не ходит в сеть — только описание данных для БД.

## Как TypeORM встроен в NestJS

Схема из трёх шагов:

```text
AppModule                    UserModule                      UserService
─────────                    ──────────                      ───────────
TypeOrmModule.forRoot()  →   TypeOrmModule.forFeature([User])  →  @InjectRepository(User)
(подключение к SQLite)       (регистрация entity в модуле)        Repository<User>
```

1. **`TypeOrmModule.forRoot()`** (`app.module.ts`) — глобальное подключение к БД:
   - `type: 'sqlite'` — драйвер SQLite;
   - `database: 'data.sqlite'` — файл базы в корне проекта;
   - `autoLoadEntities: true` — подтягивает все entity из `forFeature()` в других модулях;
   - `synchronize: true` — TypeORM **сам создаёт/обновляет таблицы** по entity при старте.

   ⚠️ `synchronize: true` удобно для обучения и разработки. В **production** обычно выключают и применяют **миграции**, чтобы не потерять данные при изменении entity.

2. **`TypeOrmModule.forFeature([User])`** (`user.module.ts`) — говорит: «в этом модуле можно инжектить репозиторий для `User`».

3. **`Repository<User>`** (`user.service.ts`) — объект для CRUD:
   - `create()` — создать объект в памяти (ещё без INSERT);
   - `save()` — записать в БД (INSERT или UPDATE);
   - `find()` / `findOne()` — SELECT;
   - `merge()` + `save()` — обновление;
   - `remove()` — DELETE.

## Entity и DTO — в чём разница

| | Entity | DTO (`CreateUserDto`, …) |
|---|--------|---------------------------|
| Где | `entities/` | `dto/` |
| Зачем | Как данные хранятся в БД | Как данные приходят/уходят через API |
| Валидация | Нет (опционально можно добавить) | `class-validator` в контроллере |

Контроллер принимает **DTO**, сервис сохраняет через **Entity** / Repository. Так API не привязан напрямую к структуре таблицы.

## Путь запроса (пример POST /users)

1. Клиент шлёт JSON `{ "name": "...", "email": "..." }`.
2. `ValidationPipe` проверяет `CreateUserDto`.
3. `UserService.create()` вызывает `repository.create()` и `repository.save()`.
4. TypeORM выполняет SQL `INSERT INTO users ...`.
5. Nest возвращает сохранённый объект `User` (с `id`) как JSON.

## Что посмотреть в коде

| Файл | О чём |
|------|--------|
| `src/user/entities/user.entity.ts` | Описание таблицы |
| `src/app.module.ts` | Подключение БД |
| `src/user/user.module.ts` | Регистрация entity в модуле |
| `src/user/user.service.ts` | Работа с `Repository` |

После первого запуска (`npm run start:dev`) появится файл `data.sqlite` — это и есть база с таблицей `users`.
