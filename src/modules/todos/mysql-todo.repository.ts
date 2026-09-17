import { Injectable } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { MysqlService } from '../../database/mysql.service.js';
import { Todo } from './todo.model.js';
import {
	CreateTodoSchema,
	UpdateTodoSchema,
} from './todo.schemas.js';
import { TodoRepository } from './todo.repository.js';

type TodoRow = RowDataPacket & {
	id: number;
	nombre: string;
	descripcion: string;
	created_at: Date;
};

@Injectable()
export class MysqlTodoRepository implements TodoRepository {
	constructor(private readonly mysql: MysqlService) {}

	async findAll(): Promise<Todo[]> {
		const [rows] = await this.mysql.pool.query<TodoRow[]>(
			'SELECT id, nombre, descripcion, created_at FROM todo ORDER BY id DESC',
		);
		return rows.map((row: TodoRow) => this.toTodo(row));
	}

	async findById(id: number): Promise<Todo | null> {
		const [rows] = await this.mysql.pool.query<TodoRow[]>(
			'SELECT id, nombre, descripcion, created_at FROM todo WHERE id = ?',
			[id],
		);
		return rows[0] ? this.toTodo(rows[0]) : null;
	}

	async create(data: CreateTodoSchema): Promise<Todo> {
		const [result] = await this.mysql.pool.execute<ResultSetHeader>(
			'INSERT INTO todo (nombre, descripcion) VALUES (?, ?)',
			[data.nombre, data.descripcion],
		);
		const todo = await this.findById(result.insertId);
		if (!todo) {
			throw new Error('No se pudo recuperar el todo creado');
		}
		return todo;
	}

	async update(id: number, data: UpdateTodoSchema): Promise<Todo | null> {
		const fields: string[] = [];
		const values: string[] = [];

		if (data.nombre !== undefined) {
			fields.push('nombre = ?');
			values.push(data.nombre);
		}
		if (data.descripcion !== undefined) {
			fields.push('descripcion = ?');
			values.push(data.descripcion);
		}
		if (fields.length === 0) {
			return this.findById(id);
		}

		values.push(String(id));
		await this.mysql.pool.execute(
			`UPDATE todo SET ${fields.join(', ')} WHERE id = ?`,
			values,
		);
		return this.findById(id);
	}

	async delete(id: number): Promise<void> {
		await this.mysql.pool.execute('DELETE FROM todo WHERE id = ?', [id]);
	}

	private toTodo(row: TodoRow): Todo {
		return {
			id: row.id,
			nombre: row.nombre,
			descripcion: row.descripcion,
			createdAt: row.created_at,
		};
	}
}
