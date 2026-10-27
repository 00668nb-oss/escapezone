import { useQuery } from "@tanstack/react-query";
import { getStory } from "../api/rooms";
import { queryKeys } from "../api/queryKeys";

export function useStory(roomId: number) {
  return useQuery({
    queryKey: queryKeys.story(roomId),
    queryFn: () => getStory(roomId),
  });
}
