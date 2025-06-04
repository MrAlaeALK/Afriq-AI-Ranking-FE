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
  const {year, setYear} = useContext(YearContext)
  
  useEffect(() => {
    setYearDimensions(defaultYearDimensions)
  }, [defaultYearDimensions])


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      <PageTitle />
      <select 
        value={year} 
        onChange={e => setYear(parseInt(e.target.value))}
        className="mt-4 mb-6 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="2021">2021</option>
        <option value="2020">2020</option>
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
