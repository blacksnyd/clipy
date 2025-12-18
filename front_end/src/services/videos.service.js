import { request } from './http-client.service.js';

export const getAllVideos = (page) => request(`/videos?page=${page}`);

export const getVideoById = (id) => request(`/videos/${id}`);

export const getVideosByTitle = (title) => request(`/videos/title/${encodeURIComponent(title)}`);

export const getVideosByCategory = (categoryId) => request(`/videos/categories/${categoryId}`);

export const createVideo = (formData) => {
    return request('/videos', {
        method: 'POST',
        body: formData,
    });
};

export const updateVideo = (id, formData) => {
    return request(`/videos/${id}`, {
        method: 'PUT',
        body: formData,
    });
};

export const deleteVideo = (id) => {
    return request(`/videos/${id}`, {
        method: 'DELETE',
    });
};
