import { request } from './httpClient';

export const getAllVideos = () => request("/videos");

export const getVideoById = (id) => request(`/videos/${id}`);

export const createVideo = (data) => request("/videos", {
    method: 'POST',
    body: JSON.stringify(data)
});

export const updateVideo = (id, data) => request(`/videos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
});

export const deleteVideo = (id) => request(`/videos/${id}`, {
    method: 'DELETE'
});


