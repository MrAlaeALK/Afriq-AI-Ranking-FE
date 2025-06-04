const TRANSLATION_CONFIG = {
    // MyMemory API (GRATUIT - 1000 requêtes/jour sans clé)
    MYMEMORY_URL: 'https://api.mymemory.translated.net/get',
    
    // Optionnel: Votre email pour plus de requêtes (10000/jour)
    // Inscrivez-vous sur https://mymemory.translated.net/doc/keygen.php
    MYMEMORY_EMAIL: 'abdealghanismen1@gmail.com', // Remplacez par votre email
    
    // Optionnel: Clé API pour usage commercial (100000 requêtes/jour)
    MYMEMORY_API_KEY: '', // Laissez vide pour usage gratuit
    
    // Paramètres de cache
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 heures
    MAX_CACHE_SIZE: 1000, // Nombre max d'entrées en cache
  };
  
  export default TRANSLATION_CONFIG;
  