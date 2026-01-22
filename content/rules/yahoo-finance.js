// Site Simplifier - Yahoo Finance Rules
// Specific rules for finance.yahoo.com

window.SiteSimplifierRules = window.SiteSimplifierRules || {};

window.SiteSimplifierRules['finance.yahoo.com'] = {
  name: 'Yahoo Finance',
  description: 'Rules optimized for Yahoo Finance articles and news',

  // Domain patterns this rule applies to
  matches: [
    'finance.yahoo.com',
    'www.finance.yahoo.com'
  ],

  // Additional selectors to hide (merged with default)
  hideSelectors: [
    // === YAHOO ADS ===
    '[class*="gemini-ad"]', '[data-beacon]',
    '[class*="caas-da"]', '[class*="caas-ad"]',
    '[class*="ad-slot"]', '[class*="adSlot"]',
    '[class*="stream-ad"]', '[class*="streamAd"]',
    '[class*="ntk-ad"]', '[class*="Adsense"]',
    '[class*="video-ad"]', '[class*="videoAd"]',
    '[class*="preroll"]', '[class*="midroll"]',
    '[class*="YDC-"]',

    // === YAHOO MODULES AND WIDGETS ===
    '[data-ylk*="itc:0"]',
    '[class*="markets-"]', '[class*="market-summary"]',
    '[class*="ticker-"]', '[class*="quote-"]',
    '[class*="stream-item"]',
    '[class*="related-list"]', '[class*="RelatedList"]',
    '[class*="latest-news"]', '[class*="LatestNews"]',
    '[class*="aside-"]', '[class*="Aside"]',
    '[class*="Mstrm"]',
    '[class*="tdv2"]',
    '[class*="multiple-stories"]',
    '[class*="readmore"]', '[class*="read-more"]',
    '[class*="Also"]', '[class*="also-"]',
    '[class*="recirc"]', '[class*="Recirc"]',

    // === QUOTE LOOKUP AND MARKET DATA ===
    '[class*="quote-lookup"]', '[class*="QuoteLookup"]', '[class*="quoteLookup"]',
    '[id*="quote-lookup"]', '[id*="QuoteLookup"]',
    '[class*="lookup"]', '[id*="lookup"]',
    '[class*="market-data"]', '[class*="MarketData"]',
    '[class*="marketData"]', '[class*="market-overview"]',
    '[class*="stock-"]', '[class*="Stock"]',
    '[class*="watchlist"]', '[class*="Watchlist"]',
    '[class*="portfolio"]', '[class*="Portfolio"]',
    '[class*="screener"]', '[class*="Screener"]',
    '[class*="cryptocurrencies"]', '[class*="Crypto"]',

    // === YAHOO ATOMIC CSS LAYOUT ===
    '[class*="W(320px)"]', '[class*="W(300px)"]',
    '[class*="Mend"]',
    '[class*="Pend"]',
    '[data-test-locator*="aside"]',
    '[data-test-locator*="rail"]',
    '[data-test-locator*="SIDEBAR"]',

    // === YAHOO SPECIFIC CHAT ===
    '[class*="celcom"]', '[class*="digi"]'
  ],

  // Yahoo-specific main content selectors
  mainContentSelectors: [
    '[class*="caas-body"]',
    '[class*="caas-content"]',
    '[class*="article-wrap"]',
    '[class*="articleWrap"]',
    'article',
    '[role="main"]'
  ],

  // Custom CSS for Yahoo Finance layout
  customCSS: `
    /* === YAHOO FINANCE SPECIFIC LAYOUT === */

    /* Hide right column/sidebar completely */
    .site-simplifier-active [class*="rightColumn"],
    .site-simplifier-active [class*="right-column"],
    .site-simplifier-active [class*="RightColumn"],
    .site-simplifier-active [data-test-locator*="SIDEBAR"],
    .site-simplifier-active [class*="aside"],
    .site-simplifier-active [class*="Aside"] {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }

    /* Expand main column to full width */
    .site-simplifier-active [class*="mainColumn"],
    .site-simplifier-active [class*="main-column"],
    .site-simplifier-active [class*="MainColumn"],
    .site-simplifier-active [class*="leftColumn"],
    .site-simplifier-active [class*="left-column"],
    .site-simplifier-active [class*="LeftColumn"],
    .site-simplifier-active [class*="article-wrap"],
    .site-simplifier-active [class*="articleWrap"],
    .site-simplifier-active [class*="caas-body"],
    .site-simplifier-active [class*="caas-content"] {
      width: 80% !important;
      max-width: 80% !important;
      min-width: 80% !important;
      margin-left: auto !important;
      margin-right: auto !important;
      flex: none !important;
    }

    /* Override Yahoo's atomic CSS width classes */
    .site-simplifier-active [class*="W(100%)"],
    .site-simplifier-active [class*="W("] {
      width: 80% !important;
      max-width: 80% !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    /* Remove flex layout constraints */
    .site-simplifier-active [class*="D(f)"],
    .site-simplifier-active [class*="Flx"] {
      flex-wrap: wrap !important;
    }

    /* Hide all fixed/sticky positioned elements except main nav */
    .site-simplifier-active [style*="position: fixed"]:not(nav):not(header):not([class*="nav"]),
    .site-simplifier-active [style*="position:fixed"]:not(nav):not(header):not([class*="nav"]) {
      display: none !important;
    }

    /* Yahoo video player - make it wider */
    .site-simplifier-active [class*="caas-player"],
    .site-simplifier-active [class*="video-player"] {
      width: 100% !important;
      max-width: 100% !important;
    }
  `
};
