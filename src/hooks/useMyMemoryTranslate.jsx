import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../services/translationService';

export const useMyMemoryTranslate = (originalText, dependencies = []) => {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const translate = useCallback(async () => {
    if (!originalText || typeof originalText !== 'string') {
      setTranslatedText('');
      return;
    }

    // Si c'est du français, pas besoin de traduire
    if (i18n.language === 'fr') {
      setTranslatedText(originalText);
      setError(null);
      setIsFromCache(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const startTime = Date.now();
      const translated = await translateText(originalText, i18n.language);
      const duration = Date.now() - startTime;
      
      setTranslatedText(translated);
      setIsFromCache(duration < 50); // Probablement du cache si très rapide
      
    } catch (err) {
      console.error('❌ Erreur de traduction:', err);
      setError(err);
      setTranslatedText(originalText); // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [originalText, i18n.language]);

  useEffect(() => {
    translate();
  }, [translate, ...dependencies]);

  return { 
    text: translatedText, 
    isLoading, 
    error,
    isFromCache,
    retry: translate
  };
};

// Hook pour traduction de listes avec gestion d'erreurs
export const useMyMemoryTranslateList = (textList, options = {}) => {
  const { i18n } = useTranslation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { batchSize = 3, delay = 200 } = options;

  useEffect(() => {
    if (!Array.isArray(textList) || textList.length === 0) {
      setResults([]);
      return;
    }

    const translateList = async () => {
      if (i18n.language === 'fr') {
        const frResults = textList.map((text, index) => ({
          index,
          original: text,
          translated: text,
          isLoading: false,
          error: null
        }));
        setResults(frResults);
        return;
      }

      setIsLoading(true);
      setProgress(0);
      
      const newResults = textList.map((text, index) => ({
        index,
        original: text,
        translated: text,
        isLoading: true,
        error: null
      }));
      setResults([...newResults]);

      // Traiter par lots
      for (let i = 0; i < textList.length; i += batchSize) {
        const batch = textList.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (text, batchIndex) => {
          const globalIndex = i + batchIndex;
          try {
            const translated = await translateText(text, i18n.language);
            return {
              index: globalIndex,
              original: text,
              translated,
              isLoading: false,
              error: null
            };
          } catch (error) {
            return {
              index: globalIndex,
              original: text,
              translated: text,
              isLoading: false,
              error
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        
        // Mettre à jour les résultats
        setResults(prevResults => {
          const updatedResults = [...prevResults];
          batchResults.forEach(result => {
            updatedResults[result.index] = result;
          });
          return updatedResults;
        });
        
        setProgress(Math.min(100, ((i + batch.length) / textList.length) * 100));
        
        // Délai entre les lots
        if (i + batchSize < textList.length) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      setIsLoading(false);
    };

    translateList();
  }, [textList, i18n.language, batchSize, delay]);

  return { results, isLoading, progress };
};
