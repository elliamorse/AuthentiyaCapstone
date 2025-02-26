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