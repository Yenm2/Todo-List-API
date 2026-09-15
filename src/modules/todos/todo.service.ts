import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from './todo.repository';
import {
	CreateTodoSchema,
	UpdateTodoSchema,
} from './todo.schemas';

@Injectable()
export class TodoService {
	constructor(private readonly todoRepository; todoRepository: TodoRepository) {}

	findAll() {
		return this.todoRepository.findAll();
	}

	findById(id: number) {
		return this.todoRepository.findById(id);
	}

	create(data: CreateTodoSchema) {
		return this.todoRepository.create(data);
	}

	async update(id:number, data: UpdateTodoSchema) {
		const todo = await this.todoRepository.update(id,data);

		if(!todo) {
			throw new NotFoudException('Todo no encontrado');
		}

		return todo;
	}

	async delete(id: number) {
		const todo = await this.todoRepository.findById(id);

		if(!todo) {
			throw new NotFoudException('Todo no encontrado');
		}

		await this.todoRepository.delete(id);
	}
}


