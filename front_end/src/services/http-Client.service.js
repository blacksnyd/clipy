const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

//Récupère le token depuis le localStorage
function getToken() {
    return localStorage.getItem('token');
}

//Vérifie si le token est expiré
function isTokenExpired(token) {
    if (!token) return true;
    
    try {
        const payload = token.split('.')[1];
        if (!payload) return true;
        
        const decodedPayload = JSON.parse(atob(payload));
        const exp = decodedPayload.exp;
        
        if (!exp) return false; // Pas de date d'expiration, considéré comme valide
        
        // Vérifier si le token est expiré (exp est en secondes)
        return Date.now() >= exp * 1000;
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return true; // En cas d'erreur, considérer comme expiré
    }
}

//Déconnecte l'utilisateur et recharge la page
function handleUnauthorized() {
    localStorage.removeItem('token');
    // Recharger la page pour mettre à jour l'interface
    window.location.reload();
}

//Effectue une requête HTTP avec gestion automatique du token et des headers
export async function request(path, options = {}) {
    const token = getToken();
    
    // Vérifier si le token est expiré avant de faire la requête
    if (token && !path.includes('/auth/')) {
        if (isTokenExpired(token)) {
            handleUnauthorized();
            throw { success: false, message: 'Token expiré. Veuillez vous reconnecter.' };
        }
    }
    
    const headers = {
        ...options.headers,
    };

    // Ne pas ajouter Content-Type pour FormData (le navigateur le gère automatiquement)
    const isFormData = options.body instanceof FormData;
    if (!isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // Ajouter le token si disponible (sauf pour les routes d'authentification)
    if (token && !path.includes('/auth/')) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api${path}`, {
        headers,
        ...options,
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
                message: `Erreur ${response.status}: ${text.substring(0, 100)}`,
            };
        }
        throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        // Pour les réponses vides (comme 204), retourner un objet success
        return { success: true };
    }
}