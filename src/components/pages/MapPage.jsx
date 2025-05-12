// pages/MapPage.jsx
import React from 'react';
import PageTitle from '../card/PageTitle';
import MapSection from '../card/MapSection';
import {useEffect} from 'react'

function MapPage({indicators, setIndicators, defaultWeights, setDefaultWeights, countries, setCountries, scores, setScores, defaultFinalScores}) {

  useEffect(() => {
    setCountries(defaultFinalScores)
    setIndicators(defaultWeights)
  },[defaultFinalScores, defaultWeights])
  console.log("map page rendered")
  return (
    <div className="bg-gray-50">
      <PageTitle />
      <MapSection indicators={indicators} setIndicators={setIndicators} defaultWeights={defaultWeights} setDefaultWeights={setDefaultWeights} countries={countries} setCountries={setCountries} scores={scores} setScores={setScores}/>
    </div>
  );
}

export default MapPage;