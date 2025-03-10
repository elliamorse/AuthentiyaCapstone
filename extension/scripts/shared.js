/**
 * Fetches a new UUID from an external API.
 * @returns {Promise<string>} A promise that resolves to a generated UUID.
 */
const fetchUUID = () => {
    return fetch("https://www.uuidtools.com/api/generate/v1").then(function (
        response
    ) {
        return response.json();
    });
};

/**
 * Creates a new session by generating a UUID and storing it in Chrome's local storage.
 * Clears any existing session data before setting the new session key.
 * @returns {Promise<string>} A promise that resolves to the new session key.
 */
const createNewSession = async () => {
    let uuid = (await fetchUUID())[0]; // Fetch a new UUID
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
 * Format a timestamp into a readable date/time string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
}

/**
 * Filter data based on time period
 * @param {Array} data - Array of data rows
 * @param {string} timePeriod - Time period to filter by ('today', 'week', 'month')
 * @returns {Array} Filtered data rows
 */
function filterDataByTime(data, timePeriod) {
    if (!data || !Array.isArray(data)) return [];
    
    const now = new Date();
    return data.filter(row => {
        const timestamp = new Date(parseInt(row[2]));
        
        switch(timePeriod) {
            case 'today':
                return timestamp.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return timestamp >= weekAgo;
            case 'month':
                const monthAgo = new Date();
                monthAgo.setMonth(now.getMonth() - 1);
                return timestamp >= monthAgo;
            default:
                return true;
        }
    });
}

/**
 * Create a citation record for copied content
 * @param {string} text - Copied text
 * @param {string} url - Source URL
 * @param {Date} timestamp - When the copy occurred
 * @returns {Object} Citation record
 */
function createCitation(text, url, timestamp) {
    return {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        url: url,
        title: document.title || url,
        timestamp: timestamp.toISOString(),
        formatted: `"${text.substring(0, 100)}${text.length > 100 ? '...' : ''}" from ${document.title || url}`
    };
}