import { Body, Controller, Post } from '@nestjs/common';
import type { LoginInput, RegisterInput } from './auth.schemas.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterInput) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginInput) {
    return this.authService.login(data);
  }
}
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        } catch (err: any) {
            if (err.message === 'User already exists') {
                res.status(409).json({ message: err.message });
            } else {
                res.status(500).json({
                    message: 'Error interno del servidor'
                });
            }
        }
    };
    login=async (req: Request, res: Response): Promise<void> => {
        try{
            const result = await this.authService.login(req.body);
            res.status(200).json(result);
        } catch (err: any) {
            if (err.message === 'Invalid credentials') {
                res.status(401).json({ message: err.message });
            return;
            }
            res.status(500).json({
                message: 'Error interno del servidor'
            });
        }       
}}
