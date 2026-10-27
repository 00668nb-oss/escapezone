import { fetchData } from "./client";
import type { AuthResponse, User } from "../types";

export function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return fetchData("/auth/register", "POST", { name, email, password });
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return fetchData("/auth/login", "POST", { email, password });
}

export function getMe(): Promise<User> {
  return fetchData("/auth/me", "GET");
}
