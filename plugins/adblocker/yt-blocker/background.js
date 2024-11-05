chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ adBlockerEnabled: true }, () => {
        console.log('Ad blocker is enabled by default');
    });
});

