import jwt from 'jsonwebtoken';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../src/db/prisma';
import { router } from '../src/routes';
import { openapi } from '../src/docs/openapi';
import {
  ADMIN,
  OTHER,
  PLAYER,
  api,
  bearer,
  createRoomWithPuzzles,
  createUser,
  resetDb,
  tokenFor,
} from './helpers';

let adminToken: string;
let playerToken: string;
let otherToken: string;

beforeAll(async () => {
  await resetDb();
  await createUser(ADMIN, 'admin');
  await createUser(PLAYER, 'player');
  await createUser(OTHER, 'player');
  adminToken = await tokenFor(ADMIN);
  playerToken = await tokenFor(PLAYER);
  otherToken = await tokenFor(OTHER);
});

beforeEach(async () => {
  await prisma.solvedPuzzle.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.puzzle.deleteMany();
  await prisma.room.deleteMany();
});

afterAll(async () => {
  await resetDb();
  await prisma.$disconnect();
});

describe('health', () => {
  it('GET /api/health', async () => {
    const res = await api().get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('auth', () => {
  it('login תקין מחזיר token ובלי passwordHash', async () => {
    const res = await api().post('/api/auth/login').send(PLAYER);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toMatchObject({ email: PLAYER.email, role: 'player' });
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });

  it('login עם סיסמה שגויה → 401', async () => {
    const res = await api().post('/api/auth/login').send({ email: PLAYER.email, password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('login עם אימייל לא קיים → 401', async () => {
    const res = await api().post('/api/auth/login').send({ email: 'nobody@test.com', password: 'x' });
    expect(res.status).toBe(401);
  });

  it('register יוצר player, גם אם נשלח role=admin', async () => {
    const res = await api()
      .post('/api/auth/register')
      .send({ name: 'חדשה', email: 'new@test.com', password: 'Password1', role: 'admin' });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('player');
    expect(res.body.token).toBeTruthy();
  });

  it('register עם אימייל קיים → 409', async () => {
    const res = await api().post('/api/auth/register').send({ name: 'דנה', ...PLAYER });
    expect(res.status).toBe(409);
  });

  it('register עם נתונים לא תקינים → 400 עם details', async () => {
    const res = await api().post('/api/auth/register').send({ name: 'ד', email: 'bad', password: '1' });
    expect(res.status).toBe(400);
    expect(res.body.details.length).toBeGreaterThanOrEqual(3);
  });

  it('GET /auth/me בלי Token → 401', async () => {
    expect((await api().get('/api/auth/me')).status).toBe(401);
  });

  it('Token לא תקין → 401', async () => {
    const res = await api().get('/api/auth/me').set(bearer('garbage'));
    expect(res.status).toBe(401);
  });

  it('Token שפג תוקפו → 401', async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: PLAYER.email } });
    const expired = jwt.sign({ role: 'player' }, process.env.JWT_SECRET!, {
      subject: String(user.id),
      expiresIn: -10,
    });
    expect((await api().get('/api/auth/me').set(bearer(expired))).status).toBe(401);
  });

  it('Token חתום בסוד אחר → 401', async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: PLAYER.email } });
    const forged = jwt.sign({ role: 'admin' }, 'another-secret-another-secret', { subject: String(user.id) });
    expect((await api().get('/api/auth/me').set(bearer(forged))).status).toBe(401);
  });

  it('GET /auth/me עם Token תקין', async () => {
    const res = await api().get('/api/auth/me').set(bearer(playerToken));
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(PLAYER.email);
  });
});

describe('rooms – קריאה, חיפוש, סינון ומיון', () => {
  beforeEach(async () => {
    await prisma.room.createMany({
      data: [
        { name: 'הספרייה הנעלמת', description: 'ספרים ונעלם', imageUrl: 'a', difficulty: 'easy', category: 'מסתורין', timeLimit: 20, status: 'published' },
        { name: 'החממה הסודית', description: 'צמחים', imageUrl: 'b', difficulty: 'hard', category: 'הרפתקה', timeLimit: 40, status: 'published' },
        { name: 'חדר טיוטה', description: 'עוד לא מוכן', imageUrl: 'c', difficulty: 'medium', category: 'מסתורין', timeLimit: 30, status: 'draft' },
      ],
    });
  });

  it('אורחת רואה רק חדרים שפורסמו', async () => {
    const res = await api().get('/api/rooms');
    expect(res.status).toBe(200);
    expect(res.body.map((r: { name: string }) => r.name).sort()).toEqual(['הספרייה הנעלמת', 'החממה הסודית'].sort());
  });

  it('שחקנית לא יכולה לבקש טיוטות דרך status', async () => {
    const res = await api().get('/api/rooms?status=draft').set(bearer(playerToken));
    expect(res.body.every((r: { status: string }) => r.status === 'published')).toBe(true);
  });

  it('מנהלת רואה הכול ויכולה לסנן לפי status', async () => {
    expect((await api().get('/api/rooms').set(bearer(adminToken))).body).toHaveLength(3);
    const drafts = await api().get('/api/rooms?status=draft').set(bearer(adminToken));
    expect(drafts.body).toHaveLength(1);
  });

  it('חיפוש לפי טקסט', async () => {
    const res = await api().get('/api/rooms?search=חממה');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('החממה הסודית');
  });

  it('סינון לפי קושי וקטגוריה', async () => {
    expect((await api().get('/api/rooms?difficulty=hard')).body).toHaveLength(1);
    expect((await api().get('/api/rooms?category=מסתורין')).body).toHaveLength(1);
  });

  it('מיון לפי זמן יורד', async () => {
    const res = await api().get('/api/rooms?sort=timeLimit&order=desc');
    expect(res.body.map((r: { timeLimit: number }) => r.timeLimit)).toEqual([40, 20]);
  });

  it('פרמטר מיון לא חוקי → 400', async () => {
    expect((await api().get('/api/rooms?sort=password')).status).toBe(400);
  });

  it('GET /rooms/:id לטיוטה: 404 לשחקנית, 200 למנהלת', async () => {
    const draft = await prisma.room.findFirstOrThrow({ where: { status: 'draft' } });
    expect((await api().get(`/api/rooms/${draft.id}`).set(bearer(playerToken))).status).toBe(404);
    expect((await api().get(`/api/rooms/${draft.id}`).set(bearer(adminToken))).status).toBe(200);
  });

  it('מזהה לא תקין → 400', async () => {
    expect((await api().get('/api/rooms/abc')).status).toBe(400);
  });
});

describe('rooms – יצירה ועריכה (CRUD למנהלת)', () => {
  const body = {
    name: 'החדר שבו הזמן עצר',
    description: 'שעונים עצרו',
    imageUrl: '/time.jpg',
    difficulty: 'medium',
    category: 'מסתורין',
    timeLimit: 25,
  };

  it('POST בלי Token → 401', async () => {
    expect((await api().post('/api/rooms').send(body)).status).toBe(401);
  });

  it('POST כשחקנית → 403', async () => {
    expect((await api().post('/api/rooms').set(bearer(playerToken)).send(body)).status).toBe(403);
  });

  it('POST כמנהלת → 201, סטטוס ברירת מחדל draft, וקיים ב-DB', async () => {
    const res = await api().post('/api/rooms').set(bearer(adminToken)).send(body);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('draft');
    expect(await prisma.room.count({ where: { id: res.body.id } })).toBe(1);
  });

  it('POST עם ולידציה שגויה → 400', async () => {
    const res = await api()
      .post('/api/rooms')
      .set(bearer(adminToken))
      .send({ ...body, difficulty: 'impossible', timeLimit: 999 });
    expect(res.status).toBe(400);
  });

  it('PUT כמנהלת מעדכן, כשחקנית → 403, לא קיים → 404', async () => {
    const room = await createRoomWithPuzzles();
    const ok = await api().put(`/api/rooms/${room.id}`).set(bearer(adminToken)).send({ timeLimit: 33, status: 'archived' });
    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({ timeLimit: 33, status: 'archived' });
    expect((await api().put(`/api/rooms/${room.id}`).set(bearer(playerToken)).send({ timeLimit: 5 })).status).toBe(403);
    expect((await api().put('/api/rooms/999999').set(bearer(adminToken)).send({ timeLimit: 5 })).status).toBe(404);
  });
});

describe('puzzles', () => {
  it('GET puzzles בלי Token → 401', async () => {
    const room = await createRoomWithPuzzles();
    expect((await api().get(`/api/rooms/${room.id}/puzzles`)).status).toBe(401);
  });

  it('שחקנית לא מקבלת answer, ו-storyText מוסתר עד פתרון', async () => {
    const room = await createRoomWithPuzzles();
    const res = await api().get(`/api/rooms/${room.id}/puzzles`).set(bearer(playerToken));
    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body)).not.toContain('"answer"');
    expect(res.body.map((p: { storyText: unknown }) => p.storyText)).toEqual([null, null]);
  });

  it('גם למנהלת אין answer ברשימה (answer לא חוזר באף endpoint)', async () => {
    const room = await createRoomWithPuzzles();
    const res = await api().get(`/api/rooms/${room.id}/puzzles`).set(bearer(adminToken));
    expect(JSON.stringify(res.body)).not.toContain('"answer"');
    expect(res.body[0].storyText).toBe('story-1');
  });

  it('חידות של חדר טיוטה: 404 לשחקנית', async () => {
    const room = await createRoomWithPuzzles('draft');
    expect((await api().get(`/api/rooms/${room.id}/puzzles`).set(bearer(playerToken))).status).toBe(404);
  });

  it('POST חידה: מנהלת 201 (בלי answer בתשובה), שחקנית 403, order כפול 409', async () => {
    const room = await createRoomWithPuzzles();
    const body = { order: 3, title: 'ג', prompt: 'p', hotspotLabel: 'h', storyText: 's', answer: 'סוד' };
    const created = await api().post(`/api/rooms/${room.id}/puzzles`).set(bearer(adminToken)).send(body);
    expect(created.status).toBe(201);
    expect(created.body.answer).toBeUndefined();
    expect((await api().post(`/api/rooms/${room.id}/puzzles`).set(bearer(playerToken)).send({ ...body, order: 4 })).status).toBe(403);
    expect((await api().post(`/api/rooms/${room.id}/puzzles`).set(bearer(adminToken)).send(body)).status).toBe(409);
    expect((await api().post(`/api/rooms/${room.id}/puzzles`).set(bearer(adminToken)).send({ order: 9 })).status).toBe(400);
  });

  it('PUT חידה: מנהלת מעדכנת, והתשובה החדשה נבדקת', async () => {
    const room = await createRoomWithPuzzles();
    const puzzle = room.puzzles[0]!;
    expect((await api().put(`/api/puzzles/${puzzle.id}`).set(bearer(playerToken)).send({ answer: 'x' })).status).toBe(403);
    const res = await api().put(`/api/puzzles/${puzzle.id}`).set(bearer(adminToken)).send({ answer: 'מים' });
    expect(res.status).toBe(200);
    const check = await api().post(`/api/puzzles/${puzzle.id}/answer`).set(bearer(playerToken)).send({ answer: 'מים' });
    expect(check.body).toEqual({ correct: true });
  });
});

describe('מחיקת חדר', () => {
  it('DELETE חדר: מנהלת מוחקת (עם החידות), שחקנית 403, חדר לא קיים 404', async () => {
    const room = await createRoomWithPuzzles();
    expect((await api().delete(`/api/rooms/${room.id}`).set(bearer(playerToken))).status).toBe(403);
    expect((await api().delete(`/api/rooms/${room.id}`)).status).toBe(401);
    const res = await api().delete(`/api/rooms/${room.id}`).set(bearer(adminToken));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(await prisma.room.count({ where: { id: room.id } })).toBe(0);
    expect(await prisma.puzzle.count({ where: { roomId: room.id } })).toBe(0);
    expect((await api().delete(`/api/rooms/${room.id}`).set(bearer(adminToken))).status).toBe(404);
  });
});

describe('מחיקת חידה', () => {
  it('DELETE חידה: מנהלת מוחקת (201 לא נדרש), שחקנית 403, חידה לא קיימת 404', async () => {
    const room = await createRoomWithPuzzles();
    const puzzle = room.puzzles[0]!;
    expect((await api().delete(`/api/puzzles/${puzzle.id}`).set(bearer(playerToken))).status).toBe(403);
    expect((await api().delete(`/api/puzzles/${puzzle.id}`)).status).toBe(401);
    const res = await api().delete(`/api/puzzles/${puzzle.id}`).set(bearer(adminToken));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(await prisma.puzzle.count({ where: { id: puzzle.id } })).toBe(0);
    expect((await api().delete(`/api/puzzles/${puzzle.id}`).set(bearer(adminToken))).status).toBe(404);
  });
});

describe('answers + progress', () => {
  it('תשובה בלי Token → 401', async () => {
    const room = await createRoomWithPuzzles();
    expect((await api().post(`/api/puzzles/${room.puzzles[0]!.id}/answer`).send({ answer: 'אש' })).status).toBe(401);
  });

  it('תשובה שגויה מחזירה רק {correct:false} ולא נשמרת', async () => {
    const room = await createRoomWithPuzzles();
    const res = await api().post(`/api/puzzles/${room.puzzles[0]!.id}/answer`).set(bearer(playerToken)).send({ answer: 'לא נכון' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ correct: false });
    expect(await prisma.solvedPuzzle.count()).toBe(0);
  });

  it('תשובה נכונה (גם עם רווחים ואותיות גדולות) נשמרת וחושפת סיפור', async () => {
    const room = await createRoomWithPuzzles();
    const [p1] = room.puzzles;
    const res = await api().post(`/api/puzzles/${p1!.id}/answer`).set(bearer(playerToken)).send({ answer: '  אש ' });
    expect(res.body).toEqual({ correct: true });

    const puzzles = await api().get(`/api/rooms/${room.id}/puzzles`).set(bearer(playerToken));
    expect(puzzles.body[0]).toMatchObject({ solved: true, storyText: 'story-1' });
    expect(puzzles.body[1]).toMatchObject({ solved: false, storyText: null });

    const progress = await api().get(`/api/progress/${room.id}`).set(bearer(playerToken));
    expect(progress.body).toMatchObject({ status: 'in_progress', solvedPuzzleIds: [p1!.id] });
  });

  it('פתרון כל החידות משלים את החדר ופותח את הסיפור', async () => {
    const room = await createRoomWithPuzzles();
    expect((await api().get(`/api/rooms/${room.id}/story`).set(bearer(playerToken))).status).toBe(403);

    for (const [p, answer] of [[room.puzzles[0]!, 'אש'], [room.puzzles[1]!, '15']] as const) {
      await api().post(`/api/puzzles/${p.id}/answer`).set(bearer(playerToken)).send({ answer });
    }
    const progress = await api().get(`/api/progress/${room.id}`).set(bearer(playerToken));
    expect(progress.body.status).toBe('completed');
    expect(progress.body.completedAt).toBeTruthy();

    const story = await api().get(`/api/rooms/${room.id}/story`).set(bearer(playerToken));
    expect(story.status).toBe(200);
    expect(story.body.finalText).toBe('הסוף');
    expect(story.body.puzzles).toHaveLength(2);
  });

  it('ההתקדמות פרטית: משתמשת אחרת לא רואה אותה', async () => {
    const room = await createRoomWithPuzzles();
    await api().post(`/api/puzzles/${room.puzzles[0]!.id}/answer`).set(bearer(playerToken)).send({ answer: 'אש' });

    const other = await api().get(`/api/progress/${room.id}`).set(bearer(otherToken));
    expect(other.body).toMatchObject({ status: 'not_started', solvedPuzzleIds: [] });
    expect((await api().get('/api/progress').set(bearer(otherToken))).body).toEqual([]);
    expect((await api().get('/api/progress').set(bearer(playerToken))).body).toHaveLength(1);
    expect((await api().get(`/api/rooms/${room.id}/story`).set(bearer(otherToken))).status).toBe(403);

    const puzzles = await api().get(`/api/rooms/${room.id}/puzzles`).set(bearer(otherToken));
    expect(puzzles.body[0].storyText).toBeNull();
  });

  it('ההתקדמות נקבעת לפי ה-Token ולא לפי userId שנשלח', async () => {
    const room = await createRoomWithPuzzles();
    const victim = await prisma.user.findUniqueOrThrow({ where: { email: OTHER.email } });
    await api()
      .post(`/api/puzzles/${room.puzzles[0]!.id}/answer`)
      .set(bearer(playerToken))
      .send({ answer: 'אש', userId: victim.id });
    expect(await prisma.progress.count({ where: { userId: victim.id } })).toBe(0);
  });

  it('POST start יוצר התקדמות, פעמיים לא מכפיל, ולחדר טיוטה → 404', async () => {
    const room = await createRoomWithPuzzles();
    const draft = await prisma.room.create({
      data: { name: 'טיוטה', description: 'd', imageUrl: 'i', difficulty: 'easy', category: 'c', timeLimit: 5 },
    });
    await api().post(`/api/progress/${room.id}/start`).set(bearer(playerToken));
    const again = await api().post(`/api/progress/${room.id}/start`).set(bearer(playerToken));
    expect(again.status).toBe(200);
    expect(await prisma.progress.count()).toBe(1);
    expect((await api().post(`/api/progress/${draft.id}/start`).set(bearer(playerToken))).status).toBe(404);
  });

  it('POST restart מוחק את ההתקדמות (כולל חידות שנפתרו) ומתחיל מחדש', async () => {
    const room = await createRoomWithPuzzles();
    await api().post(`/api/progress/${room.id}/start`).set(bearer(playerToken));
    const first = room.puzzles[0]!;
    const solved = await api().post(`/api/puzzles/${first.id}/answer`).set(bearer(playerToken)).send({ answer: first.answer });
    expect(solved.body).toEqual({ correct: true });

    const restarted = await api().post(`/api/progress/${room.id}/restart`).set(bearer(playerToken));
    expect(restarted.status).toBe(200);
    expect(restarted.body).toMatchObject({ roomId: room.id, status: 'in_progress', solvedPuzzleIds: [] });
    expect(await prisma.solvedPuzzle.count()).toBe(0);
    expect(await prisma.progress.count()).toBe(1);
    expect((await api().post(`/api/progress/${room.id}/restart`)).status).toBe(401);
  });

  it('תשובה ריקה → 400', async () => {
    const room = await createRoomWithPuzzles();
    expect((await api().post(`/api/puzzles/${room.puzzles[0]!.id}/answer`).set(bearer(playerToken)).send({ answer: '' })).status).toBe(400);
  });
});

describe('swagger / openapi', () => {
  it('/api-docs ו-/openapi.json נגישים', async () => {
    expect((await api().get('/api-docs/').redirects(1)).status).toBe(200);
    const spec = await api().get('/openapi.json');
    expect(spec.status).toBe(200);
    expect(spec.body.openapi).toMatch(/^3\./);
    expect(spec.body.components.securitySchemes.bearerAuth).toMatchObject({ type: 'http', scheme: 'bearer' });
  });

  it('כל route בשרת מתועד ב-OpenAPI (ולהפך)', () => {
    const real = new Set<string>();
    for (const layer of (router as unknown as { stack: { route?: { path: string; methods: Record<string, boolean> } }[] }).stack) {
      if (!layer.route) continue;
      const path = layer.route.path.replace(/:(\w+)/g, '{$1}');
      for (const method of Object.keys(layer.route.methods)) real.add(`${method} ${path}`);
    }
    const documented = new Set<string>();
    for (const [path, ops] of Object.entries(openapi.paths)) {
      for (const method of Object.keys(ops)) documented.add(`${method} ${path}`);
    }
    expect([...documented].sort()).toEqual([...real].sort());
  });
});
