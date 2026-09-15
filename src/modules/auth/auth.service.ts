import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { RegisterInput, LoginInput } from './auth.schemas.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key';
const SALT_ROUNDS = 10;

export class AuthService {
    constructor(private readonly authrRepo: any) {
    }

    async register(input: RegisterInput): Promise<{ token: string }> {
        const existing = await this.authrRepo.findbyemail(input.email);
        if (existing) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
        const user = await this.authrRepo.create({
            email: input.email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return { token };
    }
}
