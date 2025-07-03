import { useState } from 'react';
import CountryRanking from './CountryRanking';
import DisplayOptions from './DisplayOptions';
import FilterPanel from './FilterPanel';
import MapContainer from './MapContainer';
import RegionalTrends from './RegionalTrends';

function MapSection({ yearDimensions, setYearDimensions, countriesRanking, setCountriesRanking, dimensions, setDimensions, scores, setScores }) {

  const [colorScale, setColorScale] = useState('green-red');
  const [selectedCountry, setSelectedCountry] = useState(null);


  return (
    <section className="pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Colonne de gauche avec filtres et options */}
          <div className="w-full lg:w-1/4">
            <FilterPanel 
              onWeightsChange={setYearDimensions} 
              dimensions={dimensions} 
              yearDimensions={yearDimensions} 
              countriesRanking={countriesRanking} 
              setCountriesRanking={setCountriesRanking} 
              scores={scores} 
            />
            <DisplayOptions colorScale={colorScale} setColorScale={setColorScale} />
          </div>

          {/* Colonne de droite avec carte et tableau */}
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col xl:flex-row gap-6">
              <MapContainer
                colorScale={colorScale}
                yearDimensions={yearDimensions}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
                scores={scores}
                countriesRanking={countriesRanking}
                setCountriesRanking={setCountriesRanking}
              />
              <CountryRanking
                colorScale={colorScale}
                yearDimensions={yearDimensions}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
                countriesRanking={countriesRanking}
              />
            </div>
            <RegionalTrends 
              countriesRanking={countriesRanking}
              yearDimensions={yearDimensions}
              scores={scores}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapSection;;