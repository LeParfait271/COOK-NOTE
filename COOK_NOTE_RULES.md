# Regles Cook Note

Ce fichier est la source de verite des conventions du site. Quand une nouvelle facon de faire est donnee, elle doit etre ajoutee ici dans le meme travail, puis transformee en validation automatique quand c'est possible.

## Methode obligatoire

- Lire ces regles avant de modifier les recettes, l'UI ou les images.
- Respecter les patterns existants du site avant d'inventer une nouvelle structure.
- Quand une convention utilisateur est nouvelle, faire trois choses : l'ajouter ici, ajouter une validation si elle peut etre testee, puis lancer le check complet.
- Ne pas demander de confirmation inutile. Demander seulement quand il faut valider une image, une operation destructive, ou une ambiguite impossible a resoudre proprement.
- Apres une modification terminee, lancer les checks disponibles, commit, puis push sur `main`.
- Regenerer le sitemap quand des recettes, ids, URLs ou fiches supprimables changent.

## Donnees recettes

- Quantites en grammes : au-dessus de `50g`, arrondir au multiple de `5g` le plus proche. Ne jamais laisser un `57g` ou equivalent dans une recette.
- Utiliser le systeme metrique. Pas de cups, oz ou tasses.
- Vanille et aromes : ne jamais donner de dosage numerique arbitraire pour l'arome vanille. Utiliser `vanille selon gout ou arôme vanille selon dosage indiqué sur la bouteille`. Les aromes ne se dosent pas tous pareil.
- Cassonade / vergeoise / sucre roux : toujours ecrire `cassonade ou vergeoise`.
- Poivre : ecrire `poivre du moulin`, sauf poivre nomme precis comme Timut, Sichuan, Kampot ou poivre en grains.
- Beurre pommade : quand une recette demande du beurre pommade ou ramolli, indiquer le repere utile `sortir le beurre environ 45 a 60min avant`, selon la temperature de la piece. Il doit etre souple, pas fondu.
- Cuilleres : les reperes de poids doivent preciser l'usage. Pour poudres et pates, considerer une cuillere rase. Pour les liquides, remplir au niveau. Le texte explicatif doit rester dans `Repere indicatif`, pas melange dans `Poids moyens`.
- Les poids moyens des cuilleres ou supports utiles doivent apparaitre dans la colonne `Avant de commencer` quand la recette contient ce type de mesure.
- Les notes ne doivent pas dupliquer les informations deja rangees automatiquement dans conservation, erreurs, resultat ou reperes.
- Les conservations doivent expliquer avant et apres cuisson quand c'est utile.
- Les techniques de cuisinier necessaires doivent etre presentes dans la page Techniques et liees automatiquement ou explicitement dans les recettes.
- Les recettes parentes ne doivent pas afficher de faux comptes ingredients/etapes de variante. Elles doivent rester des fiches de navigation.
- Les recettes listees dans une fiche parent doivent rester des fiches normales ouvrables avec leur propre URL `/recette/id`. La fiche parent sert de collection avec des liens, pas de selecteur de variante bloque dans le hero.
- Quand une recette utilise des groupes de preparation internes avec des cuissons ou methodes differentes, les etapes propres a chaque groupe doivent etre rangees sur ce groupe et l'interface doit afficher uniquement les etapes du groupe ouvert.
- La page d'accueil sans filtre doit rester un rangement propre par fiches parentes/collections. Ne pas afficher toutes les recettes enfants en vrac sur l'accueil par defaut.
- Sous le nom d'une carte recette, ne pas afficher le poids, le rendement ou les portions. Afficher seulement le nombre de variantes quand la fiche contient des variantes, sinon ne rien afficher.
- Le badge categorie des cartes recette doit afficher toutes les categories de la fiche, separees par ` / `, pas seulement la premiere categorie.
- Le rangement des fiches doit suivre l'usage reel : `Toppings frites` = Accompagnements/Sauces, pas Plats ; `Oeufs mimosa` = Apero/Entrees ; `Legumes rotis au four` = Accompagnements/Entrees avec variantes ouvrables.
- Les recettes type coulis restent dans la fiche parent `Coulis` sous forme de variantes. Ne pas remettre les anciennes fiches individuelles `coulis_fraise`, `coulis_framboise`, `coulis_abricot_vanille`, `coulis_poire` ou `coulis_guide`.
- Quand une nouvelle recette sert de base ou de composant a une fiche deja presente, verifier les recettes consommatrices et ajouter un lien interne `<span data-goto="id_recette">nom</span>` plus `linkedRecipes`. Pour les dependances durables, ajouter un garde-fou dans `scripts/validate-recipes.js`.
- Garder un score de completude interne pour surveiller les fiches faibles : structure, securite, conservation, liens, tags, images et rangement.

## Interface

- `Materiel necessaire` reste dans la fiche rapide en haut, pas dans la colonne de droite.
- La colonne droite s'appelle `Avant de commencer`.
- Sur mobile, les informations de la colonne droite doivent rester accessibles via l'onglet/encart mobile, pas via une fausse etape.
- Ne pas remettre la box d'actions des etapes ni le select inline `Choisir un bloc`.
- Ne pas remettre le bouton parent `Choisir une recette` dans le hero.
- Ne pas remettre l'ancien panneau de variante selectionnee : une carte de collection doit ouvrir directement la fiche recette normale.
- Les icones des boutons doivent rester coherentes, premium, et blanches quand elles sont sur des boutons sombres.
- Les passes design premium doivent ameliorer les composants existants sans rajouter de sections gadget sur l'accueil. Travailler surtout cartes, panneaux, boutons, etats hover/focus, responsive et performance.
- Les liens Techniques doivent centrer la carte visee, la faire clignoter assez longtemps, et garder le halo actif tant qu'on est sur la page.
- La recherche doit comprendre les intentions utilisateur courantes : rapide, sans cuisson, cuisson au four, friture, a preparer a l'avance, congelable, vegetarien, froid et ingredients proches.
- Le mode menu doit rester un outil de decision direct : composer entree/plat/accompagnement ou sauce/dessert, ouvrir chaque fiche et ajouter le menu entier aux courses fusionnees.
- Le panier courses doit regrouper les noms proches sans perdre le sens : beurre doux/ramolli/fondu vers beurre, cassonade/vergeoise ensemble, huiles neutres ensemble, chocolat noir/lait/blanc separes.

## Images

- Chaque recette feuille doit avoir une image locale unique. Pas de doublon d'image entre recettes feuilles.
- Les recettes doivent pointer vers les copies legeres dans `assets/recipe-images-optimized/`. Les PNG originaux dans `assets/recipe-images/` restent les masters et ne doivent pas etre supprimes.
- Chaque image optimisee referencee par une recette doit avoir une miniature homonyme dans `assets/recipe-card-images/`, sinon les cartes de l'accueil risquent d'afficher une image manquante.
- Quand une image recette est ajoutee ou modifiee, regenerer les copies optimisees avec `npm run optimize:images` avant de push.
- Les images doivent rester raccord au style Cook Note : sombre, gothique, nourriture lisible, ambiance cuisine/patisserie etrange, pas de texte dans l'image, pas de watermark.
- L'audit image `npm run audit:images` doit rester disponible pour reperer images trop petites, miniatures faibles, cadrages atypiques et doublons visuels avant une passe photo.
- Avant d'integrer une image generee, montrer le visuel et attendre validation utilisateur, sauf validation deja donnee explicitement.
- Quand une image est validee, la copier dans `assets/recipe-images/` avec un nom stable lie a l'id recette.

## Production

- Toujours lancer le check complet avant commit : `powershell.exe -ExecutionPolicy Bypass -File .\check.ps1`.
- Les scripts de validation doivent rester branches dans `npm run check`.
- Le domaine canonique public du site est `https://cook-note.pages.dev`. Ne pas remettre d'URL preview Cloudflare dans `index.html`, `robots.txt` ou `sitemap.xml`.
- Les librairies front critiques doivent rester locales dans `assets/vendor/`. Ne pas remettre React, ReactDOM, QRCode ou confetti via CDN dans `index.html`.
- Lancer `npm run audit:recipes` quand un gros lot de recettes ou de rangements change, puis lire `reports/recipe-audit.md`.
- Le service worker ne doit precacher que des assets existants. Les anciennes URLs ou images supprimees ne doivent jamais rester dans le sitemap ou le cache.
- Les pages HTML et les fichiers qui changent souvent doivent rester en reseau d abord avec cache de secours ; les images locales peuvent rester en cache-first.
- Quand `app.js`, `recipes.js` ou `style.css` change, bump la version des assets dans `index.html` et `service-worker.js` pour eviter un melange de cache ancien/nouveau.
- A chaque push visible du site, augmenter la version affichee dans `SITE_VERSION` de `0.01`, mettre `SITE_UPDATED_AT` a la date du jour au format `JJ/MM/AA`, puis garder le footer au format `vX.XX / JJ/MM/AA`.
- Le mode cuisine et les boutons minuteurs ont ete supprimes. Ne pas recreer `focusMode`, `recipe-focus-mode`, `Mode cuisine`, `step-timer`, `timerEnd`, `timerLabel`, `cooking-step-card` ou `cooking-step-actions`.
- Si une regle est trop subjective pour etre testee automatiquement, elle doit au minimum etre ecrite ici et mentionnee dans le compte rendu.
