import CountryCard from './CountryCard';
import { useTranslation } from 'react-i18next';

export default function CountryCardList({ countryData, selectedCriteria, scores }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-semibold mb-4">{t('CountryDetails')}</h2>
      <div className="grid grid-cols-1 gap-6">
        {countryData.map((country, index) => (
          <CountryCard
            key={country.countryId}
            country={country}
            index={index}
            selectedCriteria={selectedCriteria}
            scores={scores}
          />
        ))}
      </div>
    </div>
  );
}
