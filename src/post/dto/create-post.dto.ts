import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/** Тело POST /posts: текст поста + id существующего пользователя-автора. */
export class CreatePostDto {
  @ApiProperty({ example: 'Hello PostgreSQL' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Post body text' })
  @IsString()
  @IsNotEmpty()
  content: string;

  /** Внешний ключ на users.id; сервис проверит существование пользователя. */
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  authorId: number;
}
