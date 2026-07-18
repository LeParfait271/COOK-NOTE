/* global window */

(function initCookNoteImages() {
  const IMAGE_HELPER_VERSION = 'v3.55';
  const IMAGE_HELPER_REVISION = 'parent-title';
  const IMAGE_MANIFEST = window.COOK_NOTE_IMAGE_MANIFEST || {};

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

  function imageBackgroundStyle(image, card = true) {
    const url = card ? recipeCardImageUrl(image) : image;
    return url ? { backgroundImage: `url("${url}")` } : {};
  }

  window.CookNoteImages = Object.freeze({
    version: `${IMAGE_HELPER_VERSION}-${IMAGE_HELPER_REVISION}`,
    recipeCardImageUrl,
    imageSizeAttrs,
    imageBackgroundStyle
  });
}());
