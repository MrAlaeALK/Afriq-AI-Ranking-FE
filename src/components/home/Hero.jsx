import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleRedirectRanking = () => {
    navigate('/classement');
  };
  const handleRedirectCard = () => {
    navigate('/carte');
  };

  return (
    <section className="hero-pattern pt-24 pb-16 md:pt-32 md:pb-24 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              {t('heroTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('heroDescription')}
            </p>
            <div className="flex flex-wrap gap-4">
            <button
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              onClick={handleRedirectCard}
            >
              {t('exploreMap')}
            </button>

            <button
              className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-md"
              onClick={handleRedirectRanking}
            >
              {t('viewRanking')}
            </button>
            
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/images/africa_map.svg"
              alt={t('africaCard')}
              className="w-64 md:w-80 lg:w-96"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
