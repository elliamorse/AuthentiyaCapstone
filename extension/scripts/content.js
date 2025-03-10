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
  }
}

// Run detection when page loads
window.addEventListener('load', checkForGoogleDocs);









// Track active input field and send information to popup
document.addEventListener('focusin', function(event) {
    const element = event.target;
    
    if (element.tagName.toLowerCase() === 'textarea' || 
        (element.tagName.toLowerCase() === 'input' && element.type === 'text')) {
      
      // Send field information to popup
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
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;
    
    chrome.runtime.sendMessage({
      from: 'content',
      subject: 'update_word_count',
      data: {
        count: count
      }
    });
  }

  // Track active input field and send information to popup
document.addEventListener('focusin', function(event) {
  const element = event.target;
  
  if (element.tagName.toLowerCase() === 'textarea' || 
      (element.tagName.toLowerCase() === 'input' && element.type === 'text')) {
    
    // Send field information to popup
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
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const count = words.length;
  
  chrome.runtime.sendMessage({
    from: 'content',
    subject: 'update_word_count',
    data: {
      count: count
    }
  });
}