import CountryCard from './CountryCard';

export default function CountryCardList({ countryData, selectedCriteria, scores }) {
  // console.log(countryData)  trying to check the uniqueness and find the problem
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Détails des pays sélectionnés</h2>
      <div className="grid grid-cols-1 gap-6">
        {countryData.map((country, index) => (
          <CountryCard
            key={country.countryId}
            country={country}
            index={index}
            selectedCriteria={selectedCriteria}
            scores={scores}
          />
        ))}
      </div>
    </div>
  );
}