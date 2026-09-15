import {z} from 'zod';

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
        password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
        password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
});
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];