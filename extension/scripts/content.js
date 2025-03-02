let lastKeyDown = {};

document.addEventListener("keydown", function (event) {
    let timestamp = new Date().getTime();
    let inputElement = document.activeElement;
    if (inputElement) {
        const isPlainTextInput =
            inputElement.tagName.toLowerCase() === "input" &&
            inputElement.type === "text";
        const isTextArea = inputElement.tagName.toLowerCase() === "textarea";
        if (isTextArea || isPlainTextInput) {
            let key = event.key;

            // Check for key repeat
            if (lastKeyDown[key] && timestamp - lastKeyDown[key] < 1000) {
                return;
            }

            lastKeyDown[key] = timestamp;

            let data = [
                "keydown",
                key,
                timestamp,
                window.location.host,
                inputElement.id,
                inputElement.name,
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
        const isPlainTextInput =
            inputElement.tagName.toLowerCase() === "input" &&
            inputElement.type === "text";
        const isTextArea = inputElement.tagName.toLowerCase() === "textarea";
        if (isTextArea || isPlainTextInput) {
            let key = event.key;

            lastKeyDown[key] = null;

            let data = [
                "keyup",
                key,
                timestamp,
                window.location.host,
                inputElement.id,
                inputElement.name,
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
    const copiedText = document.getSelection().toString();
    console.log("Copied text:", copiedText);

    chrome.runtime.sendMessage({
        action: "record_copy",
        data: {
            type: "copy",
            text: copiedText,
            timestamp: new Date().toISOString(),
            url: window.location.href
        }
    });
});

document.addEventListener("paste", function (event) {
    let pastedText = (event.clipboardData || window.clipboardData).getData("text");
    console.log("Pasted text:", pastedText);

    chrome.runtime.sendMessage({
        action: "record_paste",
        data: {
            type: "paste",
            text: pastedText,
            timestamp: new Date().toISOString(),
            url: window.location.href
        }
    });
});
