import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity.js';

/** Метаданные пагинации в ответе GET /users. */
export class PaginatedUsersMeta {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  /** Общее число пользователей с учётом фильтра name (без учёта только текущей страницы). */
  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

/**
 * Формат ответа списка: массив data + meta для UI пагинации.
 * Классы нужны Swagger для описания схемы в OpenAPI.
 */
export class PaginatedUsersResponse {
  @ApiProperty({ type: [User] })
  data: User[];

  @ApiProperty({ type: PaginatedUsersMeta })
  meta: PaginatedUsersMeta;
}
