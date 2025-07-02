import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Settings } from 'lucide-react';

/**
 * WeightValidationBanner Component
 * 
 * Displays weight validation status with severity-based styling and action buttons.
 * Implements the hybrid validation approach with user-friendly messaging.
 */
const WeightValidationBanner = ({ 
  validationResult, 
  onAutoFix, 
  onEqualDistribution, 
  onManualFix,
  className = '' 
}) => {
  if (!validationResult || validationResult.isValid) {
    return null;
  }

  const { severity, message, canAutoFix, currentSum, difference } = validationResult;

  // Severity-based styling
  const severityConfig = {
    error: {
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    },
    warning: {
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500'
    },
    success: {
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    }
  };

  const config = severityConfig[severity] || severityConfig.warning;
  const IconComponent = config.icon;

  return (
    <div className={`border rounded-lg p-4 ${config.bgColor} ${className}`}>
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <IconComponent className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm font-medium ${config.textColor}`}>
                Validation des Poids
              </p>
              <p className={`text-sm mt-1 ${config.textColor}`}>
                {message}
              </p>
              
              {/* Weight Summary */}
              <div className="mt-2 text-xs text-gray-600">
                <span className="font-medium">Total actuel:</span> {currentSum}% 
                <span className="mx-2">•</span>
                <span className="font-medium">Différence:</span> 
                <span className={difference > 0 ? 'text-red-600' : 'text-blue-600'}>
                  {difference > 0 ? '+' : ''}{difference.toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 ml-4">
              {canAutoFix && currentSum > 0 && (
                <button
                  onClick={onAutoFix}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  title="Ajuster automatiquement les poids pour atteindre 100%"
                >
                  Ajustement Auto
                </button>
              )}
              
              {currentSum === 0 && (
                <button
                  onClick={onEqualDistribution}
                  className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                  title="Distribuer les poids de manière égale"
                >
                  Distribution Égale
                </button>
              )}
              
              <button
                onClick={onManualFix}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                title="Ajuster manuellement les poids"
              >
                <Settings className="w-3 h-3 inline mr-1" />
                Manuel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightValidationBanner; 