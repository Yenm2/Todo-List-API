export interface TodoRepository {
  findAllByUser(userId: string): Promise<any[]>;
  create(todo: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
}
