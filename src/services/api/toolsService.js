import client from './client';

const RESOURCE = '/herramientas';

const buildQueryParams = (filters = {}) =>
  Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      acc[key] = value;
    }
    return acc;
  }, {});

export const listTools = async (filters = {}) => {
  const response = await client.get(RESOURCE, { params: buildQueryParams(filters) });
  return response.data ?? [];
};

export const getToolById = async (id) => {
  const response = await client.get(`${RESOURCE}/${id}`);
  return response.data;
};

export const createTool = async (payload) => {
  const response = await client.post(RESOURCE, payload);
  return response.data;
};

export const updateTool = async (id, payload) => {
  const response = await client.put(`${RESOURCE}/${id}`, payload);
  return response.data;
};

export const deleteTool = async (id) => {
  await client.delete(`${RESOURCE}/${id}`);
};
