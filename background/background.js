// Site Simplifier - Background Service Worker
// Handles extension lifecycle, badge updates, and cross-tab communication

// Default settings
const DEFAULT_SETTINGS = {
  globalEnabled: true,
  defaultLevel: 'balanced',
  siteSettings: {}
};

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    await chrome.storage.local.set({ siteSimplifierSettings: DEFAULT_SETTINGS });
    console.log('Site Simplifier installed with default settings');
  } else if (details.reason === 'update') {
    // Handle updates - migrate settings if needed
    console.log('Site Simplifier updated to version', chrome.runtime.getManifest().version);
  }
});

// Update badge based on current state
async function updateBadge(tabId) {
  try {
    const result = await chrome.storage.local.get(['siteSimplifierSettings']);
    const settings = result.siteSimplifierSettings || DEFAULT_SETTINGS;

    // Get tab info
    const tab = await chrome.tabs.get(tabId);
    if (!tab || !tab.url) return;

    // Check if extension can run on this URL
    if (tab.url.startsWith('chrome://') ||
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('about:')) {
      chrome.action.setBadgeText({ text: '', tabId });
      chrome.action.setTitle({ title: 'Site Simplifier - Cannot run on this page', tabId });
      return;
    }

    let isEnabled = settings.globalEnabled;

    // Check site-specific settings
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      const siteSettings = settings.siteSettings[domain];
      if (siteSettings) {
        isEnabled = isEnabled && siteSettings.enabled !== false;
      }
    } catch (e) {
      // Invalid URL, skip
    }

    // Update badge
    if (isEnabled) {
      chrome.action.setBadgeText({ text: 'ON', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#4a6cf7', tabId });
      chrome.action.setTitle({ title: 'Site Simplifier - Active', tabId });
    } else {
      chrome.action.setBadgeText({ text: 'OFF', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#9ca3af', tabId });
      chrome.action.setTitle({ title: 'Site Simplifier - Disabled', tabId });
    }
  } catch (error) {
    console.error('Failed to update badge:', error);
  }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateBadge(tabId);
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  updateBadge(activeInfo.tabId);
});

// Listen for storage changes to update badge
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'local' && changes.siteSimplifierSettings) {
    // Update badge for all tabs
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.id) {
        updateBadge(tab.id);
      }
    });
  }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSettings') {
    chrome.storage.local.get(['siteSimplifierSettings']).then(result => {
      sendResponse(result.siteSimplifierSettings || DEFAULT_SETTINGS);
    });
    return true; // Keep channel open for async response
  }

  if (message.action === 'updateBadge' && sender.tab) {
    updateBadge(sender.tab.id);
    sendResponse({ success: true });
  }

  return false;
});

// Initialize badge for current tab on startup
chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
  if (tabs[0]) {
    updateBadge(tabs[0].id);
  }
});

console.log('Site Simplifier background service worker initialized');
