import apiClient from './apiClient';

export const getPosts = async () => {
  const response = await apiClient.get('/community/posts');
  return response.data;
};

export const getPostById = async (id) => {
  const response = await apiClient.get(`/community/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await apiClient.post('/community/posts', postData);
  return response.data;
};

// ใน src/services/communityService.js
export const communityService = {
  getPosts: () => apiClient.get('/community/posts'),
  getPostById: (id) => apiClient.get(`/community/posts/${id}`),
  createPost: (data) => apiClient.post('/community/posts', data),
  addComment: (postId, data) => apiClient.post(`/community/posts/${postId}/comments`, data),
};