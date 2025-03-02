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

    // Detect and log copy-paste events
    if (msg.action === "record_copy" || msg.action === "record_paste") {
        console.log(`Logging ${msg.action} event to Firestore`, msg.data);

        // Log the copy-paste event to Firestore
        addDoc(collection(db, "copy_paste_logs"), {
            type: msg.data.type,    // Type of action (copy or paste)
            text: msg.data.text,    // Copied or pasted text
            timestamp: msg.data.timestamp,    // Time when the event occurred
            url: msg.data.url    // URL where the event happened
        }).then(() => {
            console.log("Copy-Paste event logged successfully!");
        }).catch((error) => {
            console.error("Error logging copy-paste event:", error);
        });
    }
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

// Function to create a new session (Previously in shared.js)
function createNewSession() {
    console.log("New session created");
}

// Import Firebase as an ES module
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Import Firebase config **(Ensure config.js is properly ignored in GitHub)**
import firebaseConfig from "./config.js"; 

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized in service worker");

// Store toggle switch state changes in Firestore
async function logToggle(toggleName, state, timestamp) {
    try {
        // Save toggle state change to Firestore database
        await addDoc(collection(db, "toggle_tracking"), {
            toggleName: toggleName,    // Name of the toggle switch
            state: state,    // The new state
            timestamp: timestamp    // The timestamp when the toggle changed
        });
        console.log(`Logged to Firestore: ${toggleName} turned ${state} at ${timestamp}`);
    } catch (error) {
        console.error("Error logging toggle:", error);
    }
}

// Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === "track_toggle") {
        // Log the toggle state change to Firestore
        logToggle("Tracking Toggle", msg.state, msg.timestamp);
        
        // Also store toggle data locally
        chrome.storage.local.get("toggleTrackingData", function (data) {
            let history = data.toggleTrackingData || [];
            history.push({ state: msg.state, timestamp: msg.timestamp });
            // Save the updated history to Chrome storage
            chrome.storage.local.set({ toggleTrackingData: history });
            console.log("Toggle Event Saved:", msg);
        });
    }
});

// Keep the service worker alive using alarms
chrome.alarms.create("keepAlive", { periodInMinutes: 5 });
// Event listener for alarm events to prevent service worker from shutting down
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAlive") {
        console.log("Keeping service worker alive");
    }
});
