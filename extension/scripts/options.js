// Get references to the table header and body elements in the DOM
const headerElement = document.getElementById("table-header");
const bodyElement = document.getElementById("table-body");
const assignmentDropdown = document.getElementById("assignment-dropdown");

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

/**
 * Fetches courses from Chrome's sync storage and populates the assignment dropdown.
 */
const populateAssignmentDropdown = async () => {
    let data = await chrome.storage.sync.get(["courses"]);
    let courses = data?.courses; // Extract stored courses

    // If courses are missing, exit function
    if (!courses) {
        return;
    }

    // Populate the dropdown with courses
    courses.forEach(course => {
        let option = document.createElement("option");
        option.text = course.name || "Unnamed Course";
        option.value = course.id;
        assignmentDropdown.appendChild(option);
    });
};

// Call functions to render the table and populate the dropdown on page load
renderTable();
populateAssignmentDropdown();
