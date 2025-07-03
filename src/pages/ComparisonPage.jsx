import { useEffect, useState, useContext } from 'react';
import {CountriesRankingContext} from '../context/CountriesRankingContext'

// Importation des composants
import CountryCardList from '../components/compare/CountryCardList';
import CountrySelector from '../components/compare/CountrySelector';
import CriteriaSelector from '../components/compare/CriteriaSelector';
import RadarChartDisplay from '../components/compare/RadarChartDisplay';
import { DimensionContext } from '../context/DimensionContext';
import { ScoresContext } from '../context/ScoresContext';
import { YearContext } from '../context/YearContext';
import { YearDimensionContext } from '../context/YearDimensionContext'
import { useTranslation } from 'react-i18next';

export default function ComparisonPage() {
  const {t} = useTranslation();
  const { year, setYear, availableYears, loading } = useContext(YearContext)
  const { countriesRanking, setCountriesRanking, countriesRankingError } = useContext(CountriesRankingContext);
  const { scores, setScores, scoresError } = useContext(ScoresContext)
  const {dimensions} = useContext(DimensionContext)
  const {yearDimensions, setYearDimensions, defaultYearDimensions} = useContext(YearDimensionContext)
  // const [yearIndicators, setYearIndicators] = useState([])
  // État pour stocker les pays sélectionnés
  const [selectedCountries, setselectedCountries] = useState([null, null, null, null, null]);
  // État pour stocker les critères sélectionnés
  const [selectedCriteria, setSelectedCriteria] = useState({});
  // Compteur de critères sélectionnés
  const [criteriaCount, setCriteriaCount] = useState(3);
  // Données pour le graphique
  const [chartData, setChartData] = useState([]);
  // Données pour chaque pays
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    const defaultSelectedCriteria = defaultYearDimensions.reduce((dimensionsObject, dimension, index) => {
      dimensionsObject[dimension.name] = (index > 2 ? false : true)
      return dimensionsObject
    }, {})

    setSelectedCriteria(defaultSelectedCriteria)
  }, [defaultYearDimensions])

  // Mise à jour des données du graphique lorsque les pays ou critères sélectionnés changent
  useEffect(() => {
    // Variables pour stocker les données formatées
    const newChartData = [];
    const newCountryData = [];

    // Obtenir tous les indicateurs disponibles
    const indicators = Object.keys(selectedCriteria).filter(key => selectedCriteria[key]);

    // Créer un objet pour chaque indicateur avec les valeurs de chaque pays
    indicators.forEach(indicator => {
      const dataPoint = {
        indicator: indicator,
      };

      // Ajouter les données de chaque pays sélectionné
      selectedCountries.forEach((countryId) => {
        if (countryId) {
          const country = countriesRanking.find(c => c.countryId === countryId);
          if (country) {
            // Ajouter le pays à la liste des pays s'il n'y est pas déjà
            if (!newCountryData.find(c => c.countryId === country.countryId)) {
              newCountryData.push(country);
            }
            // Ajouter la valeur de l'indicateur pour ce pays
            dataPoint[`${country.countryName}`] = scores.find(score => score.countryName === country.countryName && score.dimensionName === indicator).score;
          }
        }
      });

      // N'ajouter le point que s'il y a au moins un pays sélectionné
      if (Object.keys(dataPoint).length > 1) {
        newChartData.push(dataPoint);
      }
    });

    setChartData(newChartData);
    setCountryData(newCountryData);
  }, [selectedCountries, selectedCriteria]);

  // Gérer le changement de pays
  const handleCountryChange = (index, countryId) => {
    const newselectedCountries = [...selectedCountries];
    newselectedCountries[index] = countryId ? parseInt(countryId) : null;
    setselectedCountries(newselectedCountries);
  };

  // Gérer le changement de critères
  const handleCriteriaChange = (criterion) => {
    // Calculer le nouveau nombre de critères sélectionnés
    const newCount = selectedCriteria[criterion]
      ? criteriaCount - 1
      : criteriaCount + 1;

    // Vérifier si la déselection laisserait moins de 3 critères
    if (selectedCriteria[criterion] && newCount < 3) {
      alert(t('alertCriteria'));
      return;
    }

    setSelectedCriteria({
      ...selectedCriteria,
      [criterion]: !selectedCriteria[criterion]
    });

    setCriteriaCount(newCount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Chargement des années disponibles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <main className="flex-grow pt-20 pb-16">
        <section className="bg-purple-700 dark:bg-purple-900 py-12 mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-purple-300 mb-4">{t('titleCompare')}</h1>
            <p className="text-lg text-purple-100 dark:text-purple-400">
              {t('compareDesc')}
            </p>
          </div>
        </section>

        {/* Sélecteur d'année dynamique */}
        <div className="container mx-auto px-4 mb-6">
          <select 
            value={year} 
            onChange={e => setYear(parseInt(e.target.value))}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {availableYears.map(availableYear => (
              <option key={availableYear} value={availableYear}>
                {availableYear}
              </option>
            ))}
          </select>
        </div>

        {/* Sélection des critères */}
        <CriteriaSelector
          selectedCriteria={selectedCriteria}
          criteriaCount={criteriaCount}
          onCriteriaChange={handleCriteriaChange}
          defaultYearDimensions={defaultYearDimensions}
        />

        {/* Sélection des pays */}
        <CountrySelector
          selectedCountries={selectedCountries}
          onCountryChange={handleCountryChange}
          countriesRanking={countriesRanking}
        />

        {/* Conteneur pour CardList (gauche) et RadarChart (droite) */}
        {countryData.length > 0 && (
          <div className="container mx-auto px-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cartes des pays (gauche) */}
              <div className="w-full lg:w-1/2">
                <CountryCardList
                  countryData={countryData}
                  selectedCriteria={selectedCriteria}
                  scores={scores}
                />
              </div>

              {/* Graphique de comparaison (droite) */}
              <div className="w-full lg:w-1/2">
                {chartData.length > 0 && criteriaCount >= 3 ? (
                  <RadarChartDisplay
                    chartData={chartData}
                    countryData={countryData}
                  />
                ) : (
                  <div className="text-center p-8 bg-gray-100 rounded-lg">
                    {criteriaCount < 3 ? (
                      <p className="text-gray-500">{t('enoghCriteria')}</p>
                    ) : (
                      <p className="text-gray-500">{t('enoghCountry')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}