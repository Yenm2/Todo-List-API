import { Global, Module } from '@nestjs/common';
import { MysqlService } from './mysql.service.js';

@Global()
@Module({
	providers: [MysqlService],
	exports: [MysqlService],
})
export class DatabaseModule {}
