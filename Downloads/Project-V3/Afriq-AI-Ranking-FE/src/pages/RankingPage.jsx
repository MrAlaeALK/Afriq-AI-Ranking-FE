import { useEffect, useState, useContext } from 'react';
import FilterPanel from '../components/card/FilterPanel';
import CountryTable from '../components/ranking/CountryTable';
import ExportOptions from '../components/ranking/ExportOptions';
import RankingCharts from '../components/ranking/RankingCharts';
import RegionalFilters from '../components/ranking/RegionalFilters';
import {DimensionContext} from '../context/DimensionContext'
import {CountriesRankingContext} from '../context/CountriesRankingContext'
import {ScoresContext} from '../context/ScoresContext';
import { YearDimensionContext } from '../context/YearDimensionContext';

const RankingPage = () => {
  const {dimensions} = useContext(DimensionContext)
  const {yearDimensions, setYearDimensions, defaultYearDimensions} = useContext(YearDimensionContext)
  const {countriesRanking, setCountriesRanking} = useContext(CountriesRankingContext)
  const {scores, setScores} = useContext(ScoresContext)
  const [filteredCountriesRanking, setfilteredCountriesRanking] = useState([]);
  const [selectedCountries, setselectedCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'ascending' });

  //reset when we switch to this page if we want 
  // useEffect(() => {
  //   // setCountriesRanking(defaultFinalScores)
  //   setYearDimensions(defaultYearDimensions)
  // }, [defaultYearDimensions])

  // Fonctions de filtrage et de tri
  useEffect(() => {
    let result = [...countriesRanking];

    // Filtrage par région
    if (activeRegion !== 'all') {
      result = result.filter(country => country.countryRegion === activeRegion);
    }

    // Filtrage par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(country =>
        country.countryName.toLowerCase().includes(query)
      );
    }

    // Tri
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === 'countryName') {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        } else if (sortConfig.key === 'rank') {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        } else if (sortConfig.key === 'finalScore') {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        } else {
          aValue = scores.find(score => score.countryName === a.countryName && score.dimensionName === sortConfig.key).score || 0;
          bValue = scores.find(score => score.countryName === b.countryName && score.dimensionName === sortConfig.key).score || 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setfilteredCountriesRanking(result);
  }, [countriesRanking, activeRegion, searchQuery, sortConfig, yearDimensions]);

  // Gestion du tri
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Gestion de la sélection de pays pour la comparaison
  const handleCountrySelection = (countryId) => {
    setselectedCountries(prevSelected => {
      if (prevSelected.includes(countryId)) {
        return prevSelected.filter(id => id !== countryId);
      } else {
        if (prevSelected.length < 5) { // Limite à 5 pays
          return [...prevSelected, countryId];
        }
        return prevSelected;
      }
    });
  };

  // Sauvegarde de configuration (nb: not used anywhere)
  const saveConfiguration = () => {
    const config = {
      weights: customWeights,
      selectedRegion: activeRegion,
      selectedCountries
    };
    localStorage.setItem('rankingConfig', JSON.stringify(config));
    alert('Configuration sauvegardée avec succès !');
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-grow pt-20 pb-16">
        <section className="bg-purple-700 py-12 mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Classement des pays africains</h1>
            <p className="text-lg text-purple-100">
              Explorez et comparez les performances des pays africains selon différents critères d'ouverture des données et de développement.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
              <div className="w-full lg:w-2/3">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                  <div className="w-full md:w-1/2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher un pays..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <svg className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>

                  <RegionalFilters
                    activeRegion={activeRegion}
                    setActiveRegion={setActiveRegion}
                  />
                </div>
              </div>

              <ExportOptions 
                filteredCountriesRanking={filteredCountriesRanking} 
                yearDimensions={yearDimensions} 
                scores={scores} 
              />
            </div>
            <CountryTable
              filteredCountriesRanking={filteredCountriesRanking}
              selectedCountries={selectedCountries}
              onCountrySelect={handleCountrySelection}
              requestSort={requestSort}
              sortConfig={sortConfig}
              yearDimensions={yearDimensions} // Passer les poids au tableau
              scores={scores}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <RankingCharts
                countriesRanking={countriesRanking}
                selectedCountries={selectedCountries}
                yearDimensions={yearDimensions} // Passer les poids aux graphiques
                scores={scores}
              />
            </div>

            <div className="lg:col-span-1">
              <FilterPanel 
                onWeightsChange={setYearDimensions}
                dimensions={dimensions}
                yearDimensions={yearDimensions} 
                scores={scores}
                countriesRanking={countriesRanking}
                onCountryScoreChange={setCountriesRanking} 
              />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default RankingPage;;