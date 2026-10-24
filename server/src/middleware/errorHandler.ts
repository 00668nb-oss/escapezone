import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { HttpError } from '../utils/httpError';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'הנתיב לא נמצא' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) return void res.status(err.status).json({ error: err.message });

  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return void res.status(400).json({ error: 'נתונים לא תקינים', details });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return void res.status(409).json({ error: 'הערך כבר קיים במערכת' });
    if (err.code === 'P2025') return void res.status(404).json({ error: 'הרשומה לא נמצאה' });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return void res.status(400).json({ error: 'JSON לא תקין' });
  }

  console.error(err);
  res.status(500).json({ error: 'שגיאת שרת' });
}
