import type { Request, Response } from 'express';
import { roomBodySchema, roomQuerySchema, roomUpdateSchema } from '../schemas/room.schema';
import * as roomService from '../services/room.service';
import { parseId } from '../utils/httpError';

const isAdmin = (req: Request) => req.user?.role === 'admin';

export async function list(req: Request, res: Response) {
  res.json(await roomService.listRooms(roomQuerySchema.parse(req.query), isAdmin(req)));
}

export async function getOne(req: Request, res: Response) {
  res.json(await roomService.getRoom(parseId(req.params.id), isAdmin(req)));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await roomService.createRoom(roomBodySchema.parse(req.body)));
}

export async function update(req: Request, res: Response) {
  res.json(await roomService.updateRoom(parseId(req.params.id), roomUpdateSchema.parse(req.body)));
}

export async function remove(req: Request, res: Response) {
  res.json(await roomService.deleteRoom(parseId(req.params.id)));
}
