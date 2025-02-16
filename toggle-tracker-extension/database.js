chrome.storage.local.get("toggleTrackingData", function (data) {
    console.log("Toggle History:", data.toggleTrackingData);
});
