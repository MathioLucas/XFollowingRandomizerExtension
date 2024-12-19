document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("randomize-toggle");

  // Load the saved toggle state
  chrome.storage.sync.get(["randomizeEnabled"], (result) => {
    toggle.checked = result.randomizeEnabled || false;
  });

  // Save state when toggled
  toggle.addEventListener("change", () => {
    chrome.storage.sync.set({ randomizeEnabled: toggle.checked }, () => {
      console.log(`Randomization ${toggle.checked ? "enabled" : "disabled"}.`);
    });
  });
});
