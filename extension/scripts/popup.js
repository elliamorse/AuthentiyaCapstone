const copyBtn = document.getElementById("copy-btn");
const resetBtn = document.getElementById("reset-btn");
const saveBtn = document.getElementById("save-btn");
const codeInput = document.getElementById("code-input");

chrome.storage.local.get(["sessionKey"], async function (result) {
    if (result.sessionKey) {
        codeInput.innerHTML = result.sessionKey;
    } else {
        codeInput.innerHTML = await createNewSession();
    }
});

resetBtn.addEventListener("click", async () => {
    codeInput.innerHTML = await createNewSession();
});

copyBtn.addEventListener("click", () => {
    chrome.storage.local.get(["sessionKey"], function (result) {
        navigator.clipboard.writeText(result.sessionKey);
    });
});

saveBtn.addEventListener("click", async () => {
    let data = await chrome.storage.local.get(["keystrokeData"]);
    let csv = convertToCSV(data.keystrokeData);
    let dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    let dlAnchorElem = document.getElementById("download-btn");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute(
        "download",
        `${await getSessionKey()}-${Date.now()}.csv`
    );
    dlAnchorElem.click();
});

chrome.storage.local.get("toggleTrackingData", function (data) {
    let toggleState = data.toggleTrackingData?.slice(-1)[0]?.state || "off";
    const toggleSwitch = document.getElementById("toggle-tracking");
    if (toggleSwitch) toggleSwitch.checked = toggleState === "on";
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("toggle-tracking");
    if (toggleSwitch) {
        toggleSwitch.addEventListener("change", function () {
            const newState = toggleSwitch.checked ? "on" : "off";
            const timestamp = new Date().toISOString();
            chrome.runtime.sendMessage({ action: "track_toggle", state: newState, timestamp: timestamp });
        });
    }
});

