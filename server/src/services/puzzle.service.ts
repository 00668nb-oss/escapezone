import type { Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { puzzleBodySchema, puzzleUpdateSchema } from '../schemas/puzzle.schema';
import { notFound } from '../utils/httpError';

type Actor = { id: number; role: Role };

// התשובה לעולם לא נבחרת כאן, ולכן אף Response לא מכיל אותה
const publicSelect = {
  id: true,
  roomId: true,
  order: true,
  title: true,
  prompt: true,
  hotspotLabel: true,
  storyText: true,
  hotspotX: true,
  hotspotY: true,
  hint: true,
  codeLength: true,
} as const;

// השוואת תשובות לא תלויה ברווחים, באותיות גדולות/קטנות, בניקוד ובסימני פיסוק (מקפים, פסיקים, גרשיים)
const normalize = (text: string) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[֑-ׇ]/g, '')
    .replace(/[\s\-_,.'"׳״]/g, '');

async function assertRoomVisible(roomId: number, isAdmin: boolean) {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { status: true } });
  if (!room || (!isAdmin && room.status !== 'published')) throw notFound('החדר');
}

export async function listPuzzles(roomId: number, actor: Actor) {
  const isAdmin = actor.role === 'admin';
  await assertRoomVisible(roomId, isAdmin);

  const puzzles = await prisma.puzzle.findMany({
    where: { roomId },
    orderBy: { order: 'asc' },
    select: publicSelect,
  });
  if (isAdmin) return puzzles;

  // קטע הסיפור נחשף רק לחידות שהשחקנית פתרה
  const solved = await prisma.solvedPuzzle.findMany({
    where: { progress: { userId: actor.id, roomId } },
    select: { puzzleId: true },
  });
  const solvedIds = new Set(solved.map((s) => s.puzzleId));
  return puzzles.map((p) => ({ ...p, solved: solvedIds.has(p.id), storyText: solvedIds.has(p.id) ? p.storyText : null }));
}

export async function createPuzzle(roomId: number, data: z.infer<typeof puzzleBodySchema>) {
  await assertRoomVisible(roomId, true);
  return prisma.puzzle.create({ data: { ...data, roomId }, select: publicSelect });
}

export async function updatePuzzle(id: number, data: z.infer<typeof puzzleUpdateSchema>) {
  return prisma.puzzle.update({ where: { id }, data, select: publicSelect });
}

export async function checkAnswer(puzzleId: number, actor: Actor, answer: string) {
  const puzzle = await prisma.puzzle.findUnique({
    where: { id: puzzleId },
    include: { room: { select: { status: true } } },
  });
  if (!puzzle || (actor.role !== 'admin' && puzzle.room.status !== 'published')) throw notFound('החידה', true);

  const correct = normalize(answer) === normalize(puzzle.answer);
  if (!correct) return { correct: false };

  await prisma.$transaction(async (tx) => {
    const progress = await tx.progress.upsert({
      where: { userId_roomId: { userId: actor.id, roomId: puzzle.roomId } },
      create: { userId: actor.id, roomId: puzzle.roomId },
      update: {},
    });
    await tx.solvedPuzzle.upsert({
      where: { progressId_puzzleId: { progressId: progress.id, puzzleId } },
      create: { progressId: progress.id, puzzleId },
      update: {},
    });
    const [total, solved] = await Promise.all([
      tx.puzzle.count({ where: { roomId: puzzle.roomId } }),
      tx.solvedPuzzle.count({ where: { progressId: progress.id } }),
    ]);
    if (solved >= total && progress.status !== 'completed') {
      await tx.progress.update({
        where: { id: progress.id },
        data: { status: 'completed', completedAt: new Date() },
      });
    }
  });
  return { correct: true };
}
