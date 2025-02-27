// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA5pLCjs64O1nW6FxG1cxEkJR9Qiv2yAI",
  authDomain: "authentiya.firebaseapp.com",
  projectId: "authentiya",
  storageBucket: "authentiya.firebasestorage.app",
  messagingSenderId: "1083502008022",
  appId: "1:1083502008022:web:f399c8b739a7b085c0db77",
  measurementId: "G-9EMYYPCLG1"
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
