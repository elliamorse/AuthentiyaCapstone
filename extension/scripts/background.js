importScripts("shared.js");

chrome.runtime.onInstalled.addListener(async () => {
    await createNewSession();
});

// Listen for messages from the content script
let keystrokes = [];
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.from === "content" && msg.subject === "record_event") {
        handleRecordEvent(msg);
    }
});

const handleRecordEvent = (msg) => {
    chrome.storage.local.get(["keystrokeData"], async function (result) {
        let keystrokeData = result.keystrokeData ?? {
            label: DATA_LABELS,
            data: [],
        };
        keystrokeData.data.push(msg.data);
        await chrome.storage.local.set({ keystrokeData: keystrokeData });
    });
};