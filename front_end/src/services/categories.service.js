import { request } from './http-client.service.js';

export const getAllCategories = () => request("/categories");
    
