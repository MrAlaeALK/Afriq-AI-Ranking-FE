import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CountriesRankingContext } from '../../context/CountriesRankingContext';
import { DimensionContext } from '../../context/DimensionContext';
import { ScoresContext } from '../../context/ScoresContext';
import { useContext } from 'react';
import { YearDimensionContext } from '../../context/YearDimensionContext';

const RankingCharts = ({ selectedCountries }) => {
  const {countriesRanking} = useContext(CountriesRankingContext);
  const {yearDimensions} = useContext(YearDimensionContext);
  const {scores} = useContext(ScoresContext)
  const selectedCountriesData = countriesRanking
    .filter(country => selectedCountries.includes(country.countryName))
    .slice(0, 5); // Maximum 5 pays

  // Fonction pour obtenir la couleur d'un critère
  const predefinedColors = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#eab308', // yellow
  '#ef4444', // red
  '#6366f1', // indigo
  '#ec4899', // pink
  '#14b8a6', // teal
  '#10b981',  // emerald
  '#9333ea' // purple
];

const getCriteriaColor = (dimension, dimensionsList) => {
  const index = dimensionsList.indexOf(dimension);
  if (index === -1) return '#6b7280'; // default gray
  return predefinedColors[index % predefinedColors.length];
};

  // Fonction pour obtenir le label d'un critère
  const getCriteriaLabel = (dimension) => {
    const labelMap = {
      odin: 'ODIN',
      hdi: 'IDH',
      internet: 'Internet',
      education: 'Éducation',
      gdp: 'PIB',
      innovation: 'Innovation',
      governance: 'Gouvernance',
      health: 'Santé',
      environment: 'Environnement'
    };

    return labelMap[dimension] || dimension.name.toUpperCase();
  };

  if (selectedCountriesData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6">Comparaison graphique</h3>
        <div className="bg-gray-50 p-10 rounded-lg text-center">
          <p className="text-gray-500">
            Sélectionnez des pays dans le tableau pour les comparer
          </p>
        </div>
      </div>
    );
  }

  // Préparer les données pour le graphique à barres
  const barData = selectedCountriesData.map(country => {
    const data = { name: country.countryName };

    // Ajouter les scores pour chaque critère sélectionné
    yearDimensions.forEach(dimension => {
      data[getCriteriaLabel(dimension)] = scores.find(score => score.countryName === country.countryName && score.dimensionName === dimension.name).score || 0;
    });

    return data;
  });

  // Définir les barres pour chaque critère sélectionné
  const bars = yearDimensions.map(dimension => (
    <Bar
      key={dimension.id}
      dataKey={getCriteriaLabel(dimension)}
      fill={getCriteriaColor(dimension,yearDimensions)}
      name={getCriteriaLabel(dimension)}
    />
  ));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Comparaison graphique</h3>

      <div className="mb-8">
        <h4 className="font-medium text-gray-700 mb-4">Comparaison des scores par critère</h4>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: 10 }}
            />
            <Legend />
            {bars}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Pays sélectionnés</h4>
        <div className="flex flex-wrap gap-2">
          {selectedCountriesData.map(country => (
            <div
              key={country.countryId}
              className="flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
            >
              <img
                src={`/public/flags/${country.countryCode}.svg`}
                alt={`${country.countryName} flag`}
                className="w-7 h-7 mr-2"
              />
              <span className="font-medium">{country.countryName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingCharts;