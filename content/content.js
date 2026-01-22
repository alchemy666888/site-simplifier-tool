// Site Simplifier - Content Script
// Main simplification engine that uses modular rules

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.siteSimplifierInitialized) return;
  window.siteSimplifierInitialized = true;

  // Configuration for simplification levels
  const CONFIG = {
    levels: {
      light: {
        hideElements: false,
        deemphasizeElements: true,
        improveSpacing: true,
        improveContrast: false,
        simplifyNavigation: false
      },
      balanced: {
        hideElements: true,
        deemphasizeElements: true,
        improveSpacing: true,
        improveContrast: true,
        simplifyNavigation: true
      },
      aggressive: {
        hideElements: true,
        deemphasizeElements: true,
        improveSpacing: true,
        improveContrast: true,
        simplifyNavigation: true,
        aggressiveMode: true
      }
    }
  };

  // Aggressive mode additional selectors (applied in aggressive mode only)
  const AGGRESSIVE_SELECTORS = {
    hide: [
      '[class*="breadcrumb"]',
      '[class*="tag-"]', '[class*="tags"]',
      '[class*="category"]', '[class*="meta"]'
    ],
    deemphasize: [
      '[class*="header"]', '[id*="header"]'
    ]
  };

  class SiteSimplifier {
    constructor() {
      this.isEnabled = true;
      this.level = 'balanced';
      this.originalStyles = new Map();
      this.hiddenElements = new Set();
      this.modifiedElements = new Set();
      this.styleElement = null;
      this.rules = null;

      this.init();
    }

    async init() {
      // Load rules for current domain
      this.loadRules();

      // Load user settings
      await this.loadSettings();

      // Listen for messages from popup
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handleMessage(message);
        sendResponse({ success: true });
        return true;
      });

      // Apply simplification if enabled
      if (this.isEnabled) {
        this.waitForDOMReady().then(() => {
          this.simplify();
        });
      }
    }

    loadRules() {
      const hostname = window.location.hostname;

      // Get rules from the rule manager if available
      if (window.SiteSimplifierRuleManager) {
        this.rules = window.SiteSimplifierRuleManager.getRulesForDomain(hostname);
        console.log('Site Simplifier: Loaded rules:', this.rules._appliedRules.join(' + '));
      } else {
        console.warn('Site Simplifier: Rule manager not found, using fallback rules');
        this.rules = this.getFallbackRules();
      }
    }

    getFallbackRules() {
      // Minimal fallback rules if rule files fail to load
      return {
        hideSelectors: [
          '[class*="ad-"]', '[class*="ads-"]',
          '[class*="popup"]', '[class*="modal"]',
          '[class*="cookie"]', 'aside',
          '[class*="sidebar"]', 'footer'
        ],
        deemphasizeSelectors: [],
        navigationSelectors: ['nav', '[role="navigation"]'],
        mainContentSelectors: ['main', 'article', '[role="main"]'],
        stickySelectors: ['[class*="sticky"]', '[class*="fixed"]'],
        customCSS: '',
        _appliedRules: ['fallback']
      };
    }

    async loadSettings() {
      try {
        const result = await chrome.storage.local.get(['siteSimplifierSettings']);
        if (result.siteSimplifierSettings) {
          const settings = result.siteSimplifierSettings;
          this.isEnabled = settings.globalEnabled !== false;

          const domain = window.location.hostname;
          const siteSettings = settings.siteSettings?.[domain];
          if (siteSettings) {
            this.isEnabled = this.isEnabled && siteSettings.enabled !== false;
            this.level = siteSettings.level || settings.defaultLevel || 'balanced';
          } else {
            this.level = settings.defaultLevel || 'balanced';
          }
        }
      } catch (error) {
        console.error('Site Simplifier: Failed to load settings', error);
      }
    }

    waitForDOMReady() {
      return new Promise(resolve => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          setTimeout(resolve, 100);
        } else {
          document.addEventListener('DOMContentLoaded', () => setTimeout(resolve, 100));
        }
      });
    }

    handleMessage(message) {
      switch (message.action) {
        case 'toggleGlobal':
          this.isEnabled = message.enabled;
          if (this.isEnabled) {
            this.simplify();
          } else {
            this.reset();
          }
          break;

        case 'toggleSite':
          this.isEnabled = message.enabled;
          if (this.isEnabled) {
            this.simplify();
          } else {
            this.reset();
          }
          break;

        case 'setLevel':
          this.level = message.level;
          if (this.isEnabled) {
            this.reset();
            this.simplify();
          }
          break;

        case 'simplify':
          this.simplify();
          break;

        case 'reset':
          this.reset();
          break;
      }
    }

    simplify() {
      if (!this.isEnabled || !this.rules) return;

      const config = CONFIG.levels[this.level];
      if (!config) return;

      try {
        // Inject global styles
        this.injectStyles(config);

        // Find main content
        const mainContent = this.findMainContent();

        // Hide unwanted elements
        if (config.hideElements) {
          this.hideElements(this.rules.hideSelectors || []);
          if (config.aggressiveMode) {
            this.hideElements(AGGRESSIVE_SELECTORS.hide);
          }
        }

        // Handle sticky elements
        this.handleStickyElements();

        // De-emphasize secondary elements
        if (config.deemphasizeElements) {
          this.deemphasizeElements(this.rules.deemphasizeSelectors || [], mainContent);
          if (config.aggressiveMode) {
            this.deemphasizeElements(AGGRESSIVE_SELECTORS.deemphasize, mainContent);
          }
        }

        // Simplify navigation
        if (config.simplifyNavigation) {
          this.simplifyNavigation();
        }

        // Enhance main content
        if (mainContent) {
          this.enhanceMainContent(mainContent, config);
        }

        // Add simplified class to body
        document.body.classList.add('site-simplifier-active');

      } catch (error) {
        console.error('Site Simplifier: Error during simplification', error);
      }
    }

    injectStyles(config) {
      // Remove existing styles
      if (this.styleElement) {
        this.styleElement.remove();
      }

      const styles = `
        /* Site Simplifier - Global Styles */
        .site-simplifier-active {
          ${config.improveContrast ? `
            --ss-text-color: #222;
            --ss-bg-color: #fff;
            --ss-link-color: #1a5dab;
          ` : ''}
        }

        ${config.improveSpacing ? `
          .site-simplifier-active p,
          .site-simplifier-active li {
            line-height: 1.7 !important;
          }

          /* Main content containers - expand to 80% */
          .site-simplifier-active article,
          .site-simplifier-active [role="main"],
          .site-simplifier-active main,
          .site-simplifier-active .site-simplifier-main-content {
            width: 80% !important;
            max-width: 80% !important;
            min-width: 80% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            float: none !important;
          }

          /* Remove width constraints from child elements */
          .site-simplifier-active article > *,
          .site-simplifier-active [role="main"] > *,
          .site-simplifier-active main > *,
          .site-simplifier-active .site-simplifier-main-content > * {
            max-width: 100% !important;
            width: auto !important;
          }

          /* Video/media containers */
          .site-simplifier-active article video,
          .site-simplifier-active article iframe:not([src*="ad"]),
          .site-simplifier-active article [class*="video"]:not([class*="ad"]),
          .site-simplifier-active article [class*="player"],
          .site-simplifier-active main video,
          .site-simplifier-active main iframe:not([src*="ad"]),
          .site-simplifier-active main [class*="video"]:not([class*="ad"]),
          .site-simplifier-active main [class*="player"] {
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Ensure body doesn't constrain */
          .site-simplifier-active,
          .site-simplifier-active body {
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
        ` : ''}

        /* Hidden elements - completely collapse */
        .site-simplifier-hidden {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          max-height: 0 !important;
          min-height: 0 !important;
          width: 0 !important;
          max-width: 0 !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          overflow: hidden !important;
          position: absolute !important;
          pointer-events: none !important;
        }

        /* De-emphasized elements */
        .site-simplifier-deemphasized {
          opacity: 0.3 !important;
          filter: grayscale(50%) !important;
          transition: opacity 0.3s ease, filter 0.3s ease !important;
          pointer-events: auto;
        }

        .site-simplifier-deemphasized:hover {
          opacity: 0.8 !important;
          filter: grayscale(0%) !important;
        }

        /* Unstuck sticky elements */
        .site-simplifier-unstuck {
          position: relative !important;
          top: auto !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
        }

        /* Enhanced main content */
        .site-simplifier-main-content {
          position: relative;
          z-index: 1;
        }

        ${config.improveContrast ? `
          .site-simplifier-active .site-simplifier-main-content {
            color: var(--ss-text-color, #222) !important;
          }

          .site-simplifier-active .site-simplifier-main-content a {
            color: var(--ss-link-color, #1a5dab) !important;
          }
        ` : ''}

        /* Simplified navigation */
        .site-simplifier-nav-simplified {
          background: rgba(255, 255, 255, 0.98) !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }

        /* Site-specific custom CSS from rules */
        ${this.rules.customCSS || ''}
      `;

      this.styleElement = document.createElement('style');
      this.styleElement.id = 'site-simplifier-styles';
      this.styleElement.textContent = styles;
      document.head.appendChild(this.styleElement);
    }

    findMainContent() {
      const selectors = this.rules.mainContentSelectors || [];

      // Try selectors in order (site-specific first due to merge order)
      for (const selector of selectors) {
        try {
          const element = document.querySelector(selector);
          if (element && this.isVisible(element) && this.hasSignificantContent(element)) {
            return element;
          }
        } catch (e) {
          // Invalid selector, skip
        }
      }

      // Fallback: find the largest content block
      const candidates = document.querySelectorAll('div, section, article');
      let bestCandidate = null;
      let maxScore = 0;

      candidates.forEach(el => {
        if (!this.isVisible(el)) return;

        const text = el.textContent || '';
        const paragraphs = el.querySelectorAll('p').length;
        const headings = el.querySelectorAll('h1, h2, h3').length;
        const score = text.length * 0.1 + paragraphs * 50 + headings * 100;

        if (score > maxScore) {
          maxScore = score;
          bestCandidate = el;
        }
      });

      return bestCandidate;
    }

    isVisible(element) {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' &&
             style.visibility !== 'hidden' &&
             style.opacity !== '0' &&
             element.offsetParent !== null;
    }

    hasSignificantContent(element) {
      const text = element.textContent || '';
      return text.length > 200;
    }

    hideElements(selectors) {
      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            // Don't hide main content
            if (el.querySelector('main, article, [role="main"]')) return;
            if (el.closest('main, article, [role="main"]')) return;

            // Check if it's a critical element
            if (this.isCriticalElement(el)) return;

            if (!this.hiddenElements.has(el)) {
              this.hiddenElements.add(el);
              el.classList.add('site-simplifier-hidden');
            }
          });
        } catch (e) {
          // Invalid selector, skip
        }
      });
    }

    isCriticalElement(element) {
      const tag = element.tagName.toLowerCase();
      const criticalTags = ['form', 'input', 'button', 'select', 'textarea'];
      if (criticalTags.includes(tag)) return true;

      // Don't hide main navigation
      if (tag === 'nav' || element.role === 'navigation') {
        const navCount = document.querySelectorAll('nav, [role="navigation"]').length;
        if (navCount <= 2) return true;
      }

      // Don't hide search forms
      if (element.querySelector('input[type="search"]')) return true;

      return false;
    }

    handleStickyElements() {
      const selectors = this.rules.stickySelectors || [];

      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' || style.position === 'sticky') {
              if (!this.isMainNavigation(el)) {
                if (!this.modifiedElements.has(el)) {
                  this.originalStyles.set(el, el.getAttribute('style') || '');
                  this.modifiedElements.add(el);
                  el.classList.add('site-simplifier-unstuck');
                }
              }
            }
          });
        } catch (e) {
          // Invalid selector, skip
        }
      });
    }

    isMainNavigation(element) {
      const tag = element.tagName.toLowerCase();
      if (tag === 'nav' || element.role === 'navigation') return true;
      if (tag === 'header') return true;
      if (element.querySelector('nav')) return true;
      return false;
    }

    deemphasizeElements(selectors, mainContent) {
      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            // Don't de-emphasize if it contains main content
            if (mainContent && (el === mainContent || el.contains(mainContent) || mainContent.contains(el))) {
              return;
            }

            // Don't de-emphasize if it's already hidden
            if (this.hiddenElements.has(el)) return;

            if (!this.modifiedElements.has(el)) {
              this.modifiedElements.add(el);
              el.classList.add('site-simplifier-deemphasized');
            }
          });
        } catch (e) {
          // Invalid selector, skip
        }
      });
    }

    simplifyNavigation() {
      const selectors = this.rules.navigationSelectors || [];

      document.querySelectorAll(selectors.join(', ')).forEach(nav => {
        if (!this.modifiedElements.has(nav)) {
          this.modifiedElements.add(nav);
          nav.classList.add('site-simplifier-nav-simplified');
        }
      });
    }

    enhanceMainContent(element, config) {
      if (!this.modifiedElements.has(element)) {
        this.modifiedElements.add(element);
        element.classList.add('site-simplifier-main-content');
        this.expandContentWidth(element);
      }
    }

    expandContentWidth(element) {
      let current = element;
      let depth = 0;
      const maxDepth = 10;

      while (current && current !== document.body && depth < maxDepth) {
        const style = window.getComputedStyle(current);
        const maxWidth = style.maxWidth;

        if (maxWidth && maxWidth !== 'none' && !maxWidth.includes('%')) {
          if (!this.originalStyles.has(current)) {
            this.originalStyles.set(current, current.getAttribute('style') || '');
          }
          current.style.maxWidth = '100%';
          this.modifiedElements.add(current);
        }

        if (style.display === 'flex' || style.display === 'grid') {
          if (!this.originalStyles.has(current)) {
            this.originalStyles.set(current, current.getAttribute('style') || '');
          }
          current.style.flexBasis = 'auto';
          current.style.flexGrow = '1';
          this.modifiedElements.add(current);
        }

        current = current.parentElement;
        depth++;
      }
    }

    reset() {
      if (this.styleElement) {
        this.styleElement.remove();
        this.styleElement = null;
      }

      this.hiddenElements.forEach(el => {
        el.classList.remove('site-simplifier-hidden');
      });
      this.hiddenElements.clear();

      this.modifiedElements.forEach(el => {
        el.classList.remove(
          'site-simplifier-deemphasized',
          'site-simplifier-unstuck',
          'site-simplifier-main-content',
          'site-simplifier-nav-simplified'
        );

        if (this.originalStyles.has(el)) {
          const originalStyle = this.originalStyles.get(el);
          if (originalStyle) {
            el.setAttribute('style', originalStyle);
          } else {
            el.removeAttribute('style');
          }
        }
      });
      this.modifiedElements.clear();
      this.originalStyles.clear();

      document.body.classList.remove('site-simplifier-active');
    }
  }

  // Initialize
  new SiteSimplifier();

})();
