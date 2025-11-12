/**
 * Date utility functions to handle timezone-safe date operations
 * Prevents date shifting issues when working with form inputs and API calls
 */

/**
 * Clean a date string to remove timezone information completely
 * This is the nuclear option to fix timezone issues
 * @param {string} dateString - Any date string from backend
 * @returns {string} Clean YYYY-MM-DD format
 */
export const cleanDateString = (dateString) => {
  if (!dateString) return '';
  
  console.log('🧹 cleanDateString input:', dateString, typeof dateString);
  
  // If it's already a clean date, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    console.log('🧹 Date already clean:', dateString);
    return dateString;
  }
  
  // If it contains 'T', extract the date part
  if (dateString.includes('T')) {
    const cleaned = dateString.split('T')[0];
    console.log('🧹 Extracted from datetime:', cleaned);
    return cleaned;
  }
  
  // If it's a Date object or other format, try to parse safely
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // Use getFullYear, getMonth, getDate to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const cleaned = `${year}-${month}-${day}`;
      console.log('🧹 Parsed and cleaned:', cleaned);
      return cleaned;
    }
  } catch (e) {
    console.error('🧹 Failed to parse date:', e);
  }
  
  console.log('🧹 Could not clean date, returning empty string');
  return '';
};

/**
 * Format a date string for use in HTML date input (YYYY-MM-DD)
 * Ensures no timezone conversion occurs - CRITICAL for avoiding date shifts
 * @param {string} dateTimeString - DateTime string like "2024-10-23T10:00:00" or "2024-10-23T00:00:00.000Z"
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  console.log('🔧 formatDateForInput input:', dateTimeString);
  
  // Use the nuclear cleaning approach
  const cleaned = cleanDateString(dateTimeString);
  
  console.log('🔧 formatDateForInput output:', cleaned);
  
  return cleaned;
};

/**
 * Format a time string for use in HTML time input (HH:MM)
 * @param {string} dateTimeString - DateTime string like "2024-10-23T10:00:00"
 * @returns {string} Time string in HH:MM format
 */
export const formatTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return '';
  console.log('🔧 formatTimeForInput input:', dateTimeString);
  
  const timePart = dateTimeString.split('T')[1];
  if (!timePart) return '';
  
  const timeOnly = timePart.substring(0, 5); // HH:MM
  console.log('🔧 formatTimeForInput output:', timeOnly);
  
  return timeOnly;
};

/**
 * Combine date and time inputs into a datetime string
 * This avoids timezone conversion issues by keeping everything in local time
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} Combined datetime string in YYYY-MM-DDTHH:MM:SS format
 */
export const combineDateAndTime = (dateString, timeString = '00:00') => {
  if (!dateString) return '';
  
  // Clean the date string first
  const cleanDate = cleanDateString(dateString);
  
  // Ensure time has seconds
  const timeWithSeconds = timeString.includes(':') 
    ? (timeString.length === 5 ? `${timeString}:00` : timeString)
    : '00:00:00';
    
  const result = `${cleanDate}T${timeWithSeconds}`;
  console.log('🔧 combineDateAndTime:', { dateString, cleanDate, timeString, result });
  
  return result;
};

/**
 * Debug function to log date handling information
 * @param {string} label - Label for the debug output
 * @param {string} dateTimeString - DateTime string to debug
 */
export const debugDate = (label, dateTimeString) => {
  console.log(`🕐 DATE DEBUG [${label}]:`, {
    input: dateTimeString,
    cleanedDate: cleanDateString(dateTimeString),
    dateForInput: formatDateForInput(dateTimeString),
    timeForInput: formatTimeForInput(dateTimeString),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    jsDateObject: dateTimeString ? new Date(dateTimeString).toString() : 'N/A',
    jsDateGetDate: dateTimeString ? new Date(dateTimeString).getDate() : 'N/A'
  });
};