# Modele vocal du mode mains libres

`vosk-model-small-fr-0.22.tar.gz` : modele francais leger de Vosk
(https://alphacephei.com/vosk/models, licence Apache 2.0), reconditionne en
`.tar.gz` (dossier `vosk-model-small-fr-0.22/` a la racine) pour vosk-browser.

- Charge par `app-kitchen.js` (`VOSK_MODEL_URL`) : en production depuis
  `raw.githubusercontent.com` (ce depot), en local depuis `/voice-model/`.
- Hors du build Cloudflare (`dist/`) : Cloudflare refuse les fichiers de plus
  de 25 Mo.
- Telecharge une seule fois par appareil, puis garde dans le navigateur
  (IndexedDB). La reconnaissance se fait sur l'appareil : le son n'est
  jamais envoye.
