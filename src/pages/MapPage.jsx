// pages/MapPage.jsx
import { useEffect, useContext } from 'react';
import MapSection from '../components/card/MapSection';
import PageTitle from '../components/card/PageTitle';
import {DimensionContext} from '../context/DimensionContext'
import {CountriesRankingContext} from '../context/CountriesRankingContext'
import {ScoresContext} from '../context/ScoresContext';
import { YearContext } from '../context/YearContext';
import { YearDimensionContext } from '../context/YearDimensionContext';

function MapPage() {
  const {dimensions} = useContext(DimensionContext)
  const {yearDimensions, setYearDimensions, defaultYearDimensions} = useContext(YearDimensionContext)
  const {countriesRanking, setCountriesRanking} = useContext(CountriesRankingContext)
  const {scores, setScores} = useContext(ScoresContext)
  const {year, setYear, availableYears, loading} = useContext(YearContext)
  
  useEffect(() => {
    setYearDimensions(defaultYearDimensions)
  }, [defaultYearDimensions])

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Chargement des années disponibles...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      <PageTitle />
      
      {/* Sélecteur d'année dynamique */}
      <select 
        value={year} 
        onChange={e => setYear(parseInt(e.target.value))}
        className="mt-4 mb-6 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {availableYears.map(availableYear => (
          <option key={availableYear} value={availableYear}>
            {availableYear}
          </option>
        ))}
      </select>
      
      <MapSection 
        yearDimensions={yearDimensions} 
        setYearDimensions={setYearDimensions} 
        dimensions={dimensions}  
        countriesRanking={countriesRanking} 
        setCountriesRanking={setCountriesRanking} 
        scores={scores} 
        setScores={setScores} 
      />
    </div>
  );
}

export default MapPage;
