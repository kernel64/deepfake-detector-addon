function updateIcon(enabled) {
  const basePath = enabled ? "icons/enabled" : "icons/disabled";
  const sizes = [16, 48, 64, 128];
  const path = Object.fromEntries(sizes.map(size => [size, `${basePath}_${size}.png`]));

  chrome.action.setIcon({ path });
}

async function initDetectionState() {
  const { detectionEnabled } = await chrome.storage.local.get("detectionEnabled");

  const enabled = (typeof detectionEnabled === "boolean") ? detectionEnabled : true;
  await chrome.storage.local.set({ detectionEnabled: enabled });
  updateIcon(enabled);

  return enabled;
}

// Installation
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ onlyFake: true });
  await initDetectionState();
});

// start
chrome.runtime.onStartup.addListener(initDetectionState);

// Click
chrome.action.onClicked.addListener(async () => {
  const { detectionEnabled } = await chrome.storage.local.get("detectionEnabled");
  const newState = !detectionEnabled;

  await chrome.storage.local.set({ detectionEnabled: newState });
  updateIcon(newState);
});
