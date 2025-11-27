// Xbout - Display a user's account location 🌍, device type (🍎 Apple / 🤖 Android), and registration year directly on X (Twitter) pages.
// Data source: X GraphQL API - AboutAccountQuery

(function() {
  'use strict';

  if (window.__xboutLoaded) return;
  window.__xboutLoaded = true;

  console.log('[Xbout] Script loaded');

  const CONFIG = {
    INIT_DELAY: 3000,
    REQUEST_DELAY: 3000,
    SCAN_DEBOUNCE: 200,
    CACHE_DURATION: 24 * 60 * 60 * 1000,
    CACHE_ERROR_DURATION: 30 * 60 * 1000,
    MAX_REQUESTS_PER_MINUTE: 10,
    RATE_LIMIT_WAIT: 60 * 1000,
    STORAGE_KEY: 'xbout_cache',
    BEARER_TOKEN: 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
    FALLBACK_QUERY_ID: 'zs_jFPFT78rBpXv9Z3U2YQ',
    CHROME_ICON_BASE64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMiIgZmlsbD0iIzQyODVGNCIvPgogIDxwYXRoIGZpbGw9IiNFQTQzMzUiIGQ9Ik0yNCAyQzEzLjUgMiA0LjYgOC42IDIuMSAxNy44TDE0LjMgMjRsNS4yLTljMS4zLTIuMyAzLjgtNCA2LjUtNGgxOS44QzQyLjMgNS42IDMzLjggMiAyNCAyeiIvPgogIDxwYXRoIGZpbGw9IiNGQkJDMDUiIGQ9Ik0yLjEgMTcuOEMuNyAyMi4zLjcgMjcuMiAyLjEgMzEuN2wxMi4yLTYuMi01LjItOWMtMS4zLTIuMy0xLjgtNS0xLjMtNy41TDIuMSAxNy44eiIvPgogIDxwYXRoIGZpbGw9IiMzNEE4NTMiIGQ9Ik0yNCA0NmM5LjUgMCAxOC01LjYgMjEuOS0xNC4zbC0xMi4yLTYuMi01LjIgOWMtMS4zIDIuMy0zLjggNC02LjUgNC01LjUgMC0xMC00LjUtMTAtMTAgMC0xLjkuNS0zLjYgMS40LTUuMkwyLjEgMzEuN0M1LjcgNDAuNCAxNC4yIDQ2IDI0IDQ2eiIvPgogIDxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjkiIGZpbGw9IiNmZmYiLz4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSI3IiBmaWxsPSIjNDI4NUY0Ii8+Cjwvc3ZnPgo=',
  };

  const countryToFlag = {
    'china': '🇨🇳', 'japan': '🇯🇵', 'south korea': '🇰🇷', 'korea': '🇰🇷',
    'taiwan': '🇹🇼', 'hong kong': '🇭🇰', 'singapore': '🇸🇬', 'india': '🇮🇳',
    'thailand': '🇹🇭', 'viet nam': '🇻🇳', 'malaysia': '🇲🇾', 'indonesia': '🇮🇩',
    'philippines': '🇵🇭', 'pakistan': '🇵🇰', 'bangladesh': '🇧🇩', 'nepal': '🇳🇵',
    'sri lanka': '🇱🇰', 'myanmar': '🇲🇲', 'cambodia': '🇰🇭', 'mongolia': '🇲🇳',
    'saudi arabia': '🇸🇦', 'united arab emirates': '🇦🇪', 'uae': '🇦🇪',
    'israel': '🇮🇱', 'turkey': '🇹🇷', 'türkiye': '🇹🇷', 'iran': '🇮🇷',
    'iraq': '🇮🇶', 'qatar': '🇶🇦', 'kuwait': '🇰🇼', 'jordan': '🇯🇴',
    'lebanon': '🇱🇧', 'bahrain': '🇧🇭', 'oman': '🇴🇲',
    'united kingdom': '🇬🇧', 'uk': '🇬🇧', 'england': '🇬🇧',
    'france': '🇫🇷', 'germany': '🇩🇪', 'italy': '🇮🇹', 'spain': '🇪🇸',
    'portugal': '🇵🇹', 'netherlands': '🇳🇱', 'belgium': '🇧🇪', 'switzerland': '🇨🇭',
    'austria': '🇦🇹', 'sweden': '🇸🇪', 'norway': '🇳🇴', 'denmark': '🇩🇰',
    'finland': '🇫🇮', 'poland': '🇵🇱', 'russia': '🇷🇺', 'ukraine': '🇺🇦',
    'greece': '🇬🇷', 'czech republic': '🇨🇿', 'czechia': '🇨🇿', 'hungary': '🇭🇺',
    'romania': '🇷🇴', 'ireland': '🇮🇪', 'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'united states': '🇺🇸', 'usa': '🇺🇸', 'us': '🇺🇸',
    'canada': '🇨🇦', 'mexico': '🇲🇽', 'brazil': '🇧🇷', 'argentina': '🇦🇷',
    'chile': '🇨🇱', 'colombia': '🇨🇴', 'peru': '🇵🇪', 'venezuela': '🇻🇪',
    'australia': '🇦🇺', 'new zealand': '🇳🇿', 'south africa': '🇿🇦',
    'egypt': '🇪🇬', 'nigeria': '🇳🇬', 'kenya': '🇰🇪', 'morocco': '🇲🇦',
    'ethiopia': '🇪🇹', 'ghana': '🇬🇭',
  };

  class CacheManager {
    constructor() {
      this.memoryCache = new Map();
      this.loadFromStorage();
    }

    loadFromStorage() {
      try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          const now = Date.now();
          for (const [key, value] of Object.entries(data)) {
            if (value.expiry > now) {
              this.memoryCache.set(key, value);
            }
          }
          console.log(`[Xbout] Loaded ${this.memoryCache.size} cached users`);
        }
      } catch (e) {
        console.warn('[Xbout] Cache load error:', e);
      }
    }

    saveToStorage() {
      try {
        const data = Object.fromEntries(this.memoryCache);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('[Xbout] Cache save error:', e);
      }
    }

    get(username) {
      const cached = this.memoryCache.get(username);
      if (!cached) return null;
      if (Date.now() > cached.expiry) {
        this.memoryCache.delete(username);
        return null;
      }
      return cached.data;
    }

    set(username, data, isError = false) {
      const duration = isError ? CONFIG.CACHE_ERROR_DURATION : CONFIG.CACHE_DURATION;
      this.memoryCache.set(username, {
        data: data,
        expiry: Date.now() + duration,
        isError: isError
      });
      this.saveToStorage();
    }

    has(username) {
      return this.get(username) !== null;
    }

    isErrorCached(username) {
      const cached = this.memoryCache.get(username);
      return cached && cached.isError && Date.now() < cached.expiry;
    }
  }

  class RateLimiter {
    constructor() {
      this.requests = [];
      this.isRateLimited = false;
      this.rateLimitEndTime = 0;
    }

    canMakeRequest() {
      if (this.isRateLimited) {
        if (Date.now() < this.rateLimitEndTime) {
          return false;
        }
        this.isRateLimited = false;
      }
      const oneMinuteAgo = Date.now() - 60 * 1000;
      this.requests = this.requests.filter(t => t > oneMinuteAgo);
      return this.requests.length < CONFIG.MAX_REQUESTS_PER_MINUTE;
    }

    recordRequest() {
      this.requests.push(Date.now());
    }

    setRateLimited() {
      this.isRateLimited = true;
      this.rateLimitEndTime = Date.now() + CONFIG.RATE_LIMIT_WAIT;
      console.log(`[Xbout] Rate limited, waiting until ${new Date(this.rateLimitEndTime).toLocaleTimeString()}`);
      showToast('Xbout: Rate limited by X API. Please wait a moment.', 5000, 'warning');
    }

    getWaitTime() {
      if (this.isRateLimited) {
        return Math.max(0, this.rateLimitEndTime - Date.now());
      }
      return 0;
    }
  }

  const cache = new CacheManager();
  const rateLimiter = new RateLimiter();
  const processedElements = new WeakSet();
  const pendingUsers = new Set();

  let queryId = null;
  let scanTimeout = null;
  let mutationObserver = null;

  // Toast notification function
  function showToast(message, duration = 5000, type = 'warning') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.xbout-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `xbout-toast xbout-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('xbout-toast-show');
    });

    // Auto remove after duration
    setTimeout(() => {
      toast.classList.remove('xbout-toast-show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  function getFlag(location) {
    if (!location) return null;
    const loc = location.toLowerCase().trim();
    
    // Area determination - using different earth emoji
    // 🌏 Asia, Pacific, Oceania
    // 🌎 America
    // 🌍 Europe, Africa
    
    if (loc.includes('asia') || loc.includes('pacific') || loc.includes('oceania')) {
      return '🌏';
    }
    if (loc.includes('america')) {
      return '🌎';
    }
    if (loc.includes('europe')) {
      return '🌍';
    }
    if (loc.includes('africa')) {
      return '🌍';
    }
    
    // Exact match country
    if (countryToFlag[loc]) return countryToFlag[loc];
    
    // Partial match
    for (const [country, flag] of Object.entries(countryToFlag)) {
      if (loc.includes(country) || country.includes(loc)) {
        return flag;
      }
    }
    
    // Unknown region - default display Earth
    return '🌍';
  }

  // Format location name for tooltip display (capitalize each word)
  function formatLocationName(location) {
    if (!location) return '';
    return location
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  function getDeviceHtml(source) {
    if (!source) return '';
    const s = source.toLowerCase();
    
    if (s.includes('iphone') || s.includes('ios') || s.includes('ipad') || s.includes('app store')) {
      return '🍎';
    }
    if (s.includes('android') || s.includes('play store') || s.includes('google play')) {
      return '🤖';
    }
    if (s === 'web' || s.includes('web app') || s.includes('browser')) {
      return `<img src="${CONFIG.CHROME_ICON_BASE64}" class="xbout-device-icon" alt="Web">`;
    }
    
    return '';
  }

  function getYear(createdAt) {
    if (!createdAt) return '';
    const match = createdAt.match(/(\d{4})$/);
    if (match) return match[1];
    return '';
  }

  function getCsrfToken() {
    const match = document.cookie.match(/ct0=([^;]+)/);
    return match ? match[1] : null;
  }

  async function fetchQueryId() {
    try {
      const entries = performance.getEntriesByType('resource');
      for (const entry of entries) {
        const match = entry.name.match(/graphql\/([^/]+)\/AboutAccountQuery/);
        if (match) {
          console.log('[Xbout] Found queryId from network:', match[1]);
          return match[1];
        }
      }
    } catch (e) {}
    return null;
  }

  function setupQueryIdObserver() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const match = entry.name.match(/graphql\/([^/]+)\/AboutAccountQuery/);
          if (match && match[1] !== queryId) {
            queryId = match[1];
            console.log('[Xbout] Updated queryId:', queryId);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {}
  }

  let requestQueue = [];
  let isProcessing = false;

  async function fetchAboutInfo(username) {
    const csrfToken = getCsrfToken();
    if (!csrfToken) return null;

    const currentQueryId = queryId || CONFIG.FALLBACK_QUERY_ID;
    const variables = JSON.stringify({ screenName: username });
    const url = `https://x.com/i/api/graphql/${currentQueryId}/AboutAccountQuery?variables=${encodeURIComponent(variables)}`;

    try {
      rateLimiter.recordRequest();
      
      const resp = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'authorization': `Bearer ${CONFIG.BEARER_TOKEN}`,
          'content-type': 'application/json',
          'x-csrf-token': csrfToken,
          'x-twitter-active-user': 'yes',
          'x-twitter-auth-type': 'OAuth2Session',
          'x-twitter-client-language': 'en',
        }
      });

      if (resp.status === 429) {
        rateLimiter.setRateLimited();
        return { error: 'rate_limited' };
      }

      if (!resp.ok) {
        console.warn(`[Xbout] API error for ${username}: ${resp.status}`);
        return { error: resp.status };
      }

      const data = await resp.json();
      const result = data?.data?.user_result_by_screen_name?.result;
      
      if (result) {
        const aboutProfile = result.about_profile || {};
        const core = result.core || {};
        
        return {
          location: aboutProfile.account_based_in || null,
          locationAccurate: aboutProfile.location_accurate !== false, // true if undefined or true
          source: aboutProfile.source || null,
          createdAt: core.created_at || null
        };
      }
      
      return null;
    } catch (e) {
      console.warn(`[Xbout] Fetch error for ${username}:`, e.message);
      return { error: 'network' };
    }
  }

  async function processQueue() {
    if (isProcessing || requestQueue.length === 0) return;
    isProcessing = true;

    while (requestQueue.length > 0) {
      if (!rateLimiter.canMakeRequest()) {
        const waitTime = rateLimiter.getWaitTime();
        if (waitTime > 0) {
          console.log(`[Xbout] Waiting ${Math.ceil(waitTime/1000)}s before next request...`);
          await new Promise(r => setTimeout(r, waitTime));
          continue;
        }
      }

      const { username, callback } = requestQueue.shift();
      
      if (cache.has(username)) {
        callback(cache.get(username));
        continue;
      }

      const info = await fetchAboutInfo(username);
      
      if (info?.error === 'rate_limited') {
        requestQueue.unshift({ username, callback });
        await new Promise(r => setTimeout(r, CONFIG.RATE_LIMIT_WAIT));
        continue;
      }

      if (info?.error) {
        cache.set(username, null, true);
        pendingUsers.delete(username);
        callback(null);
      } else if (info) {
        console.log(`[Xbout] ${username}: ${info.location} → ${getFlag(info.location)}${info.locationAccurate ? '' : ' (VPN)'}`);
        cache.set(username, info);
        pendingUsers.delete(username);
        callback(info);
      } else {
        cache.set(username, null, true);
        pendingUsers.delete(username);
        callback(null);
      }
      
      await new Promise(r => setTimeout(r, CONFIG.REQUEST_DELAY));
    }
    
    isProcessing = false;
  }

  function getUserInfo(username, callback) {
    if (cache.has(username)) {
      const cached = cache.get(username);
      callback(cached);
      return;
    }

    if (cache.isErrorCached(username)) {
      callback(null);
      return;
    }

    if (pendingUsers.has(username)) {
      return;
    }

    pendingUsers.add(username);
    requestQueue.push({ username, callback });
    processQueue();
  }

  function findDateElement(usernameLink) {
    let container = usernameLink.parentElement;
    for (let i = 0; i < 5 && container; i++) {
      const timeElement = container.querySelector('time');
      if (timeElement) {
        let dateContainer = timeElement.closest('a') || timeElement.parentElement;
        return dateContainer;
      }
      container = container.parentElement;
    }
    return null;
  }

  function addBadge(element, username) {
    if (processedElements.has(element)) return;
    processedElements.add(element);
    
    getUserInfo(username, (info) => {
      if (!info) return;
      
      const flag = getFlag(info.location);
      const deviceHtml = getDeviceHtml(info.source);
      const year = getYear(info.createdAt);
      
      if (!flag && !deviceHtml && !year) return;
      
      const article = element.closest('article');
      if (article) {
        const existingBadge = article.querySelector(`.xbout-badge[data-user="${username}"]`);
        if (existingBadge) return;
      }
      
      const dateElement = findDateElement(element);
      
      const badge = document.createElement('span');
      badge.className = 'xbout-badge';
      badge.setAttribute('data-user', username);
      
      const parts = [];
      
      // Build flag part with label and optional VPN badge
      if (flag) {
        const locationName = formatLocationName(info.location);
        const escapedLocationName = locationName.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        
        if (info.locationAccurate === false) {
          // Location is not accurate - add VPN badge
          parts.push(`<span class="xbout-flag-wrapper"><span class="xbout-flag-text"><span class="xbout-flag-container">${flag}<span class="xbout-vpn-badge">VPN</span></span></span><span class="xbout-flag-label">${escapedLocationName}</span></span>`);
        } else {
          parts.push(`<span class="xbout-flag-wrapper"><span class="xbout-flag-text">${flag}</span><span class="xbout-flag-label">${escapedLocationName}</span></span>`);
        }
      }
      
      if (deviceHtml) parts.push(deviceHtml);
      if (year) parts.push(`<span class="xbout-year">${year}</span>`);
      
      const content = parts.join('<span class="xbout-sep">｜</span>');
      
      // Only add the · separator when the date element is present.
      if (dateElement) {
        badge.innerHTML = '<span class="xbout-dot"> · </span>' + content;
      } else {
        badge.innerHTML = content;
      }
      
      try {
        if (dateElement) {
          dateElement.after(badge);
        } else {
          element.after(badge);
        }
      } catch (e) {
        console.warn('[Xbout] Insert error:', e);
      }
    });
  }

  function scan() {
    const blacklist = ['home', 'explore', 'notifications', 'messages', 'settings', 
                       'i', 'search', 'compose', 'login', 'signup', 'tos', 'privacy',
                       'about', 'jobs', 'help', 'download'];
    
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const text = (link.textContent || '').trim();
      if (!/^@[a-zA-Z0-9_]+$/.test(text)) return;
      
      const username = text.slice(1);
      if (blacklist.includes(username.toLowerCase())) return;
      
      addBadge(link, username);
    });
  }

  // Debounced scan function for MutationObserver
  function debouncedScan() {
    if (scanTimeout) {
      clearTimeout(scanTimeout);
    }
    scanTimeout = setTimeout(scan, CONFIG.SCAN_DEBOUNCE);
  }

  // Setup MutationObserver to watch for DOM changes
  function setupMutationObserver() {
    if (mutationObserver) {
      mutationObserver.disconnect();
    }

    mutationObserver = new MutationObserver((mutations) => {
      // Check if any mutation added new nodes
      let hasNewNodes = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          hasNewNodes = true;
          break;
        }
      }
      
      if (hasNewNodes) {
        debouncedScan();
      }
    });

    // Observe the entire document for added nodes
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('[Xbout] MutationObserver started');
  }

  async function init() {
    console.log('[Xbout] Initializing...');
    
    const csrf = getCsrfToken();
    if (csrf) {
      console.log('[Xbout] CSRF token found');
    } else {
      console.warn('[Xbout] No CSRF token');
    }
    
    queryId = await fetchQueryId();
    if (!queryId) {
      queryId = CONFIG.FALLBACK_QUERY_ID;
      console.log('[Xbout] Using fallback queryId:', queryId);
    }
    
    setupQueryIdObserver();
    
    // Use MutationObserver instead of setInterval
    setupMutationObserver();
    
    // Initial scan
    scan();
    console.log('[Xbout] Ready');
  }

  setTimeout(() => {
    if (document.querySelector('main')) {
      init();
    } else {
      setTimeout(init, 3000);
    }
  }, CONFIG.INIT_DELAY);

})();