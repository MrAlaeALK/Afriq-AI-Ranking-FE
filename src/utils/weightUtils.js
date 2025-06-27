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
 * @returns {number} Effective weight as percentage, rounded to 1 decimal place
 */
export const calculateEffectiveWeight = (indicatorWeight, dimensionWeight) => {
  const indicator = parseFloat(indicatorWeight) || 0
  const dimension = parseFloat(dimensionWeight) || 0
  const effective = (indicator * dimension) / 100 // Convert to actual percentage
  return Math.round(effective * 10) / 10
} 