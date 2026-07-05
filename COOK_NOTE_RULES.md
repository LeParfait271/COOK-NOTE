# Regles Cook Note

Ce fichier est la source de verite des conventions du site. Quand une nouvelle facon de faire est donnee, elle doit etre ajoutee ici dans le meme travail, puis transformee en validation automatique quand c'est possible.

## Methode obligatoire

- Lire `A_LIRE_EN_PREMIER.md` avant toute intervention sur le depot.
- Lire ces regles avant de modifier les recettes, l'UI ou les images.
- Respecter les lois qualite permanentes du garde-fou maitre : ne jamais degrader, reduire la dette technique, privilegier stabilite, securite, performance mesurable, documentation et validation continue.
- Respecter les patterns existants du site avant d'inventer une nouvelle structure.
- Quand une convention utilisateur est nouvelle, faire trois choses : l'ajouter ici, ajouter une validation si elle peut etre testee, puis lancer le check complet.
- Ne pas demander de confirmation inutile. Demander seulement quand il faut valider une image, une operation destructive, ou une ambiguite impossible a resoudre proprement.
- Apres une modification terminee, lancer les checks disponibles, commit, puis push sur `main`. Le push est le comportement normal apres validation OK, sauf demande explicite de pause ou blocage Git/reseau.
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
- Les poids moyens ingredient doivent respecter l'aliment exact : citron jaune et citron vert sont deux reperes distincts, `jus de citron vert` ne doit jamais utiliser le rendement d'un citron jaune, et les ingredients en piece comme `1 melon` doivent aussi declencher leur repere utile.
- La validation `scripts/validate-average-weights.js` doit rester branchee au `npm run check` pour couvrir toutes les fiches et la liste de courses.
- Oeufs durs : depart a froid obligatoire, cuisson `12 a 13min`, refroidissement immediat en fin de cuisson, puis ecaler les oeufs froids pour limiter la casse.
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

- Internationalisation site : tout texte visible hors donnees recettes doit
  passer par `i18n.js`, `CookNoteI18n.t/text` ou un attribut `data-i18n-*` sur
  les pages statiques. Les catalogues FR/EN doivent rester synchronises, les
  liens `hreflang` doivent rester presents, et `npm run validate:i18n` doit
  rester vert avant toute livraison. Ne jamais traduire approximativement le
  contenu culinaire : une traduction complete des recettes doit passer par des
  champs localises controles et valides recette par recette.
- `Materiel necessaire` reste dans la fiche rapide en haut, pas dans la colonne de droite.
- La colonne droite s'appelle `Avant de commencer`.
- Sur mobile, les informations de la colonne droite doivent rester accessibles via l'onglet/encart mobile, pas via une fausse etape.
- Ne pas remettre la box d'actions des etapes ni le select inline `Choisir un bloc`.
- Ne pas remettre le bouton parent `Choisir une recette` dans le hero.
- Ne pas remettre l'ancien panneau de variante selectionnee : une carte de collection doit ouvrir directement la fiche recette normale.
- Les icones des boutons doivent rester coherentes, premium, et blanches quand elles sont sur des boutons sombres.
- Les passes design premium doivent ameliorer les composants existants sans rajouter de sections gadget sur l'accueil. Travailler surtout cartes, panneaux, boutons, etats hover/focus, responsive et performance.
- Toute passe de direction artistique doit respecter `docs/design-system.md` : tokens communs, dark mode sombre equilibre, motion system `120ms / 200ms / 320ms`, focus visible permanent et support de `prefers-reduced-motion`.
- Themes site : le mode nuit est la reference et ne doit pas changer d'identite. Le mode jour est porte par `theme.js`, `data-theme`, `.theme-dark/.theme-light` et les tokens CSS. Toute nouvelle UI doit fonctionner dans les deux themes sans couleur hardcodee quand un token semantique existe. Le choix utilisateur doit rester instantane, sans rechargement, persiste dans `cook_note_preferences`, et `npm run validate:theme` doit bloquer les regressions.
- Direction artistique Jour/Nuit : `night` et `day` sont deux univers visuels du meme produit, pas une inversion CSS. Les composants gardent la meme UX et les memes tokens de structure ; seuls les tokens d'ambiance et les assets conditionnels changent. Les backgrounds, logos, hero, illustrations et visuels marketing doivent passer par `CookNoteTheme.asset` ou `data-art-asset`. Les assets jour restent en fallback nuit tant que l'utilisateur n'a pas valide les previews.
- Silent Design obligatoire : supprimer d'abord ce qui attire l'attention sans valeur avant d'ajouter un effet. Les passes premium doivent viser une interface filmee mais calme : Cinematic UI Engine, Magnetic Interaction Engine, Color Intelligence Engine, Breathing Layout Engine, Eye Tracking Simulator, Subconscious Quality Engine, Screenshot Test, Award Winning Design, First Impression Optimizer et Premium Value Perception, sans animations gadget ni surcharge visuelle.
- Les nouveaux styles UI doivent utiliser les tokens du design system pour couleurs, spacing, radius, ombres, typo et motion. Une valeur locale n'est acceptable que pour une mesure de layout non reutilisable.
- Les filtres de saison mobiles doivent rester en grille stable avec hauteurs tactiles constantes, jamais en flex row qui grossit ou change de rythme selon les libelles.
- Les actions de fiche recette doivent garder une hauteur commune entre boutons texte, boutons icones et selecteur de quantite pour eviter les micro-desalignements visibles.
- Le selecteur de quantite doit rester lisible et contraste dans le hero recette, meme apres les surcharges globales des champs de formulaire.
- Les cartes recette doivent garder un zoom hover court et leger : pas de transition image au-dela de `250ms`, pas de grossissement agressif qui fatigue le GPU ou donne une sensation de jank.
- Le footer doit afficher le compteur catalogue automatique : fiches recettes servies + variantes inline. Ce compteur doit venir de `window.RECIPES`, jamais d'un nombre ecrit en dur.
- Le footer ne doit pas afficher l'annee dans une pilule separee : garder `Cook Note © 2026.` dans le texte d'identite, puis compteur et version uniquement dans les badges.
- Les boutons partager et imprimer du hero ne doivent apparaitre que sur les vraies fiches recettes servies, jamais sur les categories, collections ou fiches parentes.
- Sur mobile, les onglets de fiche `Ingredients / Etapes / Avant` ne doivent pas etre sticky pendant le scroll. Si un swipe change de panneau, afficher un indice discret visible sur mobile.
- Sur mobile, le swipe entre panneaux de fiche doit etre accroche a toute la vue recette, pas seulement a la grille centrale, pour fonctionner meme si le geste commence hors de la case.
- Les liens Techniques doivent centrer la carte visee, la faire clignoter assez longtemps, et garder le halo actif tant qu'on est sur la page.
- La Lecture chef ne doit jamais deduire un service froid ou un signal proteine depuis une note de conservation, un accompagnement frais ou un dessert frais. Les plats chauds comme cassoulet, stew, saucisse-lentilles, dhal, pates au pesto ou cocotte doivent afficher un service chaud et ne jamais porter le signal `Froid`.
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
- Le panier courses doit regrouper les noms proches sans perdre le sens : beurre doux/ramolli/fondu vers beurre, cassonade/vergeoise ensemble, huiles neutres ensemble, chocolat noir/lait/blanc separes, citron jaune et citron vert separes quand la recette le demande.
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
- Les textes affiches doivent rester en UTF-8 sain; le site, le build et les apps gardent une reparation anti-mojibake et bloquent les caracteres suspects avant publication.
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
- Les images de direction artistique globale du mode jour (fond, hero, splash,
  logo, illustration) ne sont pas des images recette. Les stocker dans
  `assets/day/` seulement apres validation visuelle, avec un nom stable. Ne pas
  utiliser de filtre CSS, d'inversion automatique ou de duplication incoherente
  pour simuler le mode jour.
- Les overrides visuels recette par theme sont publies via `app-art-images.js` :
  mode jour dans `assets/day/`, mode nuit dans `assets/dark/`. Ce module doit
  rester versionne dans `index.html`, le service worker, le build `dist/` et les
  validateurs comme `app-images.js`.
- Les 8 fiches parents racine gardent leurs images `parent_*_moon`
  avec banniere en haut de l'image. Elles utilisent `recipe.image`
  en priorite, puis seulement l'image theme en fallback.
- Les sous-parents et collections peuvent utiliser les images parent theme
  validees quand elles existent (`assets/dark/recipe-*_maitre-dark.jpg`
  en mode nuit, `assets/day/recipe-*_maitre-day.jpg` en mode jour), puis
  `recipe.image` en fallback. Les images parent validees sont verrouillees
  par `scripts/validate-parent-art-lock.js` et ne doivent plus etre regenerees,
  recompressees ou remplacees sans demande explicite.

## Production

- Toujours lancer le check complet avant commit : `powershell.exe -ExecutionPolicy Bypass -File .\check.ps1`.
- L'app Android Legacy est un projet secondaire manuel avec parite site/app : quand une fonctionnalite visible du site, une recette, le catalogue ou l'UX concerne aussi l'usage tablette, porter en Native Lite pour tablette peu puissante dans le meme lot et lancer `npm run apps:update-all` avant commit/push. Exceptions : demande explicite web-only ou changement purement technique sans impact utilisateur Android, a justifier dans le compte rendu. Elle ne doit jamais etre branchee automatiquement a `npm run build`, `npm run check`, `npm run preflight`, `start` ou `dev`.
- Application Android unique : ne garder que `Android 5.0+` / `Cook Note Android 5.0+`. L'app Android HD/Modern est supprimee et ne doit pas revenir dans le footer, les scripts, les docs, les APK, le CSS ou les validateurs sans demande explicite.
- Mise a jour app obligatoire en workflow commun : quand l'app est mise a jour, passer par `npm run apps:update-all`, puis commit/push le lot complet. Le nom historique du workflow reste commun, mais il ne construit maintenant que l APK Android Legacy.
- Garde-fou app : le workflow ne construit maintenant que l APK Android Legacy.
- Qualite app : `Android 5.0+` reste Native Lite basse charge pour tablette ancienne, tout en gardant une direction native premium et lisible. Le site HD et les recettes ne doivent pas etre reduits pour cette app.
- L'app `Android 5.0+` peut reintegrer des fonctions utiles si elles restent natives et legeres : recherche simple sans filtres, recherche temporisee, index recherche precompile, mots recherche predecoupes, fuzzy sans split, allocations recherche reduites, cache resultats recherche borne, requetes recentes reutilisees, classement recherche memoise, catalogue parent precompile, enfants parents preclasses, compteurs collection caches, copie ingredients, selecteur de personnes, quantites ajustables, liste de courses locale, courses fusionnees, preferences locales discretes, theme jour/nuit natif, diagnostic hors ligne, cache image adaptatif, cache image normalise, decode image serialise, coalescence chargements image, chargements visibles coalesces, decodages visibles obsoletes ignores, images visibles prioritaires, file image prioritaire, annulation prefetch obsolete, nettoyage vues recyclees, vues image recyclees detachees, cibles image obsoletes liberees, images ecran detachees avant remplacement, prechargement images borne, prechauffage images differe, prechauffage visible apres scroll, annulation prechauffage en fling, prefetch ralenti hors inertie, position de grille conservee, liberation memoire de liste, pile retour bornee, scroll fluide, prefetch carte borne, copie fiche, ecran actif persistant, rattachements parents additionnels et bouton natif de mise a jour vers `downloads/cook-note-android-legacy.apk`. Ne pas les remplacer par WebView, React ou moteur web.
- Le nom Android installe doit afficher la version minimale : `Cook Note Android 5.0+`. Le bouton Android du footer doit afficher `Android 5.0+` comme label principal.
- Construire l'APK Android avec `npm run apps:update-all` quand la parite site/app l'exige ou sur demande explicite utilisateur. La commande `npm run android:legacy:update-apk` reste une sous-commande de diagnostic, pas un workflow de publication final. Le fonctionnement complet doit rester documente dans `docs/android-legacy-workflow.md` et `docs/apps-install-workflow.md`.
- L'installation Android du footer doit rester documentee dans `docs/apps-install-workflow.md` : `Android 5.0+`. Elle ouvre un panneau avec un lien primaire `github.com/LeParfait271/COOK-NOTE/raw/main/downloads/`, un lien secours `raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/` et la page GitHub du fichier. Le bouton principal utilise le nom APK versionne `cook-note-android-legacy-vX.YY.apk` derive de `ANDROID_LEGACY_APK_VERSION`; cette valeur doit toujours etre la meme version produit `X.YY` que `SITE_VERSION` et `cookNoteAndroidVersion`. L'alias stable `cook-note-android-legacy.apk` reste disponible pour les mises a jour depuis les apps anciennes.
- L'APK Android Legacy doit rester une app native Java Native Lite pour Android 5/tablettes 2 Go : pas de WebView systeme, pas de GeckoView ARMv7, pas de serveur HTTP local `127.0.0.1`, pas de React, pas de service worker et pas de dossier `assets/www`. Garder `minSdk 21`, une page d erreur native visible, `GridView` recyclee, `CookNoteRepository`, `ImageLoader`, un cache memoire limite et des images decodees en `RGB_565`. Les assets sont generes par `scripts/build-android-legacy-assets.js` dans `android-legacy/build/generated/cook-note-lite` : `recipes-lite.json` sans source externe, `images/` pour miniatures de grille `480px` max, `detail-images/` pour images de fiche `1280px` max, recompression `jpeg-js`, aucun asset web moderne brut.
- L'interface Android Legacy doit garder une lecture native claire et premium : accueil parent Android compact avec les fiches parents du site par defaut, grille `GridView` recyclee en cartes image 16/9 proches du site, header compact avec stats locales, recherche simple sans filtres avec bouton `Effacer`, recherche intelligente sans filtres sous le capot, recherche temporisee, index recherche precompile, mots recherche predecoupes, fuzzy sans split, allocations recherche reduites, cache resultats recherche borne, requetes recentes reutilisees, classement recherche memoise, catalogue parent precompile, enfants parents preclasses, compteurs collection caches, navigation restaurable, swipe retour bord gauche sur les vues detail, prechargement images borne, prechauffage images differe, prechauffage visible apres scroll, annulation prechauffage en fling, prefetch ralenti hors inertie, decode image serialise, coalescence chargements image, chargements visibles coalesces, decodages visibles obsoletes ignores, images visibles prioritaires, file image prioritaire, annulation prefetch obsolete, cache image normalise, nettoyage vues recyclees, vues image recyclees detachees, cibles image obsoletes liberees, images ecran detachees avant remplacement, position de grille conservee, liberation memoire de liste, pile retour bornee, scroll fluide, prefetch carte borne, fiches organisees en sections cadrees, hero de fiche encadre, infos rapides en pastilles allegees, fiche recette detaillee proche du site avec hero 16/9, actions utiles dans le hero, grille Ingredients/Etapes/Avant de commencer, ingredients en lignes lisibles, etapes numerotees, actions principales/secondaires visuellement distinguees, copie ingredients, selecteur de personnes, quantites ajustables, liste de courses locale avec courses cochables et courses fusionnees, preferences locales discretes, diagnostic hors ligne, cache image adaptatif, copie fiche, audit perf leger et ecran actif persistant. Les fiches detail Android ne doivent pas remettre saisons, difficulte, nombre d etapes, bouton favori ou bouton partager. `Avant de commencer` doit etre complet et derive des helpers de la fiche web : allergenes, materiel, poids moyens utiles, timing, recettes liees, repere cuilleres, conseils pratiques, notes restantes, conservation, rechauffage et fiche technique quand les donnees existent. Les fiches parents Android doivent afficher les recettes en grille de cartes parent visibles, avec des cartes parent 16/9 visibles comme le site, pas dans un menu deroulant. Les fiches a variantes internes doivent garder un selecteur natif de preparation choisie, pas afficher toutes les variantes a plat. Les fiches parents Android doivent lire `master` et `additionalMasters` pour respecter les rattachements parents additionnels du site. Ne pas remplacer cette mise en page par un rendu web, par de longs blocs texte bruts ou par des controles Android par defaut sans direction visuelle Cook Note.
- Publier l'APK Android sur GitHub Releases reste optionnel et uniquement sur demande explicite utilisateur avec `npm run apps:publish-all`. La commande `npm run android:legacy:publish-release` reste une sous-commande interne. Le script doit publier dans une release commune `apps-vX.YY`.
- Les copies APK telechargeables depuis le site sont autorisees uniquement dans `downloads/` apres workflow de parite site/app ou demande explicite de publication app. A chaque mise a jour app, garder ensemble l'alias stable `cook-note-android-legacy.apk` et la copie avec nom APK versionne `cook-note-android-legacy-vX.YY.apk`. Ne jamais les copier dans `dist/` : Cloudflare Pages limite chaque fichier public a 25 MiB. Les assets APK generes dans `android-legacy/build/generated/cook-note-lite/`, les dossiers Gradle/build et les autres fichiers `.apk`/`.aab` ne doivent pas etre versionnes. Le validateur `npm run validate:android` doit rester branche au check.
- Version produit unique obligatoire : `SITE_VERSION` (`vX.YY`), `cookNoteAndroidVersion` (`X.YY`) et `ANDROID_LEGACY_APK_VERSION` (`X.YY`) doivent rester alignes a chaque version publiee. `node scripts/bump-version.js --next` ou `node scripts/bump-version.js vX.YY` synchronise les trois sources, puis `npm run apps:update-all` reconstruit l APK de la meme version. Aucune publication site/app ne doit laisser deux numeros differents, meme pour un changement technique.
- Le workflow `npm run apps:update-all` doit supprimer les anciens `downloads/cook-note-android-legacy-v*.apk` et ne garder que l'alias stable plus l'APK versionne courant, sinon la CI peut echouer sur des APK obsoletes.
- La barre de fiche active / `recipe-command-dock` ne doit jamais etre sticky ni fixed : elle reste a sa place dans le flux et ne suit pas le scroll.
- Avant un push visible, lancer le preflight quand la modification touche l'UI, les recettes, le cache, le service worker ou les images : `node scripts/preflight.js`.
- Les versions cache/site doivent etre synchronisees par `node scripts/bump-version.js --next` ou validees par `node scripts/validate-cache-version.js`.
- Les scripts PowerShell qui lisent puis reecrivent des sources UTF-8 comme `app.js` doivent utiliser un encodage UTF-8 explicite en lecture et en ecriture. Ne jamais utiliser `Get-Content -Raw` suivi d'une reecriture sur ces fichiers, sinon les accents peuvent etre mojibakes.
- Les validateurs ne doivent pas porter la version de release courante en dur (`vX.YY`, date ou `?v=N`). Ils doivent deriver la version depuis `app.js` et laisser `scripts/validate-cache-version.js` verifier les assets reels.
- Pour quelques images seulement, utiliser `scripts/optimize-selected-images.ps1` avec des noms explicites, pas l'optimisation globale forcee qui peut modifier tout le catalogue de miniatures.
- Le preflight doit refuser les diffs image anormalement larges, sauf lot complet et equilibre master/optimisee/miniature qui passe `scripts/audit-images.js`. Il doit resynchroniser les catalogues, lancer les validations, demarrer un serveur local sur port libre et tester les assets critiques.
- Les scripts de validation doivent rester branches dans `npm run check`.
- Le site doit avoir un artefact de production reproductible via `npm run build`. La sortie publique est `dist/`, validee par `scripts/validate-dist.js`, et declaree pour Cloudflare Pages avec `pages_build_output_dir = "dist"`.
- Cloudflare Pages Git doit avoir `Build command: npm run build` et `Build output directory: dist`; si le log indique `No build command specified`, corriger le reglage Pages avant de relancer le deploiement.
- `dist/` est versionne comme artefact public Cloudflare Pages parce que le projet Pages actuel ne lance pas de build command. Il doit etre regenere par `npm run build` avant push, valide par `scripts/validate-dist.js`, et ne doit contenir ni admin, ni scripts, ni tests, ni rapports, ni PNG masters `assets/recipe-images/`. Les masters restent dans GitHub, les JPG optimises et miniatures sont les seuls visuels recette publies.
- Les modules runtime extraits de `app.js`, comme `app-images.js` et `app-art-images.js`, doivent etre charges avant `app.js`, versionnes dans `index.html` et `service-worker.js`, precaches, inclus dans `npm run check` et copies dans `dist/`.
- Les tests visuels Playwright doivent rester branches dans GitHub Actions via `npm run test:visual`, avec captures desktop/mobile en artefacts pour verifier l'accueil, une fiche directe, les images chargees, le texte decode et l'absence de debordement horizontal.
- Les tests visuels doivent rester compatibles avec la CSP stricte du site : ne pas utiliser `page.waitForFunction` ou une technique qui exige `unsafe-eval`.
- Les dependances Node doivent rester reproductibles : `package-lock.json` est versionne, GitHub Actions installe avec `npm ci --no-audit --no-fund`, et `@playwright/test` reste epingle sur une version compatible Node 20 tant que la CI utilise Node 20.
- La CI doit lancer `npm run audit:security` apres `npm ci` pour bloquer les vulnerabilites de dependances high/critical sans rendre le check local dependant du reseau.
- Le domaine canonique public du site est `https://cook-note.pages.dev`. Ne pas remettre d'URL preview Cloudflare dans `index.html`, `robots.txt` ou `sitemap.xml`.
- Les librairies front critiques doivent rester locales dans `assets/vendor/`. Ne pas remettre React, ReactDOM, QRCode ou confetti via CDN dans `index.html`.
- Lancer `npm run audit:recipes` quand un gros lot de recettes ou de rangements change, puis lire `reports/recipe-audit.md`.
- Le service worker ne doit precacher que des assets existants. Les anciennes URLs ou images supprimees ne doivent jamais rester dans le sitemap ou le cache.
- Les pages HTML et les fichiers qui changent souvent doivent rester en reseau d abord avec cache de secours ; les images locales peuvent rester en cache-first.
- Les images publiques immutables (`assets/recipe-card-images/`, `assets/recipe-images-optimized/`, logos et fonds) ne doivent pas etre rafraichies en arriere-plan a chaque lecture quand elles sont deja en cache. Le service worker doit retourner le cache directement pour limiter data, batterie et latence.
- Le service worker de production ne doit pas contenir de `console.log`, `console.warn` ou `console.error` runtime.
- Les headers de production Cloudflare Pages doivent rester versionnes dans `_headers` : CSP stricte adaptee au site autonome, service worker et HTML en `no-cache`, JS/CSS/catalogues/manifest en cache court, images et vendors en immutable.
- Les routes statiques Cloudflare Pages doivent rester versionnees dans `_redirects` pour que `/recette/*` et `/techniques` rechargent directement l'app sans 404. Les fallbacks SPA doivent cibler `/`, pas `/index.html`, et les recettes sans slash doivent rediriger en 301 vers l'URL canonique avec slash final, puis servir `/recette/<id>/index.html`, pour eviter les boucles detectees par Cloudflare Pages.
- Les routes admin qui modifient l'etat (`login`, `logout`, creation, edition, suppression, upload) doivent refuser les requetes avec un `Origin` different de l'hote courant afin de limiter les risques CSRF.
- La connexion admin doit limiter les echecs repetes par adresse et renvoyer `429` avec `Retry-After` quand le seuil est atteint.
- Les uploads admin doivent verifier l'extension et la signature binaire reelle des images (`jpg`, `png`, `webp`) avant ecriture dans `assets/uploads/`.
- Les pages admin doivent respecter la CSP locale sans domaine externe de fonts ou CDN.
- Quand `app.js`, `recipes.js` ou `style.css` change, bump la version des assets dans `index.html` et `service-worker.js` pour eviter un melange de cache ancien/nouveau.
- A chaque push visible du site, augmenter la version produit de `0.01`, mettre `SITE_UPDATED_AT` a la date du jour au format `JJ/MM/AA`, puis garder le footer au format `vX.XX / JJ/MM/AA`. La meme version produit doit aussi etre appliquee a l APK (`cookNoteAndroidVersion` et `ANDROID_LEGACY_APK_VERSION`). La numerotation reste sur deux chiffres apres le point : apres `v1.99`, passer a `v2.00`, puis `v2.01`, jamais `v1.100`.
- Readiness release : avant push, la livraison doit avoir un build reproductible, `check`, `preflight` si UI/cache/recettes/images changent, tests visuels si l'interface change, `dist/` regenere, cache/service worker coherent, headers/routes valides et rollback possible via le commit precedent.
- Le mode cuisine et les boutons minuteurs ont ete supprimes. Ne pas recreer `focusMode`, `recipe-focus-mode`, `Mode cuisine`, `step-timer`, `timerEnd`, `timerLabel`, `cooking-step-card` ou `cooking-step-actions`.
- Si une regle est trop subjective pour etre testee automatiquement, elle doit au minimum etre ecrite ici et mentionnee dans le compte rendu.
