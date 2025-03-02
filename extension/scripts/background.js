chrome.runtime.onInstalled.addListener(async () => { 
    createNewSession();
});

// Listen for messages from the content script
let keystrokes = [];
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.from === "content" && msg.subject === "record_event") {
        handleRecordEvent(msg);
    }

    // Detect and log copy-paste events
    if (msg.action === "record_copy" || msg.action === "record_paste") {
        console.log(`Logging ${msg.action} event to Firestore`, msg.data);

        // Log to Firestore
        addDoc(collection(db, "copy_paste_logs"), {
            type: msg.data.type,
            text: msg.data.text,
            timestamp: msg.data.timestamp,
            url: msg.data.url
        }).then(() => {
            console.log("Copy-Paste event logged successfully!");
        }).catch((error) => {
            console.error("Error logging copy-paste event:", error);
        });
    }
});

const handleRecordEvent = (msg) => {
    chrome.storage.local.get(["keystrokeData"], async function (result) {
        let keystrokeData = result.keystrokeData ?? {
            label: DATA_LABELS,
            data: [],
        };
        if (!Array.isArray(keystrokeData.data)){
            keystrokeData.data = [];
        }
        keystrokeData.data.push(msg.data);
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized in service worker");

// Function to store toggle data in Firestore
async function logToggle(toggleName, state, timestamp) {
    try {
        await addDoc(collection(db, "toggle_tracking"), {
            toggleName: toggleName,
            state: state,
            timestamp: timestamp
        });
        console.log(`Logged to Firestore: ${toggleName} turned ${state} at ${timestamp}`);
    } catch (error) {
        console.error("Error logging toggle:", error);
    }
}

// Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === "track_toggle") {
        logToggle("Tracking Toggle", msg.state, msg.timestamp);
        
        // Also store toggle data locally
        chrome.storage.local.get("toggleTrackingData", function (data) {
            let history = data.toggleTrackingData || [];
            history.push({ state: msg.state, timestamp: msg.timestamp });
            chrome.storage.local.set({ toggleTrackingData: history });
            console.log("Toggle Event Saved:", msg);
        });
    }
});

// Keep the service worker alive using alarms
chrome.alarms.create("keepAlive", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAlive") {
        console.log("Keeping service worker alive");
    }
});
