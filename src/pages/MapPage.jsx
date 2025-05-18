// pages/MapPage.jsx
import { useEffect, useContext } from 'react';
import MapSection from '../components/card/MapSection';
import PageTitle from '../components/card/PageTitle';
import {IndicatorContext} from '../context/IndicatorContext'
import {CountriesRankingContext} from '../context/CountriesRankingContext'
import {ScoresContext} from '../context/ScoresContext';
import { YearContext } from '../context/YearContext';

function MapPage() {
  const {indicators, setIndicators, defaultIndicators} = useContext(IndicatorContext)
  const {countriesRanking, setCountriesRanking} = useContext(CountriesRankingContext)
  const {scores, setScores} = useContext(ScoresContext)
  const {year, setYear} = useContext(YearContext)
  
  useEffect(() => {
    // setCountriesRanking(defaultFinalScores)
    setIndicators(defaultIndicators)
  }, [defaultIndicators])


  return (
    <div className="bg-gray-50">
      <PageTitle />
      <select value={year} onChange={e => setYear(parseInt(e.target.value))}>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>
      <MapSection indicators={indicators} setIndicators={setIndicators} defaultIndicators={defaultIndicators}  countriesRanking={countriesRanking} setCountriesRanking={setCountriesRanking} scores={scores} setScores={setScores} />
    </div>
  );
}

export default MapPage;