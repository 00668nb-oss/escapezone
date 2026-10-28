import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "../api/rooms";
import { queryKeys } from "../api/queryKeys";

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allRooms() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allProgress() });
    },
  });
}
