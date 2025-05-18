import { useEffect, useMemo, useContext } from 'react';
import {IndicatorContext} from '../../context/IndicatorContext'
import {CountriesRankingContext} from '../../context/CountriesRankingContext'
import {ScoresContext} from '../../context/ScoresContext';

function FilterPanel() {

    const {indicators, setIndicators, defaultIndicators} = useContext(IndicatorContext)
    const {countriesRanking, setCountriesRanking} = useContext(CountriesRankingContext)
    const {scores} = useContext(ScoresContext)

  const resetFilters = () => {
    setIndicators(defaultIndicators);

  };

  const handleAddCriteria = (e) => {
    // console.log(e.target.value)
    const selected = parseInt(e.target.value);
    if (!selected) return;

    const newIndicator = defaultIndicators.find(indicator => indicator.id === selected)

    const newWeights = [
      ...indicators,
      newIndicator
    ];


    // Informer les composants parents du changement
    setIndicators(newWeights);

    // Réinitialiser le select
    e.target.value = '';
  };

  const handleWeightChange = (id, weight) => {

    const newWeights = indicators.map(
      indicator => indicator.id === id ? { ...indicator, weight: weight } : indicator
    )
    setIndicators(newWeights)

  }

  const handleRemoveCriteria = (id) => {
    const otherIndicators = indicators.filter(indicator => indicator.id !== id)

    setIndicators(otherIndicators)
  }

  function calculateWeightedScores() {
    return countriesRanking.map(country => {
      const countryScores = scores.filter(score => score.countryName === country.countryName).reduce((countryScores, score) => {
        countryScores[score.indicatorName] = score.score
        return countryScores;
      }, {})

      let weightedScore = 0;
      let totalWeights = 0;

      indicators.forEach(indicator => {
        if (countryScores[indicator.name] !== undefined) {
          weightedScore += countryScores[indicator.name] * indicator.weight;
          totalWeights += indicator.weight;
        }
      })
      return {
        ...country,
        finalScore: (totalWeights !== 0) ? weightedScore / totalWeights : 0
      }
    })
  }

  function sortedCountries() {
    const countriesFinalScores = calculateWeightedScores()
    return [...countriesFinalScores].sort((a, b) => {
      return b.finalScore - a.finalScore
    })
  }

  function rankedCountries() {
    let newSortedCountries = sortedCountries()
    const newRankedCountries = newSortedCountries.map(
      (country, index) => {
        return {
          ...country,
          rank: index + 1
        }
      }
    )
    setCountriesRanking(newRankedCountries)
  }

  useEffect(() => {
     // added the if statement  because there was a big problem caused by timing of multiple useeffects
     // this can sometimes run directly after the api response is obtained so it resets the state to [] in the provider
     //by checking length i am ensuring that api responses arrived before updating state. 
     // if i leave it without checking it runs even if it's [] so it returns []
     //ofc this is just a solution i am sure there are better ways as the number of useeffects that we are using are quite high 
     // so i hope that we can improve the code even more 
    if(indicators.length > 0 && countriesRanking.length > 0){ 
      rankedCountries()
    }
  }, [indicators])


  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Critères d'évaluation</h3>

      <div className="mb-6">
        <label htmlFor="add-criteria" className="block text-sm font-medium text-gray-700 mb-1">
          Ajouter des critères d'évaluation
        </label>
        <select
          id="add-criteria"
          defaultValue=""
          onChange={handleAddCriteria}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
        >
          <option value="">-- Ajouter un critère --</option>
          {defaultIndicators
            .filter(ind => !indicators.some(i => ind.id === i.id))  // Filter out already selected items
            .map(indicator => (
              <option key={indicator.id} value={indicator.id}>
                {indicator.name}
              </option>
            ))}
        </select>
      </div>

      <h4 className="font-medium text-gray-700 mb-4">Pondération des critères</h4>

      {indicators.length === 0 ? (
        <p className="text-gray-500 text-sm mb-6">Aucun critère sélectionné.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {indicators.map((indicator) => (
            <div key={indicator.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs `}>
                    {indicator.name}
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-700">{indicator.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">{indicator.weight}</span>
                  <button
                    onClick={() => handleRemoveCriteria(indicator.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Supprimer ce critère"
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
                value={indicator.weight}
                onChange={(e) => handleWeightChange(indicator.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm font-medium">
          <span>Total:</span>
          <span className={Object.values(indicators).reduce((sum, val) => sum + val, 0) === 100 ? "text-green-600" : "text-red-600"}>
            {Object.values(indicators).reduce((sum, val) => sum + val, 0)}%
          </span>
        </div>
      </div> */}

      <button
        onClick={resetFilters}
        className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
      >
        Réinitialiser
      </button>
    </div>
  );
}

export default FilterPanel;