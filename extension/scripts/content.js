/**
 * @file content.js
 * @description This script detects when the user is interacting with a Google Docs document, tracks word count, 
 *              and logs key events. It sends messages to the background script to record these activities.
 *
 * @author Ellia Morse
 * @created February 26th
 * @revised March 9th
 *
 * @preconditions
 * - The user must be on a Google Docs page (i.e., `docs.google.com`).
 * - The Authentiya extension must be installed and active in the browser.
 * 
 * @inputs
 * - Messages from the content script to the background script, including:
 *   - `google_doc_detected` (indicating a Google Docs page is detected)
 *   - `update_field_info` (information about the focused input field)
 *   - `update_word_count` (the current word count of the input field)
 *   - `record_event` (key events, such as `keydown` and `keyup`)
 * - DOM events, such as `load`, `focusin`, `keydown`, and `keyup`.
 *
 * @outputs
 * - Messages to the background script with event data for Google Docs detection, field information, and key event tracking.
 *
 * @postconditions
 * - Sends messages to the background script when a Google Docs document is detected.
 * - Sends the field information when the user interacts with an input or textarea.
 * - Sends key event data (keydown and keyup) to record the typing actions.
 *
 * @returns {void}
 *
 * @errors & Exceptions
 * - If the page is not a Google Docs document, the detection logic will not trigger.
 * - If the input field does not support text (e.g., non-input or non-textarea), no data will be sent.
 * 
 * @sideEffects
 * - The extension will detect Google Docs pages and track key events.
 * - Word count will be updated live as the user types in an input field or textarea.
 *
 * @invariants
 * - The script will only activate and track activities on Google Docs pages (`docs.google.com`).
 *
 * @knownFaults
 * - Key repeat logic may be bypassed if the user types faster than the timestamp interval check (1000ms).
 */
// Detect Google Docs
function checkForGoogleDocs() {
    // Check if the current URL matches Google Docs document format
    const isGoogleDocs = window.location.hostname === 'docs.google.com' && 
                         window.location.pathname.includes('/document/d/');
    
    if (isGoogleDocs) {
      // Check if we have an active session already
      chrome.storage.local.get(['sessionData'], (result) => {
        if (!result.sessionData || !result.sessionData.sessionActive) {
          // Send message to background script about Google Doc detection
          chrome.runtime.sendMessage({
            from: 'content',
            subject: 'google_doc_detected',
            data: {
              url: window.location.href,
              title: document.title
            }
          });
        }
      });
    }
  }
  
// Run detection when the page loads
window.addEventListener('load', checkForGoogleDocs);

// Track active input field and send information to popup
document.addEventListener('focusin', function(event) {
    const element = event.target;
    
    if (element.tagName.toLowerCase() === 'textarea' || 
        (element.tagName.toLowerCase() === 'input' && element.type === 'text')) {
      
      // Send field information to popup (background)
      chrome.runtime.sendMessage({
        from: 'content',
        subject: 'update_field_info',
        data: {
          elementID: element.id,
          elementName: element.name,
          hostname: window.location.href
        }
      });
      
        // Initial word count
      updateWordCount(element);
      
      // Add input listener to track word count
      element.addEventListener('input', () => {
        updateWordCount(element);
      });
    }
});

// Function to count words and send to popup
function updateWordCount(element) {
    const text = element.value || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0); // Split by whitespace
    const count = words.length; // Count the number of words
    
    chrome.runtime.sendMessage({
      from: 'content',
      subject: 'update_word_count',
      data: {
        count: count
      }
    });
}
  
// Key logging functionality
let lastKeyDown = {}; // Store the last key pressed to detect repeated keypresses

// Listen for 'keydown' events to capture user input
document.addEventListener("keydown", function (event) {
    let timestamp = new Date().getTime(); // Capture the timestamp of the key press
    let inputElement = document.activeElement; // Get the currently active input or textarea element
    
    if (inputElement) {
      const isPlainTextInput = inputElement.tagName.toLowerCase() === "input" && inputElement.type === "text";
      const isTextArea = inputElement.tagName.toLowerCase() === "textarea";
      
      if (isTextArea || isPlainTextInput) {
        let key = event.key; // Capture the pressed key
        
        // Check for key repeat (if the same key was pressed within a second)
        if (lastKeyDown[key] && timestamp - lastKeyDown[key] < 1000) {
          return;
        }
        
        lastKeyDown[key] = timestamp; // Update the last pressed key time

        // Prepare the event data to be sent to the background script
        let data = [
          "keydown",
          key,
          timestamp,
          window.location.host,
          inputElement.id,
          inputElement.name,
        ];
        
        // Send message to background.js to record the key event
        chrome.runtime.sendMessage({
          from: "content",
          subject: "record_event",
          data: data,
        });
      }
    }
  });
  // Listen for 'keyup' events to capture key release
    document.addEventListener("keyup", function (event) {
    let timestamp = new Date().getTime(); // Capture the timestamp of the key release
    let inputElement = document.activeElement; // Get the currently active input or textarea element
    
    if (inputElement) {
      const isPlainTextInput = inputElement.tagName.toLowerCase() === "input" && inputElement.type === "text";
      const isTextArea = inputElement.tagName.toLowerCase() === "textarea";

    // Prepare the event data to be sent to the background script
      if (isTextArea || isPlainTextInput) {
        let key = event.key; // Capture the released key
        lastKeyDown[key] = null; // Reset the key press timestamp
        
        let data = [
          "keyup",
          key,
          timestamp,
          window.location.host,
          inputElement.id,
          inputElement.name,
        ];
        
        // Send message to background.js to record the key event
        chrome.runtime.sendMessage({
          from: "content",
          subject: "record_event",
          data: data,
        });
      }
    }
  });
document.addEventListener("copy", () => {
    let copiedText = document.getSelection().toString();
    if (copiedText) {
        chrome.runtime.sendMessage({ type: "COPY_EVENT", text: copiedText });
    }
});

document.addEventListener("paste", (event) => {
    let pastedText = (event.clipboardData || window.clipboardData).getData("text");
    if (pastedText) {
        chrome.runtime.sendMessage({ type: "PASTE_EVENT", text: pastedText });
    }
});
