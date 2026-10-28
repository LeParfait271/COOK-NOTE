(g => {
  'use strict';
  const S = 'cook_note_preferences', D = 'dark', L = 'light', T = [D, L], OK = true;
  const C = { dark: '#0b0908', light: '#f6eee2' };
  const N = Object.freeze({
    background: '/assets/theme/dark/global/background.jpg',
    hero: '/assets/theme/dark/global/hero.png',
    logo: '/assets/brand/app-icon.png',
    appIcon: '/assets/brand/app-icon.png'
  });
  const J = Object.freeze({
    background: '/assets/theme/day/global/hero.jpg',
    hero: '/assets/theme/day/global/hero.jpg',
    logo: '/assets/theme/day/global/logo.png',
    appIcon: '/assets/brand/app-icon.png'
  });
  const M = Object.freeze({ dark: N, light: OK ? J : N });
  const E = new Set();
  const valid = v => T.includes(v);
  const read = () => { try { return JSON.parse(g.localStorage?.getItem(S) || '{}'); } catch { return {}; } };
  const write = v => { try { g.localStorage?.setItem(S, JSON.stringify(v)); } catch {} };
  const stored = () => { const v = read().theme; return valid(v) ? v : ''; };
  const resolve = v => valid(v) ? v : stored() || D;
  const assets = v => M[resolve(v)] || N;
  const asset = (k, v) => assets(v)[k] || N[k] || '';
  const ver = u => {
    const v = g.COOK_NOTE_ASSET_VERSION;
    return u && v && !/\?v=/.test(u) ? `${u}?v=${v}` : u || '';
  };
  // AVIF (generate-avif.js), repli JPG/PNG.
  let AV = false;
  try { AV = g.CSS.supports('background-image', 'image-set(url("/x.avif") type("image/avif"))'); } catch {}
  const avif = u => AV && /^\/assets\/theme\/.+\.(jpe?g|png)$/.test(u || '') ? u.replace(/\.\w+$/, '.avif') : '';
  const css = u => avif(u) ? `image-set(url("${avif(u)}") type("image/avif"), url("${u}"))` : `url("${u}")`;
  const abs = u =>!u || /^https?:\/\//i.test(u) ? u || '' : `${g.location?.origin || 'https://cook-note.pages.dev'}${u}`;
  function art(t) {
    const d = g.document, r = d?.documentElement;
    if (!r) return;
    const a = assets(t), f = t === L && !OK;
    r.dataset.artDirection = t === L ? 'day' : 'night';
    r.dataset.artAssets = t === L && !OK ? 'night-fallback' : 'approved';
    ['background', 'hero', 'logo'].forEach(k => r.style.setProperty(`--art-${k}-image`, f ? 'none' : css(a[k])));
    d.querySelectorAll?.('[data-art-asset]').forEach(e => {
      const k = e.getAttribute('data-art-asset'), u = a[k] || N[k];
      if (!u) return;
      const p = e.rel === 'preload' ? avif(u) || u : u;
      const v = e.hasAttribute('data-art-versioned') ? ver(p) : p;
      const x = e.getAttribute('data-art-target')
        || (e.tagName === 'META' ? 'content' : e.tagName === 'LINK' ? 'href' : 'src' in e ? 'src' : '');
      if (x) e.setAttribute(x, e.hasAttribute('data-art-absolute') ? abs(v) : v);
    });
  }
  function meta(t) {
    const d = g.document;
    d?.querySelector('meta[name="theme-color"]')?.setAttribute('content', C[t] || C.dark);
    d?.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'dark light');
  }
  function apply(v) {
    const t = resolve(v), r = g.document?.documentElement;
    if (r) {
      r.dataset.theme = t;
      r.style.colorScheme = t;
    }
    art(t);
    meta(t);
    return t;
  }
  function set(v) {
    const t = valid(v) ? v : D;
    write({ ...read(), theme: t });
    apply(t);
    E.forEach(f => f(t));
    try { g.dispatchEvent?.(new CustomEvent('cook-note:theme-change', { detail: { theme: t } })); } catch {}
    return t;
  }
  const toggle = () => set(apply() === L ? D : L);
  const sub = f => typeof f === 'function' ? (E.add(f), () => E.delete(f)) : () => {};
  g.matchMedia?.('(prefers-color-scheme: light)')?.addEventListener?.('change', () => {
    if (stored()) return;
    const t = apply(D);
    E.forEach(f => f(t));
  });
  g.CookNoteTheme = {
    defaultTheme: D,
    themes: T,
    dayAssetsApproved: OK,
    dayAssetCandidates: J,
    theme: () => apply(),
    assets,
    asset,
    applyArtAssets: art,
    applyTheme: apply,
    setTheme: set,
    toggleTheme: toggle,
    subscribe: sub,
    isValidTheme: valid
  };
  apply();
  g.document?.addEventListener?.('DOMContentLoaded', () => apply());
})(window);
