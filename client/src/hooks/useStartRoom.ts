import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startRoom } from "../api/progress";
import { queryKeys } from "../api/queryKeys";

export function useStartRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: number) => startRoom(roomId),
    onSuccess: (_data, roomId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roomProgress(roomId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.allProgress() });
    },
  });
}
