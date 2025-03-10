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
  
  // Key logging functionality
  let lastKeyDown = {};
  
  document.addEventListener("keydown", function (event) {
    let timestamp = new Date().getTime();
    let inputElement = document.activeElement;
    
    if (inputElement) {
      const isPlainTextInput = inputElement.tagName.toLowerCase() === "input" && inputElement.type === "text";
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
      const isPlainTextInput = inputElement.tagName.toLowerCase() === "input" && inputElement.type === "text";
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