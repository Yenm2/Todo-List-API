import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from './todo.repository.js';
import {
	CreateTodoSchema,
	UpdateTodoSchema,
} from './todo.schemas.js';

@Injectable()
export class TodoService {
	constructor(private readonly todoRepository: TodoRepository) {}

	findAll() {
		return this.todoRepository.findAll();
	}

	findByUserId(userId: number) {
		return this.todoRepository.findByUserId(userId);
	}

	async findById(id: number) {
		const todo = await this.todoRepository.findById(id);

		if (!todo) {
			throw new NotFoundException('Todo no encontrado');
		}

		return todo;
	}

	create(data: CreateTodoSchema) {
		return this.todoRepository.create(data);
	}

	async update(id: number, data: UpdateTodoSchema) {
		const todo = await this.todoRepository.update(id, data);

		if(!todo) {
			throw new NotFoundException('Todo no encontrado');
		}

		return todo;
	}

	async delete(id: number) {
		const todo = await this.todoRepository.findById(id);

		if(!todo) {
			throw new NotFoundException('Todo no encontrado');
		}

		await this.todoRepository.delete(id);
	}
}
