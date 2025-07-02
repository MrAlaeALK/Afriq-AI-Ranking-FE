/**
 * Generates a list of years from 2020 to the current year (descending order)
 * @returns {string[]} Array of years as strings
 */
export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let year = currentYear; year >= 2020; year--) {
    years.push(year.toString());
  }
  
  return years;
};

/**
 * Gets the current year as a string
 * @returns {string} Current year
 */
export const getCurrentYear = () => {
  return new Date().getFullYear().toString();
};

/**
 * Validates if a year is within the valid range (2020 - current year)
 * @param {number|string} year - Year to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidYear = (year) => {
  const yearNum = typeof year === 'string' ? parseInt(year) : year;
  const currentYear = new Date().getFullYear();
  
  return yearNum >= 2020 && yearNum <= currentYear;
};

export const prepareWeightForAPI = (formData) => {
  return {
    ...formData,
    weight: parseInt(formData.weight) // Send percentage as it is
  };
}; 