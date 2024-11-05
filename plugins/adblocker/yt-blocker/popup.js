// popup.js

// Get elements
const toggleButton = document.getElementById('toggleButton');

// Check the current state from localStorage
chrome.storage.local.get('adBlockerEnabled', function(result) {
  const adBlockerEnabled = result.adBlockerEnabled !== false; // default to true if not set
  updateButtonState(adBlockerEnabled);
});

// Add event listener to toggle button
toggleButton.addEventListener('click', function() {
  chrome.storage.local.get('adBlockerEnabled', function(result) {
    const adBlockerEnabled = result.adBlockerEnabled !== false; // default to true if not set
    const newState = !adBlockerEnabled;

    // Save the new state to localStorage
    chrome.storage.local.set({ adBlockerEnabled: newState });

    // Update the button state
    updateButtonState(newState);
    
    // Send a message to content script to enable/disable the ad blocker
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { adBlockerEnabled: newState });
    });
  });
});

// Function to update the button UI based on the state
function updateButtonState(enabled) {
  if (enabled) {
    toggleButton.textContent = 'Disable';
    toggleButton.classList.remove('disabled');
  } else {
    toggleButton.textContent = 'Enable';
    toggleButton.classList.add('disabled');
  }
}

