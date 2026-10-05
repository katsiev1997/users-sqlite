import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';

/** Все поля CreateUserDto, но необязательные — удобно для PATCH. */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
