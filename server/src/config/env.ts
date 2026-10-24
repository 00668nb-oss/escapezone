import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

// בבדיקות נטען .env.test, אחרת .env (בענן המשתנים מוגדרים במערכת)
dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env'),
  quiet: true,
});

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL חסר'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET חסר או קצר מדי (לפחות 16 תווים)'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
});

export const env = schema.parse(process.env);
