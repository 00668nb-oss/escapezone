import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma';
import { signToken } from '../middleware/auth';
import { HttpError } from '../utils/httpError';

// שדות שמותר להחזיר ללקוח (בלי passwordHash)
export const publicUserSelect = { id: true, name: true, email: true, role: true } as const;

export async function register(input: { name: string; email: string; password: string }) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new HttpError(409, 'האימייל כבר רשום במערכת');

  const passwordHash = await bcrypt.hash(input.password, 10);
  // הרשמה פתוחה יוצרת תמיד player. מנהלת נוצרת רק ב-Seed.
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash, role: 'player' },
    select: publicUserSelect,
  });
  return { token: signToken(user.id, user.role), user };
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  // אותה הודעה גם כשהאימייל לא קיים, כדי לא לחשוף מי רשום
  const ok = user && (await bcrypt.compare(input.password, user.passwordHash));
  if (!user || !ok) throw new HttpError(401, 'אימייל או סיסמה שגויים');

  return {
    token: signToken(user.id, user.role),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) throw new HttpError(401, 'החשבון לא קיים');
  return user;
}
