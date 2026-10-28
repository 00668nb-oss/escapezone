import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePuzzle } from "../api/puzzles";
import { queryKeys } from "../api/queryKeys";

export function useDeletePuzzle(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePuzzle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roomPuzzles(roomId) });
    },
  });
}
