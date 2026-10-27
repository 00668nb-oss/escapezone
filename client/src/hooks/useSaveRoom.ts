import { useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../api/queryKeys";
import type { RoomInput } from "../types";
import { createRoom, updateRoom } from "../api/rooms";

export function useSaveRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: RoomInput }) =>
      id ? updateRoom(id, input) : createRoom(input),
    onSuccess: (room) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.allRooms(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.room(room.id) });
    },
  });
}
