import CountrySelect from './CountrySelect';
import MapComponent from './MapComponent';
import ColorLegend from './ColorLegend';
import { useTranslation } from 'react-i18next';

function MapContainer({ colorScale, yearDimensions, selectedCountry, onCountrySelect, countriesRanking, scores, setCountriesRanking, showCountryNames, showScores }) {
  const { t } = useTranslation();

  return (
    <div className="w-full xl:w-2/3">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-gray-700 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('africaCard')}</h3>
          <CountrySelect
            onSelectCountry={onCountrySelect}
            selectedCountry={selectedCountry}
            countriesRanking={countriesRanking}
          />
        </div>

        {/* Composant de carte */}
        <div
          className="map-container relative"
          style={{ height: '500px', width: '100%', marginBottom: '20px' }}
        >
          <MapComponent
            selectedCountry={selectedCountry}
            colorScale={colorScale}
            yearDimensions={yearDimensions}
            countriesRanking={countriesRanking}
            scores={scores}
            setCountriesRanking={setCountriesRanking}
            showCountryNames={showCountryNames}
            showScores={showScores}
          />
        </div>

        <ColorLegend colorScale={colorScale} />
      </div>
    </div>
  );
}

export default MapContainer;
