import client from './client';

export const registerUser = async (payload) => {
  const response = await client.post('/auth/register', payload, { skipAuthRefresh: true });
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await client.post('/auth/login', payload, { skipAuthRefresh: true });
  return response.data;
};

export const refreshUserSession = async (refreshToken) => {
  const response = await client.post('/auth/refresh', { refreshToken }, { skipAuthRefresh: true });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

export const logoutUser = async (refreshToken) => {
  const response = await client.post('/auth/logout', { refreshToken }, { skipAuthRefresh: true });
  return response.data;
};
