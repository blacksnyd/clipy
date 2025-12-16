import { request } from './httpClient';

export const getAllCategories = () => request("/categories");
    
