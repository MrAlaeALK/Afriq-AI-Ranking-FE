// components/CountryRanking.js
import { useNavigate } from 'react-router-dom';
import { CountriesRankingContext } from '../../context/CountriesRankingContext';
import { useContext } from 'react';

function CountryRanking({ colorScale = 'green-red' }) {
  const {countriesRanking} = useContext(CountriesRankingContext)
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/classement');
  };

  return (
    <div className="w-full xl:w-1/3">
      {/* following change of width and height of map (even if it does not feel so great) i changed h-full to h-auto here */}
      <div className="bg-white p-6 rounded-xl shadow-md h-auto">  
        <h3 className="text-xl font-semibold mb-4">Top 10 pays</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="pb-3 border-b text-left text-sm font-medium text-gray-500">Rang</th>
                <th className="pb-3 border-b text-left text-sm font-medium text-gray-500">Pays</th>
                <th className="pb-3 border-b text-right text-sm font-medium text-gray-500">Score</th>
              </tr>
            </thead>
            <tbody>
              {countriesRanking.slice(0, 9).map((country) => (
                <CountryRow key={country.countryName} country={country} colorScale={colorScale} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors" onClick={handleRedirect}>
            Voir le classement complet
          </button>
        </div>
      </div>
    </div>
  );
}

function CountryRow({ country, colorScale }) {
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

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 text-gray-800">{country.rank}</td>
      <td className="py-3 text-gray-800">
        <span className="mr-2">{country.countryName[0]}</span>
        {country.countryName}
      </td>
      <td className="py-3 text-right font-medium" style={{ color: getColorByScore(Number(country.finalScore)) }}>
        {country.finalScore}
      </td>
    </tr>
  );
};
export default CountryRanking;