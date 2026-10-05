import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

/** Все поля CreateUserDto, но необязательные — удобно для PATCH. */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
