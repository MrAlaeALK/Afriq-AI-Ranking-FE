import React, { useState, useEffect } from 'react';

function FilterPanel({ onWeightsChange, defaultWeights, indicators, onCountryScoreChange, countries, scores }) {

  const resetFilters = () => {
    onWeightsChange(defaultWeights);
    
  };

  const handleAddCriteria = (e) => {
    // console.log(e.target.value)
    const selected = parseInt(e.target.value);
    if (!selected) return;
    
    
    // Calculer les nouveaux poids
    // const currentTotal = indicators.map(indicator => indicator.weight).reduce((sum, val) => sum + val, 0);
    // const otherCriteria = indicators.map(indicator => indicator.name)

    // console.log(defaultWeights.find(indicator => indicator.id === id))

    const newIndicator = defaultWeights.find(indicator => indicator.id === selected)
    // console.log(newIndicator)
    
    // Valeur par défaut pour le nouveau critère: 50%
    // const newValue = 50
    
      const newWeights = [
        ...indicators,
        // defaultWeights.filter(indicator => indicator.id === selected), weight: newValue
        newIndicator
      ];
      
      
      // Informer les composants parents du changement
        onWeightsChange(newWeights);
    
    // Réinitialiser le select
    e.target.value = '';
  };

  const handleWeightChange = (id, weight) => {
    // console.log(id)
    // console.log(weight)
    // let selectedIndicator = indicators.find(indicator => indicator.id === id)
    // const newWeights = [...indicators]
    // newWeights[selectedIndicator.id - 1] = {
    //   ...newWeights[selectedIndicator.id -1],
    //   weight: weight
    // } 

    // onWeightsChange(newWeights)
    // console.log(indicators)

    const newWeights = indicators.map(
      indicator => indicator.id === id ? {...indicator, weight: weight} : indicator
    )
    onWeightsChange(newWeights)

  }

  const handleRemoveCriteria = (id) => {
    const otherIndicators = indicators.filter(indicator => indicator.id !== id)

    onWeightsChange(otherIndicators)
  }

    function calculateWeightedScores(){
      console.log("this is filterpanel")
        return countries.map(country => {
        const countryScores = scores.filter(score => score.countryName === country.countryName).reduce((countryScores,score) => {
          countryScores[score.indicatorName] = score.score
          // console.log(countryScores);
          return countryScores;
        },{})
  
        let weightedScore = 0;
        let totalWeights =  0;
  
        indicators.forEach(indicator => {
          if(countryScores[indicator.name] !== undefined){
            weightedScore += countryScores[indicator.name] * indicator.weight;
            totalWeights += indicator.weight;
          }
        })
        // console.log(weightedScore/totalWeights)
        return {
            ...country,
            finalScore : (totalWeights !== 0 ) ? weightedScore / totalWeights : 0
        }
      })
      // console.log(indicators)
      // onCountryScoreChange(newCountryScores)
    }
  
    function sortedCountries(){
      const countriesFinalScores = calculateWeightedScores()
      return [...countriesFinalScores].sort((a,b) => {
        return b.finalScore - a.finalScore
      })
    }
    
    function rankedCountries() {
      let newSortedCountries = sortedCountries()
      const newRankedCountries = newSortedCountries.map(
        (country,index) => { 
          return {
          ...country,
          rank: index + 1}
        }
      )
      // console.log(indicators)
      onCountryScoreChange(newRankedCountries)
    }
  
    useEffect(() => {rankedCountries()
    console.log("4th useeffect hit")},[indicators])
//   const handleAddCriteria = (e) => {
//   const selected = e.target.value;
//   if (!selected) return;

//   // Check if it's already added
//   if (indicators.some(indicator => indicator.id === selected)) {
//     alert(`Le critère est déjà sélectionné.`);
//     return;
//   }

//   // Get indicator info from default list
//   const newIndicator = defaultWeights.find(ind => ind.id === selected);
//   if (!newIndicator) return;

//   // Add it with fixed weight
//   const updatedWeights = [
//     ...indicators,
//     { ...newIndicator, weight: 50 }
//   ];

//   // setWeights(updatedWeights);
//   // if (onWeightsChange) {
//     onWeightsChange(updatedWeights);
//   // }

//   // Reset select
//   e.target.value = '';
// };

  // const handleWeightChange = (criteria, newValue) => {
  //   const otherWeightsTotal = Object.entries(weights)
  //     .filter(([k]) => k !== criteria)
  //     .reduce((sum, [, val]) => sum + val, 0);
    
  //   if (newValue + otherWeightsTotal > 100) {
  //     return; // Ne pas permettre un total > 100%
  //   }
    
  //   // Mettre à jour le poids
  //   const newWeights = { ...weights, [criteria]: newValue };
    
  //   // Ajuster les autres poids si nécessaire pour que le total soit 100%
  //   const remaining = 100 - newValue;
  //   const otherCriteria = Object.keys(weights).filter(k => k !== criteria);
    
  //   if (otherWeightsTotal > 0) {
  //     const scalingFactor = remaining / otherWeightsTotal;
      
  //     otherCriteria.forEach(k => {
  //       newWeights[k] = Math.round(weights[k] * scalingFactor);
  //     });
      
  //     // Ajuster si la somme n'est pas exactement 100 à cause des arrondis
  //     const totalAfterAdjustment = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
  //     if (totalAfterAdjustment !== 100 && otherCriteria.length > 0) {
  //       const diff = 100 - totalAfterAdjustment;
  //       newWeights[otherCriteria[0]] += diff;
  //     }
  //   }
    
  //   setWeights(newWeights);
    
  //   // Informer les composants parents du changement
  //   if (onWeightsChange) {
  //     onWeightsChange(newWeights);
  //   }
  // };

  // const handleRemoveCriteria = (criteriaKey) => {
  //   if (Object.keys(weights).length <= 1) {
  //     alert("Vous devez conserver au moins un critère.");
  //     return;
  //   }
    
  //   const newWeights = { ...weights };
  //   delete newWeights[criteriaKey];
    
  //   // Redistribuer les poids pour que le total reste 100%
  //   const currentTotal = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
  //   if (currentTotal > 0) {
  //     const scalingFactor = 100 / currentTotal;
      
  //     Object.keys(newWeights).forEach(key => {
  //       newWeights[key] = Math.round(newWeights[key] * scalingFactor);
  //     });
      
  //     // Ajuster si la somme n'est pas exactement 100 à cause des arrondis
  //     const totalAfterAdjustment = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
  //     if (totalAfterAdjustment !== 100 && Object.keys(newWeights).length > 0) {
  //       const diff = 100 - totalAfterAdjustment;
  //       newWeights[Object.keys(newWeights)[0]] += diff;
  //     }
  //   }
    
  //   setWeights(newWeights);
    
  //   // Informer les composants parents du changement
  //   if (onWeightsChange) {
  //     onWeightsChange(newWeights);
  //   }
  // };

  // // Liste des critères disponibles avec leurs couleurs
  // const availableCriteria = [
  //   { key: 'odin', label: 'Indice ODIN (données ouvertes)', color: 'purple' },
  //   { key: 'hdi', label: 'Indice de Développement Humain', color: 'green' },
  //   { key: 'internet', label: 'Accès à Internet', color: 'blue' },
  //   { key: 'education', label: 'Éducation', color: 'yellow' },
  //   { key: 'gdp', label: 'PIB par habitant', color: 'red' },
  //   { key: 'innovation', label: 'Innovation', color: 'indigo' },
  //   { key: 'governance', label: 'Gouvernance', color: 'pink' },
  //   { key: 'health', label: 'Santé', color: 'teal' },
  //   { key: 'environment', label: 'Environnement', color: 'emerald' }
  // ];

  // const getLabel = (key) => {
  //   const criteria = defaultWeights.find(c => c.key === key);
  //   return criteria ? criteria.name : key;
  // };

  // const getCriteriaColor = (key) => {
  //   const criteria = availableCriteria.find(c => c.key === key);
  //   return criteria ? criteria.color : 'gray';
  // };
  
  // const getColorClasses = (color) => {
  //   switch (color) {
  //     case 'purple':
  //       return 'bg-purple-100 text-purple-800';
  //     case 'green':
  //       return 'bg-green-100 text-green-800';
  //     case 'blue':
  //       return 'bg-blue-100 text-blue-800';
  //     case 'yellow':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'red':
  //       return 'bg-red-100 text-red-800';
  //     case 'indigo':
  //       return 'bg-indigo-100 text-indigo-800';
  //     case 'pink':
  //       return 'bg-pink-100 text-pink-800';
  //     case 'teal':
  //       return 'bg-teal-100 text-teal-800';
  //     case 'emerald':
  //       return 'bg-emerald-100 text-emerald-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };*

  // const indicatorhello = defaultWeights.find(indicator => indicator.id === 1)
  // console.log(indicatorhello.name)
  // console.log(indicators)
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Critères d'évaluation</h3>
      {/* <h2>{console.log(Object.entries(indicators))}</h2> */}
      
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
          {defaultWeights
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