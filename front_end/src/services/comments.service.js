import { request } from './http-Client.service.js';

export const getCommentsByVideo = (videoId) =>
  request(`/comments/${videoId}`);

export const createComment = (data) =>
  request('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteComment = (id) =>
  request(`/comments/${id}`, {
    method: 'DELETE',
  });
