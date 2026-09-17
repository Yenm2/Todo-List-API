import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { TodosModule } from './modules/todos/todos.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, TodosModule],
})
export class AppModule {}
