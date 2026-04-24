import type { AuthSession, LoginPayload, RegisterPayload, User } from "../../shared/types";
import client, { CSRF_HEADER_NAME, getCsrfToken } from "./client";

const skipAuthRefreshConfig = { skipAuthRefresh: true } as const;

export const registerUser = async (payload: RegisterPayload): Promise<AuthSession> => {
  const response = await client.post<AuthSession>("/auth/register", payload, skipAuthRefreshConfig as never);
  return response.data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthSession> => {
  const response = await client.post<AuthSession>("/auth/login", payload, skipAuthRefreshConfig as never);
  return response.data;
};

export const refreshUserSession = async (): Promise<AuthSession> => {
  const response = await client.post<AuthSession>(
    "/auth/refresh",
    {},
    { ...skipAuthRefreshConfig, headers: { [CSRF_HEADER_NAME]: getCsrfToken() } } as never
  );
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await client.get<User>("/auth/me");
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await client.post("/auth/logout", {}, { ...skipAuthRefreshConfig, headers: { [CSRF_HEADER_NAME]: getCsrfToken() } } as never);
};
