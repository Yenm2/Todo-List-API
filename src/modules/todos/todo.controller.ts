import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { TodoService } from './todo.service.js';
import type {
  CreateTodoSchema,
  UpdateTodoSchema,
} from './todo.schemas.js';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyTodos(@Req() request: AuthenticatedRequest) {
    return this.todoService.findByUserId(request.userId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.todoService.findByUserId(userId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.findById(id);
  }

  @Post()
  create(@Body() data: CreateTodoSchema) {
    return this.todoService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTodoSchema,
  ) {
    return this.todoService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.delete(id);
  }
}
