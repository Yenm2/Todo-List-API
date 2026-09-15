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
