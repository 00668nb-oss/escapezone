# PLAN – EscapeZone

סימון: `[ ]` לא התחיל · `[~]` בעבודה · `[x]` הושלם.
סדר עבודה: קודם דרישות, אחר כך עיצוב וסיפור.
**זכרי:** שרת = Claude Code כותב. Client (React) = את כותבת בעצמך, Claude מסביר ומכוון בלבד.

## שלב 0 – הקמה

- [x] מבנה תיקיות `/client` ו-`/server`, git, `.gitignore` (node_modules)
- [x] Client: Vite + React + TypeScript; התקנת react-router, react-hook-form, @tanstack/react-query (State: Context, בלי התקנה)
- [x] Server: Node + Express, חיבור DB, משתני סביבה (PostgreSQL ב-Docker, קונטיינר `escapeverse-db`; `/health` עובד)

## שלב 1 – שרת ומסד נתונים (Claude כותב)

- נבנה לפי פרומפט המורה: TypeScript strict + Prisma + Zod + JWT + Swagger (`/api-docs`) + Vitest. תיעוד ללקוח: `server/FRONTEND-API-GUIDE.md`. DB מקומי: Docker `escapeverse-db` על פורט **5434**.
- [x] מודלים: User, Room, Puzzle, Progress
- [x] הרשמה/התחברות + JWT + middleware הרשאות (`player` / `admin`)
- [x] Rooms: GET (חיפוש/סינון/מיון), GET by id, POST + PUT (admin)
- [x] Puzzles: GET בלי `answer`, POST + PUT (admin)
- [x] `POST /puzzles/:id/answer` → `{ correct }` בלבד
- [x] Progress: קריאה ועדכון לפי משתמשת
- [x] Seed: משתמשת מנהלת, שחקנית לבדיקה, החדר "הספרייה הנעלמת" עם 3 חידות
- [x] בדיקה ידנית של ה-API (Postman/curl) לפני שעוברים ללקוח

## שלב 2 – לקוח: תשתית (היא כותבת)

- [x] `client/.env` עם `VITE_API_URL=http://localhost:4000/api`
- [x] `types/index.ts`: User, Room, Puzzle, Progress, RoomInput, PuzzleInput, RoomFilters (איחודי מחרוזות ל-difficulty/status/role)
- [x] `api/client.ts`: fetch כללי – base URL, Header של Token, זריקת שגיאה עם status/error/details
- [x] `api/auth.ts`, `api/rooms.ts`, `api/puzzles.ts`, `api/progress.ts`: פונקציה לכל endpoint
- [x] `context/AuthContext.tsx`: user/token/isLoading, login/logout, localStorage, שחזור ע"י `GET /auth/me`, Hook `useAuth`
- [x] `QueryClientProvider` ב-`main.tsx` + קבוע מפתחות queries
- [x] `hooks/`: useRooms, useRoom, useRoomPuzzles, useProgress, useAllProgress, useStory
- [x] `hooks/`: mutations – useLogin, useRegister, useStartRoom, useSubmitAnswer, useSaveRoom, useSavePuzzle
- [x] קומפוננטות משותפות: Loading, ErrorMessage, FormField
- [x] Layout + Navbar (קישור ניהול רק למנהלת, שם + התנתקות)
- [x] `ProtectedRoute` עם prop `role` (Loading → login → הפניה לפי תפקיד)
- [x] Routing: `/`, `/login`, `/register`, `/rooms`, `/rooms/:id`, `/rooms/:id/finish`, `/admin`, `/admin/rooms/new`, `/admin/rooms/:id/edit`, `/admin/rooms/:id/puzzles`, `*`
- [ ] בדיקה (אחרי LoginPage, שלב 3): רענון שומר התחברות; שחקנית ב-`/admin` מופנית החוצה

## שלב 3 – לקוח: שחקנית

- [x] `LoginPage` + `RegisterPage`: useForm + Validation, `setError` מ-`details` של השרת, כפתור מושבת בזמן שליחה
- [x] `RoomFiltersBar` (קובץ components/RoomFiltersBar.tsx; לא RoomFilters, כדי לא להתנגש בשם הטיפוס): חיפוש, קטגוריה, קושי, מיון (props בלבד)
- [x] `constants/labels.ts` (difficultyLabels) + `RoomCard`: תמונה, שם, קושי, קטגוריה, זמן, תג "הושלם"
- [x] `RoomsPage`: פילטרים ב-URL (`useSearchParams`) → queryKey → רענון אוטומטי
- [x] `RoomPage`: טעינת חדר+חידות+התקדמות, מסך פתיחה עם כפתור "היכנסי לחדר" (start)
- [x] `HotspotButton` ×3 מעל התמונה, סימון ✓ לחידה שנפתרה, פס התקדמות
- [x] `PuzzlePanel`: טופס תשובה, נכון/לא נכון, invalidate ל-puzzles+progress → הצגת storyText
- [x] מעבר למסך סיום כש-`progress.status === completed`
- [x] `FinishPage`: `useStory`, טיפול ב-403

## שלב 4 – לקוח: מנהלת

- [x] `AdminRoomsPage`: כל החדרים + סינון status, קישורי עריכה/חידות, "חדר חדש"
- [x] `RoomFormPage`: אותו טופס להוספה ועריכה (`reset` בעריכה), Validation, תצוגת תמונה, invalidate + ניווט
- [ ] `AdminPuzzlesPage` + `PuzzleForm`: הוספה/עריכה; בעריכה `answer` אופציונלי (ריק = לא לשנות); 409 על order
- [ ] (אחרי ההגשה הראשונה; כרגע מספיק חדר אחד) הוספת שני החדרים הנוספים דרך המסך (היא מזינה): "החדר שבו הזמן עצר", "החממה הסודית" (3 חידות כל אחד, published)

## שלב 5 – לוטש וסיפור

- [ ] סיפור וטקסטים לשלושת החדרים
- [ ] עיצוב CSS, RTL, רספונסיבי
- [ ] טיפול בשגיאות ובמצבי Loading בכל המסכים
- [ ] (רק אם נשאר זמן) אנימציית דלת ב-CSS

## שלב 6 – בדיקה והגשה

- [ ] מעבר על צ'קליסט הדרישות ב-`CLAUDE.md`
- [ ] בדיקה: אי אפשר לראות תשובות בכלי המפתחים (Network)
- [ ] בדיקה: שחקנית לא נכנסת למסכי מנהלת, גם ישירות ב-URL וגם ב-API
- [ ] הכנת הסבר לכל חלק בקוד (מה עושה, למה, מאיפה המידע, מה מעדכן את המסך)
- [ ] העלאה ל-Git בלי node_modules
- [ ] פריסה לענן: Client + Server + DB
