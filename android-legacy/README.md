# Cook Note Android Legacy

Application `Cook Note Android 5.0+` : app native Java Native Lite pour les
tablettes anciennes (Android 5.0, 2 Go de RAM, CPU modeste), sans WebView
systeme ni GeckoView.

Le mode d'emploi complet est dans
[`docs/android-legacy-workflow.md`](../docs/android-legacy-workflow.md), les
regles dans `COOK_NOTE_RULES.md` (section 8).

## Principe

- `minSdkVersion 21`, package `fr.cooknote.legacy`.
- Catalogue local `recipes-lite.json` et images reduites (`480px` en grille,
  `960px` en fiche), generes par `scripts/build-android-legacy-assets.js` depuis
  le site.
- Theme nuit premium unique ; accueil sur les fiches parentes du site, cartes
  image 16/9, fiche detaillee proche du site (Ingredients / Etapes / Avant de
  commencer), recherche simple sans filtres.
- Fonctions natives legeres : quantites ajustables, copie des ingredients et de
  la fiche, liste de courses locale cochable et fusionnee, envoi de la liste vers
  un telephone par QR code, navigation restaurable, ecran actif persistant et
  bouton natif de mise a jour.
- Les optimisations memoire, image et recherche sont verifiees dans le code par
  `npm run validate:android`.

## Code

- `MainActivity.java` : cycle de vie, navigation, etat local et briques d'interface
  communes.
- `HomeScreen.java`, `RecipeScreen.java`, `ShoppingScreen.java` : les trois ecrans
  (accueil et recherche, fiche recette, courses), qui accedent a l'activite via
  `host`.
- `AppUpdater.java` : verification et installation des mises a jour.
- `CookNoteRepository.java`, `Recipe.java` : catalogue et recherche.
- `ImageLoader.java`, `RecipeAdapter.java` : images et grille.
- `ShoppingList.java` : contenu de la liste de courses (portions par recette,
  « J'ai deja », placard, fusion, texte, lien QR).
- `ShoppingItems.java` : lecture d'une ligne d'ingredient pour les courses, a
  l'identique du site (`app-shopping.js`) : cuilleres, pincees, pluriels,
  formats du commerce. Parite verifiee par `tmp/perf/shopping-parity.js`.
- Changement d'ecran : devoilement en cercle depuis le dernier toucher (effet
  inverse au retour), comme le site (`MainActivity.showScreen`).
- `QrCode.java` : encodeur QR natif (verifie par `npm run test:android-qr`).
- `Palette.java`, `Ui.java`, `Ingredients.java`, `Texts.java` : couleurs, fonds,
  quantites et petits formats de texte.

## Parite site/app et construction

Regle de parite site/app : une fonctionnalite visible du site utile sur tablette est portee en Native Lite
pour tablette peu puissante dans le meme lot ; le code reste pret a construire.
L'APK n'est construite que sur demande explicite de l'utilisateur :

```powershell
npm run apps:rebuild:check
npm run apps:rebuild
```

`npm run apps:update-all` reste le workflow commun historique. Outils manquants :
`npm run android:legacy:setup`. Publication GitHub Releases, sur demande
explicite : `npm run apps:publish-all`.

L'app telecharge ses mises a jour depuis l'alias stable :

```text
https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-legacy.apk
```

La cle de signature est hors Git dans `android-legacy/signing/` (a sauvegarder
hors du PC).
