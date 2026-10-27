import { useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../api/queryKeys";
import type { PuzzleInput } from "../types";
import { createPuzzle, updatePuzzle } from "../api/puzzles";

export function useSavePuzzle(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: Partial<PuzzleInput> }) =>
      id ? updatePuzzle(id, input) : createPuzzle(roomId, input as PuzzleInput),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roomPuzzles(roomId),
      });
    },
  });
}
