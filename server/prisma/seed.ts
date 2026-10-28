import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const isProd = process.env.NODE_ENV === 'production';

// בפיתוח: חשבונות הדגמה עם סיסמאות ידועות. ב-Production: רק אם הוגדרו במשתני סביבה.
const accounts = [
  {
    name: 'מנהל המערכת',
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

// החדרים. מזהים חדר לפי השם: אם הוא כבר קיים מתעדכנים רק הטקסטים (לא התשובות, ולא ההתקדמות)
const rooms = [
  {
    name: 'הספרייה הנעלמת',
    description: 'ספרייה עתיקה שבה כל הספרים נעלמו בלילה אחד. פתרו שלוש חידות וגלו מה קרה.',
    imageUrl: '/images/library-2.jpg',
    difficulty: 'easy' as const,
    category: 'מסתורין',
    timeLimit: 15,
    finalText:
      'הספרנית הראשונה הסתירה את הספרים כדי להגן עליהם, וחיכתה למי שידע לפתור את החידות. עכשיו הספרייה שלכם.',
    puzzles: [
      {
        order: 1,
        title: 'הספר שנעלם מהמדף',
        prompt: "על המדף נשארה פתקית:\n> \"מאכילים אותי – אני גדל. משקים אותי – אני נעלם.\"\n? מי אני?",
        hotspotLabel: 'מדף ספרים',
        hotspotX: 30,
        hotspotY: 33,
        hint: 'זה משהו חם שמאירים איתו, ושורף עץ.',
        storyText: 'מאחורי המדף נמצא יומנה של הספרנית הראשונה: "הספרים לא נגנבו – הם הוסתרו כדי להגן עליהם."',
        answer: 'אש',
      },
      {
        order: 2,
        title: 'הגלובוס הישן',
        prompt: "על הגלובוס הישן מודבק פתק עם שעון שמראה 3:15, אבל המחוגים שלו תקועים.\n? כמה דקות עברו מאז 3:00?",
        hotspotLabel: 'גלובוס',
        hotspotX: 88,
        hotspotY: 66,
        hint: 'חשבו: 3:15 פחות 3:00.',
        storyText: 'בתוך הגלובוס הוסתר מפתח קטן וכתוב עליו: "רק מי שיודעים לחכות ימצאו את הדלת."',
        answer: '15',
        codeLength: 2,
      },
      {
        order: 3,
        title: 'הקופה הישנה',
        prompt: "הקופה הישנה נעולה בקוד.\n- קוד הקופה: מספר האותיות במילה \"ספרייה\", כפול 2.\n? מהו הקוד?",
        hotspotLabel: 'קופה ישנה',
        hotspotX: 9,
        hotspotY: 47,
        hint: 'ספרו את האותיות במילה ספרייה, ואז הכפילו ב-2.',
        storyText: 'במגירת הקופה נמצאה רשימת כל הספרים, וביניהם מכתב: "תודה שהצלתם את הספרייה."',
        answer: '12',
        codeLength: 2,
      },
    ],
  },
  {
    name: 'תיק ZERO: החקירה האחרונה',
    description:
      'לפני 17 שנים נעלם החוקר דניאל רז, בזמן שחקר את ZERO – מערכת שמשחזרת אירועים מהעבר. הודעה אנונימית הביאה אתכם למשרד הנטוש שלו. הדלת ננעלה מאחוריכם, מסך ישן נדלק, ומערכת בשם ECHO מכריזה: "פרוטוקול נעילה הופעל. זמן למחיקת הארכיון: 14:59." גלו מה קרה לדניאל לפני שהזמן נגמר.',
    imageUrl: '/images/zero-office-2.jpg',
    difficulty: 'medium' as const,
    category: 'בלשי',
    timeLimit: 15,
    finalText:
      'הקלטה של דניאל מתנגנת: "אם הגעתם עד לכאן, הצלחתם לעשות את מה שאני לא הצלחתי: להוכיח את האמת. אריאל קדם שינה את הנתונים, והמערכת לא שיקרה – היא רק סיפרה את מה שלימדו אותה להאמין. עכשיו אפשר סוף סוף לסגור את תיק ZERO." הדלת נפתחת, ובמסך האחרון מופיעה שורה אחת: "ברוכים הבאים הביתה, חוקרים."',
    puzzles: [
      {
        order: 1,
        title: 'שלוש התמונות',
        prompt: "> \"האור זוכר את מה שהזמן שכח.\"\nעל הקיר תלויות שלוש תמונות של המשרד. בכל אחת מוסתרת ספרה:\n- בוקר: הצל של הכיסא ארוך ונופל שמאלה. מתחתיו מוסתרת הספרה 4.\n- צהריים: הצל כמעט לא נראה. הספרה 7 חבויה בשעון הקיר.\n- ערב: הצל ארוך ונופל ימינה. הספרה 2 כתובה על הספר הפתוח.\n? סדרו את התמונות לפי סדר היום, מהבוקר ועד הערב. מהו קוד המגירה?",
        hotspotLabel: 'תמונות על הקיר',
        hotspotX: 13,
        hotspotY: 33,
        hint: 'סדרו לפי סדר היום: בוקר, צהריים, ערב. קראו את הספרות לפי הסדר הזה.',
        storyText:
          'המגירה נפתחת. בפנים: מפתח קטן, שקופית שקופה ויומן חקירה. בעמוד האחרון כתב דניאל: "אם משהו בחדר נראה לכם מוכר מדי – אל תסמכו עליו."',
        answer: '472',
        codeLength: 3,
      },
      {
        order: 2,
        title: 'הטלפון המסתורי',
        prompt: "ביומן של דניאל כתוב:\n> \"לפעמים צריך להשתיק את הרעש כדי לשמוע את האמת.\"\nמהטלפון הישן נשמעת הודעה אחת:\n> \"אל..שששש..תסמוך..שששש..על..שששש..החדר\"\nהמילה \"שששש\" היא הרעש שחוזר בין המילים.\n? כמה מילים יש בהודעה האמיתית, אחרי שמשתיקים את הרעש?",
        hotspotLabel: 'טלפון ישן',
        hotspotX: 67,
        hotspotY: 59,
        hint: 'הסירו את המילה שששש בכל מקום, וספרו את המילים שנשארו.',
        storyText:
          'האור מהבהב. כשהוא חוזר, המשרד נראה אותו דבר, אבל שעון הקיר הוזז והמנורה עומדת בצד השני. מישהו או משהו שינה את החדר. ECHO מודיעה: "שגיאה. זוהה חלל שאינו מופיע בתוכנית המבנה." הספרייה זזה, ומאחוריה נחשף מעבר סודי לארכיון.',
        answer: '4',
        codeLength: 1,
      },
      {
        order: 3,
        title: 'הערב שבו דניאל נעלם',
        prompt: "בארכיון הסודי מחכים הקלטות מצלמות ויומני כניסה.\n- מצלמה א׳: דניאל עוזב את הבניין ב-21:18, אבל השעון שלה מקדים בשש דקות.\n- יומן הכניסות: הכרטיס של דניאל שימש ב-21:24 (השעון של היומן מדויק).\n? כמה דקות אחרי שדניאל עזב את הבניין שימש הכרטיס שלו?",
        hotspotLabel: 'ארון התיקים',
        hotspotX: 38,
        hotspotY: 51,
        hint: 'הפחיתו 6 דקות מ-21:18 כדי לדעת מתי דניאל עזב, ואז חשבו את ההפרש עד 21:24.',
        storyText:
          'דניאל עזב ב-21:12, והכרטיס שלו שימש 12 דקות אחר כך, כשהוא כבר לא היה שם. על לוח החקירה מופיע שם אחד: אריאל קדם, מנהל הפרויקט, שקיבל באותו לילה כרטיס חלופי. ECHO מכריזה: "מסקנה אינה תואמת את הדוח הרשמי." ואז היא מגלה את האמת: מישהו שינה את הנתונים שעליהם היא מסתמכת.',
        answer: '12',
        codeLength: 2,
      },
    ],
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

  for (const { puzzles, ...room } of rooms) {
    const existing = await prisma.room.findFirst({ where: { name: room.name } });
    if (!existing) {
      await prisma.room.create({ data: { ...room, status: 'published', puzzles: { create: puzzles } } });
      continue;
    }
    // החדר כבר קיים: מרענן רק את הטקסטים (בלי לגעת בתשובות ובהתקדמות) כדי שפריסה חדשה תעדכן אותם
    await prisma.room.update({
      where: { id: existing.id },
      data: { description: room.description, finalText: room.finalText, imageUrl: room.imageUrl, timeLimit: room.timeLimit },
    });
    for (const { order, title, prompt, hotspotLabel, storyText, codeLength, hint, hotspotX, hotspotY } of puzzles) {
      await prisma.puzzle.updateMany({
        where: { roomId: existing.id, order },
        data: { title, prompt, hotspotLabel, storyText, codeLength: codeLength ?? null, hint, hotspotX, hotspotY },
      });
    }
  }
  console.log('Seed הסתיים');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
