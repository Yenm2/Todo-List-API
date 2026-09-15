import { Injectable } from '@nestjs/common';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { MysqlService } from '../../database/mysql.service.js';
import type { RegisterInput } from './auth.schemas.js';
import { AuthRepository } from './auth.repository.js';
import type { User } from './user.model.js';

type UserRow = RowDataPacket & {
  id: number;
  nombre: string;
  password: string;
  created_at: Date;
};

@Injectable()
export class MysqlAuthRepository implements AuthRepository {
  constructor(private readonly mysql: MysqlService) {}

  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await this.mysql.pool.query<UserRow[]>(
      'SELECT id, nombre, password, created_at FROM usuarios WHERE nombre = ?',
      [username],
    );
    return rows[0] ? this.toUser(rows[0]) : null;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await this.mysql.pool.query<UserRow[]>(
      'SELECT id, nombre, password, created_at FROM usuarios WHERE id = ?',
      [id],
    );
    return rows[0] ? this.toUser(rows[0]) : null;
  }

  async create(data: RegisterInput & { password: string }): Promise<User> {
    const [result] = await this.mysql.pool.execute<ResultSetHeader>(
      'INSERT INTO usuarios (nombre, password) VALUES (?, ?)',
      [data.username, data.password],
    );
    const user = await this.findById(result.insertId);
    if (!user) {
      throw new Error('No se pudo recuperar el usuario creado');
    }
    return user;
  }

  private toUser(row: UserRow): User {
    return {
      id: row.id,
      username: row.nombre,
      password: row.password,
      createdAt: row.created_at,
    };
  }
}
