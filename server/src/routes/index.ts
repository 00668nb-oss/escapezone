import { Router } from 'express';
import { prisma } from '../db/prisma';
import * as auth from '../controllers/auth.controller';
import * as progress from '../controllers/progress.controller';
import * as puzzle from '../controllers/puzzle.controller';
import * as room from '../controllers/room.controller';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth';

export const router = Router();
const admin = [requireAuth, requireRole('admin')];

router.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', requireAuth, auth.me);

router.get('/rooms', optionalAuth, room.list);
router.get('/rooms/:id', optionalAuth, room.getOne);
router.post('/rooms', ...admin, room.create);
router.put('/rooms/:id', ...admin, room.update);

router.get('/rooms/:id/puzzles', requireAuth, puzzle.listForRoom);
router.post('/rooms/:id/puzzles', ...admin, puzzle.create);
router.get('/rooms/:id/story', requireAuth, progress.story);
router.put('/puzzles/:id', ...admin, puzzle.update);
router.delete('/puzzles/:id', ...admin, puzzle.remove);
router.post('/puzzles/:id/answer', requireAuth, puzzle.answer);

router.get('/progress', requireAuth, progress.list);
router.get('/progress/:roomId', requireAuth, progress.getOne);
router.post('/progress/:roomId/start', requireAuth, progress.start);
router.post('/progress/:roomId/restart', requireAuth, progress.restart);
