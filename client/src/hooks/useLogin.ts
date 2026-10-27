import { useMutation } from "@tanstack/react-query";
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginRequest(email, password),
    onSuccess: (data) => login(data),
  });
}
