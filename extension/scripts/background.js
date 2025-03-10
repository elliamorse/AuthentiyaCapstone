// When the extension is installed, create a new session
chrome.runtime.onInstalled.addListener(async () => { 
    createNewSession();
});

// Define DATA_LABELS if missing
const DATA_LABELS = ["type", "key", "timestamp", "hostname", "elementID", "elementName"];

// Listen for messages from the content scripts and handle events
let keystrokes = [];
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // Handle keystroke recording event from content script
    if (msg.from === "content" && msg.subject === "record_event") {
        handleRecordEvent(msg);
    }

    // Detect and log copy-paste events
    if (msg.action === "record_copy" || msg.action === "record_paste") {
        console.log(`Logging ${msg.action} event`, msg.data);

        // Add code here if you want to send to external service
    }
    
    // Pass response to keep the message channel open for async operations
    return true;
});

// Handle keystroke recording event and store data in Chrome local storage
const handleRecordEvent = (msg) => {
    chrome.storage.local.get(["keystrokeData"], async function (result) {
        let keystrokeData = result.keystrokeData ?? {
            label: DATA_LABELS,    // Label for stored keystroke data
            data: [],    // Initialize empty data array if not found
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
    chrome.storage.local.remove(['sessionData', 'keystrokeData']);
}

// Store toggle switch state changes locally
function logToggle(toggleName, state, timestamp) {
    try {
        console.log(`Logged toggle: ${toggleName} turned ${state} at ${timestamp}`);
        
        // Store locally instead of Firestore
        chrome.storage.local.get("toggleTrackingData", function (data) {
            let history = data.toggleTrackingData || [];
            history.push({ 
                toggleName: toggleName,    // Name of the toggle switch
                state: state,    // The new state
                timestamp: timestamp    // The timestamp when the toggle changed
            });
            
            // Save the updated history to Chrome storage
            chrome.storage.local.set({ toggleTrackingData: history });
        });
    } catch (error) {
        console.error("Error logging toggle:", error);
    }
}

// Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === "track_toggle") {
        // Log the toggle state change
        logToggle("Tracking Toggle", msg.state, msg.timestamp);
    }
    
    if (msg.action === "session_started") {
        console.log("Session started:", msg.data);
        // You could initialize resources for the session here
    }
    
    if (msg.action === "session_ended") {
        console.log("Session ended");
        // Clean up any session resources here
    }
    
    // Return true to keep the message channel open for async operations
    return true;
});

// Keep the service worker alive using alarms
chrome.alarms.create("keepAlive", { periodInMinutes: 5 });

// Event listener for alarm events to prevent service worker from shutting down
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAlive") {
        console.log("Keeping service worker alive");
    }
});

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
    
    // Return true to keep the message channel open for async operations
    return true;
});
  
// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) { // "Start Tracking" button
        chrome.action.openPopup();
    }
});