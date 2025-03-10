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