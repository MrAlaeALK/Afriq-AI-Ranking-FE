import { useTranslation } from "react-i18next";

const RegionalFilters = ({ activeRegion, setActiveRegion }) => {
  const { i18n } = useTranslation();

  const regions = [
    { id: 'all', name: 'Tous' },
    { id: 'North Africa', name: 'Afrique du Nord' },
    { id: 'West Africa', name: 'Afrique de l\'Ouest' },
    { id: 'East Africa', name: 'Afrique de l\'Est' },
    { id: 'Central Africa', name: 'Afrique Centrale' },
    { id: 'Southern Africa', name: 'Afrique Australe' }
  ];

  return (
    <div className="flex flex-wrap gap-2 w-full md:w-auto">
      {regions.map(region => (
        <button
          key={region.id}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            activeRegion === region.id
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
          }`}
          onClick={() => setActiveRegion(region.id)}
        >
          {i18n.language === 'fr' ? region.name : region.id}
        </button>
      ))}
    </div>
  );
};

export default RegionalFilters;
