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
    
    if (msg.action === "session_started") {
      console.log("Session started:", msg.data);
      // You could log session start events here
    }
    
    if (msg.action === "session_ended") {
      console.log("Session ended");
      // You could clean up any session resources here
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
        //Save the updated keystroke data to Chrome local storage
        await chrome.storage.local.set({ keystrokeData: keystrokeData });
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