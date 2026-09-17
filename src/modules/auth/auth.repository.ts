import type { RegisterInput } from './auth.schemas.js';
import type { User } from './user.model.js';

export abstract class AuthRepository {
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
  abstract create(data: RegisterInput & { password: string }): Promise<User>;
}
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { MysqlService } from '../../database/mysql.service.js';

export interface UserEntity {
    id: string;
    username: string;
    password: string;
    created_at: Date;
}

type UserRow = RowDataPacket & UserEntity;

export class AuthRepository {
    constructor(private readonly mysql: MysqlService) {}

    async findByusername(username: string): Promise<UserEntity | null> {
        const [rows] = await this.mysql.pool.query<UserRow[]>(
            'SELECT id, nombre AS username, password, created_at FROM usuarios WHERE nombre = ?',
            [username],
        );
        return rows[0] ? this.toUser(rows[0]) : null;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const [rows] = await this.mysql.pool.query<UserRow[]>(
            'SELECT id, nombre AS username, password, created_at FROM usuarios WHERE id = ?',
            [id],
        );
        return rows[0] ? this.toUser(rows[0]) : null;
    }

    async create(username: string, password: string): Promise<UserEntity> {
        const [result] = await this.mysql.pool.execute<ResultSetHeader>(
            'INSERT INTO usuarios (nombre, password) VALUES (?, ?)',
            [username, password],
        );
        const user = await this.findById(String(result.insertId));
        if (!user) {
            throw new Error('No se pudo recuperar el usuario creado');
        }
        return user;
    }

    private toUser(row: UserRow): UserEntity {
        return {
            id: String(row.id),
            username: row.username,
            password: row.password,
            created_at: row.created_at,
        };
    }
}
