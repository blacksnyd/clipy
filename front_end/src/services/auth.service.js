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

//Récupère l'ID utilisateur depuis le token JWT
export const getUserId = () => {
    const token = getToken();
    if (!token) {
        return null;
    }
    
    try {
        // Un JWT est composé de 3 parties : header.payload.signature
        // On décode le payload (2ème partie) qui contient les données utilisateur
        const payload = token.split('.')[1];
        if (!payload) {
            return null;
        }
        
        // Décoder le payload base64
        const decodedPayload = JSON.parse(atob(payload));
        
        // Le backend stocke l'ID dans le champ 'sub'
        return decodedPayload.sub || null;
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
    }
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
