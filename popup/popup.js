// Site Simplifier - Popup Script
// Handles user interactions and communicates with content script

class PopupController {
  constructor() {
    this.globalToggle = document.getElementById('globalToggle');
    this.siteToggle = document.getElementById('siteToggle');
    this.currentDomain = document.getElementById('currentDomain');
    this.levelButtons = document.querySelectorAll('.level-btn');
    this.simplifyBtn = document.getElementById('simplifyBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.status = document.getElementById('status');
    this.container = document.querySelector('.container');

    this.currentTab = null;
    this.settings = {
      globalEnabled: true,
      siteSettings: {},
      defaultLevel: 'balanced'
    };

    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.getCurrentTab();
    this.updateUI();
    this.bindEvents();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get(['siteSimplifierSettings']);
      if (result.siteSimplifierSettings) {
        this.settings = { ...this.settings, ...result.siteSimplifierSettings };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.local.set({ siteSimplifierSettings: this.settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tab;

      if (tab && tab.url) {
        const url = new URL(tab.url);
        this.currentDomain.textContent = url.hostname;
      } else {
        this.currentDomain.textContent = 'Unknown';
      }
    } catch (error) {
      console.error('Failed to get current tab:', error);
      this.currentDomain.textContent = 'Unknown';
    }
  }

  getDomain() {
    if (this.currentTab && this.currentTab.url) {
      try {
        return new URL(this.currentTab.url).hostname;
      } catch {
        return null;
      }
    }
    return null;
  }

  getSiteSettings(domain) {
    return this.settings.siteSettings[domain] || {
      enabled: true,
      level: this.settings.defaultLevel
    };
  }

  updateUI() {
    const domain = this.getDomain();
    const siteSettings = domain ? this.getSiteSettings(domain) : { enabled: true, level: 'balanced' };

    // Update global toggle
    this.globalToggle.checked = this.settings.globalEnabled;

    // Update site toggle
    this.siteToggle.checked = siteSettings.enabled;
    this.siteToggle.disabled = !this.settings.globalEnabled;

    // Update level buttons
    this.levelButtons.forEach(btn => {
      const level = btn.dataset.level;
      btn.classList.toggle('active', level === siteSettings.level);
      btn.disabled = !this.settings.globalEnabled || !siteSettings.enabled;
    });

    // Update action buttons
    const isActive = this.settings.globalEnabled && siteSettings.enabled;
    this.simplifyBtn.disabled = !isActive;
    this.resetBtn.disabled = !this.settings.globalEnabled;

    // Update container state
    this.container.classList.toggle('disabled', !this.settings.globalEnabled);

    // Update status
    this.updateStatus(isActive ? 'ready' : 'disabled');
  }

  updateStatus(state, message) {
    this.status.className = 'status';
    const statusText = this.status.querySelector('.status-text');

    switch (state) {
      case 'ready':
        statusText.textContent = 'Ready';
        break;
      case 'active':
        this.status.classList.add('active');
        statusText.textContent = message || 'Simplifying...';
        break;
      case 'disabled':
        this.status.classList.add('disabled');
        statusText.textContent = 'Disabled';
        break;
      case 'error':
        this.status.classList.add('error');
        statusText.textContent = message || 'Error';
        break;
      default:
        statusText.textContent = message || 'Ready';
    }
  }

  bindEvents() {
    // Global toggle
    this.globalToggle.addEventListener('change', async (e) => {
      this.settings.globalEnabled = e.target.checked;
      await this.saveSettings();
      this.updateUI();
      await this.sendMessageToTab({
        action: 'toggleGlobal',
        enabled: e.target.checked
      });
    });

    // Site toggle
    this.siteToggle.addEventListener('change', async (e) => {
      const domain = this.getDomain();
      if (domain) {
        const siteSettings = this.getSiteSettings(domain);
        siteSettings.enabled = e.target.checked;
        this.settings.siteSettings[domain] = siteSettings;
        await this.saveSettings();
        this.updateUI();
        await this.sendMessageToTab({
          action: 'toggleSite',
          enabled: e.target.checked
        });
      }
    });

    // Level buttons
    this.levelButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const level = btn.dataset.level;
        const domain = this.getDomain();

        if (domain) {
          const siteSettings = this.getSiteSettings(domain);
          siteSettings.level = level;
          this.settings.siteSettings[domain] = siteSettings;
          await this.saveSettings();
        } else {
          this.settings.defaultLevel = level;
          await this.saveSettings();
        }

        this.updateUI();
        await this.sendMessageToTab({ action: 'setLevel', level });
      });
    });

    // Simplify button
    this.simplifyBtn.addEventListener('click', async () => {
      this.updateStatus('active', 'Simplifying...');
      await this.sendMessageToTab({ action: 'simplify' });
      setTimeout(() => {
        this.updateStatus('ready', 'Simplified!');
        setTimeout(() => this.updateStatus('ready'), 1500);
      }, 500);
    });

    // Reset button
    this.resetBtn.addEventListener('click', async () => {
      this.updateStatus('active', 'Resetting...');
      await this.sendMessageToTab({ action: 'reset' });
      setTimeout(() => {
        this.updateStatus('ready', 'Reset complete');
        setTimeout(() => this.updateStatus('ready'), 1500);
      }, 500);
    });
  }

  async sendMessageToTab(message) {
    if (!this.currentTab || !this.currentTab.id) {
      console.error('No active tab');
      return;
    }

    try {
      // Check if we can send messages to this tab
      if (this.currentTab.url &&
          (this.currentTab.url.startsWith('chrome://') ||
           this.currentTab.url.startsWith('chrome-extension://') ||
           this.currentTab.url.startsWith('about:'))) {
        this.updateStatus('error', 'Cannot simplify this page');
        return;
      }

      await chrome.tabs.sendMessage(this.currentTab.id, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Try to inject content script if not present
      try {
        await chrome.scripting.executeScript({
          target: { tabId: this.currentTab.id },
          files: ['content/content.js']
        });
        await chrome.scripting.insertCSS({
          target: { tabId: this.currentTab.id },
          files: ['content/content.css']
        });
        // Retry message
        await chrome.tabs.sendMessage(this.currentTab.id, message);
      } catch (injectError) {
        console.error('Failed to inject content script:', injectError);
        this.updateStatus('error', 'Cannot access page');
      }
    }
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
