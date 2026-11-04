# Instructions agents Cook Note

## DEPOT DE TRAVAIL OFFICIEL (a ne jamais oublier)

Le seul depot de travail valide est `C:\COOK NOTE\COOK-NOTE v2`
(sous WSL/Linux : `/mnt/c/COOK NOTE/COOK-NOTE v2`).

C'est ce dossier qui est ouvert dans GitHub Desktop et pousse sur
`origin/main` (https://github.com/LeParfait271/COOK-NOTE.git).

NE JAMAIS travailler dans `/home/maruchiwa/projects/COOK-NOTE` ni dans
`C:\COOK NOTE\COOK-NOTE` (ancien) : ce sont des clones parasites. Toute
modification faite ailleurs n'arrive PAS chez l'utilisateur. Verifier le
chemin courant avant toute edition ou build.

Commit uniquement sur demande de l'utilisateur. Ne jamais push : l'utilisateur
pousse via GitHub Desktop. Ne jamais reconstruire l'APK sans demande explicite.

Avant toute action dans ce depot, lire `A_LIRE_EN_PREMIER.md`, puis
`COOK_NOTE_RULES.md`.

Ces deux fichiers sont prioritaires pour comprendre la methode, les autorisations,
les zones sensibles, les interdits, les validations et le workflow de production.
En cas de doute, suivre la regle la plus specifique et la plus prudente, puis
documenter le choix dans le compte rendu.

## RACCOURCI UTILISATEUR POUR AJOUTER DES RECETTES

Un message utilisateur contenant uniquement un ou plusieurs liens HTTP(S) vers
des pages de recettes signifie automatiquement : importer ces recettes dans
Cook Note, pas seulement les resumer ou les auditer.

Dans ce cas, ne demander aucune formule supplementaire. Lire puis appliquer
`docs/recipe-creation-workflow.md` et
`docs/visual-references/RECIPE_IMAGE_STYLE.md`, notamment le verrou de
classement, les variantes, les images jour/nuit, l'integration et les
validations. Ne poser une question que si la source est inaccessible ou si une
ambiguite culinaire persiste apres le verrou de classement.

## Proprete du dossier (automatique)

`scripts/clean-workspace.js` tourne apres chaque `npm run check` (postcheck) et
apres chaque build APK ; `npm run clean` le lance a la main.
- Fichiers temporaires (captures, essais, extraits) : uniquement dans `tmp/`
  (vide automatiquement, sauf `tmp/perf`) ou dans le dossier scratch de
  l'agent ; jamais a la racine du depot.
- Tests : Playwright ne garde les captures et traces que des tests en echec.
- Sauvegardes APK : les deux versions les plus recentes dans `backups/android`,
  une seule copie de l'APK par sauvegarde ; `old-keystore` n'est jamais touche.
- `downloads/` : l'APK courant et sa copie numerotee la plus recente.

## Commandes raccourcies (a utiliser plutot que les etapes a la main)

- `npm run verifier` : traduction des nouveaux textes, validation, tests,
  robot anglais, accessibilite et code mort, avec un resume final.
- `npm run recette` : tous les controles d'une fiche apres ajout ou modification.
- `npm run serveur` : reconstruit dist/ et relance le serveur local (8080).
- `npm run captures` : captures ordinateur/telephone, jour/nuit, accueil, fiche
  et chaque fenetre, dans tmp/captures/ (vide au prochain check).
- `npm run module -- app-nom.js` : enregistre un nouveau module partout.
- `npm run images` : regenere AVIF, cartes et manifeste apres ajout d'images.
- `npm run apk:version` / `npm run apk:publier` : version APK alignee sur le
  site, puis build et publication (sur demande explicite seulement).
- `npm run code:mort` : fonctions et scripts plus utilises.
- `npm run clean` : nettoyage manuel (deja automatique apres chaque check).
- `npm run hooks` : active les garde-fous de commit (cle DeepL, fichiers trop
  gros, JavaScript casse).