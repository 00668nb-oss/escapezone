import { useQuery } from "@tanstack/react-query";
import { getRoom } from "../api/rooms";
import { queryKeys } from "../api/queryKeys";

export function useRoom(roomId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.room(roomId as number),
    queryFn: () => getRoom(roomId as number),
    enabled: roomId !== undefined,
  });
}
