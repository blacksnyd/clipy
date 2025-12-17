const API_URL=import.meta.env.VITE_API_URL||'http://localhost:3000';

export async function request(path, options={}) {
    const response = await fetch(`${API_URL}/api${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },  
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
                message: `Erreur ${response.status}: ${text.substring(0, 100)}`
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