chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "colorPicker",
    title: "Pick Color",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "colorPicker") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: pickColor,
    });
  }
});

function pickColor() {
  document.addEventListener(
    "click",
    function (event) {
      const x = event.clientX;
      const y = event.clientY;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.drawImage(document.body, 0, 0);
      const pixel = context.getImageData(x, y, 1, 1).data;
      const hex = `#${(
        (1 << 24) +
        (pixel[0] << 16) +
        (pixel[1] << 8) +
        pixel[2]
      )
        .toString(16)
        .slice(1)}`;
      chrome.runtime.sendMessage({ color: hex });
    },
    { once: true }
  );
}
