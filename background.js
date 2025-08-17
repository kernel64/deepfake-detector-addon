function updateIcon(enabled) {
  const path = enabled
    ? {
        16: "icons/enabled_16.png",
        48: "icons/enabled_48.png",
        64: "icons/enabled_64.png",
        128: "icons/enabled_128.png"
      }
    : {
        16: "icons/disabled_16.png",
        48: "icons/disabled_48.png",
        64: "icons/disabled_64.png",
        128: "icons/disabled_128.png"
      };

  chrome.action.setIcon({ path });
}

chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.local.set({ onlyFake: true });

    chrome.storage.local.get(["detectionEnabled"],
    async ({ detectionEnabled }) => {
    const enabled = detectionEnabled ?? true;
    chrome.storage.local.set({ detectionEnabled : enabled });
    updateIcon(enabled);
  });
});


chrome.action.onClicked.addListener(() => {

  chrome.storage.local.get(["detectionEnabled"], async ({ detectionEnabled }) => {
    const newState = !detectionEnabled;
    chrome.storage.local.set({ detectionEnabled: newState });
    updateIcon(newState);
  });
});
