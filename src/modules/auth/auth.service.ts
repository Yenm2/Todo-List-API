import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { LoginInput, RegisterInput } from './auth.schemas.js';
import { AuthRepository } from './auth.repository.js';
import { AuthRepository } from './auth.repository.js';
import type { RegisterInput, LoginInput } from './auth.schemas.js';

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
    constructor(private readonly authRepo: AuthRepository) {}

    async register(input: RegisterInput): Promise<{ token: string }> {
        const existing = await this.authRepo.findByusername(input.username);
        if (existing) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
        const user = await this.authRepo.create(input.username, hashedPassword);

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return { token };
    }

    async login(input: LoginInput): Promise<{ token: string }> {
        const user = await this.authRepo.findByusername(input.username);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passwordMatches = await bcrypt.compare(input.password, user.password);
        if (!passwordMatches) {
            throw new Error('Invalid credentials');
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
