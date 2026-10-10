# N+1: до и после

## Проблема

Если загрузить список `User`, а затем для **каждого** пользователя отдельно запросить `Post`, TypeORM выполнит:

- **1** запрос: `SELECT * FROM users`
- **N** запросов: `SELECT * FROM posts WHERE author_id = ?` для каждого user

Итого **1 + N** запросов — классическая проблема N+1.

## Код «до» (анти-паттерн)

См. `UserService.findAllWithPostsNaive()` в `src/user/user.service.ts`:

```typescript
const users = await this.usersRepository.find();
for (const user of users) {
  user.posts = await this.postsRepository.find({
    where: { authorId: user.id },
  });
}
```

При 100 пользователях — **101** SQL-запрос.

## Код «после» (один запрос)

См. `UserService.findAll()` — `GET /users`:

```typescript
this.usersRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post')
  .andWhere(/* optional filter */)
  .orderBy(/* sort */)
  .skip(/* pagination */)
  .take(/* pagination */)
  .getManyAndCount();
```

`leftJoinAndSelect` подтягивает связанные `posts` в **одном** запросе с JOIN.

## Как проверить количество запросов

Включите логирование SQL в TypeORM (локально):

```typescript
logging: ['query'],
```

Сравните вывод при вызове naive-метода и `GET /users`.
