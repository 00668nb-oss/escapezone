import { z } from 'zod';

const difficulty = z.enum(['easy', 'medium', 'hard']);
const status = z.enum(['draft', 'published', 'archived']);

export const roomBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(1).max(2000),
  imageUrl: z.string().trim().min(1).max(500),
  difficulty,
  category: z.string().trim().min(1).max(50),
  timeLimit: z.number().int().min(1).max(180),
  status: status.default('draft'),
  finalText: z.string().trim().max(5000).nullable().optional(),
});

export const roomUpdateSchema = roomBodySchema.partial();

export const roomQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  difficulty: difficulty.optional(),
  status: status.optional(),
  sort: z.enum(['name', 'difficulty', 'category', 'timeLimit', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
