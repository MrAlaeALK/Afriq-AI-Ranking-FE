import { createContext, useState, useEffect } from 'react';
import { getAvailableYears } from '../services/publicService';

export const YearContext = createContext();
export const YearProvider = ({ children }) => {
    const [year, setYear] = useState(2025);
    const [availableYears, setAvailableYears] = useState([2025]); // Seulement l'année actuelle par défaut
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Timeout de sécurité - forcer l'arrêt du loading après 3 secondes
        const timeoutId = setTimeout(() => {
            console.warn('⚠️ Timeout: arrêt forcé du chargement des années');
            setLoading(false);
            // Ne pas modifier availableYears dans le timeout, garder ce qui a été récupéré
        }, 3000);

        // Récupérer les années disponibles au démarrage
        const fetchAvailableYears = async () => {
            setLoading(true);
            try {
                const response = await getAvailableYears();
                const years = response || []; // handleApiResponse retourne déjà response.data.data
                
                if (years.length > 0) {
                    setAvailableYears(years);
                    
                    // Si 2025 n'est pas dans la liste, prendre la première année disponible
                    if (!years.includes(2025)) {
                        setYear(years[0]); // Première année disponible (la plus récente)
                    }
                }
                console.log('✅ Années récupérées depuis l\'API:', years);
                console.log('🔍 DEBUG - Contenu détaillé des années:', JSON.stringify(years));
                console.log('🔍 DEBUG - Type de données:', typeof years, Array.isArray(years));
                
                // Nettoyer le timeout si l'API a répondu avec succès
                clearTimeout(timeoutId);
                setLoading(false);
            } catch (error) {
                console.error('❌ Erreur lors de la récupération des années:', error);
                // En cas d'erreur, garder seulement l'année par défaut (pas de 2021 fantôme)
                console.log('📝 Utilisation du fallback: [2025] uniquement');
                setAvailableYears([2025]);
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        fetchAvailableYears();

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <YearContext.Provider value={{ year, setYear, availableYears, loading }}>
            {children}
        </YearContext.Provider>
    )
}