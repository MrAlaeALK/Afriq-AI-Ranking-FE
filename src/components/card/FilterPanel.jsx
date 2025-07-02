import { useEffect, useContext } from 'react';
import { DimensionContext } from '../../context/DimensionContext';
import { CountriesRankingContext } from '../../context/CountriesRankingContext';
import { ScoresContext } from '../../context/ScoresContext';
import { YearContext } from '../../context/YearContext';
import { YearDimensionContext } from '../../context/YearDimensionContext';
import { useTranslation } from 'react-i18next';

function FilterPanel() {

  const { dimensions } = useContext(DimensionContext);
  const { yearDimensions, setYearDimensions, defaultYearDimensions } = useContext(YearDimensionContext);
  const { countriesRanking, setCountriesRanking } = useContext(CountriesRankingContext);
  const { scores } = useContext(ScoresContext);
  const { year } = useContext(YearContext);
  const { t } = useTranslation();

  
  const resetFilters = () => {
    setYearDimensions(defaultYearDimensions);
  };

  const handleAddCriteria = (e) => {
    const selected = parseInt(e.target.value);
    if (!selected) return;

    const newDimension = defaultYearDimensions.find(dimension => dimension.id === selected);

    const newDimensions = [
      ...yearDimensions,
      newDimension
    ];

    setYearDimensions(newDimensions);
    e.target.value = '';
  };

  const handleWeightChange = (id, weight) => {
    const newDimensions = yearDimensions.map(
      dimension => dimension.id === id ?
        { ...dimension, weight: weight } : dimension
    );
    setYearDimensions(newDimensions);
  };

  const handleRemoveCriteria = (id) => {
    const otherDimensions = yearDimensions.filter(dimension => dimension.id !== id);
    setYearDimensions(otherDimensions);
  };

  function calculateWeightedScores() {
    console.log("calculation happened");
    return countriesRanking.map(country => {
      const countryScores = scores.filter(score => score.countryName === country.countryName).reduce((countryScores, score) => {
        countryScores[score.dimensionName] = score.score;
        return countryScores;
      }, {});

      let weightedScore = 0;
      let totalWeights = 0;

      yearDimensions.forEach(dimension => {
        if (countryScores[dimension.name] !== undefined) {
          weightedScore += countryScores[dimension.name] * dimension.weight;
          totalWeights += dimension.weight;
        }
      });
      return {
        ...country,
        finalScore: (totalWeights !== 0) ? (weightedScore / totalWeights).toFixed(2) : 0
      };
    });
  }

  function sortedCountries() {
    const countriesFinalScores = calculateWeightedScores();
    return [...countriesFinalScores].sort((a, b) => {
      return b.finalScore - a.finalScore;
    });
  }

  function rankedCountries() {
    let newSortedCountries = sortedCountries();
    const newRankedCountries = newSortedCountries.map(
      (country, index) => {
        return {
          ...country,
          rank: index + 1
        };
      }
    );
    setCountriesRanking(newRankedCountries);
  }

  useEffect(() => {
    if (countriesRanking.length > 0) {
      rankedCountries();
    }
  }, [yearDimensions]);

  const criteriaColors = [
    { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300', bar: 'bg-green-500' },
    { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300', bar: 'bg-blue-500' },
    { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300', bar: 'bg-yellow-500' },
    { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-300', bar: 'bg-red-500' },
    { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-800 dark:text-indigo-300', bar: 'bg-indigo-500' },
    { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-800 dark:text-pink-300', bar: 'bg-pink-500' },
    { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-800 dark:text-teal-300', bar: 'bg-teal-500' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900', text: 'text-emerald-800 dark:text-emerald-300', bar: 'bg-emerald-500' },
    { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-300', bar: 'bg-purple-600' }
  ];

  const getCriteriaColor = (dimension, dimensionsList) => {
    const index = dimensionsList.indexOf(dimension);
    if (index === -1) return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', bar: 'bg-gray-500' };
    return criteriaColors[index % criteriaColors.length];
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('criteria')}</h3>

      <div className="mb-6">
        <label htmlFor="add-criteria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('addCriterias')}
        </label>
        <select
          id="add-criteria"
          defaultValue=""
          onChange={handleAddCriteria}
          className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">-- {t('addCriteria')} --</option>
          {defaultYearDimensions
            .filter(dim => !yearDimensions.some(i => dim.id === i.id))  // Filter out already selected items
            .map(dimension => (
              <option key={dimension.id} value={dimension.id}>
                {dimension.name}
              </option>
            ))}
        </select>
      </div>

      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">{t('criteriaPond')}</h4>

      {yearDimensions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('noCriteria')}</p>
      ) : (
        <div className="space-y-4 mb-6">
          {yearDimensions.map((dimension) => {
            const colorClasses = getCriteriaColor(dimension, yearDimensions);
            return (
              <div key={dimension.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${colorClasses.bg} ${colorClasses.text}`}>
                      {dimension.name}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{dimension.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2 text-gray-900 dark:text-gray-100">{dimension.weight}</span>
                    <button
                      onClick={() => handleRemoveCriteria(dimension.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={t('removeCriteria')}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={dimension.weight}
                  onChange={(e) => handleWeightChange(dimension.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={resetFilters}
        className="w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
      >
        {t('reinitialise')}
      </button>
    </div>
  );
}

export default FilterPanel;