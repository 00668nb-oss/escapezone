# מדריך API לצד ה-React

מסמך הסבר בלבד (בלי קוד React). תיעוד אינטראקטיבי: `<BASE>/api-docs`.

## בסיס
- Base URL מקומי: `http://localhost:4000/api` (בענן: כתובת השרת + `/api`). מומלץ לשמור אותה במשתנה סביבה של Vite.
- כל הבקשות והתשובות ב-JSON (`Content-Type: application/json`).
- התאריכים בפורמט ISO.

## Authentication
1. `POST /auth/login` (או `/auth/register`) מחזיר `{ token, user }`.
2. שומרים את ה-token (למשל ב-Context ובאחסון דפדפן).
3. בכל בקשה פרטית שולחים Header: `Authorization: Bearer <token>`.
4. `GET /auth/me` מחזיר את המשתמשת המחוברת ומאפשר לשחזר התחברות אחרי רענון.
5. Token תקף 7 ימים. 401 = אין Token / לא תקין / פג תוקף → להעביר ל-Login. 403 = מחוברת אבל בלי הרשאה.
6. הלקוח לא שולח מזהה משתמשת – השרת יודע מי היא לפי ה-Token.

## פורמט שגיאות
```json
{ "error": "הודעה בעברית" }
```
שגיאת ולידציה (400) כוללת גם פירוט לפי שדה (מתאים להצגה ליד שדות הטופס):
```json
{ "error": "נתונים לא תקינים", "details": [{ "field": "email", "message": "אימייל לא תקין" }] }
```
| קוד | משמעות |
|---|---|
| 400 | נתונים או מזהה לא תקינים |
| 401 | חסר/לא תקין Token, או התחברות שגויה |
| 403 | אין הרשאה (או סיפור שעוד לא נחשף) |
| 404 | לא נמצא (כולל חדר טיוטה לשחקנית) |
| 409 | כפילות (אימייל קיים / מספר חידה קיים בחדר) |
| 500 | שגיאת שרת |

## מבני נתונים
**User**: `{ id, name, email, role: "player" | "admin" }`

**Room**: `{ id, name, description, imageUrl, difficulty: "easy"|"medium"|"hard", category, timeLimit (דקות), status: "draft"|"published"|"archived", finalText | null, puzzleCount, createdAt, updatedAt }`

**Puzzle**: `{ id, roomId, order, title, prompt, hotspotLabel, storyText | null, solved? }`
- אין שדה `answer` באף תשובה.
- לשחקנית `storyText` הוא `null` עד שפתרה את החידה, ו-`solved` אומר אם פתרה.

**Progress**: `{ roomId, status: "not_started"|"in_progress"|"completed", solvedPuzzleIds: number[], startedAt | null, completedAt | null }`

## Endpoints
| Method + URL | הרשאה | שולחים | מקבלים |
|---|---|---|---|
| `GET /health` | ציבורי | – | `{status:"ok"}` |
| `POST /auth/register` | ציבורי | `{name, email, password}` | 201 `{token, user}` |
| `POST /auth/login` | ציבורי | `{email, password}` | `{token, user}` |
| `GET /auth/me` | מחוברת | – | User |
| `GET /rooms` | ציבורי | query (למטה) | Room[] |
| `GET /rooms/:id` | ציבורי | – | Room |
| `POST /rooms` | admin | RoomInput | 201 Room |
| `PUT /rooms/:id` | admin | RoomInput חלקי | Room |
| `GET /rooms/:id/puzzles` | מחוברת | – | Puzzle[] לפי `order` |
| `POST /rooms/:id/puzzles` | admin | PuzzleInput | 201 Puzzle |
| `PUT /puzzles/:id` | admin | PuzzleInput חלקי | Puzzle |
| `POST /puzzles/:id/answer` | מחוברת | `{answer}` | `{correct: true\|false}` |
| `POST /progress/:roomId/start` | מחוברת | – | Progress |
| `GET /progress` | מחוברת | – | Progress[] (רק שלי) |
| `GET /progress/:roomId` | מחוברת | – | Progress (`not_started` אם עוד לא התחילה) |
| `GET /rooms/:id/story` | מחוברת | – | `{roomName, puzzles:[{id,title,storyText}], finalText}` – 403 לפני השלמה |

**Query של `GET /rooms`**: `search` (שם/תיאור), `category`, `difficulty`, `status` (למנהלת בלבד), `sort` = `name|difficulty|timeLimit|createdAt` (ברירת מחדל `createdAt`), `order` = `asc|desc`. דוגמה: `/rooms?search=ספרייה&difficulty=easy&sort=timeLimit&order=asc`.
שחקנית ואורחת רואות רק חדרים `published`. מנהלת (עם Token) רואה הכול.

## שדות חובה בטפסים (השרת מאמת, כדאי לאמת גם בלקוח)
- **הרשמה**: `name` (2–50), `email` תקין, `password` (8 תווים לפחות).
- **התחברות**: `email`, `password`.
- **חדר**: `name` (2–100), `description`, `imageUrl`, `difficulty`, `category`, `timeLimit` (מספר שלם 1–180). אופציונלי: `status` (ברירת מחדל `draft`), `finalText`.
- **חידה**: `order` (שלם ≥ 1, ייחודי בחדר), `title`, `prompt`, `hotspotLabel`, `storyText`, `answer`.
- **תשובה**: `answer` לא ריק.

## מי צריך מה (לפי מסך)
| מסך | קריאות |
|---|---|
| הרשמה / התחברות | `POST /auth/register`, `POST /auth/login` |
| שחזור התחברות / הגנת Routes | `GET /auth/me` |
| רשימת חדרים + חיפוש/סינון/מיון | `GET /rooms` (+ `GET /progress` לסימון חדרים שהושלמו) |
| מסך חדר | `GET /rooms/:id`, `GET /rooms/:id/puzzles`, `GET /progress/:roomId`, `POST /progress/:roomId/start` |
| חידה | `POST /puzzles/:id/answer` ואז לרענן את חידות החדר וההתקדמות כדי לחשוף את `storyText` |
| מסך סיום | `GET /rooms/:id/story` |
| ניהול חדרים (admin) | `GET /rooms?status=…`, `POST /rooms`, `PUT /rooms/:id` |
| ניהול חידות (admin) | `GET /rooms/:id/puzzles`, `POST /rooms/:id/puzzles`, `PUT /puzzles/:id` |

הערות:
- כדי שחדר יהיה גלוי לשחקניות צריך `status` = `published`.
- כשהתשובה נכונה והחידה האחרונה נפתרה, ה-`status` של ה-Progress הופך ל-`completed` – לבדוק זאת אחרי רענון ההתקדמות כדי לעבור למסך הסיום.
- תשובה שגויה היא תשובה תקינה מבחינת HTTP (200 עם `correct:false`), לא שגיאה.
- ההסתרה של כפתורים לפי תפקיד בלקוח היא נוחות בלבד; השרת אוכף הרשאות בעצמו.
