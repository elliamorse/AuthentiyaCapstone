/**
 * @file shared.js
 * @description This script contains utility functions that manage session creation, data formatting, 
 *              and interaction with Chrome's local storage. It includes functions to generate and store 
 *              session keys, convert data to CSV format, retrieve the current session key, and open the 
 *              extension's options page. These utilities are used across the extension to facilitate 
 *              consistent data management and session tracking.
 *
 * @author Ellia Morse
 * @created February 26th, 2025
 *
 * @preconditions
 * - Chrome's local storage API must be available and functional.
 * - The extension must be running and have access to necessary storage and UI elements.
 *
 * @inputs
 * - Chrome's local storage (for session data and tracking).
 * - Object arrays containing data to be converted into CSV format.
 *
 * @outputs
 * - A new session key generated and stored in Chrome's local storage.
 * - A CSV string representing structured data for reporting or download.
 *
 * @postconditions
 * - The session key is stored in local storage, and any previous session data is cleared.
 * - The data is converted into CSV format and can be used for exporting or reporting.
 *
 * @returns {Promise<string>}
 * - `createNewSession`: Generates a new session key and stores it in Chrome's local storage.
 * - `convertToCSV`: Converts an object array into a CSV formatted string.
 * - `getSessionKey`: Retrieves the current session key from local storage.
 * - `openOptionsPage`: Opens the options page of the extension in a new window or tab.
 *
 * @errors & Exceptions
 * - If there is an issue with local storage access, errors may be thrown during data retrieval or session creation.
 * - If the input to `convertToCSV` is invalid or missing required properties, an error is logged and an empty string is returned.
 *
 * @sideEffects
 * - Modifies Chrome's local storage by storing session data or clearing it during session creation.
 * - Opens the options page of the extension, either in the current window or in a new tab.
 *
 * @invariants
 * - The session key in local storage is always unique for each session.
 * - The `DATA_LABELS` array provides predefined column headers for data export.
 *
 * @knownFaults
 * - If local storage is cleared or becomes unavailable, session tracking will fail.
 * - If the object array passed to `convertToCSV` is malformed, the CSV generation will not work correctly.
 */
/**
 * Creates a new session by generating a UUID and storing it in Chrome's local storage.
 * Clears any existing session data before setting the new session key.
 * @returns {Promise<string>} A promise that resolves to the new session key.
 */
const createNewSession = async () => {
  let uuid = Date.now().toString(); // Simple timestamp as ID
  await chrome.storage.local.clear(); // Clear existing session data
  await chrome.storage.local.set({ sessionKey: uuid }); // Store the new session key
  console.log("New Session Created");
  return uuid;
};

/**
* Converts an object array to a CSV string.
* @param {Object} objArray - Object containing 'data' (array of rows) and 'label' (column headers).
* @returns {string} CSV formatted string.
*/
const convertToCSV = (objArray) => {
  if (!objArray || !objArray.data){
      console.error("convertToCSV: Invalid input, objArray is undefined or missing 'data' property.");
      return "";
  }

  let data = objArray.data;
  let label = objArray.label;
  let csv = label.join(",") + "\n"; // Add header row
  data.forEach(function (row) {
      row = row.map((datum) => `"${datum}"`); // Wrap values in quotes for CSV formatting
      csv += row.join(","); // Join values with commas
      csv += "\n"; // New line for each row
  });
  return csv;
};

/**
* Retrieves the current session key from Chrome's local storage.
* @returns {Promise<string>} A promise that resolves to the stored session key.
*/
const getSessionKey = async () => {
  let sessionKey = await chrome.storage.local.get(["sessionKey"]);
  return sessionKey.sessionKey;
}

/**
* Predefined labels used for structured data collection.
*/
const DATA_LABELS = ["type", "key", "timestamp", "hostname", "elementID", "elementName"];

/**
* Opens the options page.
*/
function openOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}
