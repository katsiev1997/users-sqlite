import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto.js';

/** Все поля CreatePostDto опциональны — подходит для PATCH /posts/:id. */
export class UpdatePostDto extends PartialType(CreatePostDto) {}
