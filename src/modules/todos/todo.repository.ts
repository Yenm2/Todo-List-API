import { Todo } from './todo.model';
import {
	CreateTodoSchema,
	UpdateTodoSchema,
} from './todo.schemas';

export abstract class TodoRepositoty {
	abstract findAll(): Promise<Todo[]>;
	abstract findById(id: number): Promise<Todo>;
	abstract update(
		id: number,
		data: UpdateTodoSchema,
	): Promise<Todo | null>;
	abstract delete(id: number): Promise<void>;
}


