import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { GeoJSON, MapContainer, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CountriesRankingContext } from '../../context/CountriesRankingContext';
import { DimensionContext } from '../../context/DimensionContext';
import { ScoresContext } from '../../context/ScoresContext';
import { YearDimensionContext } from '../../context/YearDimensionContext';
import { useTranslation } from 'react-i18next';




// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
// // this component is still filled with problems which mostly have one source which is that react leaflet is not reacting to react state change
const MapComponent = ({ selectedCountry, colorScale }) => {

  const {countriesRanking} = useContext(CountriesRankingContext);
  const {yearDimensions} = useContext(YearDimensionContext);
  const {scores} = useContext(ScoresContext)
  const [geojsonData, setGeojsonData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCountryData, setSelectedCountryData] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const mapRef = useRef(null);
  const { t } = useTranslation();


  const countriesRankingRef = useRef(countriesRanking);

  useEffect(() => {
    countriesRankingRef.current = countriesRanking;
  }, [countriesRanking]);

  //ai solutions to fix problems of popup not showing correctly
  useEffect(() => {
    if (!mapRef.current) return;

    if (popupPosition) {
      mapRef.current.setMaxBounds(null); // Removes bounds
    } else {
      mapRef.current.setMaxBounds([[-40, -40], [40, 60]]); // Reapplies bounds
    }
  }, [popupPosition]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handlePopupClose = () => {
      setPopupPosition(null);
      setSelectedCountryData(null); // optional, depending on your logic
    };

    map.on('popupclose', handlePopupClose);

    return () => {
      map.off('popupclose', handlePopupClose); // clean up
    };
  }, [popupPosition]);




  useEffect(() => {
    fetch('/geojson/Africa.json')
      .then(response => {
        if (!response.ok) throw new Error(`Error loading GeoJSON: ${response.status}`);
        return response.json();
      })
      .then(data => setGeojsonData(data))
      .catch(err => {
        console.error("Error loading GeoJSON:", err);
        setError(err.message);
      });
  }, []);

  // Find centroid of a country by name
  const findCountryCentroid = (countryCode) => {
    if (!geojsonData) return null;

    const feature = geojsonData.features.find(f => {
      const code =  f.properties?.["ISO3166-1-Alpha-2"] ||
      'Unknown country';
      return code === countryCode;
    });

    if (feature && feature.geometry) {
      // For Polygon
      if (feature.geometry.type === 'Polygon') {
        const coords = feature.geometry.coordinates[0];
        let lat = 0, lng = 0;
        coords.forEach(coord => {
          lat += coord[1];
          lng += coord[0];
        });
        return [lat / coords.length, lng / coords.length];
      }
      // For MultiPolygon
      else if (feature.geometry.type === 'MultiPolygon') {
        // Use the first polygon for simplicity
        const coords = feature.geometry.coordinates[0][0];
        let lat = 0, lng = 0;
        coords.forEach(coord => {
          lat += coord[1];
          lng += coord[0];
        });
        return [lat / coords.length, lng / coords.length];
      }
    }
    return null;
  };

  // Effect to handle selected country changes from dropdown
  useEffect(() => {
    if (selectedCountry && geojsonData) {
      // Utiliser les données les plus récentes (avec le rank et weightedScore actualisés)
      const countryData = countriesRanking.find(c => c.countryName === selectedCountry);
      if (countryData) {
        const centroid = findCountryCentroid(countryData.countryCode);
        if (centroid) {
          setSelectedCountryData(countryData);
          setPopupPosition({ lat: centroid[0], lng: centroid[1] });

          // Zoom to the country if we have a ref to the map
          if (mapRef.current) {
            mapRef.current.flyTo(centroid, 4);
          }
        }
      }
    }
  }, [selectedCountry, countriesRanking, geojsonData]);

  // Get color based on score
  const getColorByScore = (score) => {
    if (score === undefined) return '#cccccc'; // Default gray for unknown scores

    if (colorScale === 'green-red') {
      if (score >= 80) return '#109618'; // Dark green
      if (score >= 60) return '#7fbd5a'; // Light green
      if (score >= 40) return '#ffeb3b'; // Yellow
      if (score >= 20) return '#f44336'; // Red
      return '#b71c1c'; // Dark red
    } else if (colorScale === 'blue-red') {
      if (score >= 80) return '#1a237e'; // Dark blue
      if (score >= 60) return '#3f51b5'; // Blue
      if (score >= 40) return '#9c27b0'; // Purple
      if (score >= 20) return '#e91e63'; // Pink
      return '#b71c1c'; // Dark red
    } else if (colorScale === 'purple-yellow') {
      if (score >= 80) return '#4a148c'; // Dark purple
      if (score >= 60) return '#9c27b0'; // Purple
      if (score >= 40) return '#e91e63'; // Pink
      if (score >= 20) return '#ff9800'; // Orange
      return '#ffeb3b'; // Yellow
    }

    return '#cccccc'; // Default gray
  };

  // 🔄 Mapping complet entre codes GeoJSON (ISO) et codes base de données
  const countryCodeMapping = {
    // ✅ Afrique du Nord
    'MAR': 'MOR',  // Maroc (confirmé)
    'DZA': 'ALG',  // Algérie 
    'TUN': 'TUN',  // Tunisie
    'LBY': 'LBY',  // Libye
    'EGY': 'EGY',  // Égypte
    'SDN': 'SUD',  // Soudan
    'SSD': 'SSD',  // Soudan du Sud
    
    // ✅ Afrique de l'Ouest
    'NGA': 'NGA',  // Nigeria
    'GHA': 'GHA',  // Ghana
    'CIV': 'CIV',  // Côte d'Ivoire
    'SEN': 'SEN',  // Sénégal
    'MLI': 'MLI',  // Mali
    'BFA': 'BFA',  // Burkina Faso
    'NER': 'NER',  // Niger
    'GIN': 'GIN',  // Guinée
    'SLE': 'SLE',  // Sierra Leone
    'LBR': 'LBR',  // Libéria
    'GNB': 'GNB',  // Guinée-Bissau
    'GMB': 'GMB',  // Gambie
    'CPV': 'CPV',  // Cap-Vert
    'MRT': 'MRT',  // Mauritanie
    'TGO': 'TGO',  // Togo
    'BEN': 'BEN',  // Bénin
    
    // ✅ Afrique de l'Est
    'ETH': 'ETH',  // Éthiopie
    'KEN': 'KEN',  // Kenya
    'UGA': 'UGA',  // Ouganda
    'TZA': 'TZA',  // Tanzanie
    'RWA': 'RWA',  // Rwanda
    'BDI': 'BDI',  // Burundi
    'SOM': 'SOM',  // Somalie
    'DJI': 'DJI',  // Djibouti
    'ERI': 'ERI',  // Érythrée
    'MWI': 'MWI',  // Malawi
    
    // ✅ Afrique Centrale
    'CMR': 'CMR',  // Cameroun
    'CAF': 'CAF',  // République Centrafricaine
    'TCD': 'TCD',  // Tchad
    'COG': 'COG',  // Congo (République du)
    'COD': 'COD',  // Congo (RD)
    'GAB': 'GAB',  // Gabon
    'GNQ': 'GNQ',  // Guinée Équatoriale
    'STP': 'STP',  // São Tomé et Principe
    
    // ✅ Afrique Australe
    'ZAF': 'ZAF',  // Afrique du Sud
    'ZWE': 'ZWE',  // Zimbabwe
    'ZMB': 'ZMB',  // Zambie
    'BWA': 'BWA',  // Botswana
    'NAM': 'NAM',  // Namibie
    'AGO': 'AGO',  // Angola
    'LSO': 'LSO',  // Lesotho
    'SWZ': 'SWZ',  // Eswatini
    'MOZ': 'MOZ',  // Mozambique
    
    // ✅ Îles Africaines
    'MDG': 'MDG',  // Madagascar
    'MUS': 'MUS',  // Maurice
    'SYC': 'SYC',  // Seychelles
    'COM': 'COM',  // Comores
    
    // 🔄 Mappings alternatifs pour certains pays (si les codes DB diffèrent)
    // Ajustez selon vos vraies données :
    // 'ZAF': 'RSA',  // Afrique du Sud (si code = RSA)
    // 'TZA': 'TAN',  // Tanzanie (si code = TAN)
    // 'COD': 'DRC',  // RD Congo (si code = DRC)
  };

  // 🤖 Système de détection automatique des mappings manquants
  const detectMissingMappings = () => {
    if (!geojsonData || !countriesRanking) return;

    const geoJSONCodes = geojsonData.features.map(f => 
      f.properties?.["ISO3166-1-Alpha-3"] || 'Unknown'
    ).filter(code => code !== 'Unknown');

    const dbCodes = countriesRanking.map(c => c.countryCode);

    console.log('🔍 ANALYSE DES CODES PAYS:');
    console.log('- Pays dans GeoJSON:', geoJSONCodes.length, geoJSONCodes);
    console.log('- Pays dans DB:', dbCodes.length, dbCodes);

    // Détecter les codes GeoJSON sans mapping vers la DB
    const unmappedCodes = geoJSONCodes.filter(geoCode => {
      const dbCode = countryCodeMapping[geoCode] || geoCode;
      return !dbCodes.includes(dbCode);
    });

    // Détecter les codes DB sans correspondance GeoJSON
    const unusedDbCodes = dbCodes.filter(dbCode => {
      const hasDirectMatch = geoJSONCodes.includes(dbCode);
      const hasMappedMatch = Object.values(countryCodeMapping).includes(dbCode);
      return !hasDirectMatch && !hasMappedMatch;
    });

    if (unmappedCodes.length > 0) {
      console.log('⚠️ CODES GEOJSON SANS DONNÉES DB:', unmappedCodes);
    }

    if (unusedDbCodes.length > 0) {
      console.log('🔍 CODES DB SANS CORRESPONDANCE GEOJSON:', unusedDbCodes);
      
      // Suggérer des mappings possibles
      unusedDbCodes.forEach(dbCode => {
        const possibleMatches = geoJSONCodes.filter(geoCode => 
          geoCode.includes(dbCode.substring(0, 2)) || 
          dbCode.includes(geoCode.substring(0, 2))
        );
        if (possibleMatches.length > 0) {
          console.log(`💡 SUGGESTION MAPPING: '${possibleMatches[0]}': '${dbCode}',`);
        }
      });
    }

    console.log('✅ MAPPINGS ACTIFS:', Object.keys(countryCodeMapping).length);
  };

  // Exécuter la détection à chaque changement de données
  useEffect(() => {
    if (geojsonData && countriesRanking.length > 0) {
      detectMissingMappings();
    }
  }, [geojsonData, countriesRanking]);

  const getGeoJSONStyle = (feature) => {
    const geoJSONCode =
      feature.properties?.["ISO3166-1-Alpha-3"] ||
      'Unknown country';

    // 🔄 Convertir le code GeoJSON vers le code de la base de données
    const dbCode = countryCodeMapping[geoJSONCode] || geoJSONCode;

    // Find country data from rankedcountriesRanking to get the most up-to-date data
    const countryData = countriesRanking.find(c => c.countryCode === dbCode);

    // 🐛 DEBUG: Log pour tous les pays avec données (pas seulement le Maroc)
    if (countryData) {
      const countryFlag = {
        'MOR': '🇲🇦', 'ALG': '🇩🇿', 'TUN': '🇹🇳', 'EGY': '🇪🇬', 
        'NGA': '🇳🇬', 'ZAF': '🇿🇦', 'KEN': '🇰🇪', 'ETH': '🇪🇹'
      };
      const flag = countryFlag[dbCode] || '🏴';
      
      console.log(`${flag} ${countryData.countryName.toUpperCase()} DEBUG:`, {
        geoJSONCode,
        dbCodeMapped: dbCode,
        score: countryData.finalScore,
        rank: countryData.rank
      });
    }

    // Utiliser directement weightedScore s'il existe, sinon calculer
    const weightedScore = countryData ?
      countryData.finalScore :
      undefined;

    if ((selectedCountryData && geoJSONCode === selectedCountryData.countryCode) || (selectedCountry && geoJSONCode === selectedCountry)) {
      return {
        fillColor: '#ff6b6b',
        weight: 2,
        color: '#ff0000',
        fillOpacity: 1,
      };
    }

    return {
      fillColor: weightedScore !== undefined ? getColorByScore(weightedScore) : '#1a1d62',
      weight: 1,
      opacity: 1,
      color: '#4a83ec',
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const geoJSONCode =
      feature.properties?.["ISO3166-1-Alpha-3"] ||
      'Unknown country';

    // 🔄 Convertir le code GeoJSON vers le code de la base de données
    const dbCode = countryCodeMapping[geoJSONCode] || geoJSONCode;

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 1,
          weight: 2,
        });
        layer.bringToFront();
        //add a tooltip on hover (just let ai generate the code here and it needs styling)
        const countryData = countriesRankingRef.current.find(
          c => c.countryCode === dbCode
        );
        if(countryData){
          layer.bindTooltip(
            `<strong>Name: ${countryData.countryName}<br/>Rank: ${countryData.rank}<br/>Score: ${countryData.finalScore}</strong>`,
            {
              direction: 'top',
              sticky: true,
              opacity: 0.9,
              // className: 'custom-tooltip', // optional for styling
            }
          ).openTooltip()
        }
      },
      mouseout: (e) => {
        const layer = e.target;

        // Utiliser la fonction getGeoJSONStyle pour avoir le style cohérent avec colorScale
        layer.setStyle(getGeoJSONStyle(feature)); //this is causing the red-orange color not to appear when country is selected because it's resetting country data to null
      },
      click: (e) => {
        // console.log("Country clicked:", countryName);

        const countryData = countriesRankingRef.current.find(
          c => c.countryCode === dbCode
        );

        if (countryData) {
          setSelectedCountryData(countryData);
          setPopupPosition(e.latlng);
        } else {
          console.log("No data for this country");
        }
      },
    });
  };

  const closePopup = () => {
    setSelectedCountryData(null);
    setPopupPosition(null);
  };

  // Create score badge with color
  const ScoreBadge = ({ score }) => {
    let color;
    if (score >= 80) color = 'bg-green-100 text-green-800';
    else if (score >= 60) color = 'bg-blue-100 text-blue-800';
    else if (score >= 40) color = 'bg-yellow-100 text-yellow-800';
    else if (score >= 20) color = 'bg-orange-100 text-orange-800';
    else color = 'bg-red-100 text-red-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {score}
      </span>
    );
  };

  // Country popup content
  const CountryPopup = ({ country, yearDimensions }) => {
    if (!country) return null;

    // Display only criteria that are included in the weights object
    const criteriaTitles = {
      odin: 'ODIN Index (Open Data)',
      hdi: 'Human Development Index',
      internet: 'Internet Access',
      education: 'Education',
      gdp: 'GDP per Capita',
      innovation: 'Innovation',
      governance: 'Governance',
      health: 'Health',
      environment: 'Environment'
    };

    // Toujours recalculer le score pondéré pour s'assurer qu'il utilise les poids actuels
    // Cela garantit que même si le composant ne se re-render pas,
    // nous avons le bon score affiché
    // const globScore = Number(calculateWeightedScore(country.scores, weights).toFixed(1));
    const globScore = country.finalScore

    // Trouver le pays avec les données mises à jour dans rankedcountriesRanking
    const updatedCountry = countriesRanking.find(c => c.countryName === country.countryName);
    const currentRank = updatedCountry ? updatedCountry.rank : country.rank;

    return (
      <div className="country-popup" style={{ minWidth: '300px', maxWidth: '400px' }}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <img
              src={`/public/flags/${country.countryCode}.svg`}
              alt={`${country.countryName} flag`}
              className="w-10 h-10 mr-2"
            />
            <h3 className="text-xl font-bold">{country.countryName}</h3>
          </div>
          <div className="bg-gray-100 rounded-full px-3 py-1 text-sm">
            {t('rank')}: #{currentRank}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">{t('globalScore')}</div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${globScore}%` }}></div>
              </div>
              <ScoreBadge score={globScore} />
            </div>
          </div>
        </div>

        <hr className="my-3" />

        <div className="space-y-2">
          <h4 className="font-medium">{t('detailScore')}</h4>
          {yearDimensions && yearDimensions.map(dimension => (
            dimension.name && (
              <div key={dimension.id} className="flex justify-between items-center">
                <div className="text-sm text-gray-600">{dimension.name} :</div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${scores.find(score => score.countryName === country.countryName && score.dimensionName === dimension.name).score}%` }}></div>
                  </div>
                  <ScoreBadge score={scores.find(score => score.countryName === country.countryName && score.dimensionName === dimension.name).score.toFixed(2)} />
                </div>
              </div>
            )
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Region: {country.countryRegion}
          </div>
        </div>

        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    );
  };

  if (error) {
    return <div className="text-red-500 p-5">Error: {error}</div>;
  }

  //changed height to 500 px  (also in map container), also zoom and min zoom to 3
  return (
    <div className="map-container relative z-0" style={{
      height: '500px',
      width: '100%',
      margin: '0 auto',
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <MapContainer
        center={[5, 20]}
        zoom={3}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        minZoom={3}
        maxZoom={6}
        maxBounds={[[-40, -40], [40, 60]]}
        ref={mapRef}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <ZoomControl position="bottomright" />
        {/* //different tiles that i tried to use to get the blue sea and no labels and what i am using currently is the best out of these */}
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        /> */}
        {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CartoDB"
        /> */}

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CartoDB"
          // subdomains={['a','b','c','d']}
        />

        {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CartoDB"
          subdomains={['a','b','c','d']}
        /> */}

        {/* <TileLayer
          url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, CC BY 3.0 — Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        /> */}

        {/* <TileLayer
          url="https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, CC BY 3.0 — Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        /> */}

        {geojsonData && (
          <GeoJSON
            key={JSON.stringify([countriesRanking, colorScale])}  // temporary fix to year change to reflect on map and color problem because when we add this we force react to render the new component with the new values of state
            data={geojsonData}
            onEachFeature={onEachFeature}
            style={getGeoJSONStyle}
          />
        )}

        {popupPosition && selectedCountryData && (
          <Popup
            position={popupPosition}
            maxWidth={400}
            offset={[0, -10]}
            autoPan={true}
            closeButton={false}
          >
            <CountryPopup country={selectedCountryData} yearDimensions={yearDimensions} />
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;