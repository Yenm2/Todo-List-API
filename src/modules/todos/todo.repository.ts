import { Todo } from './todo.model.js';
import {
	CreateTodoSchema,
	UpdateTodoSchema,
} from './todo.schemas.js';

export abstract class TodoRepository {
	abstract findAll(): Promise<Todo[]>;
	abstract findByUserId(userId: number): Promise<Todo[]>;
	abstract findById(id: number): Promise<Todo | null>;
	abstract create(data: CreateTodoSchema): Promise<Todo>;
	abstract update(
		id: number,
		data: UpdateTodoSchema,
	): Promise<Todo | null>;
	abstract delete(id: number): Promise<void>;
}
