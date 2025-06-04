import { getCountryGroups } from './Data';
import { useTranslation } from 'react-i18next';

export default function CountrySelector({ selectedCountries, onCountryChange, countriesRanking }) {
  const countryGroups = getCountryGroups(countriesRanking);
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-semibold mb-4">{t('countriesSelect')}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('selectLessThan5')}</p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className="mb-4">
            <select
              className="w-full p-3 pl-4 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 appearance-none transition-all"
              value={selectedCountries[index] || ''}
              onChange={(e) => onCountryChange(index, e.target.value)}
            >
              <option value="">{t('countrtSelect')}</option>
              {Object.keys(countryGroups).map(region => (
                <optgroup key={region} label={region}>
                  {countryGroups[region].map(country => (
                    <option key={country.countryId} value={country.countryId}>
                      {country.countryName[0]} {country.countryName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
