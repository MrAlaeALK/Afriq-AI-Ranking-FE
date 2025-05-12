import React, { useState , useEffect} from 'react';
import FilterPanel from './FilterPanel';
import DisplayOptions from './DisplayOptions';
import MapContainer from './MapContainer';
import CountryRanking from './CountryRanking';
import RegionalTrends from './RegionalTrends';
import axios from 'axios'

function MapSection({indicators, setIndicators, countries, setCountries,defaultWeights, setDefaultWeights, scores, setScores}) {
  //ADDED THINGS BY ME
  const [error, setError] = useState(null)
  // const [indicators, setIndicators] = useState([])
  // const [defaultWeights, setDefaultWeights] = useState([])
  // const [countries, setCountries] = useState([]);
  // const [scores, setScores] = useState([])

  console.log("map section rendered")


  // const defaultWeights = indicators;
  // console.log(defaultWeights)
  // console.log(indicators)

  //ALREADY EXISTS
  const [colorScale, setColorScale] = useState('green-red');
  const [weights, setWeights] = useState({
    'odin': 40,
    'hdi': 30,
    'internet': 30
  });
  const [selectedCountry, setSelectedCountry] = useState(null);

  

  // Gestionnaire pour mettre à jour les poids depuis FilterPanel
  // const handleWeightsChange = (newWeights) => {
  //   setWeights(newWeights);
  //   // Vous pourriez également recalculer les scores globaux ici si nécessaire
  // };

  // Gestionnaire pour mettre à jour le pays sélectionné depuis MapContainer
  // const handleCountrySelect = (country) => {
  //   setSelectedCountry(country);
  // };
  // console.log(countries)

  return (
    <section className="pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Colonne de gauche avec filtres et options */}
          <div className="w-full lg:w-1/4">
            <FilterPanel onWeightsChange={setIndicators} defaultWeights={defaultWeights} indicators={indicators} countries={countries} onCountryScoreChange={setCountries} scores={scores}/>
            <DisplayOptions colorScale={colorScale} setColorScale={setColorScale} />
          </div>
          
          {/* Colonne de droite avec carte et tableau */}
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col xl:flex-row gap-6">
              <MapContainer 
                colorScale={colorScale} 
                indicators={indicators}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
                scores= {scores}
                countries = {countries}
                onCountryScoreChange = {setCountries}
              />
              <CountryRanking 
                colorScale={colorScale}
                indicators={indicators} 
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
                countries={countries}
              />
            </div>
            <RegionalTrends />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapSection;;