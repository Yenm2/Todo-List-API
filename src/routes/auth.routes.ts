import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller.js';
import { AuthService } from '../modules/auth/auth.service.js';
import { AuthRepository } from '../modules/auth/auth.repository.js';
import { registerSchema, loginSchema } from '../modules/auth/auth.schemas.js';
import { MysqlService } from '../database/mysql.service.js';

// Middleware genérico para Zod
const validate = (schema: any) => (req: any, res: any, next: any) => {
  const result = schema.safeParse({ body: req.body });
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  next();
};

export function createAuthRouter(mysql: MysqlService) {
  const authRepo = new AuthRepository(mysql);
  const authService = new AuthService(authRepo);
  const authController = new AuthController(authService);
  const authRouter = Router();

  authRouter.post('/register', validate(registerSchema), authController.register);
  authRouter.post('/login', validate(loginSchema), authController.login);

  return authRouter;
}