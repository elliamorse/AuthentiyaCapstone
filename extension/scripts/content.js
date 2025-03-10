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