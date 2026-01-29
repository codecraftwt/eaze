/**
 * Extracts month (0-indexed) and year from a date string or object.
 * @param {string | Date} dateInput - The date to parse
 * @returns {{month: number, year: number}} 
 */
export const getMonthAndYear = (dateInput) => {
  const date = new Date(dateInput);
  
  // Check if the date is valid to prevent errors
  if (isNaN(date.getTime())) {
    console.error("Invalid date provided to getMonthAndYear");
    return { month: null, year: null };
  }

  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};