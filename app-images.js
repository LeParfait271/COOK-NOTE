/* global window */

(function initCookNoteImages() {
  const IMAGE_HELPER_VERSION = 'v5.61';
  const IMAGE_HELPER_REVISION = 'parent-title';
  const IMAGE_MANIFEST = window.COOK_NOTE_IMAGE_MANIFEST || {};

  // Chaque JPG/PNG de ces dossiers a une copie AVIF (scripts/generate-avif.js,
  // verifiee par validate-avif). Le JPG reste le repli automatique.
  const AVIF_ELIGIBLE = /^\/assets\/(?:brand|recipes\/(?:heroes|cards)|theme\/(?:dark|day)\/(?:recipes|recipe-cards|categories|category-cards|global))\/[^?/]+\.(?:jpe?g|png)(?:\?.*)?$/i;
  // Illustration de theme pleine taille -> miniature de carte 800px
  // (scripts/generate-theme-cards.js).
  const THEME_ART = /^\/assets\/theme\/(dark|day)\/(recipes|categories)\//;
  const SUPPORTS_AVIF = (() => {
    try {
      return Boolean(window.CSS?.supports?.('background-image', 'image-set(url("/x.avif") type("image/avif"))'));
    } catch {
      return false;
    }
  })();

  function avifImageUrl(image) {
    return image && AVIF_ELIGIBLE.test(image) ? image.replace(/\.(?:jpe?g|png)(\?.*)?$/i, '.avif$1') : '';
  }

  function preferredImageUrl(image) {
    return (SUPPORTS_AVIF && avifImageUrl(image)) || image || '';
  }

  function imageMimeType(image) {
    return /\.png(?:\?.*)?$/i.test(image) ? 'image/png' : 'image/jpeg';
  }

  // Valeur CSS d'une image de fond : AVIF via image-set() quand il existe,
  // le navigateur retombe seul sur le JPG/PNG s'il ne sait pas le lire.
  function cssImageValue(image) {
    if (!image) return 'none';
    const avif = SUPPORTS_AVIF && avifImageUrl(image);
    return avif
      ? `image-set(url("${avif}") type("image/avif"), url("${image}") type("${imageMimeType(image)}"))`
      : `url("${image}")`;
  }

  // Repli d'une <img> servie en AVIF : on revient au fichier d'origine avant
  // tout autre repli. Renvoie true si une nouvelle source a ete essayee.
  // Une seule tentative par image : sinon, si le repli suivant echoue aussi,
  // l'image rebondirait sans fin entre deux sources (requetes en boucle).
  function retryOriginalImage(img) {
    const original = img?.dataset?.originalSrc;
    if (!original || img.dataset.originalRetried === 'true' || img.getAttribute('src') === original) return false;
    img.dataset.originalRetried = 'true';
    img.removeAttribute('srcset');
    img.src = original;
    return true;
  }

  function recipeCardImageUrl(image) {
    if (image && THEME_ART.test(image) && /\.jpe?g(?:\?.*)?$/i.test(image)) {
      return image.replace(THEME_ART, (match, theme, kind) => `/assets/theme/${theme}/${kind === 'recipes' ? 'recipe' : 'category'}-cards/`);
    }
    if (!image || !image.startsWith('/assets/recipes/heroes/')) return image;
    return image
      .replace('/assets/recipes/heroes/', '/assets/recipes/cards/')
      .replace(/\.(?:png|jpe?g|webp)(\?.*)?$/i, '.jpg$1');
  }

  function imageManifestKey(image) {
    return String(image || '').replace(/^\/+/, '').replace(/\?.*$/, '');
  }

  function imageAssetMeta(image) {
    return IMAGE_MANIFEST[imageManifestKey(image)] || null;
  }

  // Miniature de theme : absente du manifeste (charge au demarrage), ses
  // dimensions se deduisent de l'illustration source reduite a 800px de large.
  const THEME_CARD = /^\/?assets\/theme\/(dark|day)\/(recipe|category)-cards\//;
  const THEME_CARD_WIDTH = 800;

  function imageSizeAttrs(image) {
    const meta = imageAssetMeta(image);
    if (meta?.width && meta?.height) return { width: meta.width, height: meta.height };
    if (!THEME_CARD.test(String(image || ''))) return {};
    const source = imageAssetMeta(String(image).replace(THEME_CARD, (match, theme, kind) => `/assets/theme/${theme}/${kind === 'recipe' ? 'recipes' : 'categories'}/`));
    if (!source?.width || !source?.height) return {};
    const width = Math.min(source.width, THEME_CARD_WIDTH);
    return { width, height: Math.round(source.height * width / source.width) };
  }

  // Miniature 400px (AVIF seul, scripts/generate-theme-cards.js) d'une miniature
  // de theme 800px : cartes en ecran 1x et halos floutes. Sans AVIF : aucune.
  const THEME_CARD_FILE = /^(\/assets\/theme\/(?:dark|day)\/(?:recipe|category)-cards)\/([^/?]+)\.jpe?g(\?.*)?$/i;

  function smallCardImageUrl(cardImage) {
    const match = SUPPORTS_AVIF ? String(cardImage || '').match(THEME_CARD_FILE) : null;
    return match ? `${match[1]}-sm/${match[2]}.avif${match[3] || ''}` : '';
  }

  function imageSrcSet(image) {
    if (image && THEME_ART.test(image)) {
      const card = recipeCardImageUrl(image);
      const small = smallCardImageUrl(card);
      return small ? `${small} 400w, ${preferredImageUrl(card)} 800w` : '';
    }
    if (!image || !image.startsWith('/assets/recipes/heroes/')) return '';
    const card = recipeCardImageUrl(image);
    return card && card !== image ? `${preferredImageUrl(card)} 1x, ${preferredImageUrl(image)} 2x` : '';
  }

  // Bandeau de fiche : la miniature 800px (deja chargee comme apercu flou)
  // suffit aux ecrans etroits, la grande image (1400px) au-dela.
  function heroSrcSet(image) {
    if (!image || !THEME_ART.test(image) || !SUPPORTS_AVIF) return '';
    const card = recipeCardImageUrl(image);
    return card && card !== image ? `${preferredImageUrl(card)} 800w, ${preferredImageUrl(image)} 1400w` : '';
  }

  // Fond de carte : 400px en ecran 1x, 800px au-dela.
  function cardCssImageValue(cardImage) {
    const small = smallCardImageUrl(cardImage);
    return small
      ? `image-set(url("${small}") type("image/avif") 1x, url("${avifImageUrl(cardImage)}") type("image/avif") 2x)`
      : cssImageValue(cardImage);
  }

  // Halo flouté autour d'une carte : la petite miniature suffit toujours.
  function ambilightImageValue(cardImage) {
    const small = smallCardImageUrl(cardImage);
    return small ? `url("${small}")` : cssImageValue(cardImage);
  }

  // Fichier que le fond de carte chargera sur cet ecran (prechargement).
  function cardBackgroundUrl(cardImage) {
    const small = (window.devicePixelRatio || 1) <= 1 ? smallCardImageUrl(cardImage) : '';
    return small || preferredImageUrl(cardImage);
  }

  function imageBackgroundStyle(image, card = true) {
    const url = card ? recipeCardImageUrl(image) : image;
    return url ? {
      backgroundImage: `${card ? cardCssImageValue(url) : cssImageValue(url)}, linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, transparent), var(--surface-strong))`,
      backgroundColor: 'var(--surface-strong)'
    } : {};
  }

  window.CookNoteImages = Object.freeze({
    version: `${IMAGE_HELPER_VERSION}-${IMAGE_HELPER_REVISION}`,
    recipeCardImageUrl,
    imageSizeAttrs,
    imageSrcSet,
    heroSrcSet,
    imageBackgroundStyle,
    supportsAvif: SUPPORTS_AVIF,
    avifImageUrl,
    preferredImageUrl,
    cssImageValue,
    ambilightImageValue,
    cardBackgroundUrl,
    retryOriginalImage
  });
}());
