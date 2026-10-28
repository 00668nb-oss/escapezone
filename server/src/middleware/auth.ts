import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../db/prisma';
import { HttpError } from '../utils/httpError';

// קורא את ה-Token (אם יש). המשתמשת נקבעת לפי ה-Token ולפי מה ששמור ב-DB, לא לפי הלקוח.
async function readUser(req: Request) {
  const header = req.headers.authorization;
  if (!header) return undefined;
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'פורמט Authorization לא תקין');
  let userId: number;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    userId = Number(payload.sub);
  } catch {
    throw new HttpError(401, 'Token לא תקין או שפג תוקפו');
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  if (!user) throw new HttpError(401, 'החשבון לא קיים');
  return user;
}

// חובה להיות מחוברת
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const user = await readUser(req);
  if (!user) throw new HttpError(401, 'נדרשת התחברות');
  req.user = user;
  next();
}

// התחברות לא חובה (נתיבים ציבוריים שמנהלת רואה בהם יותר)
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  req.user = await readUser(req);
  next();
}

// חובה תפקיד מסוים. להפעיל אחרי requireAuth
export const requireRole = (role: Role) => (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== role) throw new HttpError(403, 'אין לך הרשאה לפעולה זו');
  next();
};

export function currentUser(req: Request) {
  if (!req.user) throw new HttpError(401, 'נדרשת התחברות');
  return req.user;
}

export function signToken(userId: number, role: Role) {
  return jwt.sign({ role }, env.JWT_SECRET, {
    subject: String(userId),
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}
