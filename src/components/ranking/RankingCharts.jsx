import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CountriesRankingContext } from '../../context/CountriesRankingContext';
import { DimensionContext } from '../../context/DimensionContext';
import { ScoresContext } from '../../context/ScoresContext';
import { useContext } from 'react';
import { YearDimensionContext } from '../../context/YearDimensionContext';
import { useTranslation } from 'react-i18next';

const RankingCharts = ({ selectedCountries }) => {
  const { t } = useTranslation();
  const { countriesRanking } = useContext(CountriesRankingContext);
  const { yearDimensions } = useContext(YearDimensionContext);
  const { scores } = useContext(ScoresContext);

  const selectedCountriesData = countriesRanking
    .filter(country => selectedCountries.includes(country.countryName))
    .slice(0, 5); // Maximum 5 pays

  const predefinedColors = [
    '#22c55e', // green
    '#3b82f6', // blue
    '#eab308', // yellow
    '#ef4444', // red
    '#6366f1', // indigo
    '#ec4899', // pink
    '#14b8a6', // teal
    '#10b981', // emerald
    '#9333ea'  // purple
  ];

  const getCriteriaColor = (dimension, dimensionsList) => {
    const index = dimensionsList.indexOf(dimension);
    if (index === -1) return '#6b7280'; // default gray
    return predefinedColors[index % predefinedColors.length];
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('graphiCompare')}</h3>
        <div className="bg-gray-50 dark:bg-gray-700 p-10 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-300">
            {t('selectCountries')}
          </p>
        </div>
      </div>
    );
  }

  const barData = selectedCountriesData.map(country => {
    const data = { name: country.countryName };

    yearDimensions.forEach(dimension => {
      data[getCriteriaLabel(dimension)] =
        scores.find(score => score.countryName === country.countryName && score.dimensionName === dimension.name)?.score || 0;
    });

    return data;
  });

  const bars = yearDimensions.map(dimension => (
    <Bar
      key={dimension.id}
      dataKey={getCriteriaLabel(dimension)}
      fill={getCriteriaColor(dimension, yearDimensions)}
      name={getCriteriaLabel(dimension)}
    />
  ));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('graphiCompare')}</h3>

      <div className="mb-8">
        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-4">{t('compareScorePerCriteria')}</h4>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis domain={[0, 100]} stroke="#8884d8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9f9f9",
                borderRadius: 10
              }}
              wrapperStyle={{
                color: "#111"
              }}
            />
            <Legend />
            {bars}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">{t('selectedCountry')}</h4>
        <div className="flex flex-wrap gap-2">
          {selectedCountriesData.map(country => (
            <div
              key={country.countryId}
              className="flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-300 text-purple-800 rounded-full"
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
