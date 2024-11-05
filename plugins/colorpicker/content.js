chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.color) {
    chrome.storage.local.set({ pickedColor: message.color });
  }
});
