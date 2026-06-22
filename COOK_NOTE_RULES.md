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
- Les cartes recette ne doivent pas afficher de badges ou tags automatiques au-dessus de l'image (`A l'avance`, `Base`, `Four`, etc.). Ces signaux restent internes pour la recherche et les menus, pas visuels sur les cartes.
- Le rangement des fiches doit suivre l'usage reel : `Toppings frites` = Accompagnements/Sauces, pas Plats ; `Oeufs mimosa` = Apero/Entrees ; `Legumes rotis au four` = Accompagnements/Entrees avec variantes ouvrables.
- Les recettes type coulis restent dans la fiche parent `Coulis` sous forme de variantes. Ne pas remettre les anciennes fiches individuelles `coulis_fraise`, `coulis_framboise`, `coulis_abricot_vanille`, `coulis_poire` ou `coulis_guide`.
- Quand une nouvelle recette sert de base ou de composant a une fiche deja presente, verifier les recettes consommatrices et ajouter un lien interne `<span data-goto="id_recette">nom</span>` plus `linkedRecipes`. Pour les dependances durables, ajouter un garde-fou dans `scripts/validate-recipes.js`.
- Garder un score de completude interne pour surveiller les fiches faibles : structure, securite, conservation, liens, tags, images et rangement.
- Allergenes : ne jamais confondre un moule de cuisson avec une moule coquillage. Les mots de materiel comme `beurrer le moule`, `moule a cake` ou `moule a tarte` ne doivent pas declencher `Mollusques`.

## Interface

- `Materiel necessaire` reste dans la fiche rapide en haut, pas dans la colonne de droite.
- La colonne droite s'appelle `Avant de commencer`.
- Sur mobile, les informations de la colonne droite doivent rester accessibles via l'onglet/encart mobile, pas via une fausse etape.
- Ne pas remettre la box d'actions des etapes ni le select inline `Choisir un bloc`.
- Ne pas remettre le bouton parent `Choisir une recette` dans le hero.
- Ne pas remettre l'ancien panneau de variante selectionnee : une carte de collection doit ouvrir directement la fiche recette normale.
- Les icones des boutons doivent rester coherentes, premium, et blanches quand elles sont sur des boutons sombres.
- Les passes design premium doivent ameliorer les composants existants sans rajouter de sections gadget sur l'accueil. Travailler surtout cartes, panneaux, boutons, etats hover/focus, responsive et performance.
- Le footer doit afficher le compteur catalogue automatique : fiches recettes servies + variantes inline. Ce compteur doit venir de `window.RECIPES`, jamais d'un nombre ecrit en dur.
- Le footer ne doit pas afficher l'annee dans une pilule separee : garder `Cook Note © 2026.` dans le texte d'identite, puis compteur et version uniquement dans les badges.
- Les boutons partager et imprimer du hero ne doivent apparaitre que sur les vraies fiches recettes servies, jamais sur les categories, collections ou fiches parentes.
- Sur mobile, les onglets de fiche `Ingredients / Etapes / Avant` ne doivent pas etre sticky pendant le scroll. Si un swipe change de panneau, afficher un indice discret visible sur mobile.
- Sur mobile, le swipe entre panneaux de fiche doit etre accroche a toute la vue recette, pas seulement a la grille centrale, pour fonctionner meme si le geste commence hors de la case.
- Les liens Techniques doivent centrer la carte visee, la faire clignoter assez longtemps, et garder le halo actif tant qu'on est sur la page.
- La recherche doit comprendre les intentions utilisateur courantes : rapide, sans cuisson, cuisson au four, friture, a preparer a l'avance, congelable, vegetarien, froid et ingredients proches.
- La recherche doit proposer un selecteur de difficulte qui filtre vraiment les resultats par score : facile 1-3, moyen 4-6, technique 7-10.
- Le mode menu doit rester un outil de decision direct : composer entree/plat/accompagnement ou sauce/dessert, ouvrir chaque fiche et ajouter le menu entier aux courses fusionnees.
- Mode menu : accords dessert obligatoires. Apres un plat lourd, cremeux, frit ou tres fromage, favoriser un dessert frais/citron/fruit. Apres un plat leger, un dessert plus gourmand peut etre propose.
- Mode menu soir de semaine : ne pas forcer de dessert. Si un dessert est propose, il doit etre ultra rapide, avec moins de 10 minutes d'actif.
- Mode menu : appliquer le registre `MENU_PAIRING_RULES` pour les accords professionnels. Les familles obligatoires sont : plat cremeux/fromage/moutarde avec accompagnement neutre ou vert ; interdiction des doubles sauces dominantes ; double feculent penalisant ; double creme/fromage penalisant ; tomate expressive interdite avec sauce cremeuse ; friture avec frais/acide ; poisson delicat sans chorizo/bacon/fromage fort ; epice avec element rafraichissant ; sucre-sale sans dessert trop riche ; plat riche avec dessert frais ; bistrot avec dessert simple, pas dessert technique ; ete frais sans gratin/friture/creme chaude ; apero sans vrai plat central ; semaine maximum trois fiches et charge active basse.
- Mode menu : le registre `MENU_PAIRING_RULES` doit contenir au moins 100 regles actives et couvrir aussi oeuf/mayo, ail/oignon cru, fume, fruits/noix, amertume, herbes, temperature chaud/froid, equipements repetes, pomme de terre/riz/pates/pain, legumes secs, champignons, crustaces, alcool, textures croquantes ou molles, viandes par familles et bases de dessert.
- Historique des menus : ne pas reproposer exactement la meme combinaison de recettes quand l'utilisateur demande un autre menu ou ajoute un menu aux courses.
- Mode menu : proposer un choix du nombre de personnes et appliquer ce facteur aux rendements affiches, au resume des courses et aux quantites envoyees dans la liste de courses.
- Mode menu : quand une fiche est ouverte depuis le menu, le bouton retour du navigateur doit rouvrir le meme mode menu avec son contexte, pas renvoyer l'utilisateur sur une page sans le menu.
- Le panier courses doit regrouper les noms proches sans perdre le sens : beurre doux/ramolli/fondu vers beurre, cassonade/vergeoise ensemble, huiles neutres ensemble, chocolat noir/lait/blanc separes.
- Liste de courses : mode `J’ai déjà` obligatoire pour retirer un ingredient de la liste a acheter sans supprimer la recette.
- Liste de courses : les rayons doivent rester proches d'un magasin reel : primeur, cremerie et oeufs, boucherie, poissonnerie, boulangerie, epicerie salee et epicerie sucree.
- Liste de courses : regrouper les familles proches quand c'est utile, par exemple citron/jus/zeste, oeufs/jaunes/blancs, ail, tomates, cremes et laitages.
- Liste de courses : afficher des quantites d'achat indicatives quand une conversion stable existe, par exemple briquette, plaquette, tablette, boite d'oeufs ou vrac.
- Export compact : le panier courses doit proposer une version courte copiable, organisee par rayons, pour SMS ou messagerie.
- Garder un registre de couverture des features : recherche, fiche recette, images, mode menu, liste de courses, techniques, anti-gaspillage et production doivent rester verifies automatiquement quand de nouvelles recettes arrivent.
- Les budgets performance doivent rester bloques par `npm run validate:performance` : poids shell, catalogues, manifest, miniatures cartes, images optimisees et masters non servis.
- L'admin d'ajout recette doit previsualiser l'impact d'une fiche avant sauvegarde : role menu, rayons de courses, allergenes probables, statut image, SEO et checks qualite.
- La detection des bases et composants doit rester generique et future-proof : bases, fonds, appareils, inserts, pates, cremes, sauces, marinades, sirops, toppings, condiments, pains et buns ne doivent pas etre proposes comme recettes servies seules.
- Le batch multi-recettes doit regrouper les gestes repetitifs quand ils sont detectables : zestes/jus, oeufs, herbes, ail/oignons/echalotes, beurre a sortir et prechauffage du four.
- Le dashboard de sante du catalogue doit rester disponible via `npm run audit:recipes` avec repartition des fiches pretes, a ameliorer, faibles, decouverte faible, securite/conservation, risque image et liens internes.
- L'audit visuel doit rester disponible via `npm run audit:images` avec priorites par type de probleme : miniature manquante, image faible, miniature faible, cadrage atypique et doublon visuel.

## Images

- Chaque recette feuille doit avoir une image locale unique. Pas de doublon d'image entre recettes feuilles.
- Aucune image recette ne doit venir du web ou pointer vers une URL externe. Les images recette ajoutees doivent etre generees ou validees localement, copiees dans `assets/recipe-images/`, optimisees, miniaturisees et auditees avant push.
- Les donnees recette ne doivent jamais contenir de champs publics de source, credit, attribution, imageSource, sourceUrl ou importedFrom. Les sources de travail restent hors catalogue.
- Les images recette ne doivent pas etre reutilisees visuellement : pas de meme fichier, pas de meme composition recadree/reteinte, pas de presque-doublon. `npm run validate:visual-images` doit bloquer les doublons exacts et les images trop similaires avant push.
- Les recettes doivent pointer vers les copies legeres dans `assets/recipe-images-optimized/`. Les PNG originaux dans `assets/recipe-images/` restent les masters et ne doivent pas etre supprimes.
- Le manifest `assets/image-manifest.js` doit etre genere via `npm run generate:image-manifest`, versionne avec le cache, et valide en CI. Les miniatures d'interface doivent utiliser `assets/recipe-card-images/` quand l'image n'est pas le hero ou une vraie image de partage.
- Chaque image optimisee referencee par une recette doit avoir une miniature homonyme dans `assets/recipe-card-images/`, sinon les cartes de l'accueil risquent d'afficher une image manquante.
- Quand une image recette est ajoutee ou modifiee, regenerer les copies optimisees avec `npm run optimize:images` avant de push.
- Les images doivent rester raccord au style Cook Note : sombre, gothique, nourriture lisible, ambiance cuisine/patisserie etrange, pas de texte dans l'image, pas de watermark.
- Une image recette doit representer le plat exact ou une variante visuelle evidente du plat. Une image jolie mais semantiquement fausse (falafels pour nems, boulettes pour rouleaux, dessert pour base, etc.) est une erreur bloquante.
- Les images recette ne doivent pas avoir un rendu vectoriel plat, cartoon ou a grands aplats : meme quand elles sont generees ou recadrees, elles doivent rester appetissantes, texturees et plausibles comme visuel culinaire.
- Quand une image visible est remplacee parce qu'elle etait fausse, moche, dessinee, dupliquee ou mal cadree, utiliser un nouveau nom de fichier stable pour contourner le cache image. Ne pas repointer la recette vers l'ancienne URL corrigee en place.
- Les ids, URLs et noms de fichiers de recettes ne doivent pas garder de trace de source externe, d'auteur, de blog ou de personne citee dans la source de travail. Utiliser un nom culinaire neutre et stable.
- L'audit image `npm run audit:images` doit rester disponible pour reperer images trop petites, miniatures faibles, cadrages atypiques et doublons visuels avant une passe photo.
- Avant d'integrer une image generee, montrer le visuel et attendre validation utilisateur, sauf validation deja donnee explicitement.
- Quand une image est validee, la copier dans `assets/recipe-images/` avec un nom stable lie a l'id recette.

## Production

- Toujours lancer le check complet avant commit : `powershell.exe -ExecutionPolicy Bypass -File .\check.ps1`.
- Avant un push visible, lancer le preflight quand la modification touche l'UI, les recettes, le cache, le service worker ou les images : `node scripts/preflight.js`.
- Les versions cache/site doivent etre synchronisees par `node scripts/bump-version.js --next` ou validees par `node scripts/validate-cache-version.js`.
- Pour quelques images seulement, utiliser `scripts/optimize-selected-images.ps1` avec des noms explicites, pas l'optimisation globale forcee qui peut modifier tout le catalogue de miniatures.
- Le preflight doit refuser les diffs image anormalement larges, sauf lot complet et equilibre master/optimisee/miniature qui passe `scripts/audit-images.js`. Il doit resynchroniser les catalogues, lancer les validations, demarrer un serveur local sur port libre et tester les assets critiques.
- Les scripts de validation doivent rester branches dans `npm run check`.
- Le domaine canonique public du site est `https://cook-note.pages.dev`. Ne pas remettre d'URL preview Cloudflare dans `index.html`, `robots.txt` ou `sitemap.xml`.
- Les librairies front critiques doivent rester locales dans `assets/vendor/`. Ne pas remettre React, ReactDOM, QRCode ou confetti via CDN dans `index.html`.
- Lancer `npm run audit:recipes` quand un gros lot de recettes ou de rangements change, puis lire `reports/recipe-audit.md`.
- Le service worker ne doit precacher que des assets existants. Les anciennes URLs ou images supprimees ne doivent jamais rester dans le sitemap ou le cache.
- Les pages HTML et les fichiers qui changent souvent doivent rester en reseau d abord avec cache de secours ; les images locales peuvent rester en cache-first.
- Les headers de production Cloudflare Pages doivent rester versionnes dans `_headers` : CSP stricte adaptee au site autonome, service worker et HTML en `no-cache`, JS/CSS/catalogues/manifest en cache court, images et vendors en immutable.
- Les routes statiques Cloudflare Pages doivent rester versionnees dans `_redirects` pour que `/recette/*` et `/techniques` rechargent directement l'app sans 404.
- Quand `app.js`, `recipes.js` ou `style.css` change, bump la version des assets dans `index.html` et `service-worker.js` pour eviter un melange de cache ancien/nouveau.
- A chaque push visible du site, augmenter la version affichee dans `SITE_VERSION` de `0.01`, mettre `SITE_UPDATED_AT` a la date du jour au format `JJ/MM/AA`, puis garder le footer au format `vX.XX / JJ/MM/AA`.
- Le mode cuisine et les boutons minuteurs ont ete supprimes. Ne pas recreer `focusMode`, `recipe-focus-mode`, `Mode cuisine`, `step-timer`, `timerEnd`, `timerLabel`, `cooking-step-card` ou `cooking-step-actions`.
- Si une regle est trop subjective pour etre testee automatiquement, elle doit au minimum etre ecrite ici et mentionnee dans le compte rendu.
