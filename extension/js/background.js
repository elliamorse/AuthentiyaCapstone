// Background Script
// This script manages the behavior of the extension.

// Event listener for browser action clicks.
chrome.browserAction.onClicked.addListener(() => {
    // Execute the content script file on the active tab.
    chrome.tabs.executeScript(null, { file: 'js/content.js' });
  });