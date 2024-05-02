/**
 * Remove escape characters and control characters
 * @param {string} str
 * @returns {string}
 */
const clearEscAndSpecialChars = (str) => {
  // Define regular expression patterns for control characters and escape character
  const controlCharPattern = /[\x00-\x1F\x7F-\x9F]/g;
  const escapeCharPattern = /[\x1B]/g;

  // Remove control characters and escape character from the input string
  return str.replace(controlCharPattern, '').replace(escapeCharPattern, '');
};

module.exports = {
  clearEscAndSpecialChars,
};
