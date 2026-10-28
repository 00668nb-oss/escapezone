import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restartRoom } from "../api/progress";
import { queryKeys } from "../api/queryKeys";

export function useRestartRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: number) => restartRoom(roomId),
    onSuccess: (progress, roomId) => {
      // ההתקדמות החדשה נשמרת במטמון מיד, כדי שדף החדר לא יחשוב שהחדר עדיין הושלם
      queryClient.setQueryData(queryKeys.roomProgress(roomId), progress);
      queryClient.invalidateQueries({ queryKey: queryKeys.allProgress() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roomPuzzles(roomId) });
      // בכוונה לא מרעננים את הסיפור: הוא נחשף רק אחרי השלמה, והבקשה הייתה נכשלת (403) בזמן שהמסך עדיין פתוח
    },
  });
}
