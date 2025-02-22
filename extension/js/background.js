// Background Script
// This script manages the behavior of the extension.

chrome.runtime.onInstalled.addListener(function () {
    let defaultSettings = {
        "local": {
            "errors": []
        },
        "sync": {
            "new_install": true,
            "canvas_domains": [""]
        }
    };

    chrome.storage.local.set(defaultSettings.local, () => {
        console.log("Authentiya - Local storage initialized: ", defaultSettings.local);
    });

    chrome.storage.sync.set(defaultSettings.sync, () => {
        console.log("Authentiya - Sync storage initialized: ", defaultSettings.sync);
    });
});
