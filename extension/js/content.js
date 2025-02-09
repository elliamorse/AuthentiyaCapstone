// Content Script
// This script interacts with the DOM of the pages where the extension is active.

// Create and append the icon to the document body.
const icon = document.createElement('img');
icon.src = chrome.runtime.getURL('assets/icon.png');
icon.id = 'myExtensionIcon';
document.body.appendChild(icon);

// Event listener for icon clicks.
icon.addEventListener('click', () => {
  const text = getTextFromInput();
  if (text) {
    // Send the text to the backend for correction.
    fetch('https://your-backend-url.com/correct-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
      // Replace the original text with the corrected text.
      replaceText(data.correctedText);
    })
    .catch(error => console.error('Error:', error));
  }
});

// Function to get text from the active input field.
function getTextFromInput() {
    // Get the active element
    const activeElement = document.activeElement;
    
    // Check if the active element is a text input or textarea
    if (activeElement && (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea')) {
        return activeElement.value;
    }
    
    return null;
}

// Function to replace text in the active input field.
function replaceText(correctedText) {
    // Get the active element
    const activeElement = document.activeElement;
    
    // Check if the active element is a text input or textarea
    if (activeElement && (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea')) {
        activeElement.value = correctedText;
    }
}