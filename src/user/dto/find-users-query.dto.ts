import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Query-параметры для GET /users.
 * ValidationPipe + transform превращает строки из URL в числа для page/limit.
 */
export class FindUsersQueryDto {
  /** Номер страницы (с 1); используется для расчёта skip в QueryBuilder. */
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  /** Размер страницы — верхняя граница take в SQL. */
  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  /** Необязательный фильтр по подстроке имени (ILIKE в сервисе). */
  @ApiPropertyOptional({
    description: 'Filter by name (case-insensitive substring)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  /** Поле сортировки пользователя; whitelist через @IsIn защищает от SQL-инъекций в orderBy. */
  @ApiPropertyOptional({ enum: ['id', 'name', 'email'], default: 'id' })
  @IsOptional()
  @IsIn(['id', 'name', 'email'])
  sortBy: 'id' | 'name' | 'email' = 'id';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}
