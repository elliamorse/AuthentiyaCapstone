/**
 * @file background.js
 * @description This script is responsible for handling background tasks for the Authentiya extension.
 *              It listens for extension installation, manages keystroke events, clipboard events,
 *              and handles notifications related to document tracking.
 * 
 * @author Ellia Morse
 * @created February 26th
 * @revised March 9th
 *
 * @preconditions
 * - The Authentiya extension must be installed in the Chrome browser.
 * - The content script must be active to send messages to the background script.
 *
 * @inputs
 * - Messages from content scripts containing keystroke data, clipboard events, and document detection information.
 *
 * @outputs
 * - Notifications to the user when a new Google Doc is detected.
 * - Keystroke and clipboard data saved to Chrome local storage.
 *
 * @postconditions
 * - Keystroke and clipboard data are stored in Chrome's local storage, allowing the extension to track typing behavior.
 * - Notifications prompt the user to start tracking their work in a document.
 *
 * @returns {void}
 *
 * @errors & Exceptions
 * - If there is an issue saving to Chrome local storage, the data might not persist.
 * 
 * @sideEffects
 * - Local storage is cleared and a new session is created whenever a new session starts.
 *
 * @invariants
 * - The extension will always maintain a unique session identified by a session key.
 * 
 * @knownFaults
 * - N/A
 */

// When the extension is installed, create a new session
chrome.runtime.onInstalled.addListener(async () => { 
  createNewSession();
});

// Listen for messages from the content scripts and handle events
let keystrokes = [];
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  // Handle keystroke recording event from content script
  if (msg.from === "content" && msg.subject === "record_event") {
      handleRecordEvent(msg);
  }
  
  // Handle clipboard events (copy/paste)
  if (msg.type === "COPY_EVENT" || msg.type === "PASTE_EVENT") {
      handleClipboardEvent(msg);
  }
  
  if (msg.action === "session_started") {
      console.log("Session started:", msg.data);
  }
  
  if (msg.action === "session_ended") {
      console.log("Session ended");
  }
});

// Handle keystroke recording event and store data in Chrome local storage
const handleRecordEvent = (msg) => {
  chrome.storage.local.get(["keystrokeData"], async function (result) {
      let keystrokeData = result.keystrokeData ?? {
          label: ["type", "key", "timestamp", "hostname", "elementID", "elementName"],
          data: [],
      };
      if (!Array.isArray(keystrokeData.data)){
          keystrokeData.data = [];
      }
      // Append the new keystroke event data
      keystrokeData.data.push(msg.data);
      // Save the updated keystroke data to Chrome local storage
      await chrome.storage.local.set({ keystrokeData: keystrokeData });
  });
};

// Handle clipboard event and store data in Chrome local storage
const handleClipboardEvent = (msg) => {
  chrome.storage.local.get({ clipboardHistory: [] }, function (data) {
      let history = data.clipboardHistory;
      history.unshift({ type: msg.type, text: msg.text, time: new Date().toLocaleString() });

      chrome.storage.local.set({ clipboardHistory: history }, () => {
          console.log("Clipboard history updated:", history);
      });
  });
};

// Function to create a new session
function createNewSession() {
  console.log("New session created");
  chrome.storage.local.clear();
  chrome.storage.local.set({ sessionKey: Date.now().toString() });
}

// Listen for Google Docs detection
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.from === "content" && msg.subject === "google_doc_detected") {
      // Create a notification to prompt the user
      chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/default.png',
          title: 'Authentiya - Document Detected',
          message: 'A new document has been opened. Would you like to track your work on this document?',
          buttons: [
              { title: 'Start Tracking' }
          ],
          priority: 2
      });
  }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) { // "Start Tracking" button
      chrome.action.openPopup();
  }
});
