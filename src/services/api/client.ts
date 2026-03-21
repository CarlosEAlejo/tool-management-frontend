import axios from "axios";
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { AuthSession, SessionTokens } from "../../shared/types";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const REFRESH_TOKEN_KEY = "tool_management_refresh_token";

const createJsonClient = (): AxiosInstance =>
  axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

const client = createJsonClient();
const refreshClient = createJsonClient();

let accessToken: string | null = null;
let refreshPromise: Promise<AuthSession> | null = null;
let authFailureHandler: (error?: unknown) => void = () => {};

const canUseStorage = (): boolean => typeof window !== "undefined" && Boolean(window.localStorage);

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null | undefined): void => {
  accessToken = token || null;
};

export const getRefreshToken = (): string => {
  if (!canUseStorage()) {
    return "";
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY) || "";
};

export const storeSessionTokens = ({ accessToken: nextAccessToken, refreshToken }: SessionTokens): void => {
  setAccessToken(nextAccessToken);

  if (canUseStorage()) {
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }
};

export const clearStoredSession = (): void => {
  setAccessToken(null);
  if (canUseStorage()) {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const setAuthFailureHandler = (handler?: (error?: unknown) => void): void => {
  authFailureHandler = typeof handler === "function" ? handler : () => {};
};

export const refreshSession = async (): Promise<AuthSession> => {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    throw new Error("missing_refresh_token");
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<AuthSession>("/auth/refresh", { refreshToken: currentRefreshToken })
      .then((response) => {
        storeSessionTokens(response.data);
        return response.data;
      })
      .catch((error: AxiosError) => {
        clearStoredSession();
        authFailureHandler(error);
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const nextConfig = config;
  nextConfig.headers = nextConfig.headers || {};

  if (accessToken) {
    nextConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return nextConfig;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry || originalRequest.skipAuthRefresh) {
      throw error;
    }

    if (!getRefreshToken()) {
      clearStoredSession();
      authFailureHandler(error);
      throw error;
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
      originalRequest.headers = originalRequest.headers || {};
      if (getAccessToken()) {
        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
      }
      return client(originalRequest);
    } catch (refreshError) {
      throw refreshError;
    }
  }
);

export default client;
