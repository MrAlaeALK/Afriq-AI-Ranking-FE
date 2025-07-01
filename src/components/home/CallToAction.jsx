import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


const CallToAction = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleRedirectCard = () => {
    navigate('/carte');
  };
  const handleRedirectContact = () => {
    navigate('/contact');
  };


  return (
    <section className="py-16 bg-purple-700 text-white dark:bg-purple-800 dark:text-white">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-6">{t('readyToExplore')}</h3>
        <p className="text-xl text-purple-100 dark:text-purple-200 mb-8 max-w-2xl mx-auto">
          {t('callToExplore')}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
        <button
            className="px-6 py-3 bg-white text-purple-700 font-medium rounded-lg hover:bg-purple-50 dark:bg-gray-100 dark:hover:bg-gray-200 transition-colors shadow-md"     
            onClick={handleRedirectCard}
          >
            {t('exploreCard')}
        </button>
        <button
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg border border-purple-400 hover:bg-purple-800 dark:bg-purple-700 dark:hover:bg-purple-900 transition-colors shadow-md"
          onClick={handleRedirectContact}
          >
            {t('knowMore')}
        </button>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;
