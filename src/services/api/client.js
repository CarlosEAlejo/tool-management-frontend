import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const REFRESH_TOKEN_KEY = 'tool_management_refresh_token';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = null;
let refreshPromise = null;
let authFailureHandler = () => {};

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getRefreshToken = () => {
  if (!canUseStorage()) {
    return '';
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY) || '';
};

export const storeSessionTokens = ({ accessToken: nextAccessToken, refreshToken }) => {
  setAccessToken(nextAccessToken);

  if (canUseStorage()) {
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }
};

export const clearStoredSession = () => {
  setAccessToken(null);
  if (canUseStorage()) {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const setAuthFailureHandler = (handler) => {
  authFailureHandler = typeof handler === 'function' ? handler : () => {};
};

export const refreshSession = async () => {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    throw new Error('missing_refresh_token');
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh', { refreshToken: currentRefreshToken })
      .then((response) => {
        storeSessionTokens(response.data);
        return response.data;
      })
      .catch((error) => {
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

client.interceptors.request.use((config) => {
  const nextConfig = { ...config };
  nextConfig.headers = nextConfig.headers || {};

  if (accessToken) {
    nextConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return nextConfig;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    if (error.response?.status !== 401 || originalRequest._retry || originalRequest.skipAuthRefresh) {
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
