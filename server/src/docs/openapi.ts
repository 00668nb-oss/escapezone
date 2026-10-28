// מפרט OpenAPI 3 של ה-API. מוגש ב-/api-docs (Swagger UI) וב-/openapi.json

type Json = Record<string, unknown>;

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const jsonContent = (schema: Json, example?: unknown) => ({
  'application/json': { schema, ...(example !== undefined ? { example } : {}) },
});

const errorResponse = (description: string, example: string) => ({
  description,
  content: jsonContent(ref('Error'), { error: example }),
});

const idParam = (name = 'id', description = 'מזהה') => ({
  name,
  in: 'path',
  required: true,
  description,
  schema: { type: 'integer', minimum: 1 },
});

interface OpOptions {
  tag: string;
  summary: string;
  description?: string;
  access: 'public' | 'user' | 'admin' | 'optional';
  parameters?: Json[];
  body?: { schema: Json; example: unknown };
  status?: number;
  response: { schema: Json; example: unknown };
  extraErrors?: Record<string, Json>;
}

function op(o: OpOptions): Json {
  const protectedOp = o.access === 'user' || o.access === 'admin';
  const accessText = {
    public: 'ציבורי – ללא Token.',
    optional: 'ציבורי. אם נשלח Token של מנהלת, מוחזרים גם חדרים שאינם מפורסמים.',
    user: 'דורש Token (שחקנית או מנהלת).',
    admin: 'דורש Token של מנהלת (admin) בלבד.',
  }[o.access];
  return {
    tags: [o.tag],
    summary: o.summary,
    description: `${o.description ?? o.summary}\n\n**הרשאה:** ${accessText}`,
    ...(protectedOp ? { security: [{ bearerAuth: [] }] } : {}),
    ...(o.parameters ? { parameters: o.parameters } : {}),
    ...(o.body
      ? { requestBody: { required: true, content: jsonContent(o.body.schema, o.body.example) } }
      : {}),
    responses: {
      [String(o.status ?? 200)]: { description: 'הצלחה', content: jsonContent(o.response.schema, o.response.example) },
      ...(o.body || o.parameters
        ? { 400: errorResponse('נתונים לא תקינים', 'נתונים לא תקינים') }
        : {}),
      ...(protectedOp ? { 401: errorResponse('חסר Token או שאינו תקין', 'נדרשת התחברות') } : {}),
      ...(o.access === 'admin' ? { 403: errorResponse('אין הרשאה (נדרשת מנהלת)', 'אין לך הרשאה לפעולה זו') } : {}),
      ...o.extraErrors,
    },
  };
}

const notFoundErr = (what: string, feminine = false) => {
  const text = `${what} לא נמצא${feminine ? 'ה' : ''}`;
  return { 404: errorResponse(text, text) };
};

const roomExample = {
  id: 1,
  name: 'הספרייה הנעלמת',
  description: 'ספרייה עתיקה שבה כל הספרים נעלמו…',
  imageUrl: '/images/library.jpg',
  difficulty: 'easy',
  category: 'מסתורין',
  timeLimit: 20,
  status: 'published',
  finalText: 'כך נחשף סוד הספרייה…',
  puzzleCount: 3,
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-01T10:00:00.000Z',
};
const roomBodyExample = {
  name: 'החממה הסודית',
  description: 'חממה נשכחת מסתירה סוד',
  imageUrl: '/images/greenhouse.jpg',
  difficulty: 'medium',
  category: 'הרפתקה',
  timeLimit: 25,
  status: 'draft',
};
const puzzleExample = {
  id: 1,
  roomId: 1,
  order: 1,
  title: 'הספר האבוד',
  prompt: 'מה המילה החסרה בשער הספרייה?',
  hotspotLabel: 'מדף',
  storyText: null,
  solved: false,
};
const puzzleBodyExample = {
  order: 1,
  title: 'הספר האבוד',
  prompt: 'מה המילה החסרה בשער הספרייה?',
  hotspotLabel: 'מדף',
  storyText: 'מאחורי המדף נמצא מכתב ישן…',
  answer: 'אור',
};
const progressExample = {
  roomId: 1,
  status: 'in_progress',
  solvedPuzzleIds: [1],
  startedAt: '2026-01-01T10:00:00.000Z',
  completedAt: null,
};
const userExample = { id: 2, name: 'דנה', email: 'player@example.com', role: 'player' };

const arr = (schema: Json) => ({ type: 'array', items: schema });

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'EscapeZone API',
    version: '1.0.0',
    description:
      'API של חדרי בריחה דיגיטליים.\n\n**איך מתחברים ב-Swagger:** בצעי `POST /auth/login`, העתיקי את ה-`token` מהתשובה, לחצי **Authorize** והדביקי אותו.',
  },
  servers: [{ url: '/api', description: 'השרת הנוכחי' }],
  tags: [
    { name: 'System' },
    { name: 'Auth' },
    { name: 'Rooms' },
    { name: 'Puzzles' },
    { name: 'Progress' },
  ],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Error: { type: 'object', properties: { error: { type: 'string' } }, required: ['error'] },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['player', 'admin'] },
        },
      },
      AuthResult: { type: 'object', properties: { token: { type: 'string' }, user: ref('User') } },
      Room: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          category: { type: 'string' },
          timeLimit: { type: 'integer', description: 'דקות (1-180)' },
          status: { type: 'string', enum: ['draft', 'published', 'archived'] },
          finalText: { type: 'string', nullable: true },
          puzzleCount: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      RoomInput: {
        type: 'object',
        required: ['name', 'description', 'imageUrl', 'difficulty', 'category', 'timeLimit'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          description: { type: 'string', maxLength: 2000 },
          imageUrl: { type: 'string' },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          category: { type: 'string', maxLength: 50 },
          timeLimit: { type: 'integer', minimum: 1, maximum: 180 },
          status: { type: 'string', enum: ['draft', 'published', 'archived'], default: 'draft' },
          finalText: { type: 'string', nullable: true },
        },
      },
      Puzzle: {
        type: 'object',
        description: 'חידה. אין בה את שדה התשובה. storyText הוא null עד שהחידה נפתרת (למנהלת תמיד מלא).',
        properties: {
          id: { type: 'integer' },
          roomId: { type: 'integer' },
          order: { type: 'integer' },
          title: { type: 'string' },
          prompt: { type: 'string' },
          hotspotLabel: { type: 'string' },
          storyText: { type: 'string', nullable: true },
          hotspotX: { type: 'integer', nullable: true, description: 'מיקום אופקי של החפץ באחוזים (0-100)' },
          hotspotY: { type: 'integer', nullable: true, description: 'מיקום אנכי של החפץ באחוזים (0-100)' },
          hint: { type: 'string', nullable: true, description: 'רמז אופציונלי שהשחקן יכול לבקש' },
          codeLength: { type: 'integer', nullable: true, description: 'אורך קוד ספרות (מנעול); null = תשובת טקסט' },
          solved: { type: 'boolean', description: 'רק לשחקנית' },
        },
      },
      PuzzleInput: {
        type: 'object',
        required: ['order', 'title', 'prompt', 'hotspotLabel', 'storyText', 'answer'],
        properties: {
          order: { type: 'integer', minimum: 1 },
          title: { type: 'string' },
          prompt: { type: 'string' },
          hotspotLabel: { type: 'string' },
          storyText: { type: 'string' },
          answer: { type: 'string', description: 'נשמר בשרת בלבד' },
        },
      },
      Progress: {
        type: 'object',
        properties: {
          roomId: { type: 'integer' },
          status: { type: 'string', enum: ['not_started', 'in_progress', 'completed'] },
          solvedPuzzleIds: arr({ type: 'integer' }),
          startedAt: { type: 'string', format: 'date-time', nullable: true },
          completedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: op({
        tag: 'System',
        summary: 'בדיקת בריאות שרת ומסד נתונים',
        access: 'public',
        response: { schema: { type: 'object', properties: { status: { type: 'string' } } }, example: { status: 'ok' } },
      }),
    },
    '/auth/register': {
      post: op({
        tag: 'Auth',
        summary: 'הרשמה (נוצרת שחקנית – player)',
        access: 'public',
        status: 201,
        body: {
          schema: {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string', minLength: 8 } },
          },
          example: { name: 'דנה', email: 'dana@example.com', password: 'Secret123' },
        },
        response: { schema: ref('AuthResult'), example: { token: '<JWT>', user: userExample } },
        extraErrors: { 409: errorResponse('האימייל כבר רשום', 'האימייל כבר רשום במערכת') },
      }),
    },
    '/auth/login': {
      post: op({
        tag: 'Auth',
        summary: 'התחברות וקבלת JWT',
        access: 'public',
        body: {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: { email: { type: 'string' }, password: { type: 'string' } },
          },
          example: { email: 'player@example.com', password: 'Player123!' },
        },
        response: { schema: ref('AuthResult'), example: { token: '<JWT>', user: userExample } },
        extraErrors: { 401: errorResponse('אימייל או סיסמה שגויים', 'אימייל או סיסמה שגויים') },
      }),
    },
    '/auth/me': {
      get: op({
        tag: 'Auth',
        summary: 'פרטי המשתמשת המחוברת',
        access: 'user',
        response: { schema: ref('User'), example: userExample },
      }),
    },
    '/rooms': {
      get: op({
        tag: 'Rooms',
        summary: 'רשימת חדרים עם חיפוש, סינון ומיון',
        access: 'optional',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'חיפוש בשם ובתיאור' },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'difficulty', in: 'query', schema: { type: 'string', enum: ['easy', 'medium', 'hard'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'published', 'archived'] }, description: 'משפיע רק למנהלת' },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['name', 'difficulty', 'category', 'timeLimit', 'createdAt'], default: 'createdAt' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
        ],
        response: { schema: arr(ref('Room')), example: [roomExample] },
      }),
      post: op({
        tag: 'Rooms',
        summary: 'יצירת חדר',
        access: 'admin',
        status: 201,
        body: { schema: ref('RoomInput'), example: roomBodyExample },
        response: { schema: ref('Room'), example: { ...roomExample, ...roomBodyExample, id: 2, puzzleCount: 0 } },
      }),
    },
    '/rooms/{id}': {
      get: op({
        tag: 'Rooms',
        summary: 'פרטי חדר',
        access: 'optional',
        parameters: [idParam('id', 'מזהה החדר')],
        response: { schema: ref('Room'), example: roomExample },
        extraErrors: notFoundErr('החדר'),
      }),
      put: op({
        tag: 'Rooms',
        summary: 'עריכת חדר (אפשר לשלוח רק חלק מהשדות)',
        access: 'admin',
        parameters: [idParam('id', 'מזהה החדר')],
        body: { schema: ref('RoomInput'), example: { status: 'published', timeLimit: 30 } },
        response: { schema: ref('Room'), example: roomExample },
        extraErrors: notFoundErr('החדר'),
      }),
    },
    '/rooms/{id}/puzzles': {
      get: op({
        tag: 'Puzzles',
        summary: 'חידות החדר (בלי תשובות)',
        access: 'user',
        parameters: [idParam('id', 'מזהה החדר')],
        response: { schema: arr(ref('Puzzle')), example: [puzzleExample] },
        extraErrors: notFoundErr('החדר'),
      }),
      post: op({
        tag: 'Puzzles',
        summary: 'הוספת חידה לחדר',
        access: 'admin',
        status: 201,
        parameters: [idParam('id', 'מזהה החדר')],
        body: { schema: ref('PuzzleInput'), example: puzzleBodyExample },
        response: { schema: ref('Puzzle'), example: { ...puzzleExample, storyText: puzzleBodyExample.storyText } },
        extraErrors: { ...notFoundErr('החדר'), 409: errorResponse('מספר סדר כבר קיים בחדר', 'הערך כבר קיים במערכת') },
      }),
    },
    '/rooms/{id}/story': {
      get: op({
        tag: 'Progress',
        summary: 'הסיפור המלא – רק אחרי השלמת החדר',
        access: 'user',
        parameters: [idParam('id', 'מזהה החדר')],
        response: {
          schema: { type: 'object' },
          example: {
            roomName: 'הספרייה הנעלמת',
            puzzles: [{ id: 1, title: 'הספר האבוד', storyText: 'מאחורי המדף נמצא מכתב ישן…' }],
            finalText: 'כך נחשף סוד הספרייה…',
          },
        },
        extraErrors: { 403: errorResponse('החדר טרם הושלם', 'הסיפור נחשף רק אחרי השלמת החדר') },
      }),
    },
    '/puzzles/{id}': {
      put: op({
        tag: 'Puzzles',
        summary: 'עריכת חידה (אפשר לשלוח רק חלק מהשדות)',
        access: 'admin',
        parameters: [idParam('id', 'מזהה החידה')],
        body: { schema: ref('PuzzleInput'), example: { prompt: 'ניסוח חדש לחידה' } },
        response: { schema: ref('Puzzle'), example: { ...puzzleExample, storyText: puzzleBodyExample.storyText } },
        extraErrors: notFoundErr('החידה', true),
      }),
    },
    '/puzzles/{id}/answer': {
      post: op({
        tag: 'Puzzles',
        summary: 'שליחת תשובה לחידה',
        description: 'מחזיר רק נכון/לא נכון. תשובה נכונה נשמרת בהתקדמות של המשתמשת המחוברת.',
        access: 'user',
        parameters: [idParam('id', 'מזהה החידה')],
        body: { schema: { type: 'object', required: ['answer'], properties: { answer: { type: 'string' } } }, example: { answer: 'אור' } },
        response: { schema: { type: 'object', properties: { correct: { type: 'boolean' } } }, example: { correct: true } },
        extraErrors: notFoundErr('החידה', true),
      }),
    },
    '/progress': {
      get: op({
        tag: 'Progress',
        summary: 'ההתקדמות שלי בכל החדרים',
        access: 'user',
        response: { schema: arr(ref('Progress')), example: [progressExample] },
      }),
    },
    '/progress/{roomId}': {
      get: op({
        tag: 'Progress',
        summary: 'ההתקדמות שלי בחדר אחד (אם לא התחילה: status = not_started)',
        access: 'user',
        parameters: [idParam('roomId', 'מזהה החדר')],
        response: { schema: ref('Progress'), example: progressExample },
      }),
    },
    '/progress/{roomId}/start': {
      post: op({
        tag: 'Progress',
        summary: 'התחלת חדר (אם כבר התחילה – מחזיר את ההתקדמות הקיימת)',
        access: 'user',
        parameters: [idParam('roomId', 'מזהה החדר')],
        response: { schema: ref('Progress'), example: { ...progressExample, solvedPuzzleIds: [] } },
        extraErrors: notFoundErr('החדר'),
      }),
    },
    '/progress/{roomId}/restart': {
      post: op({
        tag: 'Progress',
        summary: 'משחק מחדש: מוחק את ההתקדמות הקודמת ומתחיל התקדמות חדשה',
        access: 'user',
        parameters: [idParam('roomId', 'מזהה החדר')],
        response: { schema: ref('Progress'), example: { ...progressExample, status: 'in_progress', solvedPuzzleIds: [] } },
        extraErrors: notFoundErr('החדר'),
      }),
    },
  },
};
