/**
 * @file options.js
 * @description This script is responsible for displaying and rendering the keystroke data in a table format on the extension's options page. 
 *              It retrieves the stored keystroke data from Chrome's local storage and generates the HTML table elements dynamically.
 *              The table is populated with column headers and rows of keystroke data.
 *
 * @author Ellia Morse
 * @created February 26th, 2025
 *
 * @preconditions
 * - Chrome's storage API must be available and contain keystroke data.
 * - The options page must include an HTML structure with a table, specifically elements with IDs `table-header` and `table-body`.
 *
 * @inputs Chrome's local storage (`keystrokeData` containing labels and data arrays).
 * @outputs A dynamically generated HTML table displayed on the options page, filled with keystroke data.
 *
 * @postconditions
 * - The table is updated to display the latest stored keystroke data.
 *
 * @returns {void}
 *
 * @errors & Exceptions
 * - If the keystroke data is not available or is malformed in local storage, the table will not render.
 * - Errors may be logged to the console if the data retrieval or table rendering fails.
 *
 * @sideEffects N/A
 *
 * @invariants
 * - The table will always display the most recent keystroke data available in local storage.
 *
 * @knownFaults N/A
 */
// Get references to the table header and body elements in the DOM
const headerElement = document.getElementById("table-header");
const bodyElement = document.getElementById("table-body");

/**
 * Generates the table header HTML using provided labels.
 * @param {Array<string>} labels - Array of column headers.
 * @returns {string} HTML string representing the table header row.
 */
const tableHeader = (labels) => {
    let ths = labels.reduce((acc, label) => {
        return acc + `<th scope="col">${label}</th>`;
    }, "");
    return `<tr>${ths}</tr>`;
};

/**
 * Generates a single table row based on the provided data.
 * @param {Array<string>} data - Array of values for a row.
 * @returns {string} HTML string representing a table row.
 */
const tableRow = (data) => {
    let tds = data.reduce((acc, datum) => {
        return acc + `<td>${datum}</td>`;
    }, "");
    return `<tr>${tds}</tr>`;
};

/**
 * Fetches keystroke data from Chrome's local storage and renders it into a table.
 * - Retrieves 'keystrokeData' (expected structure: { label: [], data: [] }).
 * - Updates the table header and body with stored data.
 */
const renderTable = async () => {
    let data = await chrome.storage.local.get(["keystrokeData"]);
    let keystrokeData = data?.keystrokeData?.data; // Extract stored keystroke data
    let label = data?.keystrokeData?.label; // Extract column labels

     // If data is missing, exit function
    if (!keystrokeData || !label) {
        return;
    }
    
    // Render table header with column labels
    headerElement.innerHTML = tableHeader(label);

    // Render table rows using stored keystroke data
    let table = keystrokeData?.reduce((acc, data) => {
        return acc + tableRow(data);
    }, "");
    bodyElement.innerHTML = table;
};

// Call function to render the table on page load
renderTable();
