import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret_jwt_key';

export type AuthenticatedRequest = Request & {
  userId: number;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (
        typeof payload === 'string' ||
        typeof payload.userId !== 'number' ||
        !Number.isInteger(payload.userId)
      ) {
        throw new UnauthorizedException('Token inválido');
      }

      request.userId = payload.userId;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Token inválido');
    }
  }
}
