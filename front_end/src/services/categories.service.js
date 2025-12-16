import { request } from './http-Client.service';

export const getAllCategories = () => request("/categories");
    
