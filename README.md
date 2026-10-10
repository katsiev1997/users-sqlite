# users-postgres

NestJS API для **users** и **posts** с **PostgreSQL** и **TypeORM**. Схема БД управляется **миграциями** (`synchronize: false`). Swagger UI: `/api`.

## Быстрый старт

```bash
npm install
cp .env.example .env
docker compose up -d
npm run migration:run
npm run start:dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

### Переменные окружения

| Переменная | Описание |
|------------|----------|
| `PORT` | HTTP-порт (по умолчанию `3000`) |
| `DB_HOST` | Хост PostgreSQL |
| `DB_PORT` | Порт PostgreSQL (`5432`) |
| `DB_USERNAME` | Пользователь БД |
| `DB_PASSWORD` | Пароль |
| `DB_DATABASE` | Имя базы |

## Миграции

```bash
npm run migration:generate   # после изменения entity → новый файл в src/database/migrations/
npm run migration:run          # применить миграции
npm run migration:revert       # откат последней миграции
```

Проверка внешнего ключа `posts.author_id → users.id`:

```bash
docker exec users-postgres-postgres-1 psql -U postgres -d users -c "\d posts"
```

## Связь User ↔ Post

- `User` — `OneToMany` → `posts`
- `Post` — `ManyToOne` → `author` (`author_id`, FK с `ON DELETE CASCADE`)

## QueryBuilder, пагинация, N+1

`GET /users` — список пользователей с постами:

- `leftJoinAndSelect('user.posts', 'post')`
- фильтр по имени: `?name=ali`
- сортировка: `?sortBy=name&sortOrder=ASC`
- пагинация: `?page=1&limit=10`

Ответ: `{ data: User[], meta: { page, limit, total, totalPages } }`.

Пример N+1 «до/после»: [docs/n-plus-one.md](./docs/n-plus-one.md) и `UserService.findAllWithPostsNaive()` vs `findAll()`.

## Скрипты

```bash
npm run start:dev
npm run test
npm run test:e2e
```
