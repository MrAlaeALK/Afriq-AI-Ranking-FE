import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { preloadCoreTranslations, loadAllTranslations } from '../i18n';
import { getCacheStats } from '../services/translationService';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const [cacheStats, setCacheStats] = useState({ totalEntries: 0 });

  useEffect(() => {
    const loadEssentialTranslations = async () => {
      try {
        await preloadCoreTranslations();
        setTranslationsLoaded(true);
        loadAllTranslations();
      } catch (error) {
        console.error('Erreur pré-chargement:', error);
      }
    };

    if (!translationsLoaded) {
      loadEssentialTranslations();
    }
  }, [translationsLoaded]);

  useEffect(() => {
    const updateStats = () => setCacheStats(getCacheStats());
    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = async () => {
    setIsTranslating(true);
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    try {
      await i18n.changeLanguage(newLang);
    } catch (error) {
      console.error('Erreur changement langue:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg border font-medium text-sm transition-all duration-200 ${
          isTranslating
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600'
        }`}
        onClick={toggleLanguage}
        disabled={isTranslating}
        aria-label="Changer de langue"
        title={`${cacheStats.totalEntries} traductions en cache`}
      >
        {isTranslating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{t('translating', 'Traduction...')}</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="font-semibold">{t('language')}</span>
            {cacheStats.totalEntries > 0 && (
              <span className="ml-1 text-xs opacity-60 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 px-1 rounded">
                {cacheStats.totalEntries}
              </span>
            )}
          </>
        )}
      </button>

      {!translationsLoaded && (
        <div className="absolute -bottom-8 left-0 text-xs text-blue-600 bg-blue-50 dark:text-blue-200 dark:bg-blue-900 px-2 py-1 rounded">
          <div className="flex items-center">
            <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Chargement MyMemory...
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
