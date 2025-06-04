import { ScoresContext } from '../../context/ScoresContext';
import { getColor } from './Data';
import { useContext } from 'react';

export default function CountryCard({ country, index, selectedCriteria }) {
  const { scores } = useContext(ScoresContext);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow overflow-hidden border-t-4" style={{ borderColor: getColor(index) }}>
      <div className="p-4 bg-gray-100 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
            <img
              src={`/public/flags/${country.countryCode}.svg`}
              alt={`${country.countryName} flag`}
              className="w-10 h-10 mr-2"
            />
            {country.countryName}
          </h3>
          <span className="text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1">
            {country.countryRegion}
          </span>
        </div>
      </div>
      <div className="p-4 text-gray-900 dark:text-gray-100">
        <div className="space-y-3">
          {Object.entries(scores
            .filter(score => score.countryName === country.countryName && selectedCriteria[score.dimensionName])
            .reduce((scoresObject, score) => {
              scoresObject[score.dimensionName] = score.score;
              return scoresObject;
            }, {}))
            .map(([key, value]) => (
              <div key={key} className="flex items-center">
                <div className="w-1/3 font-medium">{key}</div>
                <div className="w-2/3">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${value}%`,
                        backgroundColor: getColor(index),
                      }}
                    ></div>
                  </div>
                  <div className="text-right text-sm mt-1">{value}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
