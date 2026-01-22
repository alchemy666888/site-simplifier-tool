// Site Simplifier - Default Rules
// These rules apply to all websites as a baseline

window.SiteSimplifierRules = window.SiteSimplifierRules || {};

window.SiteSimplifierRules.default = {
  name: 'Default',
  description: 'Default rules for all websites',

  // Selectors for elements to completely hide
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
    '[id*="taboola"]', '[class*="taboola"]', '.trc_related_container',
    '[id*="outbrain"]', '[class*="outbrain"]', '.OUTBRAIN',
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
    '[class*="share-buttons"]', '[class*="social-share"]', '[class*="SocialShare"]',
    '[class*="follow-us"]', '[class*="social-widget"]',
    '[class*="social-bar"]', '[class*="share-bar"]', '[class*="ShareBar"]',
    '[class*="sharing"]', '[class*="Sharing"]',

    // === FLOATING / STICKY CLUTTER ===
    '[class*="floating-"]', '[class*="fixed-bottom"]',
    '[class*="sticky-footer"]', '[class*="bottom-bar"]',
    '[class*="sticky-ad"]', '[class*="stickyAd"]',
    '[class*="adhesion"]', '[class*="anchor-ad"]',

    // === CHAT WIDGETS ===
    '[class*="chat-widget"]', '[class*="livechat"]', '[class*="live-chat"]',
    '[id*="intercom"]', '[class*="intercom"]',
    '[id*="drift"]', '[class*="helpscout"]',
    '[class*="zendesk"]', '[id*="hubspot"]',
    '[class*="chatbot"]', '[class*="chat-bot"]', '[class*="ChatBot"]',
    '[class*="messenger"]', '[class*="Messenger"]',
    '[id*="chat"]', '[class*="chat-container"]',
    '[class*="crisp"]', '[class*="tawk"]', '[class*="olark"]',
    '[class*="freshchat"]', '[class*="liveperson"]',
    'iframe[src*="chat"]', 'iframe[title*="chat"]',
    '[aria-label*="chat"]', '[aria-label*="Chat"]',

    // === NOTIFICATIONS / PROMOS ===
    '[class*="notification-bar"]', '[class*="alert-bar"]',
    '[class*="announcement-bar"]', '[class*="promo-bar"]',
    '[class*="top-banner"]', '[class*="promo-banner"]',
    '[class*="marketing-banner"]',

    // === SECONDARY CONTENT ===
    '[role="complementary"]',
    '[class*="sidebar"]', '[id*="sidebar"]', '[class*="Sidebar"]',
    '[class*="right-rail"]', '[class*="rightRail"]', '[class*="RightRail"]',
    '[class*="rail-"]', '[class*="Rail-"]',
    'aside',

    // === RELATED / RECOMMENDED ===
    '[class*="related-"]', '[class*="Related"]',
    '[class*="recommended"]', '[class*="Recommended"]',
    '[class*="popular-"]', '[class*="Popular"]',
    '[class*="trending"]', '[class*="Trending"]',
    '[class*="around-the-web"]', '[class*="from-the-web"]',
    '[class*="you-may-like"]', '[class*="recommended-for-you"]',
    '[class*="more-stories"]', '[class*="related-stories"]',
    '[class*="more-from"]', '[class*="MoreFrom"]',
    '[class*="also-read"]', '[class*="AlsoRead"]',

    // === COMMENTS ===
    '[class*="comments"]', '[id*="comments"]', '[class*="Comments"]',

    // === AUTHOR BIO ===
    '[class*="author-bio"]', '[class*="author-box"]', '[class*="AuthorBio"]',
    '[class*="byline-"]',

    // === FOOTER ===
    'footer', '[class*="footer"]', '[id*="footer"]',
    '[class*="Footer"]', '[role="contentinfo"]'
  ],

  // Selectors for elements to de-emphasize (only used in light mode)
  deemphasizeSelectors: [
    'header:not(:first-of-type)'
  ],

  // Navigation elements to simplify
  navigationSelectors: [
    'nav', '[role="navigation"]',
    'header nav', '.navbar', '.nav-menu',
    '[class*="navigation"]', '[class*="menu-"]'
  ],

  // Main content detection selectors
  mainContentSelectors: [
    'main', '[role="main"]', 'article',
    '[class*="article-body"]', '[class*="entry-content"]',
    '[class*="post-body"]', '[class*="post-content"]',
    '#content', '.content', '#main-content'
  ],

  // Sticky elements to unstick
  stickySelectors: [
    '[class*="sticky"]', '[class*="fixed"]',
    '[style*="position: fixed"]', '[style*="position: sticky"]',
    '[style*="position:fixed"]', '[style*="position:sticky"]'
  ],

  // Site-specific CSS (empty for default)
  customCSS: ''
};
