import { request } from './httpClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getAllVideos = () => request("/videos");

export const getVideoById = (id) => request(`/videos/${id}`);

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


