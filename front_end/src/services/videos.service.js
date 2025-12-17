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

export const updateVideo = async (id, formData) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${API_URL}/api/videos/${id}`, {
        method: 'PUT',
        body: formData
    });

    if (!response.ok) {
        let error;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            error = await response.json();
        } else {
            const text = await response.text();
            error = {
                success: false,
                message: `Erreur ${response.status}: ${text.substring(0, 100)}`
            };
        }
        throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        const text = await response.text();
        throw new Error(`Réponse invalide du serveur: ${text.substring(0, 100)}`);
    }
};

export const deleteVideo = (id) => request(`/videos/${id}`, {
    method: 'DELETE'
});


