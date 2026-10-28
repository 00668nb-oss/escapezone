import { useQuery } from "@tanstack/react-query";
import { getStory } from "../api/rooms";
import { queryKeys } from "../api/queryKeys";

export function useStory(roomId: number) {
  return useQuery({
    queryKey: queryKeys.story(roomId),
    queryFn: () => getStory(roomId),
    retry: false, // 403 (החדר לא הושלם) הוא תשובה סופית, אין טעם לנסות שוב
  });
}
