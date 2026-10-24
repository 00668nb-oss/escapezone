import type { Request, Response } from 'express';
import { currentUser } from '../middleware/auth';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response) {
  res.status(201).json(await authService.register(registerSchema.parse(req.body)));
}

export async function login(req: Request, res: Response) {
  res.json(await authService.login(loginSchema.parse(req.body)));
}

export async function me(req: Request, res: Response) {
  res.json(await authService.getMe(currentUser(req).id));
}
