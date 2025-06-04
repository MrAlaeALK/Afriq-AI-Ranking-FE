import axios from 'axios';
import TRANSLATION_CONFIG from '../config/translation';

// Cache intelligent avec timestamp
const translationCache = new Map();

// Fonction pour nettoyer le cache ancien
const cleanCache = () => {
  const now = Date.now();
  const entries = Array.from(translationCache.entries());
  
  entries.forEach(([key, value]) => {
    if (now - value.timestamp > TRANSLATION_CONFIG.CACHE_DURATION) {
      translationCache.delete(key);
    }
  });
  
  // Limiter la taille du cache
  if (translationCache.size > TRANSLATION_CONFIG.MAX_CACHE_SIZE) {
    const oldestEntries = entries
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, translationCache.size - TRANSLATION_CONFIG.MAX_CACHE_SIZE);
    
    oldestEntries.forEach(([key]) => translationCache.delete(key));
  }
};

// Fonction de traduction avec MyMemory
export const translateWithMyMemory = async (text, sourceLang = 'fr', targetLang = 'en') => {
  if (!text || text.trim() === '') return text;
  
  const cacheKey = `${text.trim()}_${sourceLang}_${targetLang}`;
  
  // Nettoyer le cache périodiquement
  if (Math.random() < 0.1) cleanCache(); // 10% de chance de nettoyer
  
  // Vérifier le cache
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey);
    if (Date.now() - cached.timestamp < TRANSLATION_CONFIG.CACHE_DURATION) {
      console.log('📋 Cache hit:', text.substring(0, 30) + '...');
      return cached.translation;
    }
  }

  try {
    // Construire l'URL avec paramètres
    const params = new URLSearchParams({
      q: text.trim(),
      langpair: `${sourceLang}|${targetLang}`,
    });
    
    // Ajouter l'email si configuré
    if (TRANSLATION_CONFIG.MYMEMORY_EMAIL) {
      params.append('de', TRANSLATION_CONFIG.MYMEMORY_EMAIL);
    }
    
    // Ajouter la clé API si configurée
    if (TRANSLATION_CONFIG.MYMEMORY_API_KEY) {
      params.append('key', TRANSLATION_CONFIG.MYMEMORY_API_KEY);
    }

    console.log('🌍 Traduction MyMemory:', text.substring(0, 30) + '...');
    
    const response = await axios.get(`${TRANSLATION_CONFIG.MYMEMORY_URL}?${params}`);
    
    if (response.data && response.data.responseData) {
      const translatedText = response.data.responseData.translatedText;
      
      // Vérifier la qualité de la traduction
      const match = response.data.responseData.match;
      
      // Sauvegarder dans le cache avec metadata
      translationCache.set(cacheKey, {
        translation: translatedText,
        timestamp: Date.now(),
        quality: match,
        source: 'mymemory'
      });
      
      console.log(` Traduit (qualité: ${match}):`, translatedText.substring(0, 50) + '...');
      return translatedText;
    } else {
      throw new Error('Réponse MyMemory invalide');
    }
    
  } catch (error) {
    console.error('Erreur MyMemory:', error.response?.data || error.message);
    
    // Fallback: retourner le texte original
    return text;
  }
};

// Fonction principale de traduction (français <-> anglais)
export const translateText = async (text, targetLang) => {
  if (!text || typeof text !== 'string') return text;
  
  const sourceLang = targetLang === 'en' ? 'fr' : 'en';
  return await translateWithMyMemory(text, sourceLang, targetLang);
};

// Fonction pour traduction en lot (optimisée)
export const translateBatch = async (texts, targetLang) => {
  const sourceLang = targetLang === 'en' ? 'fr' : 'en';
  const results = [];
  
  // Traiter par petits groupes pour éviter la surcharge
  const batchSize = 5;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (text, index) => {
      try {
        const translation = await translateWithMyMemory(text, sourceLang, targetLang);
        return { index: i + index, original: text, translation };
      } catch (error) {
        return { index: i + index, original: text, translation: text, error: true };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Délai entre les lots pour respecter les limites de taux
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results.sort((a, b) => a.index - b.index);
};

// Utilitaires de cache
export const getCacheStats = () => {
  const entries = Array.from(translationCache.values());
  const now = Date.now();
  
  return {
    totalEntries: translationCache.size,
    freshEntries: entries.filter(e => now - e.timestamp < TRANSLATION_CONFIG.CACHE_DURATION).length,
    oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
    cacheHitRate: entries.filter(e => e.source === 'cache').length / Math.max(entries.length, 1)
  };
};

export const clearCache = () => {
  translationCache.clear();
  console.log('🗑️ Cache de traduction vidé');
};
