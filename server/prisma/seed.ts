import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const isProd = process.env.NODE_ENV === 'production';

// בפיתוח: חשבונות הדגמה עם סיסמאות ידועות. ב-Production: רק אם הוגדרו במשתני סביבה.
const accounts = [
  {
    name: 'מנהלת',
    role: 'admin' as const,
    email: process.env.SEED_ADMIN_EMAIL || (isProd ? '' : 'admin@example.com'),
    password: process.env.SEED_ADMIN_PASSWORD || (isProd ? '' : 'Admin123!'),
  },
  {
    name: 'דנה',
    role: 'player' as const,
    email: process.env.SEED_PLAYER_EMAIL || (isProd ? '' : 'player@example.com'),
    password: process.env.SEED_PLAYER_PASSWORD || (isProd ? '' : 'Player123!'),
  },
];

const puzzles = [
  {
    order: 1,
    title: 'הספר שנעלם מהמדף',
    prompt: 'על המדף נשארה פתקית: "אני גדל כשאת נותנת לי, ונעלם כשאת מתעלמת ממני. מי אני?"',
    hotspotLabel: 'מדף ספרים',
    storyText: 'מאחורי המדף נמצא יומנה של הספרנית הראשונה: "הספרים לא נגנבו – הם הוסתרו כדי להגן עליהם."',
    answer: 'אש',
  },
  {
    order: 2,
    title: 'השעון הישן',
    prompt: 'השעון מראה 3:15 אבל מחוגיו תקועים. כמה דקות עברו מאז 3:00?',
    hotspotLabel: 'שעון קיר',
    storyText: 'בתוך השעון הוסתר מפתח קטן וכתוב עליו: "רק מי שיודעת לחכות תמצא את הדלת."',
    answer: '15',
  },
  {
    order: 3,
    title: 'הארון הנעול',
    prompt: 'קוד הארון הוא מספר האותיות במילה "ספרייה" כפול 2.',
    hotspotLabel: 'ארון עץ',
    storyText: 'בארון נמצאו כל הספרים, וביניהם מכתב: "תודה שהצלת את הספרייה."',
    answer: '12',
  },
];

async function main() {
  for (const { password, ...account } of accounts) {
    if (!account.email || !password) continue;
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
      where: { email: account.email },
      create: { ...account, passwordHash },
      update: { name: account.name, role: account.role, passwordHash },
    });
  }

  const existing = await prisma.room.findFirst({ where: { name: 'הספרייה הנעלמת' } });
  if (!existing) {
    await prisma.room.create({
      data: {
        name: 'הספרייה הנעלמת',
        description: 'ספרייה עתיקה שבה כל הספרים נעלמו בלילה אחד. פתרי שלוש חידות וגלי מה קרה.',
        imageUrl: '/images/library.jpg',
        difficulty: 'easy',
        category: 'מסתורין',
        timeLimit: 20,
        status: 'published',
        finalText: 'הספרנית הראשונה הסתירה את הספרים כדי להגן עליהם, וחיכתה למי שתדע לפתור את החידות. עכשיו הספרייה שלך.',
        puzzles: { create: puzzles },
      },
    });
  }
  console.log('Seed הסתיים');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
