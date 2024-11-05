// content.js

(function() {
  'use strict';

  // Ad blocker selectors
  const AD_SELECTORS = [
    '.video-ads',
    '.ytp-ad-overlay-container',
    '.ytp-ad-text-overlay',
    'ytd-promoted-video-renderer',
    'ytd-display-ad-renderer',
    'ytd-ad-slot-renderer'
  ].join(',');

  // Function to throttle execution
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Function to remove ads
  function removeAds() {
    const video = document.querySelector('video');
    if (video && video.duration < 30) {
      video.currentTime = video.duration;
    }

    const skipButton = document.querySelector('.ytp-ad-skip-button');
    if (skipButton) {
      skipButton.click();
    }

    document.querySelectorAll(AD_SELECTORS).forEach(ad => {
      ad.remove();
    });
  }

  // Throttled version of removeAds to prevent excessive CPU usage
  const throttledRemoveAds = throttle(removeAds, 1000);

  // Listen for toggle state updates from the popup
  chrome.storage.local.get('adBlockerEnabled', function(result) {
    const adBlockerEnabled = result.adBlockerEnabled !== false; // default to true if not set
    if (adBlockerEnabled) {
      enableAdBlocker();
    } else {
      disableAdBlocker();
    }
  });

  // Function to enable the ad blocker
  function enableAdBlocker() {
    const observer = new MutationObserver(() => {
      throttledRemoveAds();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Initial cleanup
    document.addEventListener('DOMContentLoaded', throttledRemoveAds);
  }

  // Function to disable the ad blocker
  function disableAdBlocker() {
    // Remove any ad-blocking logic if disabled
    const observer = new MutationObserver(() => {});

    observer.disconnect(); // Disconnect observer to stop watching DOM changes
    document.removeEventListener('DOMContentLoaded', throttledRemoveAds);
  }

  // Listen for messages from the popup to toggle the ad blocker
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.adBlockerEnabled) {
      if (request.adBlockerEnabled) {
        enableAdBlocker();
      } else {
        disableAdBlocker();
      }
    }
  });
})();

