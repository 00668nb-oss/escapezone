import bcrypt from 'bcryptjs';
import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/db/prisma';

export const api = () => request(app);

export const ADMIN = { email: 'admin@test.com', password: 'Admin123!' };
export const PLAYER = { email: 'player@test.com', password: 'Player123!' };
export const OTHER = { email: 'other@test.com', password: 'Other123!' };

export async function resetDb() {
  await prisma.solvedPuzzle.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.puzzle.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
}

export async function createUser(creds: { email: string; password: string }, role: 'player' | 'admin') {
  return prisma.user.create({
    data: { name: creds.email.split('@')[0]!, email: creds.email, role, passwordHash: await bcrypt.hash(creds.password, 4) },
  });
}

export async function tokenFor(creds: { email: string; password: string }) {
  const res = await api().post('/api/auth/login').send(creds);
  return res.body.token as string;
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function createRoomWithPuzzles(status: 'draft' | 'published' = 'published') {
  return prisma.room.create({
    data: {
      name: 'הספרייה הנעלמת',
      description: 'ספרייה עתיקה',
      imageUrl: '/img.jpg',
      difficulty: 'easy',
      category: 'מסתורין',
      timeLimit: 20,
      status,
      finalText: 'הסוף',
      puzzles: {
        create: [
          { order: 1, title: 'א', prompt: 'p1', hotspotLabel: 'h1', storyText: 'story-1', answer: 'אש' },
          { order: 2, title: 'ב', prompt: 'p2', hotspotLabel: 'h2', storyText: 'story-2', answer: '15' },
        ],
      },
    },
    include: { puzzles: { orderBy: { order: 'asc' } } },
  });
}
