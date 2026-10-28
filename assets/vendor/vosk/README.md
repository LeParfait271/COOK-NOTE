# Vosk (reconnaissance vocale locale)

vosk-browser 0.0.8 (https://github.com/ccoreilly/vosk-browser, licence
Apache 2.0), prepare par `scripts/vendor-vosk.js` :

- `vosk.js` : la bibliotheque, chargee seulement a l'ouverture du mode mains
  libres ;
- `vosk-worker.js` : le worker WebAssembly, sorti du base64 de `vosk.js` pour
  etre servi comme fichier, avec sa propre politique de securite (seul
  fichier autorise a evaluer du code ; voir `_headers` et `server.js`).

Pour mettre a jour : `npm pack vosk-browser@<version>`, puis
`node scripts/vendor-vosk.js <package>/dist/vosk.js`.
