import React, { useState, useEffect } from 'react';
import { validateWeightInput } from '../../utils/weightUtils';

/**
 * WeightInputField Component
 * 
 * Enhanced input field for weight values with real-time validation feedback.
 * Provides immediate feedback as users type weight values.
 */
const WeightInputField = ({
  value,
  onChange,
  otherWeights = [],
  weightField = 'weight',
  placeholder = 'Poids (%)',
  disabled = false,
  className = '',
  showValidation = true,
  onValidationChange = null
}) => {
  const [inputValue, setInputValue] = useState(value?.toString() || '');
  const [validation, setValidation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value?.toString() || '');
  }, [value]);

  // Validate on input change
  useEffect(() => {
    if (showValidation && inputValue !== '') {
      const validationResult = validateWeightInput(inputValue, otherWeights, weightField);
      setValidation(validationResult);
      
      // Notify parent component of validation status
      if (onValidationChange) {
        onValidationChange(validationResult);
      }
    } else {
      setValidation(null);
      if (onValidationChange) {
        onValidationChange(null);
      }
    }
  }, [inputValue, otherWeights, weightField, showValidation, onValidationChange]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Convert to number and call parent onChange
    const numericValue = parseFloat(newValue) || 0;
    onChange(numericValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Determine input styling based on validation status
  const getInputStyling = () => {
    if (!validation || !showValidation) {
      return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }

    switch (validation.status) {
      case 'error':
        return 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50';
      case 'success':
        return 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50';
      case 'info':
        return 'border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }
  };

  // Determine validation message styling
  const getMessageStyling = () => {
    if (!validation) return 'text-gray-500';

    switch (validation.status) {
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={className}>
      {/* Input Field */}
      <div className="relative">
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm border rounded-md transition-colors
            ${getInputStyling()}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
        />
        
        {/* Percentage Symbol */}
        <span className="absolute right-3 top-2 text-sm text-gray-500">%</span>
      </div>

      {/* Validation Message */}
      {showValidation && validation && (isFocused || validation.status === 'error') && (
        <p className={`mt-1 text-xs ${getMessageStyling()}`}>
          {validation.message}
        </p>
      )}

      {/* Progress Indicator */}
      {showValidation && validation && isFocused && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Total: {validation.totalSum}%</span>
            <span>Restant: {validation.remaining}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                validation.totalSum > 100
                  ? 'bg-red-500'
                  : validation.totalSum === 100
                  ? 'bg-green-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(validation.totalSum, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightInputField; 