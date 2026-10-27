import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse, ContextType, User } from "../types";
import { getMe } from "../api/auth";

const context = createContext<ContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<User | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [isLoadingState, setIsLoadingState] = useState<boolean>(true);

  function login(response: AuthResponse) {
    setUserState(response.user);
    setTokenState(response.token);
    localStorage.setItem("token", response.token);
  }

  function logout() {
    setUserState(null);
    setTokenState(null);
    localStorage.removeItem("token");
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setIsLoadingState(false);
      return;
    }
    setTokenState(storedToken);

    getMe()
      .then((me) => {
        setUserState(me);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setTokenState(null);
      })
      .finally(() => {
        setIsLoadingState(false);
      });
  }, []);

  return (
    <context.Provider
      value={{
        user: userState,
        token: tokenState,
        isLoading: isLoadingState,
        login,
        logout,
      }}
    >
      {children}
    </context.Provider>
  );
}

export function useAuth() {
  const contextValue = useContext(context);
  if (!contextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return contextValue;
}
