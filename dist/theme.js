(function initCookNoteTheme(global) {
  'use strict';

  const STORAGE_KEY = 'cook_note_preferences';
  const DEFAULT_THEME = 'dark';
  const THEMES = ['dark', 'light'];
  const THEME_COLORS = {
    dark: '#fbbf24',
    light: '#b45309'
  };
  const listeners = new Set();

  function isValidTheme(value) {
    return THEMES.includes(value);
  }

  function readPreferences() {
    try {
      const raw = global.localStorage?.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function writePreferences(next) {
    try {
      global.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Ignore private browsing restrictions. */
    }
  }

  function systemTheme() {
    try {
      return global.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  }

  function storedTheme() {
    const theme = readPreferences().theme;
    return isValidTheme(theme) ? theme : '';
  }

  function resolveTheme(value) {
    if (isValidTheme(value)) return value;
    return storedTheme() || systemTheme();
  }

  function updateMeta(theme) {
    if (!global.document) return;
    const themeColor = global.document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark);
    const colorScheme = global.document.querySelector('meta[name="color-scheme"]');
    if (colorScheme) colorScheme.setAttribute('content', 'dark light');
  }

  function applyTheme(value) {
    const theme = resolveTheme(value);
    if (global.document?.documentElement) {
      global.document.documentElement.dataset.theme = theme;
      global.document.documentElement.style.colorScheme = theme;
    }
    updateMeta(theme);
    return theme;
  }

  function setTheme(value) {
    const theme = isValidTheme(value) ? value : DEFAULT_THEME;
    const preferences = readPreferences();
    writePreferences({ ...preferences, theme });
    applyTheme(theme);
    listeners.forEach(listener => listener(theme));
    try {
      global.dispatchEvent?.(new CustomEvent('cook-note:theme-change', { detail: { theme } }));
    } catch {
      /* CustomEvent may be unavailable in old browsers. */
    }
    return theme;
  }

  function toggleTheme() {
    return setTheme(applyTheme() === 'light' ? 'dark' : 'light');
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  const media = global.matchMedia?.('(prefers-color-scheme: light)');
  if (media && typeof media.addEventListener === 'function') {
    media.addEventListener('change', () => {
      if (storedTheme()) return;
      const theme = applyTheme(systemTheme());
      listeners.forEach(listener => listener(theme));
    });
  }

  const api = {
    defaultTheme: DEFAULT_THEME,
    themes: THEMES,
    theme: () => applyTheme(),
    applyTheme,
    setTheme,
    toggleTheme,
    subscribe,
    isValidTheme
  };

  global.CookNoteTheme = api;
  applyTheme();
})(window);
