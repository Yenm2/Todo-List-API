import { TodoRepository } from '../../domain/interfaces/todo.repository';

export class MysqlTodoRepository implements TodoRepository {
  async findAllByUser(userId: string) {
    return [{ userId }];
  }

  async create(todo: any) {
    return todo;
  }

  async update(id: string, data: any) {
    return { id, ...data };
  }
}
