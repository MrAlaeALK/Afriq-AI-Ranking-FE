import React, { useState, useEffect } from 'react';
import { useWeightValidation } from '../../hooks/useWeightValidation';
import WeightValidationBanner from './WeightValidationBanner';
import WeightInputField from './WeightInputField';
import { formatValidationSummary } from '../../utils/weightUtils';

/**
 * DimensionWeightManager Component
 * 
 * Example integration of the hybrid weight validation approach.
 * Demonstrates real-time validation, auto-adjustment, and user-friendly feedback.
 */
const DimensionWeightManager = ({ 
  dimensionId, 
  dimensionName, 
  year, 
  initialIndicators = [],
  onWeightsChange 
}) => {
  const [indicators, setIndicators] = useState(initialIndicators);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Use the weight validation hook
  const {
    validationResult,
    isValidating,
    error,
    applyProportionalAdjustment,
    applyEqualDistribution,
    applyBackendAdjustment,
    validateForRankingGeneration,
    isValid,
    currentSum,
    severity
  } = useWeightValidation(indicators, 'weight', dimensionId, year);

  // Update indicators when initial data changes
  useEffect(() => {
    setIndicators(initialIndicators);
    setHasUnsavedChanges(false);
  }, [initialIndicators]);

  // Handle individual weight changes
  const handleWeightChange = (indicatorIndex, newWeight) => {
    const updatedIndicators = indicators.map((indicator, index) => 
      index === indicatorIndex 
        ? { ...indicator, weight: newWeight }
        : indicator
    );
    
    setIndicators(updatedIndicators);
    setHasUnsavedChanges(true);
    
    if (onWeightsChange) {
      onWeightsChange(updatedIndicators);
    }
  };

  // Handle auto-fix actions
  const handleAutoFix = async () => {
    try {
      const adjustedWeights = await applyBackendAdjustment('proportional');
      setIndicators(adjustedWeights);
      setHasUnsavedChanges(true);
      
      if (onWeightsChange) {
        onWeightsChange(adjustedWeights);
      }
    } catch (err) {
      console.error('Auto-fix failed:', err);
    }
  };

  const handleEqualDistribution = () => {
    const adjustedWeights = applyEqualDistribution();
    setIndicators(adjustedWeights);
    setHasUnsavedChanges(true);
    
    if (onWeightsChange) {
      onWeightsChange(adjustedWeights);
    }
  };

  const handleManualFix = () => {
    setIsEditing(true);
  };

  // Handle validation for ranking generation
  const handleValidateForRanking = async () => {
    try {
      const result = await validateForRankingGeneration();
      console.log('Ranking validation result:', result);
      // Handle result (show modal, redirect, etc.)
    } catch (err) {
      console.error('Ranking validation failed:', err);
    }
  };

  // Save changes
  const handleSave = async () => {
    if (!isValid) {
      alert('Cannot save: weights must sum to 100%');
      return;
    }

    try {
      // Call API to save weights
      // await adminService.updateIndicatorWeightsBatch(indicators);
      setHasUnsavedChanges(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setIndicators(initialIndicators);
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {dimensionName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Année {year} • {formatValidationSummary(validationResult)}
          </p>
        </div>

        <div className="flex space-x-2">
          {hasUnsavedChanges && (
            <>
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid}
                className={`px-3 py-1 text-sm text-white rounded ${
                  isValid 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Sauvegarder
              </button>
            </>
          )}
          
          <button
            onClick={handleValidateForRanking}
            disabled={!isValid || isValidating}
            className="px-3 py-1 text-sm text-green-600 border border-green-300 rounded hover:bg-green-50 disabled:opacity-50"
          >
            Valider pour Classement
          </button>
        </div>
      </div>

      {/* Validation Banner */}
      <WeightValidationBanner
        validationResult={validationResult}
        onAutoFix={handleAutoFix}
        onEqualDistribution={handleEqualDistribution}
        onManualFix={handleManualFix}
        className="mb-6"
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Indicators Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Indicateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Poids (%)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {indicators.map((indicator, index) => {
              const otherWeights = indicators.filter((_, i) => i !== index);
              
              return (
                <tr key={indicator.id || index} className={indicator.isAdjusted ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {indicator.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {indicator.description || 'Aucune description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <WeightInputField
                      value={indicator.weight}
                      onChange={(newWeight) => handleWeightChange(index, newWeight)}
                      otherWeights={otherWeights}
                      disabled={!isEditing && !hasUnsavedChanges}
                      className="w-24"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {indicator.isAdjusted && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Ajusté
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="2" className="px-6 py-3 text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="px-6 py-3 text-center">
                <span className={`text-sm font-bold ${
                  isValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentSum.toFixed(1)}%
                </span>
              </td>
              <td className="px-6 py-3 text-center">
                {severity === 'success' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Valide
                  </span>
                )}
                {severity === 'warning' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⚠ Attention
                  </span>
                )}
                {severity === 'error' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ❌ Erreur
                  </span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Loading Overlay */}
      {isValidating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-sm text-gray-600">Validation en cours...</div>
        </div>
      )}
    </div>
  );
};

export default DimensionWeightManager; 