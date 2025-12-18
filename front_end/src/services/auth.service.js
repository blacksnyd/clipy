import { request } from './http-client.service.js';

//Sauvegarde le token dans le localStorage
export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

//Récupère le token depuis le localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

//Supprime le token du localStorage (déconnexion)
export const removeToken = () => {
    localStorage.removeItem('token');
};

//Vérifie si l'utilisateur est connecté
export const isAuthenticated = () => {
    return !!getToken();
};

//Inscrit un nouvel utilisateur
export const register = (userData) => {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

//Connexion d'un utilisateur
export const login = async (credentials) => {
    const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });

    // Sauvegarder le token si la connexion réussit
    if (response.success && response.data?.token) {
        saveToken(response.data.token);
    }

    return response;
};

//Déconnexion de l'utilisateur
export const logout = () => {
    removeToken();
};
