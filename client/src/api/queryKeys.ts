import type { RoomFilters } from "../types";

export const queryKeys = {
  room: (roomId: number | undefined) => ["room", roomId] as const,
  rooms: (filters?: RoomFilters) => ["rooms", filters] as const,
  allRooms: () => ["rooms"] as const,
  roomPuzzles: (roomId: number) => ["roomPuzzles", roomId] as const,
  allProgress: () => ["progress"] as const,
  roomProgress: (roomId: number) => ["roomProgress", roomId] as const,
  story: (roomId: number) => ["story", roomId] as const,
};
