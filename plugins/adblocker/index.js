// ==UserScript==
// @name         Lightweight YouTube Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Performance-optimized ad blocker for YouTube, suitable for older PCs
// @author       You
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const AD_SELECTORS = [
    ".video-ads",
    ".ytp-ad-overlay-container",
    ".ytp-ad-text-overlay",
    "ytd-promoted-video-renderer",
    "ytd-display-ad-renderer",
    "ytd-ad-slot-renderer",
  ].join(",");

  // Throttle function to limit execution frequency
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Single function to handle all ad removal operations
  function removeAds() {
    // Handle video ads
    const video = document.querySelector("video");
    if (video && video.duration < 30) {
      video.currentTime = video.duration;
    }

    // Click skip button if present
    const skipButton = document.querySelector(".ytp-ad-skip-button");
    if (skipButton) {
      skipButton.click();
    }

    // Remove ad elements
    document.querySelectorAll(AD_SELECTORS).forEach((ad) => {
      ad.remove();
    });
  }

  const throttledRemoveAds = throttle(removeAds, 1000);

  // Optimized mutation observer
  const observer = new MutationObserver((mutations) => {
    // Check if any mutation actually added nodes before running removal
    const hasNewNodes = mutations.some(
      (mutation) =>
        mutation.addedNodes.length > 0 || mutation.type === "attributes"
    );

    if (hasNewNodes) {
      throttledRemoveAds();
    }
  });

  // Start observing with optimized configuration
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"], // Only watch relevant attributes
  });

  // Add minimal CSS
  const style = document.createElement("style");
  style.textContent = `
        ${AD_SELECTORS} { display: none !important; }
    `;
  document.head.appendChild(style);

  // Initial cleanup
  document.addEventListener("DOMContentLoaded", throttledRemoveAds);
})();
