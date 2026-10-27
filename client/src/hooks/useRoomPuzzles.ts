import { useQuery } from "@tanstack/react-query";
import { getRoomPuzzles } from "../api/puzzles";
import { queryKeys } from "../api/queryKeys";

export function useRoomPuzzles(roomId: number) {
  return useQuery({
    queryKey: queryKeys.roomPuzzles(roomId),
    queryFn: () => getRoomPuzzles(roomId),
  });
}
