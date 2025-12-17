import { request } from './http-client.service.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getAllVideos = () => request("/videos");

export const getVideoById = (id) => request(`/videos/${id}`);

export const getVideosByTitle = (title) => request(`/videos/title/${encodeURIComponent(title)}`);

export const getVideosByCategory = (categoryId) => request(`/videos/categories/${categoryId}`);

export const createVideo = async (formData) => {
    const response = await fetch(`${API_URL}/api/videos`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
};

export const updateVideo = (id, data) => request(`/videos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
});

export const deleteVideo = (id) => request(`/videos/${id}`, {
    method: 'DELETE'
});


