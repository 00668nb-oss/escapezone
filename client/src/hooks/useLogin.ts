import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginRequest(email, password),
    onSuccess: (data) => {
      queryClient.clear(); // לא להשאיר נתונים של משתמשת קודמת
      login(data);
    },
  });
}
