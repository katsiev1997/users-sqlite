import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) — форма данных от клиента при создании пользователя.
 * Не путать с User entity: здесь нет id и нет декораторов TypeORM.
 */
export class CreateUserDto {
  @ApiProperty({ example: 'Alice', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'alice@example.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;
}
