import { z } from 'zod';

export const puzzleBodySchema = z.object({
  order: z.number().int().min(1).max(50),
  title: z.string().trim().min(1).max(100),
  prompt: z.string().trim().min(1).max(2000),
  hotspotLabel: z.string().trim().min(1).max(50),
  storyText: z.string().trim().min(1).max(3000),
  answer: z.string().trim().min(1).max(200),
  hotspotX: z.number().int().min(0).max(100).nullable().optional(),
  hotspotY: z.number().int().min(0).max(100).nullable().optional(),
  hint: z.string().trim().max(500).nullable().optional(),
  codeLength: z.number().int().min(1).max(8).nullable().optional(),
});

export const puzzleUpdateSchema = puzzleBodySchema.partial();

export const answerSchema = z.object({
  answer: z.string().trim().min(1, 'חובה להזין תשובה').max(200),
});
