// Get references to the buttons and session key display element
const copyBtn = document.getElementById("copy-btn"); // copy button
const resetBtn = document.getElementById("reset-btn"); // new session button
const saveBtn = document.getElementById("save-btn"); // save session button
const codeInput = document.getElementById("code-input"); // session key display area

// Load the stored session key from Chrome's local storage
chrome.storage.local.get(["sessionKey"], async function (result) {
    if (result.sessionKey) {
        // If a session key exists, display it in the popup UI
        codeInput.innerHTML = result.sessionKey;
    } else {
        // If no session key exists, generate and display a new session key
        codeInput.innerHTML = await createNewSession();
    }
});
// Event listener for new session button
resetBtn.addEventListener("click", async () => {
    // When clicked, generate and display a new session key
    codeInput.innerHTML = await createNewSession();
});

// Event listener for copy button
copyBtn.addEventListener("click", () => {
    // Retrieve the session key from storage and copy it to the clipboard
    chrome.storage.local.get(["sessionKey"], function (result) {
        navigator.clipboard.writeText(result.sessionKey);
    });
});
// Event listener for save session button
saveBtn.addEventListener("click", async () => {
    // Retrieve stored keystroke data
    let data = await chrome.storage.local.get(["keystrokeData"]);
    // Convert the keystroke data to CSV format
    let csv = convertToCSV(data.keystrokeData);
    // Prepare the CSV data as a downloadable link
    let dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    // Get the hidden download button
    let dlAnchorElem = document.getElementById("download-btn");
    //Set the download attributes
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute(
        "download",
        `${await getSessionKey()}-${Date.now()}.csv`
    );
    // Simulate a click on the hidden link to trigger the download
    dlAnchorElem.click();
});
// Load the last saved state of the tracking toggle switch from storage
chrome.storage.local.get("toggleTrackingData", function (data) {
    let toggleState = data.toggleTrackingData?.slice(-1)[0]?.state || "off";
    const toggleSwitch = document.getElementById("toggle-tracking");
    if (toggleSwitch) toggleSwitch.checked = toggleState === "on";
});
// Event listener for toggle switch changes
document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("toggle-tracking");
    if (toggleSwitch) {
        toggleSwitch.addEventListener("change", function () {
            // Determine the new state of the toggle switch
            const newState = toggleSwitch.checked ? "on" : "off";
            // Generate a timestamp for the toggle change
            const timestamp = new Date().toISOString();
            // Send a message to the background script to log the tracking state change
            chrome.runtime.sendMessage({ action: "track_toggle", state: newState, timestamp: timestamp });
        });
    }
});

