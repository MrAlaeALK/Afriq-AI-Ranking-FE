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
    <div className="bg-gray-50">
      <PageTitle />
      <select value={year} onChange={e => setYear(parseInt(e.target.value))}>
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