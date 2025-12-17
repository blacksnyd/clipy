import { request } from './http-client.service.js';

export const getReviewById = (id) => request(`/reviews/${id}`);

export const getReviewsByVideo = (videoId) => request(`/reviews/video/${videoId}`);

export const createReview = (data) => request("/reviews", {
    method: 'POST',
    body: JSON.stringify(data)
});

export const deleteReview = (id) => request(`/reviews/${id}`, {
    method: 'DELETE'
});

