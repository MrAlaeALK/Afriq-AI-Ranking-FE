import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translateText } from './services/translationService';

// Configuration i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: {
          // HomePage
          // Textes du Hero en français (langue de base)
          heroTitle: 'Découvrez le classement des pays africains par données ouvertes et plus',
          heroDescription: 'Explorez les performances des 54 pays africains avec notre carte interactive et nos outils de comparaison',
          exploreMap: 'Explorer la carte',
          viewRanking: 'Voir le classement',
          exploreAfrica: 'Explorez l\'Afrique',
          africaMapAlt: 'Carte de l\'Afrique',
          
          // Navigation générale
          language: 'FR',
          home: 'Accueil',
          about: 'À Propos',
          card: 'Carte',
          ranking: 'Classement',
          compare: 'Comparer',
          
          // Interface
          loading: 'Chargement...',
          error: 'Erreur',
          search: 'Rechercher un pays...',
          filter: 'Filtrer par région',
          compare: 'Comparer',
          details: 'Détails',
          
          // Messages d'état
          translating: 'Traduction en cours...',
          translationError: 'Erreur de traduction',
          cacheLoaded: 'Traductions en cache',

          // CallToAction
          readyToExplore: 'Prêt à découvrir l\'ouverture des données en Afrique?',
          callToExplore: 'Explorez notre carte interactive et comparez les performances des pays africains en matière de données ouvertes et de développement.',
          exploreCard: 'Explorer la carte',
          knowMore: 'En savoir plus',

          // Criteria
          criteria: 'Critères d\'évaluation',
          seeLess: 'Voir moins',
          seeMore: 'Voir plus',

          // Partners
          partner: 'Nos sources de données',

          // Testimonials
          testimonial: 'Ce qu\'ils en disent',

          // Footer
          platformDesc: 'Plateforme d\'intelligence artificielle africaine pour l\'analyse et la visualisation des données ouvertes',
          methodology: 'Méthodologie',
          dataSource: 'Sources de données',
          copyright: '2025 Afriq\'AI. Tous droits réservés.',

          // Card
          // MapComponent
          rank: 'Rang',
          globalScore: 'Score Global:',
          detailScore: 'Détails du score',

          // MapContainer
          africaCard: 'Carte de l\'Afrique',

          // PageTitle
          titleCard: 'Carte interactive de l\'Afrique',
          titleDesc: 'Explorez et comparez les performances des pays africains selon différents critères.',

          // FilterPanel
          addCriterias: 'Ajouter des critères d\'évaluation',
          addCriteria: 'Ajouter un critère',
          criteriaPond: 'Pondération des critères',
          noCriteria: 'Aucun critère sélectionné.',
          reinitialise: 'Réinitialiser',
          removeCriteria: 'Supprimer ce critère',

          // DisplayOptions
          displayOp: 'Options d\'affichage',
          colorScale: 'Échelle de couleurs',
          gTor: 'Vert à Rouge',
          bTor: 'Bleu à Rouge',
          pToy: 'Violet à Jaune',

          // CountryRanking
          top: 'Top 10 pays',
          country: 'Pays',
          seeAllRanking: 'Voir le classement complet',

          // CountrySelect
          selectCountry: 'Sélectionner un pays...',

          // RankingPage

          searching: 'Rechercher un pays...',
          saveSucces: 'Configuration sauvegardée avec succès !',

          // ExportOptions
          export: 'Exporter',
          
          // RankingChart
          graphiCompare: 'Comparaison graphique',
          selectCountries: 'Sélectionnez des pays dans le tableau pour les comparer',
          compareScorePerCriteria: 'Comparaison des scores par critère',
          selectedCountry: 'Pays sélectionnés',
          titleRanking: 'Classement des pays africains',
          rankingDesc: 'Explorez et comparez les performances des pays africains selon différents critères d\'ouverture des données et de développement.',

          // AdvancedFilters
          choseCriteria: 'Choisissez votre critères personnalisées',
          personalisedPond: 'Pondération personnalisée',
          adjustment: 'Ajustez l\'importance de chaque critère pour personnaliser le classement selon vos priorités.',


          // ComparisonPage
          titleCompare: 'Comparaison des Pays Africains',
          compareDesc: 'Explorez et comparez les performances des pays africains selon différents critères d\'ouverture des données et de développement.',
          enoghCriteria: 'Sélectionnez au moins 3 critères pour voir le graphique radar',
          enoghCountry: 'Sélectionnez au moins un pays pour voir les données',
          alertCriteria: 'Vous devez sélectionner au moins 3 critères pour le graphique radar.',

          // CriteriaSelector
          criteriaSeletor: 'Sélection des critères',
          selectedCriteria: 'critères sélectionnés',
          siCriteriaLow3: 'Minimum 3 requis',

          // CountrySelector
          countriesSelect: 'Sélection des pays',
          selectLessThan5: 'Sélectionnez au plus 5 pays pour la comparaison',
          countrtSelect: 'Sélectionner un pays',

          // CountryCardList
          CountryDetails: 'Détails des pays sélectionnés',

          // RadarChartDisplay
          Download: 'Télécharger PNG',
          scorePerIndice: 'Score par Indicateur',

           // ContactPage
        contactUs: 'Contactez-nous',
        askUs: 'Vous avez des questions ou des suggestions concernant notre plateforme de données africaines ?',
        fillForm: 'N\'hésitez pas à nous contacter en utilisant le formulaire ci-dessous.',
        sendMessage: 'Envoyez-nous un message',

        // ContactForm
        success: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        name: 'Nom',
        subject: 'Sujet',
        sending: 'Envoi en cours...',
        send: 'Envoyer',

        // ContactInfoSection
        coordonne: 'Coordonnées',
        follow: 'Suivez-nous',
        address: 'Adresse',
        theAdd: '123 Avenue de l\'Innovation, Oujda, Maroc',
        tele: 'Téléphone',

        // FAQSection
        questions: 'Foire aux questions',

        // FAQ
        question1: 'Comment puis-je accéder aux données brutes ?',
        reponse1: 'Vous pouvez télécharger les données brutes en format CSV ou PDF depuis la page de chaque pays. Un accès à notre API est également disponible pour les chercheurs et développeurs.',
        question2: 'À quelle fréquence les données sont-elles mises à jour ?',
        reponse2: 'Les données sont mises à jour lorsqu\'une de nos sources publie une nouvelle étude. La date de la dernière mise à jour est indiquée dans la liste déroulante lors de la sélection de l\'année des données.',
        question3: 'Comment puis-je suggérer une correction de données ?',
        reponse3: 'Vous pouvez nous envoyer vos suggestions via le formulaire de contact en précisant le pays et l\'indicateur concernés, ainsi que la source de vos données.',
        },

       
      },
      en: {
        translation: {
          language: 'EN',
        },
      },
    },
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

// Fonction pour pré-charger les traductions essentielles
export const preloadCoreTranslations = async () => {
  const frenchTexts = i18n.getResourceBundle('fr', 'translation');
  const englishTranslations = { language: 'EN' };
  
  // Traductions prioritaires (interface de base)
  const priorityKeys = [
    'heroTitle', 'heroDescription', 'exploreMap', 'viewRanking',
    'home', 'about', 'contact', 'loading', 'error'
  ];
  
  console.log('Pré-chargement des traductions essentielles...');
  
  for (const key of priorityKeys) {
    if (frenchTexts[key] && typeof frenchTexts[key] === 'string') {
      try {
        englishTranslations[key] = await translateText(frenchTexts[key], 'en');
        console.log(` ${key}: ${frenchTexts[key]} → ${englishTranslations[key]}`);
      } catch (error) {
        console.error(`Erreur traduction ${key}:`, error);
        englishTranslations[key] = frenchTexts[key]; // Fallback
      }
    }
  }

  i18n.addResourceBundle('en', 'translation', englishTranslations);
  console.log('Traductions essentielles chargées:', Object.keys(englishTranslations).length);
  
  return englishTranslations;
};

// Fonction pour charger toutes les traductions (en arrière-plan)
export const loadAllTranslations = async () => {
  const frenchTexts = i18n.getResourceBundle('fr', 'translation');
  const currentEnglish = i18n.getResourceBundle('en', 'translation') || { language: 'EN' };
  
  console.log('Chargement de toutes les traductions...');
  
  for (const [key, text] of Object.entries(frenchTexts)) {
    if (typeof text === 'string' && key !== 'language' && !currentEnglish[key]) {
      try {
        currentEnglish[key] = await translateText(text, 'en');
        // Mettre à jour progressivement
        i18n.addResourceBundle('en', 'translation', currentEnglish, true, true);
      } catch (error) {
        console.error(` Erreur traduction ${key}:`, error);
      }
      
      // Petite pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('Toutes les traductions chargées');
};

export default i18n;