import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MysqlService } from './database/mysql.service.js';
import { createAuthRouter } from './routes/auth.routes.js';

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(express.json());
    app.enableCors();
    app.use('/auth', createAuthRouter(app.get(MysqlService)));

    await app.listen(Number(process.env.PORT ?? 3000));
}

