import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller.js';
import { MysqlTodoRepository } from './mysql-todo.repository.js';
import { TodoRepository } from './todo.repository.js';
import { TodoService } from './todo.service.js';

@Module({
	controllers: [TodoController],
	providers: [
		TodoService,
		{
			provide: TodoRepository,
			useClass: MysqlTodoRepository,
		},
	],
	exports: [TodoService],
})
export class TodosModule {}
