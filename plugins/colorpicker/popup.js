document.addEventListener("DOMContentLoaded", () => {
  const colorValue = document.getElementById("colorValue");

  chrome.storage.local.get("pickedColor", (data) => {
    if (data.pickedColor) {
      colorValue.textContent = data.pickedColor;
    }
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.pickedColor) {
      colorValue.textContent = changes.pickedColor.newValue;
    }
  });
});
