// Get references to the buttons and session key display element
const copyBtn = document.getElementById("copy-btn"); // copy button
const resetBtn = document.getElementById("reset-btn"); // new session button
const saveBtn = document.getElementById("save-btn"); // save button
const codeInput = document.getElementById("code-input"); // session key display area

// Load the stored session key from Chrome's local storage
chrome.storage.local.get(["sessionKey"], async function (result) {
    if (result.sessionKey) {
        // If a session key exists, display it in the popup
        codeInput.innerHTML = result.sessionKey;
    } else {
        // If no session key exists, create a new session key
        codeInput.innerHTML = await createNewSession();
    }
});

// Event listener for "new session" button
resetBtn.addEventListener("click", async () => {
    //when the reset button is clicked, generate a new session key
    codeInput.innerHTML = await createNewSession();
});

// Event listener for "copy session" button
copyBtn.addEventListener("click", () => {
    // retrieve the session key from storage and copy it to clipboard
    chrome.storage.local.get(["sessionKey"], function (result) {
        navigator.clipboard.writeText(result.sessionKey);
    });
});

// Event listener for "save session" button
saveBtn.addEventListener("click", async () => {
    // Retrieve keystroke data to CSV format
    let data = await chrome.storage.local.get(["keystrokeData"]);
    // Convert keystroke data to CSV format
    let csv = convertToCSV(data.keystrokeData);
    // Prepare the CSV data as a downloadable link
    let dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    // Get the hidden "download" button
    let dlAnchorElem = document.getElementById("download-btn");
    // Set the download attributes (filename and data source)
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute(
        "download",
        `${await getSessionKey()}-${Date.now()}.csv`
    );
    // Simulate a click on the hidden link to trigger the download
    dlAnchorElem.click();
});
