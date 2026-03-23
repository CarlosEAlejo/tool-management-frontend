import axios from "axios";
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { AuthSession, SessionTokens } from "../../shared/types";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

const isDevelopment = import.meta.env.DEV;
const baseURL = import.meta.env.VITE_API_URL || (isDevelopment ? "/api" : "http://localhost:8000");
const CSRF_COOKIE_NAME = "tool_management_csrf_token";
const CSRF_HEADER_NAME = "X-CSRF-Token";

const createJsonClient = (): AxiosInstance =>
  axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

const client = createJsonClient();
const refreshClient = createJsonClient();

let accessToken: string | null = null;
let refreshPromise: Promise<AuthSession> | null = null;
let authFailureHandler: (error?: unknown) => void = () => {};

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null | undefined): void => {
  accessToken = token || null;
};

export const getCsrfToken = (): string => {
  if (typeof document === "undefined") {
    return "";
  }

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CSRF_COOKIE_NAME}=`));

  if (!cookie) {
    return "";
  }

  return decodeURIComponent(cookie.slice(CSRF_COOKIE_NAME.length + 1));
};

export const hasSessionHint = (): boolean => Boolean(getCsrfToken());

export const storeSessionTokens = ({ accessToken: nextAccessToken }: SessionTokens): void => {
  setAccessToken(nextAccessToken);
};

export const clearStoredSession = (): void => {
  setAccessToken(null);
};

export const setAuthFailureHandler = (handler?: (error?: unknown) => void): void => {
  authFailureHandler = typeof handler === "function" ? handler : () => {};
};

export const refreshSession = async (): Promise<AuthSession> => {
  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    clearStoredSession();
    throw new Error("missing_csrf_token");
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<AuthSession>("/auth/refresh", {}, { headers: { [CSRF_HEADER_NAME]: csrfToken } })
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

    if (!hasSessionHint()) {
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

export { CSRF_HEADER_NAME };
export default client;
