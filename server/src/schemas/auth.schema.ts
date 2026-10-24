import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'שם קצר מדי').max(50),
  email: z.string().trim().toLowerCase().email('אימייל לא תקין'),
  password: z.string().min(8, 'סיסמה: לפחות 8 תווים').max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('אימייל לא תקין'),
  password: z.string().min(1, 'חובה להזין סיסמה'),
});
