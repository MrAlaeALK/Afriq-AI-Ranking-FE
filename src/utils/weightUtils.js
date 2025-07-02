/**
 * Weight Conversion Utilities
 * 
 * This utility file centralizes all weight conversion logic to eliminate
 * data format inconsistencies between frontend (percentages) and backend (decimals).
 * 
 * STANDARD FORMAT RULES:
 * - UI/Frontend: Always use percentages (0-100) for display and input
 * - Backend API: Always send decimals (0.0-1.0) 
 * - Database: Stores decimals (0.0-1.0)
 * - Calculations: Use the format appropriate for the context
 */

// Constants for validation and conversion
export const WEIGHT_CONSTANTS = {
  MIN_PERCENTAGE: 0,
  MAX_PERCENTAGE: 100,
  MIN_DECIMAL: 0.0,
  MAX_DECIMAL: 1.0,
  PRECISION_DECIMALS: 3, // Precision for decimal weights (0.001)
  PRECISION_PERCENTAGES: 1, // Precision for percentage display (0.1%)
}

/**
 * Convert decimal weight (0.0-1.0) to percentage (0-100)
 * @param {number} decimal - Weight in decimal format (0.0-1.0)
 * @returns {number} Weight in percentage format (0-100), rounded to 1 decimal place
 */
export const decimalToPercentage = (decimal) => {
  if (decimal == null || isNaN(decimal)) return 0
  const percentage = decimal * 100
  return Math.round(percentage * 10) / 10 // Round to 1 decimal place
}

/**
 * Convert percentage weight (0-100) to decimal (0.0-1.0)
 * @param {number|string} percentage - Weight in percentage format (0-100)
 * @returns {number} Weight in decimal format (0.0-1.0), rounded to 3 decimal places
 */
export const percentageToDecimal = (percentage) => {
  if (percentage == null || percentage === '') return 0
  const decimal = parseFloat(percentage) / 100
  if (isNaN(decimal)) return 0
  return Math.round(decimal * 1000) / 1000 // Round to 3 decimal places
}

/**
 * Validate percentage weight value
 * @param {number|string} percentage - Weight in percentage format
 * @returns {object} { isValid: boolean, error: string|null, value: number }
 */
export const validatePercentageWeight = (percentage) => {
  if (percentage == null || percentage === '') {
    return { isValid: false, error: 'Le poids est obligatoire', value: 0 }
  }
  
  const numValue = parseFloat(percentage)
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Le poids doit être un nombre valide', value: 0 }
  }
  
  if (numValue < WEIGHT_CONSTANTS.MIN_PERCENTAGE) {
    return { isValid: false, error: `Le poids doit être supérieur ou égal à ${WEIGHT_CONSTANTS.MIN_PERCENTAGE}%`, value: numValue }
  }
  
  if (numValue > WEIGHT_CONSTANTS.MAX_PERCENTAGE) {
    return { isValid: false, error: `Le poids doit être inférieur ou égal à ${WEIGHT_CONSTANTS.MAX_PERCENTAGE}%`, value: numValue }
  }
  
  return { isValid: true, error: null, value: numValue }
}

/**
 * Validate decimal weight value (for backend data)
 * @param {number} decimal - Weight in decimal format
 * @returns {object} { isValid: boolean, error: string|null, value: number }
 */
export const validateDecimalWeight = (decimal) => {
  if (decimal == null) {
    return { isValid: false, error: 'Weight is required', value: 0 }
  }
  
  if (isNaN(decimal)) {
    return { isValid: false, error: 'Weight must be a valid number', value: 0 }
  }
  
  if (decimal < WEIGHT_CONSTANTS.MIN_DECIMAL) {
    return { isValid: false, error: `Weight must be >= ${WEIGHT_CONSTANTS.MIN_DECIMAL}`, value: decimal }
  }
  
  if (decimal > WEIGHT_CONSTANTS.MAX_DECIMAL) {
    return { isValid: false, error: `Weight must be <= ${WEIGHT_CONSTANTS.MAX_DECIMAL}`, value: decimal }
  }
  
  return { isValid: true, error: null, value: decimal }
}

/**
 * Calculate total percentage from an array of weights
 * @param {Array} weights - Array of weight objects with percentage values
 * @param {string} weightField - Field name containing the weight value (default: 'weight')
 * @returns {number} Total percentage, rounded to 1 decimal place
 */
export const calculateTotalPercentage = (weights, weightField = 'weight') => {
  if (!Array.isArray(weights)) return 0
  
  const total = weights.reduce((sum, item) => {
    const weight = parseFloat(item[weightField]) || 0
    return sum + weight
  }, 0)
  
  return Math.round(total * 10) / 10
}

/**
 * Calculate remaining percentage for weight validation
 * @param {Array} existingWeights - Array of existing weight objects
 * @param {number} currentWeight - Current weight being added/updated
 * @param {number} maxTotal - Maximum total allowed (default: 100)
 * @param {string} weightField - Field name containing the weight value (default: 'weight')
 * @returns {object} { total: number, remaining: number, isValid: boolean, message: string }
 */
export const calculateWeightValidation = (existingWeights, currentWeight, maxTotal = 100, weightField = 'weight') => {
  const existingTotal = calculateTotalPercentage(existingWeights, weightField)
  const newWeight = parseFloat(currentWeight) || 0
  const total = existingTotal + newWeight
  const remaining = maxTotal - total
  const isValid = total <= maxTotal
  
  let message = ''
  if (newWeight === 0) {
    message = `Total actuel: ${existingTotal}%`
  } else if (total > maxTotal) {
    message = `Le total des poids ne peut pas dépasser ${maxTotal}%. Total actuel: ${total}%`
  } else if (total === maxTotal) {
    message = 'Parfait! Total: 100%'
  } else {
    message = `Poids restant: ${remaining}%`
  }
  
  return {
    total: Math.round(total * 10) / 10,
    remaining: Math.round(remaining * 10) / 10,
    isValid,
    message
  }
}

/**
 * Format weight for display with appropriate precision
 * @param {number} weight - Weight value
 * @param {boolean} isPercentage - Whether the weight is in percentage format
 * @param {boolean} showSymbol - Whether to show % symbol for percentages
 * @returns {string} Formatted weight string
 */
export const formatWeight = (weight, isPercentage = true, showSymbol = true) => {
  if (weight == null || isNaN(weight)) return isPercentage ? '0%' : '0.000'
  
  if (isPercentage) {
    const formatted = weight.toFixed(WEIGHT_CONSTANTS.PRECISION_PERCENTAGES)
    return showSymbol ? `${formatted}%` : formatted
  } else {
    return weight.toFixed(WEIGHT_CONSTANTS.PRECISION_DECIMALS)
  }
}

/**
 * Prepare weight data for API submission (convert percentages to decimals)
 * @param {object} formData - Form data containing weight as percentage
 * @param {string} weightField - Field name containing the weight (default: 'weight')
 * @returns {object} Form data with weight converted to decimal
 */
export const prepareWeightForAPI = (formData, weightField = 'weight') => {
  if (!formData || !formData[weightField]) return formData
  
  return {
    ...formData,
    [weightField]: percentageToDecimal(formData[weightField])
  }
}

/**
 * Prepare weight data from API response (convert decimals to percentages)
 * @param {object} responseData - API response containing weight as decimal
 * @param {string} weightField - Field name containing the weight (default: 'weight')
 * @returns {object} Response data with weight converted to percentage
 */
export const prepareWeightFromAPI = (responseData, weightField = 'weight') => {
  if (!responseData || responseData[weightField] == null) return responseData
  
  return {
    ...responseData,
    [weightField]: decimalToPercentage(responseData[weightField])
  }
}

/**
 * Calculate effective weight (indicatorWeight * dimensionWeight)
 * @param {number} indicatorWeight - Weight within dimension (percentage)
 * @param {number} dimensionWeight - Weight of dimension (percentage)
 * @returns {number} Effective weight (percentage)
 */
export const calculateEffectiveWeight = (indicatorWeight, dimensionWeight) => {
  const indicator = parseFloat(indicatorWeight) || 0
  const dimension = parseFloat(dimensionWeight) || 0
  
  return Math.round((indicator * dimension / 100) * 10) / 10
}

/**
 * HYBRID VALIDATION APPROACH - Enhanced weight validation functions
 * ================================================================
 */

/**
 * Validates dimension weight completeness with hybrid approach
 * @param {Array} indicatorWeights - Array of indicator weights for a dimension
 * @param {string} weightField - Field name containing weight values
 * @returns {object} Comprehensive validation result
 */
export const validateDimensionWeightCompleteness = (indicatorWeights, weightField = 'weight') => {
  if (!Array.isArray(indicatorWeights) || indicatorWeights.length === 0) {
    return {
      isValid: false,
      severity: 'error',
      currentSum: 0,
      targetSum: 100,
      difference: -100,
      message: 'Aucun indicateur configuré pour cette dimension',
      canAutoFix: false,
      suggestions: []
    }
  }

  const currentSum = calculateTotalPercentage(indicatorWeights, weightField)
  const difference = currentSum - 100
  const isValid = Math.abs(difference) <= 0.01 // Must be exactly 100% (0.01% tolerance for rounding)
  
  let severity = 'success'
  let message = ''
  let canAutoFix = true
  
  if (currentSum === 0) {
    severity = 'warning'
    message = 'Aucun poids configuré. Distribution égale recommandée.'
  } else if (isValid) {
    severity = 'success'
    message = `✓ Parfait! Les ${indicatorWeights.length} indicateurs totalisent exactement 100%`
  } else {
    severity = 'error'
    message = difference > 0
      ? `❌ Total invalide: ${currentSum}% au lieu de 100% (excès de ${difference.toFixed(1)}%)`
      : `❌ Total invalide: ${currentSum}% au lieu de 100% (manque ${Math.abs(difference).toFixed(1)}%)`
  }

  const suggestions = generateWeightSuggestions(indicatorWeights, weightField)

  return {
    isValid,
    severity,
    currentSum: Math.round(currentSum * 10) / 10,
    targetSum: 100,
    difference: Math.round(difference * 10) / 10,
    message,
    canAutoFix,
    suggestions,
    indicatorCount: indicatorWeights.length
  }
}

/**
 * Generates weight adjustment suggestions for auto-fix functionality
 * @param {Array} indicatorWeights - Array of indicator weights
 * @param {string} weightField - Field name containing weight values
 * @returns {object} Adjustment suggestions
 */
export const generateWeightSuggestions = (indicatorWeights, weightField = 'weight') => {
  if (!Array.isArray(indicatorWeights) || indicatorWeights.length === 0) {
    return {
      equalDistribution: [],
      proportionalAdjustment: [],
      method: 'none'
    }
  }

  const currentSum = calculateTotalPercentage(indicatorWeights, weightField)
  
  // Equal distribution suggestion
  const equalDistribution = distributeEqualWeightsJS(indicatorWeights, weightField)
  
  // Proportional adjustment suggestion
  const proportionalAdjustment = currentSum > 0 
    ? adjustWeightsProportionallyJS(indicatorWeights, currentSum, weightField)
    : equalDistribution

  return {
    equalDistribution,
    proportionalAdjustment,
    method: currentSum === 0 ? 'equal' : 'proportional'
  }
}

/**
 * Creates equal weight distribution for all indicators
 * @param {Array} indicatorWeights - Array of indicator weights
 * @param {string} weightField - Field name containing weight values
 * @returns {Array} New weights with equal distribution
 */
export const distributeEqualWeightsJS = (indicatorWeights, weightField = 'weight') => {
  const equalWeight = Math.floor(100 / indicatorWeights.length)
  const remainder = 100 % indicatorWeights.length
  
  return indicatorWeights.map((indicator, index) => ({
    ...indicator,
    [weightField]: equalWeight + (index < remainder ? 1 : 0),
    isAdjusted: true
  }))
}

/**
 * Adjusts weights proportionally to sum to 100%
 * @param {Array} indicatorWeights - Array of indicator weights
 * @param {number} currentSum - Current sum of weights
 * @param {string} weightField - Field name containing weight values
 * @returns {Array} Proportionally adjusted weights
 */
export const adjustWeightsProportionallyJS = (indicatorWeights, currentSum, weightField = 'weight') => {
  if (currentSum === 0) return distributeEqualWeightsJS(indicatorWeights, weightField)
  
  const scalingFactor = 100 / currentSum
  let adjustedSum = 0
  
  // First pass: scale proportionally
  const adjusted = indicatorWeights.map(indicator => {
    const originalWeight = parseFloat(indicator[weightField]) || 0
    const adjustedWeight = Math.round(originalWeight * scalingFactor)
    adjustedSum += adjustedWeight
    
    return {
      ...indicator,
      [weightField]: adjustedWeight,
      isAdjusted: true,
      originalWeight
    }
  })
  
  // Second pass: handle rounding differences
  const difference = 100 - adjustedSum
  if (difference !== 0) {
    // Find the indicator with the largest weight to adjust
    const maxIndex = adjusted.reduce((maxIdx, curr, idx, arr) => 
      curr[weightField] > arr[maxIdx][weightField] ? idx : maxIdx, 0)
    
    adjusted[maxIndex][weightField] += difference
  }
  
  return adjusted
}

/**
 * Real-time weight validation as user types
 * @param {number} newWeight - New weight value being entered
 * @param {Array} otherWeights - Other existing weights in the dimension
 * @param {string} weightField - Field name containing weight values
 * @returns {object} Real-time validation feedback
 */
export const validateWeightInput = (newWeight, otherWeights, weightField = 'weight') => {
  const numericWeight = parseFloat(newWeight) || 0
  const otherSum = calculateTotalPercentage(otherWeights, weightField)
  const totalSum = otherSum + numericWeight
  const remaining = 100 - totalSum
  
  let status = 'valid'
  let message = ''
  let canSave = true
  
  if (numericWeight < 0) {
    status = 'error'
    message = 'Le poids ne peut pas être négatif'
    canSave = false
  } else if (numericWeight > 100) {
    status = 'error'
    message = 'Le poids ne peut pas dépasser 100%'
    canSave = false
  } else if (totalSum > 100) {
    status = 'error'
    message = `Total dépassé: ${totalSum.toFixed(1)}% (excès de ${(totalSum - 100).toFixed(1)}%)`
    canSave = false
  } else if (totalSum === 100) {
    status = 'success'
    message = '✓ Parfait! Total: 100%'
  } else {
    status = 'info'
    message = `Poids restant: ${remaining.toFixed(1)}%`
  }
  
  return {
    status,
    message,
    canSave,
    totalSum: Math.round(totalSum * 10) / 10,
    remaining: Math.round(remaining * 10) / 10
  }
}

/**
 * Creates a weight validation banner configuration
 * @param {object} validationResult - Result from validateDimensionWeightCompleteness
 * @returns {object} Banner configuration for UI display
 */
export const createValidationBanner = (validationResult) => {
  const { severity, message, isValid, canAutoFix, currentSum, difference } = validationResult
  
  const bannerConfig = {
    show: !isValid,
    severity,
    message,
    actions: []
  }
  
  if (canAutoFix && !isValid) {
    bannerConfig.actions.push({
      type: 'auto-fix',
      label: 'Ajustement automatique',
      variant: 'primary'
    })
  }
  
  if (currentSum === 0) {
    bannerConfig.actions.push({
      type: 'equal-distribution',
      label: 'Distribution égale',
      variant: 'secondary'
    })
  }
  
  bannerConfig.actions.push({
    type: 'manual-fix',
    label: 'Ajuster manuellement',
    variant: 'outline'
  })
  
  return bannerConfig
}

/**
 * Formats weight validation summary for display
 * @param {object} validationResult - Validation result
 * @returns {string} Formatted summary text
 */
export const formatValidationSummary = (validationResult) => {
  const { currentSum, targetSum, indicatorCount, isValid } = validationResult
  
  if (isValid) {
    return `${indicatorCount} indicateurs • Total: ${currentSum}% ✓`
  } else {
    return `${indicatorCount} indicateurs • Total: ${currentSum}%/${targetSum}%`
  }
} 