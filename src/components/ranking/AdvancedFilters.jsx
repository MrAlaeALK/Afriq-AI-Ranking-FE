import CriteriaSelector from './CriteriaSelector';
import { useTranslation } from 'react-i18next';

const AdvancedFilters = ({ weights, setWeights, onWeightsChange }) => {

  const {t} = useTranslation();
  const resetFilters = () => {
    const dimensions = {
      'odin': 40,
      'hdi': 30,
      'internet': 30
    };
    setWeights(dimensions);

    if (onWeightsChange) {
      onWeightsChange(dimensions);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">{t('choseCriteria')}</h3>

      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-4">{t('personalisedPond')}</h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('adjustment')}        
        </p>

        {/* Nouveau composant de sélection de critères */}
        <CriteriaSelector
          weights={weights}
          setWeights={setWeights}
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          {t('reinitialise')}
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;