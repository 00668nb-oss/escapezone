import path from 'node:path';
import dotenv from 'dotenv';

// נטען לפני כל import אחר, ודורס את DATABASE_URL שנטען מ-.env (Prisma טוענת .env בעצמה)
dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true, quiet: true });

// הגנה: הבדיקות מוחקות נתונים, ולכן אסור להן לרוץ על מסד שאינו מסד בדיקות
if (!/_test(\?|$)/.test(process.env.DATABASE_URL ?? '')) {
  throw new Error('DATABASE_URL חייב להסתיים ב-_test. הבדיקות מוחקות נתונים!');
}
