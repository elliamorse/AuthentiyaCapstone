// Import the functions you need from the SDKs you need
importScripts("firebase-app.js", "firebase-firestore.js");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHotgvkFL1Aef1xfT8lh_igc-jE9Je1Jw",
  authDomain: "ai-writing-detector.firebaseapp.com",
  projectId: "ai-writing-detector",
  storageBucket: "ai-writing-detector.appspot.com",
  messagingSenderId: "471920182981",
  appId: "1:471920182981:web:d11fb40b3332668dfe12ac",
  measurementId: "G-G60STPS385"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Function to store toggle data
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


//Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "track_toggle") {
        // Retrieve existing tracking data or initialize an empty array
        chrome.storage.local.get("toggleTrackingData", function (data) {
            let history = data.toggleTrackingData || [];

            // Add new entry
            history.push({ state: message.state, timestamp: message.timestamp });

            // Save updated history
            chrome.storage.local.set({ toggleTrackingData: history });

            console.log("Toggle Event Saved:", message);
        });
    }
});
