import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { LoginInput, RegisterInput } from './auth.schemas.js';
import { AuthRepository } from './auth.repository.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret_jwt_key';
const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(
    input: RegisterInput,
  ): Promise<{ token: string; userId: number }> {
    const existing = await this.authRepository.findByUsername(input.username);
    if (existing) {
      throw new ConflictException('El usuario ya existe');
    }

    const password = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await this.authRepository.create({
      username: input.username,
      password,
    });

    return { token: this.createToken(user.id), userId: user.id };
  }

  async login(input: LoginInput): Promise<{ token: string; userId: number }> {
    const user = await this.authRepository.findByUsername(input.username);
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return { token: this.createToken(user.id), userId: user.id };
  }

  private createToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  }
}
