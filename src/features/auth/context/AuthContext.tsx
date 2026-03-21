import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { getApiErrorMessage } from "../../../entities/tool/model";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../../../services/api/authService";
import {
  clearStoredSession,
  getRefreshToken,
  refreshSession,
  setAuthFailureHandler,
  storeSessionTokens,
} from "../../../services/api/client";
import type { LoginPayload, RegisterPayload, User } from "../../../shared/types";

export interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const applyAuthResult = (result: { accessToken: string; refreshToken: string; user: User }, setUser: React.Dispatch<React.SetStateAction<User | null>>): User => {
  storeSessionTokens(result);
  setUser(result.user);
  return result.user;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setAuthFailureHandler(() => {
      setUser(null);
    });

    const initialize = async () => {
      const persistedRefreshToken = getRefreshToken();
      if (!persistedRefreshToken) {
        setInitializing(false);
        return;
      }

      try {
        await refreshSession();
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        clearStoredSession();
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    void initialize();

    return () => {
      setAuthFailureHandler();
    };
  }, []);

  const login = async (credentials: LoginPayload): Promise<User> => {
    try {
      const result = await loginUser(credentials);
      return applyAuthResult(result, setUser);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "No se pudo iniciar sesion"));
    }
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    try {
      const result = await registerUser(payload);
      return applyAuthResult(result, setUser);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "No se pudo completar el registro"));
    }
  };

  const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } finally {
      clearStoredSession();
      setUser(null);
    }
  };

  const refreshProfile = async (): Promise<User> => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
