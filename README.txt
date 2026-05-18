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
les liens internes data-goto, les recipeId internes, la presence des images locales
et les multiplicateurs de quantites.
