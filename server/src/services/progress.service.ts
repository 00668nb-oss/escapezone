import { prisma } from '../db/prisma';
import { HttpError, notFound } from '../utils/httpError';

type ProgressRow = {
  roomId: number;
  status: 'in_progress' | 'completed';
  startedAt: Date;
  completedAt: Date | null;
  solved: { puzzleId: number }[];
};

const include = { solved: { select: { puzzleId: true } } } as const;

function toDto(p: ProgressRow) {
  return {
    roomId: p.roomId,
    status: p.status,
    solvedPuzzleIds: p.solved.map((s) => s.puzzleId),
    startedAt: p.startedAt,
    completedAt: p.completedAt,
  };
}

export async function listProgress(userId: number) {
  const rows = await prisma.progress.findMany({ where: { userId }, include, orderBy: { startedAt: 'desc' } });
  return rows.map(toDto);
}

export async function getProgress(userId: number, roomId: number) {
  const row = await prisma.progress.findUnique({ where: { userId_roomId: { userId, roomId } }, include });
  if (!row) {
    return { roomId, status: 'not_started', solvedPuzzleIds: [], startedAt: null, completedAt: null };
  }
  return toDto(row);
}

export async function startRoom(userId: number, roomId: number) {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { status: true } });
  if (!room || room.status !== 'published') throw notFound('החדר');
  const row = await prisma.progress.upsert({
    where: { userId_roomId: { userId, roomId } },
    create: { userId, roomId },
    update: {},
    include,
  });
  return toDto(row);
}

// הסיפור המלא נחשף רק אחרי שהחדר הושלם
export async function getStory(userId: number, roomId: number) {
  const progress = await prisma.progress.findUnique({ where: { userId_roomId: { userId, roomId } } });
  if (progress?.status !== 'completed') throw new HttpError(403, 'הסיפור נחשף רק אחרי השלמת החדר');

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { name: true, finalText: true, puzzles: { orderBy: { order: 'asc' }, select: { id: true, title: true, storyText: true } } },
  });
  if (!room) throw notFound('החדר');
  return { roomName: room.name, puzzles: room.puzzles, finalText: room.finalText };
}
