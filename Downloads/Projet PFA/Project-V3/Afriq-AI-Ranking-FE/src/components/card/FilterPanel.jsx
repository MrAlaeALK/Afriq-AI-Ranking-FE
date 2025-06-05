import { useEffect, useMemo, useContext } from 'react';
import {DimensionContext} from '../../context/DimensionContext'
import {CountriesRankingContext} from '../../context/CountriesRankingContext'
import {ScoresContext} from '../../context/ScoresContext';
import { YearContext } from '../../context/YearContext';
import { YearDimensionContext } from '../../context/YearDimensionContext';

function FilterPanel() {

    const {dimensions} = useContext(DimensionContext)
    const {yearDimensions, setYearDimensions, defaultYearDimensions} = useContext(YearDimensionContext)
    const {countriesRanking, setCountriesRanking} = useContext(CountriesRankingContext)
    const {scores} = useContext(ScoresContext)
    const {year} = useContext(YearContext)

  const resetFilters = () => {
    setYearDimensions(defaultYearDimensions);
  };

  const handleAddCriteria = (e) => {

    const selected = parseInt(e.target.value);
    if (!selected) return;

    const newDimension = defaultYearDimensions.find(dimension => dimension.id === selected)

    const newDimensions = [
      ...yearDimensions,
      newDimension
    ];


    // Informer les composants parents du changement
    setYearDimensions(newDimensions);

    // Réinitialiser le select
    e.target.value = '';
  };

  const handleWeightChange = (id, weight) => {
    const newDimensions = yearDimensions.map(
      dimension => dimension.id === id ? 
        { ...dimension, weight: weight } : dimension
  )
    setYearDimensions(newDimensions)

  }

  const handleRemoveCriteria = (id) => {
    const otherDimensions = yearDimensions.filter(dimension => dimension.id !== id)

    setYearDimensions(otherDimensions)
  }

  function calculateWeightedScores() {
    console.log("calculation happened")
    return countriesRanking.map(country => {
      const countryScores = scores.filter(score => score.countryName === country.countryName).reduce((countryScores, score) => {
        countryScores[score.dimensionName] = score.score
        return countryScores;
      }, {})

      let weightedScore = 0;
      let totalWeights = 0;

      yearDimensions.forEach(dimension => {
        if (countryScores[dimension.name] !== undefined) {
          weightedScore += countryScores[dimension.name] * dimension.weight;
          totalWeights += dimension.weight;
        }
      })
      return {
        ...country,
        finalScore: (totalWeights !== 0) ? (weightedScore / totalWeights).toFixed(2) : 0
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

    if(countriesRanking.length > 0){ 
      rankedCountries()
    }
  }, [yearDimensions])

  // function for criteria colors

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
          {defaultYearDimensions
            .filter(dim => !yearDimensions.some(i => dim.id === i.id))  // Filter out already selected items
            .map(dimension => (
              <option key={dimension.id} value={dimension.id}>
                {dimension.name}
              </option>
            ))}
        </select>
      </div>

      <h4 className="font-medium text-gray-700 mb-4">Pondération des critères</h4>

      {yearDimensions.length === 0 ?  (
        <p className="text-gray-500 text-sm mb-6">Aucun critère sélectionné.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {yearDimensions.map((dimension) => (
            <div key={dimension.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${getCriteriaColor(dimension, yearDimensions).bg || 'gray-100'} ${getCriteriaColor(dimension, yearDimensions).text || 'text-gray-800'}`}>
                    {dimension.name}
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-700">{dimension.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">{dimension.weight}</span>
                  <button
                    onClick={() => handleRemoveCriteria(dimension.id)}
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
                value={dimension.weight}
                onChange={(e) => handleWeightChange(dimension.id, parseInt(e.target.value))}
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