import apiClient from './apiClient';

export const getEbooks = async (search = '') => {
  const response = await apiClient.get('/ebooks', {
    params: search.trim() ? { search: search.trim() } : undefined,
  });
  return response.data;
};

export const getFavorites = async () => {
  const response = await apiClient.get('/ebooks/favorites');
  return response.data;
};

export const toggleFavoriteEbook = async (ebookId) => {
  const response = await apiClient.post(`/ebooks/${ebookId}/favorite`);
  return response.data;
};
