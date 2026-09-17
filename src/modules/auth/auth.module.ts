import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthRepository } from './auth.repository.js';
import { MysqlAuthRepository } from './mysql-auth.repository.js';
import { AuthService } from './auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AuthRepository,
      useClass: MysqlAuthRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
