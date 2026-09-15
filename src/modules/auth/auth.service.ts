import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository.js';
import type { RegisterInput, LoginInput } from './auth.schemas.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key';
const SALT_ROUNDS = 10;

export class AuthService {
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

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return { token };
    }
}
