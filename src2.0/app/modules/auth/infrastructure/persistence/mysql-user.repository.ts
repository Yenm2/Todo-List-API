import { UserRepository } from '../../domain/interfaces/user.repository';

export class MysqlUserRepository implements UserRepository {
  async findByEmail(email: string) {
    return { email };
  }

  async create(user: any) {
    return user;
  }
}
