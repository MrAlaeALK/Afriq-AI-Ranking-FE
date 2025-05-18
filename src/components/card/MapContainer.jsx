import CountrySelect from './CountrySelect';
import MapComponent from './MapComponent';
import ColorLegend from './ColorLegend';

function MapContainer({ colorScale, indicators, selectedCountry, onCountrySelect, countriesRanking, scores, setCountriesRanking }) {
  

  return (
    <div className="w-full xl:w-2/3">
      <div className="bg-white p-6 rounded-xl shadow-md relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Carte de l'Afrique</h3>
          <CountrySelect
            onSelectCountry={onCountrySelect}
            selectedCountry={selectedCountry}
            countriesRanking={countriesRanking}
          />
        </div>

        {/* Composant de carte */}
        <div className="map-container relative" style={{ height: '500px', width: '100%', marginBottom: '20px' }}>
          <MapComponent
            selectedCountry={selectedCountry}
            colorScale={colorScale}
            indicators={indicators}
            countriesRanking={countriesRanking}
            scores={scores}
            setCountriesRanking={setCountriesRanking}
          />
        </div>

        <ColorLegend colorScale={colorScale} />

      </div>
    </div>
  );
}

export default MapContainer;