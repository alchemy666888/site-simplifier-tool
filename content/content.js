// Site Simplifier - Content Script
// Main simplification engine that transforms cluttered pages into clean, readable content

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.siteSimplifierInitialized) return;
  window.siteSimplifierInitialized = true;

  // Configuration
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

  // Selectors for different element types
  const SELECTORS = {
    // Elements to completely hide
    hideSelectors: [
      // === GENERIC AD SELECTORS ===
      '[class*="ad-"]', '[class*="ads-"]', '[id*="ad-"]', '[id*="ads-"]',
      '[class*="advert"]', '[id*="advert"]',
      '[class*="sponsor"]', '[id*="sponsor"]',
      '[class*="promoted"]', '[class*="promotion"]',
      '[data-ad]', '[data-ads]', '[data-ad-unit]', '[data-ad-slot]',
      '[data-advertisement]', '[data-adservice]',
      '[aria-label*="advertisement"]', '[aria-label*="Advertisement"]',

      // === GOOGLE ADS ===
      'ins.adsbygoogle', '[id*="google_ads"]', '[id*="googleAds"]',
      '[class*="google-ad"]', '[class*="googleAd"]',
      'iframe[src*="doubleclick"]', 'iframe[src*="googlesyndication"]',
      '[id*="div-gpt-ad"]', '[class*="gpt-ad"]',

      // === COMMON AD NETWORKS ===
      // Taboola
      '[id*="taboola"]', '[class*="taboola"]', '.trc_related_container',
      // Outbrain
      '[id*="outbrain"]', '[class*="outbrain"]', '.OUTBRAIN',
      // Yahoo specific
      '[class*="gemini-ad"]', '[data-beacon]',
      '[class*="caas-da"]', '[class*="caas-ad"]',
      '[class*="ad-slot"]', '[class*="adSlot"]',
      '[class*="stream-ad"]', '[class*="streamAd"]',
      '[class*="ntk-ad"]', '[class*="Adsense"]',
      '[class*="video-ad"]', '[class*="videoAd"]',
      '[class*="preroll"]', '[class*="midroll"]',
      '[class*="YDC-"]',
      // Other networks
      '[id*="amazon-ad"]', '[class*="amazon-ad"]',
      '[class*="criteo"]', '[id*="criteo"]',
      '[class*="prebid"]',

      // === AD IFRAMES ===
      'iframe[id*="ad"]', 'iframe[class*="ad"]',
      'iframe[src*="ad"]', 'iframe[name*="ad"]',
      'iframe[src*="banner"]',

      // === POPUPS AND MODALS ===
      '[class*="popup"]', '[class*="modal"]:not([class*="bootstrap"]):not([class*="video"])',
      '[class*="overlay"]:not([class*="video"]):not([class*="player"])',
      '[class*="newsletter"]', '[class*="subscribe-modal"]',
      '[class*="cookie-banner"]', '[class*="cookie-notice"]', '[class*="cookie-consent"]',
      '[class*="gdpr"]', '[id*="cookie"]',
      '[class*="consent-banner"]', '[class*="privacy-banner"]',
      '[class*="paywall"]', '[class*="regwall"]',

      // === SOCIAL WIDGETS ===
      '[class*="share-buttons"]', '[class*="social-share"]',
      '[class*="follow-us"]', '[class*="social-widget"]',
      '[class*="social-bar"]', '[class*="share-bar"]',

      // === FLOATING / STICKY CLUTTER ===
      '[class*="floating-"]', '[class*="fixed-bottom"]',
      '[class*="sticky-footer"]', '[class*="bottom-bar"]',
      '[class*="sticky-ad"]', '[class*="stickyAd"]',
      '[class*="adhesion"]', '[class*="anchor-ad"]',

      // === CHAT WIDGETS ===
      '[class*="chat-widget"]', '[class*="livechat"]',
      '[id*="intercom"]', '[class*="intercom"]',
      '[id*="drift"]', '[class*="helpscout"]',
      '[class*="zendesk"]', '[id*="hubspot"]',

      // === NOTIFICATIONS / PROMOS ===
      '[class*="notification-bar"]', '[class*="alert-bar"]',
      '[class*="announcement-bar"]', '[class*="promo-bar"]',
      '[class*="top-banner"]', '[class*="promo-banner"]',
      '[class*="marketing-banner"]',

      // === RIGHT RAIL / SIDEBARS (often ads) ===
      '[class*="right-rail"]', '[class*="rightRail"]',
      '[class*="rail-module"]',

      // === "RELATED" / "RECOMMENDED" (often native ads) ===
      '[class*="around-the-web"]', '[class*="from-the-web"]',
      '[class*="you-may-like"]', '[class*="recommended-for-you"]',
      '[class*="more-stories"]', '[class*="related-stories"]'
    ],

    // Elements to de-emphasize (fade out)
    deemphasizeSelectors: [
      'aside', '[role="complementary"]',
      '[class*="sidebar"]', '[id*="sidebar"]',
      '[class*="related-"]', '[class*="recommended"]',
      '[class*="trending"]', '[class*="popular-"]',
      '[class*="comments"]', '[id*="comments"]',
      '[class*="author-bio"]', '[class*="author-box"]'
    ],

    // Navigation elements to simplify
    navigationSelectors: [
      'nav', '[role="navigation"]',
      'header nav', '.navbar', '.nav-menu',
      '[class*="navigation"]', '[class*="menu-"]'
    ],

    // Main content detection
    mainContentSelectors: [
      'main', '[role="main"]', 'article',
      '[class*="content"]', '[class*="post-body"]',
      '[class*="article-body"]', '[class*="entry-content"]',
      '#content', '.content', '#main-content'
    ],

    // Sticky elements
    stickySelectors: [
      '[class*="sticky"]', '[class*="fixed"]',
      '[style*="position: fixed"]', '[style*="position: sticky"]',
      '[style*="position:fixed"]', '[style*="position:sticky"]'
    ]
  };

  // Aggressive mode additional selectors
  const AGGRESSIVE_SELECTORS = {
    hide: [
      '[class*="footer"]', '[id*="footer"]',
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

      this.init();
    }

    async init() {
      // Load settings
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
      if (!this.isEnabled) return;

      const config = CONFIG.levels[this.level];
      if (!config) return;

      try {
        // Inject global styles
        this.injectStyles(config);

        // Find main content
        const mainContent = this.findMainContent();

        // Hide unwanted elements
        if (config.hideElements) {
          this.hideElements(SELECTORS.hideSelectors);
          if (config.aggressiveMode) {
            this.hideElements(AGGRESSIVE_SELECTORS.hide);
          }
        }

        // Handle sticky elements
        this.handleStickyElements();

        // De-emphasize secondary elements
        if (config.deemphasizeElements) {
          this.deemphasizeElements(SELECTORS.deemphasizeSelectors, mainContent);
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
          /* Improve base readability */
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

          /* Remove width constraints from parent containers */
          .site-simplifier-active article > *,
          .site-simplifier-active [role="main"] > *,
          .site-simplifier-active main > *,
          .site-simplifier-active .site-simplifier-main-content > * {
            max-width: 100% !important;
            width: auto !important;
          }

          /* Video/media containers within content should be full width of parent */
          .site-simplifier-active article video,
          .site-simplifier-active article iframe,
          .site-simplifier-active article .video-container,
          .site-simplifier-active article [class*="video"],
          .site-simplifier-active article [class*="player"],
          .site-simplifier-active main video,
          .site-simplifier-active main iframe:not([src*="ad"]),
          .site-simplifier-active main .video-container,
          .site-simplifier-active main [class*="video"]:not([class*="ad"]),
          .site-simplifier-active main [class*="player"] {
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Ensure body and html don't constrain */
          .site-simplifier-active,
          .site-simplifier-active body {
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
        ` : ''}

        /* Hidden elements */
        .site-simplifier-hidden {
          display: none !important;
          visibility: hidden !important;
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

        /* Simplified sticky elements */
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

        .site-simplifier-nav-simplified > * {
          max-height: none !important;
        }
      `;

      this.styleElement = document.createElement('style');
      this.styleElement.id = 'site-simplifier-styles';
      this.styleElement.textContent = styles;
      document.head.appendChild(this.styleElement);
    }

    findMainContent() {
      // Try to find main content container
      for (const selector of SELECTORS.mainContentSelectors) {
        const element = document.querySelector(selector);
        if (element && this.isVisible(element) && this.hasSignificantContent(element)) {
          return element;
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
      // Don't hide elements that are likely critical for page function
      const tag = element.tagName.toLowerCase();
      const criticalTags = ['form', 'input', 'button', 'select', 'textarea'];
      if (criticalTags.includes(tag)) return true;

      // Don't hide main navigation if it's the only one
      if (tag === 'nav' || element.role === 'navigation') {
        const navCount = document.querySelectorAll('nav, [role="navigation"]').length;
        if (navCount <= 2) return true;
      }

      // Don't hide search forms
      if (element.querySelector('input[type="search"]')) return true;

      return false;
    }

    handleStickyElements() {
      SELECTORS.stickySelectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' || style.position === 'sticky') {
              // Keep main navigation, unstick the rest
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
      document.querySelectorAll(SELECTORS.navigationSelectors.join(', ')).forEach(nav => {
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

        // Expand width by removing constraints on parent elements
        this.expandContentWidth(element);
      }
    }

    expandContentWidth(element) {
      // Walk up the DOM tree and remove width constraints
      let current = element;
      let depth = 0;
      const maxDepth = 10;

      while (current && current !== document.body && depth < maxDepth) {
        const style = window.getComputedStyle(current);
        const maxWidth = style.maxWidth;
        const width = style.width;

        // If there's a constraining max-width or fixed width, override it
        if (maxWidth && maxWidth !== 'none' && !maxWidth.includes('%')) {
          if (!this.originalStyles.has(current)) {
            this.originalStyles.set(current, current.getAttribute('style') || '');
          }
          current.style.maxWidth = '100%';
          this.modifiedElements.add(current);
        }

        // Handle flex containers that might constrain width
        if (style.display === 'flex' || style.display === 'grid') {
          if (!this.originalStyles.has(current)) {
            this.originalStyles.set(current, current.getAttribute('style') || '');
          }
          // Remove flex constraints that limit main content
          current.style.flexBasis = 'auto';
          current.style.flexGrow = '1';
          this.modifiedElements.add(current);
        }

        current = current.parentElement;
        depth++;
      }
    }

    reset() {
      // Remove injected styles
      if (this.styleElement) {
        this.styleElement.remove();
        this.styleElement = null;
      }

      // Remove hidden class from elements
      this.hiddenElements.forEach(el => {
        el.classList.remove('site-simplifier-hidden');
      });
      this.hiddenElements.clear();

      // Remove all modification classes
      this.modifiedElements.forEach(el => {
        el.classList.remove(
          'site-simplifier-deemphasized',
          'site-simplifier-unstuck',
          'site-simplifier-main-content',
          'site-simplifier-nav-simplified'
        );

        // Restore original styles
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

      // Remove active class from body
      document.body.classList.remove('site-simplifier-active');
    }
  }

  // Initialize
  new SiteSimplifier();

})();
