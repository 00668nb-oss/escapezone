import { useQuery } from "@tanstack/react-query";
import { getProgress } from "../api/progress";
import { queryKeys } from "../api/queryKeys";

export function useProgress(roomId: number) {
  return useQuery({
    queryKey: queryKeys.roomProgress(roomId),
    queryFn: () => getProgress(roomId),
  });
}
