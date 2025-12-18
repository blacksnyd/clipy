const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

//Récupère le token depuis le localStorage
function getToken() {
    return localStorage.getItem('token');
}

//Effectue une requête HTTP avec gestion automatique du token et des headers
export async function request(path, options = {}) {
    const token = getToken();
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