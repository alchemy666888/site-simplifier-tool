// Site Simplifier - Rule Manager
// Manages loading and matching rules for different domains

window.SiteSimplifierRuleManager = (function() {
  'use strict';

  const rules = window.SiteSimplifierRules || {};

  /**
   * Get the appropriate rules for the current domain
   * @param {string} hostname - The current page hostname
   * @returns {object} Merged rules object
   */
  function getRulesForDomain(hostname) {
    const defaultRules = rules.default || {};
    let siteRules = null;

    // Find matching site-specific rules
    for (const key in rules) {
      if (key === 'default') continue;

      const rule = rules[key];

      // Check if this rule matches the hostname
      if (rule.matches && Array.isArray(rule.matches)) {
        for (const pattern of rule.matches) {
          if (hostname === pattern || hostname.endsWith('.' + pattern)) {
            siteRules = rule;
            break;
          }
        }
      }

      // Also match by key (e.g., 'finance.yahoo.com')
      if (!siteRules && (hostname === key || hostname.endsWith('.' + key))) {
        siteRules = rule;
      }

      if (siteRules) break;
    }

    // Merge default and site-specific rules
    return mergeRules(defaultRules, siteRules);
  }

  /**
   * Merge default rules with site-specific rules
   * @param {object} defaultRules - Base rules
   * @param {object} siteRules - Site-specific rules (can be null)
   * @returns {object} Merged rules
   */
  function mergeRules(defaultRules, siteRules) {
    if (!siteRules) {
      return {
        ...defaultRules,
        _appliedRules: ['default']
      };
    }

    return {
      name: siteRules.name || defaultRules.name,
      description: siteRules.description || defaultRules.description,

      // Merge and dedupe selectors
      hideSelectors: mergeArrays(
        defaultRules.hideSelectors || [],
        siteRules.hideSelectors || []
      ),
      deemphasizeSelectors: mergeArrays(
        defaultRules.deemphasizeSelectors || [],
        siteRules.deemphasizeSelectors || []
      ),
      navigationSelectors: siteRules.navigationSelectors || defaultRules.navigationSelectors || [],
      mainContentSelectors: mergeArrays(
        siteRules.mainContentSelectors || [],
        defaultRules.mainContentSelectors || []
      ),
      stickySelectors: mergeArrays(
        defaultRules.stickySelectors || [],
        siteRules.stickySelectors || []
      ),

      // Combine custom CSS
      customCSS: (defaultRules.customCSS || '') + '\n' + (siteRules.customCSS || ''),

      // Track which rules were applied
      _appliedRules: ['default', siteRules.name || 'site-specific']
    };
  }

  /**
   * Merge two arrays and remove duplicates
   * @param {Array} arr1
   * @param {Array} arr2
   * @returns {Array}
   */
  function mergeArrays(arr1, arr2) {
    return [...new Set([...arr1, ...arr2])];
  }

  /**
   * Get list of all available rule sets
   * @returns {Array} List of rule set names
   */
  function getAvailableRules() {
    return Object.keys(rules).map(key => ({
      key,
      name: rules[key].name || key,
      description: rules[key].description || ''
    }));
  }

  /**
   * Check if a domain has site-specific rules
   * @param {string} hostname
   * @returns {boolean}
   */
  function hasSiteSpecificRules(hostname) {
    for (const key in rules) {
      if (key === 'default') continue;

      const rule = rules[key];
      if (rule.matches && Array.isArray(rule.matches)) {
        for (const pattern of rule.matches) {
          if (hostname === pattern || hostname.endsWith('.' + pattern)) {
            return true;
          }
        }
      }
      if (hostname === key || hostname.endsWith('.' + key)) {
        return true;
      }
    }
    return false;
  }

  // Public API
  return {
    getRulesForDomain,
    getAvailableRules,
    hasSiteSpecificRules,
    rules
  };
})();
