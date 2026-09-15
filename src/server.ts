import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { authRouter } from './routes/auth.routes.js';

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(express.json());
    app.enableCors();
    app.use('/auth', authRouter);

    await app.listen(Number(process.env.PORT ?? 3000));
}

