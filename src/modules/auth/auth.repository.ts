import type { RegisterInput } from './auth.schemas.js';
import type { User } from './user.model.js';

export abstract class AuthRepository {
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
  abstract create(data: RegisterInput & { password: string }): Promise<User>;
}
