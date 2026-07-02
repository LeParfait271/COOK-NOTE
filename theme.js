(g => {
  'use strict';
  const S = 'cook_note_preferences', D = 'dark', L = 'light', T = [D, L], OK = false;
  const C = { dark: '#fbbf24', light: '#b45309' };
  const N = Object.freeze({
    background: '/assets/base-principale-fond-site.jpg',
    hero: '/assets/base-du-site.png',
    logo: '/assets/cook-note-white.png',
    appIcon: '/assets/cook-note.png'
  });
  const J = Object.freeze({
    background: '/assets/day/base-principale-fond-site-day.jpg',
    hero: '/assets/day/base-du-site-day.png',
    logo: '/assets/day/cook-note-day.png',
    appIcon: '/assets/day/cook-note-day.png'
  });
  const M = Object.freeze({ dark: N, light: OK ? J : N });
  const E = new Set();
  const valid = v => T.includes(v);
  const read = () => { try { return JSON.parse(g.localStorage?.getItem(S) || '{}'); } catch { return {}; } };
  const write = v => { try { g.localStorage?.setItem(S, JSON.stringify(v)); } catch {} };
  const sys = () => { try { return g.matchMedia?.('(prefers-color-scheme: light)').matches ? L : D; } catch { return D; } };
  const stored = () => { const v = read().theme; return valid(v) ? v : ''; };
  const resolve = v => valid(v) ? v : stored() || sys();
  const assets = v => M[resolve(v)] || N;
  const asset = (k, v) => assets(v)[k] || N[k] || '';
  const ver = u => {
    const v = g.COOK_NOTE_ASSET_VERSION;
    return u && v && !/\?v=/.test(u) ? `${u}?v=${v}` : u || '';
  };
  const abs = u => !u || /^https?:\/\//i.test(u) ? u || '' : `${g.location?.origin || 'https://cook-note.pages.dev'}${u}`;
  function art(t) {
    const d = g.document, r = d?.documentElement;
    if (!r) return;
    const a = assets(t), f = t === L && !OK;
    r.dataset.artDirection = t === L ? 'day' : 'night';
    r.dataset.artAssets = t === L && !OK ? 'night-fallback' : 'approved';
    r.style.setProperty('--art-background-image', f ? 'none' : `url("${a.background}")`);
    r.style.setProperty('--art-hero-image', f ? 'none' : `url("${a.hero}")`);
    r.style.setProperty('--art-logo-image', f ? 'none' : `url("${a.logo}")`);
    d.querySelectorAll?.('[data-art-asset]').forEach(e => {
      const k = e.getAttribute('data-art-asset'), u = a[k] || N[k];
      if (!u) return;
      const v = e.hasAttribute('data-art-versioned') ? ver(u) : u;
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
    const t = apply(sys());
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
