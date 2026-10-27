# EscapeZone – Server

Express + TypeScript (strict) + PostgreSQL + Prisma + Zod + JWT + Swagger + Vitest.

## הרצה מקומית

```bash
cd server
npm install

# מסד נתונים מקומי (Docker). פורט 5434 כדי לא להתנגש ב-PostgreSQL מקומי על 5433
docker run -d --name escapeverse-db -e POSTGRES_USER=escape -e POSTGRES_PASSWORD=<סיסמה> \
  -e POSTGRES_DB=escapeverse -p 5434:5432 postgres:16

cp .env.example .env          # ולמלא DATABASE_URL (עם אותה סיסמה) ו-JWT_SECRET
npx prisma migrate deploy     # יוצר את הטבלאות
npm run db:seed               # מנהלת, שחקנית והחדר "הספרייה הנעלמת"
npm run dev                   # http://localhost:4000
```

- בדיקת בריאות: `GET /api/health`
- Swagger: `http://localhost:4000/api-docs` · קובץ OpenAPI: `/openapi.json` (או `npm run openapi` ליצירת `openapi.json`)

חשבונות Seed לפיתוח בלבד: `admin@example.com` / `Admin123!` ו-`player@example.com` / `Player123!`.
כש-`NODE_ENV=production` חשבונות נוצרים רק אם הוגדרו `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` (ו-`SEED_PLAYER_*`).

## בדיקות

```bash
# פעם אחת: מסד בדיקות נפרד
docker exec escapeverse-db psql -U escape -d escapeverse -c "CREATE DATABASE escapeverse_test"
cp .env.test.example .env.test      # ולהחליף PASSWORD
# (מיגרציות למסד הבדיקות) מגדירים DATABASE_URL של ה-test ומריצים: npx prisma migrate deploy
npm test
npm run typecheck
npm run build
```

## מבנה

```
prisma/        schema.prisma, migrations/, seed.ts
src/config     משתני סביבה (Zod)
src/routes     הגדרת נתיבים והרשאות
src/controllers  קריאת בקשה ← קריאה ל-service ← תשובה
src/services   לוגיקה ושאילתות Prisma
src/schemas    ולידציות Zod
src/middleware JWT, הרשאות, טיפול בשגיאות
src/docs       מפרט OpenAPI
tests/         בדיקות אינטגרציה (supertest)
```

## אבטחה

- סיסמאות ב-bcrypt; JWT עם תוקף (`JWT_EXPIRES_IN`) וסוד ב-`JWT_SECRET`.
- המשתמשת נקבעת מה-Token בלבד. הרשאות נאכפות ב-middleware.
- השדה `answer` של חידה ו-`passwordHash` לא מוחזרים באף Response.

## פריסה ל-Render

`render.yaml` נמצא בשורש ה-Repository (`rootDir: server`). Build: `npm run render-build` (התקנה, `prisma generate`, קומפילציה, `prisma migrate deploy`). Start: `npm start`. Health check: `/api/health`.
משתני סביבה: `DATABASE_URL` (PostgreSQL חיצוני, למשל Supabase/Neon), `JWT_SECRET` (נוצר אוטומטית), `CLIENT_ORIGIN` (כתובת ה-Client, אפשר כמה מופרדות בפסיק), ואופציונלית `SEED_*`.
יצירת חשבון מנהלת בענן: להגדיר `SEED_ADMIN_*` ולהריץ `npm run db:seed` ב-Shell של השירות.
מסלולים חינמיים משתנים ויש להם מגבלות (למשל שינה אחרי חוסר פעילות) – יש לבדוק בעת הפריסה.
