import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user.service.js';

/**
 * REST API для пользователей.
 * Префикс маршрута: /users (см. @Controller).
 * Контроллер только принимает HTTP и делегирует работу UserService.
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** POST /users — создать пользователя. */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /** GET /users — список всех пользователей. */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /** GET /users/:id — один пользователь; ParseIntPipe проверяет, что id — число. */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  /** PATCH /users/:id — частичное обновление (только переданные поля). */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /** DELETE /users/:id — удалить пользователя. */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
