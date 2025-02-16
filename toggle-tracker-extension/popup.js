document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("trackingToggle");

    // Load the saved state when the popup opens
    chrome.storage.local.get("toggleState", function (data) {
        toggle.checked = data.toggleState || false;
    });

    toggle.addEventListener("change", function () {
        const state = toggle.checked ? "on" : "off";
        const timestamp = new Date().toISOString();

        // Save state in Chrome storage
        chrome.storage.local.set({ toggleState: toggle.checked });

        // Send event to background script for tracking
        chrome.runtime.sendMessage({ 
            action: "track_toggle", 
            state: state, 
            timestamp: timestamp 
        });
    });
});
