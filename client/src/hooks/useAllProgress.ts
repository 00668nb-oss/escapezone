import { useQuery } from "@tanstack/react-query";
import { getAllProgress } from "../api/progress";
import { queryKeys } from "../api/queryKeys";

export function useAllProgress() {
  return useQuery({
    queryKey: queryKeys.allProgress(),
    queryFn: () => getAllProgress(),
  });
}
