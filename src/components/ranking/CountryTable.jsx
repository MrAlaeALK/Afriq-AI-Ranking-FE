import { DimensionContext } from "../../context/DimensionContext";
import { ScoresContext } from "../../context/ScoresContext";
import { useContext } from "react";
import { YearDimensionContext } from "../../context/YearDimensionContext";
import { useTranslation } from "react-i18next";

const CountryTable = ({ filteredCountriesRanking, selectedCountries, onCountrySelect, requestSort, sortConfig  }) => {

  const {yearDimensions} = useContext(YearDimensionContext);
  const {scores} = useContext(ScoresContext);
  const {t} = useTranslation();
  
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // Map des couleurs pour chaque critère
  const criteriaColors = [
    { bg: 'bg-green-100', text: 'text-green-800', bar: 'bg-green-500' },
    { bg: 'bg-blue-100', text: 'text-blue-800', bar: 'bg-blue-500' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800', bar: 'bg-yellow-500' },
    { bg: 'bg-red-100', text: 'text-red-800', bar: 'bg-red-500' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800', bar: 'bg-indigo-500' },
    { bg: 'bg-pink-100', text: 'text-pink-800', bar: 'bg-pink-500' },
    { bg: 'bg-teal-100', text: 'text-teal-800', bar: 'bg-teal-500' },
    { bg: 'bg-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-500' },
    { bg: 'bg-purple-100', text: 'text-purple-800', bar: 'bg-purple-600' }
  ];

const getCriteriaColor = (dimension, dimensionsList) => {
  const index = dimensionsList.indexOf(dimension);
  if (index === -1) return '#6b7280'; // default gray
  return criteriaColors[index % criteriaColors.length];
};

  // Labels pour les critères
  const criteriaLabels = {
    odin: 'ODIN',
    hdi: 'IDH',
    internet: 'Internet',
    education: 'Éducation',
    gdp: 'PIB',
    innovation: 'Innovation',
    governance: 'Gouvernance',
    health: 'Santé',
    environment: 'Environnement'
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="w-12 py-3 px-4 text-left"></th>
            <th
              className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => requestSort('rank')}
            >
              <div className="flex items-center">
                {t('rank')}
                <span className="ml-1">
                  {getClassNamesFor('rank') === 'ascending' ? '↑' : getClassNamesFor('rank') === 'descending' ? '↓' : '↕'}
                </span>
              </div>
            </th>
            <th className="w-12 py-3 px-4 text-left"></th>
            <th
              className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => requestSort('countryName')}
            >
              <div className="flex items-center">
                {t('country')}
                <span className="ml-1">
                  {getClassNamesFor('countryName') === 'ascending' ? '↑' : getClassNamesFor('countryName') === 'descending' ? '↓' : '↕'}
                </span>
              </div>
            </th>
            <th
              className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => requestSort('finalScore')}
            >
              <div className="flex items-center">
                Score global
                <span className="ml-1">
                  {getClassNamesFor('finalScore') === 'ascending' ? '↑' : getClassNamesFor('finalScore') === 'descending' ? '↓' : '↕'}
                </span>
              </div>
            </th>

            {/* Colonnes dynamiques basées sur les poids sélectionnés */}
            {yearDimensions.map(dimension => (
              <th
                key={dimension.id}
                className="py-3 px-4 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort(dimension.name)}
              >
                <div className="flex items-center">
                  <span className={`${getCriteriaColor(dimension, yearDimensions).bg || 'gray-100'} ${getCriteriaColor(dimension, yearDimensions).text || 'text-gray-800'} px-2 py-1 rounded`}>
                    {criteriaLabels[dimension] || dimension.name.toUpperCase()}
                  </span>
                  <span className="ml-1">
                    {getClassNamesFor(dimension.name) === 'ascending' ? '↑' : getClassNamesFor(dimension.name) === 'descending' ? '↓' : '↕'}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredCountriesRanking.map((country) => (
            <tr
              key={country.countryName}
              className={`border-t border-gray-200 dark:border-gray-700 ${selectedCountries.includes(country.countryName) ? 'bg-purple-50 dark:bg-purple-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  checked={selectedCountries.includes(country.countryName)}
                  onChange={() => onCountrySelect(country.countryName)}
                />
              </td>
              <td className="py-3 px-4 font-medium">
                {country.rank}
              </td>
              <td className="py-3 px-4 min-w-[100px] ">
                <img
                  src={`/public/flags/${country.countryCode}.svg`}
                  alt={`${country.countryName} flag`}
                  className="w-10 h-10 object-contain"
                />
              </td>
              <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                {country.countryName}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${country.finalScore || country.scores.global}%` }}
                    ></div>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">{country.finalScore || country.scores.global}</span>
                </div>
              </td>

              {/* Cellules dynamiques basées sur les poids sélectionnés */}
              {yearDimensions.map(dimension => (
                <td key={dimension.id} className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className={`${getCriteriaColor(dimension, yearDimensions).bar || 'bg-gray-500'} h-2.5 rounded-full`}
                        style={{ width: `${scores.find(score => score.countryName === country.countryName && score.dimensionName === dimension.name).score || 0}%` }}
                      ></div>
                    </div>
                    <span>{scores.find(score => score.countryName === country.countryName && score.dimensionName === dimension.name).score.toFixed(2) || 0}</span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountryTable;