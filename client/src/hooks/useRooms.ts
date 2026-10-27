import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api/rooms";
import { queryKeys } from "../api/queryKeys";
import type { RoomFilters } from "../types";

export function useRooms(filters?: RoomFilters) {
  return useQuery({
    queryKey: queryKeys.rooms(filters),
    queryFn: () => getRooms(filters),
  });
}
