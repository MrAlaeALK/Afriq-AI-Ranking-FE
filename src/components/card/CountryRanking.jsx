import { useNavigate } from 'react-router-dom';
import { CountriesRankingContext } from '../../context/CountriesRankingContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

function CountryRanking({ colorScale = 'green-red' }) {
  const { countriesRanking } = useContext(CountriesRankingContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRedirect = () => {
    navigate('/classement');
  };

  return (
    <div className="w-full xl:w-1/3">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-gray-700 h-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('top')}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="pb-3 border-b border-gray-300 dark:border-gray-600 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('rank')}
                </th>
                <th className="pb-3 border-b border-gray-300 dark:border-gray-600 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('country')}
                </th>
                <th className="pb-3 border-b border-gray-300 dark:border-gray-600 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {countriesRanking.slice(0, 10).map((country) => (
                <CountryRow key={country.countryName} country={country} colorScale={colorScale} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-medium rounded-md transition-colors"
            onClick={handleRedirect}
          >
            {t('seeAllRanking')}
          </button>
        </div>
      </div>
    </div>
  );
}

function CountryRow({ country, colorScale }) {
  // Get color based on score
  const getColorByScore = (score) => {
    if (score === undefined) return '#cccccc'; // Default gray for unknown scores

    if (colorScale === 'green-red') {
      if (score >= 80) return '#109618'; // Dark green
      if (score >= 60) return '#7fbd5a'; // Light green
      if (score >= 40) return '#ffeb3b'; // Yellow
      if (score >= 20) return '#f44336'; // Red
      return '#b71c1c'; // Dark red
    } else if (colorScale === 'blue-red') {
      if (score >= 80) return '#1a237e'; // Dark blue
      if (score >= 60) return '#3f51b5'; // Blue
      if (score >= 40) return '#9c27b0'; // Purple
      if (score >= 20) return '#e91e63'; // Pink
      return '#b71c1c'; // Dark red
    } else if (colorScale === 'purple-yellow') {
      if (score >= 80) return '#4a148c'; // Dark purple
      if (score >= 60) return '#9c27b0'; // Purple
      if (score >= 40) return '#e91e63'; // Pink
      if (score >= 20) return '#ff9800'; // Orange
      return '#ffeb3b'; // Yellow
    }

    return '#cccccc'; // Default gray
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="py-3 text-gray-800 dark:text-gray-200">{country.rank}</td>
      <td className="py-3 text-gray-800 dark:text-gray-200 flex items-center">
        <img
          src={`/public/flags/${country.countryCode}.svg`}
          alt={`${country.countryName} flag`}
          className="w-10 h-10 mr-2"
        />
        {country.countryName}
      </td>
      <td
        className="py-3 text-right font-medium"
        style={{ color: getColorByScore(Number(country.finalScore)) }}
      >
        {country.finalScore}
      </td>
    </tr>
  );
}

export default CountryRanking;
