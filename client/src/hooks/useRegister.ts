import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function useRegister() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => register(name, email, password),
    onSuccess: (data) => {
      queryClient.clear(); // לא להשאיר נתונים של משתמשת קודמת
      login(data);
    },
  });
}
