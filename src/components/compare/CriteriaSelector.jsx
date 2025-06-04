import { useTranslation } from 'react-i18next';

export default function CriteriaSelector({ selectedCriteria, criteriaCount, onCriteriaChange, defaultYearDimensions }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-semibold mb-4">{t('criteriaSeletor')}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('enoghCriteria')}</p>

      <div className="flex flex-wrap gap-y-2 gap-x-6 mb-4">
        {defaultYearDimensions.map(dimension => (
          <button
            key={dimension.id}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCriteria[dimension.name]
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
            }`}
            onClick={() => onCriteriaChange(dimension.name)}
          >
            {dimension.name}
          </button>
        ))}
      </div>

      <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-md mb-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <span className="font-bold">{criteriaCount}</span> {t('selectedCriteria')}
          {criteriaCount < 3 && (
            <span className="text-red-500 ml-2 dark:text-red-400">
              ({t('siCriteriaLow3')})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
