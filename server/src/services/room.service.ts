import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { roomBodySchema, roomQuerySchema, roomUpdateSchema } from '../schemas/room.schema';
import { notFound } from '../utils/httpError';

type RoomQuery = z.infer<typeof roomQuerySchema>;

const withCount = { _count: { select: { puzzles: true } } } as const;

function toDto<T extends { _count: { puzzles: number } }>(room: T) {
  const { _count, ...rest } = room;
  return { ...rest, puzzleCount: _count.puzzles };
}

export async function listRooms(query: RoomQuery, isAdmin: boolean) {
  const where: Prisma.RoomWhereInput = {
    // שחקנית רואה רק חדרים שפורסמו. מנהלת יכולה לסנן לפי כל סטטוס.
    status: isAdmin ? query.status : 'published',
    category: query.category,
    difficulty: query.difficulty,
  };
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  const rooms = await prisma.room.findMany({
    where,
    orderBy: { [query.sort]: query.order },
    include: withCount,
  });
  return rooms.map(toDto);
}

export async function getRoom(id: number, isAdmin: boolean) {
  const room = await prisma.room.findUnique({ where: { id }, include: withCount });
  if (!room || (!isAdmin && room.status !== 'published')) throw notFound('החדר');
  return toDto(room);
}

export async function createRoom(data: z.infer<typeof roomBodySchema>) {
  return toDto(await prisma.room.create({ data, include: withCount }));
}

export async function updateRoom(id: number, data: z.infer<typeof roomUpdateSchema>) {
  return toDto(await prisma.room.update({ where: { id }, data, include: withCount }));
}

// מחיקת חדר: החידות וההתקדמות של השחקנים נמחקות איתו (onDelete: Cascade בסכמה)
export async function deleteRoom(id: number) {
  const room = await prisma.room.findUnique({ where: { id }, select: { id: true } });
  if (!room) throw notFound('החדר');
  await prisma.room.delete({ where: { id } });
  return { ok: true };
}
