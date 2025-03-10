// Detect Google Docs
function checkForGoogleDocs() {
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
    
    // Add a mutation observer to catch Google Docs changes
    const observer = new MutationObserver(function(mutations) {
      // Get estimated word count from Google Docs UI
      const wordCountElements = document.querySelectorAll('.kix-wordhtmlgenerator-word-node');
      const wordCount = wordCountElements.length;
      
      // Send updated word count to popup
      chrome.runtime.sendMessage({
        from: 'content',
        subject: 'update_word_count',
        data: {
          count: wordCount
        }
      });
    });
    
    // Start observing changes to the document
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Run detection when page loads
window.addEventListener('load', checkForGoogleDocs);

// Track keystrokes on active input elements
document.addEventListener('keydown', function(event) {
  const element = document.activeElement;
  
  // Only track keystrokes in text input fields
  if (element.tagName.toLowerCase() === 'textarea' || 
      (element.tagName.toLowerCase() === 'input' && element.type === 'text')) {
    
    // Create keystroke data object
    const keystrokeData = [
      "keydown",                             // type
      event.key,                             // key
      new Date().toISOString(),              // timestamp
      window.location.href,                  // hostname
      element.id || 'unnamed-field',         // elementID
      element.name || element.id || 'unnamed-field'  // elementName
    ];
    
    // Send keystroke data to background script
    chrome.runtime.sendMessage({
      from: 'content',
      subject: 'record_event',
      data: keystrokeData
    });
  }
});

// Track active input field and send information to popup
document.addEventListener('focusin', function(event) {
    const element = event.target;
    
    if (element.tagName.toLowerCase() === 'textarea' || 
        (element.tagName.toLowerCase() === 'input' && element.type === 'text')) {
      
      // Send field information to popup with full URL
      chrome.runtime.sendMessage({
        from: 'content',
        subject: 'update_field_info',
        data: {
          elementID: element.id || 'unnamed-field',
          elementName: element.name || element.id || 'unnamed-field',
          hostname: window.location.href // Complete URL including path
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
  // Get text from the element
  const text = element.value || '';
  
  // Count words (improved regex to handle various whitespace)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const count = words.length;
  
  // Send updated word count to popup
  chrome.runtime.sendMessage({
    from: 'content',
    subject: 'update_word_count',
    data: {
      count: count,
      text: text.substring(0, 100) + (text.length > 100 ? '...' : '') // Include sample of text
    }
  });
}