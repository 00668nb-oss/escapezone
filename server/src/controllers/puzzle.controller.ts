import type { Request, Response } from 'express';
import { currentUser } from '../middleware/auth';
import { answerSchema, puzzleBodySchema, puzzleUpdateSchema } from '../schemas/puzzle.schema';
import * as puzzleService from '../services/puzzle.service';
import { parseId } from '../utils/httpError';

export async function listForRoom(req: Request, res: Response) {
  res.json(await puzzleService.listPuzzles(parseId(req.params.id), currentUser(req)));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await puzzleService.createPuzzle(parseId(req.params.id), puzzleBodySchema.parse(req.body)));
}

export async function update(req: Request, res: Response) {
  res.json(await puzzleService.updatePuzzle(parseId(req.params.id), puzzleUpdateSchema.parse(req.body)));
}

export async function remove(req: Request, res: Response) {
  res.json(await puzzleService.deletePuzzle(parseId(req.params.id)));
}

export async function answer(req: Request, res: Response) {
  const { answer: text } = answerSchema.parse(req.body);
  res.json(await puzzleService.checkAnswer(parseId(req.params.id), currentUser(req), text));
}
