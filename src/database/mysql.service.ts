import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class MysqlService implements OnModuleDestroy {
	readonly pool: Pool;

	constructor() {
		this.pool = createPool({
			host: process.env.DB_HOST ?? 'localhost',
			port: Number(process.env.DB_PORT ?? 3306),
			user: process.env.DB_USER ?? 'root',
			password: process.env.DB_PASSWORD ?? 'pass',
			database: process.env.DB_NAME ?? 'app',
			waitForConnections: true,
			connectionLimit: 10,
		});
	}

	async onModuleDestroy() {
		await this.pool.end();
	}
}
