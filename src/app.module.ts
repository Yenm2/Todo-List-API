import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { TodosModule } from './modules/todos/todos.module.js';

@Module({
	imports: [DatabaseModule, TodosModule],
})
export class AppModule {}
