import { useQueryClient, useMutation } from "@tanstack/react-query";
import { submitAnswer } from "../api/puzzles";
import { queryKeys } from "../api/queryKeys";

export function useSubmitAnswer(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answer }: { id: number; answer: string }) =>
      submitAnswer(id, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roomPuzzles(roomId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roomProgress(roomId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.allProgress() });
    },
  });
}
