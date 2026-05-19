Cook Note
=========

SITE PUBLIC
-----------

Cook Note est un carnet culinaire web avec :

- fiches parents pour regrouper les variantes d'une meme famille ;
- recettes consultables par saison, categorie, tags et recherche avancee ;
- panier de courses combine entre plusieurs recettes cochees ;
- mode cuisine avec checklist, progression et minuteurs d'etapes ;
- fiches techniques sur les familles importantes ;
- images servies depuis le projet dans assets/recipe-images/ ou assets/uploads/.
- regles projet centralisees dans COOK_NOTE_RULES.md.

ADMIN
-----

Le back-office est disponible sur :

   /admin

Il permet :

- creation, modification, duplication, suppression ;
- categories, saisons, difficulte, rendement, tags, video ;
- fiche parent et variantes ;
- ingredients groupes, etapes, notes et fiche technique ;
- import d'images vers assets/uploads/ ;
- sauvegarde automatique de recipes.js dans backups/ avant chaque ecriture.

Configurer le mot de passe avec :

   COOK_NOTE_ADMIN_PASSWORD

La variable historique MC_FOOD_ADMIN_PASSWORD reste acceptee.

Pour un environnement de developpement, admin.local.json peut aussi contenir :

   { "password": "mon-mot-de-passe" }

SCHEMA RECETTE
--------------

  recette_id: {
    title: 'Titre',
    categories: ['Desserts'],
    seasons: ['Toutes saisons'],
    difficulty: 'easy',
    yield: '4 portions',
    master: 'chantilly_maitre',
    variants: [{ id: 'chantilly_classique', label: 'Chantilly classique' }],
    masterType: 'collection',
    ingredients: [
      { group: 'Base', items: ['100 g farine', '2 oeufs'] }
    ],
    steps: ['Etape 1', 'Etape 2'],
    notes: ['Astuce ou lien HTML data-goto'],
    technical: [{ label: 'Texture', value: 'Point technique' }],
    image: '/assets/recipe-images/recette_id.jpg',
    video: 'https://youtube.com/...',
    tags: ['rapide', 'base']
  }

DEVELOPPEMENT
-------------

   npm run dev

Par defaut, le serveur ecoute sur :

   http://127.0.0.1:8080

Cette URL sert uniquement au test et au back-office pendant le developpement.

Pour la production, definir aussi :

   SITE_URL=https://ton-domaine.example

Cette URL est utilisee pour robots.txt, sitemap.xml et les URLs canoniques.
Pour generer les fichiers SEO statiques avant deploy :

   npm run generate:sitemap

Si Node n'est pas installe globalement sur Windows, le projet peut utiliser
le Node local place dans :

   .tools/node/current/

Dans ce cas, lancer plutot :

   powershell -ExecutionPolicy Bypass -File .\dev.ps1

VERIFICATION
------------

   npm run check

Ou avec le Node local du projet :

   powershell -ExecutionPolicy Bypass -File .\check.ps1

La verification controle la syntaxe JavaScript, les fiches parents, les variantes,
les liens internes data-goto, les recipeId internes, la presence des images locales,
les multiplicateurs de quantites, les regles Cook Note, le sitemap, le service worker
et les protections anti-regression.

AUDIT
-----

Pour un controle de fond sans bloquer le build :

   npm run audit:recipes

Le rapport est genere dans :

   reports/recipe-audit.md
   reports/recipe-audit.json

Il signale les fiches faibles, les idees de rangement, les liens internes pauvres
et les points a surveiller avant de gros ajouts.

REGLES RECETTES
---------------

Avant de modifier les donnees ou l'interface, lire :

   COOK_NOTE_RULES.md

Les conventions importantes y sont notees : arrondis au-dessus de 50g, vanille sans
dosage arbitraire, cassonade ou vergeoise, poivre du moulin, images validees,
conservations, liens techniques et production.
