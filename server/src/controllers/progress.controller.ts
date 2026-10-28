import type { Request, Response } from 'express';
import { currentUser } from '../middleware/auth';
import * as progressService from '../services/progress.service';
import { parseId } from '../utils/httpError';

export async function list(req: Request, res: Response) {
  res.json(await progressService.listProgress(currentUser(req).id));
}

export async function getOne(req: Request, res: Response) {
  res.json(await progressService.getProgress(currentUser(req).id, parseId(req.params.roomId)));
}

export async function start(req: Request, res: Response) {
  res.json(await progressService.startRoom(currentUser(req).id, parseId(req.params.roomId)));
}

export async function restart(req: Request, res: Response) {
  res.json(await progressService.restartRoom(currentUser(req).id, parseId(req.params.roomId)));
}

export async function story(req: Request, res: Response) {
  res.json(await progressService.getStory(currentUser(req).id, parseId(req.params.id)));
}
