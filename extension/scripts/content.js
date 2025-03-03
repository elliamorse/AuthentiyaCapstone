// Track last key press time to prevent duplicate logging
let lastKeyDown = {};

document.addEventListener("keydown", function (event) {
    let timestamp = new Date().getTime();
    let inputElement = document.activeElement;
    if (inputElement) {
        // Check if the active element is a text input field or a textarea
        const isPlainTextInput =
            inputElement.tagName.toLowerCase() === "input" &&
            inputElement.type === "text";
        const isTextArea = inputElement.tagName.toLowerCase() === "textarea";
        if (isTextArea || isPlainTextInput) {
            let key = event.key;

            // Prevent logging repeated key presses within 1 second
            if (lastKeyDown[key] && timestamp - lastKeyDown[key] < 1000) {
                return;
            }

            lastKeyDown[key] = timestamp;

            // Prepare keystroke data for logging
            let data = [
                "keydown",    //Event type
                key,    // Key pressed
                timestamp,    // Timestamp of event
                window.location.host,    // Current website domain
                inputElement.id,    // Input field ID
                inputElement.name,    // Input field name
            ];

            // Send message to background.js
            chrome.runtime.sendMessage({
                from: "content",
                subject: "record_event",
                data: data,
            });
        }
    }
});

document.addEventListener("keyup", function (event) {
    let timestamp = new Date().getTime();

    let inputElement = document.activeElement;
    if (inputElement) {
        // Check if the active element is a text input field or textarea
        const isPlainTextInput =
            inputElement.tagName.toLowerCase() === "input" &&
            inputElement.type === "text";
        const isTextArea = inputElement.tagName.toLowerCase() === "textarea";
        if (isTextArea || isPlainTextInput) {
            let key = event.key;

            // Reset last key press timestamp
            lastKeyDown[key] = null;

            // Prepare keystroke data for logging
            let data = [
                "keyup",    // Event type
                key,    // Key released
                timestamp,    // Timestamp of event
                window.location.host,    // Current website domain
                inputElement.id,    // Input field ID
                inputElement.name,    //Input field name
            ];

            // Send message to background.js
            chrome.runtime.sendMessage({
                from: "content",
                subject: "record_event",
                data: data,
            });
        }
    }
});


document.addEventListener("copy", function (event) {
    const copiedText = document.getSelection().toString(); // Get copied text
    console.log("Copied text:", copiedText);

    // Send the copied text data to background.js
    chrome.runtime.sendMessage({
        action: "record_copy",
        data: {
            type: "copy",
            text: copiedText,
            timestamp: new Date().toISOString(),    // Timestamp of copy event
            url: window.location.href    // URL where the copy event occurred
        }
    });
});

// Capture and log pasted text
document.addEventListener("paste", function (event) {
    let pastedText = (event.clipboardData || window.clipboardData).getData("text"); // Get pasted text
    console.log("Pasted text:", pastedText);

    // Send the pasted text data to background.js
    chrome.runtime.sendMessage({
        action: "record_paste",
        data: {
            type: "paste",
            text: pastedText,
            timestamp: new Date().toISOString(),    // Timestamp of paste event
            url: window.location.href    // URL where the paste event occurred
        }
    });
});
