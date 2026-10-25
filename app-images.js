/* global window */

(function initCookNoteImages() {
  const IMAGE_HELPER_VERSION = 'v5.34';
  const IMAGE_HELPER_REVISION = 'parent-title';
  const IMAGE_MANIFEST = window.COOK_NOTE_IMAGE_MANIFEST || {};

  // Chaque JPG/PNG de ces dossiers a une copie AVIF (scripts/generate-avif.js,
  // verifiee par validate-avif). Le JPG reste le repli automatique.
  const AVIF_ELIGIBLE = /^\/assets\/(?:recipes\/(?:heroes|cards)|theme\/(?:dark|day)\/(?:recipes|categories|global))\/[^?]+\.(?:jpe?g|png)(?:\?.*)?$/i;
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
  function retryOriginalImage(img) {
    const original = img?.dataset?.originalSrc;
    if (!original || img.getAttribute('src') === original) return false;
    img.removeAttribute('srcset');
    img.src = original;
    return true;
  }

  function recipeCardImageUrl(image) {
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

  function imageSizeAttrs(image) {
    const meta = imageAssetMeta(image);
    return meta?.width && meta?.height ? { width: meta.width, height: meta.height } : {};
  }

  function imageSrcSet(image) {
    if (!image || !image.startsWith('/assets/recipes/heroes/')) return '';
    const card = recipeCardImageUrl(image);
    return card && card !== image ? `${preferredImageUrl(card)} 1x, ${preferredImageUrl(image)} 2x` : '';
  }

  function imageBackgroundStyle(image, card = true) {
    const url = card ? recipeCardImageUrl(image) : image;
    return url ? {
      backgroundImage: `${cssImageValue(url)}, linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, transparent), var(--surface-strong))`,
      backgroundColor: 'var(--surface-strong)'
    } : {};
  }

  window.CookNoteImages = Object.freeze({
    version: `${IMAGE_HELPER_VERSION}-${IMAGE_HELPER_REVISION}`,
    recipeCardImageUrl,
    imageSizeAttrs,
    imageSrcSet,
    imageBackgroundStyle,
    supportsAvif: SUPPORTS_AVIF,
    avifImageUrl,
    preferredImageUrl,
    cssImageValue,
    retryOriginalImage
  });
}());
