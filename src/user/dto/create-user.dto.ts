import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) — форма данных от клиента при создании пользователя.
 * Не путать с User entity: здесь нет id и нет декораторов TypeORM.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;
}
