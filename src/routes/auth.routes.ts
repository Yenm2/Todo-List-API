import { Router } from 'express';
import { AuthService } from '../modules/auth/auth.service.js';
import { MysqlAuthRepository } from '../modules/auth/mysql-auth.repository.js';
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
  const authRepo = new MysqlAuthRepository(mysql);
  const authService = new AuthService(authRepo);
  const authRouter = Router();

  authRouter.post('/register', validate(registerSchema), async (req, res) => {
    res.status(201).json(await authService.register(req.body));
  });
  authRouter.post('/login', validate(loginSchema), async (req, res) => {
    res.json(await authService.login(req.body));
  });

  return authRouter;
}