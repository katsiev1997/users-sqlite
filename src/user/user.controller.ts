import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto.js';
import { FindUsersQueryDto } from './dto/find-users-query.dto.js';
import { PaginatedUsersResponse } from './dto/paginated-users.response.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user.service.js';

/**
 * REST API для пользователей.
 * Префикс маршрута: /users (см. @Controller).
 * Контроллер только принимает HTTP и делегирует работу UserService.
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** POST /users — создать пользователя. */
  @Post()
  @ApiOperation({ summary: 'Create user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * GET /users — список через QueryBuilder.
   * Пример: ?page=1&limit=10&name=ali&sortBy=name&sortOrder=ASC
   */
  @Get()
  @ApiOperation({ summary: 'List users with posts (QueryBuilder)' })
  findAll(@Query() query: FindUsersQueryDto): Promise<PaginatedUsersResponse> {
    return this.userService.findAll(query);
  }

  /** GET /users/:id — один пользователь; ParseIntPipe проверяет, что id — число. */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  /** PATCH /users/:id — частичное обновление (только переданные поля). */
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /** DELETE /users/:id — удалить пользователя. */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
