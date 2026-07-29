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
