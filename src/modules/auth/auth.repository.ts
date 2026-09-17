import type { User } from './user.model.js';

export abstract class AuthRepository {
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
  abstract create(data: { username: string; password: string }): Promise<User>;
}
