// ============================================================
//  Cook Note - recipes.js
//  Genere par le back-office Cook Note. Modifier via /admin.
// ============================================================

window.RECIPES = {
  "coulis_maitre": {
    "title": "Coulis",
    "image": "/assets/recipe-images-optimized/coulis_maitre_v4_spooky.jpg",
    "categories": [
      "Sauces",
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "ingredients": [
      {
        "group": "Coulis de fraise",
        "items": [
          "500g fraises",
          "50 à 70g sucre",
          "15g jus de citron"
        ],
        "note": "Astuce cuisson 5 à 7min. Cuis peu et ajoute le citron en fin de cuisson pour garder une couleur bien rouge."
      },
      {
        "group": "Coulis de framboise",
        "items": [
          "500g framboises",
          "80 à 100g sucre",
          "15g jus de citron",
          "20g eau si besoin"
        ],
        "note": "Astuce cuisson 5min. Ne presse pas trop fort les pépins dans la passoire, sinon le coulis peut devenir amer."
      },
      {
        "group": "Coulis de mangue",
        "items": [
          "500g mangue mûre",
          "40 à 60g sucre",
          "15g jus de citron vert",
          "30 à 60g eau ou jus d’orange"
        ],
        "note": "Astuce cuisson 3 à 5min. La mangue épaissit beaucoup, ajuste toujours la texture après mixage."
      },
      {
        "group": "Coulis de pêche",
        "items": [
          "500g pêches mûres",
          "50 à 70g sucre",
          "15g jus de citron",
          "20 à 40g eau si besoin"
        ],
        "note": "Astuce cuisson 6 à 8min. Ajoute quelques gouttes de citron rapidement après découpe pour éviter l’oxydation."
      },
      {
        "group": "Coulis d’abricot",
        "items": [
          "500g abricots mûrs",
          "70 à 100g sucre",
          "15g jus de citron",
          "30 à 50g eau"
        ],
        "note": "Astuce cuisson 8 à 10min. L’abricot devient vite acide après cuisson, goûte toujours avant d’ajouter tout le citron."
      },
      {
        "group": "Coulis de myrtille",
        "items": [
          "500g myrtilles",
          "70 à 90g sucre",
          "10 à 15g jus de citron",
          "20g eau"
        ],
        "note": "Astuce cuisson 6 à 8min. La myrtille épaissit naturellement grâce à sa pectine, ne réduis pas trop."
      },
      {
        "group": "Coulis de mûre",
        "items": [
          "500g mûres",
          "90 à 110g sucre",
          "15g jus de citron",
          "20 à 30g eau"
        ],
        "note": "Astuce cuisson 6 à 8min. Filtre soigneusement, les pépins de mûre sont plus gênants que ceux de framboise."
      },
      {
        "group": "Coulis d’ananas",
        "items": [
          "500g ananas frais",
          "50 à 80g sucre",
          "10g jus de citron vert",
          "30 à 60g eau ou jus d’ananas"
        ],
        "note": "Astuce cuisson 8 à 10min. L’ananas est fibreux, un blender puissant donne un meilleur résultat qu’un mixeur plongeant."
      },
      {
        "group": "Coulis de kiwi",
        "items": [
          "500g kiwis mûrs",
          "60 à 90g sucre",
          "10g jus de citron vert"
        ],
        "note": "Astuce cuisson cru. Évite de cuire le kiwi longtemps, il perd sa couleur verte et peut devenir amer."
      },
      {
        "group": "Coulis de pomme",
        "items": [
          "500g pommes",
          "50 à 80g sucre",
          "15g jus de citron",
          "80 à 120g eau ou jus de pomme"
        ],
        "note": "Astuce cuisson 12 à 15min. La pomme donne plutôt une texture de compote fluide, détends bien après mixage pour obtenir un vrai coulis."
      }
    ],
    "steps": [
      "Règle générale préparer les fruits.",
      "Mettre les fruits en casserole avec le sucre et, selon le fruit, un peu d’eau ou de jus.",
      "Cuire doucement 5 à 10min, ou suivre le temps indiqué pour le fruit choisi.",
      "Ajouter le citron plutôt en fin de cuisson pour garder un goût frais.",
      "Mixer finement.",
      "Filtrer si besoin selon les pépins, fibres ou peaux.",
      "Ajuster la texture avec un peu d’eau ou de jus, puis corriger sucre et acidité.",
      "Refroidir rapidement et conserver au frais."
    ],
    "notes": [
      "Finition commune après refroidissement, vérifie toujours une texture nappante, un sucre présent mais pas dominant, une acidité assez vive pour réveiller le fruit, une bonne brillance et une conservation de 3 à 5 jours au frais ou en congélation par petites portions."
    ],
    "tags": [
      "coulis",
      "fruit",
      "sauce",
      "dessert",
      "base"
    ],
    "technical": [],
    "master": "sauces_maitre",
    "yield": "10 portions de coulis de fruit",
    "difficultyScore": 4,
    "variantGroups": true,
    "additionalMasters": [
      "cremes_maitre",
      "elements_base_maitre"
    ]
  },
  "chantilly_maitre": {
    "title": "Chantilly",
    "image": "/assets/recipe-images-optimized/chantilly_maitre_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
      {
        "id": "chantilly_classique",
        "label": "Chantilly classique"
      },
      {
        "id": "chantilly_gelatine",
        "label": "Chantilly stabilisée"
      }
    ],
    "ingredients": [
      {
        "group": "Choisir une variante",
        "items": [
          "Sélectionner la chantilly voulue dans les boutons de la fiche."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher la méthode adaptée."
    ],
    "notes": [
      "Fiche maître chantilly simple, riche ou stabilisée."
    ],
    "technical": [
      {
        "label": "Froid",
        "value": "Creme, bol et fouet bien froids avant montage."
      },
      {
        "label": "Tenue",
        "value": "Arreter des que la texture forme un bec souple a ferme selon l'usage."
      },
      {
        "label": "Sucre",
        "value": "Incorporer progressivement pour garder une bouche legere."
      }
    ],
    "master": "cremes_maitre"
  },
  "cremes_maitre": {
    "title": "Toppings et garnitures",
    "image": "/assets/recipe-images-optimized/cremes_maitre_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "masterType": "collection",
    "variants": [
      {
        "id": "chantilly_maitre",
        "label": "Chantilly"
      },
      {
        "id": "coulis_maitre",
        "label": "Coulis"
      },
      {
        "id": "creme_beurre_meringue_italienne",
        "label": "Crème au beurre meringue italienne"
      },
      {
        "id": "creme_citron_lemon_curd",
        "label": "Crème citron"
      },
      {
        "id": "creme_diplomate_vanille",
        "label": "Crème diplomate vanille"
      },
      {
        "id": "creme_diplomate_cloud",
        "label": "Crème diplomate vanille à garnir"
      },
      {
        "id": "mascarpone",
        "label": "Crème mascarpone vanille"
      },
      {
        "id": "creme_kinder_nutella",
        "label": "Crème Nutella à garnir"
      },
      {
        "id": "creme_patissiere_praline",
        "label": "Crème pâtissière praliné"
      },
      {
        "id": "creme_patissiere_vanille",
        "label": "Crème pâtissière vanille"
      },
      {
        "id": "creme_pistache",
        "label": "Crème pistache à garnir"
      },
      {
        "id": "creme_praline",
        "label": "Crème praliné"
      },
      {
        "id": "creme_amande_citron",
        "label": "Fond de tarte amande"
      },
      {
        "id": "compotee_citron",
        "label": "Marmelade citron"
      },
      {
        "id": "meringue_italienne",
        "label": "Meringue italienne"
      }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une variante pour afficher la recette."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher les étapes."
    ],
    "notes": [
      "Cette fiche regroupe les toppings, garnitures, chantillys, coulis et crèmes du carnet.",
      "Cliquer une variante pour afficher sa recette."
    ],
    "technical": [
      {
        "label": "Cuisson",
        "value": "Remuer constamment et stopper des que la creme epaissit franchement."
      },
      {
        "label": "Refroidissement",
        "value": "Filmer au contact pour eviter la peau et garder une texture lisse."
      },
      {
        "label": "Usage",
        "value": "Detendre au fouet avant pochage ou montage."
      }
    ],
    "master": "desserts_maitre"
  },
  "pates_bases_maitre": {
    "title": "Pâtes et bases pâtissières",
    "image": "/assets/recipe-images-optimized/pates_bases_maitre_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "masterType": "collection",
    "variants": [
      {
        "id": "pate_choux",
        "label": "Pâte à choux"
      },
      {
        "id": "pate_sucree",
        "label": "Pâte sucrée"
      }
    ],
    "ingredients": [
      {
        "group": "Choisir une variante",
        "items": [
          "Sélectionner la base ou le montage voulu dans les boutons de la fiche."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher la recette complète."
    ],
    "notes": [
      "Fiche maître bases techniques et montages liés."
    ],
    "technical": [
      {
        "label": "Temperature",
        "value": "Respecter le froid des matieres grasses et les temps de repos."
      },
      {
        "label": "Travail",
        "value": "Melanger juste ce qu'il faut pour eviter de corser les pates."
      },
      {
        "label": "Cuisson",
        "value": "Surveiller la coloration plutot que le minuteur seul."
      }
    ],
    "master": "elements_base_maitre"
  },
  "sauces_assaisonnements_maitre": {
    "title": "Sauces, pestos et assaisonnements",
    "image": "/assets/recipe-images-optimized/sauces_assaisonnements_maitre_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
      {
        "id": "aioli_citronne_leger",
        "label": "Aïoli citronné léger"
      },
      {
        "id": "balsamique_reduit",
        "label": "Balsamique réduit"
      },
      {
        "id": "harissa_maison",
        "label": "Harissa rouge"
      },
      {
        "id": "huile_pimentee_pizza",
        "label": "Huile pimentée pour pizza"
      },
      {
        "id": "marinades_guide",
        "label": "Marinades"
      },
      {
        "id": "mayonnaise_maison",
        "label": "Mayonnaise"
      },
      {
        "id": "pesto_tomates_sechees_sans_cajou",
        "label": "Pesto tomates séchées"
      },
      {
        "id": "pesto_variantes",
        "label": "Pestos"
      },
      {
        "id": "ricotta_fouettee",
        "label": "Ricotta fouettée"
      },
      {
        "id": "rouille_haut_de_gamme",
        "label": "Rouille"
      },
      {
        "id": "sauce_aigre_douce_vietnam",
        "label": "Sauce aigre-douce vietnamienne"
      },
      {
        "id": "sauce_aux_poivres",
        "label": "Sauce aux poivres"
      },
      {
        "id": "sauce_caramel",
        "label": "Sauce caramel"
      },
      {
        "id": "vinaigrette",
        "label": "Vinaigrette"
      }
    ],
    "ingredients": [
      {
        "group": "Choisir une variante",
        "items": [
          "Sélectionner la sauce ou l’assaisonnement voulu dans les boutons de la fiche."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher la recette complète."
    ],
    "notes": [
      "Fiche maître sauces froides, condiments, huiles et marinades."
    ],
    "technical": [
      {
        "label": "Equilibre",
        "value": "Verifier sel, acidite et gras en fin de preparation."
      },
      {
        "label": "Texture",
        "value": "Allonger par petites touches pour garder la concentration."
      },
      {
        "label": "Conservation",
        "value": "Filmer ou couvrir au contact quand la sauce attend."
      }
    ],
    "master": "sauces_maitre"
  },
  "tomates_maitre": {
    "title": "Tomates préparées",
    "image": "/assets/recipe-images-optimized/tomates_maitre_spooky.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Été",
      "Automne"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
      {
        "id": "tomates_variantes",
        "label": "Tomates confites et séchées"
      },
      {
        "id": "tomates_provencales",
        "label": "Tomates provençales"
      }
    ],
    "ingredients": [
      {
        "group": "Choisir une variante",
        "items": [
          "Sélectionner la préparation de tomates voulue dans les boutons de la fiche."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher la recette complète."
    ],
    "notes": [
      "Fiche maître préparations de tomates confites, séchées ou rôties."
    ],
    "technical": [
      {
        "label": "Maturite",
        "value": "Choisir des tomates parfumees et bien egoutter si elles rendent beaucoup d'eau."
      },
      {
        "label": "Assaisonnement",
        "value": "Saler progressivement et corriger l'acidite en fin de preparation."
      },
      {
        "label": "Usage",
        "value": "Adapter la coupe selon sauce, garniture ou dressage."
      }
    ],
    "master": "entrees_maitre"
  },
  "biscuits_gouters_maitre": {
    "title": "Biscuits, cookies et meringues",
    "image": "/assets/recipe-images-optimized/biscuits_gouters_maitre_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
      {
        "id": "cake_citron",
        "label": "Cake au citron"
      },
      {
        "id": "churros_maison",
        "label": "Churros"
      },
      {
        "id": "cookies_sucres_maitre",
        "label": "Cookies sucrés"
      },
      {
        "id": "macaron_ourea_pierre_herme",
        "label": "Macaron Ouréa"
      },
      {
        "id": "meringues",
        "label": "Meringues"
      }
    ],
    "ingredients": [
      {
        "group": "Choisir une variante",
        "items": [
          "Sélectionner le biscuit ou goûter voulu dans les boutons de la fiche."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher la recette complète."
    ],
    "notes": [
      "Fiche maître biscuits, cookies et petites préparations sucrées ou salées."
    ],
    "technical": [
      {
        "label": "Repos",
        "value": "Reposer la pate quand c'est indique pour une cuisson plus reguliere."
      },
      {
        "label": "Cuisson",
        "value": "Sortir legerement avant la texture finale, la chaleur residuelle termine le biscuit."
      },
      {
        "label": "Conservation",
        "value": "Stocker au sec apres refroidissement complet."
      }
    ],
    "master": "desserts_maitre"
  },
  "bases_salees_maitre": {
    "title": "Bases salées",
    "image": "/assets/recipe-images-optimized/bases_salees_maitre_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
      {
        "id": "ajitsuke_tamago_oeufs_marines_ramen",
        "label": "Ajitsuke tamago oeufs marinés ramen"
      },
      {
        "id": "beurre_ail",
        "label": "Beurre à l’ail"
      },
      {
        "id": "chapelure_parfumee",
        "label": "Chapelure parfumee"
      },
      {
        "id": "court_bouillon",
        "label": "Court-bouillon"
      },
      {
        "id": "pain_grille_beurre_ail_herbes",
        "label": "Pain grillé beurre ail et herbes"
      },
      {
        "id": "pain_hot_dog",
        "label": "Pain hot dog brioché"
      },
      {
        "id": "pains_burgers_brioche",
        "label": "Pains burgers briochés"
      },
      {
        "id": "pate_legere_beignets_calamar_crevettes",
        "label": "Pâte légère à frire"
      },
      {
        "id": "southern_biscuits",
        "label": "Southern biscuits"
      },
      {
        "id": "tempura_beignets_calamar_crevettes",
        "label": "Tempura"
      },
      {
        "id": "tortillas_mexicaines",
        "label": "Tortillas"
      }
    ],
    "ingredients": [
      {
        "group": "Choisir une variante",
        "items": [
          "Sélectionner la base salée ou l’accompagnement voulu dans les boutons de la fiche."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher la recette complète."
    ],
    "notes": [
      "Fiche parent pour les bases salées utiles dans plusieurs recettes."
    ],
    "technical": [
      {
        "label": "Assaisonnement",
        "value": "Gouter en fin de preparation, surtout apres reduction ou rotissage."
      },
      {
        "label": "Texture",
        "value": "Adapter coupe et cuisson a l'usage final de la base."
      },
      {
        "label": "Service",
        "value": "Garder les elements chauds separes si le dressage attend."
      }
    ],
    "master": "elements_base_maitre"
  },
  "beurre_ail": {
    "title": "Beurre à l’ail",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/beurre_ail_spooky.jpg",
    "categories": [
      "Base",
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 1,
    "yield": "environ 200g",
    "aliases": [
      "beurre ail",
      "beurre à l’ail",
      "beurre ail persil",
      "beurre compose ail"
    ],
    "tags": [
      "beurre",
      "ail",
      "persil",
      "base",
      "apero"
    ],
    "linkedRecipes": [
      {
        "id": "pain_grille_beurre_ail_herbes",
        "role": "Utilisation"
      }
    ],
    "ingredients": [
      {
        "group": "Beurre parfumé",
        "items": [
          "200g beurre doux ramolli",
          "20g ail haché très finement",
          "12g persil plat ciselé",
          "6g jus de citron",
          "3g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Sortir le beurre environ 45 à 60min avant pour obtenir une texture pommade, souple mais non fondue.",
      "Hacher l’ail très finement, puis ciseler le persil.",
      "Mélanger le beurre avec l’ail, le persil, le jus de citron, le sel fin et le poivre du moulin.",
      "Goûter et ajuster l’assaisonnement, puis transférer en petit pot ou rouler en boudin dans du papier cuisson.",
      "Réfrigérer au moins 30min pour raffermir avant de trancher ou tartiner."
    ],
    "notes": [
      "Parfait sur pain grillé, légumes rôtis, viande grillée, poisson, pommes de terre ou pâtes.",
      "Pour une version plus douce, blanchir l’ail 30 secondes dans l’eau frémissante puis bien l’égoutter avant de le hacher."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Le beurre doit être pommade assez souple pour incorporer les aromates, jamais fondu."
      },
      {
        "label": "Ail",
        "value": "Hacher très finement évite les morceaux crus agressifs à la dégustation."
      }
    ],
    "practical": {
      "equipment": [
        "Bol",
        "Spatule",
        "Couteau",
        "Petit pot ou papier cuisson"
      ],
      "storage": [
        "5 jours au réfrigérateur en pot hermétique.",
        "Congélation possible en portions pendant 2 mois."
      ],
      "mistakes": [
        "Ne pas faire fondre le beurre il perdrait son émulsion et figerait moins joliment."
      ],
      "result": [
        "Beurre parfumé, tartinable, bien ailé et frais grâce au persil."
      ]
    },
    "additionalMasters": [
      "apero_maitre"
    ]
  },
  "vinaigrette": {
    "title": "Vinaigrette",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/vinaigrette_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "environ 230g",
    "ingredients": [
      {
        "group": "Classique moutarde",
        "items": [
          "30g moutarde de Dijon",
          "45g vinaigre de vin rouge ou Xeres",
          "2g sel fin, 1g poivre du moulin",
          "150g huile (80g neutre + 70g olive)",
          "5g miel (option)"
        ],
        "steps": [
          "Fouetter moutarde, vinaigre, sel et poivre du moulin.",
          "Verser les huiles en filet pour emulsifier.",
          "Ajuster acidite et sel."
        ]
      },
      {
        "group": "Citron herbes",
        "items": [
          "45g jus de citron",
          "140g huile d olive douce",
          "10g moutarde de Dijon",
          "12g echalote ciselee",
          "10g herbes fraiches",
          "3g sel fin",
          "Poivre du moulin"
        ],
        "steps": [
          "Dissoudre sel dans citron et moutarde.",
          "Ajouter echalote et herbes.",
          "Monter avec huile en filet."
        ]
      },
      {
        "group": "Douce au cidre",
        "items": [
          "50g vinaigre de cidre",
          "145g huile neutre",
          "12g moutarde a l ancienne",
          "8g miel",
          "3g sel fin",
          "Poivre du moulin"
        ],
        "steps": [
          "Fouetter vinaigre, moutarde, miel, sel et poivre du moulin.",
          "Ajouter huile progressivement.",
          "Secouer avant service."
        ]
      },
      {
        "group": "Miel citron",
        "items": [
          "45g jus de citron",
          "120g huile d olive douce",
          "25g miel liquide",
          "10g moutarde de Dijon",
          "3g sel fin",
          "Poivre du moulin"
        ],
        "steps": [
          "Fouetter jus de citron, miel, moutarde, sel et poivre du moulin.",
          "Monter avec huile d olive en filet.",
          "Gouter : ajouter quelques gouttes de citron si la salade est riche."
        ]
      }
    ],
    "steps": [
      "Fouetter moutarde + vinaigre + sel / poivre du moulin (et miel).",
      "Verser les huiles en filet pour émulsionner.",
      "Goûter et ajuster."
    ],
    "notes": [
      "Ratio huile:acide 3:1 a 4:1 selon la salade.",
      "Les variantes sont rangees dans la fiche pour rester disponibles dans les prochaines salades.",
      "Conservation 5 a 7 jours au froid."
    ],
    "difficultyScore": 2,
    "variantGroups": true
  },
  "pesto_variantes": {
    "title": "Pestos",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/pesto_variantes_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "yield": "environ 180g par version",
    "ingredients": [
      {
        "group": "Version salade (citronnée)",
        "items": [
          "50g basilic",
          "40g parmesan râpé",
          "30g pignons grillés",
          "1 gousse d'ail",
          "45g huile d'olive",
          "45g huile neutre",
          "10g jus de citron",
          "Sel, poivre du moulin"
        ],
        "steps": [
          "Mixer basilic, parmesan, pignons grilles, ail, jus de citron et les deux huiles par impulsions courtes.",
          "Assaisonner avec sel et poivre du moulin, puis ajuster citron ou huile selon la texture.",
          "Utiliser aussitot en salade ou reserver sous une fine couche d huile."
        ]
      },
      {
        "group": "Version Genovese (traditionnelle)",
        "items": [
          "60g basilic Genovese",
          "30g pignons",
          "15g Parmigiano Reggiano",
          "15g Pecorino",
          "1 petite gousse d'ail",
          "100–120g huile d'olive EV",
          "2–3g sel"
        ],
        "steps": [
          "Piler ou mixer basilic Genovese, ail, pignons et sel sans chauffer la preparation.",
          "Ajouter Parmigiano, Pecorino et huile d olive progressivement jusqu a texture souple.",
          "Gouter, ajuster le sel, puis utiliser rapidement ou couvrir d huile au frais."
        ]
      }
    ],
    "steps": [
      "Version salade mixer basilic + pignons + ail + parmesan puis monter à l’huile et citron.",
      "Version Genovese piler ail + sel + pignons, ajouter le basilic puis les fromages et l’huile."
    ],
    "notes": [
      "Même fiche, 2 styles citronné (salades) ou traditionnel (pâtes/gnocchi).",
      "Conservation 2–4 j au froid, film au contact + fine couche d’huile."
    ],
    "difficultyScore": 3,
    "variantGroups": true,
    "aliases": [
      "pesto",
      "pestos",
      "pesto genovese"
    ]
  },
  "ricotta_fouettee": {
    "title": "Ricotta fouettée",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/ricotta_fouettee_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "environ 280g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g ricotta de qualité",
          "30g crème 35 %",
          "Sel fin, poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Égoutter la ricotta si elle rend beaucoup d'eau, puis la mettre dans un bol froid.",
      "Ajouter la crème et fouetter 2–3min jusqu'à texture lisse, brillante et aérée.",
      "Assaisonner avec sel fin et poivre du moulin, puis goûter avant de corriger.",
      "Réserver au froid jusqu'au dressage et ajouter l'huile, les herbes ou les garnitures au dernier moment."
    ],
    "notes": [
      "Zaatar + huile d'olive Citron confit + aneth Miel + piment d'Espelette Truffe 1–2 % huile de truffe.",
      "Conservation 2–3 j au froid."
    ],
    "difficultyScore": 2,
    "tags": [
      "ricotta",
      "dip",
      "fromage",
      "aperitif"
    ],
    "aliases": [
      "dip ricotta",
      "ricotta montee",
      "ricotta fouettee"
    ]
  },
  "balsamique_reduit": {
    "title": "Balsamique réduit",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/balsamique_reduit_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "environ 120g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g vinaigre balsamique IGP",
          "25–50g sucre (au goût)"
        ]
      }
    ],
    "steps": [
      "Verser le vinaigre balsamique dans une petite casserole à fond épais.",
      "Ajouter le sucre selon l'équilibre voulu, puis porter à léger frémissement.",
      "Mijoter 12–20min à feu doux jusqu'à texture nappante, en surveillant car la réduction épaissit vite.",
      "Couper le feu quand la réduction nappe la cuillère elle continuera à épaissir en refroidissant.",
      "Transvaser dans un pot propre et laisser refroidir avant de fermer."
    ],
    "notes": [
      "Variantes zeste d'orange, vanille, cacao, espresso, figue (filtrer).",
      "Conservation 2–3 mois au froid."
    ],
    "difficultyScore": 2,
    "tags": [
      "balsamique",
      "reduction",
      "sauce",
      "condiment"
    ],
    "aliases": [
      "creme balsamique",
      "reduction balsamique",
      "balsamique reduit"
    ]
  },
  "tomates_variantes": {
    "title": "Tomates confites et séchées",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/tomates_variantes_v4_spooky.jpg",
    "categories": [
      "Apéro",
      "Entrées",
      "Accompagnements"
    ],
    "seasons": [
      "Été",
      "Automne"
    ],
    "difficulty": "easy",
    "yield": "environ 1kg par version",
    "ingredients": [
      {
        "group": "Version séchées",
        "items": [
          "1kg tomates Roma",
          "Sel fin",
          "Thym",
          "Huile d'olive pour conservation"
        ],
        "steps": [
          "Préchauffer le four à 90–100°C, idéalement en chaleur tournante.",
          "Couper les tomates Roma en deux, saler légèrement côté chair, puis les poser face coupée vers le haut sur une plaque ou un plat de cuisson.",
          "Ajouter le thym, puis cuire 2h30 à 3h jusqu’à obtenir des tomates souples, fripées et bien concentrées, sans les brûler.",
          "Laisser refroidir, puis couvrir d’huile d’olive dans un bocal propre si elles sont préparées pour la conservation."
        ]
      },
      {
        "group": "Version confites",
        "items": [
          "1kg tomates cerises",
          "6g sel",
          "3g sucre",
          "4 gousses d'ail",
          "Branches de thym",
          "Huile d'olive"
        ],
        "steps": [
          "Préchauffer le four à 120°C.",
          "Couper les tomates cerises en deux, les disposer dans un plat de cuisson, puis ajouter le sel, le sucre, l’ail, le thym et un filet d’huile d’olive.",
          "Cuire 1h30 à 2h jusqu’à obtenir des tomates tendres et confites, encore juteuses, sans chercher à les sécher complètement.",
          "Laisser refroidir, puis conserver sous huile au frais dans un bocal propre si elles ne sont pas utilisées tout de suite."
        ]
      }
    ],
    "steps": [
      "Ouvrir le bloc Version séchées ou Version confites pour afficher les étapes adaptées.",
      "Surveiller la texture en fin de cuisson les séchées doivent être concentrées et souples, les confites tendres et encore juteuses.",
      "Refroidir puis conserver sous huile au frais si les tomates ne sont pas utilisées immédiatement."
    ],
    "notes": [
      "Séchées parfaites pour antipasti et salades.",
      "Confites idéales en bruschetta / pâtes."
    ],
    "difficultyScore": 4,
    "aliases": [
      "tomates au four",
      "tomates confites",
      "tomates séchées"
    ],
    "variantGroups": true,
    "additionalMasters": [
      "tomates_maitre",
      "accompagnements_maitre"
    ]
  },
  "huile_pimentee_pizza": {
    "title": "Huile pimentée pour pizza",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/huile_pimentee_pizza_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "environ 250g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g huile d'olive",
          "4 piments secs",
          "1 gousse d'ail écrasée",
          "Zeste de 1/2 citron (option)"
        ]
      }
    ],
    "steps": [
      "Chauffer 60–70°C 10min avec piments + ail + zeste, couvrir et infuser 24h.",
      "Filtrer."
    ],
    "notes": [
      "Variantes poivre de Sichuan, origan, paprika fumé.",
      "Conservation 1 mois au froid."
    ],
    "difficultyScore": 2
  },
  "legumes_rotis": {
    "title": "Légumes rôtis au four",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/legumes_rotis_v4_spooky.jpg",
    "categories": [
      "Accompagnements",
      "Entrées"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "repères pour 4 personnes",
    "variantGroups": true,
    "ingredients": [
      {
        "group": "Base commune",
        "items": [
          "600 à 800g légumes au choix",
          "25 à 35g huile d’olive ou huile neutre",
          "Sel fin",
          "Poivre du moulin",
          "Herbes, ail, paprika, curry ou thym selon le légume"
        ],
        "note": "Choisir un seul bloc de légumes ci-dessous pour afficher le repère de taille et de cuisson."
      },
      {
        "group": "Variante pomme de terre",
        "items": [
          "800g pommes de terre en dés de 2 à 3cm",
          "Cuisson 35 à 45min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante avec la plaque.",
          "Tailler les pommes de terre en des de 2 a 3cm, puis les enrober avec huile, sel, poivre du moulin et aromates.",
          "Etaler en une seule couche et rotir 35 a 45min, en retournant a mi-cuisson, jusqu au coeur tendre et aux bords dores."
        ]
      },
      {
        "group": "Variante patate douce",
        "items": [
          "700g patate douce en dés de 2 à 3cm",
          "Cuisson 25 à 35min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Tailler la patate douce en des de 2 a 3cm et l enrober d huile, sel, poivre du moulin et paprika ou thym.",
          "Rotir 25 a 35min en retournant delicatement a mi-cuisson, jusqu a coloration sans ecraser les morceaux."
        ]
      },
      {
        "group": "Variante carotte ou panais",
        "items": [
          "700g carottes ou panais en bâtonnets réguliers",
          "Cuisson 22 à 35min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Couper carottes ou panais en batonnets reguliers et bien les enrober d huile, sel, poivre du moulin et herbes.",
          "Rotir 22 a 35min, retourner a mi-cuisson et arreter quand les pointes sont caramelisees et le centre tendre."
        ]
      },
      {
        "group": "Variante betterave ou céleri-rave",
        "items": [
          "700g betterave ou céleri-rave en dés de 2 à 3cm",
          "Cuisson 30 à 45min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Tailler betterave ou celeri-rave en des de 2 a 3cm, puis assaisonner genereusement.",
          "Rotir 30 a 45min en retournant a mi-cuisson; prolonger si la pointe d un couteau resiste encore."
        ]
      },
      {
        "group": "Variante courge ou butternut",
        "items": [
          "700g courge ou butternut en dés de 2 à 3cm",
          "Cuisson 25 à 35min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Couper courge ou butternut en des de 2 a 3cm, enrober d huile, sel, poivre du moulin et epices douces.",
          "Rotir 25 a 35min, retourner a mi-cuisson et servir quand les aretes sont dorees et la chair fondante."
        ]
      },
      {
        "group": "Variante brocoli, chou-fleur ou choux de Bruxelles",
        "items": [
          "650g brocoli ou chou-fleur en sommités, ou choux de Bruxelles coupés en deux",
          "Cuisson 15 à 25min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Détailler brocoli ou chou-fleur en sommités, ou couper les choux de Bruxelles en deux, puis assaisonner.",
          "Rotir 15 a 25min, face coupee contre la plaque pour les choux, jusqu aux pointes grillees et au coeur juste tendre."
        ]
      },
      {
        "group": "Variante poivron, courgette ou aubergine",
        "items": [
          "700g poivron en lanières, courgette en quartiers ou aubergine en dés de 2 à 3cm",
          "Cuisson 18 à 35min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Tailler poivron en lanieres, courgette en quartiers ou aubergine en des de 2 a 3cm, puis enrober sans trop saler.",
          "Rotir 18 a 35min selon le legume, retourner une fois et sortir quand l eau de vegetation s est concentree."
        ]
      },
      {
        "group": "Variante potimarron",
        "items": [
          "700g potimarron brosse, graines retirees, peau conservee",
          "25g huile deolive",
          "2g quatre-epices, cumin ou paprika doux",
          "1 pincee piment deEspelette optionnel",
          "Cuisson 30 e 40min e 180eC chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four e 180eC chaleur tournante.",
          "Brosser le potimarron, leouvrir, retirer graines et filaments puis tailler en tranches, cubes ou grosses frites.",
          "Enrober avec huile, sel, poivre du moulin et epices choisies.",
          "etaler en une couche sur plaque et retir 30 e 40min selon la taille, jusquee chair tendre et bords dores."
        ]
      },
      {
        "group": "Variante oignon, fenouil ou poireau",
        "items": [
          "650g oignons ou fenouil en quartiers, ou poireaux en tronçons de 3 à 4cm",
          "Cuisson 20 à 35min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Couper oignons ou fenouil en quartiers, ou poireaux en troncons de 3 a 4cm, puis huiler legerement.",
          "Rotir 20 a 35min, retourner avec precaution et arreter quand les bords sont bien caramelises."
        ]
      },
      {
        "group": "Variante asperges, haricots verts ou champignons",
        "items": [
          "600g asperges parées, haricots verts bien secs ou champignons en gros quartiers",
          "Cuisson 10 à 18min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Parer les asperges, secher les haricots verts ou couper les champignons en gros quartiers, puis assaisonner.",
          "Rotir 10 a 18min seulement, en surveillant des 10min pour garder du relief et eviter le dessechement."
        ]
      },
      {
        "group": "Variante tomates rôties",
        "items": [
          "700g tomates Roma coupées en deux",
          "Cuisson 20 à 25min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Couper les tomates Roma en deux, assaisonner la face coupee avec huile, sel, poivre du moulin et thym.",
          "Rotir 20 a 25min face coupee vers le haut, jusqu au jus concentre et aux bords legerement fripes."
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 200°C chaleur tournante avec la plaque si tu veux une coloration plus nette.",
      "Ouvrir le bloc du légume choisi, puis tailler les morceaux au format indiqué pour garder un temps de cuisson fiable.",
      "Assaisonner avec huile, sel, poivre du moulin et aromates, puis bien enrober sans écraser les légumes.",
      "Étaler en une seule couche sur la plaque chaude, sans surcharger.",
      "Rôtir selon le temps indiqué dans le bloc choisi, retourner à mi-cuisson et prolonger jusqu’à coloration et tendreté.",
      "Servir aussitôt ou refroidir rapidement avant conservation."
    ],
    "notes": [
      "Plaque préchauffée = croûte plus nette.",
      "Conservation 4 j au réfrigérateur."
    ],
    "difficultyScore": 3,
    "tags": [
      "legumes",
      "four",
      "rôti",
      "accompagnement",
      "potimarron"
    ],
    "aliases": [
      "legumes au four",
      "legumes rotis",
      "accompagnement legumes",
      "potimarron au four"
    ],
    "additionalMasters": [
      "entrees_maitre"
    ]
  },
  "marinades_guide": {
    "title": "Marinades",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/marinades_guide_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "10 marinades pour 4 personnes",
    "ingredients": [
      {
        "group": "1) Méditerranéenne",
        "items": [
          "40g huile d'olive",
          "20g jus de citron",
          "2g zeste",
          "2g origan",
          "2g ail râpé",
          "Sel / poivre du moulin"
        ],
        "steps": [
          "Melanger huile d olive, jus et zeste de citron, origan, ail, sel et poivre du moulin.",
          "Enrober viande, poisson ou legumes puis laisser mariner 20min a 2h selon le produit.",
          "Egoutter legerement avant cuisson pour eviter que l ail brule."
        ]
      },
      {
        "group": "2) Teriyaki rapide",
        "items": [
          "40g sauce soja",
          "20g mirin",
          "10g sucre",
          "10g vinaigre de riz",
          "2g gingembre",
          "1g ail"
        ],
        "steps": [
          "Melanger sauce soja, mirin, sucre, vinaigre de riz, gingembre et ail.",
          "Laisser dissoudre le sucre, puis enrober la piece a mariner 20min a 1h.",
          "Cuire en surveillant la coloration car le sucre caramelise vite."
        ]
      },
      {
        "group": "3) Tandoori yaourt",
        "items": [
          "100g yaourt grec",
          "6g pâte tandoori ou 4g garam masala",
          "5g jus de citron",
          "2g ail",
          "2g gingembre",
          "Sel"
        ],
        "steps": [
          "Melanger yaourt grec, epices tandoori, citron, ail, gingembre et sel.",
          "Enrober la volaille ou les legumes et laisser mariner au frais 1 a 6h.",
          "Retirer l exces de marinade avant cuisson forte pour obtenir une belle coloration."
        ]
      },
      {
        "group": "4) BBQ fumé",
        "items": [
          "40g ketchup",
          "20g sauce soja",
          "10g miel",
          "10g vinaigre de cidre",
          "2g paprika fumé",
          "1g ail"
        ],
        "steps": [
          "Melanger ketchup, sauce soja, miel, vinaigre, paprika fume et ail.",
          "Badigeonner la piece et laisser mariner 30min a 2h.",
          "Cuire a chaleur moderee puis laquer en fin de cuisson pour eviter de bruler le miel."
        ]
      },
      {
        "group": "5) Chermoula",
        "items": [
          "40g huile d'olive",
          "20g jus de citron",
          "10g coriandre hachée",
          "10g persil",
          "2g cumin",
          "1g paprika",
          "1g ail"
        ],
        "steps": [
          "Melanger huile d olive, citron, coriandre, persil, cumin, paprika et ail.",
          "Enrober poisson, legumes ou volaille et laisser mariner 20min a 1h.",
          "Cuire sans trop egoutter pour garder le parfum des herbes."
        ]
      },
      {
        "group": "6) Citron-herbes volaille",
        "items": [
          "40g huile neutre",
          "20g jus de citron",
          "5g moutarde",
          "herbes fraîches",
          "Sel / poivre du moulin"
        ],
        "steps": [
          "Melanger huile neutre, jus de citron, moutarde, herbes fraiches, sel et poivre du moulin.",
          "Enrober la volaille et laisser mariner 30min a 4h au frais.",
          "Egoutter legerement puis cuire jusqu a coeur juteux et surface doree."
        ]
      },
      {
        "group": "7) Porc miel-moutarde",
        "items": [
          "40g miel",
          "20g moutarde",
          "10g sauce soja",
          "10g vinaigre",
          "1g ail"
        ],
        "steps": [
          "Melanger miel, moutarde, sauce soja, vinaigre et ail.",
          "Enrober le porc et laisser mariner 1 a 6h au frais.",
          "Cuire a feu modere en retournant souvent pour ne pas bruler le miel."
        ]
      },
      {
        "group": "8) Mexicaine",
        "items": [
          "40g huile",
          "20g jus de citron vert",
          "2g cumin",
          "2g paprika",
          "1g piment",
          "1g ail"
        ],
        "steps": [
          "Melanger huile, citron vert, cumin, paprika, piment et ail.",
          "Enrober viande, crevettes ou legumes et laisser mariner 20min a 2h.",
          "Cuire a feu vif pour marquer, puis finir plus doucement si les morceaux sont epais."
        ]
      },
      {
        "group": "9) Thaï citronnelle",
        "items": [
          "40g huile",
          "10g nuoc-mâm",
          "10g jus de citron vert",
          "2g citronnelle hachée",
          "1g sucre",
          "piment"
        ],
        "steps": [
          "Melanger huile, nuoc-mam, citron vert, citronnelle, sucre et piment.",
          "Enrober poisson, poulet ou legumes et laisser mariner 20min a 1h.",
          "Cuire rapidement et finir avec un trait de citron vert si besoin."
        ]
      },
      {
        "group": "10) Légumes balsamique",
        "items": [
          "40g huile d'olive",
          "20g balsamique",
          "2g miel",
          "1g ail",
          "Thym"
        ],
        "steps": [
          "Melanger huile d olive, balsamique, miel, ail et thym.",
          "Enrober les legumes avant cuisson en gardant une couche fine.",
          "Rotir ou griller; remuer a mi-cuisson et surveiller la caramelisation du balsamique."
        ]
      }
    ],
    "steps": [
      "Choisir la marinade selon l'aliment et mélanger tous les ingrédients dans un bol propre.",
      "Enrober l'aliment, couvrir et placer au réfrigérateur pendant le temps adapté.",
      "Compter 30min pour poisson ou crevettes, 2–4h pour volaille, 6–12h pour porc ou bœuf.",
      "Égoutter avant cuisson forte pour éviter que l'excès de liquide brûle ou empêche la coloration.",
      "Jeter la marinade qui a touché le cru, ou la porter franchement à ébullition si elle doit devenir une sauce."
    ],
    "notes": [
      "Ne pas réutiliser la marinade crue porter à ébullition si sauce.",
      "Conservation marinades prêtes 7 j au froid."
    ],
    "difficultyScore": 3,
    "variantGroups": true,
    "tags": [
      "marinade",
      "viande",
      "poisson",
      "legumes"
    ],
    "aliases": [
      "marinades rapides",
      "marinade",
      "guide marinades"
    ]
  },
  "cookies_sales_variantes": {
    "title": "Cookies salés",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/cookies_sales_variantes_v4_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "18–20 pièces",
    "ingredients": [
      {
        "group": "Base commune",
        "items": [
          "150g farine",
          "75g beurre doux mou",
          "55g œuf (1 œuf moyen)",
          "2g levure chimique",
          "Sel, poivre du moulin"
        ]
      },
      {
        "group": "Variante jambon-fromage",
        "items": [
          "100g jambon en dés",
          "100g fromage râpé",
          "15g moutarde à l’ancienne (option)"
        ],
        "steps": [
          "Preparer la pate a cookies sales de base, puis incorporer les des de jambon, le fromage rape et la moutarde si utilisee.",
          "Former des boules regulieres et refroidir 20 a 30min pour limiter l etalement.",
          "Cuire jusqu aux bords dores et au centre encore tendre, puis laisser tiedir sur plaque avant de deplacer."
        ],
        "note": "Astuce garde les dés de jambon assez petits pour que les cookies se tiennent bien."
      },
      {
        "group": "Variante comté",
        "items": [
          "120g comté râpé"
        ],
        "steps": [
          "Preparer la pate a cookies sales de base, puis incorporer le comte rape sans trop travailler.",
          "Former les cookies et refroidir 20 a 30min pour garder une forme epaisse.",
          "Cuire jusqu a legere coloration et laisser reposer 5min sur plaque pour que le fromage se stabilise."
        ],
        "note": "Astuce utilise un comté bien râpé pour une répartition régulière dans la pâte."
      }
    ],
    "steps": [
      "Crémer beurre puis incorporer l’œuf.",
      "Ajouter farine + levure + assaisonnement, puis les ingrédients de la variante choisie.",
      "Former des boules, aplatir à 1cm et cuire 12–15min à 180°C."
    ],
    "notes": [
      "Conservation 3 j boîte hermétique."
    ],
    "difficultyScore": 4,
    "variantGroups": true
  },
  "pancakes_variantes": {
    "title": "Pancakes",
    "master": "petit_dejeuner_maitre",
    "image": "/assets/recipe-images-optimized/pancakes_variantes_v4_spooky.jpg",
    "categories": [
      "Petits-déjeuners"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "10–12 pancakes",
    "ingredients": [
      {
        "group": "Base sèche",
        "items": [
          "250g farine",
          "40g sucre",
          "10g levure chimique",
          "3g sel"
        ]
      },
      {
        "group": "Version lait",
        "items": [
          "110g œufs (2 œufs moyens)",
          "300g lait",
          "40g beurre fondu"
        ],
        "steps": [
          "Fouetter les oeufs avec le lait, puis ajouter le beurre fondu tiede.",
          "Verser sur les ingredients secs et melanger juste assez pour garder une pate epaisse.",
          "Cuire les pancakes sur poele chaude graissee, retourner quand les bulles percent la surface."
        ]
      },
      {
        "group": "Version babeurre",
        "items": [
          "110g œufs (2 œufs moyens)",
          "300g babeurre",
          "40g beurre fondu"
        ],
        "steps": [
          "Fouetter les oeufs avec le babeurre, puis ajouter le beurre fondu tiede.",
          "Verser sur les ingredients secs et melanger peu pour garder le moelleux du babeurre.",
          "Cuire a feu moyen; retourner quand les bords se tiennent et que le dessus bulle."
        ]
      },
      {
        "group": "Babeurre (si besoin)",
        "items": [
          "250g lait entier",
          "10g jus de citron ou vinaigre",
          "Repos 10min"
        ],
        "recipeId": "babeurre_maison"
      }
    ],
    "steps": [
      "Mélanger les ingrédients secs.",
      "Ajouter les liquides de la version choisie et mélanger juste assez (pas trop travailler).",
      "Repos 10min puis cuisson en petites louches sur poêle beurrée."
    ],
    "notes": [
      "Pour la version babeurre préparer le <span data-goto=\"babeurre_maison\">babeurre</span> 10min avant.",
      "Conservation pâte 4h au froid pancakes cuits 2 j filmés."
    ],
    "difficultyScore": 3,
    "aliases": [
      "pancakes",
      "babeurre"
    ],
    "variantGroups": true
  },
  "chocolat_ancien": {
    "title": "Chocolat chaud à l'ancienne",
    "master": "petit_dejeuner_maitre",
    "image": "/assets/recipe-images-optimized/chocolat_ancien_v4_spooky.jpg",
    "categories": [
      "Petits-déjeuners"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "4 mugs (250ml)",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "500g lait entier",
          "100g crème",
          "120g chocolat noir 66–70 %",
          "20g sucre",
          "1 pincée sel"
        ]
      }
    ],
    "steps": [
      "Chauffer le lait, la crème, le sucre et le sel dans une casserole sans faire bouillir fort.",
      "Ajouter le chocolat noir haché hors du feu et laisser fondre 1min.",
      "Fouetter puis remettre sur feu doux jusqu'à texture chaude et bien homogène.",
      "Mixer quelques secondes pour émulsionner et obtenir une mousse fine.",
      "Servir aussitôt dans des mugs chauds."
    ],
    "notes": [
      "Épaissir 5–8g maïzena diluée.",
      "Conservation 2 j au froid."
    ],
    "difficultyScore": 3,
    "tags": [
      "chocolat",
      "boisson",
      "chaud",
      "petit-déjeuner"
    ],
    "aliases": [
      "chocolat chaud",
      "chocolat chaud",
      "boisson chocolat"
    ]
  },
  "chantilly_classique": {
    "title": "Chantilly classique",
    "master": "chantilly_maitre",
    "image": "/assets/recipe-images-optimized/chantilly_classique_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "environ 270g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g crème 35 % très froide",
          "20–30g sucre glace"
        ]
      }
    ],
    "steps": [
      "Placer bol, fouet et crème au froid pour faciliter le montage.",
      "Verser la crème très froide dans le bol et fouetter progressivement.",
      "Quand la crème commence à épaissir, ajouter le sucre glace en pluie.",
      "Arrêter au bec d'oiseau la chantilly tient mais reste souple et lisse.",
      "Utiliser rapidement ou garder au froid en poche ou bol filmé."
    ],
    "notes": [
      "Parfums vanille, cacao, café, coco (1–2 %).",
      "→ Version plus stable <span data-goto=\"mascarpone\">Chantilly mascarpone</span> ou <span data-goto=\"chantilly_gelatine\">Chantilly gélatine</span>",
      "Conservation 24h au froid maximum."
    ],
    "difficultyScore": 3,
    "tags": [
      "chantilly",
      "creme",
      "dessert",
      "base"
    ],
    "aliases": [
      "creme chantilly",
      "chantilly",
      "chantilly classique"
    ]
  },
  "mascarpone": {
    "title": "Crème mascarpone vanille",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/mascarpone_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "~500g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g mascarpone",
          "200g crème entière froide",
          "60g sucre glace",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
        ]
      }
    ],
    "steps": [
      "Lisser mascarpone, sucre glace et vanille.",
      "Ajouter la crème froide.",
      "Fouetter jusqu’à pics fermes."
    ],
    "notes": [
      "Texture plus dense, très stable.",
      "Idéal pour un fourrage rapide.",
      "Dosage fourrage 30–40g par donut."
    ],
    "tags": [
      "creme",
      "mascarpone",
      "vanille",
      "rapide",
      "stable"
    ],
    "difficultyScore": 3
  },
  "chantilly_gelatine": {
    "title": "Chantilly stabilisée",
    "master": "chantilly_maitre",
    "image": "/assets/recipe-images-optimized/chantilly_gelatine_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "environ 280g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g crème 35 % très froide",
          "25g sucre glace",
          "3g gélatine"
        ]
      }
    ],
    "steps": [
      "Hydrater gélatine 10min fondre dans 30g de crème chaude mélanger au reste froid refroidir 20–30min.",
      "Monter au fouet serrer au sucre en fin."
    ],
    "notes": [
      "Tenue 24–36h en poche."
    ],
    "difficultyScore": 4
  },
  "creme_diplomate_vanille": {
    "title": "Crème diplomate vanille",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_diplomate_vanille_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "~700g",
    "ingredients": [
      {
        "group": "Pâtissière",
        "items": [
          "250g lait",
          "50g jaunes d’œufs",
          "60g sucre",
          "25g Maïzena",
          "25g beurre",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
        ],
        "recipeId": "creme_patissiere_vanille"
      },
      {
        "group": "Chantilly",
        "items": [
          "200g crème 30–35 % froide",
          "20g sucre glace"
        ],
        "recipeId": "chantilly_classique"
      }
    ],
    "steps": [
      "Cuire la pâtissière jusqu’à épaississement, ajouter le beurre, filmer au contact puis refroidir.",
      "Monter la chantilly en texture souple.",
      "Lisser la pâtissière froide, puis incorporer la chantilly délicatement."
    ],
    "notes": [
      "Dosage fourrage 30–40g par donut.",
      "Texture attendue légère, stable et propre.",
      "Met à jour la recette existante de crème diplomate vanille."
    ],
    "tags": [
      "creme",
      "diplomate",
      "vanille",
      "fourrage",
      "donut"
    ],
    "difficultyScore": 6
  },
  "choux_craquelin": {
    "title": "Choux au craquelin",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/choux_craquelin_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "18–22 choux",
    "ingredients": [
      {
        "group": "Craquelin",
        "items": [
          "50g beurre",
          "60g cassonade ou vergeoise",
          "60g farine"
        ]
      },
      {
        "group": "Pâte à choux",
        "items": [
          "125g lait",
          "125g eau",
          "100g beurre",
          "5g sel",
          "150g farine T55",
          "250g œufs (env. 5)"
        ]
      },
      {
        "group": "Garnissage",
        "items": [
          "Crème diplomate vanille ou chantilly"
        ]
      }
    ],
    "steps": [
      "Abaisser craquelin 2mm, détailler disques.",
      "Réaliser pâte à choux pocher Ø 3–4cm couvrir d'un disque de craquelin.",
      "Cuire 170–175°C 35–40min ventilé sec.",
      "Refroidir, garnir."
    ],
    "notes": [
      "Conservation coques 3 j à température ambiante dans boîte hermétique garnis 24h au froid.",
      "→ Recette de garnissage <span data-goto=\"creme_diplomate_vanille\">Crème diplomate vanille</span>",
      "→ Version allégée <span data-goto=\"chantilly_gelatine\">Chantilly stabilisée</span>",
      "Crèmes à garnir <span data-goto=\"creme_diplomate_vanille\">Crème diplomate vanille</span> · <span data-goto=\"creme_diplomate_cloud\">Crème diplomate vanille à garnir</span> · <span data-goto=\"creme_patissiere_vanille\">Crème pâtissière vanille</span> · <span data-goto=\"creme_patissiere_praline\">Crème pâtissière praliné</span> · <span data-goto=\"creme_kinder_nutella\">Crème Nutella à garnir</span> · <span data-goto=\"creme_pistache\">Crème pistache à garnir</span> · <span data-goto=\"creme_praline\">Crème praliné</span> · <span data-goto=\"mascarpone\">Crème mascarpone vanille</span> · <span data-goto=\"chantilly_gelatine\">Chantilly stabilisée</span>."
    ],
    "difficultyScore": 7
  },
  "meringues": {
    "title": "Meringues",
    "master": "biscuits_gouters_maitre",
    "image": "/assets/recipe-images-optimized/meringues_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "20–30 petites meringues",
    "ingredients": [
      {
        "group": "Appareil",
        "items": [
          "200g blancs d'œufs (à température ambiante)",
          "200g sucre semoule",
          "200g sucre glace tamisé"
        ]
      }
    ],
    "steps": [
      "Monter les blancs à vitesse moyenne jusqu'à texture mousseuse.",
      "Ajouter progressivement le sucre semoule en fouettant jusqu'à obtenir une meringue brillante et ferme.",
      "Incorporer délicatement le sucre glace tamisé à la maryse.",
      "Pocher les meringues sur une plaque recouverte de papier cuisson.",
      "Cuire 2 à 3h à 90–100°C jusqu'à ce qu'elles soient sèches et se décollent facilement.",
      "Laisser refroidir dans le four éteint, porte entrouverte."
    ],
    "notes": [
      "Des blancs \"vieillis\" montent mieux.",
      "Cuisson longue = meringues bien sèches et stables.",
      "Conservation 2 semaines sans perte de texture."
    ],
    "difficultyScore": 4,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "court_bouillon": {
    "title": "Court-bouillon",
    "master": "bases_salees_maitre",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "≈ 1 litre (pour pocher 4–6 portions)",
    "image": "/assets/recipe-images-optimized/court_bouillon_spooky.jpg",
    "ingredients": [
      {
        "group": "Légumes & aromates",
        "items": [
          "1 poireau",
          "2 carottes",
          "1 oignon",
          "2 branches de céleri",
          "1 botte de persil",
          "2 branches de thym",
          "¼ feuille de laurier",
          "1 clou de girofle",
          "5 grains de poivre"
        ]
      },
      {
        "group": "Liquides",
        "items": [
          "2 verres de vin blanc sec (≈ 30cl)",
          "50cl eau",
          "Sel"
        ]
      }
    ],
    "steps": [
      "Éplucher le poireau, les carottes et l'oignon. Laver le céleri et les herbes.",
      "Couper le poireau en quatre dans la longueur et l'attacher avec les branches de céleri et le laurier pour former le bouquet garni.",
      "Couper les carottes en quatre dans la longueur. Piquer l'oignon avec le clou de girofle.",
      "Dans une cocotte, placer le bouquet garni, les carottes, l'oignon, le vin blanc et 50cl d'eau. Saler et ajouter du poivre du moulin.",
      "Porter à ébullition puis laisser cuire 20min à frémissement.",
      "Laisser refroidir, puis placer au frais avant utilisation."
    ],
    "notes": [
      "Base aromatique pour pocher poissons, crustacés, légumes ou volailles.",
      "Idéal pour pocher poissons (cabillaud, saumon, sole), crustacés, légumes ou volailles.",
      "Astuce ajouter un trait de vinaigre blanc ou de jus de citron pour les crustacés.",
      "Base possible pour des plats mijotés, sauces et pochages aromatiques.",
      "Conservation 3–4 j au froid se congèle très bien 2–3 mois (en portions de 250ml)."
    ],
    "difficultyScore": 2
  },
  "donuts_cloud": {
    "title": "Beignets Cloud",
    "master": "desserts_maitre",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "12–14 beignets de 60–70g",
    "image": "/assets/recipe-images-optimized/donuts_cloud_spooky.jpg",
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "250g farine T45 ou T55",
          "25g sucre",
          "3g sel",
          "10–12g levure fraîche",
          "50g œuf",
          "140g lait",
          "25g beurre",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
        ]
      },
      {
        "group": "Friture",
        "items": [
          "Huile neutre à 160–165°C"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "120g sucre semoule ou sucre glace",
          "30–40g crème par pièce si fourré"
        ]
      }
    ],
    "steps": [
      "La veille prélever 40g de lait, tiédir à 25–30°C, dissoudre la levure fraîche.",
      "Mélanger farine, sucre, sel et vanille. Ajouter œuf, reste du lait, mélange levure et beurre fondu tiède ou mou.",
      "Pétrir 8–10min jusqu’à pâte lisse, souple et légèrement collante. Couvrir 15min.",
      "Bouler, placer en bol légèrement huilé, laisser 30–45min à température ambiante.",
      "Couvrir et mettre au froid 12–18h.",
      "Le lendemain sortir 1h avant.",
      "Dégazer légèrement, bouler à 60–70g avec une surface bien tendue.",
      "Apprêt 1h à 1h 30. L’empreinte du doigt doit remonter lentement.",
      "Frire à 160–165°C, 2min 30 à 3min par face, 2–3 pièces maximum à la fois.",
      "Rouler dans le sucre à chaud, saupoudrer de sucre glace tiède ou froid, ou fourrer quand les beignets sont tièdes ou froids."
    ],
    "notes": [
      "Ne jamais fourrer chaud.",
      "Trou sur le côté, douille longue, 30–40g de crème.",
      "Stopper quand le beignet devient légèrement gonflé et lourd.",
      "Huile trop chaude extérieur foncé et cœur insuffisamment cuit.",
      "Huile trop froide beignets gras.",
      "Apprêt insuffisant mie dense.",
      "Sur-apprêt beignets qui retombent.",
      "Résultat attendu mie aérée et filante, extérieur finement doré, cuisson à cœur sans sécheresse.",
      "Crèmes à garnir <span data-goto=\"creme_diplomate_vanille\">Crème diplomate vanille</span> · <span data-goto=\"creme_diplomate_cloud\">Crème diplomate vanille à garnir</span> · <span data-goto=\"creme_patissiere_vanille\">Crème pâtissière vanille</span> · <span data-goto=\"creme_patissiere_praline\">Crème pâtissière praliné</span> · <span data-goto=\"creme_kinder_nutella\">Crème Nutella à garnir</span> · <span data-goto=\"creme_pistache\">Crème pistache à garnir</span> · <span data-goto=\"creme_praline\">Crème praliné</span> · <span data-goto=\"mascarpone\">Crème mascarpone vanille</span> · <span data-goto=\"chantilly_gelatine\">Chantilly stabilisée</span>."
    ],
    "technical": [
      {
        "label": "Conversion levure",
        "value": "1g de levure sèche équivaut à environ 3g de levure fraîche. Pour cette recette, 10–12g de levure fraîche correspondent à environ 3–4g de levure sèche."
      }
    ],
    "difficultyScore": 7
  },
  "creme_diplomate_cloud": {
    "title": "Crème diplomate vanille à garnir",
    "master": "cremes_maitre",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "Garniture pour 12–14 donuts ou 18–22 choux",
    "image": "/assets/recipe-images-optimized/creme_diplomate_cloud_spooky.jpg",
    "ingredients": [
      {
        "group": "Crème pâtissière",
        "items": [
          "250g lait entier",
          "50g jaunes d'œufs (≈ 3 jaunes)",
          "60g sucre",
          "25g maïzena",
          "25g beurre doux",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
        ],
        "recipeId": "creme_patissiere_vanille"
      },
      {
        "group": "Chantilly",
        "items": [
          "200g crème liquide entière (30–35 %) très froide",
          "20g sucre glace"
        ],
        "recipeId": "chantilly_classique"
      },
      {
        "group": "Variante mascarpone (rapide)",
        "items": [
          "250g mascarpone",
          "200g crème liquide entière",
          "60g sucre glace",
          "Vanille"
        ]
      }
    ],
    "steps": [
      "— CRÈME PÂTISSIÈRE —",
      "Chauffer le lait avec la vanille (gratter la gousse si entière) jusqu'à frémissement.",
      "Dans un bol, fouetter les jaunes + sucre jusqu'à blanchiment. Ajouter la maïzena, bien mélanger.",
      "Verser le lait chaud en filet sur le mélange en fouettant constamment pour éviter la coagulation.",
      "Remettre dans la casserole, cuire à feu moyen en remuant sans arrêt jusqu'à épaississement net (environ 1–2min après reprise de l'ébullition).",
      "Hors du feu, incorporer le beurre en morceaux. Filmer immédiatement au contact (le film touche la crème) et refroidir complètement au réfrigérateur (minimum 2h).",
      "— CHANTILLY —",
      "Fouetter la crème bien froide avec le sucre glace jusqu'à texture souple mais qui tient (bec d'oiseau ferme).",
      "— ASSEMBLAGE (crème diplomate) —",
      "Fouetter la pâtissière froide pour la détendre et la lisser. Incorporer la chantilly délicatement à la spatule en 2–3 fois (ne pas écraser les bulles d'air).",
      "— FOURRAGE DONUTS —",
      "Faire un petit trou sur le côté de chaque donut tiède ou froid. Mettre la crème en poche avec une douille longue. Pocher 30–40g de crème par donut — arrêter dès qu'il devient légèrement plus lourd.",
      "— VARIANTE MASCARPONE (si pressé) —",
      "Fouetter mascarpone + crème + sucre glace + vanille jusqu'à texture ferme. Prêt en 3 minutes, très stable, excellente tenue."
    ],
    "notes": [
      "Ne jamais fourrer des donuts chauds la crème fond et coule.",
      "→ Recette des donuts <span data-goto='donuts_cloud'>Donuts Cloud-like (pousse lente)</span>",
      "→ Recette des choux <span data-goto='choux_craquelin'>Choux au craquelin</span>",
      "→ Version pâtissière seule <span data-goto='creme_diplomate_vanille'>Crème diplomate vanille (recette de base)</span>",
      "Conservation pâtissière seule 48h au froid. Diplomate assemblée 24h au froid. Mascarpone 36–48h au froid.",
      "Congélation possible pour la pâtissière seule (avant incorporation chantilly) — 1 mois. Fouetter à nouveau après décongélation."
    ],
    "difficultyScore": 6
  },
  "paris_brest": {
    "title": "Paris-Brest",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/paris_brest_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "hard",
    "yield": "5 à 6 Paris-Brest individuels",
    "ingredients": [
      {
        "group": "Assemblage final",
        "items": [
          "5–6 couronnes de pâte à choux cuites avec craquelin",
          "Crème au praliné",
          "50g noisettes torréfiées concassées",
          "QS praliné noisette pur"
        ]
      },
      {
        "group": "Composants liés",
        "items": [
          "→ Voir <span data-goto=\"craquelin_cacao\">Craquelin cacao</span>",
          "→ Voir <span data-goto=\"pate_choux\">Pâte à choux</span>",
          "→ Voir <span data-goto=\"creme_patissiere_praline\">Crème pâtissière praliné</span>",
          "→ Voir <span data-goto=\"creme_beurre_meringue_italienne\">Crème au beurre meringue italienne</span>",
          "→ Voir <span data-goto=\"creme_praline\">Crème praliné</span>"
        ]
      }
    ],
    "steps": [
      "Cuire les couronnes de pâte à choux avec le craquelin.",
      "Couper chaque couronne dans la hauteur.",
      "Pocher un peu de praliné pur au fond (optionnel), puis pocher la crème au praliné.",
      "Ajouter quelques points de praliné pur, refermer avec le chapeau, puis décorer avec les noisettes concassées."
    ],
    "notes": [
      "Montage en couronnes de pâte à choux, crème praliné et noisettes.",
      "Sortir du réfrigérateur 30 à 40min avant dégustation."
    ],
    "difficultyScore": 8
  },
  "craquelin_cacao": {
    "title": "Craquelin cacao",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/craquelin_cacao_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "décor pour 8 choux",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "40g beurre pommade",
          "45g farine",
          "50g cassonade ou vergeoise",
          "6g cacao non sucré",
          "25g blancs d’œufs",
          "40g noisettes concassées"
        ]
      }
    ],
    "steps": [
      "Mélanger farine + cassonade ou vergeoise + cacao, puis incorporer le beurre.",
      "Étaler à 2mm entre deux feuilles et congeler 30min.",
      "Découper des anneaux (Ø 8cm, trou Ø 2cm), badigeonner de blanc d’œuf, ajouter les noisettes puis recongeler jusqu’à usage."
    ],
    "notes": [
      "Composant pour <span data-goto=\"paris_brest\">Paris-Brest</span>."
    ],
    "difficultyScore": 2
  },
  "pate_choux": {
    "title": "Pâte à choux",
    "master": "pates_bases_maitre",
    "image": "/assets/recipe-images-optimized/pate_choux_spooky.jpg",
    "categories": [
      "Base",
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "8 choux",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "60g lait",
          "60g eau",
          "2g sel",
          "55g beurre",
          "75g farine",
          "100g œufs (≈2)"
        ]
      }
    ],
    "steps": [
      "Porter à ébullition eau + lait + sel + beurre.",
      "Hors du feu, ajouter la farine en une fois puis dessécher sur feu doux.",
      "Refroidir légèrement au robot (feuille), puis incorporer les œufs progressivement jusqu’à texture lisse.",
      "Pocher des couronnes de 7cm, poser le craquelin puis cuire à 170°C pendant 40 à 45min."
    ],
    "notes": [
      "Le test du sillon il doit se refermer doucement quand la texture est correcte."
    ],
    "difficultyScore": 7,
    "additionalMasters": [
      "elements_base_maitre",
      "desserts_maitre"
    ]
  },
  "creme_patissiere_praline": {
    "title": "Crème pâtissière praliné",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_patissiere_praline_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "environ 390g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "4g gélatine poudre + 16g eau",
          "150g lait",
          "30g crème liquide",
          "30g sucre",
          "9g maïzena",
          "9g farine",
          "30g jaunes d’œufs",
          "10g beurre de cacao",
          "17g beurre",
          "10g mascarpone",
          "30g pâte de noisette",
          "60g praliné noisette"
        ]
      }
    ],
    "steps": [
      "Réhydrater la gélatine dans l’eau froide.",
      "Porter lait + crème à ébullition. Blanchir jaunes + sucre, puis ajouter maïzena et farine.",
      "Verser le liquide chaud sur les jaunes, remettre en casserole et cuire jusqu’à épaississement.",
      "Hors du feu, ajouter gélatine, beurre de cacao, beurre, mascarpone, pâte de noisette et praliné. Mixer, filmer au contact, refroidir."
    ],
    "notes": [
      "Ajuster le praliné/pâte de noisette selon l’intensité souhaitée."
    ],
    "difficultyScore": 6,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "creme_beurre_meringue_italienne": {
    "title": "Crème au beurre meringue italienne",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_beurre_meringue_italienne_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "hard",
    "yield": "environ 300g",
    "ingredients": [
      {
        "group": "Crème anglaise au beurre",
        "items": [
          "45g lait",
          "45g sucre",
          "35g jaunes d’œufs",
          "200g beurre pommade"
        ]
      },
      {
        "group": "Meringue italienne",
        "items": [
          "20g eau",
          "60g sucre",
          "30g blancs d’œufs"
        ],
        "recipeId": "meringue_italienne"
      }
    ],
    "steps": [
      "Cuire la crème anglaise (lait + jaunes + sucre) à 84°C, puis refroidir légèrement.",
      "Foisonner le beurre pommade puis incorporer progressivement la crème anglaise.",
      "Réaliser une meringue italienne (sirop 121°C versé sur blancs mousseux) puis incorporer délicatement à la crème au beurre."
    ],
    "notes": [
      "Base technique pour plusieurs entremets/pâtisseries classiques."
    ],
    "difficultyScore": 8,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "creme_praline": {
    "title": "Crème praliné",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_praline_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "environ 690g",
    "ingredients": [
      {
        "group": "Assemblage",
        "items": [
          "390g crème pâtissière praliné (ou totalité préparée)",
          "300g crème au beurre (environ)"
        ]
      }
    ],
    "steps": [
      "Détendre la crème pâtissière refroidie au fouet.",
      "Incorporer délicatement la crème au beurre à la maryse.",
      "Mettre en poche cannelée pour le montage des Paris-Brest."
    ],
    "notes": [
      "Utilisé par exemple dans <span data-goto=\"paris_brest\">Paris-Brest</span>."
    ],
    "difficultyScore": 5,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "petit_dejeuner_maitre": {
    "title": "Petit-déjeuner",
    "image": "/assets/recipe-images-optimized/parent_petit_dejeuner.jpg",
    "categories": [
      "Petits-déjeuners"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
      {
        "id": "chocolat_ancien",
        "label": "Chocolat chaud à l'ancienne"
      },
      {
        "id": "gaufre_bruxelles",
        "label": "Gaufres"
      },
      {
        "id": "oeuf_chili_crisp_toast",
        "label": "Œuf sur le plat chili crisp sur toast"
      },
      {
        "id": "pancakes_variantes",
        "label": "Pancakes"
      },
      {
        "id": "pancakes_fluffy",
        "label": "Pancakes fluffy"
      }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une variante pour afficher les recettes."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher les ingrédients et les étapes."
    ],
    "notes": [
      "Fiche parent de navigation. Les recettes restent conservées dans leurs variantes."
    ]
  },
  "entrees_maitre": {
    "title": "Entrées",
    "image": "/assets/recipe-images-optimized/parent_entrees.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
          {
                "id": "ajitsuke_tamago_oeufs_marines_ramen",
                "label": "Ajitsuke tamago oeufs marinés ramen"
          },
          {
                "id": "asperges_mimosa",
                "label": "Asperges mimosa"
          },
          {
                "id": "beignets_calamar",
                "label": "Beignets de calamar"
          },
          {
                "id": "bricks_fromage_miel_poires_pecan",
                "label": "Bricks fromage miel poires pecan"
          },
          {
                "id": "bruschetta_roquefort_noix",
                "label": "Bruschetta roquefort noix"
          },
          {
                "id": "carpaccio_betterave_mozzarella_yuzu",
                "label": "Carpaccio betterave mozzarella yuzu"
          },
          {
                "id": "cassolette_crevettes_ravioles_persil",
                "label": "Cassolette de crevettes et ravioles au persil"
          },
          {
                "id": "chipirons_a_la_plancha",
                "label": "Chipirons à la plancha"
          },
          {
                "id": "chou_fleur_croustillant",
                "label": "Chou-fleur croustillant"
          },
          {
                "id": "crudites_maitre",
                "label": "Crudités et salades fraîches"
          },
          {
                "id": "falafels_four",
                "label": "Falafels au four"
          },
          {
                "id": "houmous_hakocem",
                "label": "Houmous tahine tres cremeux"
          },
          {
                "id": "legumes_rotis",
                "label": "Légumes rôtis au four"
          },
          {
                "id": "oeufs_cocotte_chorizo",
                "label": "Oeufs cocotte chorizo"
          },
          {
                "id": "oeufs_meurette_faciles",
                "label": "Oeufs en meurette faciles"
          },
          {
                "id": "oeufs_mimosa_variantes",
                "label": "Œufs mimosa"
          },
          {
                "id": "oignons_rotis_thym_miel",
                "label": "Oignons rôtis au thym et au miel"
          },
          {
                "id": "salade_epinards_clementines_amande_feta",
                "label": "Salade epinards clementines amande feta"
          },
          {
                "id": "salade_oeufs_durs_mayonnaise_bistrot",
                "label": "Salade oeufs durs mayonnaise"
          },
          {
                "id": "salade_pois_chiche_feta_olives",
                "label": "Salade pois chiches feta olives"
          },
          {
                "id": "salade_pois_chiches_thon_poivrons",
                "label": "Salade pois chiches thon poivrons"
          },
          {
                "id": "samoussas_boeuf_epinards_petits_pois",
                "label": "Samoussas boeuf epinards petits pois"
          },
          {
                "id": "salade_caprese",
                "label": "Tomate mozzarella basilic"
          },
          {
                "id": "tomates_maitre",
                "label": "Tomates préparées"
          },
          {
                "id": "veloute_hiver_noix_cajou",
                "label": "Veloute d'hiver noix de cajou"
          }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une variante pour afficher les recettes."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher les ingrédients et les étapes."
    ],
    "notes": [
      "Fiche parent de navigation. Les recettes restent conservées dans leurs variantes."
    ]
  },
  "plats_maitre": {
    "title": "Plats",
    "image": "/assets/recipe-images-optimized/parent_plats.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
          {
                "id": "beignets_calamar",
                "label": "Beignets de calamar"
          },
          {
                "id": "bouillabaisse_rouille",
                "label": "Bouillabaisse"
          },
          {
                "id": "brochettes_crevettes_chorizo",
                "label": "Brochettes crevettes chorizo"
          },
          {
                "id": "cabillaud_crumble_chorizo",
                "label": "Cabillaud au four, crumble de chorizo"
          },
          {
                "id": "carre_d_agneau_croute_d_herbes",
                "label": "Carré d’agneau croûte d’herbes"
          },
          {
                "id": "cassolette_crevettes_ravioles_persil",
                "label": "Cassolette de crevettes et ravioles au persil"
          },
          {
                "id": "chipirons_a_la_plancha",
                "label": "Chipirons à la plancha"
          },
          {
                "id": "cochon_confit_biere_erable",
                "label": "Cochon confit à la bière et au sirop d’érable"
          },
          {
                "id": "porc_chorizo_haricots_tarbais",
                "label": "Cocotte porc chorizo haricots tarbais"
          },
          {
                "id": "cotelettes_porc_miel_moutarde",
                "label": "Côtelettes de porc miel moutarde"
          },
          {
                "id": "crevettes_provencale",
                "label": "Crevettes a la provencale"
          },
          {
                "id": "crevettes_ail_persil",
                "label": "Crevettes en persillade"
          },
          {
                "id": "croque_madame",
                "label": "Croque-madame"
          },
          {
                "id": "cuisses_poulet_asiatique",
                "label": "Cuisses de poulet asiatique"
          },
          {
                "id": "cuisses_de_poulet_miel_moutarde",
                "label": "Cuisses de poulet miel moutarde"
          },
          {
                "id": "cuisses_de_poulet_rhum_miel_piment",
                "label": "Cuisses de poulet rhum miel piment"
          },
          {
                "id": "cuisses_poulet_four_tomates_thym",
                "label": "Cuisses de poulet tomates thym"
          },
          {
                "id": "curry_carottes_lait_coco",
                "label": "Curry de carottes lait de coco"
          },
          {
                "id": "curry_lentilles_coco",
                "label": "Curry de lentilles vertes au lait de coco"
          },
          {
                "id": "dhal_lentilles_epices",
                "label": "Dhal lentilles epices"
          },
          {
                "id": "encornets_chorizo",
                "label": "Encornets sautes au chorizo"
          },
          {
                "id": "fish_and_chips",
                "label": "Fish and chips"
          },
          {
                "id": "gratin_chou_fleur_comte_lardons",
                "label": "Gratin chou-fleur comte lardons"
          },
          {
                "id": "gratin_chou_fleur_mascarpone_moutarde",
                "label": "Gratin chou-fleur mascarpone moutarde"
          },
          {
                "id": "gratin_chou_fleur",
                "label": "Gratin de chou-fleur"
          },
          {
                "id": "gratin_pates_chorizo",
                "label": "Gratin de pates au chorizo"
          },
          {
                "id": "gratin_dauphinois",
                "label": "Gratin de pommes de terre"
          },
          {
                "id": "grillades_porc_miel_orange_piment",
                "label": "Grillades porc miel orange piment"
          },
          {
                "id": "hachis_parmentier",
                "label": "Hachis parmentier"
          },
          {
                "id": "hauts_de_cuisses_poulet_orange_oignon",
                "label": "Hauts de cuisses poulet orange oignon"
          },
          {
                "id": "joues_de_boeuf_carottes_orange_vin_rouge",
                "label": "Joues de boeuf carottes orange vin rouge"
          },
          {
                "id": "joues_boeuf_whiskey_orange",
                "label": "Joues de boeuf whiskey orange"
          },
          {
                "id": "joues_de_porc_chorizo_piment",
                "label": "Joues de porc chorizo piment"
          },
          {
                "id": "joues_porc_cidre_miel",
                "label": "Joues de porc cidre miel"
          },
          {
                "id": "lentilles_a_la_bourguignonne",
                "label": "Lentilles à la bourguignonne"
          },
          {
                "id": "lentilles_tomate_pommes_de_terre_sautees",
                "label": "Lentilles tomate pommes de terre sautées"
          },
          {
                "id": "nems_vietnam",
                "label": "Nems vietnamiens"
          },
          {
                "id": "pates_crumble_chorizo",
                "label": "Pates au crumble de chorizo"
          },
          {
                "id": "pates_pesto_tomates_mozzarella",
                "label": "Pâtes au pesto, tomates cerises et mozzarella"
          },
          {
                "id": "pates_brocolis_amandes",
                "label": "Pates brocolis amandes"
          },
          {
                "id": "pates_tomates_confites_parmesan",
                "label": "Pates tomates confites parmesan"
          },
          {
                "id": "piperade_oeuf_plat",
                "label": "Piperade oeuf au plat"
          },
          {
                "id": "potee_chou",
                "label": "Potee au chou"
          },
          {
                "id": "poulet_basquaise",
                "label": "Poulet basquaise"
          },
          {
                "id": "poulet_frit_air_fryer",
                "label": "Poulet frit air fryer"
          },
          {
                "id": "poulet_gaston_gerard",
                "label": "Poulet Gaston Gérard"
          },
          {
                "id": "poulet_pommes_de_terre_asperges",
                "label": "Poulet pommes de terre asperges"
          },
          {
                "id": "poulet_tikka_masala",
                "label": "Poulet tikka masala"
          },
          {
                "id": "riz_cantonnais",
                "label": "Riz cantonnais"
          },
          {
                "id": "rougail_saucisse",
                "label": "Rougail saucisse"
          },
          {
                "id": "saucisse_puree_maison",
                "label": "Saucisse purée"
          },
          {
                "id": "saumon_au_four_simple",
                "label": "Saumon au four"
          },
          {
                "id": "saumon_au_four_tomates_olives_basilic",
                "label": "Saumon au four tomates olives basilic"
          },
          {
                "id": "souffle_fromage_facile",
                "label": "Souffle au fromage facile"
          },
          {
                "id": "tagliatelles_agrumes",
                "label": "Tagliatelles aux agrumes"
          },
          {
                "id": "tomates_farcies",
                "label": "Tomates farcies"
          }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une variante pour afficher les recettes."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher les ingrédients et les étapes."
    ],
    "notes": [
      "Fiche parent de navigation. Les recettes restent conservées dans leurs variantes."
    ]
  },
  "accompagnements_maitre": {
    "title": "Accompagnements",
    "image": "/assets/recipe-images-optimized/parent_accompagnements.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
          {
                "id": "carottes_braisees_orange_citron_confit",
                "label": "Carottes braisees orange citron confit"
          },
          {
                "id": "carottes_persillade_creme",
                "label": "Carottes persillade creme"
          },
          {
                "id": "carottes_roties_miel_epices",
                "label": "Carottes roties miel epices"
          },
          {
                "id": "chou_vert_sauce_tomate",
                "label": "Chou vert en sauce tomate"
          },
          {
                "id": "chou_fleur_croustillant",
                "label": "Chou-fleur croustillant"
          },
          {
                "id": "chou_fleur_coco_curry",
                "label": "Chou-fleur lait de coco curry"
          },
          {
                "id": "curry_carottes_lait_coco",
                "label": "Curry de carottes lait de coco"
          },
          {
                "id": "frites_maison",
                "label": "Frites"
          },
          {
                "id": "frites_belges",
                "label": "Frites belges"
          },
          {
                "id": "frites_patate_douce",
                "label": "Frites de patate douce"
          },
          {
                "id": "gaufres_pommes_terre",
                "label": "Gaufres de pommes de terre croustillantes"
          },
          {
                "id": "gratin_chou_fleur_mascarpone_moutarde",
                "label": "Gratin chou-fleur mascarpone moutarde"
          },
          {
                "id": "gratin_chou_fleur",
                "label": "Gratin de chou-fleur"
          },
          {
                "id": "gratin_dauphinois",
                "label": "Gratin de pommes de terre"
          },
          {
                "id": "legumes_rotis",
                "label": "Légumes rôtis au four"
          },
          {
                "id": "lentilles_a_la_bourguignonne",
                "label": "Lentilles à la bourguignonne"
          },
          {
                "id": "oignons_rotis_thym_miel",
                "label": "Oignons rôtis au thym et au miel"
          },
          {
                "id": "pain_grille_beurre_ail_herbes",
                "label": "Pain grillé beurre ail et herbes"
          },
          {
                "id": "patates_douces_four",
                "label": "Patates douces au four"
          },
          {
                "id": "pesto_tomates_sechees_sans_cajou",
                "label": "Pesto tomates séchées"
          },
          {
                "id": "pommes_grenaille_herbes",
                "label": "Pommes de terre grenaille aux herbes"
          },
          {
                "id": "pommes_paille",
                "label": "Pommes paille"
          },
          {
                "id": "potato_wedges_citron_herbes",
                "label": "Potato wedges citron herbes"
          },
          {
                "id": "puree_butternut_pommes_terre_curry",
                "label": "Puree butternut pommes de terre curry"
          },
          {
                "id": "puree_chou_fleur",
                "label": "Puree de chou-fleur"
          },
          {
                "id": "puree_courge_butternut",
                "label": "Purée de courge butternut"
          },
          {
                "id": "puree_patates_douces",
                "label": "Puree de patates douces"
          },
          {
                "id": "puree_pommes_de_terre_citron",
                "label": "Purée pommes de terre citron"
          },
          {
                "id": "rattes_four",
                "label": "Rattes au four"
          },
          {
                "id": "riz_au_citron",
                "label": "Riz au citron"
          },
          {
                "id": "riz_cantonnais",
                "label": "Riz cantonnais"
          },
          {
                "id": "sauce_yaourt_citronnee",
                "label": "Sauce yaourt citronnée"
          },
          {
                "id": "tomates_variantes",
                "label": "Tomates confites et séchées"
          },
          {
                "id": "tomates_provencales",
                "label": "Tomates provençales"
          },
          {
                "id": "toppings_frites",
                "label": "Toppings frites"
          }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une variante pour afficher les recettes."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher les ingrédients et les étapes."
    ],
    "notes": [
      "Fiche parent de navigation. Les recettes restent conservées dans leurs variantes."
    ]
  },
  "desserts_maitre": {
    "title": "Desserts",
    "image": "/assets/recipe-images-optimized/parent_desserts.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "masterType": "collection",
    "variants": [
      {
        "id": "donuts_cloud",
        "label": "Beignets Cloud"
      },
      {
        "id": "biscuits_gouters_maitre",
        "label": "Biscuits, cookies et meringues"
      },
      {
        "id": "carres_cremeux_citron_vert",
        "label": "Carrés crémeux citron vert"
      },
      {
        "id": "choux_craquelin",
        "label": "Choux au craquelin"
      },
      {
        "id": "clafoutis_cerises_bocuse",
        "label": "Clafoutis aux cerises"
      },
      {
        "id": "craquelin_cacao",
        "label": "Craquelin cacao"
      },
      {
        "id": "crumble_pomme_poire",
        "label": "Crumble pomme-poire"
      },
      {
        "id": "desserts_cuillere_maitre",
        "label": "Desserts à la cuillère"
      },
      {
        "id": "flan_patissier_epais_vanille",
        "label": "Flan pâtissier épais vanille"
      },
      {
        "id": "paris_brest",
        "label": "Paris-Brest"
      },
      {
        "id": "pate_choux",
        "label": "Pâte à choux"
      },
      {
        "id": "poires_roties_orange_miel",
        "label": "Poires roties orange miel"
      },
      {
        "id": "sauce_caramel",
        "label": "Sauce caramel"
      },
      {
        "id": "tartes_maitre",
        "label": "Tartes"
      },
      {
        "id": "cremes_maitre",
        "label": "Toppings et garnitures"
      }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une variante pour afficher les recettes."
        ]
      }
    ],
    "steps": [
      "Choisir une variante pour afficher les ingrédients et les étapes."
    ],
    "notes": [
      "Fiche parent de navigation. Les recettes restent conservées dans leurs variantes."
    ]
  },
  "crumble_pomme_poire": {
    "title": "Crumble pomme-poire",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/crumble_pomme_poire.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "2 personnes",
    "aliases": [
      "crumble pomme poire",
      "crumble aux pommes et poires",
      "dessert pomme poire"
    ],
    "tags": [
      "crumble",
      "pomme",
      "poire",
      "dessert"
    ],
    "ingredients": [
      {
        "group": "Fruits",
        "items": [
          "1 pomme",
          "1 poire"
        ]
      },
      {
        "group": "Pâte à crumble",
        "items": [
          "50g de beurre salé en pommade",
          "50g de sucre",
          "30g de farine",
          "30g de poudre de noisette ou de poudre d’amande"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 180°C.",
      "Laver la pomme et la poire, puis les éplucher.",
      "Couper les fruits en petits cubes.",
      "Mélanger le beurre salé pommade, le sucre, la farine et la poudre de noisette ou d’amande.",
      "Travailler du bout des doigts jusqu’à obtenir une texture sableuse.",
      "Répartir les cubes de pomme et de poire dans le fond d’un petit plat à gratin.",
      "Recouvrir les fruits avec la pâte à crumble.",
      "Enfourner 30 à 35min, jusqu’à ce que les fruits soient fondants et que le crumble soit bien doré.",
      "Servir tiède ou à température ambiante."
    ],
    "notes": [
      "Le beurre doit être pommade, pas fondu, pour obtenir un crumble bien sableux.",
      "Beurre légèrement le plat à gratin avant d’ajouter les fruits le jus caramélisé accroche moins.",
      "Surveiller la coloration en fin de cuisson le dessus doit être doré sans brûler.",
      "Très bon tiède, nature ou avec une crème anglaise."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Travailler la pâte du bout des doigts pour garder des morceaux irréguliers et croustillants."
      },
      {
        "label": "Cuisson",
        "value": "180°C, 30 à 35min selon le plat et la taille des fruits."
      }
    ]
  },
  "creme_kinder_nutella": {
    "title": "Crème Nutella à garnir",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_kinder_nutella_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "~500g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g mascarpone",
          "150g crème entière froide",
          "120g pâte à tartiner chocolat-noisette",
          "20g sucre glace"
        ]
      }
    ],
    "steps": [
      "Mélanger mascarpone et pâte à tartiner.",
      "Ajouter crème froide et sucre glace.",
      "Fouetter jusqu’à texture épaisse et stable."
    ],
    "notes": [
      "Texture crèmeuse mais stable en fourrage.",
      "Goût intense, ne détrempe pas le donut."
    ],
    "tags": [
      "creme",
      "nutella",
      "kinder",
      "fourrage",
      "stable"
    ],
    "difficultyScore": 3,
    "aliases": [
      "creme nutella",
      "crème nutella"
    ]
  },
  "creme_pistache": {
    "title": "Crème pistache à garnir",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_pistache_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "~500g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g mascarpone",
          "180g crème entière froide",
          "80g pâte de pistache",
          "30g sucre glace"
        ]
      }
    ],
    "steps": [
      "Lisser mascarpone, pâte de pistache et sucre glace.",
      "Ajouter la crème froide.",
      "Monter au fouet jusqu’à texture ferme."
    ],
    "notes": [
      "Résultat attendu crèmeux, parfumé et stable."
    ],
    "tags": [
      "creme",
      "pistache",
      "fourrage",
      "stable"
    ],
    "difficultyScore": 3
  },
  "oeuf_chili_crisp_toast": {
    "title": "Œuf sur le plat chili crisp sur toast",
    "master": "petit_dejeuner_maitre",
    "image": "/assets/recipe-images-optimized/oeuf_chili_crisp_toast_v4_spooky.jpg",
    "categories": [
      "Petits-déjeuners"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "1 toast + huile chili crisp pour plusieurs portions",
    "aliases": [
      "toast œuf chili crisp",
      "oeuf chili crisp toast",
      "chili crisp egg toast",
      "œuf sur toast"
    ],
    "tags": [
      "oeuf",
      "toast",
      "chili crisp",
      "avocat",
      "petit-dejeuner"
    ],
    "ingredients": [
      {
        "group": "Huile chili crisp",
        "items": [
          "110g huile d’avocat ou huile neutre",
          "5g flocons de piment concassés ou piment rouge séché finement concassé",
          "7g poudre de piment finement moulue piment du Sichuan, gochugaru, poudre de chili ou autre piment au choix",
          "0,3g cinq-épices",
          "4 à 5g ail très finement haché ou râpé",
          "1,5g graines de sésame",
          "1,5g sel"
        ]
      },
      {
        "group": "Toast à l’œuf",
        "items": [
          "9 à 14g huile chili crisp ou huile chili crisp du commerce",
          "55g œuf (1 œuf moyen)",
          "Sel",
          "Poivre du moulin",
          "1 tranche de pain grillée",
          "Beurre, fromage frais ou cream cheese",
          "1 petite poignée de jeunes pousses d’épinards",
          "1/3 petit avocat tranché"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Un peu d’huile chili crisp",
          "Basilic frais ciselé ou herbes fraîches au choix, facultatifs"
        ]
      }
    ],
    "steps": [
      "Verser l’huile dans une petite casserole et chauffer à feu doux elle doit être chaude sans fumer.",
      "Mélanger flocons de piment, poudre de piment, cinq-épices, ail, graines de sésame et sel dans un bol résistant à la chaleur.",
      "Verser l’huile chaude sur le mélange d’épices, laisser crépiter quelques secondes, mélanger puis laisser tiédir.",
      "Faire chauffer une poêle à feu moyen.",
      "Ajouter 9 à 14g d’huile chili crisp, puis casser l’œuf dans la poêle.",
      "Saler, ajouter un peu de poivre du moulin et frire jusqu’à bords croustillants et jaune cuit selon ton goût.",
      "Faire griller la tranche de pain.",
      "Tartiner avec un peu de beurre, de fromage frais, de cream cheese ou d’alternative végétale.",
      "Ajouter les jeunes pousses d’épinards et les tranches d’avocat.",
      "Déposer l’œuf par-dessus, ajouter un filet d’huile chili crisp et terminer avec le basilic ou les herbes fraîches si souhaité."
    ],
    "notes": [
      "L’huile chili crisp doit refroidir complètement avant d’être transférée dans un bocal propre, stérilisé et hermétique.",
      "Conserve l’huile chili crisp au réfrigérateur, utilise toujours une cuillère propre et ne la garde pas à température ambiante avec de l’ail frais.",
      "Jette l’huile en cas d’odeur anormale, de bulles, de moisissure ou de texture suspecte.",
      "L’huile peut se conserver environ 2 à 6 mois au réfrigérateur si elle est correctement stockée.",
      "Le toast se mange tout de suite pour garder le pain croustillant et l’œuf chaud."
    ],
    "technical": [
      {
        "label": "Huile chaude",
        "value": "Elle doit réveiller les épices sans brûler l’ail ni faire fumer l’huile."
      },
      {
        "label": "Œuf frit",
        "value": "Une poêle bien chaude donne des bords croustillants tout en gardant un jaune fondant."
      }
    ]
  },
  "gaufre_bruxelles": {
    "title": "Gaufres",
    "master": "petit_dejeuner_maitre",
    "image": "/assets/recipe-images-optimized/gaufre_bruxelles_v4_spooky.jpg",
    "categories": [
      "Petits-déjeuners"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "8–10 gaufres",
    "ingredients": [
      {
        "group": "Pâte levée",
        "items": [
          "250g farine",
          "370g lait tiède",
          "15g levure fraîche",
          "150g œufs entiers (3 œufs)",
          "100g beurre fondu",
          "10g sucre",
          "2g sel",
          "vanille optionnelle selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
        ]
      }
    ],
    "steps": [
      "Mélanger levure et lait tiède, attendre 10min.",
      "Mélanger farine, sucre, sel, jaunes d’œufs, lait et levure jusqu’à pâte lisse.",
      "Ajouter le beurre fondu.",
      "Laisser lever 1h.",
      "Monter les blancs en neige et incorporer délicatement.",
      "Cuire dans un gaufrier très chaud 3–4min."
    ],
    "notes": [
      "Vraie gaufre de Bruxelles pâte levée, blancs montés, gros trous, texture légère et croustillante.",
      "Pour plus de croustillant, remplacer 50g de lait par 50g de bière."
    ],
    "tags": [
      "gaufre",
      "bruxelles",
      "petit-dejeuner"
    ],
    "difficultyScore": 3
  },
  "tarte_citron_meringuee": {
    "title": "Tarte citron meringuée",
    "master": "tartes_maitre",
    "image": "/assets/recipe-images-optimized/tarte_citron_meringuee_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "hard",
    "yield": "1 tarte",
    "ingredients": [
      {
        "group": "Pâte sucrée",
        "items": [
          "125g farine T55",
          "75g beurre souple",
          "48g sucre glace",
          "15g poudre d’amandes ou de noisettes",
          "30g œuf",
          "1 pincée sel fin"
        ],
        "recipeId": "pate_sucree"
      },
      {
        "group": "Crème d’amande",
        "items": [
          "75g beurre mou",
          "75g sucre",
          "50g œuf",
          "75g poudre d’amande",
          "10g fécule pour crème d’amande",
          "2g zeste de citron"
        ],
        "recipeId": "creme_amande_citron"
      },
      {
        "group": "Crème citron",
        "items": [
          "40g jus de citron",
          "90g jaunes d’œufs",
          "65g sucre",
          "5g fécule pour crème citron",
          "50g beurre"
        ],
        "recipeId": "creme_citron_lemon_curd"
      },
      {
        "group": "Marmelade citron optionnelle",
        "items": [
          "3 citrons",
          "50g sucre"
        ],
        "recipeId": "compotee_citron"
      },
      {
        "group": "Meringue italienne",
        "items": [
          "60g blancs d’œufs",
          "100g sucre",
          "30g eau",
          "2g sel",
          "2g jus de citron"
        ],
        "recipeId": "meringue_italienne"
      }
    ],
    "steps": [
      "Pâte sucrée assouplir le beurre, ajouter sucre glace, poudre d’amandes, œuf et sel, puis incorporer la farine lentement sans trop travailler.",
      "Étaler à 2–3mm entre deux feuilles, refroidir au moins 1h, foncer, reposer au froid puis cuire 10 à 15min à 170°C chaleur tournante.",
      "Crème d’amande mélanger beurre et sucre, ajouter œuf, poudre d’amande, fécule et zeste. Étaler 5mm dans la tarte et cuire 20–25min à 180°C.",
      "Crème citron chauffer le jus, fouetter jaunes et sucre, ajouter fécule, verser le jus chaud, cuire jusqu’à épaississement, ajouter beurre, filmer au contact et refroidir.",
      "Compotée optionnelle cuire citron et sucre, mixer, puis Étaler une fine couche sur le fond.",
      "Montage fond cuit, compotée optionnelle, crème citron sur 1–2cm, lisser.",
      "Meringue italienne cuire sucre, eau et citron à 118–120°C, verser en filet sur blancs mousseux, fouetter 5–10min jusqu’à refroidissement.",
      "Pocher la meringue, finir au chalumeau ou sous grill, puis reposer 1h minimum au froid."
    ],
    "notes": [
      "Points critiques beurre pommade non liquide, sirop à 118–120°C, verser lentement, fouetter jusqu’à refroidissement complet.",
      "Résultat attendu pâte croustillante, crème d’amande moelleuse, crème citron fondante, meringue légère et stable."
    ],
    "tags": [
      "tarte",
      "citron",
      "meringue",
      "dessert"
    ],
    "difficultyScore": 8
  },
  "tiramisu_speculoos": {
    "title": "Tiramisu spéculoos",
    "master": "desserts_cuillere_maitre",
    "image": "/assets/recipe-images-optimized/tiramisu_speculoos_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "6 portions",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g mascarpone",
          "100g œufs (2 œufs)",
          "80g sucre",
          "200g spéculoos",
          "100g jus d’orange",
          "30–45g Grand Marnier"
        ]
      }
    ],
    "steps": [
      "Fouetter jaunes et sucre.",
      "Ajouter mascarpone.",
      "Monter les blancs et incorporer délicatement.",
      "Tremper les spéculoos dans jus d’orange et Grand Marnier.",
      "Monter en couches.",
      "Réfrigérer 4h minimum."
    ],
    "notes": [
      "Toujours tout peser avant.",
      "Respecter les textures pommade, mousse, bec d’oiseau.",
      "Ne jamais précipiter la meringue ou les mélanges mousseux."
    ],
    "tags": [
      "tiramisu",
      "speculoos",
      "rapide"
    ],
    "difficultyScore": 3
  },
  "cake_sale_lardon": {
    "title": "Cake salé poitrine fumée",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/cake_sale_lardon_v4_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "6 personnes",
    "ingredients": [
      {
        "group": "Garniture",
        "items": [
          "200g de poitrine fumée en dés",
          "80g oignon",
          "4g ail",
          "10g huile d’olive",
          "50g vin blanc pour déglacer",
          "1 à 2 tomates coupées en tranches très fines",
          "Thym ou origan pour les tomates"
        ]
      },
      {
        "group": "Appareil à cake",
        "items": [
          "75g beurre",
          "200g farine",
          "11g levure chimique",
          "200g œufs (4 œufs)",
          "100g lait",
          "150g emmental râpé",
          "2g sel",
          "1g poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Faire griller la poitrine fumée en dés.",
      "Ajouter oignon et ail coupés très petit.",
      "Déglacer au vin blanc et laisser évaporer l’alcool.",
      "Mélanger tous les ingrédients de l’appareil avec la garniture.",
      "Beurrer et fariner le moule.",
      "Déposer les tranches fines de tomates sur le dessus du cake juste avant d’enfourner, puis parsemer de thym ou d’origan.",
      "Enfourner à 180°C pendant 35 à 50min selon le moule et l’épaisseur du cake."
    ],
    "notes": [
      "Le cake est prêt quand la lame ressort sèche et que le dessus est bien doré.",
      "Préparation du moule beurre et farine le moule, puis retire l’excédent pour démouler proprement."
    ],
    "tags": [
      "cake",
      "sale",
      "apero",
      "poitrine",
      "tomate"
    ],
    "difficultyScore": 3,
    "aliases": [
      "cake salé lardon",
      "cake jambon fromage",
      "cake poitrine fumée"
    ]
  },
  "cake_tomate_chorizo_feta": {
    "title": "Cake tomate chorizo feta",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/cake_tomate_chorizo_feta_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "10 parts",
    "aliases": [
      "cake tomate chorizo feta",
      "cake chorizo feta",
      "cake salé tomate chorizo"
    ],
    "tags": [
      "cake",
      "tomate",
      "chorizo",
      "feta",
      "apero"
    ],
    "ingredients": [
      {
        "group": "Appareil",
        "items": [
          "150g farine",
          "11g levure chimique",
          "300g œufs entiers",
          "130g lait",
          "70g huile d’olive",
          "2g sel fin",
          "Poivre du moulin"
        ]
      },
      {
        "group": "Garniture",
        "items": [
          "100g chorizo coupé en dés",
          "100g feta émiettée",
          "90g tomates séchées égouttées et hachées",
          "50g échalote ciselée",
          "10g basilic ou persil ciselé"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 180°C et chemiser un moule à cake.",
      "Mélanger farine, levure chimique, sel fin et poivre du moulin.",
      "Fouetter les œufs avec le lait et l’huile d’olive, puis incorporer les poudres sans trop travailler.",
      "Ajouter le chorizo, la feta, les tomates séchées, l’échalote et les herbes.",
      "Verser dans le moule, lisser et cuire 35 à 45min, jusqu’à ce qu’une lame ressorte sèche.",
      "Laisser tiédir 10min dans le moule, puis démouler et refroidir sur grille avant de trancher."
    ],
    "notes": [
      "Couper le chorizo et les tomates en petits morceaux pour une répartition régulière.",
      "Égoutter les tomates séchées pour éviter un cake trop gras.",
      "Servir tiède ou froid, en tranches fines pour l’apéro."
    ],
    "technical": [
      {
        "label": "Mélange",
        "value": "Arrêter dès que la farine disparaît pour garder une mie tendre."
      },
      {
        "label": "Cuisson",
        "value": "Si le dessus colore trop vite, couvrir légèrement avec une feuille de papier cuisson."
      }
    ],
    "practical": {
      "equipment": [
        "Moule à cake",
        "Fouet",
        "Saladier",
        "Grille"
      ],
      "storage": [
        "3 jours au réfrigérateur en boîte hermétique.",
        "Réchauffer quelques minutes au four doux ou servir froid."
      ],
      "mistakes": [
        "Ne pas surmélanger l’appareil après ajout de la farine."
      ],
      "result": [
        "Cake salé moelleux, parfumé, avec garniture bien répartie."
      ]
    }
  },
  "oignons_rotis_thym_miel": {
    "title": "Oignons rôtis au thym et au miel",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/oignons_rotis_thym_miel_v4_spooky.jpg",
    "categories": [
      "Entrées",
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "yield": "4 personnes",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "6 oignons jaunes",
          "40g miel",
          "40g huile d’olive",
          "2 branches de thym frais",
          "3g sel",
          "1g poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 180°C.",
      "Éplucher les oignons et les couper en deux dans la largeur.",
      "Disposer côté coupé vers le haut sur plaque.",
      "Arroser d’huile d’olive, répartir le miel, saler, ajouter du poivre du moulin et parsemer de thym.",
      "Rôtir environ 30min jusqu’à coloration et caramélisation.",
      "Arroser avec le jus de cuisson pendant la cuisson."
    ],
    "notes": [
      "Accompagnement pour viande grillée, poisson, purée ou gratin de légumes.",
      "Conservation 3–4 jours au froid en boîte hermétique."
    ],
    "tags": [
      "oignon",
      "thym",
      "miel",
      "accompagnement"
    ],
    "difficultyScore": 2,
    "additionalMasters": [
      "accompagnements_maitre"
    ]
  },
  "cochon_confit_biere_erable": {
    "title": "Cochon confit à la bière et au sirop d’érable",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cochon_confit_biere_erable_v4_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "yield": "6–8 personnes",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "1,5kg porc (épaule ou poitrine désossée)",
          "30g huile végétale neutre",
          "2 oignons jaunes émincés",
          "3 gousses d’ail hachées",
          "330g bière blonde ou ambrée",
          "130g sirop d’érable pur",
          "15g moutarde de Dijon",
          "2 branches de thym frais",
          "1 feuille de laurier",
          "5g sel fin",
          "2g poivre du moulin",
          "15g vinaigre de cidre optionnel",
          "40g sirop d’érable optionnel pour ajuster"
        ]
      }
    ],
    "steps": [
      "Saler le porc et ajouter du poivre du moulin.",
      "Chauffer l’huile en cocotte et dorer la viande sur toutes ses faces.",
      "Ajouter les oignons et l’ail, faire revenir.",
      "Déglacer avec la bière en grattant les sucs.",
      "Ajouter sirop d’érable, moutarde, thym, laurier et vinaigre si utilisé.",
      "Couvrir et cuire lentement au four ou à feu doux jusqu’à viande très fondante.",
      "Réduire la sauce si besoin et napper la viande."
    ],
    "notes": [
      "Cuisson lente indispensable pour une texture fondante.",
      "Conservation 3–4 jours au froid, réchauffage doux avec un peu de sauce."
    ],
    "tags": [
      "porc",
      "biere",
      "erable",
      "mijote"
    ],
    "difficultyScore": 5
  },
  "pate_sucree": {
    "title": "Pâte sucrée",
    "master": "pates_bases_maitre",
    "image": "/assets/recipe-images-optimized/pate_sucree_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "2 fonds de tarte de 26cm ou 12 tartelettes",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g farine T55",
          "150g beurre souple",
          "95g sucre glace",
          "30g poudre d’amandes ou de noisettes",
          "60g œuf",
          "2 pincées sel fin"
        ]
      },
      {
        "group": "Dorure / isolation optionnelle",
        "items": [
          "1 jaune d’œuf",
          "1 petite cuillère crème ou eau",
          "Option chocolat fondu blanc ou noir pour isoler le fond"
        ]
      }
    ],
    "steps": [
      "Assouplir le beurre au robot avec la feuille, ou utiliser un beurre déjà souple à température ambiante.",
      "Ajouter sucre glace, poudre d’amandes, œuf et sel, puis mélanger jusqu’à texture homogène.",
      "Ajouter la farine et mélanger lentement juste le temps de l’incorporer, sans chercher une pâte parfaitement boule.",
      "Étaler la pâte entre deux feuilles de papier cuisson sur 2 à 3mm d’épaisseur, sans ajouter de farine.",
      "Réserver au réfrigérateur au moins 1h après étalage, ou filmer la pâte et la laisser reposer au moins 2h avant de l’abaisser.",
      "Foncer le cercle soit avec une grande abaisse, soit avec des bandes pour les bords et un disque pour le fond.",
      "Laisser reposer le fond foncé au réfrigérateur avant cuisson, idéalement 24h pour limiter la rétractation.",
      "Cuire à 170°C chaleur tournante 10 à 15min si le fond doit recuire avec une crème d’amandes, ou 15 à 20min pour un fond cuit à blanc.",
      "Pour une finition dorée et isolée, badigeonner très finement jaune d’œuf + crème ou eau, puis remettre 5min à 170°C.",
      "Laisser refroidir avant de garnir, puis isoler au chocolat fondu si la garniture est très humide."
    ],
    "notes": [
      "Base utilisée dans la tarte citron meringuée.",
      "Ne travaille presque plus la pâte après ajout de la farine trop mélanger la rend friable, fragile et plus difficile à manipuler.",
      "La farine T55 limite mieux la rétractation à la cuisson qu’une farine trop riche en gluten.",
      "Étaler entre deux feuilles évite d’ajouter de la farine et garde une texture plus nette.",
      "Un tapis de cuisson perforé posé sur grille permet une cuisson plus régulière et évite souvent de piquer le fond.",
      "Si la pâte casse au fonçage, colmate avec un morceau de pâte de même épaisseur elle se ressoude à la cuisson.",
      "Si les bords collent au cercle, décolle-les à chaud avec une petite lame sans retirer le cercle.",
      "Pour une surface plus lisse, poncer très légèrement le fond cuit avec un zesteur fin.",
      "Les chutes crues peuvent être filmées et congelées pour une autre tarte."
    ],
    "technical": [
      {
        "label": "Épaisseur",
        "value": "2 à 3mm pour un fond fin, croustillant et régulier."
      },
      {
        "label": "Repos anti-rétractation",
        "value": "1h minimum après étalage, idéalement 24h une fois le fond foncé."
      },
      {
        "label": "Cuisson",
        "value": "170°C chaleur tournante, 10 à 15min avant recuisson ou 15 à 20min pour cuisson complète."
      },
      {
        "label": "Isolation",
        "value": "Dorure jaune + crème/eau ou fine couche de chocolat fondu pour protéger le croustillant des garnitures humides."
      }
    ],
    "tags": [
      "pate",
      "tarte",
      "base",
      "patisserie",
      "pierre herme",
      "fond de tarte"
    ],
    "difficultyScore": 6,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "creme_amande_citron": {
    "title": "Fond de tarte amande",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_amande_citron_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "1 insert fin de tarte",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "75g beurre mou",
          "75g sucre",
          "50g œuf",
          "75g poudre d’amande",
          "10g fécule",
          "2g zeste de citron"
        ]
      }
    ],
    "steps": [
      "Crèmer beurre et sucre.",
      "Ajouter l’œuf.",
      "Incorporer poudre d’amande, fécule et zeste.",
      "Étaler environ 5mm dans le fond de tarte et cuire jusqu’à coloration moelleuse."
    ],
    "notes": [
      "Base moelleuse pour tartes aux fruits ou citron."
    ],
    "tags": [
      "creme",
      "amande",
      "garniture"
    ],
    "difficultyScore": 3,
    "aliases": [
      "crème d’amande",
      "creme amande"
    ],
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "creme_citron_lemon_curd": {
    "title": "Crème citron",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_citron_lemon_curd_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "medium",
    "yield": "Environ 500g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "80g jus de citron",
          "180g jaunes d’œufs",
          "130g sucre",
          "10g fécule",
          "100g beurre"
        ]
      }
    ],
    "steps": [
      "Chauffer le jus de citron.",
      "Fouetter jaunes et sucre, puis ajouter la fécule.",
      "Verser le jus chaud sur le mélange.",
      "Cuire jusqu’à épaississement.",
      "Ajouter le beurre, mixer si besoin, filmer au contact et refroidir."
    ],
    "notes": [
      "Texture fondante pour tarte citron, verrines ou fourrage.",
      "Refroidir avant montage pour une tenue nette."
    ],
    "tags": [
      "creme",
      "citron",
      "lemon-curd",
      "garniture"
    ],
    "difficultyScore": 5,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "compotee_citron": {
    "title": "Marmelade citron",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/compotee_citron_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "yield": "Fine couche pour 1 tarte",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "3 citrons",
          "50g sucre"
        ]
      }
    ],
    "steps": [
      "Couper les citrons finement en retirant les pépins.",
      "Cuire doucement avec le sucre.",
      "Mixer finement.",
      "Étaler en couche fine sur un fond de tarte cuit."
    ],
    "notes": [
      "Optionnelle dans la tarte citron meringuée.",
      "À utiliser en petite quantité pour éviter l’amertume."
    ],
    "tags": [
      "citron",
      "marmelade",
      "tarte",
      "garniture"
    ],
    "difficultyScore": 5,
    "aliases": [
      "marmelade citron",
      "compotée citron"
    ],
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "meringue_italienne": {
    "title": "Meringue italienne",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/meringue_italienne_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "Décor pour 1 tarte",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "60g blancs d’œufs",
          "100g sucre",
          "30g eau",
          "1g sel",
          "2g jus de citron"
        ]
      }
    ],
    "steps": [
      "Cuire sucre, eau et jus de citron à 118–120°C.",
      "Monter les blancs mousseux avec le sel.",
      "Verser le sirop en filet sur les blancs.",
      "Fouetter 5–10min jusqu’à refroidissement, texture lisse, brillante et ferme."
    ],
    "notes": [
      "Verser le sirop lentement.",
      "Fouetter jusqu’à refroidissement complet pour une bonne stabilité."
    ],
    "tags": [
      "meringue",
      "italienne",
      "base",
      "patisserie"
    ],
    "difficultyScore": 6,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "creme_patissiere_vanille": {
    "title": "Crème pâtissière vanille",
    "master": "cremes_maitre",
    "image": "/assets/recipe-images-optimized/creme_patissiere_vanille_spooky.jpg",
    "categories": [
      "Desserts",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "Environ 400g",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g lait",
          "50g jaunes d’œufs",
          "60g sucre",
          "25g Maïzena",
          "25g beurre",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
        ]
      }
    ],
    "steps": [
      "Chauffer le lait avec la vanille.",
      "Fouetter jaunes, sucre et Maïzena.",
      "Verser le lait chaud sur le mélange.",
      "Cuire jusqu’à épaississement.",
      "Ajouter le beurre, filmer au contact et refroidir."
    ],
    "notes": [
      "Base de la crème diplomate vanille.",
      "Lisser au fouet après refroidissement avant incorporation."
    ],
    "tags": [
      "creme",
      "patissiere",
      "vanille",
      "base"
    ],
    "difficultyScore": 5,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "salade_avocat_oeuf_epinards": {
    "title": "Salade avocat, œuf et épinards",
    "master": "crudites_maitre",
    "image": "/assets/recipe-images-optimized/salade_avocat_oeuf_epinards_v4_spooky.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "yield": "2 personnes",
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "200g avocat mûr en dés",
          "100g œufs durs écalés et tranchés",
          "60g pousses d’épinards lavées et séchées",
          "14g huile d’olive",
          "15g jus de citron",
          "2g sel fin",
          "1g poivre du moulin"
        ]
      },
      {
        "group": "Option",
        "items": [
          "120g tomates cerises",
          "30g noix",
          "40g fromage en dés"
        ]
      }
    ],
    "steps": [
      "Cuire les œufs durs, refroidir, écaler et trancher.",
      "Couper l’avocat en dés.",
      "Mélanger pousses d’épinards, avocat et œufs.",
      "Assaisonner avec huile d’olive, jus de citron, sel et poivre du moulin.",
      "Ajouter les options au moment du service si souhaité."
    ],
    "notes": [
      "Servir rapidement après découpe de l’avocat."
    ],
    "tags": [
      "salade",
      "avocat",
      "oeuf",
      "epinards",
      "entree"
    ],
    "difficultyScore": 2
  },
  "apero_maitre": {
    "title": "Apéro",
    "image": "/assets/recipe-images-optimized/parent_apero.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "variants": [
          {
                "id": "aioli_citronne_leger",
                "label": "Aïoli citronné léger"
          },
          {
                "id": "beignets_calamar",
                "label": "Beignets de calamar"
          },
          {
                "id": "beurre_ail",
                "label": "Beurre à l’ail"
          },
          {
                "id": "billes_mozzarella_marinees",
                "label": "Billes de mozzarella marinées"
          },
          {
                "id": "brie_farci_fruits_secs_noix",
                "label": "Brie farci aux fruits secs et noix"
          },
          {
                "id": "brochettes_crevettes_chorizo",
                "label": "Brochettes crevettes chorizo"
          },
          {
                "id": "bruschetta_roquefort_noix",
                "label": "Bruschetta roquefort noix"
          },
          {
                "id": "cake_sale_lardon",
                "label": "Cake salé poitrine fumée"
          },
          {
                "id": "cake_tomate_chorizo_feta",
                "label": "Cake tomate chorizo feta"
          },
          {
                "id": "chorizo_au_cidre",
                "label": "Chorizo au cidre"
          },
          {
                "id": "chou_fleur_croustillant",
                "label": "Chou-fleur croustillant"
          },
          {
                "id": "cookies_sales_variantes",
                "label": "Cookies salés"
          },
          {
                "id": "falafels_four",
                "label": "Falafels au four"
          },
          {
                "id": "gressins_fromage_olives",
                "label": "Gressins fromage olives"
          },
          {
                "id": "houmous_hakocem",
                "label": "Houmous tahine tres cremeux"
          },
          {
                "id": "mojitos_variantes",
                "label": "Mojitos"
          },
          {
                "id": "oeufs_cocotte_chorizo",
                "label": "Oeufs cocotte chorizo"
          },
          {
                "id": "oeufs_mimosa_variantes",
                "label": "Œufs mimosa"
          },
          {
                "id": "pain_grille_beurre_ail_herbes",
                "label": "Pain grillé beurre ail et herbes"
          },
          {
                "id": "pate_lapin_piment_espelette",
                "label": "Pâté de lapin au piment d’Espelette"
          },
          {
                "id": "pate_legere_beignets_calamar_crevettes",
                "label": "Pâte légère à frire"
          },
          {
                "id": "pesto_tomates_sechees_sans_cajou",
                "label": "Pesto tomates séchées"
          },
          {
                "id": "rillettes_porc",
                "label": "Rillettes de porc"
          },
          {
                "id": "rillettes_poulet",
                "label": "Rillettes de poulet"
          },
          {
                "id": "samoussas_boeuf_epinards_petits_pois",
                "label": "Samoussas boeuf epinards petits pois"
          },
          {
                "id": "sauce_yaourt_citronnee",
                "label": "Sauce yaourt citronnée"
          },
          {
                "id": "tempura_beignets_calamar_crevettes",
                "label": "Tempura"
          },
          {
                "id": "terrine_campagne",
                "label": "Terrine de campagne"
          },
          {
                "id": "terrine_porc_pistaches",
                "label": "Terrine de porc aux pistaches"
          },
          {
                "id": "tomates_variantes",
                "label": "Tomates confites et séchées"
          }
    ],
    "technical": [
      {
        "label": "Organisation",
        "value": "Regroupe les recettes faciles à partager avant le repas."
      }
    ],
    "difficulty": "easy",
    "ingredients": [],
    "steps": [],
    "notes": []
  },
  "desserts_cuillere_maitre": {
    "title": "Desserts à la cuillère",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/desserts_cuillere_maitre_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "variants": [
      {
        "id": "mi_cuits_chocolat",
        "label": "Mi-cuits au chocolat"
      },
      {
        "id": "tiramisu_citron",
        "label": "Tiramisu citron meringué"
      },
      {
        "id": "tiramisu_speculoos",
        "label": "Tiramisu spéculoos"
      }
    ],
    "technical": [
      {
        "label": "Service",
        "value": "Desserts servis froids ou crèmeux, dressés en verrine, plat ou coupe."
      }
    ],
    "difficulty": "easy",
    "ingredients": [],
    "steps": [],
    "notes": []
  },
  "tartes_maitre": {
    "title": "Tartes",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/tartes_maitre_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "variants": [
      {
        "id": "tarte_citron_meringuee",
        "label": "Tarte citron meringuée"
      }
    ],
    "technical": [
      {
        "label": "Organisation",
        "value": "Regroupe les fonds, garnitures et montages de tartes."
      }
    ],
    "difficulty": "easy",
    "ingredients": [],
    "steps": [],
    "notes": []
  },
  "crudites_maitre": {
    "title": "Crudités et salades fraîches",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/crudites_maitre_spooky.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "variants": [
      {
        "id": "billes_mozzarella_marinees",
        "label": "Billes de mozzarella marinées"
      },
      {
        "id": "gaspacho_melon",
        "label": "Gaspacho de melon"
      },
      {
        "id": "gazpacho_tomate_menthe_basilic",
        "label": "Gazpacho tomate, menthe et basilic"
      },
      {
        "id": "salade_avocat_oeuf_epinards",
        "label": "Salade avocat, œuf et épinards"
      },
      {
        "id": "salade_melon_mozzarella_jambon_cru",
        "label": "Salade melon, mozzarella et jambon cru"
      }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une recette dans cette fiche."
        ]
      }
    ],
    "steps": [
      "Choisir une recette pour afficher le détail."
    ],
    "notes": [
      "Fiche parent de rangement."
    ]
  },
  "babeurre_maison": {
    "title": "Babeurre",
    "master": "elements_base_maitre",
    "image": "/assets/recipe-images-optimized/babeurre_maison_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "260g environ",
    "aliases": [
      "babeurre",
      "babeurre",
      "buttermilk"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g lait entier",
          "10g jus de citron ou vinaigre"
        ]
      }
    ],
    "steps": [
      "Mélanger le lait et le jus de citron ou le vinaigre.",
      "Laisser reposer 10min à température ambiante.",
      "Utiliser dès que le lait a légèrement épaissi."
    ],
    "notes": [
      "À utiliser dans les pancakes, gaufres ou pâtes levées moelleuses."
    ],
    "tags": [
      "babeurre",
      "lait",
      "base"
    ],
    "difficultyScore": 1
  },
  "tomates_provencales": {
    "title": "Tomates provençales",
    "master": "tomates_maitre",
    "image": "/assets/recipe-images-optimized/tomates_provencales_v4_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Été"
    ],
    "difficulty": "easy",
    "yield": "4 personnes",
    "aliases": [
      "tomates provençales",
      "tomates à la provençale"
    ],
    "ingredients": [
      {
        "group": "Tomates",
        "items": [
          "4 tomates mûres",
          "25g chapelure",
          "15g parmesan râpé",
          "10g persil haché",
          "1 gousse d’ail hachée",
          "20g huile d’olive",
          "2g sel fin",
          "1g poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 180°C.",
      "Couper les tomates en deux, les saler légèrement et les poser dans un plat huilé.",
      "Mélanger chapelure, parmesan, ail, persil, poivre du moulin et un filet d’huile d’olive.",
      "Répartir la persillade sur les tomates.",
      "Cuire 25 à 35min, jusqu’à obtenir des tomates fondantes et un dessus doré."
    ],
    "notes": [
      "Servir chaud, tiède ou en accompagnement d’une viande grillée."
    ],
    "tags": [
      "tomate",
      "provencale",
      "ail",
      "persil",
      "four"
    ],
    "difficultyScore": 2,
    "additionalMasters": [
      "accompagnements_maitre"
    ]
  },
  "tortillas_mexicaines": {
    "title": "Tortillas",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/tortillas_mexicaines_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "8 tortillas",
    "aliases": [
      "tortillas de blé",
      "wraps"
    ],
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "300g farine de blé",
          "5g sel fin",
          "6g levure chimique",
          "45g huile neutre ou huile d’olive",
          "160g eau tiède"
        ]
      }
    ],
    "steps": [
      "Mélanger farine, sel et levure chimique.",
      "Ajouter l’huile puis l’eau tiède progressivement et pétrir jusqu’à obtenir une pâte souple.",
      "Diviser en 8 pâtons, bouler et laisser reposer 20 à 30min sous un linge.",
      "Étaler chaque pâton très finement sur un plan légèrement fariné.",
      "Cuire à la poêle chaude 45 à 60 s par face, sans trop colorer.",
      "Empiler dans un torchon propre pour garder les tortillas souples."
    ],
    "notes": [
      "Si elles sèchent, les réchauffer quelques secondes sous cloche ou dans un torchon humide."
    ],
    "tags": [
      "tortilla",
      "wrap",
      "base",
      "farine"
    ],
    "difficultyScore": 4,
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "mi_cuits_chocolat": {
    "title": "Mi-cuits au chocolat",
    "master": "desserts_cuillere_maitre",
    "image": "/assets/recipe-images-optimized/mi_cuits_chocolat_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "6 portions",
    "aliases": [
      "mi-cuit chocolat",
      "fondant chocolat",
      "coulant chocolat"
    ],
    "ingredients": [
      {
        "group": "Appareil chocolat",
        "items": [
          "200g chocolat noir",
          "120g beurre",
          "165g œufs (3 œufs moyens)",
          "90g sucre",
          "45g farine",
          "1g fleur de sel"
        ]
      },
      {
        "group": "Moules",
        "items": [
          "10g beurre pommade",
          "10g cacao ou farine pour chemiser"
        ]
      }
    ],
    "steps": [
      "Beurrer et chemiser les moules, puis réserver au froid.",
      "Faire fondre doucement le chocolat avec le beurre.",
      "Fouetter les œufs avec le sucre sans trop blanchir.",
      "Incorporer le mélange chocolat-beurre, puis la farine et la fleur de sel.",
      "Remplir les moules aux trois quarts et réserver au froid au moins 1h.",
      "Cuire à four chaud 7 à 10min selon la taille des moules les bords doivent être pris et le centre tremblotant.",
      "Attendre 1min, démouler délicatement et servir aussitôt."
    ],
    "notes": [
      "Le temps de cuisson est le point clé tester un moule avant une série.",
      "Préparation des moules ou ramequins beurre généreusement puis chemise au cacao ou à la farine, sinon les mi-cuits peuvent coller au démoulage."
    ],
    "tags": [
      "chocolat",
      "mi-cuit",
      "fondant",
      "coulant"
    ],
    "difficultyScore": 5,
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "cookies_chocolat_blanc_cranberry": {
    "title": "Cookies chocolat blanc cranberry",
    "master": "cookies_sucres_maitre",
    "image": "/assets/recipe-images-optimized/cookies_chocolat_blanc_cranberry_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "yield": "18 cookies",
    "aliases": [
      "white chocolate cranberry cookies",
      "cookies cranberry chocolat blanc"
    ],
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "115g beurre mou",
          "90g cassonade ou vergeoise",
          "60g sucre blanc",
          "55g œuf (1 œuf moyen)",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille",
          "180g farine",
          "3g bicarbonate",
          "2g sel fin"
        ]
      },
      {
        "group": "Garniture",
        "items": [
          "120g chocolat blanc concassé",
          "90g cranberries séchées"
        ]
      }
    ],
    "steps": [
      "Crémer le beurre mou avec les sucres.",
      "Ajouter l’œuf et la vanille, puis mélanger jusqu’à homogénéité.",
      "Incorporer farine, bicarbonate et sel sans trop travailler.",
      "Ajouter chocolat blanc et cranberries.",
      "Former des boules et laisser reposer au froid au moins 30min.",
      "Cuire 10 à 12min à 175°C, jusqu’à bords pris et centre encore moelleux.",
      "Laisser figer quelques minutes sur plaque avant de déplacer."
    ],
    "notes": [
      "Pour des cookies épais, cuire la pâte bien froide.",
      "Si tu utilises un arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil."
    ],
    "tags": [
      "cookies",
      "chocolat blanc",
      "cranberry",
      "gouter"
    ],
    "difficultyScore": 3,
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "macaron_ourea_pierre_herme": {
    "title": "Macaron Ouréa",
    "master": "biscuits_gouters_maitre",
    "image": "/assets/recipe-images-optimized/macaron_ourea_pierre_herme_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "hard",
    "yield": "20 macarons",
    "aliases": [
      "macaron ouréa",
      "macaron pierre hermé",
      "macarons noisette yuzu"
    ],
    "ingredients": [
      {
        "group": "Coques",
        "items": [
          "150g poudre d’amande",
          "150g sucre glace",
          "55g blancs d’œufs",
          "150g sucre semoule",
          "38g eau",
          "55g blancs d’œufs pour meringue"
        ]
      },
      {
        "group": "Garniture",
        "items": [
          "180g chocolat blanc",
          "90g crème liquide",
          "35g praliné noisette",
          "20g jus de yuzu ou citron",
          "25g noisettes torréfiées concassées"
        ]
      }
    ],
    "steps": [
      "Mixer puis tamiser poudre d’amande et sucre glace.",
      "Mélanger une première pesée de blancs d’œufs avec les poudres pour former une pâte d’amande.",
      "Cuire eau et sucre à 118°C, verser sur les blancs montés et fouetter en meringue italienne tiède.",
      "Macaronner la meringue dans la pâte d’amande jusqu’à obtenir un ruban souple.",
      "Pocher les coques, laisser croûter si nécessaire, puis cuire à 150°C environ 12 à 14min.",
      "Verser la crème chaude sur le chocolat blanc, lisser, puis ajouter praliné et yuzu.",
      "Garnir les coques refroidies, ajouter quelques noisettes, assembler et maturer 24h au frais."
    ],
    "notes": [
      "Recette technique pesées précises, blancs à température ambiante et cuisson régulière."
    ],
    "tags": [
      "macaron",
      "ourea",
      "noisette",
      "yuzu"
    ],
    "difficultyScore": 9,
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "cake_citron": {
    "title": "Cake au citron",
    "master": "biscuits_gouters_maitre",
    "image": "/assets/recipe-images-optimized/cake_citron.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "1 cake, environ 8 à 10 tranches",
    "aliases": [
      "cake citron",
      "cake ultime au citron",
      "gâteau au citron",
      "goûter citron"
    ],
    "tags": [
      "cake",
      "citron",
      "dessert",
      "goûter",
      "glaçage"
    ],
    "allergens": [
      "Gluten",
      "Lait",
      "Œufs"
    ],
    "nutriScore": "D",
    "ingredients": [
      {
        "group": "Cake",
        "items": [
          "200g sucre",
          "120g beurre fondu",
          "Zeste fin d’un citron jaune non traité",
          "165g œufs (environ 3 œufs moyens)",
          "150g farine",
          "1/2 c. à café levure chimique",
          "80g jus de citron"
        ]
      },
      {
        "group": "Glaçage",
        "items": [
          "25g jus de citron",
          "130g sucre glace"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 170°C. Beurrer légèrement le moule ou utiliser un spray de démoulage, puis retirer l’excédent de gras avec un papier absorbant si besoin.",
      "Faire fondre le beurre au bain-marie, le laisser tiédir légèrement, puis le verser dans un bol avec le sucre et le zeste de citron. Mélanger simplement, sans blanchir.",
      "Ajouter les 165g d’œufs, puis mélanger juste assez pour homogénéiser.",
      "Ajouter la farine et la levure chimique. Mélanger sans insister, seulement jusqu’à obtenir une pâte homogène.",
      "Verser les 80g de jus de citron et mélanger jusqu’à obtention d’une pâte lisse. La pâte est fluide, c’est normal.",
      "Verser la pâte dans le moule préparé et lisser légèrement la surface. La pâte doit remplir environ les 3/4 du moule.",
      "Cuire à 170°C pendant 30 à 40min. Le cake doit être légèrement doré et une lame doit ressortir sèche.",
      "Démouler le cake à l’envers sur une grille, l’emballer immédiatement dans du film étirable et le laisser refroidir totalement dans cet emballage.",
      "Mélanger le sucre glace avec les 25g de jus de citron jusqu’à obtenir un glaçage lisse, fluide mais couvrant. Ajuster avec quelques gouttes de citron ou un peu de sucre glace si besoin.",
      "Déballer le cake totalement refroidi, poser une assiette sous la grille, verser le glaçage et lisser en couche fine régulière.",
      "Remettre le cake sur sa grille et sécher le glaçage au four à 100°C pendant 8min. Le glaçage doit être sec et doux au toucher.",
      "Laisser revenir à température ambiante, puis couper en tranches fines ou moyennes."
    ],
    "notes": [
      "Ne pas blanchir beurre et sucre trop fouetter nuit à la texture recherchée.",
      "Préparation du moule si tu utilises un moule classique, beurre et farine-le légèrement avant de verser la pâte.",
      "Le moule ne doit pas être trop grand la pâte doit arriver aux 3/4 de la hauteur pour une belle forme et une cuisson régulière.",
      "Respecter la quantité d’œufs indiquée la précision aide à obtenir une mie qui se tient bien, même en tranches fines.",
      "Surveiller dès 30min une surcuisson dessèche le cake et déséquilibre l’acidité du citron.",
      "Filmer le cake dès la sortie du four retient l’humidité et donne une texture moelleuse, dense et fondante.",
      "Laisser vraiment refroidir le cake avant glaçage, sinon le nappage fond et reste collant.",
      "Le cake est souvent meilleur le lendemain les arômes se stabilisent et la texture se tient encore mieux.",
      "Conservation 3 à 4 jours à température ambiante dans une boîte hermétique ou bien filmé 5 à 6 jours au réfrigérateur, avec une texture un peu plus ferme.",
      "Congélation possible, idéalement sans glaçage ou en tranches bien emballées, jusqu’à 1 à 2 mois."
    ],
    "technical": [
      {
        "label": "Cuisson",
        "value": "30 à 40min à 170°C, puis 8min à 100°C pour sécher le glaçage."
      },
      {
        "label": "Texture cible",
        "value": "Moelleux, légèrement dense, intensément citronné et assez stable pour être tranché finement."
      },
      {
        "label": "Stockage optimal",
        "value": "Conserver entier plutôt qu’en tranches, en boîte hermétique, à température ambiante dans un endroit frais et sec."
      }
    ]
  },
  "churros_maison": {
    "title": "Churros",
    "master": "biscuits_gouters_maitre",
    "image": "/assets/recipe-images-optimized/churros_maison_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "yield": "25 churros",
    "aliases": [
      "churros",
      "churros"
    ],
    "ingredients": [
      {
        "group": "Pâte à churros",
        "items": [
          "245g farine",
          "165g œufs (3 œufs moyens)",
          "2g sel",
          "25g sucre",
          "30g huile neutre",
          "250g eau"
        ]
      },
      {
        "group": "Friture et finition",
        "items": [
          "1 casserole d’huile neutre pour friture",
          "1 bol de sucre en poudre"
        ]
      }
    ],
    "steps": [
      "Porter à ébullition l’eau, l’huile, le sucre et le sel.",
      "Hors du feu, incorporer la farine à la maryse.",
      "Remettre sur feu doux environ 3min pour dessécher la pâte, jusqu’à former une fine pellicule au fond de la casserole.",
      "Transférer dans un bol et travailler quelques minutes pour faire redescendre la température.",
      "Ajouter les œufs battus en 2 fois, en mélangeant jusqu’à obtenir une pâte lisse et souple.",
      "Mettre en poche munie d’une douille étoile.",
      "Chauffer l’huile à 170°C.",
      "Presser des boudins de pâte au-dessus de l’huile et couper des tronçons d’environ 15cm.",
      "Cuire environ 2min de chaque côté, égoutter sur papier absorbant, puis rouler dans le sucre."
    ],
    "notes": [
      "La pâte doit être assez souple pour être pochée mais garder les stries de la douille."
    ],
    "tags": [
      "churros",
      "friture",
      "gouter",
      "sucre"
    ],
    "difficultyScore": 5,
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "sauces_maitre": {
    "title": "Sauces",
    "image": "/assets/recipe-images-optimized/parent_sauces.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "variants": [
      {
        "id": "beurre_d_escargot_persille",
        "label": "Beurre d’escargot persillé"
      },
      {
        "id": "coulis_maitre",
        "label": "Coulis"
      },
      {
        "id": "sauce_chevre_creme",
        "label": "Sauce chevre creme"
      },
      {
        "id": "sauce_mornay",
        "label": "Sauce Mornay"
      },
      {
        "id": "sauce_roquefort",
        "label": "Sauce roquefort"
      },
      {
        "id": "sauce_yaourt_citronnee",
        "label": "Sauce yaourt citronnée"
      },
      {
        "id": "sauces_burger_variantes",
        "label": "Sauces burger"
      },
      {
        "id": "sauces_assaisonnements_maitre",
        "label": "Sauces, pestos et assaisonnements"
      },
      {
        "id": "toppings_frites",
        "label": "Toppings frites"
      }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une sauce dans la fiche."
        ]
      }
    ],
    "steps": [
      "Sélectionner la sauce voulue dans les cartes de recettes."
    ],
    "notes": [
      "Fiche parent pour les sauces, pestos, marinades et assaisonnements."
    ]
  },
  "elements_base_maitre": {
    "title": "Bases",
    "image": "/assets/recipe-images-optimized/parent_base.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "variants": [
      {
        "id": "babeurre_maison",
        "label": "Babeurre"
      },
      {
        "id": "base_pour_flan_sale",
        "label": "Base pour flan salé"
      },
      {
        "id": "bases_salees_maitre",
        "label": "Bases salées"
      },
      {
        "id": "beurre_clarifie",
        "label": "Beurre clarifié"
      },
      {
        "id": "beurre_d_escargot_persille",
        "label": "Beurre d’escargot persillé"
      },
      {
        "id": "cerises_sechees_maison",
        "label": "Cerises séchées"
      },
      {
        "id": "chantilly_maitre",
        "label": "Chantilly"
      },
      {
        "id": "coulis_maitre",
        "label": "Coulis"
      },
      {
        "id": "creme_beurre_meringue_italienne",
        "label": "Crème au beurre meringue italienne"
      },
      {
        "id": "creme_citron_lemon_curd",
        "label": "Crème citron"
      },
      {
        "id": "creme_patissiere_praline",
        "label": "Crème pâtissière praliné"
      },
      {
        "id": "creme_patissiere_vanille",
        "label": "Crème pâtissière vanille"
      },
      {
        "id": "creme_praline",
        "label": "Crème praliné"
      },
      {
        "id": "creme_amande_citron",
        "label": "Fond de tarte amande"
      },
      {
        "id": "compotee_citron",
        "label": "Marmelade citron"
      },
      {
        "id": "meringue_italienne",
        "label": "Meringue italienne"
      },
      {
        "id": "meringues",
        "label": "Meringues"
      },
      {
        "id": "pates_tarte_variantes",
        "label": "Pâtes à tarte"
      },
      {
        "id": "pates_bases_maitre",
        "label": "Pâtes et bases pâtissières"
      }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une base dans la fiche."
        ]
      }
    ],
    "steps": [
      "Sélectionner la base voulue dans les cartes de recettes."
    ],
    "notes": [
      "Fiche parent pour les préparations de base pains, tortillas, pâtes, fonds et supports de recettes."
    ],
    "tags": [
      "base",
      "pâte",
      "pain",
      "tortilla",
      "fond de tarte"
    ]
  },
  "cookies_sucres_maitre": {
    "title": "Cookies sucrés",
    "master": "biscuits_gouters_maitre",
    "image": "/assets/recipe-images-optimized/cookies_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "variants": [
      {
        "id": "cookies_beurre_noisette_chocolat_noir_lait",
        "label": "Cookies au beurre noisette chocolat noir/lait"
      },
      {
        "id": "cookies_chocolat_noir_lait",
        "label": "Cookies au chocolat noir/lait"
      },
      {
        "id": "caramel_cheesecake_cookies",
        "label": "Cookies caramel cheesecake"
      },
      {
        "id": "cookies_cerise_chocolat",
        "label": "Cookies cerise chocolat"
      },
      {
        "id": "cookies_chocolat_blanc_cranberry",
        "label": "Cookies chocolat blanc cranberry"
      },
      {
        "id": "cookies_chocolat_moelleux",
        "label": "Cookies chocolat moelleux"
      },
      {
        "id": "cookies_chocolat_noix",
        "label": "Cookies moelleux aux pépites de chocolat et noix"
      }
    ],
    "ingredients": [
      {
        "group": "Variantes",
        "items": [
          "Choisir une recette de cookies sucrés."
        ]
      }
    ],
    "steps": [
      "Sélectionner la recette de cookies voulue."
    ],
    "notes": [
      "Fiche parent pour garder les cookies sucrés ensemble sans les mélanger aux cookies salés."
    ]
  },
  "cookies_beurre_noisette_chocolat_noir_lait": {
    "title": "Cookies au beurre noisette chocolat noir/lait",
    "master": "cookies_sucres_maitre",
    "image": "/assets/recipe-images-optimized/cookies_beurre_noisette_chocolat_noir_lait_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "8 gros cookies",
    "aliases": [
      "cookies beurre noisette",
      "cookies chunks chocolat",
      "cookies chocolat noir lait",
      "cookies chocolat beurre noisette"
    ],
    "tags": [
      "cookies",
      "beurre noisette",
      "chocolat",
      "gouter"
    ],
    "ingredients": [
      {
        "group": "Beurres",
        "items": [
          "170g beurre doux non salé pour le beurre noisette",
          "55g beurre doux non salé ramolli"
        ]
      },
      {
        "group": "Pâte",
        "items": [
          "100g cassonade ou vergeoise",
          "75g sucre blanc",
          "100g œufs (2 gros œufs)",
          "arôme vanille selon dosage indiqué sur la bouteille",
          "350g farine",
          "2g sel",
          "6g levure chimique",
          "6g maïzena",
          "2g bicarbonate de soude"
        ]
      },
      {
        "group": "Chocolat",
        "items": [
          "200g chocolat noir concassé",
          "200g chocolat au lait concassé",
          "50g pépites de chocolat",
          "Morceaux de chocolat supplémentaires optionnels pour la finition"
        ]
      }
    ],
    "steps": [
      "Mettre les 170g de beurre dans une casserole et chauffer à feu moyen en remuant régulièrement.",
      "Laisser le beurre fondre, mousser puis devenir ambré avec une odeur de noisette.",
      "Retirer du feu dès que le beurre est bien doré, puis verser immédiatement dans un grand saladier pour stopper la cuisson.",
      "Hacher grossièrement le chocolat noir et le chocolat au lait pendant que le beurre noisette tiédit.",
      "Ajouter les 55g de beurre ramolli dans le beurre noisette encore tiède, puis mélanger jusqu’à texture lisse et crémeuse.",
      "Ajouter la cassonade ou vergeoise et le sucre blanc, puis mélanger jusqu’à obtenir une base brillante et homogène.",
      "Incorporer les œufs et l’arôme vanille selon le dosage indiqué sur la bouteille.",
      "Ajouter farine, sel, levure chimique, maïzena et bicarbonate, puis mélanger jusqu’à obtenir une pâte épaisse.",
      "Incorporer le chocolat noir, le chocolat au lait et les pépites sans trop travailler la pâte.",
      "Couvrir et placer la pâte au réfrigérateur 1 à 2h.",
      "Diviser en 8 portions, former des boules et travailler légèrement le dessus aux doigts pour un aspect irrégulier.",
      "Placer les boules au congélateur 15 à 20min.",
      "Préchauffer le four à 180°C, disposer 4 cookies par plaque et cuire 13min.",
      "Passer environ 1min sous le gril pour une finition brillante et légèrement dorée, en surveillant très attentivement.",
      "Dès la sortie du four, reformer les contours avec un cercle à pâtisserie, un emporte-pièce large ou une spatule.",
      "Ajouter quelques morceaux de chocolat sur les cookies chauds si souhaité, puis laisser refroidir complètement sur grille."
    ],
    "notes": [
      "Le mélange chocolat noir et chocolat au lait donne un équilibre gourmand sans être trop amer.",
      "Le beurre noisette apporte une saveur profonde et légèrement caramélisée.",
      "Sors le beurre à ramollir environ 45 à 60min avant, selon la température de la pièce il doit être souple mais pas fondu.",
      "Pour l’arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil.",
      "Ne prolonge pas trop la cuisson les cookies continuent de cuire légèrement hors du four.",
      "La pâte peut être congelée en boules bien emballées, puis cuite plus tard directement depuis le congélateur."
    ],
    "technical": [
      {
        "label": "Beurre noisette",
        "value": "Arrêter la cuisson dès que les particules au fond deviennent ambrées, avant qu’elles ne noircissent."
      },
      {
        "label": "Texture",
        "value": "Le froid et le passage au congélateur aident les cookies à rester épais."
      }
    ],
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "cookies_chocolat_noir_lait": {
    "title": "Cookies au chocolat noir/lait",
    "master": "cookies_sucres_maitre",
    "image": "/assets/recipe-images-optimized/cookies_chocolat_noir_lait_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "environ 20 cookies",
    "aliases": [
      "cookies chocolat classiques",
      "cookies chocolat noir lait",
      "cookies aux deux chocolats",
      "cookies chocolat"
    ],
    "tags": [
      "cookies",
      "chocolat",
      "gouter"
    ],
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "120g cassonade ou vergeoise",
          "120g sucre",
          "175g beurre pommade",
          "55g œuf (1 œuf moyen)",
          "300g farine",
          "6g levure chimique",
          "1 pincée de fleur de sel"
        ]
      },
      {
        "group": "Chocolat",
        "items": [
          "190g chocolat au lait",
          "190g chocolat noir"
        ]
      }
    ],
    "steps": [
      "Sortir le beurre environ 45 à 60min avant, selon la température de la pièce, pour obtenir une texture pommade bien molle mais non fondue.",
      "Mélanger le beurre pommade avec la cassonade ou vergeoise et le sucre dans la cuve d’un robot ou dans un grand saladier.",
      "Fouetter jusqu’à obtenir un mélange homogène.",
      "Ajouter l’œuf, puis mélanger de nouveau.",
      "Ajouter farine, levure chimique et fleur de sel, puis mélanger brièvement sans trop travailler la pâte.",
      "Couper le chocolat au lait et le chocolat noir en gros morceaux.",
      "Incorporer les morceaux de chocolat juste assez pour bien les répartir et absorber toute la farine.",
      "Méthode boules placer la pâte au réfrigérateur au moins 1h, puis former des boules à l’aide d’une cuillère à glace.",
      "Méthode boudins déposer la pâte sur du film alimentaire, former un ou plusieurs boudins, réfrigérer au moins 1h, puis découper des tranches d’environ 1cm.",
      "Préchauffer le four à 170°C.",
      "Déposer les boules ou tranches de pâte sur une plaque recouverte de papier cuisson ou d’un tapis de cuisson, en les espaçant bien.",
      "Cuire 10min les cookies doivent encore être mous à la sortie du four.",
      "Laisser reposer quelques minutes sur la plaque, puis transférer sur grille jusqu’à complet refroidissement."
    ],
    "notes": [
      "Ne fais pas fondre le beurre il doit rester pommade, souple et crémeux.",
      "Ne travaille pas trop la pâte après l’ajout de la farine.",
      "Le repos au froid aide les cookies à garder une belle épaisseur.",
      "Pour des cookies moelleux, ne dépasse pas 10min de cuisson.",
      "Les cookies cuits se conservent plusieurs jours dans une boîte hermétique.",
      "La pâte crue peut être congelée en boudins ou en boules pour une cuisson ultérieure."
    ],
    "technical": [
      {
        "label": "Beurre pommade",
        "value": "Il doit s’écraser facilement à la spatule, sans être liquide."
      },
      {
        "label": "Repos",
        "value": "Une nuit au réfrigérateur fonctionne aussi et donne une pâte plus ferme."
      }
    ],
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "cookies_chocolat_noix": {
    "title": "Cookies moelleux aux pépites de chocolat et noix",
    "master": "cookies_sucres_maitre",
    "image": "/assets/recipe-images-optimized/cookies_chocolat_noix_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 gros cookies",
    "aliases": [
      "cookies chocolat noix",
      "cookies chocolat noisettes",
      "cookies moelleux chocolat noix"
    ],
    "tags": [
      "cookies",
      "chocolat",
      "noix",
      "noisettes",
      "gouter"
    ],
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "100g beurre doux non salé ramolli",
          "80g sucre",
          "1g sel",
          "55g œuf (1 œuf moyen)",
          "arôme vanille selon dosage indiqué sur la bouteille",
          "160g farine",
          "3g levure chimique"
        ]
      },
      {
        "group": "Garniture",
        "items": [
          "100g chocolat en morceaux ou pépites",
          "20g chocolat supplémentaire pour la finition",
          "50g noix ou noisettes concassées"
        ]
      }
    ],
    "steps": [
      "Sortir le beurre environ 45 à 60min avant pour qu’il soit souple mais pas fondu.",
      "Mélanger le beurre ramolli avec le sucre et le sel jusqu’à obtenir une texture homogène.",
      "Battre l’œuf dans un petit bol, puis l’ajouter progressivement au mélange beurre-sucre.",
      "Mélanger jusqu’à incorporation, puis ajouter l’arôme vanille selon le dosage indiqué sur la bouteille.",
      "Ajouter farine et levure chimique, puis mélanger juste assez pour obtenir une pâte homogène sans trop la travailler.",
      "Ajouter les 100g de chocolat et les noix ou noisettes concassées.",
      "Mélanger pour répartir les garnitures dans la pâte.",
      "Couvrir et placer au réfrigérateur pendant 1h pour raffermir la pâte.",
      "Préchauffer le four à 190°C.",
      "Diviser la pâte en 4 portions d’environ 135g et former de grosses boules.",
      "Déposer les boules sur une plaque recouverte de papier cuisson, en les espaçant bien.",
      "Ajouter les 20g de chocolat restant sur le dessus.",
      "Cuire 13 à 14min à 190°C, jusqu’à bords dorés et centre encore légèrement mou.",
      "Laisser reposer quelques minutes sur la plaque, puis transférer sur grille pour finir le refroidissement."
    ],
    "notes": [
      "Pour des cookies plus gourmands, utilise un mélange de chocolat noir et chocolat au lait.",
      "Les noisettes se marient particulièrement bien avec le chocolat.",
      "Pour l’arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil.",
      "Ne prolonge pas trop la cuisson le centre doit rester tendre.",
      "La pâte peut être préparée à l’avance et conservée au frais jusqu’à 24h avant cuisson."
    ],
    "technical": [
      {
        "label": "Portions",
        "value": "Des boules d’environ 135g donnent 4 gros cookies épais."
      },
      {
        "label": "Moelleux",
        "value": "Sortir du four quand le centre paraît encore tendre."
      }
    ],
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "sauces_burger_variantes": {
    "title": "Sauces burger",
    "master": "sauces_maitre",
    "image": "/assets/recipe-images-optimized/sauces_burger_variantes_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "yield": "6 sauces en petites portions",
    "ingredients": [
      {
        "group": "Base commune",
        "items": [
          "Mayonnaise selon la texture souhaitée",
          "Sel, poivre du moulin"
        ]
      },
      {
        "group": "Variante pub sauce",
        "items": [
          "180g mayonnaise",
          "12g cassonade ou vergeoise",
          "30ml sauce Worcestershire",
          "1 c. à café oignon en poudre",
          "1 c. à café ail en poudre"
        ],
        "steps": [
          "Melanger mayonnaise, cassonade, Worcestershire, oignon et ail en poudre.",
          "Fouetter 30s pour dissoudre le sucre, puis rectifier sel et poivre du moulin.",
          "Reserver 20min au frais avant service pour arrondir le gout."
        ]
      },
      {
        "group": "Variante zinger épicée",
        "items": [
          "120g mayonnaise",
          "1 c. à soupe paprika",
          "2 c. à café piment de Cayenne",
          "1 c. à café ail en poudre",
          "1 c. à café oignon en poudre",
          "1/2 c. à café poivre du moulin"
        ],
        "steps": [
          "Melanger mayonnaise, paprika, Cayenne, ail, oignon et poivre du moulin.",
          "Gouter puis ajuster le piment par petites touches.",
          "Reserver 20min au frais; servir avec burger croustillant ou frites chaudes."
        ]
      },
      {
        "group": "Variante miel moutarde",
        "items": [
          "120g mayonnaise",
          "1 c. à soupe moutarde de Dijon",
          "1 c. à café ail en poudre",
          "1/4 c. à café poivre du moulin",
          "1 c. à soupe vinaigre de cidre",
          "2 c. à soupe miel"
        ],
        "steps": [
          "Melanger mayonnaise, moutarde, ail en poudre, poivre du moulin, vinaigre de cidre et miel.",
          "Fouetter jusqu a sauce lisse et brillante.",
          "Reserver 20min au frais, puis ajuster miel ou vinaigre selon l equilibre voulu."
        ]
      },
      {
        "group": "Variante big mac",
        "items": [
          "120g mayonnaise",
          "2 c. à soupe relish de cornichons",
          "1 c. à soupe moutarde jaune",
          "1 c. à café vinaigre blanc",
          "1 c. à café sucre",
          "1/2 c. à café ail en poudre",
          "1/2 c. à café oignon en poudre",
          "1/2 c. à café paprika"
        ],
        "steps": [
          "Melanger mayonnaise, relish, moutarde jaune, vinaigre, sucre, ail, oignon et paprika.",
          "Laisser le sucre se dissoudre puis gouter l acidite.",
          "Reserver 20min au frais pour que le relish parfume toute la sauce."
        ]
      },
      {
        "group": "Variante dipping sauce",
        "items": [
          "120g mayonnaise",
          "1 c. à soupe ketchup",
          "1 c. à soupe moutarde jaune",
          "1 c. à café sauce barbecue",
          "1 c. à café jus de citron"
        ],
        "steps": [
          "Melanger mayonnaise, ketchup, moutarde jaune, sauce barbecue et jus de citron.",
          "Fouetter jusqu a couleur homogene.",
          "Reserver 10 a 20min au frais et servir en dip pour frites ou nuggets."
        ]
      }
    ],
    "steps": [
      "Mélanger les ingrédients de la variante choisie dans un bol.",
      "Ajuster sel, poivre du moulin, acidité et piquant selon le burger ou les frites.",
      "Réserver au frais 20min pour arrondir le goût."
    ],
    "notes": [
      "Conservation 2 à 3 jours au réfrigérateur dans une boîte fermée."
    ],
    "tags": [
      "sauce",
      "burger",
      "dip",
      "frites"
    ],
    "difficultyScore": 2,
    "variantGroups": true
  },
  "pates_tarte_variantes": {
    "title": "Pâtes à tarte",
    "master": "elements_base_maitre",
    "image": "/assets/recipe-images-optimized/pates_tarte_variantes_photo_v2_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "yield": "1 fond de tarte",
    "ingredients": [
      {
        "group": "Variante pâte brisée beurre",
        "items": [
          "300g farine",
          "115g beurre froid",
          "60ml eau glacée",
          "12g sucre",
          "1/4 c. à café sel"
        ],
        "steps": [
          "Sabler farine, sucre, sel et beurre froid du bout des doigts.",
          "Ajouter l eau glacee juste assez pour rassembler la pate sans la petrir.",
          "Former un disque, refroidir 30min, foncer puis cuire a blanc selon la garniture."
        ]
      },
      {
        "group": "Variante biscuit graham",
        "items": [
          "125g biscuits graham émiettés",
          "60g beurre fondu",
          "50g sucre"
        ],
        "steps": [
          "Melanger biscuits graham emiettes, sucre et beurre fondu.",
          "Tasser fermement dans le moule en remontant sur les bords.",
          "Refroidir 20min ou precuire 8 a 10min a 170C pour une base plus solide."
        ]
      },
      {
        "group": "Variante oreo",
        "items": [
          "200g biscuits Oreo écrasés",
          "75g beurre fondu"
        ],
        "steps": [
          "Melanger les Oreo ecrases avec le beurre fondu.",
          "Tasser en couche reguliere dans le moule ou le cercle.",
          "Refroidir 20min ou precuire 8min a 170C si la garniture est humide."
        ]
      },
      {
        "group": "Variante amande",
        "items": [
          "140g poudre d’amande",
          "60g beurre fondu",
          "12g sucre",
          "1/4 c. à café sel"
        ],
        "steps": [
          "Melanger poudre d amande, sucre, sel et beurre fondu.",
          "Tasser la pate dans le moule en epaisseur reguliere.",
          "Refroidir 20min puis precuire 8 a 12min a 170C jusqu a legere coloration."
        ]
      },
      {
        "group": "Variante shortbread",
        "items": [
          "125g farine",
          "60g beurre",
          "30g sucre glace",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
        ],
        "steps": [
          "Cremer beurre, sucre glace et vanille, puis incorporer la farine sans trop travailler.",
          "Tasser ou etaler dans le moule, puis refroidir 30min.",
          "Cuire a blanc a 170C jusqu a blond dore avant de garnir."
        ]
      },
      {
        "group": "Variante cheddar salée",
        "items": [
          "250g farine",
          "90g cheddar râpé",
          "60g beurre",
          "1/4 c. à café sel",
          "45ml eau glacée"
        ],
        "steps": [
          "Sabler farine, sel, beurre et cheddar rape.",
          "Ajouter l eau glacee progressivement pour former une pate souple.",
          "Refroidir 30min, foncer puis precuire jusqu a legere coloration avant garniture salee."
        ]
      },
      {
        "group": "Variante pâte sucrée",
        "items": [
          "250g farine T55",
          "150g beurre souple",
          "95g sucre glace",
          "30g poudre d’amandes ou de noisettes",
          "60g œuf",
          "2 pincées sel fin"
        ],
        "steps": [
          "Assouplir le beurre, puis mélanger avec sucre glace, poudre d’amandes, œuf et sel.",
          "Ajouter la farine et mélanger lentement juste assez pour l’incorporer.",
          "Étaler entre deux feuilles sur 2 à 3mm, refroidir au moins 1h, foncer puis cuire à 170°C selon la tarte."
        ]
      }
    ],
    "steps": [
      "Choisir une variante et mélanger les éléments secs.",
      "Incorporer le beurre ou le liant jusqu’à obtenir une texture sableuse ou compacte selon la variante.",
      "Foncer le moule, réfrigérer 30min, puis cuire à blanc selon la garniture prévue."
    ],
    "notes": [
      "Adapter la cuisson à la garniture précuire pour une crème froide, cuire avec la garniture pour une tarte cuite.",
      "Si tu utilises un arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil.",
      "Conservation pâte crue filmée 24–48h au réfrigérateur ou 2 mois au congélateur fond cuit refroidi en boîte hermétique 2–3 jours au sec."
    ],
    "tags": [
      "pate",
      "tarte",
      "base",
      "fond de tarte"
    ],
    "difficultyScore": 4,
    "aliases": [
      "pate a tarte",
      "fond de tarte",
      "pate brisee",
      "pate sucree"
    ],
    "variantGroups": true
  },
  "caramel_cheesecake_cookies": {
    "title": "Cookies caramel cheesecake",
    "master": "cookies_sucres_maitre",
    "image": "/assets/recipe-images-optimized/cookies_caramel_cheesecake_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "yield": "12 cookies",
    "aliases": [
      "cookies cheesecake caramel",
      "caramel cheesecake cookies"
    ],
    "ingredients": [
      {
        "group": "Fourrage cheesecake",
        "items": [
          "115g fromage frais type Philadelphia (cream cheese)",
          "25g sucre glace",
          "30g <span data-goto=\"sauce_caramel\">sauce caramel</span>"
        ]
      },
      {
        "group": "Pâte à cookies",
        "items": [
          "115g beurre doux mou",
          "100g cassonade ou vergeoise",
          "50g sucre",
          "55g œuf (1 œuf moyen)",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille",
          "220g farine",
          "1/2 c. à café bicarbonate",
          "1/4 c. à café sel"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "<span data-goto=\"sauce_caramel\">Sauce caramel</span>",
          "Fleur de sel"
        ]
      }
    ],
    "steps": [
      "Fouetter le fromage frais type Philadelphia avec le sucre glace et le caramel, puis déposer 12 petites portions sur papier cuisson.",
      "Congeler les portions de fourrage 30min pour pouvoir les enfermer proprement.",
      "Crémer le beurre avec la cassonade ou vergeoise et le sucre, puis incorporer l’œuf et la vanille.",
      "Ajouter farine, bicarbonate et sel sans trop travailler la pâte.",
      "Aplatir une portion de pâte, placer un cœur cheesecake congelé au centre, refermer et bouler.",
      "Cuire à 175°C pendant 10 à 12min, jusqu’à bords légèrement dorés.",
      "Laisser tiédir, ajouter un filet de caramel et une pointe de fleur de sel."
    ],
    "notes": [
      "Le cream cheese correspond à un fromage frais dense et légèrement acidulé, type Philadelphia. Évite le fromage blanc ou le Saint Môret trop souple si tu veux un cœur net.",
      "Bien refermer la pâte autour du fourrage pour éviter les fuites. Conservation 3 jours au réfrigérateur.",
      "Si tu utilises un arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil."
    ],
    "tags": [
      "cookies",
      "caramel",
      "cheesecake"
    ],
    "difficultyScore": 5
  },
  "sauce_caramel": {
    "title": "Sauce caramel",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/sauce_caramel_v4_spooky.jpg",
    "categories": [
      "Sauces",
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "yield": "environ 450g",
    "aliases": [
      "caramel",
      "sauce caramel au beurre",
      "sauce caramel dessert"
    ],
    "ingredients": [
      {
        "group": "Caramel",
        "items": [
          "200g cassonade ou vergeoise",
          "115g beurre doux",
          "1g sel fin"
        ]
      },
      {
        "group": "Crème",
        "items": [
          "120g crème liquide 35 %",
          "120g lait entier",
          "vanille selon goût"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "arôme vanille optionnel selon dosage indiqué sur la bouteille"
        ]
      }
    ],
    "steps": [
      "Mettre la cassonade ou vergeoise, le beurre et le sel dans une casserole.",
      "Chauffer doucement en mélangeant jusqu’à ce que le beurre soit fondu et que le sucre commence à se dissoudre.",
      "Ajouter la crème 35 % et le lait en remuant.",
      "Porter à frémissement doux et cuire 6 à 9min, en mélangeant régulièrement, jusqu’à texture nappante.",
      "Retirer du feu, ajouter la vanille et mélanger.",
      "Laisser tiédir la sauce épaissit en refroidissant.",
      "Mettre en pot propre et conserver au réfrigérateur."
    ],
    "notes": [
      "Pour une sauce plus fluide, ajoute une petite touche de lait chaud après cuisson.",
      "Pour une sauce plus épaisse, prolonge très légèrement la cuisson en surveillant la couleur et la texture.",
      "Si tu utilises un arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil.",
      "Conservation environ 1 semaine au réfrigérateur dans un pot propre fermé."
    ],
    "tags": [
      "sauce",
      "caramel",
      "dessert",
      "cookies"
    ],
    "difficultyScore": 3,
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "sauce_aux_poivres": {
    "title": "Sauce aux poivres",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/sauce_aux_poivres_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "variantGroups": true,
    "aliases": [
      "sauce au poivre",
      "sauce poivre",
      "sauce steak",
      "sauce aux poivres basique"
    ],
    "tags": [
      "sauce",
      "poivre",
      "fond de veau",
      "crème",
      "viande"
    ],
    "ingredients": [
      {
        "group": "Variante haut de gamme",
        "items": [
          "1 c. à café de poivre noir en grains",
          "1 c. à soupe de poivre vert en saumure",
          "1/2 c. à café de poivre blanc ou poivre de Kampot",
          "1 petite échalote",
          "40ml de cognac ou Armagnac",
          "50ml de vin blanc sec ou Madère",
          "250ml de fond de veau brun réduit",
          "120ml de crème liquide entière 30-35 %",
          "30g de beurre froid",
          "1 c. à café d’huile neutre ou graisse de cuisson",
          "Sel fin",
          "Option 1 à 2 c. à soupe de jus de viande"
        ],
        "steps": [
          "Concasser les poivres, ciseler l echalote et faire suer dans huile ou graisse de cuisson.",
          "Flamber au cognac, reduire avec vin blanc ou Madere, puis ajouter le fond de veau reduit.",
          "Cremer, reduire a texture nappante, monter au beurre froid et finir avec poivre vert et jus de viande si disponible."
        ],
        "note": "Cuisson torréfier les poivres 30 à 45 secondes, réduire le fond 8 à 12 minutes, puis réduire avec la crème 4 à 6 minutes."
      },
      {
        "group": "Variante express premium",
        "items": [
          "30ml de cognac",
          "150ml de fond de veau",
          "80ml de crème liquide entière",
          "1 c. à soupe de poivre vert",
          "Poivre noir concassé",
          "20g de beurre froid"
        ],
        "steps": [
          "Reduire le cognac dans la poele ou une petite casserole.",
          "Ajouter fond de veau, creme, poivre vert et poivre concasse, puis mijoter jusqu a texture nappante.",
          "Hors du feu, monter au beurre froid et servir aussitot."
        ],
        "note": "Cuisson déglacer la poêle, ajouter fond, crème et poivres, réduire 5 minutes puis monter au beurre froid."
      },
      {
        "group": "Variante basique",
        "items": [
          "200ml de crème liquide entière",
          "1 à 2 c. à café de poivre noir concassé",
          "1 petite échalote",
          "20g de beurre",
          "30ml de cognac, whisky ou vin blanc",
          "1 c. à café de moutarde",
          "100ml de bouillon de bœuf ou volaille",
          "Sel"
        ],
        "steps": [
          "Faire suer l echalote au beurre, ajouter le poivre concasse puis deglacer au cognac, whisky ou vin blanc.",
          "Ajouter bouillon, creme et moutarde, puis reduire doucement.",
          "Saler en fin de cuisson et servir quand la sauce nappe la cuillere."
        ],
        "note": "Cuisson réduire le bouillon 3 à 5 minutes, puis mijoter avec crème et moutarde 5 à 8 minutes."
      },
      {
        "group": "Variante ultra simple",
        "items": [
          "200ml de crème liquide entière",
          "1 c. à café de moutarde",
          "1 à 2 c. à café de poivre concassé",
          "1/2 cube de bouillon émietté"
        ],
        "steps": [
          "Chauffer la creme avec la moutarde, le poivre concasse et le demi-cube emiette.",
          "Mijoter 3 a 5min en remuant pour dissoudre et epaissir legerement.",
          "Gouter avant de saler, puis servir chaud."
        ],
        "note": "Cuisson chauffer doucement et laisser réduire environ 5 minutes."
      }
    ],
    "steps": [
      "Concasser les poivres au mortier ou avec le fond d’une casserole.",
      "Pour la version haut de gamme, torréfier les poivres à sec 30 à 45 secondes sans les brûler.",
      "Faire suer l’échalote ciselée avec un peu de matière grasse jusqu’à ce qu’elle devienne translucide.",
      "Déglacer avec l’alcool choisi, puis laisser réduire presque à sec.",
      "Ajouter le vin blanc, le Madère ou le bouillon selon la variante, puis réduire pour concentrer le goût.",
      "Ajouter le fond de veau ou le bouillon, puis laisser réduire jusqu’à ce que la sauce commence à napper.",
      "Ajouter la crème et mijoter doucement jusqu’à obtenir une texture onctueuse.",
      "Couper le feu, ajouter le beurre froid en morceaux et fouetter sans refaire bouillir.",
      "Goûter, rectifier le sel et ajuster l’intensité du poivre."
    ],
    "notes": [
      "Texture cible la sauce doit napper le dos d’une cuillère et laisser une trace nette quelques secondes.",
      "Pour une finition plus fine, passer au chinois puis remettre quelques grains de poivre vert dans la sauce filtrée.",
      "Si la sauce est trop épaisse, détends-la avec un peu de fond ou d’eau chaude. Si elle est trop liquide, réduis-la avant d’ajouter le beurre.",
      "Accords filet de bœuf, entrecôte, côte de bœuf, magret de canard, tournedos, pommes dauphines, gratin dauphinois ou frites."
    ],
    "technical": [
      {
        "label": "Poivre",
        "value": "Concasser grossièrement et chauffer brièvement pour réveiller les arômes sans amertume."
      },
      {
        "label": "Réduction",
        "value": "Réduire par étapes pour concentrer sans épaissir lourdement."
      },
      {
        "label": "Finition",
        "value": "Monter au beurre hors du feu pour garder une sauce brillante."
      }
    ]
  },
  "cotelettes_porc_miel_moutarde": {
    "title": "Côtelettes de porc miel moutarde",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cotelettes_porc_miel_moutarde_v4_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 6,
    "yield": "4 personnes",
    "aliases": [
      "côtelette de porc miel moutarde",
      "porc sauce miel moutarde",
      "côtelettes porc cidre moutarde"
    ],
    "tags": [
      "porc",
      "miel",
      "moutarde",
      "cidre",
      "sauce"
    ],
    "ingredients": [
      {
        "group": "Viande",
        "items": [
          "4 côtelettes de porc épaisses de 3 à 4cm",
          "40g de beurre doux",
          "1 c. à soupe d’huile neutre",
          "2 gousses d’ail en chemise",
          "2 branches de thym frais",
          "1 petite branche de romarin",
          "Fleur de sel",
          "Poivre du moulin"
        ],
        "note": "Sortir la viande 45 minutes avant cuisson et bien sécher la surface pour obtenir une vraie coloration."
      },
      {
        "group": "Sauce miel moutarde",
        "items": [
          "2 petites échalotes",
          "2 c. à soupe de miel de fleurs, acacia ou châtaignier doux",
          "2 c. à soupe de moutarde à l’ancienne",
          "1 c. à café de moutarde de Dijon",
          "150ml de cidre brut ou vin blanc sec",
          "250ml de fond de veau ou fond brun de volaille réduit",
          "80 à 100ml de crème liquide entière",
          "1 c. à soupe de vinaigre de cidre",
          "30g de beurre froid",
          "Sel"
        ]
      }
    ],
    "steps": [
      "Sortir les côtelettes du froid 45 minutes avant cuisson, les éponger et les saler légèrement.",
      "Chauffer une grande poêle avec l’huile, puis saisir les côtelettes 2 à 3 minutes par face à feu moyen-vif.",
      "Ajouter le beurre, l’ail, le thym et le romarin, puis arroser la viande 1 à 2 minutes avec le beurre mousseux.",
      "Retirer les côtelettes lorsqu’elles sont bien dorées et les réserver sur une grille ou une assiette.",
      "Retirer l’excès de gras de la poêle en gardant les sucs, puis faire suer les échalotes 2 à 3 minutes.",
      "Ajouter le miel et le laisser mousser 30 à 45 secondes, puis déglacer avec le vinaigre de cidre.",
      "Ajouter le cidre ou le vin blanc et réduire presque à sec.",
      "Verser le fond, réduire jusqu’à une texture légèrement sirupeuse, puis ajouter les moutardes et la crème.",
      "Laisser réduire 3 à 5 minutes à feu doux, puis remettre les côtelettes dans la sauce et napper régulièrement.",
      "Terminer à feu doux jusqu’à 63-65°C à cœur, retirer du feu et laisser reposer 5 minutes.",
      "Retirer les côtelettes, couper le feu, ajouter le beurre froid et fouetter pour lier la sauce."
    ],
    "notes": [
      "La sauce doit napper le dos d’une cuillère sans devenir lourde.",
      "Si la sauce paraît trop ronde, ajoute une micro-touche de vinaigre de cidre ou de jus de citron juste avant le beurre.",
      "Pour des côtelettes très épaisses, tu peux finir au four à 150°C après la saisie, puis servir avec la sauce à part. Surveille la cuisson, car chaque four chauffe différemment.",
      "Garnitures adaptées purée de céleri-rave, pommes Anna, carottes glacées, chou pointu rôti ou écrasé de pommes de terre au beurre noisette."
    ],
    "technical": [
      {
        "label": "Température",
        "value": "Viser 63-65°C à cœur pour garder le porc juteux."
      },
      {
        "label": "Réduction",
        "value": "Réduire le cidre presque à sec pour éviter une sauce trop sucrée."
      },
      {
        "label": "Finition",
        "value": "Monter au beurre hors du feu pour une sauce brillante."
      }
    ]
  },
  "rouille_haut_de_gamme": {
    "title": "Rouille",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/rouille_haut_de_gamme_v4_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "6 à 8 personnes",
    "aliases": [
      "rouille",
      "rouille bouillabaisse",
      "sauce rouille"
    ],
    "tags": [
      "rouille",
      "sauce",
      "safran",
      "ail",
      "bouillabaisse"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "36g jaunes d’œufs (2 jaunes)",
          "2 petites gousses d’ail dégermées",
          "80g de pomme de terre cuite dans le bouillon",
          "1 c. à café de moutarde de Dijon douce",
          "1 belle pincée de safran",
          "1 c. à soupe de bouillon chaud pour infuser le safran",
          "1 c. à café de jus de citron",
          "1 c. à café de vinaigre de Xérès ou vinaigre de vin vieux",
          "1/2 c. à café de piment d’Espelette",
          "Sel fin"
        ]
      },
      {
        "group": "Huiles",
        "items": [
          "180ml d’huile d’olive douce",
          "80ml d’huile neutre"
        ]
      },
      {
        "group": "Option gastronomique",
        "items": [
          "1 c. à soupe de foie de poisson cuit passé au tamis",
          "ou 1 c. à café de bisque très réduite",
          "ou 1 petite pointe de concentré de tomate torréfié"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Quelques gouttes de jus de citron",
          "Une micro-pincée de piment d’Espelette",
          "Un filet d’huile d’olive fruitée"
        ]
      }
    ],
    "steps": [
      "Infuser le safran 10 à 15 minutes dans une cuillère de bouillon chaud.",
      "Dégermer l’ail, puis l’écraser au mortier avec une petite pincée de sel jusqu’à obtenir une pâte fine.",
      "Mélanger la pâte d’ail, les jaunes, la moutarde, la pomme de terre écrasée, l’infusion de safran, le citron, le vinaigre et le piment.",
      "Verser l’huile neutre très progressivement en fouettant comme une mayonnaise.",
      "Ajouter ensuite l’huile d’olive douce en filet, toujours en fouettant, jusqu’à obtenir une texture dense et brillante.",
      "Ajuster la texture avec quelques gouttes de bouillon tiède si elle est trop épaisse, ou un peu de pomme de terre écrasée si elle est trop liquide.",
      "Incorporer l’option gastronomique si souhaité, en petite quantité pour ne pas masquer le bouillon.",
      "Rectifier le sel, le citron et le piment, puis réserver au frais filmé au contact."
    ],
    "notes": [
      "Texture cible ferme, brillante, nappante, assez dense pour tenir sur un croûton et assez souple pour fondre dans le bouillon.",
      "Évite l’huile d’olive trop forte elle peut apporter de l’amertume.",
      "Le safran infusé donne une couleur plus régulière et un parfum plus propre que le safran ajouté à sec.",
      "Pour un rendu plus net, passer la rouille au tamis fin après montage et la dresser en petite quenelle."
    ],
    "technical": [
      {
        "label": "Émulsion",
        "value": "Ajouter l’huile très lentement au départ pour stabiliser la rouille."
      },
      {
        "label": "Relief",
        "value": "Ajuster citron, vinaigre et piment par petites touches."
      },
      {
        "label": "Service",
        "value": "Servir sur croûtons frottés à l’ail ou avec une soupe de poisson très chaude."
      }
    ]
  },
  "bouillabaisse_rouille": {
    "title": "Bouillabaisse",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/bouillabaisse_rouille_v4_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "hard",
    "difficultyScore": 8,
    "yield": "8 personnes",
    "aliases": [
      "bouillabaisse",
      "soupe de poisson rouille",
      "bouillabaisse haut de gamme",
      "bouillabaisse rouille"
    ],
    "tags": [
      "poisson",
      "bouillabaisse",
      "rouille",
      "fenouil",
      "safran"
    ],
    "ingredients": [
      {
        "group": "Poissons",
        "items": [
          "2 daurades royales",
          "2 rougets barbets",
          "2 rascasses de ligne"
        ]
      },
      {
        "group": "Base aromatique",
        "items": [
          "200g de carottes",
          "100g de céleri",
          "150g de poireaux",
          "150g d’oignons",
          "200g de fenouil",
          "500g de tomates mûres",
          "75g de concentré de tomate",
          "2g d’ail",
          "Thym",
          "1 orange",
          "3 étoiles de badiane",
          "8 graines de cardamome",
          "2g de safran"
        ]
      },
      {
        "group": "Liquides",
        "items": [
          "200g de jus de moules",
          "125g de Pernod",
          "500g de fumet de poisson",
          "1,5 L de vin blanc"
        ]
      },
      {
        "group": "Garniture",
        "items": [
          "Pommes de terre",
          "Fenouils",
          "Rouille",
          "Piment d’Espelette",
          "Basilic nain",
          "Huile d’olive pour service"
        ],
        "recipeId": "rouille_haut_de_gamme"
      },
      {
        "group": "Fenouils au curry",
        "items": [
          "Jus de citron",
          "Sel",
          "Curry en poudre",
          "Huile d’olive pour les fenouils"
        ]
      }
    ],
    "steps": [
      "Lever les filets des poissons ou demander au poissonnier de le faire, puis garder arêtes et têtes pour le bouillon.",
      "Retirer les ouïes des têtes si nécessaire, éponger les morceaux et réserver les filets au frais.",
      "Émincer carottes, céleri, poireaux, oignons et fenouil, concasser les tomates, prélever un large zeste d’orange et préparer les épices.",
      "Faire colorer arêtes et têtes de poisson dans une grande marmite avec un filet d’huile d’olive.",
      "Déglacer au Pernod, laisser réduire, puis ajouter le vin blanc et réduire à nouveau.",
      "Ajouter tomates, concentré de tomate, fumet, jus de moules, garniture aromatique, têtes, orange, badiane et cardamome.",
      "Cuire environ 45 minutes à frémissement.",
      "Couper le feu, ajouter le safran et laisser infuser quelques minutes sans forte ébullition.",
      "Filtrer au chinois, presser pour récupérer le jus, puis filtrer une seconde fois si besoin.",
      "Cuire les pommes de terre dans une partie du bouillon safrané, les égoutter puis les poêler rapidement à l’huile d’olive.",
      "Assaisonner les fenouils avec citron, sel, curry et huile d’olive, puis les cuire à la vapeur ou doucement jusqu’à tendreté.",
      "Chauffer les assiettes, disposer poisson, pommes de terre et fenouil, puis verser le bouillon brûlant sur les tranches de poisson.",
      "Ajouter une petite quantité de rouille, du piment d’Espelette, du basilic nain et un filet d’huile d’olive."
    ],
    "notes": [
      "Préparer la <span data-goto=\"rouille_haut_de_gamme\">rouille</span> à part pour garder une texture nette au service.",
      "Le bouillon doit être très chaud pour terminer la cuisson des tranches de poisson dans l’assiette.",
      "Pour des morceaux épais, pocher quelques minutes dans le bouillon à 80-85°C avant dressage.",
      "Le Pernod doit soutenir la note anisée du fenouil sans dominer le poisson."
    ],
    "technical": [
      {
        "label": "Bouillon",
        "value": "Colorer les arêtes avant déglaçage pour donner du relief."
      },
      {
        "label": "Safran",
        "value": "L’infuser hors forte ébullition pour éviter une note médicinale."
      },
      {
        "label": "Service",
        "value": "Servir en assiette chaude avec bouillon brûlant et garnitures séparées."
      }
    ]
  },
  "cookies_chocolat_moelleux": {
    "title": "Cookies chocolat moelleux",
    "master": "cookies_sucres_maitre",
    "image": "/assets/recipe-images-optimized/cookies_chocolat_moelleux_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "environ 72 cookies",
    "aliases": [
      "cookies chocolat",
      "cookies pépites chocolat",
      "cookies moelleux"
    ],
    "tags": [
      "cookies",
      "chocolat",
      "goûter"
    ],
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "250g de sucre",
          "250g cassonade ou vergeoise tassée",
          "340g de beurre mou",
          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille",
          "165g œufs (3 œufs moyens)",
          "530g de farine",
          "2 c. à café de bicarbonate de soude",
          "1/2 c. à café de sel",
          "340 à 680g de pépites de chocolat mi-sucré"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 190°C.",
      "Crémer le sucre, la cassonade ou vergeoise et le beurre mou jusqu’à obtenir une texture légère.",
      "Ajouter la vanille et les œufs, puis mélanger jusqu’à homogénéité.",
      "Incorporer farine, bicarbonate et sel sans trop travailler la pâte.",
      "Ajouter les pépites de chocolat.",
      "Déposer des boules de pâte espacées sur une plaque non graissée.",
      "Cuire 8 à 10 minutes, jusqu’à légère coloration dorée.",
      "Laisser reposer quelques minutes sur plaque puis transférer sur grille."
    ],
    "notes": [
      "Pour des cookies plus chocolatés, utiliser la quantité haute de pépites.",
      "La pâte peut être congelée en boules et cuite après décongélation.",
      "Si tu utilises un arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Ne pas trop cuire les cookies finissent de se raffermir hors du four."
      },
      {
        "label": "Congélation",
        "value": "Congeler les boules de pâte bien emballées pour une cuisson minute."
      }
    ]
  },
  "pancakes_fluffy": {
    "title": "Pancakes fluffy",
    "master": "petit_dejeuner_maitre",
    "image": "/assets/recipe-images-optimized/pancakes_fluffy_v4_spooky.jpg",
    "categories": [
      "Petits-déjeuners"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "6 à 8 pancakes",
    "aliases": [
      "pancakes moelleux",
      "fluffy pancakes",
      "pancakes épais"
    ],
    "tags": [
      "pancakes",
      "petit déjeuner",
      "moelleux"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "60g de jaunes d'œufs (3 jaunes moyens)",
          "105g de blancs d'œufs (3 blancs moyens)",
          "100g de sucre",
          "150g de farine",
          "1 sachet de levure chimique",
          "100ml de lait",
          "vanille selon goût",
          "1 pincée de sel",
          "beurre fondu pour les cercles et la poêle"
        ]
      }
    ],
    "steps": [
      "Séparer les blancs des jaunes.",
      "Fouetter les jaunes avec le sucre jusqu'à obtenir un mélange homogène.",
      "Ajouter le lait et la vanille, puis mélanger.",
      "Incorporer la farine progressivement, ajouter la levure chimique et mélanger jusqu'à obtenir une pâte épaisse.",
      "Monter les blancs en neige avec la pincée de sel.",
      "Incorporer les blancs montés en 3 ou 4 fois avec une spatule, doucement, pour garder une pâte mousseuse.",
      "Beurrer les cercles à pâtisserie et la poêle, puis poser les cercles dans la poêle chaude.",
      "Remplir chaque cercle aux trois quarts avec la pâte.",
      "Cuire environ 5 minutes sur la première face, retourner avec le cercle, puis cuire encore 2 à 3 minutes.",
      "Décoller le pancake du cercle avec la pointe d'un couteau, retirer le cercle et servir avec la garniture choisie."
    ],
    "notes": [
      "Un cercle à pâtisserie aide les pancakes à rester hauts et réguliers.",
      "Sans cercle, la recette fonctionne aussi comme des pancakes classiques, mais ils seront moins hauts.",
      "Tu peux remplacer la gousse par de l'arôme vanille, mais suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil.",
      "Garnitures possibles chocolat fondu, sirop d'érable, caramel ou fruits frais."
    ],
    "technical": [
      {
        "label": "Blancs en neige",
        "value": "Incorporer les blancs délicatement pour ne pas perdre le volume."
      },
      {
        "label": "Cuisson",
        "value": "Feu doux à moyen les pancakes doivent cuire à cœur sans colorer trop vite."
      }
    ]
  },
  "mayonnaise_maison": {
    "title": "Mayonnaise",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/mayonnaise_maison_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "environ 250g",
    "variantGroups": true,
    "aliases": [
      "mayonnaise belge",
      "mayo",
      "sauce mayonnaise",
      "mayonnaise sans oeuf"
    ],
    "tags": [
      "mayonnaise",
      "sauce",
      "frites",
      "sans oeuf"
    ],
    "ingredients": [
      {
        "group": "Base mayonnaise",
        "items": [
          "18g jaune d’œuf (1 jaune)",
          "1 c. à café de moutarde",
          "1 c. à soupe de vinaigre de vin blanc ou jus de citron",
          "200ml d’huile neutre",
          "Sel",
          "Poivre du moulin"
        ],
        "note": "Tous les ingrédients doivent idéalement être à la même température pour faciliter l’émulsion."
      },
      {
        "group": "Variante tartare",
        "items": [
          "Mayonnaise",
          "Câpres hachées",
          "Cornichons hachés",
          "Persil plat",
          "Estragon",
          "Échalote très finement ciselée",
          "Un peu de jus de citron"
        ],
        "steps": [
          "Preparer une mayonnaise ferme.",
          "Ajouter capres, cornichons, persil, estragon, echalote et un peu de jus de citron.",
          "Melanger, gouter l acidite, puis reserver 15min au frais."
        ]
      },
      {
        "group": "Variante andalouse",
        "items": [
          "Mayonnaise",
          "Concentré de tomate légèrement travaillé",
          "Poivron rouge rôti mixé",
          "Paprika fumé",
          "Une pointe de piment",
          "Quelques gouttes de vinaigre"
        ],
        "steps": [
          "Preparer une mayonnaise ferme.",
          "Incorporer concentre de tomate, poivron rouge roti mixe, paprika fume, piment et vinaigre.",
          "Mixer ou fouetter jusqu a sauce homogene, puis reserver au frais."
        ]
      },
      {
        "group": "Variante sans oeuf au lait",
        "items": [
          "60g lait entier froid",
          "120g huile neutre",
          "1 c. à café moutarde",
          "10g jus de citron ou vinaigre",
          "Sel fin",
          "Poivre du moulin"
        ],
        "steps": [
          "Mettre lait froid, moutarde, citron ou vinaigre, sel et poivre du moulin dans un récipient étroit.",
          "Mixer au mixeur plongeant en ajoutant l huile en filet.",
          "Remonter doucement le mixeur quand la sauce épaissit.",
          "Goûter, ajuster acidité et sel, puis réserver au frais 20min."
        ],
        "note": "Texture proche d une mayonnaise légère, pratique quand tu veux une sauce sans oeuf cru."
      }
    ],
    "steps": [
      "Mélanger le jaune d’œuf, la moutarde, le vinaigre ou le citron et une pincée de sel.",
      "Verser l’huile en filet très fin en fouettant constamment.",
      "Continuer jusqu’à obtenir une texture ferme, brillante et nappante.",
      "Rectifier le sel, le poivre du moulin et l’acidité avec citron ou vinaigre.",
      "Pour les variantes, incorporer les garnitures dans la mayonnaise déjà montée."
    ],
    "notes": [
      "Si la mayonnaise tranche, repartir avec un nouveau jaune et incorporer l’ancienne préparation petit à petit.",
      "Pour des frites, garde une texture assez ferme afin que la sauce tienne bien.",
      "À conserver au frais et à consommer rapidement."
    ],
    "technical": [
      {
        "label": "Émulsion",
        "value": "Commencer avec un filet d’huile très fin pour stabiliser la base."
      },
      {
        "label": "Acidité",
        "value": "Ajuster en fin de montage pour équilibrer le gras."
      }
    ]
  },
  "cassolette_crevettes_ravioles_persil": {
    "title": "Cassolette de crevettes et ravioles au persil",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cassolette_crevettes_ravioles_persil.jpg",
    "categories": [
      "Plats",
      "Entrées"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "aliases": [
      "cassolette crevettes ravioles",
      "ravioles au persil crevettes",
      "bisque crémée crevettes"
    ],
    "tags": [
      "crevettes",
      "ravioles",
      "bisque",
      "gratin"
    ],
    "ingredients": [
      {
        "group": "Crevettes",
        "items": [
          "500g de grosses crevettes crues décortiquées",
          "Carapaces et têtes des crevettes, si disponibles",
          "1 filet d'huile d'olive",
          "Sel",
          "Poivre du moulin"
        ]
      },
      {
        "group": "Ravioles",
        "items": [
          "4 plaques de ravioles au persil",
          "Eau salée",
          "Un peu de beurre ou d'huile neutre pour éviter qu'elles collent après cuisson"
        ]
      },
      {
        "group": "Bisque crémée",
        "items": [
          "1 échalote émincée",
          "1 petite carotte en dés",
          "1 c. à soupe de concentré de tomate",
          "5cl de cognac ou armagnac",
          "12cl de vin blanc sec",
          "25cl de fumet de poisson ou bouillon de crustacés",
          "15cl de crème liquide entière",
          "1 pincée de piment d'Espelette",
          "1 petite branche de thym",
          "1 feuille de laurier"
        ]
      },
      {
        "group": "Gratin",
        "items": [
          "30g de parmesan râpé finement",
          "20g de chapelure fine ou panko",
          "15g de beurre froid en petits dés"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Zeste très fin de citron jaune ou vert",
          "Une pointe de piment d'Espelette, facultatif"
        ]
      }
    ],
    "steps": [
      "Mettre les plaques de ravioles au persil au congélateur 15 minutes avant cuisson pour les raffermir.",
      "Chauffer un filet d'huile d'olive dans une casserole, ajouter les carapaces et têtes de crevettes si disponibles, puis faire colorer 4 à 5 minutes à feu vif en les écrasant légèrement.",
      "Ajouter l'échalote, la carotte, le thym et le laurier, puis faire revenir 3 minutes.",
      "Ajouter le concentré de tomate et cuire 1 minute.",
      "Verser le cognac ou l'armagnac, flamber prudemment ou laisser réduire quelques instants.",
      "Ajouter le vin blanc, réduire de moitié, puis verser le fumet de poisson ou le bouillon de crustacés.",
      "Laisser frémir 20 minutes, filtrer en pressant bien les carapaces, puis remettre le jus filtré dans la casserole.",
      "Ajouter la crème liquide et le piment d'Espelette, puis réduire doucement jusqu'à obtenir une sauce nappante. Rectifier en sel et poivre du moulin.",
      "Porter une grande casserole d'eau salée à frémissement, sans gros bouillon.",
      "Cuire les plaques de ravioles 45 secondes à 1 minute maximum, une par une, puis les retirer délicatement avec une écumoire large.",
      "Déposer les ravioles sur une assiette légèrement beurrée ou huilée pour éviter qu'elles collent.",
      "Saisir les crevettes dans une poêle bien chaude avec un filet d'huile d'olive, 45 secondes à 1 minute par face selon leur taille. Saler, ajouter du poivre du moulin et retirer aussitôt.",
      "Déposer une plaque de ravioles cuite dans chaque cassolette, ajouter les crevettes et napper de bisque crémée chaude sans noyer la garniture.",
      "Mélanger le parmesan râpé et la chapelure, parsemer les cassolettes, puis ajouter quelques dés de beurre froid.",
      "Passer sous le gril du four 2 à 3 minutes, juste pour dorer légèrement le dessus.",
      "À la sortie du four, ajouter un zeste très fin de citron jaune ou vert et éventuellement une pointe de piment d'Espelette. Servir immédiatement."
    ],
    "notes": [
      "Les ravioles ne doivent pas cuire dans la sauce elles sont cuites séparément, puis simplement montées dans la cassolette.",
      "Les crevettes doivent rester légèrement nacrées avant le passage sous le gril, sinon elles deviennent fermes.",
      "La sauce doit enrober les ravioles et les crevettes, pas les noyer.",
      "Sans carapaces ni têtes, utilise directement un bon fumet de poisson ou un bouillon de crustacés."
    ],
    "technical": [
      {
        "label": "Bisque",
        "value": "La coloration des carapaces apporte les sucs et la profondeur de goût."
      },
      {
        "label": "Ravioles",
        "value": "Le passage au congélateur les raffermit et limite les déchirures à la cuisson."
      },
      {
        "label": "Gril",
        "value": "Le gratinage doit rester court les ravioles et les crevettes sont déjà cuites."
      }
    ],
    "additionalMasters": [
      "entrees_maitre"
    ]
  },
  "frites_belges": {
    "title": "Frites belges",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/frites_belges_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "aliases": [
      "frites",
      "frites double cuisson",
      "frites belges haut de gamme"
    ],
    "tags": [
      "frites",
      "pomme de terre",
      "double cuisson"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "1,2 à 1,5kg de pommes de terre Bintje, Agria ou Manon",
          "2 à 3kg de blanc de bœuf selon la friteuse",
          "Sel fin",
          "Fleur de sel pour la finition"
        ]
      },
      {
        "group": "Option haut de gamme",
        "items": [
          "1 petite branche de thym",
          "1 gousse d’ail en chemise retirée avant cuisson",
          "Mayonnaise, sauce tartare ou sauce andalouse"
        ],
        "recipeId": "mayonnaise_maison"
      }
    ],
    "steps": [
      "Éplucher les pommes de terre et les tailler en bâtonnets réguliers de 10 à 12mm.",
      "Rincer les frites dans un grand saladier d’eau froide jusqu’à ce que l’eau soit moins trouble.",
      "Égoutter, étaler sur un torchon propre, éponger soigneusement puis laisser sécher 10 à 15 minutes.",
      "Chauffer le blanc de bœuf à 140-150°C.",
      "Plonger les frites par petites quantités et cuire 5 à 7 minutes elles doivent être cuites à cœur mais encore pâles.",
      "Égoutter sur grille et laisser reposer 20 à 30 minutes minimum.",
      "Monter le bain à 175-180°C.",
      "Replonger les frites en petites quantités 2 à 4 minutes jusqu’à belle coloration dorée.",
      "Égoutter immédiatement, secouer légèrement et saler avec du sel fin.",
      "Terminer avec une pincée de fleur de sel et servir aussitôt avec la <span data-goto=\"mayonnaise_maison\">mayonnaise</span>."
    ],
    "notes": [
      "Ne sale jamais avant cuisson le sel attire l’eau et ramollit les frites.",
      "Utilise une grille plutôt que du papier absorbant trop longtemps, car la vapeur piégée peut ramollir les frites.",
      "Le bain ne doit pas être trop chargé une chute de température rend les frites grasses.",
      "Résultat cible extérieur très croustillant, intérieur fondant, belle couleur dorée et aucune sensation grasse."
    ],
    "technical": [
      {
        "label": "Pomme de terre",
        "value": "Bintje, Agria ou Manon donnent une bonne texture pour la double cuisson."
      },
      {
        "label": "Cuisson",
        "value": "Première cuisson fondante, repos, puis seconde cuisson croustillante."
      },
      {
        "label": "Service",
        "value": "Servir immédiatement après salage."
      }
    ],
    "additionalMasters": []
  },
  "pain_hot_dog": {
    "title": "Pain hot dog brioché",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/pain_hot_dog_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "16 pains",
    "aliases": [
      "pain hot dog",
      "pain à hot-dog",
      "bun hot dog"
    ],
    "tags": [
      "pain",
      "base",
      "hot dog",
      "boulangerie"
    ],
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "235g lait entier",
          "120g eau",
          "55g beurre doux",
          "560g farine",
          "25g sucre",
          "9g sel fin",
          "50g œuf entier",
          "8g levure boulangère sèche"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Lait ou 55g œuf battu pour dorer",
          "Graines de sésame optionnelles"
        ]
      }
    ],
    "steps": [
      "Chauffer doucement le lait, l’eau et le beurre jusqu’à environ 50°C, sans dépasser cette température.",
      "Mélanger 220g de farine avec le sel, le sucre et la levure.",
      "Ajouter le mélange liquide tiède, puis l’œuf.",
      "Incorporer le reste de farine progressivement, environ 60g à la fois, jusqu’à obtenir une pâte souple.",
      "Pétrir environ 10min, jusqu’à ce que la pâte devienne élastique et moelleuse.",
      "Diviser en 16 pâtons, former des rectangles, puis rouler chaque pâton en boudin allongé.",
      "Pincer les extrémités et la soudure pour garder une forme régulière.",
      "Laisser lever 25 à 45min selon la température de la pièce.",
      "Cuire à 200°C pendant 10 à 12min, jusqu’à légère coloration.",
      "Refroidir sur grille avant ouverture."
    ],
    "notes": [
      "Pour plus de moelleux, laisser pousser la pâte 1h après pétrissage, dégazer, puis façonner.",
      "Ces pains se congèlent très bien une fois refroidis."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "La pâte doit rester souple, pas sèche ni dure."
      },
      {
        "label": "Façonnage",
        "value": "Souder dessous pour éviter que les pains ne s’ouvrent à la cuisson."
      },
      {
        "label": "Réchauffage",
        "value": "Réchauffer doucement à la vapeur ou quelques secondes avec humidité pour retrouver le moelleux."
      }
    ]
  },
  "oeufs_mimosa_variantes": {
    "title": "Œufs mimosa",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/oeufs_mimosa_variantes_v4_spooky.jpg",
    "categories": [
      "Apéro",
      "Entrées"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "12 demi-œufs",
    "variantGroups": true,
    "aliases": [
      "oeufs mimosa",
      "œufs mimosa betterave",
      "œufs mimosa avocat crevette"
    ],
    "tags": [
      "oeufs",
      "apero",
      "entree",
      "froid"
    ],
    "ingredients": [
      {
        "group": "Base œufs",
        "items": [
          "300g œufs entiers",
          "Eau froide",
          "Glaçons pour refroidissement"
        ]
      },
      {
        "group": "Variante betterave",
        "items": [
          "250g betterave cuite",
          "500g eau",
          "120g vinaigre de cidre",
          "25g sucre",
          "6g sel fin",
          "1 feuille de laurier",
          "Poivre du moulin"
        ],
        "steps": [
          "Porter eau, vinaigre, sucre, sel, laurier et poivre du moulin a fremissement, puis refroidir la marinade.",
          "Ajouter la betterave cuite et les blancs d oeufs cuits, puis laisser colorer au frais.",
          "Garnir les demi-oeufs avec la farce mimosa juste avant service."
        ]
      },
      {
        "group": "Farce betterave",
        "items": [
          "100g jaunes d’œufs cuits",
          "60g mayonnaise",
          "8g moutarde douce",
          "15g crème fraîche épaisse ou yaourt grec",
          "5g vinaigre de cidre ou jus de citron",
          "0,5g paprika fumé ou piment d’Espelette",
          "Sel fin",
          "Poivre du moulin"
        ]
      },
      {
        "group": "Variante avocat crevette",
        "items": [
          "180g chair d’avocat mûr",
          "100g jaunes d’œufs cuits",
          "15 à 30g jus de citron vert",
          "15 à 30g mayonnaise",
          "15g crème fraîche épaisse",
          "5g moutarde douce",
          "0,5g piment d’Espelette",
          "180g crevettes décortiquées et nettoyées",
          "Sel fin",
          "Poivre du moulin"
        ],
        "steps": [
          "Mixer chair d avocat, jaunes cuits, citron vert, mayonnaise, creme, moutarde et piment d Espelette.",
          "Assaisonner, puis garnir les blancs d oeufs avec cette creme.",
          "Ajouter les crevettes decortiquees et servir bien frais."
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Ciboulette ciselée",
          "Aneth ou coriandre",
          "Zeste de citron vert",
          "Graines de sésame noir ou pavot"
        ]
      }
    ],
    "steps": [
      "Placer les œufs dans une casserole, couvrir d’eau froide avec 2 à 3cm au-dessus des œufs, puis cuire 12 à 13min depuis le départ à froid.",
      "Plonger immédiatement dans un bain glacé 10min, puis écaler délicatement.",
      "Pour la variante betterave chauffer betterave, eau, vinaigre, sucre, sel, poivre du moulin et laurier jusqu’à frémissement, couper le feu, infuser 10min, mixer légèrement et refroidir complètement.",
      "Immerger les œufs écalés entiers dans la marinade froide 6 à 12h pour une couleur nette.",
      "Égoutter, éponger, couper en deux et retirer les jaunes.",
      "Pour la farce betterave tamiser les jaunes, mélanger avec mayonnaise, moutarde, crème, vinaigre ou citron, paprika, sel et poivre du moulin.",
      "Pour la variante avocat crevette mixer jaunes, avocat, citron vert, mayonnaise, crème, moutarde, piment, sel et poivre du moulin jusqu’à texture lisse et pochable.",
      "Éponger les crevettes, les assaisonner très légèrement avec citron vert, sel et piment.",
      "Garnir les blancs à la poche, puis terminer avec herbes, zestes et crevettes selon la variante."
    ],
    "notes": [
      "La marinade betterave doit être froide avant contact avec les œufs pour garder une texture propre.",
      "L’avocat oxyde vite préparer la crème au dernier moment ou filmer au contact avec quelques gouttes de citron vert.",
      "Pour un dressage net, éponger les blancs et les crevettes avant de garnir."
    ],
    "technical": [
      {
        "label": "Cuisson œufs",
        "value": "Départ à froid et bain glacé donnent des jaunes fermes et faciles à travailler."
      },
      {
        "label": "Farce",
        "value": "La farce doit être lisse, ferme et pochable."
      }
    ],
    "additionalMasters": [
      "entrees_maitre"
    ]
  },
  "beignets_calamar": {
    "title": "Beignets de calamar",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/beignets_calamar_v4_spooky.jpg",
    "categories": [
      "Apéro",
      "Entrées",
      "Plats"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "variantGroups": true,
    "aliases": [
      "beignets de calamars",
      "calamars frits",
      "beignets calamar"
    ],
    "tags": [
      "calamar",
      "friture",
      "apero",
      "entree"
    ],
    "linkedRecipes": [
      {
        "id": "pate_legere_beignets_calamar_crevettes",
        "role": "Base"
      },
      {
        "id": "aioli_citronne_leger",
        "role": "Sauce"
      },
      {
        "id": "tempura_beignets_calamar_crevettes",
        "role": "Alternative"
      }
    ],
    "ingredients": [
      {
        "group": "Calamars",
        "items": [
          "600g anneaux de calamar",
          "500g lait entier",
          "20g jus de citron",
          "4g ail écrasé",
          "6g sel fin",
          "Poivre du moulin",
          "0,5g piment d’Espelette"
        ]
      },
      {
        "group": "Pâte légère",
        "items": [
          "120g farine",
          "40g fécule de maïs",
          "5g levure chimique",
          "3g sel fin",
          "30g blanc d’œuf",
          "180 à 220g eau gazeuse très froide",
          "20g vodka très froide optionnelle",
          "Zeste de citron"
        ]
      },
      {
        "group": "Aïoli citronné léger",
        "items": [
          "20g jaune d’œuf",
          "10g moutarde",
          "2g ail râpé",
          "10g jus de citron",
          "1g zeste de citron",
          "90g huile neutre",
          "45g huile d’olive douce",
          "Sel fin",
          "0,5g piment d’Espelette"
        ]
      },
      {
        "group": "Variante tempura",
        "items": [
          "90g farine",
          "50g fécule",
          "20g jaune d’œuf",
          "220g eau gazeuse glacée",
          "3g sel fin"
        ],
        "steps": [
          "Melanger farine, fecule et sel, puis ajouter jaune d oeuf et eau gazeuse glacee au dernier moment.",
          "Garder une pate irreguliere et tres froide, puis tremper les calamars bien secs.",
          "Frire immediatement en petites fournees dans une huile chaude jusqu a beignets pales, legers et croustillants."
        ]
      }
    ],
    "steps": [
      "Rincer rapidement les calamars, les éponger, puis couper les tubes en anneaux réguliers de 1 à 1,5cm.",
      "Mélanger lait, citron, ail, sel, poivre du moulin et piment, puis mariner les calamars 30min à 2h au frais.",
      "Préparer l’<span data-goto=\"aioli_citronne_leger\">aïoli citronné léger</span>, puis le garder au frais.",
      "Préparer au dernier moment la <span data-goto=\"pate_legere_beignets_calamar_crevettes\">pâte légère</span> ou la <span data-goto=\"tempura_beignets_calamar_crevettes\">tempura</span>, selon le croustillant voulu.",
      "Égoutter les calamars, les éponger très soigneusement, puis les passer légèrement dans farine ou fécule.",
      "Chauffer l’huile à 180°C.",
      "Tremper les calamars dans la pâte choisie et frire par petites quantités 1min 30 à 2min maximum.",
      "Égoutter sur grille, saler légèrement et servir immédiatement avec citron et sauce."
    ],
    "notes": [
      "Raccourcis <span data-goto=\"pate_legere_beignets_calamar_crevettes\">Pâte légère à frire</span> / <span data-goto=\"aioli_citronne_leger\">Aïoli citronné léger</span> / <span data-goto=\"tempura_beignets_calamar_crevettes\">Tempura</span>.",
      "La pâte doit rester froide, légère et légèrement irrégulière."
    ],
    "technical": [
      {
        "label": "Température",
        "value": "180°C pour saisir vite sans graisser."
      },
      {
        "label": "Égouttage",
        "value": "Préférer une grille au papier pour éviter la vapeur."
      },
      {
        "label": "Texture",
        "value": "Croûte fine et croustillante, calamar tendre."
      }
    ],
    "practical": {
      "equipment": [
        "Casserole ou sauteuse haute",
        "Thermomètre de cuisson",
        "Grille d’égouttage"
      ],
      "storage": [
        "À servir immédiatement après cuisson pour garder le croustillant."
      ],
      "reheating": [
        "Si besoin, réchauffer brièvement au four chaud sur grille, jamais au micro-ondes."
      ],
      "mistakes": [
        "Ne surcharge pas le bain d’huile pour garder une friture nette et non grasse.",
        "Ne prolonge pas la cuisson le calamar devient vite caoutchouteux."
      ],
      "result": [
        "Beignets dorés, croûte fine et croustillante, calamar encore tendre."
      ]
    },
    "additionalMasters": [
      "entrees_maitre",
      "plats_maitre"
    ]
  },
  "gaufres_pommes_terre": {
    "title": "Gaufres de pommes de terre croustillantes",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/gaufres_pommes_terre_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 6,
    "yield": "4 personnes",
    "aliases": [
      "gaufres de pommes de terre",
      "gaufres salées pomme de terre"
    ],
    "tags": [
      "pomme de terre",
      "gaufre",
      "fromage"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "600g pommes de terre Agria, Bintje ou Maris Piper",
          "100g œufs",
          "80g Comté 18 mois ou Gruyère suisse",
          "30g parmesan râpé finement",
          "25g fécule de pomme de terre ou Maïzena",
          "20g farine",
          "20g crème épaisse",
          "40g beurre noisette",
          "4g ail râpé",
          "30g échalote ciselée",
          "3g ciboulette ciselée",
          "3g persil plat ciselé",
          "1 pincée noix de muscade",
          "7g sel fin",
          "Poivre du moulin"
        ]
      },
      {
        "group": "Cuisson",
        "items": [
          "Beurre clarifié ou ghee selon besoin",
          "Quelques gouttes d’huile neutre"
        ]
      },
      {
        "group": "Sauce crème citronnée",
        "items": [
          "150g crème fraîche épaisse",
          "80g yaourt grec",
          "5g jus de citron",
          "Zeste de 1/2 citron",
          "3g ciboulette ciselée pour la sauce",
          "1g aneth ou estragon",
          "Sel fin",
          "Poivre du moulin pour la sauce"
        ]
      },
      {
        "group": "Option luxe",
        "items": [
          "Saumon fumé ou truite fumée",
          "55g œuf poché (1 œuf moyen)",
          "Crème crue et caviar",
          "Jambon cru affiné",
          "Champignons poêlés au beurre noisette"
        ]
      }
    ],
    "steps": [
      "Éplucher les pommes de terre, les râper gros, puis les presser très fort dans un torchon pour retirer un maximum d’eau.",
      "Pré-cuire les pommes de terre râpées 1min 30 au micro-ondes ou 2min à la poêle sans coloration.",
      "Faire un beurre noisette clair avec 40g de beurre, filtrer si besoin et laisser tiédir.",
      "Mélanger pommes de terre, œufs, fromages, fécule, farine, crème, beurre noisette, ail, échalote, herbes, muscade, sel et poivre du moulin.",
      "Préparer la sauce en mélangeant crème, yaourt, citron, zeste, herbes, sel et poivre du moulin, puis réserver au frais.",
      "Préchauffer le gaufrier au maximum et graisser légèrement.",
      "Déposer une portion généreuse d’appareil, tasser légèrement, fermer et cuire 6 à 9min.",
      "Sortir quand la gaufre se détache seule, bien dorée et croustillante.",
      "Option restaurant passer 3 à 5min sur grille au four à 190°C, puis saler légèrement à la fleur de sel.",
      "Servir immédiatement avec sauce crème citronnée et herbes fraîches."
    ],
    "notes": [
      "Moins il reste d’eau dans les pommes de terre, plus les gaufres seront croustillantes.",
      "N’ouvre pas le gaufrier trop tôt la gaufre doit se détacher seule."
    ],
    "technical": [
      {
        "label": "Croustillant",
        "value": "Pressage fort + gaufrier très chaud."
      },
      {
        "label": "Goût",
        "value": "Beurre noisette, fromage affiné, ail doux et herbes fraîches."
      },
      {
        "label": "Service",
        "value": "Servir aussitôt pour garder le contraste croustillant/fondant."
      }
    ]
  },
  "mojitos_variantes": {
    "title": "Mojitos",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/mojitos_variantes_v4_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "6 variantes",
    "variantGroups": true,
    "aliases": [
      "mojito",
      "mojitos",
      "mojito framboise",
      "mojito mangue"
    ],
    "tags": [
      "boisson",
      "cocktail",
      "mojito",
      "apero"
    ],
    "ingredients": [
      {
        "group": "Mojito classique",
        "items": [
          "20g jus de citron vert",
          "5g sucre",
          "50g rhum blanc",
          "5 à 6 feuilles de menthe",
          "80 à 120g eau gazeuse",
          "Glaçons"
        ]
      },
      {
        "group": "Mojito framboise",
        "items": [
          "45g framboises",
          "20g jus de citron vert",
          "5g sucre",
          "50g rhum blanc",
          "5 à 6 feuilles de menthe",
          "80 à 120g eau gazeuse",
          "Glaçons"
        ]
      },
      {
        "group": "Mojito mangue",
        "items": [
          "60g mangue mûre en dés",
          "20g jus de citron vert",
          "5g sucre",
          "50g rhum blanc",
          "5 à 6 feuilles de menthe",
          "80 à 120g eau gazeuse",
          "Glaçons"
        ]
      },
      {
        "group": "Mojito concombre",
        "items": [
          "40g concombre en tranches",
          "20g jus de citron vert",
          "5g sucre",
          "50g rhum blanc",
          "5 à 6 feuilles de menthe",
          "80 à 120g eau gazeuse",
          "Glaçons"
        ]
      },
      {
        "group": "Mojito fruit de la passion",
        "items": [
          "45g pulpe de fruit de la passion",
          "20g jus de citron vert",
          "5g sucre",
          "50g rhum blanc",
          "5 à 6 feuilles de menthe",
          "80 à 120g eau gazeuse",
          "Glaçons"
        ]
      },
      {
        "group": "Mojito rhum ambré",
        "items": [
          "20g jus de citron vert",
          "5g sucre",
          "50g rhum ambré",
          "50g eau gazeuse",
          "5 à 6 feuilles de menthe",
          "Glaçons"
        ]
      }
    ],
    "steps": [
      "Mettre sucre, citron vert, menthe et fruit éventuel dans le verre.",
      "Écraser doucement sans broyer la menthe.",
      "Ajouter le rhum, puis remplir de glaçons.",
      "Compléter avec eau gazeuse bien froide.",
      "Mélanger délicatement de bas en haut et servir immédiatement."
    ],
    "notes": [
      "Écrase doucement la menthe doit parfumer sans devenir amère.",
      "Utilise une eau gazeuse très froide pour garder un cocktail vif.",
      "Pour une version sans alcool, remplace le rhum par la même quantité d’eau gazeuse ou de ginger beer."
    ],
    "technical": [
      {
        "label": "Équilibre",
        "value": "Citron, sucre, menthe et dilution doivent rester nets."
      },
      {
        "label": "Service",
        "value": "Préparer minute pour garder bulles et fraîcheur."
      }
    ]
  },
  "chou_fleur_croustillant": {
    "title": "Chou-fleur croustillant",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/chou_fleur_croustillant_v4_spooky.jpg",
    "categories": [
      "Apéro",
      "Entrées",
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "aliases": [
      "bouchées de chou-fleur croustillant",
      "cauliflower bites"
    ],
    "tags": [
      "chou fleur",
      "legume",
      "apero",
      "four"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "600g sommités de chou-fleur",
          "30g huile d’olive",
          "50g parmesan râpé",
          "2g paprika",
          "2g ail en poudre",
          "2g oignon en poudre",
          "Sel fin",
          "Poivre du moulin"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Sauce yaourt grec ou sauce ranch",
          "5g persil haché optionnel",
          "Quartiers de citron"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 220°C et couvrir une plaque de papier cuisson.",
      "Mélanger les sommités avec l’huile d’olive pour les enrober.",
      "Mélanger parmesan, paprika, ail, oignon, sel et poivre du moulin.",
      "Saupoudrer sur le chou-fleur et mélanger pour bien répartir.",
      "Étaler en une seule couche sur la plaque.",
      "Cuire 25 à 30min en retournant à mi-cuisson, jusqu’à coloration dorée et bords croustillants.",
      "Servir chaud avec sauce et citron."
    ],
    "notes": [
      "Ne surcharge pas la plaque l’humidité empêcherait le croustillant."
    ],
    "technical": [
      {
        "label": "Plaque",
        "value": "Une seule couche pour rôtir au lieu d’étuver."
      },
      {
        "label": "Texture",
        "value": "Bords dorés, cœur tendre, surface légèrement croustillante."
      }
    ],
    "additionalMasters": [
      "entrees_maitre",
      "accompagnements_maitre"
    ]
  },
  "gazpacho_tomate_menthe_basilic": {
    "title": "Gazpacho tomate, menthe et basilic",
    "master": "crudites_maitre",
    "image": "/assets/recipe-images-optimized/gazpacho_tomate_menthe_basilic_spooky.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "environ 1 litre",
    "nutriScore": "A",
    "aliases": [
      "gazpacho tomate",
      "gaspacho tomate menthe basilic",
      "soupe froide tomate"
    ],
    "tags": [
      "gazpacho",
      "tomate",
      "froid",
      "ete",
      "entree"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "880g tomates bien mûres",
          "50 à 70g courgette crue épluchée ou partiellement épluchée",
          "25 à 35g jus de citron",
          "20 à 30g oignon doux",
          "9 à 12g huile d’olive vierge extra",
          "1 à 2g ail dégermé",
          "5g basilic frais",
          "1 à 1,5g menthe fraîche",
          "6 à 8g sel fin",
          "Poivre du moulin",
          "Eau froide seulement si besoin"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Basilic ciselé",
          "Quelques dés de tomate mondée",
          "Filet d’huile d’olive",
          "Petite feuille de menthe"
        ]
      }
    ],
    "steps": [
      "Inciser légèrement la base des tomates, les plonger 15 secondes dans l’eau bouillante, les refroidir dans l’eau glacée, puis retirer la peau.",
      "Couper les tomates en morceaux.",
      "Éplucher partiellement la courgette si sa peau est épaisse, puis la couper en petits morceaux.",
      "Émincer l’oignon doux et retirer le germe de l’ail.",
      "Mixer longuement tomates, courgette, oignon, ail, jus de citron, sel et poivre du moulin jusqu’à texture très lisse.",
      "Ajouter basilic et menthe, puis mixer brièvement pour ne pas chauffer les herbes.",
      "Verser l’huile d’olive en filet pendant que le blender tourne.",
      "Passer au chinois fin en pressant doucement avec une louche.",
      "Réserver au frais au moins 2h, mélanger, puis servir très froid."
    ],
    "notes": [
      "Monder les tomates donne une texture plus fine et plus nette.",
      "Si le gazpacho est trop acide, ajoute un peu de tomate bien mûre ou une pincée de sucre.",
      "Si la texture est trop épaisse, détends avec un peu d’eau froide.",
      "Résultat cible très frais, lisse, dominé par la tomate, légèrement acidulé et parfumé par les herbes."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Mixer longuement, puis filtrer pour un rendu prêt-à-boire premium."
      },
      {
        "label": "Herbes",
        "value": "Mixer brièvement après ajout pour préserver couleur et parfum."
      }
    ]
  },
  "gaspacho_melon": {
    "title": "Gaspacho de melon",
    "master": "crudites_maitre",
    "image": "/assets/recipe-images-optimized/gaspacho_melon_spooky.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "2 petits verres",
    "nutriScore": "A",
    "aliases": [
      "gazpacho melon",
      "gaspacho melon sans concombre",
      "soupe froide melon"
    ],
    "tags": [
      "gaspacho",
      "melon",
      "froid",
      "ete",
      "entree"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "200 à 250g melon",
          "75g tomates jaunes ou tomates bien mûres",
          "12 à 15g mie de pain",
          "20g huile d’olive",
          "8 à 15g jus de citron ou vinaigre de Xérès",
          "Quelques feuilles de basilic ou de menthe",
          "Sel fin",
          "Poivre du moulin",
          "Piment d’Espelette",
          "Eau froide ou glaçons selon texture"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Filet d’huile d’olive",
          "Basilic ou menthe ciselée",
          "Piment d’Espelette pour finition",
          "Mini-billes de melon"
        ]
      }
    ],
    "steps": [
      "Mettre le melon dans un blender avec les tomates, la mie de pain, le jus de citron ou le vinaigre, le sel, le poivre du moulin et le piment.",
      "Ajouter quelques feuilles de basilic ou de menthe.",
      "Mixer longuement jusqu’à texture lisse.",
      "Verser l’huile d’olive en filet pendant que le blender tourne.",
      "Ajuster avec un peu d’eau froide ou quelques glaçons si la texture est trop épaisse.",
      "Passer au chinois fin pour une texture plus nette.",
      "Goûter, ajuster sel, acidité et piment.",
      "Réserver au frais au moins 1h et servir très froid."
    ],
    "notes": [
      "Ce gaspacho doit rester fruité, frais et légèrement acidulé, sans goût dominant de tomate.",
      "Utilise les chutes de melon de la <span data-goto=\"salade_melon_mozzarella_jambon_cru\">salade melon, mozzarella et jambon cru</span> pour éviter le gaspillage."
    ],
    "technical": [
      {
        "label": "Équilibre",
        "value": "Le melon doit dominer, avec tomate et acidité en soutien."
      },
      {
        "label": "Texture",
        "value": "Filtrer pour une bouche plus nette."
      }
    ]
  },
  "salade_melon_mozzarella_jambon_cru": {
    "title": "Salade melon, mozzarella et jambon cru",
    "master": "crudites_maitre",
    "image": "/assets/recipe-images-optimized/salade_melon_mozzarella_jambon_cru_spooky.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "nutriScore": "B",
    "aliases": [
      "salade melon mozzarella",
      "salade melon jambon cru",
      "melon mozzarella jambon"
    ],
    "tags": [
      "salade",
      "melon",
      "mozzarella",
      "jambon cru",
      "entree"
    ],
    "ingredients": [
      {
        "group": "Salade",
        "items": [
          "600 à 800g melon charentais mûr",
          "250g billes de mozzarella ou mozzarella di bufala",
          "120 à 150g jambon cru italien, Serrano, Parme ou San Daniele",
          "80g roquette",
          "40g oignon rouge",
          "Basilic frais",
          "Menthe fraîche",
          "30g pignons de pin ou pistaches",
          "Fleur de sel",
          "Poivre du moulin pour finition"
        ]
      },
      {
        "group": "Marinade mozzarella",
        "items": [
          "55g huile d’olive fruitée",
          "Zeste de 1/2 citron",
          "15g jus de citron",
          "3g basilic ciselé",
          "1g origan ou thym frais",
          "Piment d’Espelette",
          "Sel fin pour marinade",
          "Poivre du moulin pour marinade"
        ]
      },
      {
        "group": "Vinaigrette melon-citron",
        "items": [
          "40g huile d’olive",
          "15g jus de citron ou vinaigre de Xérès",
          "7g miel doux",
          "15 à 30g jus de melon récupéré",
          "Sel fin pour vinaigrette",
          "Poivre du moulin pour vinaigrette"
        ]
      }
    ],
    "steps": [
      "Couper le melon en deux, retirer les graines, puis former des billes avec une cuillère parisienne.",
      "Réserver les billes au frais et garder les chutes pour un gaspacho de melon.",
      "Égoutter et éponger la mozzarella.",
      "Mélanger huile d’olive, jus de citron, zeste, basilic, origan ou thym, piment, sel et poivre du moulin, puis mariner la mozzarella 20 à 30min au frais.",
      "Émincer l’oignon rouge très finement, le placer 10min dans eau froide avec quelques gouttes de citron, puis égoutter et éponger.",
      "Torréfier les pignons ou pistaches 2 à 3min à feu moyen dans une poêle sèche.",
      "Mélanger jus de citron ou vinaigre, miel, jus de melon, sel et poivre du moulin, puis ajouter l’huile d’olive.",
      "Assaisonner légèrement la roquette avec un peu de vinaigrette.",
      "Ajouter melon, mozzarella marinée, jambon cru en chiffonnade, oignon rouge, pignons ou pistaches, basilic, menthe, fleur de sel et poivre du moulin.",
      "Ajouter la vinaigrette juste avant de servir."
    ],
    "notes": [
      "Dresser sans trop mélanger pour garder une salade nette et non détrempée.",
      "La salade doit être fraîche, équilibrée entre sucré, salé et acidité, et parfumée par les herbes.",
      "Options balsamique blanc, copeaux de parmesan, citron caviar, éclats de pistaches ou huile d’olive au basilic."
    ],
    "technical": [
      {
        "label": "Service",
        "value": "Assaisonner au dernier moment pour préserver la roquette et le melon."
      },
      {
        "label": "Anti-gaspillage",
        "value": "Les chutes de melon vont très bien dans le gaspacho de melon."
      }
    ]
  },
  "frites_maison": {
    "title": "Frites",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/frites_maison_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "nutriScore": "D",
    "aliases": [
      "frites classiques",
      "recette frites"
    ],
    "tags": [
      "frites",
      "pomme de terre",
      "accompagnement"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "600g pommes de terre type Bintje",
          "Huile de friture",
          "Sel fin"
        ]
      },
      {
        "group": "Finition optionnelle",
        "items": [
          "Fleur de sel",
          "Poivre du moulin",
          "Sauce au choix"
        ]
      }
    ],
    "steps": [
      "Éplucher les pommes de terre.",
      "Couper les pommes de terre en frites régulières, idéalement avec un coupe-frites.",
      "Rincer les frites à l’eau claire pour retirer l’excès d’amidon.",
      "Égoutter puis sécher très soigneusement dans un torchon propre.",
      "Chauffer l’huile à 160°C et cuire les frites 7 à 8min pour cuire l’intérieur sans forte coloration.",
      "Égoutter sur grille et laisser refroidir.",
      "Monter l’huile à 190°C et cuire 3 à 4min, jusqu’à ce que les frites soient dorées et croustillantes.",
      "Égoutter sur papier absorbant ou, mieux, sur grille.",
      "Saler immédiatement et servir sans attendre."
    ],
    "notes": [
      "Bien sécher les pommes de terre avant friture l’eau fait chuter la température de l’huile et ramollit les frites.",
      "Pour une finition plus nette, laisse refroidir 20 à 30min après le premier bain, puis fais le deuxième bain juste avant le service.",
      "Accompagnements burger, poulet rôti, fish and chips, steak, moules, mayonnaise, ketchup, sauce tartare ou sauce andalouse."
    ],
    "technical": [
      {
        "label": "Pommes de terre",
        "value": "Choisir une variété farineuse comme la Bintje."
      },
      {
        "label": "Cuisson",
        "value": "Premier bain à 160°C, second bain à 190°C."
      },
      {
        "label": "Cible",
        "value": "Dorées, croustillantes dehors, moelleuses dedans, non grasses."
      }
    ],
    "additionalMasters": []
  },
  "toppings_frites": {
    "title": "Toppings frites",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/toppings_frites_spooky.jpg",
    "categories": [
      "Accompagnements",
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "6 idées pour 4 personnes",
    "nutriScore": "D",
    "aliases": [
      "topping frites",
      "garnitures frites",
      "loaded fries"
    ],
    "tags": [
      "frites",
      "toppings",
      "sauce",
      "garniture",
      "accompagnement"
    ],
    "variantGroups": true,
    "ingredients": [
      {
        "group": "Base commune",
        "items": [
          "Frites chaudes"
        ],
        "note": "Préparer des frites belges, des frites ou des frites au four, puis ajouter les toppings juste après cuisson."
      },
      {
        "group": "Variante sel et poivre du moulin",
        "items": [
          "Sel fin",
          "Poivre du moulin",
          "Fleur de sel optionnelle"
        ],
        "steps": [
          "Egoutter les frites tres chaudes et les deposer dans un grand saladier.",
          "Assaisonner aussitot avec sel fin, poivre du moulin et fleur de sel si utilisee.",
          "Secouer 10s pour repartir sans casser, puis servir immediatement."
        ]
      },
      {
        "group": "Variante ail, parmesan et persil",
        "items": [
          "40g parmesan râpé finement",
          "3g ail râpé très finement",
          "6g persil plat haché",
          "15g huile d’olive ou 20g beurre fondu",
          "Sel fin",
          "Poivre du moulin"
        ],
        "steps": [
          "Melanger ail rape avec huile d olive ou beurre fondu.",
          "Verser sur les frites tres chaudes, secouer, puis ajouter parmesan et persil.",
          "Servir tout de suite pour garder le parmesan fondant et les frites croustillantes."
        ]
      },
      {
        "group": "Variante cheddar et oignons verts",
        "items": [
          "120g cheddar râpé",
          "30g oignons verts émincés",
          "Poivre du moulin",
          "Sel fin si nécessaire"
        ],
        "steps": [
          "Deposer les frites chaudes dans un plat compatible four.",
          "Ajouter le cheddar rape et passer 2 a 3min sous le gril ou a 200C pour fondre.",
          "Finir avec oignons verts, poivre du moulin et sel si necessaire, puis servir aussitot."
        ]
      },
      {
        "group": "Sauce cheddar optionnelle",
        "items": [
          "100g cheddar râpé",
          "80g crème liquide",
          "5g moutarde douce"
        ]
      },
      {
        "group": "Variante paprika et cayenne",
        "items": [
          "3g paprika",
          "0,5g piment de Cayenne",
          "1,5g ail en poudre",
          "Sel fin",
          "Poivre du moulin optionnel"
        ],
        "steps": [
          "Melanger paprika, Cayenne, ail en poudre, sel et poivre du moulin dans un bol.",
          "Ajouter ce melange aux frites des la sortie de cuisson.",
          "Secouer rapidement pour enrober uniformement et servir immediatement."
        ]
      },
      {
        "group": "Variante cheddar, bacon et crème aigre",
        "items": [
          "120g cheddar râpé",
          "80g bacon croustillant en morceaux",
          "30g oignons verts émincés",
          "60g crème aigre ou crème fraîche épaisse citronnée",
          "Poivre du moulin"
        ],
        "steps": [
          "Deposer les frites chaudes dans un plat, couvrir de cheddar et faire fondre 2 a 3min sous le gril ou a 200C.",
          "Ajouter bacon croustillant et oignons verts.",
          "Terminer avec creme aigre, poivre du moulin et servir sans attendre."
        ]
      },
      {
        "group": "Crème aigre rapide",
        "items": [
          "100g crème fraîche épaisse",
          "5g jus de citron",
          "1g sel",
          "Poivre du moulin"
        ]
      },
      {
        "group": "Variante patate douce paprika et ail",
        "items": [
          "Frites de patate douce chaudes",
          "3g paprika",
          "1,5g ail en poudre",
          "Sel fin",
          "Poivre du moulin",
          "0,5g piment de Cayenne optionnel"
        ],
        "steps": [
          "Preparer des frites de patate douce bien chaudes.",
          "Melanger paprika, ail en poudre, sel, poivre du moulin et Cayenne optionnel.",
          "Enrober delicatement les frites au dernier moment et servir avec la sauce fraiche conseillee."
        ]
      },
      {
        "group": "Sauce fraîche conseillée",
        "items": [
          "100g yaourt grec",
          "5g jus de citron",
          "7g miel",
          "Sel fin",
          "Poivre du moulin",
          "1g paprika"
        ]
      }
    ],
    "steps": [
      "Préparer une base de frites frites belges ou frites.",
      "Égoutter les frites et ajouter les toppings secs immédiatement tant qu’elles sont très chaudes.",
      "Pour la version ail-parmesan, mélanger ail et huile ou beurre fondu, verser sur les frites, puis ajouter parmesan et persil.",
      "Pour les cheese fries, déposer cheddar sur les frites, passer 2 à 3min sous le gril ou à 200°C, puis ajouter les oignons verts.",
      "Pour la sauce cheddar, chauffer la crème doucement, ajouter cheddar et moutarde, puis mélanger jusqu’à fonte complète.",
      "Pour les frites épicées, mélanger paprika, cayenne, ail en poudre et sel, puis secouer avec les frites chaudes.",
      "Pour les loaded fries, faire fondre le cheddar, puis ajouter bacon, oignons verts, crème aigre et poivre du moulin.",
      "Pour les frites de patate douce, mélanger l’assaisonnement à part puis enrober délicatement au dernier moment.",
      "Servir les sauces à part si tu veux garder un maximum de croustillant."
    ],
    "notes": [
      "Liens utiles <span data-goto=\"frites_belges\">Frites belges</span> · <span data-goto=\"frites_maison\">Frites</span> · <span data-goto=\"frites_patate_douce\">Frites de patate douce</span>.",
      "Ajouter les sauces au dernier moment et éviter de couvrir les frites après topping la vapeur les ramollit.",
      "Le parmesan doit fondre sur les frites chaudes, jamais brûler avant cuisson."
    ],
    "technical": [
      {
        "label": "Croustillant",
        "value": "Toppings secs immédiatement, sauces au dernier moment."
      },
      {
        "label": "Service",
        "value": "Servir très chaud, en gardant les sauces séparées si nécessaire."
      }
    ],
    "additionalMasters": [
      "sauces_maitre"
    ]
  },
  "curry_lentilles_coco": {
    "title": "Curry de lentilles vertes au lait de coco",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/curry_lentilles_coco_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 à 6 personnes",
    "nutriScore": "B",
    "aliases": [
      "curry de lentilles",
      "lentilles vertes lait de coco"
    ],
    "tags": [
      "curry",
      "lentilles",
      "coco",
      "plat",
      "vegetarien"
    ],
    "ingredients": [
      {
        "group": "Lentilles et sauce",
        "items": [
          "250g lentilles vertes",
          "500ml lait de coco entier",
          "600ml bouillon de légumes",
          "150g tomates concassées",
          "120g oignon jaune",
          "30g échalote",
          "10g ail",
          "15g gingembre frais râpé",
          "20g concentré de tomate",
          "30g huile de coco ou huile neutre",
          "Sel fin",
          "Poivre du moulin"
        ]
      },
      {
        "group": "Légumes",
        "items": [
          "300g carottes",
          "200g courgette",
          "80g épinards frais",
          "1 citron vert"
        ]
      },
      {
        "group": "Épices",
        "items": [
          "3g curry doux ou madras",
          "3g curcuma",
          "3g coriandre moulue",
          "1,5g cumin moulu",
          "0,5g cannelle",
          "0,5g cardamome moulue optionnelle",
          "Piment doux ou piment d’Espelette",
          "2g graines de moutarde ou 5g moutarde à l’ancienne optionnelle"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Coriandre fraîche ou basilic thaï",
          "40g noix de cajou torréfiées",
          "Huile pimentée douce optionnelle"
        ]
      },
      {
        "group": "Riz basmati",
        "items": [
          "300g riz basmati",
          "450ml eau",
          "5g sel",
          "Cardamome optionnelle",
          "Zeste de citron vert"
        ]
      }
    ],
    "steps": [
      "Rincer les lentilles à l’eau froide, égoutter et réserver sans trempage pour garder une bonne tenue.",
      "Couper les carottes en petite brunoise ou demi-rondelles fines, la courgette en dés, émincer l’oignon, ciseler l’échalote, puis râper ail et gingembre.",
      "Chauffer une grande sauteuse avec l’huile de coco, ajouter les graines de moutarde si utilisées, puis torréfier curry, curcuma, coriandre, cumin, cannelle, cardamome et piment 30 à 45 secondes.",
      "Ajouter oignon et échalote, faire suer 5 à 7min, puis ajouter ail et gingembre et cuire 1min.",
      "Ajouter le concentré de tomate, cuire 2min, puis ajouter les tomates concassées et réduire 3 à 4min.",
      "Ajouter les lentilles, mélanger pour les enrober, verser le bouillon chaud, porter à frémissement, couvrir à moitié et cuire 20min à feu doux.",
      "Ajouter les carottes et le lait de coco, puis cuire encore 15 à 20min à feu doux.",
      "Ajouter la courgette sur les 8 à 10 dernières minutes, puis les épinards à la toute fin.",
      "Hors du feu, équilibrer avec quelques gouttes de citron vert, un peu de zeste et du poivre du moulin.",
      "Pour le riz, rincer le riz basmati, cuire avec eau, sel et cardamome 10min à feu très doux, puis laisser reposer 10min couvert.",
      "Dresser avec riz, curry, herbes fraîches, noix de cajou torréfiées, citron vert, oignons frits ou échalotes croustillantes et un filet d’huile pimentée si souhaité."
    ],
    "notes": [
      "Garde la courgette à part jusqu’à la fin pour qu’elle reste lisible et ne disparaisse pas dans la sauce.",
      "Les épices doivent sentir bon mais ne doivent pas brûler.",
      "Le citron vert réveille le lait de coco et évite un résultat trop rond.",
      "Résultat cible crémeux mais pas lourd, épicé sans agressivité, lentilles entières, légumes lisibles et finition fraîche."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Sauce crémeuse, lentilles entières, légumes identifiables."
      },
      {
        "label": "Équilibre",
        "value": "Finir avec citron vert et herbes pour alléger le lait de coco."
      }
    ]
  },
  "frites_patate_douce": {
    "title": "Frites de patate douce",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/frites_patate_douce_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "nutriScore": "C",
    "aliases": [
      "frites patate douce",
      "patate douce croustillante",
      "sweet potato fries"
    ],
    "tags": [
      "frites",
      "patate douce",
      "four",
      "accompagnement"
    ],
    "ingredients": [
      {
        "group": "Frites",
        "items": [
          "800g patates douces",
          "30g huile neutre ou huile d’olive douce",
          "12g fécule de maïs ou fécule de pomme de terre",
          "2g paprika fumé",
          "1,5g ail en poudre",
          "1,5g oignon en poudre optionnel",
          "1 petite pincée piment d’Espelette",
          "Poivre du moulin",
          "Sel fin après cuisson",
          "Fleur de sel"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Coriandre, persil plat ou ciboulette ciselée",
          "Zeste de citron vert",
          "Paprika fumé léger"
        ]
      }
    ],
    "steps": [
      "Éplucher les patates douces si la peau est épaisse.",
      "Couper en bâtonnets réguliers de 8 à 10mm d’épaisseur.",
      "Rincer 1 à 2min dans un grand saladier d’eau froide, puis égoutter.",
      "Sécher très soigneusement dans un torchon et laisser sécher 10min à l’air libre.",
      "Enrober les frites avec un voile très fin de fécule, sans paquet blanc visible.",
      "Ajouter l’huile, le paprika fumé, l’ail, l’oignon si utilisé, le piment et le poivre du moulin. Ne pas saler avant cuisson.",
      "Préchauffer le four à 220°C chaleur tournante avec la plaque dans le four.",
      "Disposer les frites espacées sur papier cuisson ou plaque légèrement huilée.",
      "Cuire 20 à 25min en retournant à mi-cuisson, puis prolonger 5min si nécessaire.",
      "Finir 2 à 3min sous le gril pour plus de croustillant en surveillant attentivement.",
      "Laisser reposer 2min sur la plaque, transférer sur grille si possible, puis saler et finir avec herbes, zeste et fleur de sel."
    ],
    "notes": [
      "Servir avec la <span data-goto=\"sauce_yaourt_citronnee\">sauce yaourt citronnée</span> dans un bol à part pour garder le croustillant.",
      "La patate douce contient plus d’eau et de sucre qu’une pomme de terre classique taille régulière, séchage soigné et plaque bien chaude sont essentiels.",
      "Surveille la cuisson tous les fours ne colorent pas de la même façon, surtout en fin de cuisson ou sous le gril."
    ],
    "technical": [
      {
        "label": "Cuisson four",
        "value": "220°C chaleur tournante, 20 à 25min, puis 2 à 3min sous le gril si besoin."
      },
      {
        "label": "Air fryer",
        "value": "200°C, 15 à 20min, panier secoué toutes les 5min."
      },
      {
        "label": "Cible",
        "value": "Bords dorés et croustillants, centre fondant, assaisonnement fumé et sauce fraîche à part."
      }
    ],
    "linkedRecipes": [
      {
        "id": "sauce_yaourt_citronnee",
        "role": "Sauce"
      }
    ],
    "additionalMasters": []
  },
  "sauce_yaourt_citronnee": {
    "title": "Sauce yaourt citronnée",
    "master": "sauces_maitre",
    "image": "/assets/recipe-images-optimized/sauce_yaourt_citronnee_v4_spooky.jpg",
    "categories": [
      "Sauces",
      "Apéro",
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "1 bol",
    "nutriScore": "B",
    "aliases": [
      "sauce yaourt citron",
      "sauce fraîche citronnée",
      "dip yaourt"
    ],
    "tags": [
      "sauce",
      "yaourt",
      "citron",
      "dip"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "150g yaourt grec",
          "15g mayonnaise",
          "5g jus de citron vert ou jaune",
          "Zeste de 1/2 citron vert",
          "7g miel",
          "1g paprika fumé",
          "1 petite pincée piment d’Espelette",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Mélanger le yaourt grec et la mayonnaise.",
      "Ajouter le jus de citron, le zeste, le miel, le paprika fumé et le piment.",
      "Saler et ajouter du poivre du moulin.",
      "Réserver au frais au moins 15min avant service."
    ],
    "notes": [
      "Prévue pour accompagner les <span data-goto=\"frites_patate_douce\">frites de patate douce</span>.",
      "La sauce doit rester fraîche, légèrement acidulée et légèrement fumée pour équilibrer le côté sucré de la patate douce."
    ],
    "technical": [
      {
        "label": "Repos",
        "value": "15min au frais pour arrondir l’assaisonnement."
      },
      {
        "label": "Texture",
        "value": "Crémeuse, nappante, pas liquide."
      }
    ],
    "additionalMasters": [
      "apero_maitre",
      "accompagnements_maitre"
    ]
  },
  "sauce_mornay": {
    "title": "Sauce Mornay",
    "master": "sauces_maitre",
    "image": "/assets/recipe-images-optimized/sauce_mornay_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "1 sauce pour 1 gratin",
    "nutriScore": "D",
    "aliases": [
      "mornay",
      "sauce fromage",
      "sauce gratin"
    ],
    "tags": [
      "sauce",
      "fromage",
      "gratin"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "35g beurre",
          "35g farine",
          "450g lait entier",
          "100g crème liquide entière",
          "90g comté 18 mois râpé",
          "35g parmesan râpé",
          "18g jaune d’œuf (1 jaune)",
          "5g moutarde de Dijon",
          "1 pincée muscade",
          "Sel",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Faire fondre le beurre dans une casserole.",
      "Ajouter la farine et cuire le roux 2min sans coloration.",
      "Verser le lait froid progressivement en fouettant.",
      "Ajouter la crème et cuire 5 à 7min jusqu’à obtenir une sauce nappante.",
      "Hors du feu, ajouter le comté, le parmesan, la moutarde, la muscade et le poivre du moulin.",
      "Goûter avant de saler.",
      "Ajouter le jaune d’œuf hors du feu en fouettant."
    ],
    "notes": [
      "Utilisé par exemple dans le <span data-goto=\"gratin_chou_fleur\">gratin de chou-fleur</span>.",
      "La sauce doit être nappante mais pas trop épaisse elle continue à gratiner au four."
    ],
    "technical": [
      {
        "label": "Roux",
        "value": "2min sans coloration pour éviter le goût de farine."
      },
      {
        "label": "Cuisson",
        "value": "5 à 7min après ajout lait et crème."
      }
    ]
  },
  "gratin_chou_fleur": {
    "title": "Gratin de chou-fleur",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/gratin_chou_fleur_v4_spooky.jpg",
    "categories": [
      "Plats",
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "nutriScore": "C",
    "aliases": [
      "gratin choux fleur",
      "gratin de chou fleur",
      "chou-fleur mornay"
    ],
    "tags": [
      "chou-fleur",
      "gratin",
      "fromage",
      "four"
    ],
    "ingredients": [
      {
        "group": "Chou-fleur",
        "items": [
          "900g à 1kg chou-fleur",
          "30g huile d’olive",
          "20g beurre fondu",
          "Sel fin",
          "Poivre du moulin",
          "1 pincée muscade"
        ]
      },
      {
        "group": "Sauce",
        "items": [
          "1 recette de <span data-goto=\"sauce_mornay\">sauce Mornay</span>"
        ]
      },
      {
        "group": "Chapelure noisette",
        "items": [
          "45g chapelure panko ou chapelure",
          "25g noisettes torréfiées concassées",
          "20g parmesan râpé",
          "25g beurre fondu",
          "8g persil plat haché"
        ]
      }
    ],
    "steps": [
      "Couper le chou-fleur en sommités régulières et garder le cœur épluché en petits morceaux.",
      "Rincer rapidement puis égoutter très soigneusement.",
      "Cuire les sommités 5 à 6min à la vapeur, ou 6 à 8min dans une eau-lait salée, en gardant le chou-fleur ferme.",
      "Préchauffer le four à 220°C.",
      "Mélanger le chou-fleur avec huile d’olive, beurre fondu, sel, poivre du moulin et muscade.",
      "Étaler sur plaque et rôtir 15 à 20min jusqu’à légère coloration.",
      "Préparer la <span data-goto=\"sauce_mornay\">sauce Mornay</span>.",
      "Mélanger chapelure, noisettes, parmesan, persil et beurre fondu jusqu’à texture sableuse.",
      "Beurrer légèrement un plat, disposer le chou-fleur rôti, napper de sauce Mornay et couvrir de chapelure noisette.",
      "Enfourner à 190°C pendant 18 à 22min.",
      "Terminer sous le gril 2 à 3min si besoin, puis laisser reposer 5min avant service."
    ],
    "notes": [
      "La <span data-goto=\"sauce_mornay\">sauce Mornay</span> doit rester nappante, pas trop épaisse, pour éviter un gratin pâteux.",
      "Beurre légèrement le plat avant montage la sauce accroche moins et le service est plus propre.",
      "Rôtir le chou-fleur concentre le goût et évite un gratin aqueux.",
      "Surveille la cuisson chaque four gratine différemment, surtout sous le gril."
    ],
    "technical": [
      {
        "label": "Pré-cuisson",
        "value": "5 à 6min vapeur ou 6 à 8min eau-lait, chou-fleur encore ferme."
      },
      {
        "label": "Gratin",
        "value": "190°C, 18 à 22min, puis gril 2 à 3min si besoin."
      },
      {
        "label": "Cible",
        "value": "Dessus doré et croustillant, intérieur crémeux mais non liquide."
      }
    ],
    "additionalMasters": [
      "accompagnements_maitre"
    ]
  },
  "pains_burgers_brioche": {
    "title": "Pains burgers briochés",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/pains_burgers_brioche_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "8 pains",
    "nutriScore": "C",
    "aliases": [
      "pain burger brioché",
      "pains burger",
      "buns burger",
      "buns briochés"
    ],
    "tags": [
      "pain",
      "burger",
      "buns",
      "boulangerie",
      "base"
    ],
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "500g farine T55",
          "25 à 30g levure fraîche de boulanger ou 10 à 12g levure sèche active",
          "10g sel fin",
          "25g sucre",
          "200g eau tiède",
          "80g lait tiède",
          "60g œuf entier battu",
          "30g beurre doux ramolli"
        ]
      },
      {
        "group": "Dorure",
        "items": [
          "18g jaune d’œuf (1 jaune)",
          "15g eau",
          "1 petite pincée sel optionnelle"
        ]
      },
      {
        "group": "Finition",
        "items": [
          "Graines de sésame torréfiées",
          "Ou graines de pavot",
          "Ou graines de tournesol"
        ]
      }
    ],
    "steps": [
      "Peser tous les ingrédients, couper le beurre en petits morceaux et le laisser ramollir.",
      "Battre légèrement l’œuf entier et préparer la dorure avec le jaune d’œuf et l’eau.",
      "Verser la farine dans la cuve du batteur, ajouter le sel et le sucre, puis mélanger rapidement.",
      "Mélanger l’eau tiède et le lait tiède, ajouter la levure et laisser reposer 10min à température ambiante.",
      "Pétrir à vitesse lente en versant le mélange eau, lait et levure, puis ajouter l’œuf battu.",
      "Ajouter le beurre ramolli et pétrir environ 5min à vitesse assez élevée, jusqu’à ce que la pâte se décolle des parois.",
      "Transvaser dans un saladier, couvrir et laisser pousser 2h à température ambiante ou autour de 25 à 28°C.",
      "Dégazer doucement, peser la pâte et diviser en 8 pâtons réguliers.",
      "Bouler chaque pâton avec la soudure dessous pour tendre la surface et obtenir un bun bien rond.",
      "Déposer sur plaque avec papier cuisson, bien espacer, couvrir légèrement et laisser pousser 1h.",
      "Dorer délicatement au pinceau sans appuyer, puis ajouter les graines.",
      "Cuire à 200°C chaleur tournante pendant 10 à 12min, jusqu’à coloration dorée.",
      "Laisser refroidir sur grille avant de couper ou congeler."
    ],
    "notes": [
      "Le beurre doit être souple, pas fondu un beurre fondu rend la pâte moins régulière.",
      "Évite le contact direct concentré entre sel et levure, qui peut ralentir la pousse.",
      "Ne rajoute pas trop de farine si la pâte colle un peu une pâte trop farinée donne des buns secs et denses.",
      "Pour un rendu restaurant, toaster les faces coupées à la poêle avec un peu de beurre juste avant montage.",
      "Surveille la cuisson tous les fours colorent différemment, et les buns doivent rester moelleux."
    ],
    "technical": [
      {
        "label": "Pousse",
        "value": "2h première pousse, puis 1h après façonnage."
      },
      {
        "label": "Cuisson",
        "value": "200°C chaleur tournante, 10 à 12min."
      },
      {
        "label": "Conservation",
        "value": "24h bien emballés ou congélation après refroidissement."
      },
      {
        "label": "Cible",
        "value": "Buns ronds, dorés, souples, moelleux et assez solides pour tenir la garniture."
      }
    ]
  },
  "pate_legere_beignets_calamar_crevettes": {
    "title": "Pâte légère à frire",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/pate_legere_beignets_calamar_crevettes_spooky.jpg",
    "categories": [
      "Base",
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "pâte légère beignets",
      "pâte à beignets calamars",
      "pâte à beignets crevettes",
      "pâte friture légère"
    ],
    "tags": [
      "pâte",
      "beignet",
      "calamar",
      "crevette",
      "friture"
    ],
    "linkedRecipes": [
      {
        "id": "beignets_calamar",
        "role": "Utilisation"
      },
      {
        "id": "aioli_citronne_leger",
        "role": "Sauce"
      },
      {
        "id": "tempura_beignets_calamar_crevettes",
        "role": "Alternative"
      }
    ],
    "ingredients": [
      {
        "group": "Pâte légère",
        "items": [
          "120g farine",
          "40g fécule de maïs",
          "5g levure chimique",
          "3g sel fin",
          "30g blanc d’œuf",
          "180 à 220g eau gazeuse très froide",
          "20g vodka très froide optionnelle",
          "Zeste de citron"
        ]
      }
    ],
    "steps": [
      "Mélanger farine, fécule, levure, sel et zeste.",
      "Juste avant cuisson, ajouter blanc d’œuf, eau gazeuse très froide et vodka très froide optionnelle.",
      "Mélanger très peu pour garder une pâte froide, légère et légèrement irrégulière.",
      "Utiliser aussitôt pour enrober des calamars, des crevettes ou une autre garniture à frire."
    ],
    "notes": [
      "La pâte doit rester très froide jusqu’au dernier moment.",
      "La vodka est optionnelle, elle aide surtout à obtenir une friture plus sèche et légère.",
      "Raccourci <span data-goto=\"beignets_calamar\">Beignets de calamar</span>."
    ],
    "technical": [
      {
        "label": "Température",
        "value": "Travailler avec eau gazeuse très froide et frire à 180°C."
      },
      {
        "label": "Texture",
        "value": "Mélanger court pour garder une pâte fine et non élastique."
      },
      {
        "label": "Usage",
        "value": "Préparer au dernier moment puis cuire par petites quantités."
      }
    ],
    "practical": {
      "equipment": [
        "Cul-de-poule très froid",
        "Fouet",
        "Casserole ou sauteuse haute"
      ],
      "storage": [
        "À utiliser aussitôt, la pâte perd sa légèreté en attente."
      ],
      "mistakes": [
        "Ne mélange pas trop la pâte.",
        "Ne prépare pas la pâte longtemps avant la cuisson."
      ],
      "result": [
        "Pâte froide, fluide, légère et légèrement irrégulière."
      ]
    },
    "additionalMasters": [
      "apero_maitre"
    ]
  },
  "aioli_citronne_leger": {
    "title": "Aïoli citronné léger",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/aioli_citronne_leger_spooky.jpg",
    "categories": [
      "Sauces",
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "aliases": [
      "aïoli citronné",
      "aioli citronné",
      "aïoli léger",
      "sauce citronnée pour beignets"
    ],
    "tags": [
      "aïoli",
      "citron",
      "ail",
      "sauce",
      "friture"
    ],
    "linkedRecipes": [
      {
        "id": "beignets_calamar",
        "role": "Servir avec"
      },
      {
        "id": "pate_legere_beignets_calamar_crevettes",
        "role": "Base"
      },
      {
        "id": "tempura_beignets_calamar_crevettes",
        "role": "Alternative"
      }
    ],
    "ingredients": [
      {
        "group": "Aïoli citronné léger",
        "items": [
          "20g jaune d’œuf",
          "10g moutarde",
          "2g ail râpé",
          "10g jus de citron",
          "1g zeste de citron",
          "90g huile neutre",
          "45g huile d’olive douce",
          "Sel fin",
          "0,5g piment d’Espelette"
        ]
      }
    ],
    "steps": [
      "Fouetter le jaune d’œuf avec la moutarde, l’ail râpé, le jus de citron, le zeste de citron et une pincée de sel.",
      "Monter avec l’huile neutre puis l’huile d’olive douce versées en filet.",
      "Corriger le sel et le piment d’Espelette, puis garder au frais jusqu’au service."
    ],
    "notes": [
      "La texture doit rester nappante et légère, pas trop serrée.",
      "Servir avec des beignets de calamar, des crevettes frites ou des légumes croustillants.",
      "Raccourci <span data-goto=\"beignets_calamar\">Beignets de calamar</span>."
    ],
    "technical": [
      {
        "label": "Émulsion",
        "value": "Verser les huiles lentement au départ pour stabiliser la sauce."
      },
      {
        "label": "Équilibre",
        "value": "Le citron doit relever la friture sans rendre la sauce trop acide."
      }
    ],
    "practical": {
      "equipment": [
        "Bol stable",
        "Fouet"
      ],
      "storage": [
        "Garder au frais jusqu’au service."
      ],
      "mistakes": [
        "Verse les huiles lentement au départ pour éviter de casser l’émulsion."
      ],
      "result": [
        "Sauce nappante, citronnée, légère et stable."
      ]
    },
    "additionalMasters": [
      "apero_maitre"
    ]
  },
  "tiramisu_citron": {
    "title": "Tiramisu citron meringué",
    "master": "desserts_cuillere_maitre",
    "image": "/assets/recipe-images-optimized/tiramisu_citron_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "6 personnes",
    "aliases": [
      "tiramisu au citron",
      "tiramisu citron meringué",
      "tiramisu citron mascarpone",
      "dessert citron sans cuisson"
    ],
    "tags": [
      "tiramisu",
      "citron",
      "meringue italienne",
      "mascarpone",
      "dessert froid"
    ],
    "ingredients": [
      {
        "group": "Crème citron",
        "items": [
          "250g mascarpone",
          "3 œufs",
          "90g sucre",
          "2 c. à soupe de Grand Marnier optionnelles",
          "2 citrons jaunes non traités",
          "1 pincée de sel"
        ]
      },
      {
        "group": "Montage",
        "items": [
          "18 à 24 biscuits à la cuillère",
          "120g eau",
          "40g sucre",
          "40g jus de citron",
          "20g Grand Marnier optionnel",
          "Zeste de citron pour finir"
        ]
      },
      {
        "group": "Finition optionnelle",
        "items": [
          "Fine couche de lemon curd",
          "<span data-goto=\"meringue_italienne\">Meringue italienne</span>"
        ]
      }
    ],
    "steps": [
      "Préparer un sirop avec l’eau, le sucre et le jus de citron, puis laisser refroidir. Ajouter le Grand Marnier du sirop si utilisé.",
      "Séparer les œufs. Fouetter les jaunes avec le sucre et les 2 c. à soupe de Grand Marnier optionnelles jusqu’à blanchiment.",
      "Ajouter le mascarpone, le zeste fin des citrons et un filet de jus de citron.",
      "Monter les blancs avec une pincée de sel, puis les incorporer délicatement à la crème.",
      "Tremper rapidement les biscuits dans le sirop citronné et les ranger dans un plat ou des verrines.",
      "Alterner biscuits et crème, terminer par une couche de crème et réserver au frais au moins 4h.",
      "Option ajouter une fine couche de lemon curd sur le dessus.",
      "Option pocher une couche de <span data-goto=\"meringue_italienne\">meringue italienne</span>, puis la brûler légèrement au chalumeau.",
      "Finir avec un peu de zeste de citron juste avant de servir."
    ],
    "notes": [
      "Pour une version plus vive, ajouter une fine couche de lemon curd.",
      "La <span data-goto=\"meringue_italienne\">meringue italienne</span> doit être brûlée rapidement au chalumeau pour colorer sans réchauffer tout le tiramisu.",
      "Repos idéal une nuit au réfrigérateur."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Incorporer les blancs sans casser la mousse pour garder une crème légère."
      },
      {
        "label": "Trempage",
        "value": "Tremper très vite les biscuits continuent de s’humidifier pendant le repos."
      }
    ],
    "practical": {
      "equipment": [
        "Fouet",
        "Saladiers",
        "Plat ou verrines",
        "Poche à douille optionnelle",
        "Chalumeau optionnel"
      ],
      "storage": [
        "24 à 48h au réfrigérateur, bien filmé."
      ],
      "mistakes": [
        "Ne surcharge pas en jus de citron dans la crème elle peut se détendre.",
        "Ne trempe pas trop les biscuits.",
        "Le sirop doit être froid pour ne pas détremper les biscuits."
      ],
      "result": [
        "Dessert frais, mousseux, citronné et sans cuisson."
      ]
    },
    "additionalMasters": [
      "desserts_maitre"
    ]
  },
  "pesto_tomates_sechees_sans_cajou": {
    "title": "Pesto tomates séchées",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/pesto_tomates_sechees_sans_cajou_spooky.jpg",
    "categories": [
      "Sauces",
      "Apéro",
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "1 pot",
    "aliases": [
      "pesto rosso",
      "pesto tomates séchées",
      "pesto rouge"
    ],
    "tags": [
      "pesto",
      "tomates séchées",
      "sauce",
      "apero",
      "accompagnement"
    ],
    "ingredients": [
      {
        "group": "Pesto",
        "items": [
          "180g tomates séchées égouttées",
          "40g parmesan râpé",
          "25g pignons de pin ou graines de tournesol",
          "1 petite gousse d’ail",
          "10g basilic",
          "70g huile d’olive",
          "15g jus de citron",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Égoutter les tomates séchées en gardant un peu d’huile si elles sont conservées dans l’huile.",
      "Mixer tomates, parmesan, pignons ou graines, ail, basilic, jus de citron et poivre du moulin.",
      "Ajouter l’huile d’olive progressivement jusqu’à obtenir une texture tartinable.",
      "Corriger l’assaisonnement et détendre avec un filet d’eau ou d’huile si nécessaire."
    ],
    "notes": [
      "Cette version garde une texture riche avec pignons ou graines.",
      "Parfait pour pâtes, tartines, focaccia, sandwichs ou base de sauce froide.",
      "Si les tomates sont très salées, goûter avant d’ajouter du sel."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Mixer court pour garder un pesto dense plutôt qu’une purée lisse."
      },
      {
        "label": "Équilibre",
        "value": "Le citron réveille les tomates séchées et évite une sauce trop lourde."
      }
    ],
    "practical": {
      "equipment": [
        "Mixeur",
        "Spatule",
        "Pot hermétique"
      ],
      "storage": [
        "4 à 5 jours au réfrigérateur, couvert d’un fin filet d’huile."
      ],
      "mistakes": [
        "Ne sale pas avant d’avoir goûté les tomates et le parmesan."
      ],
      "result": [
        "Pesto rouge dense et parfumé."
      ]
    },
    "additionalMasters": [
      "apero_maitre",
      "accompagnements_maitre"
    ]
  },
  "base_pour_flan_sale": {
    "title": "Base pour flan salé",
    "master": "elements_base_maitre",
    "image": "/assets/recipe-images-optimized/base_pour_flan_sale_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Printemps",
      "Été",
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "12 mini-flans",
    "aliases": [
      "base flan salé",
      "mini flans salés",
      "appareil à flan salé"
    ],
    "tags": [
      "base",
      "flan",
      "salé",
      "œuf"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "3 œufs",
          "60g farine",
          "45g beurre fondu",
          "150g lait",
          "2 cuillères à café de moutarde à l'ancienne",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 180°C et graisser des empreintes à mini-muffins.",
      "Fouetter les œufs avec la farine, puis ajouter le beurre fondu, le lait et la moutarde à l'ancienne.",
      "Assaisonner et mélanger sans trop travailler.",
      "Répartir dans les empreintes en remplissant aux trois quarts.",
      "Cuire environ 15min, jusqu’à ce que les flans soient pris et légèrement dorés.",
      "Laisser tiédir quelques minutes avant de démouler."
    ],
    "notes": [
      "La base accepte d’autres garnitures jambon, tomates séchées, olives, herbes, fromage râpé.",
      "Garder une garniture bien égouttée pour préserver une texture nette."
    ],
    "technical": [
      {
        "label": "Appareil",
        "value": "Une base lisse évite les paquets de farine dans les petits formats."
      },
      {
        "label": "Cuisson",
        "value": "Retirer dès que le centre est pris pour éviter une texture sèche."
      }
    ],
    "practical": {
      "equipment": [
        "Moule à mini-muffins",
        "Fouet",
        "Bol verseur"
      ],
      "storage": [
        "2 jours au réfrigérateur, réchauffer doucement au four."
      ],
      "mistakes": [
        "Évite les garnitures trop humides ou égoutte-les avant de les ajouter.",
        "Ne surcharge pas les moules les mini-flans doivent rester légers."
      ],
      "result": [
        "Mini bouchées salées, moelleuses et faciles à décliner."
      ]
    }
  },
  "pain_grille_beurre_ail_herbes": {
    "title": "Pain grillé beurre ail et herbes",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/pain_grille_beurre_ail_herbes_spooky.jpg",
    "categories": [
      "Base",
      "Apéro",
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 1,
    "yield": "12 tranches",
    "aliases": [
      "pain à l’ail",
      "pain grillé ail herbes",
      "garlic bread"
    ],
    "tags": [
      "pain",
      "ail",
      "beurre",
      "herbes"
    ],
    "linkedRecipes": [
      {
        "id": "beurre_ail",
        "role": "Base"
      }
    ],
    "ingredients": [
      {
        "group": "Pain grillé",
        "items": [
          "12 tranches de baguette épaisses",
          "90g <span data-goto=\"beurre_ail\">beurre à l’ail</span>",
          "5g ciboulette ciselée, optionnel"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four en position gril.",
      "Préparer ou assouplir le <span data-goto=\"beurre_ail\">beurre à l’ail</span>, puis ajouter la ciboulette si souhaité.",
      "Tartiner les tranches de baguette et les poser sur une plaque.",
      "Griller 2 à 3min en surveillant, jusqu’à obtenir une belle coloration.",
      "Servir chaud."
    ],
    "notes": [
      "Idéal avec pâtes, soupe, salade, grillades ou plateau apéro.",
      "Le gril colore très vite rester devant le four.",
      "Pour un goût plus doux, prépare le beurre avec de l’ail blanchi ou une quantité d’ail réduite."
    ],
    "technical": [
      {
        "label": "Beurre",
        "value": "Il doit être pommade pour s’étaler sans déchirer le pain."
      },
      {
        "label": "Gril",
        "value": "Cuisson courte et intense surveiller en continu."
      }
    ],
    "practical": {
      "equipment": [
        "Plaque de cuisson",
        "Bol",
        "Spatule"
      ],
      "storage": [
        "Meilleur minute. Le beurre parfumé peut être préparé 3 jours à l’avance."
      ],
      "mistakes": [
        "Ne place pas la plaque trop près du gril si ton four chauffe fort."
      ],
      "result": [
        "Pain croustillant, doré, beurré et bien parfumé."
      ]
    },
    "additionalMasters": [
      "apero_maitre",
      "accompagnements_maitre"
    ]
  },
  "billes_mozzarella_marinees": {
    "title": "Billes de mozzarella marinées",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/billes_mozzarella_marinees_spooky.jpg",
    "categories": [
      "Apéro",
      "Entrées"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 1,
    "yield": "4 personnes",
    "aliases": [
      "billes mozzarella marinées",
      "mozzarella apéro",
      "mozzarella marinée"
    ],
    "tags": [
      "mozzarella",
      "marinade",
      "apéritif",
      "huile d’olive"
    ],
    "ingredients": [
      {
        "group": "Marinade",
        "items": [
          "250g billes de mozzarella",
          "60g huile d’olive",
          "1 petite gousse d’ail râpée",
          "1 c. à café thym ou origan",
          "1 pincée piment d’Espelette",
          "Zeste fin de citron",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Égoutter les billes de mozzarella et les éponger.",
      "Mélanger l’huile d’olive, l’ail, les herbes, le piment, le zeste, le sel et le poivre du moulin.",
      "Ajouter la mozzarella, mélanger délicatement et couvrir.",
      "Laisser mariner au frais au moins 30min, idéalement 2h.",
      "Remettre à température ambiante 10min avant de servir."
    ],
    "notes": [
      "À servir avec tomates cerises, pain grillé, olives ou charcuterie.",
      "Éponger la mozzarella aide la marinade à mieux accrocher."
    ],
    "technical": [
      {
        "label": "Marinade",
        "value": "La mozzarella est humide bien l’égoutter pour éviter une marinade diluée."
      },
      {
        "label": "Service",
        "value": "Le froid fige l’huile d’olive, donc sortir un peu avant dégustation."
      }
    ],
    "practical": {
      "equipment": [
        "Bol",
        "Râpe fine",
        "Boîte hermétique"
      ],
      "storage": [
        "24h au réfrigérateur dans la marinade."
      ],
      "mistakes": [
        "Ne surdose pas l’ail cru il devient vite dominant.",
        "Ne jette pas l’huile parfumée elle assaisonne une salade ou des pâtes."
      ],
      "result": [
        "Billes fraîches, parfumées, prêtes pour l’apéro."
      ]
    },
    "additionalMasters": [
      "entrees_maitre",
      "crudites_maitre"
    ]
  },
  "cookies_cerise_chocolat": {
    "title": "Cookies cerise chocolat",
    "master": "cookies_sucres_maitre",
    "image": "/assets/recipe-images-optimized/cookies_cerise_chocolat_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "16 cookies",
    "aliases": [
      "cherry chocolate chip cookies",
      "cookies cerise chocolat",
      "cookies chocolat cerise"
    ],
    "tags": [
      "cookies",
      "cerise",
      "chocolat"
    ],
    "ingredients": [
      {
        "group": "Pâte",
        "items": [
          "115g beurre doux ramolli",
          "100g cassonade ou vergeoise",
          "50g sucre",
          "1 œuf",
          "Extrait de vanille selon dosage indiqué sur la bouteille",
          "180g farine",
          "15g cacao non sucré",
          "3g levure chimique",
          "2g sel fin"
        ]
      },
      {
        "group": "Garniture",
        "items": [
          "120g pépites de chocolat",
          "100g cerises séchées hachées"
        ]
      }
    ],
    "steps": [
      "Crémer le beurre avec la cassonade ou vergeoise et le sucre.",
      "Ajouter l’œuf et la vanille, puis mélanger jusqu’à obtenir une base homogène.",
      "Ajouter farine, cacao, levure et sel.",
      "Incorporer les pépites de chocolat et les cerises séchées.",
      "Former 16 boules et placer 30min au frais.",
      "Cuire 10 à 12min à 180°C, puis laisser reposer sur la plaque avant de déplacer."
    ],
    "notes": [
      "Les cerises séchées apportent l’acidité qui équilibre le chocolat.",
      "Pour une version plus gourmande, ajoute quelques morceaux de chocolat noir sur les cookies encore chauds.",
      "Sortir les cookies quand le centre paraît encore tendre."
    ],
    "technical": [
      {
        "label": "Repos",
        "value": "Le froid limite l’étalement et donne des cookies plus épais."
      },
      {
        "label": "Cuisson",
        "value": "Le centre se raffermit hors du four ne pas prolonger inutilement."
      }
    ],
    "practical": {
      "equipment": [
        "Robot ou saladier",
        "Plaque de cuisson",
        "Papier cuisson"
      ],
      "storage": [
        "4 jours en boîte hermétique.",
        "Pâte congelable en boules."
      ],
      "mistakes": [
        "Ne cuis pas trop le cacao fait paraître les cookies moins dorés."
      ],
      "result": [
        "Cookies moelleux, chocolatés, avec une note acidulée de cerise."
      ]
    },
    "additionalMasters": [
      "desserts_maitre",
      "biscuits_gouters_maitre"
    ]
  },
  "clafoutis_cerises_bocuse": {
    "title": "Clafoutis aux cerises",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/clafoutis_cerises_bocuse_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "6 personnes",
    "aliases": [
      "clafoutis cerises paul bocuse",
      "clafoutis aux cerises",
      "clafoutis bocuse"
    ],
    "tags": [
      "clafoutis",
      "cerise",
      "dessert"
    ],
    "ingredients": [
      {
        "group": "Appareil",
        "items": [
          "125g farine",
          "100g sucre",
          "3 œufs",
          "300g lait entier",
          "1 pincée sel fin",
          "Vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
        ]
      },
      {
        "group": "Fruits et moule",
        "items": [
          "500g cerises",
          "15g beurre doux pour le moule",
          "15g sucre pour le moule"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 180°C et beurrer le moule.",
      "Saupoudrer le moule avec un peu de sucre, puis répartir les cerises en une couche régulière.",
      "Mélanger farine, sucre et sel dans un saladier.",
      "Ajouter les œufs un à un, puis délayer progressivement avec le lait pour obtenir une pâte lisse.",
      "Parfumer avec la vanille, puis verser l’appareil sur les cerises.",
      "Cuire 35 à 40min, jusqu’à obtenir un clafoutis pris au centre et légèrement doré.",
      "Laisser tiédir avant de servir."
    ],
    "notes": [
      "Les cerises peuvent rester entières pour un jus plus contenu, ou être dénoyautées pour une dégustation plus confortable.",
      "Servir tiède ou à température ambiante.",
      "Une fine pluie de sucre juste avant service donne un fini plus pâtissier."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "L’appareil doit être lisse et fluide, sans excès de fouet pour garder un résultat tendre."
      },
      {
        "label": "Cuisson",
        "value": "Le centre doit être pris mais encore souple il finit de se stabiliser en tiédissant."
      }
    ],
    "practical": {
      "equipment": [
        "Moule à gratin",
        "Saladier",
        "Fouet"
      ],
      "storage": [
        "2 jours au réfrigérateur, couvert.",
        "Revenir à température ambiante ou réchauffer doucement."
      ],
      "mistakes": [
        "Ne verse pas tout le lait d’un coup l’ajout progressif évite les grumeaux."
      ],
      "result": [
        "Clafoutis moelleux, fruité, avec une pâte fine autour des cerises."
      ]
    }
  },
  "cerises_sechees_maison": {
    "title": "Cerises séchées",
    "master": "elements_base_maitre",
    "image": "/assets/recipe-images-optimized/cerises_sechees_maison_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "1 bocal",
    "aliases": [
      "cerises sechées",
      "cerises séchées",
      "faire sécher des cerises"
    ],
    "tags": [
      "cerise",
      "séchage",
      "conservation"
    ],
    "ingredients": [
      {
        "group": "Fruit",
        "items": [
          "1kg cerises mûres"
        ]
      },
      {
        "group": "Optionnel",
        "items": [
          "10g jus de citron"
        ]
      }
    ],
    "steps": [
      "Laver les cerises, retirer les queues et bien les sécher.",
      "Dénoyauter les cerises, puis les couper en deux si elles sont grosses.",
      "Mélanger avec le jus de citron si souhaité pour limiter l’oxydation.",
      "Répartir les cerises côté coupé vers le haut sur des grilles, sans les superposer.",
      "Sécher au déshydrateur à 55-60°C pendant 10 à 14h, ou au four ventilé très doux avec la porte entrouverte.",
      "Retourner à mi-séchage et prolonger jusqu’à obtenir une texture souple, ridée et non collante.",
      "Laisser refroidir complètement, puis stocker en bocal hermétique."
    ],
    "notes": [
      "Le temps dépend de la taille des cerises, de leur teneur en jus et du matériel utilisé.",
      "Utilise ces cerises dans les cookies, granolas, cakes ou salades composées."
    ],
    "technical": [
      {
        "label": "Séchage",
        "value": "Mieux vaut une température douce et longue qu’une chaleur forte qui cuit le fruit."
      },
      {
        "label": "Contrôle",
        "value": "Si de la condensation apparaît dans le bocal après repos, remets les cerises à sécher."
      }
    ],
    "practical": {
      "equipment": [
        "Dénoyauteur",
        "Déshydrateur ou four ventilé",
        "Grilles",
        "Bocal hermétique"
      ],
      "storage": [
        "1 mois dans un bocal hermétique au frais.",
        "Plus longtemps au congélateur en sachet bien fermé."
      ],
      "mistakes": [
        "Garde les cerises espacées pendant le séchage l’air doit circuler autour de chaque morceau.",
        "Pour une conservation plus sûre, les fruits doivent être souples mais ne plus relâcher de jus quand on les presse."
      ],
      "result": [
        "Cerises concentrées, acidulées et moelleuses, prêtes à remplacer des raisins secs."
      ]
    }
  },
  "pate_lapin_piment_espelette": {
    "title": "Pâté de lapin au piment d’Espelette",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/pate_lapin_piment_espelette_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "6 bocaux",
    "aliases": [
      "pâté de lapin",
      "pate lapin espelette",
      "conserve de lapin"
    ],
    "tags": [
      "pâté",
      "lapin",
      "conserve",
      "piment"
    ],
    "ingredients": [
      {
        "group": "Viande",
        "items": [
          "900g chair de lapin désossée",
          "350g gorge de porc",
          "200g foie de volaille",
          "120g lard gras"
        ]
      },
      {
        "group": "Assaisonnement",
        "items": [
          "80g échalote",
          "12g ail",
          "60ml armagnac ou cognac",
          "12g sel fin",
          "2g poivre du moulin",
          "3g piment d’Espelette",
          "2g thym"
        ]
      }
    ],
    "steps": [
      "Couper les viandes bien froides en morceaux et les passer au hachoir grosse grille.",
      "Mélanger avec échalote, ail, alcool, sel, poivre du moulin, piment d’Espelette et thym.",
      "Travailler rapidement jusqu’à obtenir une farce homogène, sans la chauffer.",
      "Remplir des bocaux propres en tassant légèrement et en laissant 2cm de marge.",
      "Fermer les bocaux selon le système utilisé.",
      "Stériliser 2h30 à 100°C, au stérilisateur ou dans un grand faitout, puis laisser refroidir dans l’eau.",
      "Vérifier les fermetures avant stockage et laisser maturer au moins 48h avant dégustation."
    ],
    "notes": [
      "La conserve demande des bocaux parfaitement propres et des joints en bon état.",
      "Le piment d’Espelette doit parfumer sans masquer le lapin.",
      "Servir frais avec pain grillé, cornichons et moutarde."
    ],
    "technical": [
      {
        "label": "Hygiène",
        "value": "Garder viande et farce bien froides, puis lancer la stérilisation sans attente."
      },
      {
        "label": "Conservation",
        "value": "Tout bocal mal fermé, bombé ou suspect doit être écarté."
      }
    ],
    "practical": {
      "equipment": [
        "Hachoir",
        "Bocaux à conserve",
        "Stérilisateur ou grand faitout haut",
        "Grand saladier"
      ],
      "storage": [
        "Plusieurs mois dans un endroit frais, sec et sombre si la stérilisation est réussie.",
        "Après ouverture 48h au réfrigérateur."
      ],
      "mistakes": [
        "Ne remplis pas les bocaux jusqu’en haut la marge limite les débordements à la stérilisation."
      ],
      "result": [
        "Pâté rustique, parfumé, avec une chaleur douce de piment d’Espelette."
      ]
    }
  },
  "terrine_campagne": {
    "title": "Terrine de campagne",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/terrine_campagne_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "1 terrine",
    "aliases": [
      "terrine de campagne",
      "pâté de campagne",
      "terrine porc"
    ],
    "tags": [
      "terrine",
      "porc",
      "charcuterie"
    ],
    "ingredients": [
      {
        "group": "Farce",
        "items": [
          "600g échine de porc",
          "300g gorge de porc",
          "200g foie de porc ou volaille",
          "80g échalote",
          "10g ail",
          "50ml cognac",
          "14g sel fin",
          "3g poivre du moulin",
          "2 œufs",
          "30g persil haché"
        ]
      },
      {
        "group": "Terrine",
        "items": [
          "150g crépine ou bardes de lard",
          "2 feuilles de laurier",
          "2 branches de thym"
        ]
      }
    ],
    "steps": [
      "Faire mariner les viandes coupées avec cognac, échalote, ail, sel, poivre du moulin et thym pendant 2h au frais.",
      "Hacher les viandes avec une grille moyenne.",
      "Ajouter les œufs et le persil, puis mélanger jusqu’à obtenir une farce liée.",
      "Chemiser la terrine avec crépine ou bardes, remplir avec la farce et lisser.",
      "Ajouter laurier et thym sur le dessus, puis couvrir.",
      "Cuire au bain-marie à 170°C pendant 1h30 environ.",
      "Laisser refroidir sous un léger poids, puis réserver 24h au réfrigérateur avant de trancher."
    ],
    "notes": [
      "Le repos d’une nuit améliore nettement la tenue et le goût.",
      "Servir avec cornichons, pain de campagne et moutarde.",
      "La terrine doit être cuite à cœur mais rester moelleuse."
    ],
    "technical": [
      {
        "label": "Farce",
        "value": "Une farce froide et bien mélangée tranche plus proprement après repos."
      },
      {
        "label": "Bain-marie",
        "value": "L’eau chaude autour de la terrine adoucit la cuisson et limite le dessèchement."
      }
    ],
    "practical": {
      "equipment": [
        "Terrine",
        "Hachoir",
        "Plat à bain-marie",
        "Sonde"
      ],
      "storage": [
        "4 à 5 jours au réfrigérateur à 0–4°C, bien filmée.",
        "Pour une garde plus longue au frais, couvrir la surface d’une fine couche de saindoux fondu et propre.",
        "Trancher au dernier moment pour éviter le dessèchement."
      ],
      "mistakes": [
        "Évite une farce trop fine la terrine de campagne doit garder une mâche rustique."
      ],
      "result": [
        "Terrine charcutière rustique, parfumée et bien tranchable."
      ]
    }
  },
  "rillettes_porc": {
    "title": "Rillettes de porc",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/rillettes_porc_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "6 pots",
    "aliases": [
      "rillettes de porc",
      "rillettes porc",
      "rillettes"
    ],
    "tags": [
      "rillettes",
      "porc",
      "charcuterie",
      "apero"
    ],
    "ingredients": [
      {
        "group": "Viande et graisse",
        "items": [
          "1000g épaule ou échine de porc",
          "500g poitrine de porc fraîche",
          "350g saindoux ou graisse de canard",
          "200g vin blanc sec ou eau"
        ]
      },
      {
        "group": "Assaisonnement",
        "items": [
          "22g sel fin",
          "3g poivre du moulin",
          "2 feuilles de laurier",
          "3 branches de thym",
          "2g quatre-épices, optionnel"
        ]
      }
    ],
    "steps": [
      "Couper les viandes en gros cubes réguliers.",
      "Mettre viande, graisse, vin blanc ou eau, sel fin, poivre du moulin, thym et laurier dans une cocotte.",
      "Porter doucement à frémissement, couvrir partiellement et cuire 4 à 5h à feu très doux.",
      "Remuer de temps en temps la viande doit se détacher en filaments sans sécher.",
      "Retirer laurier et thym, égoutter la viande en gardant la graisse de cuisson.",
      "Effilocher la viande à la fourchette, puis incorporer assez de graisse chaude pour obtenir une texture moelleuse.",
      "Mettre en pots propres, tasser légèrement et couvrir d’une fine couche de graisse.",
      "Refroidir rapidement, puis laisser reposer 24h au réfrigérateur avant dégustation."
    ],
    "notes": [
      "Les rillettes reposent sur une cuisson lente dans la graisse c’est ce qui donne les filaments et le goût profond.",
      "Servir à l’apéro, en entrée ou dans un sandwich avec cornichons et pain grillé."
    ],
    "technical": [
      {
        "label": "Cuisson",
        "value": "Le liquide doit frémir à peine une ébullition forte dessèche la viande et brouille la texture."
      },
      {
        "label": "Texture",
        "value": "Effilocher à chaud, puis ajuster avec la graisse de cuisson jusqu’à une texture souple."
      }
    ],
    "practical": {
      "equipment": [
        "Cocotte épaisse",
        "Fourchettes",
        "Pots propres",
        "Passoire"
      ],
      "storage": [
        "4 à 5 jours au réfrigérateur à 0–4°C après refroidissement complet.",
        "Après ouverture consommer sous 48h.",
        "Congélation possible en petits pots bien fermés."
      ],
      "mistakes": [
        "Ne garde pas les rillettes tièdes longtemps refroidis vite les pots avant stockage.",
        "La couche de graisse protège la surface, mais ne remplace pas une hygiène stricte ni une conservation au froid."
      ],
      "result": [
        "Rillettes fondantes, filandreuses et bien confites."
      ]
    }
  },
  "rillettes_poulet": {
    "title": "Rillettes de poulet",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/rillettes_poulet_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 3,
    "yield": "4 pots",
    "aliases": [
      "rillettes de poulet",
      "rillettes poulet",
      "rillettes volaille"
    ],
    "tags": [
      "rillettes",
      "poulet",
      "charcuterie",
      "apero"
    ],
    "ingredients": [
      {
        "group": "Poulet confit",
        "items": [
          "1200g cuisses de poulet",
          "250g graisse de canard ou saindoux",
          "150g vin blanc sec ou bouillon de volaille",
          "80g oignon émincé",
          "10g ail écrasé"
        ]
      },
      {
        "group": "Assaisonnement",
        "items": [
          "14g sel fin",
          "2g poivre du moulin",
          "2 feuilles de laurier",
          "3 branches de thym",
          "20g persil ciselé, optionnel"
        ]
      }
    ],
    "steps": [
      "Mettre les cuisses de poulet, graisse, vin blanc ou bouillon, oignon, ail, thym, laurier, sel fin et poivre du moulin dans une cocotte.",
      "Cuire à frémissement très doux 2h30 à 3h, jusqu’à ce que la viande se détache facilement des os.",
      "Égoutter en conservant la graisse de cuisson, puis retirer peau, os, thym et laurier.",
      "Effilocher finement la chair chaude.",
      "Incorporer progressivement la graisse de cuisson pour obtenir une texture souple et tartinable.",
      "Ajouter le persil si souhaité, goûter et ajuster l’assaisonnement.",
      "Mettre en pots propres, tasser, couvrir d’une fine couche de graisse et refroidir rapidement.",
      "Laisser reposer 12 à 24h au réfrigérateur avant de servir."
    ],
    "notes": [
      "La cuisson lente dans la graisse donne une texture plus moelleuse qu’un simple poulet mixé.",
      "Servir sur pain grillé avec pickles, cornichons ou moutarde douce.",
      "Pour une texture rustique, effilocher à la fourchette plutôt qu’au robot."
    ],
    "technical": [
      {
        "label": "Graisse",
        "value": "Ajouter la graisse en plusieurs fois permet d’arrêter dès que la texture devient tartinable."
      },
      {
        "label": "Sécurité",
        "value": "Refroidir rapidement et conserver au froid, surtout avec une volaille cuite effilochée."
      }
    ],
    "practical": {
      "equipment": [
        "Cocotte",
        "Fourchettes",
        "Pots propres",
        "Passoire"
      ],
      "storage": [
        "3 à 4 jours au réfrigérateur à 0–4°C.",
        "Après ouverture consommer sous 48h.",
        "Congélation possible en petits pots."
      ],
      "mistakes": [
        "Ne mixe pas trop fort la rillette deviendrait pâteuse."
      ],
      "result": [
        "Rillettes de volaille moelleuses, confites et faciles à tartiner."
      ]
    }
  },
  "terrine_porc_pistaches": {
    "title": "Terrine de porc aux pistaches",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/terrine_porc_pistaches_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "1 terrine",
    "aliases": [
      "terrine de porc aux pistaches",
      "terrine porc pistaches",
      "pâté porc pistache"
    ],
    "tags": [
      "terrine",
      "porc",
      "pistache",
      "charcuterie"
    ],
    "ingredients": [
      {
        "group": "Farce",
        "items": [
          "650g échine de porc",
          "350g gorge de porc",
          "200g foie de volaille",
          "100g pistaches décortiquées",
          "80g échalote ciselée",
          "10g ail haché",
          "120g œufs entiers",
          "60ml cognac ou armagnac",
          "17g sel fin",
          "3g poivre du moulin",
          "2g quatre-épices"
        ]
      },
      {
        "group": "Terrine",
        "items": [
          "150g crépine ou bardes de lard",
          "2 feuilles de laurier",
          "2 branches de thym"
        ]
      }
    ],
    "steps": [
      "Couper les viandes bien froides en morceaux et les faire mariner 2h avec alcool, échalote, ail, sel fin, poivre du moulin et quatre-épices.",
      "Hacher les viandes avec une grille moyenne.",
      "Ajouter les œufs et les pistaches, puis mélanger jusqu’à obtenir une farce liée sans la chauffer.",
      "Chemiser la terrine avec crépine ou bardes, remplir avec la farce et lisser.",
      "Ajouter laurier et thym, couvrir, puis poser la terrine dans un bain-marie chaud.",
      "Cuire à 160–170°C pendant 1h30 environ, jusqu’à atteindre une cuisson à cœur.",
      "Laisser tiédir, poser un léger poids dessus, puis réserver 24 à 48h au réfrigérateur avant de trancher."
    ],
    "notes": [
      "Le repos au froid raffermit la terrine et arrondit les saveurs.",
      "Servir avec cornichons, pain de campagne et moutarde."
    ],
    "technical": [
      {
        "label": "Farce",
        "value": "Garder les viandes froides évite une farce grasse et collante."
      },
      {
        "label": "Bain-marie",
        "value": "La cuisson douce limite le dessèchement et donne une tranche plus nette."
      }
    ],
    "practical": {
      "equipment": [
        "Terrine",
        "Hachoir",
        "Plat à bain-marie",
        "Sonde"
      ],
      "storage": [
        "4 à 5 jours au réfrigérateur à 0–4°C, bien filmée.",
        "Couvrir la surface de saindoux fondu peut prolonger la protection au froid.",
        "Trancher au dernier moment."
      ],
      "mistakes": [
        "Ne hache pas trop fin la terrine doit garder une texture charcutière.",
        "Les pistaches doivent rester visibles ne les mixe pas avec la farce."
      ],
      "result": [
        "Terrine rustique, parfumée, avec pistaches bien visibles à la tranche."
      ]
    }
  },
  "brie_farci_fruits_secs_noix": {
    "title": "Brie farci aux fruits secs et noix",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/brie_farci_fruits_secs_noix_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 1,
    "yield": "6 personnes",
    "aliases": [
      "brie farci",
      "brie fruits secs",
      "fromage farci noix"
    ],
    "tags": [
      "brie",
      "fromage",
      "noix",
      "fruits secs"
    ],
    "ingredients": [
      {
        "group": "Fromage",
        "items": [
          "1 brie entier moyen"
        ]
      },
      {
        "group": "Garniture",
        "items": [
          "50g noix variées hachées",
          "30g fruits secs en petits morceaux",
          "20g miel",
          "5g basilic ou persil ciselé"
        ]
      }
    ],
    "steps": [
      "Mélanger noix, fruits secs, miel et herbes.",
      "Ouvrir le brie déjà préparé en deux disques et étaler la garniture sur la moitié inférieure.",
      "Refermer avec la moitié supérieure et presser très légèrement.",
      "Réfrigérer 30min pour raffermir l’ensemble.",
      "Sortir 10 à 15min avant service, puis couper en quartiers."
    ],
    "notes": [
      "Servir avec pain, crackers ou baguette grillée.",
      "Le miel est optionnel si les fruits secs sont déjà très sucrés.",
      "Hacher les noix assez finement pour obtenir une coupe nette."
    ],
    "technical": [
      {
        "label": "Repos",
        "value": "Le froid stabilise la garniture et facilite le service."
      }
    ],
    "practical": {
      "equipment": [
        "Couteau long",
        "Bol",
        "Planche"
      ],
      "storage": [
        "24h au réfrigérateur, bien filmé.",
        "Sortir quelques minutes avant service pour retrouver le crémeux."
      ],
      "mistakes": [
        "Ne surcharge pas le centre le brie doit pouvoir se refermer sans déborder."
      ],
      "result": [
        "Brie crémeux, sucré-salé, croquant et prêt à partager."
      ]
    }
  },
  "carres_cremeux_citron_vert": {
    "title": "Carrés crémeux citron vert",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/carres_cremeux_citron_vert_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "12 carrés",
    "aliases": [
      "creamy lime bars",
      "barres citron vert",
      "carrés citron vert"
    ],
    "tags": [
      "citron vert",
      "barres",
      "dessert"
    ],
    "ingredients": [
      {
        "group": "Base biscuitée",
        "items": [
          "180g biscuits digestifs ou sablés",
          "75g beurre fondu",
          "25g sucre"
        ]
      },
      {
        "group": "Crème citron vert",
        "items": [
          "400g lait concentré sucré",
          "120g jus de citron vert",
          "Zeste de 2 citrons verts",
          "4 jaunes d’œufs",
          "1 pincée sel fin"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 170°C et chemiser un moule carré.",
      "Mixer les biscuits avec le sucre, puis mélanger avec le beurre fondu.",
      "Tasser dans le moule et précuire 10min.",
      "Fouetter lait concentré, jaunes d’œufs, jus, zeste de citron vert et sel.",
      "Verser sur la base précuite.",
      "Cuire 15 à 18min, jusqu’à ce que le centre soit juste pris.",
      "Refroidir, puis placer au réfrigérateur au moins 3h avant de découper."
    ],
    "notes": [
      "Utilise du vrai jus de citron vert pour garder une acidité nette.",
      "La découpe est plus propre avec un couteau chaud essuyé entre chaque coupe.",
      "Servir bien frais."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Le centre doit trembler légèrement à la sortie du four il se raffermit au froid."
      },
      {
        "label": "Base",
        "value": "Tasser fermement la base évite qu’elle s’effrite à la découpe."
      }
    ],
    "practical": {
      "equipment": [
        "Moule carré",
        "Papier cuisson",
        "Fouet",
        "Mixeur"
      ],
      "storage": [
        "3 jours au réfrigérateur, en boîte hermétique.",
        "Servir froid pour garder la crème nette."
      ],
      "mistakes": [
        "Ne prolonge pas trop la cuisson une crème trop cuite devient granuleuse."
      ],
      "result": [
        "Carrés frais, acidulés et très crémeux sur base biscuitée."
      ]
    }
  },
  "tempura_beignets_calamar_crevettes": {
    "title": "Tempura",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/tempura_beignets_calamar_crevettes_spooky.jpg",
    "categories": [
      "Base",
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "tempura calamar",
      "tempura crevettes",
      "pâte tempura",
      "beignets tempura"
    ],
    "tags": [
      "tempura",
      "beignet",
      "calamar",
      "crevette",
      "friture"
    ],
    "linkedRecipes": [
      {
        "id": "beignets_calamar",
        "role": "Utilisation"
      },
      {
        "id": "pate_legere_beignets_calamar_crevettes",
        "role": "Alternative"
      },
      {
        "id": "aioli_citronne_leger",
        "role": "Sauce"
      }
    ],
    "ingredients": [
      {
        "group": "Tempura",
        "items": [
          "90g farine",
          "50g fécule",
          "20g jaune d’œuf",
          "220g eau gazeuse glacée",
          "3g sel fin"
        ]
      }
    ],
    "steps": [
      "Mélanger farine, fécule et sel.",
      "Ajouter le jaune d’œuf et l’eau gazeuse glacée au dernier moment.",
      "Mélanger très peu pour garder une pâte froide et irrégulière.",
      "Tremper calamars ou crevettes dans la tempura, puis frire immédiatement à 180°C par petites quantités."
    ],
    "notes": [
      "La tempura doit rester imparfaite quelques petits grumeaux donnent une friture plus légère.",
      "Garder l’eau glacée et cuire sans attendre.",
      "Raccourci <span data-goto=\"beignets_calamar\">Beignets de calamar</span>."
    ],
    "technical": [
      {
        "label": "Froid",
        "value": "Le choc entre pâte froide et huile chaude donne le croustillant."
      },
      {
        "label": "Cuisson",
        "value": "Frire court, sans surcharger le bain."
      }
    ],
    "practical": {
      "equipment": [
        "Cul-de-poule très froid",
        "Baguettes ou fouet",
        "Casserole ou sauteuse haute"
      ],
      "storage": [
        "À préparer au dernier moment, sans repos."
      ],
      "mistakes": [
        "Ne cherche pas une pâte lisse.",
        "Ne laisse pas la tempura se réchauffer avant cuisson."
      ],
      "result": [
        "Pâte froide, irrégulière, très légère et croustillante après friture."
      ]
    },
    "additionalMasters": [
      "apero_maitre"
    ]
  },
  "flan_patissier_epais_vanille": {
    "title": "Flan pâtissier épais vanille",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/flan_patissier_epais_vanille_v2_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "hard",
    "difficultyScore": 7,
    "yield": "8 à 10 parts",
    "aliases": [
      "flan patissier",
      "flan felder",
      "flan boulanger"
    ],
    "tags": [
      "flan",
      "vanille",
      "patisserie"
    ],
    "ingredients": [
      {
        "group": "Pâte sablée",
        "items": [
          "215g farine T45",
          "100g cassonade ou vergeoise",
          "100g beurre doux froid",
          "1 oeuf",
          "1 pincée levure chimique",
          "1 pincée sel fin"
        ]
      },
      {
        "group": "Appareil vanille",
        "items": [
          "1000g lait entier",
          "250g crème liquide entière",
          "5 oeufs",
          "220g sucre",
          "100g maïzena",
          "vanille selon goût"
        ]
      }
    ],
    "steps": [
      "Sabler farine, cassonade ou vergeoise, beurre froid, levure et sel, puis ajouter l oeuf pour former une pâte.",
      "Aplatir la pâte, filmer et laisser reposer 30min au réfrigérateur.",
      "Foncer un cercle haut de 23 à 24cm, bien marquer les angles et remettre au froid.",
      "Chauffer le lait avec une partie du sucre et la vanille.",
      "Fouetter les oeufs, le reste du sucre et la maïzena, puis ajouter la crème.",
      "Verser le lait chaud progressivement sur le mélange aux oeufs en fouettant.",
      "Remettre en casserole et cuire jusqu à crème épaisse, lisse et nappante.",
      "Verser dans le fond de pâte, lisser et cuire 50min à 180°C en chaleur statique.",
      "Refroidir 2h à température ambiante, puis réserver 3h au réfrigérateur avant découpe."
    ],
    "notes": [
      "Un cercle haut donne une vraie épaisseur de flan.",
      "La découpe est plus nette après un long refroidissement."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "La crème doit épaissir avant cuisson au four pour garder une tranche nette."
      },
      {
        "label": "Repos",
        "value": "Le froid termine la tenue ne coupe pas le flan encore tiède."
      }
    ],
    "practical": {
      "storage": [
        "2 à 3 jours au réfrigérateur, non couvert au début puis protégé après refroidissement complet."
      ],
      "mistakes": [
        "Ne diminue pas trop le sucre il participe aussi à la texture du flan."
      ]
    }
  },
  "gratin_dauphinois": {
    "title": "Gratin de pommes de terre",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/gratin_dauphinois_v2_spooky.jpg",
    "categories": [
      "Plats",
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "6 personnes",
    "aliases": [
      "gratin dauphinois",
      "gratin dauphinois le meilleur",
      "pommes de terre gratin",
      "gratin de pommes de terre"
    ],
    "tags": [
      "pomme de terre",
      "gratin",
      "creme",
      "poitrine fumee",
      "fromage",
      "moutarde ancienne"
    ],
    "ingredients": [
      {
        "group": "Gratin",
        "items": [
          "1200g pommes de terre à chair ferme",
          "1 c. à soupe de graisse de canard (optionnel)",
          "200g poitrine fumée en allumettes",
          "1 oignon coupé en brunoise",
          "1 grosse gousse d’ail passée au presse-ail",
          "10cl vin blanc sec",
          "25cl lait entier",
          "50cl crème liquide entière",
          "2 c. à café de moutarde à l’ancienne",
          "30g beurre doux pour le plat",
          "100g emmental râpé",
          "30g parmesan râpé",
          "8 tours de poivre du moulin",
          "1/4 noix de muscade fraîchement râpée au zesteur"
        ]
      }
    ],
    "steps": [
      "Éplucher les pommes de terre et les trancher finement sans les rincer pour garder l’amidon.",
      "Beurrer le plat à gratin avec le beurre doux.",
      "Faire colorer les allumettes de poitrine fumée dans la cocotte avec la graisse de canard, si utilisée.",
      "Ajouter l’oignon en brunoise et le faire suer à feu moyen-doux 1 à 2min, sans coloration.",
      "Ajouter l’ail pressé, mélanger 30 secondes sans le brûler, puis déglacer avec le vin blanc et réduire presque à sec.",
      "Verser le lait et la crème dans la cocotte, ajouter la moutarde à l’ancienne, le poivre du moulin et la muscade fraîchement râpée au zesteur. Porter à frémissement doux.",
      "Ajouter les pommes de terre et cuire 10min à frémissement doux en mélangeant délicatement pour les enrober.",
      "Verser dans le plat, égaliser, parsemer d’emmental râpé et de parmesan râpé.",
      "Enfourner 25 à 30min en bas du four à 165°C chaleur tournante, jusqu’à ce que le dessus soit gratiné et que les pommes de terre soient fondantes.",
      "Laisser reposer 10min avant service pour que la crème se pose."
    ],
    "notes": [
      "Garde l’amidon des pommes de terre : il aide à lier la crème pendant la cuisson.",
      "Pas de sel ajouté : la poitrine fumée, l’emmental, le parmesan et la moutarde à l’ancienne salent déjà la préparation."
    ],
    "technical": [
      {
        "label": "Poitrine fumée",
        "value": "La colorer avant le liquide concentre le goût et évite une texture bouillie."
      },
      {
        "label": "Oignon",
        "value": "Le faire suer à feu moyen-doux sans coloration garde une base douce et évite l’amertume."
      },
      {
        "label": "Déglaçage",
        "value": "Réduis presque à sec avant d’ajouter lait et crème pour garder le parfum du vin blanc sans détendre la sauce."
      },
      {
        "label": "Muscade",
        "value": "Râpe-la fraîchement au zesteur au dernier moment : le parfum est plus net et plus puissant."
      },
      {
        "label": "Cuisson",
        "value": "Place le plat en bas du four pour gratiner le dessus sans dessécher trop vite la crème."
      }
    ],
    "practical": {
      "reheating": [
        "Réchauffer 15 à 20min à 150°C, couvert au début puis découvert."
      ],
      "mistakes": [
        "N’ajoute pas de sel avant dégustation : poitrine fumée, fromages et moutarde à l’ancienne salent déjà la préparation."
      ]
    },
    "additionalMasters": [
      "accompagnements_maitre"
    ]
  },
  "poulet_basquaise": {
    "title": "Poulet basquaise",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/poulet_basquaise_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Été",
      "Automne"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "aliases": [
      "poulet aux poivrons",
      "basquaise"
    ],
    "tags": [
      "poulet",
      "poivron",
      "tomate"
    ],
    "ingredients": [
      {
        "group": "Poulet",
        "items": [
          "4 cuisses de poulet",
          "2 oignons",
          "2 gousses ail",
          "3 poivrons rouges et verts",
          "600g tomates concassées",
          "120g jambon de Bayonne optionnel",
          "150ml vin blanc sec",
          "Piment d Espelette",
          "Huile olive",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Dorer les morceaux de poulet dans une cocotte avec un filet d huile olive.",
      "Retirer le poulet, faire revenir oignons, ail et poivrons émincés 10min.",
      "Ajouter jambon si utilisé, tomates, vin blanc, sel, poivre du moulin et piment d Espelette.",
      "Remettre le poulet, couvrir à demi et mijoter 40 à 45min.",
      "Découvrir en fin de cuisson pour concentrer la sauce si elle est trop fluide.",
      "Servir avec riz, pommes vapeur ou pain grillé."
    ],
    "notes": [
      "Le piment d Espelette parfume plus qu il ne doit brûler."
    ],
    "technical": [
      {
        "label": "Sauce",
        "value": "La piperade doit compoter avant de finir avec le poulet."
      }
    ],
    "practical": {
      "storage": [
        "2 jours au réfrigérateur."
      ],
      "reheating": [
        "Réchauffer doucement en cocotte avec un trait d eau si la sauce a épaissi."
      ]
    }
  },
  "croque_madame": {
    "title": "Croque-madame",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/croque_madame_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "2 croques",
    "aliases": [
      "croque monsieur oeuf",
      "croque madame"
    ],
    "tags": [
      "croque",
      "oeuf",
      "jambon"
    ],
    "ingredients": [
      {
        "group": "Croques",
        "items": [
          "4 tranches pain de mie",
          "2 tranches jambon",
          "80g fromage râpé",
          "35g beurre mou",
          "2 oeufs",
          "Moutarde douce optionnelle",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Beurrer légèrement l extérieur des tranches de pain.",
      "Garnir avec jambon, fromage râpé et une fine touche de moutarde si souhaité.",
      "Refermer et cuire à la poêle ou au four jusqu à pain doré et fromage fondu.",
      "Cuire les oeufs au plat séparément.",
      "Poser un oeuf sur chaque croque, saler et ajouter du poivre du moulin."
    ],
    "notes": [
      "Le jaune doit rester coulant pour napper le croque."
    ],
    "technical": [
      {
        "label": "Dorure",
        "value": "Cuire à feu moyen pour fondre le fromage sans brûler le pain."
      }
    ]
  },
  "cuisses_de_poulet_rhum_miel_piment": {
    "title": "Cuisses de poulet rhum miel piment",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cuisses_de_poulet_rhum_miel_piment_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "poulet rhum miel",
      "cuisses de poulet oignons rhum"
    ],
    "tags": [
      "poulet",
      "miel",
      "four"
    ],
    "ingredients": [
      {
        "group": "Poulet rôti",
        "items": [
          "4 cuisses de poulet",
          "3 oignons",
          "45g miel",
          "40ml rhum ambré",
          "25g sauce soja",
          "1 citron vert",
          "Piment selon goût",
          "Huile neutre",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Mélanger miel, rhum, sauce soja, citron vert, piment et un filet d huile.",
      "Enrober les cuisses de poulet et laisser mariner 30min si possible.",
      "Mettre les oignons émincés dans le plat, poser le poulet dessus et verser la marinade.",
      "Cuire 45 à 50min à 190°C en arrosant deux fois.",
      "Faire réduire le jus quelques minutes si besoin avant de servir."
    ],
    "notes": [
      "Le miel colore vite baisse légèrement le four si la peau fonce trop tôt."
    ],
    "technical": [
      {
        "label": "Laquage",
        "value": "Arroser en cours de cuisson pour garder une peau brillante et parfumée."
      }
    ]
  },
  "chipirons_a_la_plancha": {
    "title": "Chipirons à la plancha",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/chipirons_a_la_plancha_v2_spooky.jpg",
    "categories": [
      "Plats",
      "Entrées"
    ],
    "seasons": [
      "Été"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "aliases": [
      "chipirons plancha",
      "petits calmars plancha"
    ],
    "tags": [
      "calamar",
      "plancha",
      "ail"
    ],
    "ingredients": [
      {
        "group": "Chipirons",
        "items": [
          "800g chipirons nettoyés",
          "2 gousses ail",
          "Persil plat",
          "1 citron",
          "Huile olive",
          "Piment d Espelette",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Bien sécher les chipirons avec du papier absorbant.",
      "Mélanger huile olive, ail haché, persil, piment d Espelette et zeste de citron.",
      "Chauffer la plancha très fort.",
      "Saisir les chipirons 2 à 3min en remuant rapidement.",
      "Ajouter la persillade hors du feu, saler, ajouter du poivre du moulin et servir aussitôt."
    ],
    "notes": [
      "La cuisson doit être très courte pour éviter une texture caoutchouteuse."
    ],
    "technical": [
      {
        "label": "Saisie",
        "value": "Plancha très chaude et aliment bien sec c est la clé."
      }
    ],
    "additionalMasters": [
      "entrees_maitre"
    ]
  },
  "joues_de_boeuf_carottes_orange_vin_rouge": {
    "title": "Joues de boeuf carottes orange vin rouge",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/joues_de_boeuf_carottes_orange_vin_rouge_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 6,
    "yield": "6 personnes",
    "aliases": [
      "joues de boeuf mijotées",
      "boeuf orange vin rouge"
    ],
    "tags": [
      "boeuf",
      "mijote",
      "carotte"
    ],
    "ingredients": [
      {
        "group": "Mijoté",
        "items": [
          "1200g joues de boeuf",
          "600g carottes",
          "2 oignons",
          "2 gousses ail",
          "750ml vin rouge",
          "1 orange non traitée",
          "400ml fond de veau",
          "Thym",
          "Laurier",
          "Huile neutre",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Dorer les joues de boeuf sur toutes les faces dans une cocotte.",
      "Ajouter oignons, ail et carottes en tronçons, puis faire suer 5min.",
      "Déglacer au vin rouge et réduire 5min.",
      "Ajouter fond de veau, thym, laurier, zeste d orange et un peu de jus.",
      "Couvrir et mijoter 3h à feu doux, jusqu à viande fondante.",
      "Retirer la viande, réduire la sauce si besoin, puis remettre les joues pour les glacer."
    ],
    "notes": [
      "Les parfums se posent encore mieux après une nuit au frais."
    ],
    "technical": [
      {
        "label": "Collagène",
        "value": "La joue demande une cuisson longue et douce pour devenir fondante."
      }
    ],
    "practical": {
      "storage": [
        "3 jours au réfrigérateur."
      ],
      "reheating": [
        "Réchauffer doucement en cocotte, sans forte ébullition."
      ]
    }
  },
  "carre_d_agneau_croute_d_herbes": {
    "title": "Carré d’agneau croûte d’herbes",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/carre_d_agneau_croute_d_herbes_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Printemps"
    ],
    "difficulty": "hard",
    "difficultyScore": 7,
    "yield": "4 personnes",
    "aliases": [
      "carré agneau rôti",
      "agneau croute herbes"
    ],
    "tags": [
      "agneau",
      "herbes",
      "four"
    ],
    "ingredients": [
      {
        "group": "Agneau",
        "items": [
          "1 carré agneau de 8 côtes",
          "40g chapelure",
          "25g moutarde",
          "25g beurre mou",
          "Persil plat",
          "Thym",
          "Romarin",
          "1 gousse ail",
          "Huile olive",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Saler le carré et le saisir rapidement sur les faces grasses.",
      "Mélanger chapelure, herbes hachées, ail, beurre mou et poivre du moulin.",
      "Badigeonner l agneau de moutarde puis presser la croûte d herbes dessus.",
      "Rôtir 18 à 22min à 200°C selon l épaisseur.",
      "Laisser reposer 10min avant de trancher entre les côtes."
    ],
    "notes": [
      "Le repos est indispensable pour garder une viande juteuse."
    ],
    "technical": [
      {
        "label": "Croûte",
        "value": "La moutarde sert de colle et apporte une acidité discrète."
      }
    ]
  },
  "carpaccio_betterave_mozzarella_yuzu": {
    "title": "Carpaccio betterave mozzarella yuzu",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/carpaccio_betterave_mozzarella_yuzu_v2_spooky.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "aliases": [
      "carpaccio de betterave",
      "betterave mozzarella"
    ],
    "tags": [
      "betterave",
      "mozzarella",
      "yuzu"
    ],
    "ingredients": [
      {
        "group": "Carpaccio",
        "items": [
          "500g betteraves cuites",
          "250g mozzarella",
          "25g jus de yuzu",
          "45g huile olive",
          "15g miel",
          "Herbes fraîches",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Trancher les betteraves très finement.",
      "Égoutter la mozzarella et la déchirer en morceaux.",
      "Fouetter jus de yuzu, huile olive, miel, sel et poivre du moulin.",
      "Dresser betterave et mozzarella en assiette froide.",
      "Napper de vinaigrette et finir avec les herbes."
    ],
    "notes": [
      "Le yuzu peut être remplacé par citron vert et une pointe de mandarine."
    ],
    "technical": [
      {
        "label": "Coupe",
        "value": "Des tranches fines donnent une sensation plus fraîche et moins terreuse."
      }
    ]
  },
  "ajitsuke_tamago_oeufs_marines_ramen": {
    "title": "Ajitsuke tamago oeufs marinés ramen",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/ajitsuke_tamago_oeufs_marines_ramen_v2_spooky.jpg",
    "categories": [
      "Base",
      "Entrées"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "6 oeufs",
    "aliases": [
      "ajitama",
      "oeufs marinés ramen",
      "oeufs soja"
    ],
    "tags": [
      "oeuf",
      "ramen",
      "marinade"
    ],
    "ingredients": [
      {
        "group": "Oeufs marinés",
        "items": [
          "6 oeufs",
          "120g sauce soja",
          "120g mirin",
          "120g eau",
          "20g sucre",
          "1 morceau gingembre optionnel"
        ]
      }
    ],
    "steps": [
      "Cuire les oeufs 6min 30 dans l eau frémissante.",
      "Refroidir immédiatement dans l eau glacée puis écaler délicatement.",
      "Chauffer eau, sauce soja, mirin, sucre et gingembre, puis refroidir complètement.",
      "Immerger les oeufs dans la marinade froide 6 à 12h.",
      "Égoutter et couper au dernier moment."
    ],
    "notes": [
      "Une marinade froide évite de continuer la cuisson du jaune."
    ],
    "technical": [
      {
        "label": "Jaune",
        "value": "6min 30 donne un centre coulant à mollet selon la taille des oeufs."
      }
    ],
    "practical": {
      "storage": [
        "2 jours au réfrigérateur dans la marinade."
      ]
    },
    "additionalMasters": [
      "entrees_maitre"
    ]
  },
  "chorizo_au_cidre": {
    "title": "Chorizo au cidre",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/chorizo_au_cidre_v2_spooky.jpg",
    "categories": [
      "Apéro"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "aliases": [
      "tapas chorizo cidre"
    ],
    "tags": [
      "chorizo",
      "cidre",
      "tapas"
    ],
    "ingredients": [
      {
        "group": "Tapas",
        "items": [
          "300g chorizo à cuire",
          "250ml cidre brut",
          "1 feuille laurier",
          "Pain grillé"
        ]
      }
    ],
    "steps": [
      "Couper le chorizo en rondelles épaisses.",
      "Mettre chorizo, cidre et laurier dans une petite casserole.",
      "Mijoter 15 à 20min, jusqu à sauce réduite et brillante.",
      "Servir chaud avec pain grillé."
    ],
    "notes": [
      "Le cidre doit réduire mais garder un peu de jus pour saucer."
    ],
    "technical": [
      {
        "label": "Réduction",
        "value": "Une cuisson douce évite que le gras du chorizo se sépare brutalement."
      }
    ]
  },
  "saumon_au_four_tomates_olives_basilic": {
    "title": "Saumon au four tomates olives basilic",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/saumon_au_four_tomates_olives_basilic_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "saumon tomates cerises",
      "saumon olives basilic"
    ],
    "tags": [
      "saumon",
      "tomate",
      "four"
    ],
    "ingredients": [
      {
        "group": "Saumon",
        "items": [
          "4 pavés saumon",
          "400g tomates cerises",
          "80g olives",
          "30g pignons",
          "Basilic frais",
          "1 citron",
          "Huile olive",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Mettre tomates cerises, olives, pignons, huile olive, sel et poivre du moulin dans un plat.",
      "Cuire 12min à 190°C pour commencer à confire les tomates.",
      "Ajouter le saumon, arroser d huile et de citron.",
      "Cuire encore 10 à 12min selon l épaisseur.",
      "Finir avec basilic frais juste avant de servir."
    ],
    "notes": [
      "Ajouter le basilic après cuisson pour garder son parfum."
    ],
    "technical": [
      {
        "label": "Poisson",
        "value": "Le saumon reste plus moelleux si les tomates commencent seules au four."
      }
    ]
  },
  "poulet_frit_air_fryer": {
    "title": "Poulet frit air fryer",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/poulet_frit_air_fryer_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "aliases": [
      "poulet croustillant air fryer",
      "poulet frit sans bain"
    ],
    "tags": [
      "poulet",
      "air fryer",
      "croustillant"
    ],
    "ingredients": [
      {
        "group": "Poulet",
        "items": [
          "800g hauts de cuisses de poulet désossés",
          "250g lait fermenté",
          "160g farine",
          "40g fécule de maïs",
          "Paprika",
          "Ail en poudre",
          "Piment doux",
          "Sel fin",
          "Poivre du moulin",
          "Huile en spray"
        ]
      }
    ],
    "steps": [
      "Mariner le poulet 1h dans le lait fermenté assaisonné.",
      "Mélanger farine, fécule, paprika, ail, piment, sel et poivre du moulin.",
      "Égoutter le poulet, l enrober fortement de panure et laisser reposer 10min.",
      "Pulvériser un peu d huile et cuire 18 à 22min à 190°C en retournant à mi-cuisson.",
      "Servir quand la panure est sèche, dorée et croustillante."
    ],
    "notes": [
      "L huile en spray aide la panure à dorer sans bain de friture."
    ],
    "technical": [
      {
        "label": "Panure",
        "value": "Le repos après enrobage hydrate la farine et limite les zones poudreuses."
      }
    ]
  },
  "poulet_gaston_gerard": {
    "title": "Poulet Gaston Gérard",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/poulet_gaston_gerard_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 6,
    "yield": "4 personnes",
    "aliases": [
      "poulet moutarde comté",
      "gaston gerard"
    ],
    "tags": [
      "poulet",
      "moutarde",
      "comte"
    ],
    "ingredients": [
      {
        "group": "Poulet",
        "items": [
          "4 cuisses de poulet",
          "200ml vin blanc sec",
          "250g crème épaisse",
          "40g moutarde de Dijon",
          "120g comté râpé",
          "1 oignon",
          "30g beurre",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Dorer le poulet au beurre dans une cocotte.",
      "Ajouter l oignon émincé, faire suer puis déglacer au vin blanc.",
      "Couvrir et cuire 35 à 40min à feu doux.",
      "Mélanger crème, moutarde et une partie du comté.",
      "Napper le poulet, ajouter le reste de comté et gratiner 8 à 10min au four chaud."
    ],
    "notes": [
      "La moutarde doit parfumer la sauce sans masquer le comté."
    ],
    "technical": [
      {
        "label": "Gratin",
        "value": "Gratiner court pour dorer le fromage sans faire trancher la crème."
      }
    ]
  },
  "beurre_clarifie": {
    "title": "Beurre clarifié",
    "master": "elements_base_maitre",
    "image": "/assets/recipe-images-optimized/beurre_clarifie_v2_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "environ 160g",
    "aliases": [
      "ghee",
      "beurre clarifie"
    ],
    "tags": [
      "beurre",
      "base",
      "cuisson"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "200g beurre doux"
        ]
      }
    ],
    "steps": [
      "Faire fondre le beurre très doucement sans remuer.",
      "Laisser l eau s évaporer et l écume remonter en surface.",
      "Retirer l écume avec une cuillère.",
      "Verser lentement le gras jaune clair dans un pot en laissant le dépôt blanc au fond.",
      "Refroidir puis fermer."
    ],
    "notes": [
      "Le beurre clarifié supporte mieux les cuissons qu un beurre entier."
    ],
    "technical": [
      {
        "label": "Séparation",
        "value": "On garde le gras pur et on retire eau, mousse et caséine."
      }
    ],
    "practical": {
      "storage": [
        "Plusieurs semaines au réfrigérateur dans un pot propre."
      ]
    }
  },
  "hauts_de_cuisses_poulet_orange_oignon": {
    "title": "Hauts de cuisses poulet orange oignon",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/hauts_de_cuisses_poulet_orange_oignon_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "poulet orange oignon"
    ],
    "tags": [
      "poulet",
      "orange",
      "four"
    ],
    "ingredients": [
      {
        "group": "Poulet",
        "items": [
          "800g hauts de cuisses de poulet",
          "2 oranges",
          "3 oignons",
          "30g miel",
          "25g sauce soja",
          "Huile olive",
          "Thym",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Émincer les oignons et les déposer dans un plat.",
      "Mélanger jus et zeste d orange, miel, sauce soja, huile olive, thym et poivre du moulin.",
      "Enrober le poulet et le poser sur les oignons.",
      "Cuire 40 à 45min à 190°C en arrosant régulièrement.",
      "Servir avec le jus réduit et les oignons fondants."
    ],
    "notes": [
      "L orange doit apporter du peps, pas transformer le plat en dessert."
    ],
    "technical": [
      {
        "label": "Jus",
        "value": "Arroser en cours de cuisson pour garder la peau brillante."
      }
    ]
  },
  "puree_pommes_de_terre_citron": {
    "title": "Purée pommes de terre citron",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/puree_pommes_de_terre_citron_v2_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "purée citron",
      "puree jamie oliver"
    ],
    "tags": [
      "pomme de terre",
      "citron",
      "puree"
    ],
    "ingredients": [
      {
        "group": "Purée",
        "items": [
          "1000g pommes de terre farineuses",
          "80g beurre doux",
          "120g lait chaud",
          "1 citron",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les pommes de terre pelées dans l eau salée jusqu à tendreté.",
      "Égoutter et sécher 2min dans la casserole chaude.",
      "Écraser avec le beurre, puis détendre avec le lait chaud.",
      "Ajouter zeste de citron et quelques gouttes de jus.",
      "Rectifier sel et poivre du moulin."
    ],
    "notes": [
      "Ajoute le jus de citron progressivement pour ne pas dominer la pomme de terre."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Écraser, ne pas mixer, pour éviter une purée collante."
      }
    ]
  },
  "salade_oeufs_durs_mayonnaise_bistrot": {
    "title": "Salade oeufs durs mayonnaise",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/salade_oeufs_durs_mayonnaise_bistrot_v2_spooky.jpg",
    "categories": [
      "Entrées"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "aliases": [
      "salade oeufs mayonnaise",
      "oeufs durs mayo"
    ],
    "tags": [
      "oeuf",
      "mayonnaise",
      "salade"
    ],
    "ingredients": [
      {
        "group": "Salade",
        "items": [
          "8 oeufs",
          "120g <span data-goto=\"mayonnaise_maison\">mayonnaise</span>",
          "20g moutarde douce",
          "Ciboulette",
          "Cornichons optionnels",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les oeufs 9 à 10min, refroidir puis écaler.",
      "Couper les oeufs en gros morceaux.",
      "Mélanger mayonnaise, moutarde, ciboulette, sel et poivre du moulin.",
      "Enrober les oeufs délicatement.",
      "Ajouter cornichons hachés si souhaité et servir frais."
    ],
    "notes": [
      "Une mayonnaise assez ferme donne une salade plus nette."
    ],
    "technical": [
      {
        "label": "Oeufs",
        "value": "Refroidir vite pour stopper la cuisson et faciliter l écalage."
      }
    ]
  },
  "cuisses_de_poulet_miel_moutarde": {
    "title": "Cuisses de poulet miel moutarde",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cuisses_de_poulet_miel_moutarde_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "poulet miel moutarde four"
    ],
    "tags": [
      "poulet",
      "moutarde",
      "miel"
    ],
    "ingredients": [
      {
        "group": "Poulet",
        "items": [
          "4 cuisses de poulet",
          "45g miel",
          "40g moutarde de Dijon",
          "25g huile olive",
          "1 gousse ail",
          "Thym",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Mélanger miel, moutarde, huile olive, ail, thym, sel et poivre du moulin.",
      "Badigeonner les cuisses de poulet.",
      "Cuire 45 à 50min à 190°C en arrosant à mi-cuisson.",
      "Laisser reposer 5min avant service."
    ],
    "notes": [
      "La moutarde équilibre le miel et évite une sauce trop sucrée."
    ],
    "technical": [
      {
        "label": "Coloration",
        "value": "Surveiller la peau en fin de cuisson car le miel caramélise vite."
      }
    ]
  },
  "riz_au_citron": {
    "title": "Riz au citron",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/riz_au_citron_v2_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "aliases": [
      "riz citronné",
      "riz parfumé citron"
    ],
    "tags": [
      "riz",
      "citron",
      "accompagnement"
    ],
    "ingredients": [
      {
        "group": "Riz",
        "items": [
          "300g riz basmati",
          "1 citron",
          "30g beurre doux",
          "600g bouillon de volaille ou légumes",
          "Persil plat",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Rincer le riz jusqu à eau presque claire.",
      "Nacrer le riz 1min avec le beurre.",
      "Ajouter bouillon chaud, zeste de citron, sel et poivre du moulin.",
      "Couvrir et cuire 12min à feu doux.",
      "Laisser reposer 5min hors du feu, puis ajouter un peu de jus de citron et persil."
    ],
    "notes": [
      "Le jus de citron se dose à la fin pour garder un parfum frais."
    ],
    "technical": [
      {
        "label": "Repos",
        "value": "Le riz finit d absorber la vapeur hors du feu."
      }
    ]
  },
  "saucisse_puree_maison": {
    "title": "Saucisse purée",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/saucisse_puree_maison_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "saucisse purée"
    ],
    "tags": [
      "saucisse",
      "puree",
      "confort"
    ],
    "ingredients": [
      {
        "group": "Plat",
        "items": [
          "4 saucisses de Toulouse",
          "1000g pommes de terre farineuses",
          "120g lait chaud",
          "80g beurre doux",
          "2 oignons",
          "150ml bouillon",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les pommes de terre à l eau salée jusqu à tendreté.",
      "Cuire les saucisses doucement à la poêle pour les dorer sans éclater.",
      "Faire fondre les oignons émincés dans le gras de cuisson.",
      "Déglacer avec le bouillon et réduire en jus court.",
      "Écraser les pommes de terre avec beurre et lait chaud.",
      "Servir saucisses, purée et jus aux oignons."
    ],
    "notes": [
      "Une cuisson douce garde les saucisses juteuses."
    ],
    "technical": [
      {
        "label": "Purée",
        "value": "Le lait doit être chaud pour ne pas figer le beurre."
      }
    ]
  },
  "joues_de_porc_chorizo_piment": {
    "title": "Joues de porc chorizo piment",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/joues_de_porc_chorizo_piment_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "aliases": [
      "joues de porc chorizo",
      "porc piment espelette"
    ],
    "tags": [
      "porc",
      "chorizo",
      "mijote"
    ],
    "ingredients": [
      {
        "group": "Mijoté",
        "items": [
          "800g joues de porc",
          "150g chorizo",
          "2 oignons",
          "2 gousses ail",
          "400g tomates concassées",
          "250ml vin blanc sec",
          "Piment d Espelette",
          "Huile olive",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Dorer les joues de porc dans une cocotte.",
      "Ajouter oignons, ail et chorizo en rondelles, puis faire revenir 5min.",
      "Déglacer au vin blanc et réduire légèrement.",
      "Ajouter tomates, piment d Espelette, sel et poivre du moulin.",
      "Couvrir et mijoter 1h45 à 2h, jusqu à viande fondante.",
      "Réduire la sauce à découvert si besoin."
    ],
    "notes": [
      "Le chorizo sale déjà la sauce assaisonne prudemment."
    ],
    "technical": [
      {
        "label": "Mijotage",
        "value": "La joue de porc doit cuire doucement pour garder son moelleux."
      }
    ]
  },
  "lentilles_a_la_bourguignonne": {
    "title": "Lentilles à la bourguignonne",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/lentilles_a_la_bourguignonne_v2_spooky.jpg",
    "categories": [
      "Plats",
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "aliases": [
      "lentilles bourguignonne"
    ],
    "tags": [
      "lentilles",
      "vin rouge",
      "mijote"
    ],
    "ingredients": [
      {
        "group": "Lentilles",
        "items": [
          "300g lentilles vertes",
          "150g champignons",
          "150g carottes",
          "100g lardons optionnels",
          "1 oignon",
          "300ml vin rouge",
          "500ml bouillon",
          "Thym",
          "Laurier",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Faire revenir oignon, carottes, champignons et lardons si utilisés.",
      "Ajouter les lentilles, thym, laurier et vin rouge.",
      "Réduire 3min puis ajouter le bouillon.",
      "Mijoter 30 à 35min, jusqu à lentilles tendres.",
      "Saler en fin de cuisson et ajuster au poivre du moulin."
    ],
    "notes": [
      "Saler trop tôt peut durcir légèrement les lentilles."
    ],
    "technical": [
      {
        "label": "Cuisson",
        "value": "Garder un frémissement doux pour ne pas éclater les lentilles."
      }
    ],
    "additionalMasters": [
      "accompagnements_maitre"
    ]
  },
  "beurre_d_escargot_persille": {
    "title": "Beurre d’escargot persillé",
    "master": "sauces_maitre",
    "image": "/assets/recipe-images-optimized/beurre_d_escargot_persille_v2_spooky.jpg",
    "categories": [
      "Sauces",
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "environ 250g",
    "aliases": [
      "beurre persillé",
      "beurre escargot"
    ],
    "tags": [
      "beurre",
      "persil",
      "ail"
    ],
    "ingredients": [
      {
        "group": "Beurre composé",
        "items": [
          "250g beurre doux mou",
          "25g persil plat",
          "3 gousses ail",
          "20g échalote",
          "15g jus de citron",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Hacher très finement persil, ail et échalote.",
      "Travailler le beurre mou avec les aromates, citron, sel et poivre du moulin.",
      "Former un boudin dans du papier cuisson ou garnir directement.",
      "Réfrigérer 1h avant utilisation."
    ],
    "notes": [
      "Fonctionne avec escargots, champignons, pommes de terre ou pain grillé."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Le beurre doit être pommade, pas fondu, pour garder une émulsion nette."
      }
    ],
    "practical": {
      "storage": [
        "5 jours au réfrigérateur ou 2 mois au congélateur."
      ]
    },
    "additionalMasters": [
      "elements_base_maitre"
    ]
  },
  "puree_courge_butternut": {
    "title": "Purée de courge butternut",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/puree_courge_butternut_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "aliases": [
      "purée butternut",
      "purée de courge",
      "butternut"
    ],
    "tags": [
      "courge",
      "butternut",
      "puree"
    ],
    "ingredients": [
      {
        "group": "Purée",
        "items": [
          "1 courge butternut d’environ 1kg",
          "40g beurre doux",
          "80g crème fraîche épaisse",
          "1 pincée muscade fraîchement râpée au zesteur",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Éplucher la courge, retirer les graines puis couper la chair en cubes réguliers.",
      "Cuire dans l’eau bouillante salée 18 à 25min, jusqu’à ce que la courge s’écrase facilement.",
      "Égoutter soigneusement puis remettre 2min dans la casserole chaude pour sécher la chair.",
      "Écraser avec le beurre, la crème, la muscade râpée au zesteur et le poivre du moulin.",
      "Rectifier l’assaisonnement et servir chaud."
    ],
    "notes": [
      "Bien sécher la courge après cuisson évite une purée trop liquide.",
      "La muscade se râpe au dernier moment pour garder un parfum net."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Écraser ou mixer très court selon la finesse voulue, sans détendre inutilement."
      }
    ],
    "practical": {
      "storage": [
        "2 à 3 jours au réfrigérateur en boîte hermétique."
      ]
    }
  },
  "riz_cantonnais": {
    "title": "Riz cantonnais",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/riz_cantonnais_spooky.jpg",
    "categories": [
      "Plats",
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "riz sauté",
      "riz aux petits pois",
      "riz cantonais"
    ],
    "tags": [
      "riz",
      "oeuf",
      "petits pois",
      "jambon"
    ],
    "ingredients": [
      {
        "group": "Riz sauté",
        "items": [
          "300g riz long cuit et refroidi",
          "150g petits pois cuits",
          "120g jambon blanc en dés",
          "2 oeufs",
          "2 oignons nouveaux",
          "25g huile neutre",
          "20g sauce soja",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les oeufs en omelette fine, puis les détailler en lanières.",
      "Saisir les oignons nouveaux 1min dans l’huile chaude.",
      "Ajouter le riz froid et le faire sauter 3 à 4min pour bien détacher les grains.",
      "Ajouter petits pois, jambon, sauce soja et poivre du moulin.",
      "Incorporer les lanières d’omelette, mélanger rapidement et servir chaud."
    ],
    "notes": [
      "Le riz froid de la veille se détache mieux et donne une texture plus nette.",
      "Dose le sel avec prudence car la sauce soja et le jambon assaisonnent déjà."
    ],
    "technical": [
      {
        "label": "Saisie",
        "value": "La poêle doit être chaude pour sauter le riz sans le transformer en purée."
      }
    ],
    "additionalMasters": [
      "accompagnements_maitre"
    ]
  },
  "pates_pesto_tomates_mozzarella": {
    "title": "Pâtes au pesto, tomates cerises et mozzarella",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/pates_pesto_tomates_mozzarella_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Printemps",
      "Été"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "aliases": [
      "pâtes pesto tomates mozzarella",
      "pates pesto",
      "pâtes tomates cerises mozzarella"
    ],
    "tags": [
      "pates",
      "pesto",
      "tomates",
      "mozzarella"
    ],
    "ingredients": [
      {
        "group": "Pâtes",
        "items": [
          "400g pâtes courtes",
          "180g pesto",
          "250g tomates cerises",
          "200g billes de mozzarella",
          "30g parmesan râpé",
          "Basilic frais",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les pâtes al dente dans une grande casserole d’eau salée.",
      "Couper les tomates cerises en deux et égoutter les billes de mozzarella.",
      "Prélever une petite louche d’eau de cuisson puis égoutter les pâtes.",
      "Mélanger les pâtes chaudes avec le pesto et un peu d’eau de cuisson pour enrober sans assécher.",
      "Ajouter tomates, mozzarella, parmesan, basilic et poivre du moulin juste avant de servir."
    ],
    "notes": [
      "Ajoute la mozzarella hors du feu pour qu’elle reste moelleuse sans rendre trop d’eau.",
      "L’eau de cuisson lie le pesto aux pâtes et évite un résultat sec."
    ],
    "technical": [
      {
        "label": "Liaison",
        "value": "Un peu d’eau amidonnée rend le pesto plus souple et brillant."
      }
    ]
  },
  "cabillaud_crumble_chorizo": {
    "title": "Cabillaud au four, crumble de chorizo",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cabillaud_crumble_chorizo_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "aliases": [
      "cabillaud chorizo",
      "poisson crumble chorizo",
      "dos de cabillaud au chorizo"
    ],
    "tags": [
      "cabillaud",
      "poisson",
      "chorizo",
      "four"
    ],
    "ingredients": [
      {
        "group": "Poisson",
        "items": [
          "4 dos de cabillaud",
          "80g chorizo",
          "40g chapelure",
          "30g parmesan râpé",
          "35g beurre doux froid",
          "1 citron",
          "Persil plat",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Préchauffer le four à 180°C chaleur tournante 10min avant cuisson.",
      "Mixer grossièrement chorizo, chapelure, parmesan et beurre froid pour obtenir un crumble.",
      "Déposer les dos de cabillaud dans un plat légèrement huilé et assaisonner au poivre du moulin.",
      "Répartir le crumble sur le poisson sans trop tasser.",
      "Cuire 12 à 15min selon l’épaisseur, jusqu’à poisson nacré et crumble doré.",
      "Finir avec persil et quelques gouttes de citron."
    ],
    "notes": [
      "Le chorizo et le parmesan salent déjà le plat : goûte avant d’ajouter du sel.",
      "Le cabillaud doit rester nacré au centre pour ne pas sécher."
    ],
    "technical": [
      {
        "label": "Crumble",
        "value": "Garder des morceaux irréguliers donne une meilleure texture qu’une poudre trop fine."
      }
    ]
  },
  "lentilles_tomate_pommes_de_terre_sautees": {
    "title": "Lentilles tomate pommes de terre sautées",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/lentilles_tomate_pommes_de_terre_sautees_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Printemps",
      "Automne"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "aliases": [
      "lentilles tomate",
      "lentilles pommes de terre sautees"
    ],
    "tags": [
      "lentilles",
      "tomate",
      "pomme de terre"
    ],
    "ingredients": [
      {
        "group": "Lentilles",
        "items": [
          "280g lentilles vertes",
          "500g pommes de terre",
          "400g tomates concassées",
          "1 oignon",
          "1 gousse ail",
          "500ml bouillon",
          "Thym",
          "Huile olive",
          "Sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les lentilles avec bouillon, oignon, ail, thym et tomates 25 à 30min.",
      "Couper les pommes de terre en dés et les sauter à l huile olive 20min jusqu à dorure.",
      "Saler les lentilles en fin de cuisson.",
      "Servir les lentilles tomatées avec les pommes de terre croustillantes par-dessus."
    ],
    "notes": [
      "Le contraste lentilles fondantes et pommes de terre sautées fait tout le plat."
    ],
    "technical": [
      {
        "label": "Pommes de terre",
        "value": "Les sécher avant cuisson améliore la coloration."
      }
    ]
  },
  "puree_butternut_pommes_terre_curry": {
    "title": "Puree butternut pommes de terre curry",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/puree_butternut_pommes_terre_curry_v2_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 e 6 personnes",
    "nutriScore": "B",
    "aliases": [
      "puree butternut curry",
      "puree courge pommes de terre",
      "butternut pommes de terre"
    ],
    "tags": [
      "butternut",
      "pomme de terre",
      "curry",
      "puree",
      "accompagnement"
    ],
    "ingredients": [
      {
        "group": "Puree",
        "items": [
          "750g pommes de terre",
          "350g chair de butternut",
          "150ml lait",
          "3g curry doux",
          "1 pincee piment deEspelette",
          "Sel fin",
          "poivre du moulin",
          "Persil plat cisele"
        ]
      }
    ],
    "steps": [
      "eplucher les pommes de terre et retirer graines et peau de la butternut.",
      "Couper les legumes en morceaux reguliers pour queils cuisent au meme rythme.",
      "Cuire e la vapeur 13 e 18min, ou e leeau salee jusquee tendrete nette.",
      "Chauffer le lait avec curry, sel, piment deEspelette et poivre du moulin.",
      "ecraser les legumes au presse-puree, puis incorporer le lait epice peu e peu.",
      "Rectifier la texture et finir avec persil plat cisele."
    ],
    "notes": [
      "Ajouter le lait progressivement permet de garder une puree tenue, pas liquide.",
      "Tres bon avec volaille retie, poisson blanc ou legumes verts."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "ecraser plutet que mixer longtemps pour eviter une texture collante."
      }
    ],
    "practical": {
      "equipment": [
        "Cuit-vapeur ou casserole",
        "Presse-puree",
        "Petite casserole"
      ],
      "storage": [
        "2 e 3 jours au refrigerateur en boete hermetique."
      ],
      "result": [
        "Puree douce, legerement epicee, assez neutre pour accompagner un plat principal."
      ]
    }
  },
  "joues_boeuf_whiskey_orange": {
    "title": "Joues de boeuf whiskey orange",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/joues_boeuf_whiskey_orange_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "8 personnes",
    "nutriScore": "C",
    "aliases": [
      "joues de boeuf whiskey",
      "boeuf orange whiskey",
      "plat mijote orange"
    ],
    "tags": [
      "boeuf",
      "joues",
      "orange",
      "whiskey",
      "mijote"
    ],
    "ingredients": [
      {
        "group": "Mijote",
        "items": [
          "1,8kg joues de beuf",
          "25g beurre doux",
          "25g huile neutre",
          "2 oignons",
          "1 gousse ail",
          "1 branche celeri",
          "25g farine",
          "150ml jus deorange frais",
          "100ml whiskey",
          "40g marmelade orange",
          "1kg carottes",
          "100ml eau",
          "2 feuilles laurier",
          "3 brins thym",
          "Sel fin",
          "poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Couper les joues en gros morceaux et preparer oignons, ail, celeri et carottes.",
      "Colorer la viande dans beurre et huile, en plusieurs fois si la cocotte est petite.",
      "Ajouter oignons, ail et celeri, puis laisser suer quelques minutes.",
      "Singer avec la farine, melanger et mouiller avec jus deorange, whiskey, eau et marmelade.",
      "Ajouter carottes, laurier, thym, sel et poivre du moulin.",
      "Couvrir et mijoter doucement 1h10 e 1h30, jusquee viande fondante et sauce nappante.",
      "Laisser reposer 10min hors du feu, retirer laurier et thym puis servir."
    ],
    "notes": [
      "Encore meilleur rechauffe doucement le lendemain.",
      "Servir avec puree simple, pommes vapeur ou legumes verts plutet queun second accompagnement sucre."
    ],
    "technical": [
      {
        "label": "Mijotage",
        "value": "Le liquide doit fremir doucement, jamais bouillir fort."
      },
      {
        "label": "Sauce",
        "value": "La marmelade apporte rondeur et brillance, mais la sauce doit rester salee et courte."
      }
    ],
    "practical": {
      "equipment": [
        "Grande cocotte",
        "Presse-agrumes",
        "Couteau"
      ],
      "storage": [
        "3 jours au refrigerateur.",
        "Congelation possible 2 mois avec la sauce."
      ],
      "result": [
        "Viande fondante, sauce brune parfumee e leorange, finale chaleureuse."
      ]
    }
  },
  "sauce_roquefort": {
    "title": "Sauce roquefort",
    "master": "sauces_maitre",
    "image": "/assets/recipe-images-optimized/sauce_roquefort_v2_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "2 e 4 personnes",
    "nutriScore": "D",
    "aliases": [
      "sauce au roquefort",
      "sauce fromage bleu"
    ],
    "tags": [
      "roquefort",
      "creme",
      "fromage",
      "sauce chaude"
    ],
    "ingredients": [
      {
        "group": "Sauce",
        "items": [
          "30g roquefort",
          "75ml creme fraeche entiere",
          "poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Emietter le roquefort dans une petite casserole.",
      "Ajouter la creme et chauffer a feu doux en remuant regulierement.",
      "Laisser fondre 7 a 8min, jusqu a sauce homogene ou legerement texturee selon gout.",
      "Ajouter poivre du moulin, gouter et servir chaud sans ajouter de sel."
    ],
    "notes": [
      "Tres salee naturellement : goeter avant toute correction.",
      "Pour epaissir, ajouter une pointe de fecule diluee dans un peu de creme froide."
    ],
    "technical": [
      {
        "label": "Feu doux",
        "value": "Un feu trop fort peut trancher la creme et durcir le fromage."
      }
    ],
    "practical": {
      "equipment": [
        "Petite casserole",
        "Fouet souple"
      ],
      "storage": [
        "2 jours au refrigerateur, rechauffer doucement."
      ],
      "result": [
        "Sauce courte, cremeuse, puissante mais arrondie."
      ]
    }
  },
  "curry_carottes_lait_coco": {
    "title": "Curry de carottes lait de coco",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/curry_carottes_lait_coco_v2_spooky.jpg",
    "categories": [
      "Accompagnements",
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver",
      "Printemps"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 e 6 personnes",
    "nutriScore": "B",
    "aliases": [
      "carottes curry coco",
      "carottes lait de coco",
      "curry vegetarien carottes"
    ],
    "tags": [
      "carotte",
      "curry",
      "lait de coco",
      "citron vert",
      "vegetarien"
    ],
    "ingredients": [
      {
        "group": "Curry",
        "items": [
          "1kg carottes",
          "25g huile deolive",
          "1 oignon",
          "1 gousse ail",
          "200ml lait de coco",
          "300ml bouillon de legumes ou volaille",
          "3g curry",
          "1g gingembre moulu",
          "1 pincee curcuma",
          "1 citron vert",
          "Sauce sriracha selon goet",
          "Persil ou coriandre ciselee",
          "Sel fin",
          "poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Tailler les carottes en fines rondelles et ciseler oignon et ail.",
      "Faire suer leoignon dans lehuile, ajouter leail puis les epices.",
      "Ajouter carottes, lait de coco et bouillon e hauteur.",
      "Cuire 20min e couvert, puis 20min e decouvert pour concentrer la sauce.",
      "Finir avec jus de citron vert, herbes et une touche de sriracha si souhaite."
    ],
    "notes": [
      "En plat vegetarien, servir avec semoule ou pois chiches.",
      "En accompagnement, tres bon avec poulet reti ou poisson blanc."
    ],
    "technical": [
      {
        "label": "epices",
        "value": "Les chauffer brievement dans lehuile reveille le parfum sans les breler."
      }
    ],
    "practical": {
      "equipment": [
        "Cocotte",
        "Couteau",
        "Zesteur ou presse-agrumes"
      ],
      "storage": [
        "3 jours au refrigerateur."
      ],
      "result": [
        "Carottes fondantes, sauce coco-curry courte et finale citronnee."
      ]
    },
    "additionalMasters": [
      "plats_maitre"
    ]
  },
  "potato_wedges_citron_herbes": {
    "title": "Potato wedges citron herbes",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/potato_wedges_citron_herbes_v2_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "nutriScore": "C",
    "aliases": [
      "potato wedges",
      "quartiers de pommes de terre au four",
      "wedges citron"
    ],
    "tags": [
      "pomme de terre",
      "four",
      "citron",
      "herbes",
      "croustillant"
    ],
    "ingredients": [
      {
        "group": "Wedges",
        "items": [
          "800g pommes de terre",
          "35g huile deolive",
          "2g sel fin",
          "6g herbes de Provence",
          "1 citron bio",
          "poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Prechauffer le four e 190eC chaleur tournante.",
      "Couper les pommes de terre en gros quartiers reguliers.",
      "Enrober avec huile, sel, poivre du moulin et herbes.",
      "Ajouter quelques rondelles de citron dans le plat ou sur la plaque.",
      "Cuire 40min environ, en retournant e mi-cuisson, jusquee bords dores et ceur tendre.",
      "Servir chaud avec une sauce fraeche ou une viande grillee."
    ],
    "notes": [
      "Bien espacer les quartiers ameliore la coloration.",
      "Le citron parfume le plat : ne pas en mettre trop si la sauce du menu est deje acide."
    ],
    "technical": [
      {
        "label": "Decoupe",
        "value": "Des quartiers de taille reguliere evitent les morceaux breles et les centres crus."
      }
    ],
    "practical": {
      "equipment": [
        "Plaque ou plat e four",
        "Papier cuisson"
      ],
      "storage": [
        "Meilleur juste cuit.",
        "Rechauffer au four plutet queau micro-ondes."
      ],
      "result": [
        "Quartiers dores, parfumes aux herbes, avec une note citronnee."
      ]
    }
  },
  "houmous_hakocem": {
    "title": "Houmous tahine tres cremeux",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/houmous_hakocem_v2_spooky.jpg",
    "categories": [
      "Apero",
      "Entrees"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "1 grand bol",
    "nutriScore": "B",
    "aliases": [
      "houmous hakocem",
      "houmous tahini",
      "houmous sans ail"
    ],
    "tags": [
      "pois chiches",
      "tahine",
      "citron",
      "apero",
      "vegetarien"
    ],
    "ingredients": [
      {
        "group": "Tahine tres cremeux",
        "items": [
          "260g pois chiches cuits",
          "120g eau de cuisson des pois chiches",
          "100g jus de citron frais ou acidite selon gout",
          "5g sel fin",
          "480g tahine",
          "240g eau froide"
        ],
        "steps": [
          "Mixer pois chiches, eau de cuisson, citron et sel jusqu a base tres lisse.",
          "Ajouter tahine et eau froide progressivement.",
          "Mixer longuement jusqu a texture souple."
        ]
      },
      {
        "group": "Houmous epice",
        "items": [
          "260g pois chiches cuits",
          "90g tahine",
          "45g jus de citron",
          "30g huile d olive",
          "10g harissa rouge ou piment doux",
          "6g cumin",
          "5g sel fin",
          "Eau froide pour detendre"
        ],
        "steps": [
          "Mixer pois chiches, tahine, citron, huile, harissa, cumin et sel.",
          "Detendre avec eau froide jusqu a texture cremeuse.",
          "Finir huile d olive et paprika au service."
        ]
      }
    ],
    "steps": [
      "Mixer pois chiches, eau de cuisson, citron et sel jusquee base tres lisse.",
      "Ajouter la moitie du tahine et la moitie de leeau froide, puis mixer longuement.",
      "Ajouter le reste de tahine et deeau froide en ajustant la texture.",
      "Mixer jusquee houmous souple, clair et presque mousseux.",
      "Goeter, corriger sel et citron, puis servir avec huile deolive et pain plat."
    ],
    "notes": [
      "La version epicee est une variante interne du houmous deja present.",
      "Servir avec pain plat, gressins ou legumes crus."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Leeau froide detend le tahine et donne une texture plus legere."
      }
    ],
    "practical": {
      "equipment": [
        "Robot coupe ou blender puissant",
        "Spatule"
      ],
      "storage": [
        "3 jours au refrigerateur, couvert au contact."
      ],
      "result": [
        "Houmous tres cremeux, riche en sesame, acidite nette mais douce."
      ]
    },
    "additionalMasters": [
      "entrees_maitre"
    ],
    "variantGroups": true,
    "linkedRecipes": [
      {
        "id": "harissa_maison",
        "role": "Option epicee"
      }
    ]
  },
  "falafels_four": {
    "title": "Falafels au four",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/falafels_four_v2_spooky.jpg",
    "categories": [
      "Apero",
      "Entrees"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "16 falafels",
    "nutriScore": "B",
    "aliases": [
      "falafels cuits au four",
      "falafels pois chiches",
      "falafel four"
    ],
    "tags": [
      "pois chiches",
      "cumin",
      "coriandre",
      "four",
      "vegetarien"
    ],
    "ingredients": [
      {
        "group": "Pete",
        "items": [
          "350g pois chiches secs trempes 12h",
          "1 oignon jaune",
          "1 petite botte persil",
          "5 brins menthe ou ciboulette",
          "1 petite botte coriandre",
          "2 gousses ail",
          "3g cumin moulu",
          "1 pincee cardamome",
          "5g sel fin",
          "poivre du moulin",
          "11g levure chimique",
          "15g farine de ble"
        ]
      },
      {
        "group": "Cuisson",
        "items": [
          "15g graines de sesame",
          "25g huile deolive"
        ]
      }
    ],
    "steps": [
      "Faire tremper les pois chiches secs au moins 12h, puis bien les egoutter et les secher.",
      "Mixer pois chiches, oignon, herbes, ail, epices, sel et poivre du moulin en texture granuleuse.",
      "Incorporer levure et farine, puis laisser reposer 1h au frais.",
      "Former 16 boulettes tassees sans les compacter excessivement.",
      "Deposer sur plaque, parsemer de sesame et arroser deun filet dehuile.",
      "Cuire 18 e 22min e 190eC chaleur tournante, jusquee dore et ceur encore moelleux."
    ],
    "notes": [
      "Ne pas utiliser pois chiches en boete pour cette version : la pete serait trop humide.",
      "La pete crue faeonnee peut se congeler avant cuisson."
    ],
    "technical": [
      {
        "label": "Texture",
        "value": "Chercher une semoule humide, pas une puree lisse."
      },
      {
        "label": "Cuisson",
        "value": "Sortir des que la surface dore pour garder le centre moelleux."
      }
    ],
    "practical": {
      "equipment": [
        "Robot coupe",
        "Plaque",
        "Papier cuisson"
      ],
      "storage": [
        "2 jours au refrigerateur apres cuisson.",
        "Congelation possible avant cuisson."
      ],
      "result": [
        "Falafels dores, herbaces, plus legers queune friture."
      ]
    },
    "additionalMasters": [
      "entrees_maitre"
    ]
  },
  "cuisses_poulet_asiatique": {
    "title": "Cuisses de poulet asiatique",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cuisses_poulet_asiatique_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "nutriScore": "C",
    "aliases": [
      "poulet asiatique au four",
      "cuisses poulet citron vert miel",
      "poulet gingembre nuoc mam"
    ],
    "tags": [
      "poulet",
      "citron vert",
      "gingembre",
      "miel",
      "sriracha"
    ],
    "ingredients": [
      {
        "group": "Poulet",
        "items": [
          "3 cuisses de poulet coupees en deux",
          "30g jus de citron vert",
          "20g miel",
          "20g gingembre frais repe",
          "2 gousses ail repees",
          "15g nuoc-mem ou sel fin",
          "8g sauce sriracha ou piment doux selon goet",
          "15g huile neutre",
          "Persil ou coriandre ciselee",
          "poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Prechauffer le four e 200eC.",
      "Melanger citron vert, miel, gingembre, ail, nuoc-mem, sriracha et huile.",
      "eponger le poulet puis leenrober soigneusement de marinade.",
      "Disposer en plat sans superposer les morceaux.",
      "Cuire 40min environ, en arrosant une fois avec le jus du plat.",
      "Finir avec persil ou coriandre et servir avec riz simple ou legumes verts."
    ],
    "notes": [
      "Si le nuoc-mem est remplace par du sel, ajouter par petites pincees et goeter la marinade.",
      "Le miel colore vite : surveiller la fin de cuisson."
    ],
    "technical": [
      {
        "label": "equilibre",
        "value": "Citron, miel et nuoc-mem doivent former une marinade salee-acidulee, pas sucree."
      }
    ],
    "practical": {
      "equipment": [
        "Plat e four",
        "Repe fine",
        "Pinceau ou cuillere"
      ],
      "storage": [
        "2 jours au refrigerateur.",
        "Rechauffer doucement avec un peu de jus."
      ],
      "result": [
        "Poulet dore, jus court, parfum citron vert-gingembre."
      ]
    }
  },
  "sauce_chevre_creme": {
    "title": "Sauce chevre creme",
    "master": "sauces_maitre",
    "image": "/assets/recipe-images-optimized/sauce_chevre_creme_v2_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "4 personnes",
    "nutriScore": "D",
    "aliases": [
      "sauce fromage de chevre",
      "sauce chevre",
      "sauce cremeuse chevre"
    ],
    "tags": [
      "chevre",
      "creme",
      "fromage",
      "sauce chaude"
    ],
    "ingredients": [
      {
        "group": "Sauce",
        "items": [
          "180g fromage de chevre doux",
          "500ml creme fraeche",
          "poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Couper le fromage de chevre en petits morceaux.",
      "Chauffer la creme a feu doux.",
      "Ajouter le fromage et melanger jusqu a fonte complete.",
      "Ajouter poivre du moulin, gouter et servir chaud sur viande grillee, pates ou legumes."
    ],
    "notes": [
      "Choisir un chevre plutet doux pour une sauce ronde.",
      "Ne pas faire bouillir fort : la sauce peut devenir granuleuse."
    ],
    "technical": [
      {
        "label": "Fromage",
        "value": "Plus le chevre est affine, plus la sauce sera marquee et salee."
      }
    ],
    "practical": {
      "equipment": [
        "Petite casserole",
        "Fouet"
      ],
      "storage": [
        "2 jours au refrigerateur, rechauffer e feu tres doux."
      ],
      "result": [
        "Sauce blanche, nappante, douce et fromagere."
      ]
    }
  },
  "puree_patates_douces": {
    "title": "Puree de patates douces",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/puree_patates_douces_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 25,
    "cookTime": 25,
    "tags": [
      "patate douce",
      "puree",
      "doux"
    ],
    "aliases": [
      "puree de patates douces"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "850g patates douces",
          "120g pommes de terre farineuses",
          "80g lait entier",
          "35g beurre",
          "4g sel fin",
          "Poivre du moulin",
          "1 pincee noix de muscade"
        ]
      }
    ],
    "steps": [
      "Cuire patates douces et pommes de terre en morceaux dans une eau salee jusqu a tendrete.",
      "Egoutter longuement, remettre 1min dans la casserole chaude pour secher.",
      "Ecraser avec beurre et lait chaud, puis assaisonner.",
      "Servir souple, sans chercher une texture collante."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Puree douce, orange, ronde, utile avec porc, volaille ou poisson grille."
      ]
    }
  },
  "chou_fleur_coco_curry": {
    "title": "Chou-fleur lait de coco curry",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/chou_fleur_coco_curry_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 22,
    "tags": [
      "chou fleur",
      "coco",
      "curry"
    ],
    "aliases": [
      "chou-fleur lait de coco curry"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "700g chou-fleur en fleurettes",
          "220g lait de coco",
          "120g oignon emince",
          "12g curry doux",
          "15g huile neutre",
          "8g jus de citron vert",
          "5g sel fin",
          "Coriandre fraiche"
        ]
      }
    ],
    "steps": [
      "Faire suer oignon avec huile et curry.",
      "Ajouter chou-fleur, lait de coco, sel et un petit fond d eau.",
      "Couvrir et cuire jusqu a chou-fleur tendre mais encore lisible.",
      "Finir citron vert et coriandre hors du feu."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Legume doux et epice, bien cale pour poisson, riz ou volaille simple."
      ]
    }
  },
  "oeufs_cocotte_chorizo": {
    "title": "Oeufs cocotte chorizo",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/oeufs_cocotte_chorizo_photo_v2_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 12,
    "cookTime": 12,
    "tags": [
      "oeufs",
      "chorizo",
      "cocotte"
    ],
    "aliases": [
      "oeufs cocotte chorizo"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "4 oeufs",
          "80g chorizo doux en des",
          "160g creme liquide",
          "60g poivron rouge en petits des",
          "20g parmesan rape",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Repartir chorizo, poivron et creme dans 4 ramequins.",
      "Casser un oeuf dans chaque ramequin, ajouter du poivre du moulin.",
      "Cuire au bain-marie au four a 180C jusqu a blanc pris et jaune coulant.",
      "Finir parmesan et servir aussitot."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Entree chaude courte, salee, avec jaune coulant."
      ]
    },
    "additionalMasters": [
      "apero_maitre"
    ]
  },
  "puree_chou_fleur": {
    "title": "Puree de chou-fleur",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/puree_chou_fleur_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 15,
    "cookTime": 22,
    "tags": [
      "chou fleur",
      "puree",
      "leger"
    ],
    "aliases": [
      "puree de chou-fleur"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "800g chou-fleur",
          "120g pomme de terre",
          "80g lait entier",
          "30g beurre",
          "4g sel fin",
          "Poivre du moulin",
          "1 pincee muscade"
        ]
      }
    ],
    "steps": [
      "Cuire chou-fleur et pomme de terre dans une eau salee.",
      "Egoutter tres soigneusement pour eviter une puree aqueuse.",
      "Mixer avec lait chaud et beurre.",
      "Rectifier sel, poivre du moulin et muscade."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Puree blanche, fine, plus legere qu une puree de pommes de terre."
      ]
    }
  },
  "sauce_aigre_douce_vietnam": {
    "title": "Sauce aigre-douce vietnamienne",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/sauce_aigre_douce_vietnam_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "environ 200g",
    "activeTime": 8,
    "cookTime": 25,
    "tags": [
      "sauce",
      "vietnam",
      "aigre doux"
    ],
    "aliases": [
      "sauce aigre-douce vietnamienne"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "80g eau",
          "45g sucre",
          "45g vinaigre de riz",
          "35g nuoc-mam",
          "20g jus de citron vert",
          "8g ail finement rape",
          "8g piment rouge finement hache"
        ]
      }
    ],
    "steps": [
      "Dissoudre sucre dans eau chaude.",
      "Ajouter vinaigre, nuoc-mam, citron vert, ail et piment.",
      "Laisser 15min pour fondre les parfums.",
      "Ajuster avec eau ou citron selon la puissance voulue."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Sauce fluide, sucree, salee et acide pour nems, rouleaux ou crudites."
      ]
    }
  },
  "nems_vietnam": {
    "title": "Nems vietnamiens",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/nems_vietnam_photo_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 45,
    "cookTime": 18,
    "tags": [
      "vietnam",
      "friture",
      "porc",
      "crevettes"
    ],
    "aliases": [
      "nems vietnamiens"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "16 galettes de riz",
          "280g porc hache",
          "120g crevettes hachees",
          "80g vermicelles de riz trempes",
          "80g carotte rapee",
          "40g champignons noirs rehydrates",
          "1 oeuf",
          "20g nuoc-mam",
          "Huile de friture"
        ]
      }
    ],
    "steps": [
      "Melanger farce porc, crevettes, vermicelles, carotte, champignons, oeuf et nuoc-mam.",
      "Humidifier les galettes, garnir et rouler serre.",
      "Frire a 170C jusqu a coloration reguliere.",
      "Servir avec <span data-goto=\"sauce_aigre_douce_vietnam\">sauce aigre-douce vietnamienne</span> et feuilles de salade."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "linkedRecipes": [
      {
        "id": "sauce_aigre_douce_vietnam",
        "role": "Sauce"
      }
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Nems croustillants, avec sauce liee directement dans la fiche."
      ]
    }
  },
  "asperges_mimosa": {
    "title": "Asperges mimosa",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/asperges_mimosa_photo_v2_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Printemps"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 12,
    "tags": [
      "asperges",
      "oeufs",
      "mimosa"
    ],
    "aliases": [
      "asperges mimosa"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "600g asperges vertes",
          "3 oeufs",
          "40g vinaigrette",
          "15g ciboulette ciselee",
          "Fleur de sel",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les oeufs durs, refroidir, puis hacher finement.",
      "Cuire les asperges jusqu a tendrete, puis refroidir rapidement.",
      "Assaisonner les asperges avec vinaigrette.",
      "Parsemer oeuf mimosa, ciboulette, sel et poivre du moulin."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "linkedRecipes": [
      {
        "id": "vinaigrette",
        "role": "Assaisonnement"
      }
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Entree de saison, nette et fraiche."
      ]
    }
  },
  "salade_pois_chiche_feta_olives": {
    "title": "Salade pois chiches feta olives",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/salade_pois_chiche_feta_olives_photo_v2_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Ete"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 25,
    "tags": [
      "salade",
      "pois chiches",
      "feta"
    ],
    "aliases": [
      "salade pois chiches feta olives"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "500g pois chiches cuits",
          "160g feta",
          "120g olives noires",
          "180g concombre",
          "120g tomates cerises",
          "45g huile d olive",
          "20g jus de citron",
          "Menthe et persil"
        ]
      }
    ],
    "steps": [
      "Rincer pois chiches et couper concombre et tomates.",
      "Melanger huile, citron, herbes, sel et poivre du moulin.",
      "Ajouter feta emiettee et olives.",
      "Laisser 10min au frais avant de servir."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Salade complete, fraiche, utile en entree ou repas leger."
      ]
    }
  },
  "cuisses_poulet_four_tomates_thym": {
    "title": "Cuisses de poulet tomates thym",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cuisses_poulet_four_tomates_thym_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 15,
    "cookTime": 45,
    "tags": [
      "poulet",
      "tomate",
      "four"
    ],
    "aliases": [
      "cuisses de poulet tomates thym"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "4 cuisses de poulet",
          "500g tomates concassees",
          "180g oignons eminces",
          "20g huile d olive",
          "2 gousses d ail",
          "6g thym",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Assaisonner le poulet, le poser sur oignons, ail et tomates.",
      "Ajouter huile, thym, sel et poivre du moulin.",
      "Cuire au four a 190C jusqu a peau doree et jus reduit.",
      "Reposer 8min avant service."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Plat familial sauce tomate-thym, a servir avec riz, pommes vapeur ou legumes verts."
      ]
    }
  },
  "chou_vert_sauce_tomate": {
    "title": "Chou vert en sauce tomate",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/chou_vert_sauce_tomate_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 20,
    "cookTime": 35,
    "tags": [
      "chou",
      "tomate",
      "mijote"
    ],
    "aliases": [
      "chou vert en sauce tomate"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "700g chou vert emince",
          "350g coulis de tomate",
          "120g oignon",
          "80g carotte",
          "15g huile d olive",
          "1 gousse d ail",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Blanchir le chou 5min puis egoutter.",
      "Faire suer oignon, carotte et ail dans huile.",
      "Ajouter tomate et chou, couvrir partiellement.",
      "Mijoter jusqu a chou tendre et sauce reduite."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Accompagnement rustique, mieux avec porc, saucisse ou oeufs."
      ]
    }
  },
  "potee_chou": {
    "title": "Potee au chou",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/potee_chou_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "activeTime": 35,
    "cookTime": 110,
    "tags": [
      "chou",
      "porc",
      "hiver"
    ],
    "aliases": [
      "potee au chou"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "600g chou vert",
          "500g palette demi-sel dessalee",
          "300g saucisse fumee",
          "450g pommes de terre",
          "250g carottes",
          "160g poireau",
          "1 oignon pique de girofle",
          "Bouquet garni"
        ]
      }
    ],
    "steps": [
      "Demarrer la viande dans une grande marmite d eau froide.",
      "Ajouter bouquet garni et cuire doucement.",
      "Ajouter legumes selon leur temps de cuisson.",
      "Servir viande, legumes et bouillon chaud."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Grand plat rustique, coherent pour un menu hiver sans entree lourde."
      ]
    }
  },
  "veloute_hiver_noix_cajou": {
    "title": "Veloute d'hiver noix de cajou",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/veloute_hiver_noix_cajou_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 30,
    "tags": [
      "veloute",
      "cajou",
      "hiver"
    ],
    "aliases": [
      "veloute d'hiver noix de cajou"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "500g courge",
          "250g carottes",
          "120g oignon",
          "70g noix de cajou",
          "600g bouillon de legumes",
          "20g huile d olive",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Faire suer oignon dans huile.",
      "Ajouter courge, carottes, cajou et bouillon.",
      "Cuire jusqu a legumes tres tendres.",
      "Mixer longuement, ajuster sel et poivre du moulin."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Veloute tres cremeux sans creme, avec rondeur de cajou."
      ]
    }
  },
  "patates_douces_four": {
    "title": "Patates douces au four",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/patates_douces_four_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 12,
    "cookTime": 35,
    "tags": [
      "patate douce",
      "four",
      "roti"
    ],
    "aliases": [
      "patates douces au four"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "850g patates douces",
          "25g huile d olive",
          "8g miel",
          "6g paprika fume",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Couper les patates douces en quartiers reguliers.",
      "Enrober huile, miel, paprika, sel et poivre du moulin.",
      "Rôtir a 200C en retournant a mi-cuisson.",
      "Servir quand les bords sont caramelises."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Quartiers fondants et dores, mieux avec une viande grillee ou une sauce fraiche."
      ]
    }
  },
  "harissa_maison": {
    "title": "Harissa rouge",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/harissa_maison_spooky.jpg",
    "categories": [
      "Sauces"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "environ 200g",
    "activeTime": 15,
    "cookTime": 25,
    "tags": [
      "condiment",
      "piment",
      "epice"
    ],
    "aliases": [
      "harissa rouge"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "120g piments rouges doux ou forts",
          "30g concentré de tomate",
          "20g huile d olive",
          "12g ail",
          "8g cumin",
          "8g coriandre moulue",
          "5g sel fin",
          "10g jus de citron"
        ]
      }
    ],
    "steps": [
      "Mixer piments, ail, epices, sel et citron.",
      "Ajouter concentre de tomate et huile.",
      "Rectifier chaleur et acidite.",
      "Conserver couvert d un filet d huile."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Condiment rouge, franc, a doser comme composant et non comme plat."
      ]
    }
  },
  "carottes_persillade_creme": {
    "title": "Carottes persillade creme",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/carottes_persillade_creme_photo_v2_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 25,
    "tags": [
      "carottes",
      "creme",
      "persillade"
    ],
    "aliases": [
      "carottes persillade creme"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "700g carottes en rondelles",
          "120g creme liquide",
          "20g beurre",
          "12g ail",
          "20g persil hache",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les carottes a l etuve avec beurre et un fond d eau.",
      "Ajouter ail en fin de cuisson pour ne pas le bruler.",
      "Lier avec creme et laisser reduire legerement.",
      "Finir persil et poivre du moulin."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Legume doux-cremeux, a eviter avec un plat deja tres cremeux."
      ]
    }
  },
  "pommes_grenaille_herbes": {
    "title": "Pommes de terre grenaille aux herbes",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/pommes_grenaille_herbes_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 12,
    "cookTime": 38,
    "tags": [
      "pommes de terre",
      "four",
      "herbes"
    ],
    "aliases": [
      "pommes de terre grenaille aux herbes"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "850g pommes de terre grenaille",
          "30g huile d olive",
          "12g ail en chemise",
          "8g thym",
          "8g romarin",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Couper les plus grosses grenailles en deux.",
      "Enrober huile, ail, herbes, sel et poivre du moulin.",
      "Rôtir a 200C jusqu a peau ridee et coeur tendre.",
      "Servir sans ajouter de sauce lourde."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Accompagnement simple, solide, avec notes herbees."
      ]
    }
  },
  "salade_caprese": {
    "title": "Tomate mozzarella basilic",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/tomate_mozzarella_basilic_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Ete"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 10,
    "cookTime": 0,
    "tags": [
      "salade",
      "tomate",
      "mozzarella"
    ],
    "aliases": [
      "salade caprese",
      "caprese",
      "tomate mozzarella",
      "tomates mozzarella basilic"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "500g tomates mures",
          "250g mozzarella",
          "25g huile d olive",
          "10g basilic",
          "Fleur de sel",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Trancher tomates et mozzarella.",
      "Disposer en alternant avec basilic.",
      "Assaisonner huile, fleur de sel et poivre du moulin.",
      "Servir frais mais pas glace."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Entree ultra simple qui exige de bons produits."
      ]
    }
  },
  "porc_chorizo_haricots_tarbais": {
    "title": "Cocotte porc chorizo haricots tarbais",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/porc_chorizo_haricots_tarbais_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "activeTime": 30,
    "cookTime": 80,
    "tags": [
      "porc",
      "chorizo",
      "haricots"
    ],
    "aliases": [
      "cocotte porc chorizo haricots tarbais"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "650g epaule de porc en cubes",
          "160g chorizo",
          "450g haricots tarbais cuits",
          "300g tomates concassees",
          "160g oignon",
          "2 gousses d ail",
          "250g bouillon",
          "5g sel fin"
        ]
      }
    ],
    "steps": [
      "Colorer porc et chorizo dans une cocotte.",
      "Ajouter oignon, ail, tomates et bouillon.",
      "Mijoter doucement jusqu a porc tendre.",
      "Ajouter haricots cuits en fin de cuisson pour les garder entiers."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Plat mijote riche et complet, sans accompagnement feculent supplementaire."
      ]
    }
  },
  "saumon_au_four_simple": {
    "title": "Saumon au four",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/saumon_au_four_simple_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 8,
    "cookTime": 14,
    "tags": [
      "saumon",
      "four",
      "rapide"
    ],
    "aliases": [
      "saumon au four"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "4 paves de saumon",
          "20g huile d olive",
          "15g jus de citron",
          "8g aneth",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Assaisonner le saumon avec huile, citron, aneth, sel et poivre du moulin.",
      "Cuire au four a 180C jusqu a chair juste nacree.",
      "Laisser reposer 3min.",
      "Servir avec riz citronne, asperges ou salade."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Plat rapide et net, a ne pas charger avec une sauce forte."
      ]
    }
  },
  "souffle_fromage_facile": {
    "title": "Souffle au fromage facile",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/souffle_fromage_facile_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "activeTime": 25,
    "cookTime": 25,
    "tags": [
      "fromage",
      "oeufs",
      "souffle"
    ],
    "aliases": [
      "souffle au fromage facile"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "4 oeufs",
          "250g lait entier",
          "35g beurre",
          "35g farine",
          "120g comte rape",
          "4g sel fin",
          "Poivre du moulin",
          "1 pincee muscade"
        ]
      }
    ],
    "steps": [
      "Preparer une bechamel epaisse avec beurre, farine et lait.",
      "Hors du feu, ajouter fromage, jaunes d oeufs, sel et muscade.",
      "Incorporer les blancs montes souplement.",
      "Cuire dans un moule beurre jusqu a gonflement et coloration."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Plat souffle fromage, a servir tout de suite avec salade verte."
      ]
    }
  },
  "bruschetta_roquefort_noix": {
    "title": "Bruschetta roquefort noix",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/bruschetta_roquefort_noix_photo_v2_spooky.jpg",
    "categories": [
      "Apero",
      "Entrees"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 12,
    "cookTime": 5,
    "tags": [
      "roquefort",
      "noix",
      "toast"
    ],
    "aliases": [
      "bruschetta roquefort noix"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "4 tranches pain de campagne",
          "120g roquefort",
          "70g noix",
          "40g creme epaisse",
          "15g miel",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Griller legerement le pain.",
      "Melanger roquefort et creme, puis tartiner.",
      "Ajouter noix et miel.",
      "Repasser 3min sous grill pour tiédir."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Apero puissant, a limiter avec un plat deja fromage."
      ]
    },
    "additionalMasters": [
      "entrees_maitre"
    ]
  },
  "tagliatelles_agrumes": {
    "title": "Tagliatelles aux agrumes",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/tagliatelles_agrumes_photo_v2_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 12,
    "tags": [
      "pates",
      "agrumes",
      "creme"
    ],
    "aliases": [
      "tagliatelles aux agrumes"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "360g tagliatelles",
          "80g creme liquide",
          "30g beurre",
          "1 orange non traitee",
          "1 citron non traite",
          "40g parmesan",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les tagliatelles al dente.",
      "Chauffer beurre, creme, zestes fins et un peu de jus.",
      "Lier les pates avec eau de cuisson et parmesan.",
      "Finir poivre du moulin et zestes frais."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Pates cremeuses mais fraiches, utiles avec entree legere."
      ]
    }
  },
  "bricks_fromage_miel_poires_pecan": {
    "title": "Bricks fromage miel poires pecan",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/bricks_fromage_miel_poires_pecan_photo_v2_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 24,
    "cookTime": 14,
    "tags": [
      "brick",
      "fromage",
      "miel"
    ],
    "aliases": [
      "bricks fromage miel poires pecan"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "8 feuilles de brick",
          "180g fromage de chevre",
          "180g poires en lamelles",
          "50g noix de pecan",
          "25g miel",
          "25g beurre fondu",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Garnir les feuilles de brick avec fromage, poire, pecan et miel.",
      "Plier en triangles ou rouleaux.",
      "Badigeonner beurre fondu.",
      "Cuire au four a 190C jusqu a croustillant."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Entree sucre-sale croustillante, a suivre d un plat simple."
      ]
    }
  },
  "oeufs_meurette_faciles": {
    "title": "Oeufs en meurette faciles",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/oeufs_meurette_faciles_photo_v2_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "activeTime": 30,
    "cookTime": 25,
    "tags": [
      "oeufs",
      "vin rouge",
      "sauce vin rouge"
    ],
    "aliases": [
      "oeufs en meurette faciles"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "4 oeufs",
          "350g vin rouge",
          "120g lardons",
          "120g champignons",
          "80g oignon",
          "20g beurre",
          "15g farine",
          "Thym et laurier"
        ]
      }
    ],
    "steps": [
      "Colorer lardons, oignon et champignons.",
      "Singer avec farine, mouiller au vin rouge et reduire en sauce nappante.",
      "Pocher les oeufs separement.",
      "Servir oeufs sur sauce chaude avec pain grille."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Entree riche au vin rouge, a associer avec plat plus sobre."
      ]
    }
  },
  "poires_roties_orange_miel": {
    "title": "Poires roties orange miel",
    "master": "desserts_maitre",
    "image": "/assets/recipe-images-optimized/poires_roties_orange_miel_photo_v2_spooky.jpg",
    "categories": [
      "Desserts"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 12,
    "cookTime": 28,
    "tags": [
      "poire",
      "orange",
      "miel"
    ],
    "aliases": [
      "poires roties orange miel"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "4 poires",
          "35g miel",
          "80g jus d orange",
          "20g beurre",
          "1 orange non traitee",
          "1 pincee cannelle"
        ]
      }
    ],
    "steps": [
      "Couper les poires en deux et retirer le coeur.",
      "Arroser miel, jus d orange, zestes et beurre.",
      "Rôtir a 180C en arrosant deux fois.",
      "Servir tiede avec le jus reduit."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Dessert fruit, leger et coherent apres plat riche."
      ]
    }
  },
  "grillades_porc_miel_orange_piment": {
    "title": "Grillades porc miel orange piment",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/grillades_porc_miel_orange_piment_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 16,
    "tags": [
      "porc",
      "miel",
      "orange"
    ],
    "aliases": [
      "grillades porc miel orange piment"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "650g echine de porc en tranches",
          "70g jus d orange",
          "30g miel",
          "20g sauce soja",
          "12g ail",
          "8g piment doux",
          "15g huile neutre"
        ]
      }
    ],
    "steps": [
      "Melanger marinade orange, miel, soja, ail, piment et huile.",
      "Mariner le porc au moins 1h.",
      "Griller vivement puis terminer a chaleur moderee.",
      "Reposer 5min avant de trancher."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Porc grille sucre-sale, a servir avec legumes verts ou salade acide."
      ]
    }
  },
  "southern_biscuits": {
    "title": "Southern biscuits",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/southern_biscuits_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "8 biscuits",
    "activeTime": 18,
    "cookTime": 16,
    "tags": [
      "base",
      "pain",
      "biscuit sale"
    ],
    "aliases": [
      "southern biscuits"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "300g farine",
          "12g levure chimique",
          "5g sel fin",
          "85g beurre froid",
          "180g lait ribot"
        ]
      }
    ],
    "steps": [
      "Sabler farine, levure, sel et beurre froid.",
      "Ajouter lait ribot sans trop travailler.",
      "Etaler, plier une fois puis detailler.",
      "Cuire a 210C jusqu a biscuits gonfles et dores."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Petits pains rapides, feuilletes, pour brunch ou sauce."
      ]
    }
  },
  "pates_crumble_chorizo": {
    "title": "Pates au crumble de chorizo",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/pates_crumble_chorizo_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 20,
    "cookTime": 12,
    "tags": [
      "pates",
      "chorizo",
      "crumble"
    ],
    "aliases": [
      "pates au crumble de chorizo"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "360g pates courtes",
          "140g chorizo",
          "60g chapelure",
          "35g parmesan",
          "1 gousse d ail",
          "20g huile d olive",
          "Persil"
        ]
      }
    ],
    "steps": [
      "Mixer grossierement chorizo, chapelure, parmesan et ail.",
      "Dorer ce crumble a la poele avec huile.",
      "Cuire les pates al dente.",
      "Melanger pates, un peu d eau de cuisson et crumble croustillant."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "linkedRecipes": [
      {
        "id": "chapelure_parfumee",
        "role": "Base possible"
      }
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Pates puissantes et croustillantes, sans accompagnement feculent."
      ]
    }
  },
  "crevettes_ail_persil": {
    "title": "Crevettes en persillade",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/crevettes_persillade_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 12,
    "cookTime": 6,
    "tags": [
      "crevettes",
      "ail",
      "persil"
    ],
    "aliases": [
      "crevettes ail persil",
      "crevettes en persillade"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "500g crevettes decortiquees",
          "25g huile d olive",
          "15g ail hache",
          "20g persil",
          "12g jus de citron",
          "4g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Secher les crevettes pour bien les saisir.",
      "Sauter rapidement a feu vif avec huile.",
      "Ajouter ail en fin de cuisson, puis persil et citron.",
      "Servir aussitot."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Plat tres rapide, frais, a accompagner de riz ou salade."
      ]
    }
  },
  "chapelure_parfumee": {
    "title": "Chapelure parfumee",
    "master": "bases_salees_maitre",
    "image": "/assets/recipe-images-optimized/chapelure_parfumee_photo_v2_spooky.jpg",
    "categories": [
      "Base"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "environ 200g",
    "activeTime": 8,
    "cookTime": 25,
    "tags": [
      "base",
      "chapelure",
      "croustillant"
    ],
    "aliases": [
      "chapelure parfumee"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "160g pain sec",
          "20g parmesan",
          "8g ail semoule",
          "8g herbes seches",
          "4g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Mixer le pain sec par impulsions.",
      "Ajouter parmesan, ail, herbes, sel et poivre du moulin.",
      "Etaler 5min a l air libre si la chapelure est humide.",
      "Conserver en bocal sec."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Base croustillante pour gratins, pates et panures."
      ]
    }
  },
  "encornets_chorizo": {
    "title": "Encornets sautes au chorizo",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/encornets_chorizo_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 20,
    "cookTime": 10,
    "tags": [
      "encornets",
      "chorizo",
      "mer"
    ],
    "aliases": [
      "encornets sautes au chorizo"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "550g encornets nettoyes",
          "120g chorizo",
          "160g poivron rouge",
          "80g oignon",
          "15g huile d olive",
          "10g persil",
          "10g jus de citron"
        ]
      }
    ],
    "steps": [
      "Saisir chorizo, poivron et oignon.",
      "Ajouter encornets bien secs a feu vif.",
      "Cuire court pour garder une texture tendre.",
      "Finir persil et citron."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Plat mer-terre puissant, a servir avec salade ou riz simple."
      ]
    }
  },
  "crevettes_provencale": {
    "title": "Crevettes a la provencale",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/crevettes_provencale_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 16,
    "tags": [
      "crevettes",
      "tomate",
      "provencal"
    ],
    "aliases": [
      "crevettes a la provencale"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "500g crevettes",
          "300g tomates concassees",
          "120g oignon",
          "12g ail",
          "20g huile d olive",
          "8g herbes de Provence",
          "10g persil",
          "5g sel fin"
        ]
      }
    ],
    "steps": [
      "Faire suer oignon et ail dans huile.",
      "Ajouter tomates et herbes, reduire 10min.",
      "Ajouter crevettes et cuire juste le temps de les rechauffer.",
      "Finir persil et servir."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Crevettes sauce tomate herbee, avec riz ou pain grille."
      ]
    }
  },
  "carottes_roties_miel_epices": {
    "title": "Carottes roties miel epices",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/carottes_roties_miel_epices_photo_v2_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 12,
    "cookTime": 32,
    "tags": [
      "carottes",
      "miel",
      "four"
    ],
    "aliases": [
      "carottes roties miel epices"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "750g carottes",
          "25g huile d olive",
          "20g miel",
          "8g cumin",
          "6g paprika",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Couper les carottes en batonnets reguliers.",
      "Enrober huile, miel, epices, sel et poivre du moulin.",
      "Rôtir a 200C jusqu a bords caramelises.",
      "Servir chaud ou tiede."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Legume sucre-epice, bon avec agneau, porc ou pois chiches."
      ]
    }
  },
  "pommes_paille": {
    "title": "Pommes paille",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/pommes_paille_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 28,
    "cookTime": 12,
    "tags": [
      "pommes de terre",
      "friture",
      "croustillant"
    ],
    "aliases": [
      "pommes paille"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "700g pommes de terre",
          "Huile de friture",
          "5g sel fin"
        ]
      }
    ],
    "steps": [
      "Tailler les pommes de terre en julienne tres fine.",
      "Rincer puis secher parfaitement.",
      "Frire par petites poignees a 170C.",
      "Saler immediatement et servir croustillant."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Accompagnement croustillant, a associer avec plat en sauce simple."
      ]
    }
  },
  "samoussas_boeuf_epinards_petits_pois": {
    "title": "Samoussas boeuf epinards petits pois",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/samoussas_boeuf_epinards_petits_pois_photo_v2_spooky.jpg",
    "categories": [
      "Apero",
      "Entrees"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 35,
    "cookTime": 18,
    "tags": [
      "samoussa",
      "boeuf",
      "epinards"
    ],
    "aliases": [
      "samoussas boeuf epinards petits pois"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "8 feuilles de brick",
          "280g boeuf hache",
          "120g epinards",
          "90g petits pois",
          "80g oignon",
          "10g curry doux",
          "20g huile neutre",
          "5g sel fin"
        ]
      }
    ],
    "steps": [
      "Cuire boeuf, oignon, curry, epinards et petits pois.",
      "Refroidir la farce pour ne pas detremper les feuilles.",
      "Plier en triangles serres.",
      "Cuire au four ou frire selon le croustillant voulu."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Apero sale consistant, a ne pas mettre avant un plat trop lourd."
      ]
    },
    "additionalMasters": [
      "entrees_maitre"
    ]
  },
  "gratin_pates_chorizo": {
    "title": "Gratin de pates au chorizo",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/gratin_pates_chorizo_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 22,
    "cookTime": 25,
    "tags": [
      "pates",
      "gratin",
      "chorizo"
    ],
    "aliases": [
      "gratin de pates au chorizo"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "360g pates courtes",
          "160g chorizo",
          "350g sauce tomate",
          "120g mozzarella",
          "60g parmesan",
          "80g oignon",
          "10g huile d olive"
        ]
      }
    ],
    "steps": [
      "Cuire les pates tres al dente.",
      "Faire revenir oignon et chorizo, ajouter sauce tomate.",
      "Melanger pates et sauce, verser en plat.",
      "Couvrir fromages et gratiner."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Plat complet riche, sans accompagnement feculent."
      ]
    }
  },
  "gressins_fromage_olives": {
    "title": "Gressins fromage olives",
    "master": "apero_maitre",
    "image": "/assets/recipe-images-optimized/gressins_fromage_olives_photo_v2_spooky.jpg",
    "categories": [
      "Apero"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "20 gressins",
    "activeTime": 28,
    "cookTime": 18,
    "tags": [
      "apero",
      "fromage",
      "olives"
    ],
    "aliases": [
      "gressins fromage olives"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g farine",
          "80g olives hachees",
          "70g parmesan rape",
          "120g eau tiede",
          "20g huile d olive",
          "5g levure boulangere",
          "4g sel fin"
        ]
      }
    ],
    "steps": [
      "Petrir tous les elements sauf olives, puis incorporer olives.",
      "Laisser pousser jusqu a leger gonflement.",
      "Tailler en batonnets et torsader.",
      "Cuire a 190C jusqu a gressins secs et dores."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Apero sec et sale, bien avec sauces ou tartinades."
      ]
    }
  },
  "salade_epinards_clementines_amande_feta": {
    "title": "Salade epinards clementines amande feta",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/salade_epinards_clementines_amande_feta_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 14,
    "cookTime": 3,
    "tags": [
      "salade",
      "epinards",
      "clementine"
    ],
    "aliases": [
      "salade epinards clementines amande feta"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "180g jeunes epinards",
          "3 clementines",
          "120g feta",
          "55g amandes",
          "30g huile d olive",
          "15g vinaigre de cidre",
          "8g miel",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Griller legerement les amandes.",
      "Preparer vinaigrette huile, vinaigre, miel et poivre du moulin.",
      "Melanger epinards, quartiers de clementine et feta.",
      "Ajouter amandes juste avant service."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Entree fraiche, acidulee et croquante."
      ]
    }
  },
  "joues_porc_cidre_miel": {
    "title": "Joues de porc cidre miel",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/joues_porc_cidre_miel_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "easy",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "activeTime": 28,
    "cookTime": 100,
    "tags": [
      "porc",
      "cidre",
      "miel"
    ],
    "aliases": [
      "joues de porc cidre miel"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "750g joues de porc",
          "400g cidre brut",
          "120g oignon",
          "120g carottes",
          "25g miel",
          "20g beurre",
          "10g moutarde a l ancienne",
          "Bouquet garni"
        ]
      }
    ],
    "steps": [
      "Colorer les joues de porc au beurre.",
      "Ajouter oignon, carottes, cidre, miel, moutarde et bouquet garni.",
      "Mijoter doucement jusqu a viande fondante.",
      "Reduire la sauce si besoin avant service."
    ],
    "notes": [
      "Repere menu : choisir un accompagnement qui ne repete pas la meme sauce dominante.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique, ou 24 a 48h pour oeufs, poisson, crustaces, mollusques, creme ou viande deja cuite.",
      "Securite : refroidir rapidement les restes, garder au froid et consommer avec une cuillere propre."
    ],
    "practical": {
      "equipment": [
        "Plan de travail",
        "Couteau",
        "Casserole ou plat adapte"
      ],
      "result": [
        "Plat mijote doux-acide, logique avec puree simple ou legumes verts."
      ]
    }
  },
  "carottes_braisees_orange_citron_confit": {
    "title": "Carottes braisees orange citron confit",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/carottes_braisees_orange_citron_confit_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Hiver",
      "Printemps"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 15,
    "cookTime": 35,
    "tags": [
      "carottes",
      "orange",
      "citron confit",
      "legumes"
    ],
    "aliases": [
      "carottes orange citron confit",
      "carottes braisees agrumes"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "800g carottes",
          "120g jus d orange",
          "30g citron confit en petits des",
          "25g beurre",
          "15g huile d olive",
          "10g miel",
          "2g sel fin",
          "Poivre du moulin",
          "Thym frais"
        ]
      }
    ],
    "steps": [
      "Eplucher les carottes et les couper en deux si elles sont grosses.",
      "Faire fondre beurre et huile dans une sauteuse, puis rouler les carottes dedans 3min.",
      "Ajouter jus d orange, miel, citron confit, sel, poivre du moulin et thym.",
      "Couvrir et braiser a feu doux 25 a 30min, en retournant les carottes a mi-cuisson.",
      "Retirer le couvercle et reduire le jus jusqu a obtenir un nappage brillant."
    ],
    "notes": [
      "Repere menu : bon accompagnement avec volaille, porc ou poisson roti, sans ajouter une deuxieme sauce lourde.",
      "Conservation : 2 a 3 jours au refrigerateur en boite hermetique.",
      "Securite : refroidir rapidement les restes et rechauffer doucement avec un trait d eau."
    ],
    "practical": {
      "equipment": [
        "Sauteuse avec couvercle",
        "Couteau",
        "Planche"
      ],
      "result": [
        "Carottes fondantes, brillantes, douces et acidulees."
      ]
    }
  },
  "salade_pois_chiches_thon_poivrons": {
    "title": "Salade pois chiches thon poivrons",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/salade_pois_chiches_thon_poivrons_spooky.jpg",
    "categories": [
      "Entrees"
    ],
    "seasons": [
      "Ete",
      "Printemps"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "4 personnes",
    "activeTime": 12,
    "cookTime": 0,
    "tags": [
      "salade",
      "pois chiches",
      "thon",
      "poivrons",
      "froid"
    ],
    "aliases": [
      "salade pois chiches thon",
      "pois chiches thon poivrons"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "500g pois chiches cuits egouttes",
          "200g thon egoutte",
          "150g poivrons rouges et jaunes",
          "80g oignon rouge",
          "30g huile d olive",
          "20g jus de citron",
          "10g persil",
          "3g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Rincer et egoutter les pois chiches.",
      "Emincer finement poivrons et oignon rouge.",
      "Emietter le thon en morceaux visibles, sans le reduire en pate.",
      "Melanger huile, citron, sel, poivre du moulin et persil.",
      "Assembler, laisser reposer 15min au froid si possible, puis rectifier l assaisonnement."
    ],
    "notes": [
      "Repere menu : entree complete, a servir avant un plat leger ou sans autre feculent dominant.",
      "Conservation : 24 a 48h au refrigerateur a cause du thon.",
      "Securite : garder au froid et ne pas laisser trainer a temperature ambiante."
    ],
    "practical": {
      "equipment": [
        "Saladier",
        "Couteau",
        "Passoire"
      ],
      "result": [
        "Salade froide nette, nourrissante et acidulee."
      ]
    }
  },
  "pates_tomates_confites_parmesan": {
    "title": "Pates tomates confites parmesan",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/pates_tomates_confites_parmesan_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Ete",
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 15,
    "cookTime": 12,
    "tags": [
      "pates",
      "tomates confites",
      "parmesan",
      "rapide"
    ],
    "aliases": [
      "pates aux tomates confites",
      "pates parmesan tomates sechees"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "350g pates courtes",
          "160g tomates confites",
          "70g parmesan",
          "40g huile des tomates ou huile d olive",
          "20g pignons ou amandes grillees",
          "10g basilic",
          "1 gousse d ail",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les pates dans une grande casserole d eau salee.",
      "Pendant la cuisson, hacher grossierement tomates confites, ail et basilic.",
      "Egoutter les pates en gardant un peu d eau de cuisson.",
      "Melanger pates, tomates, huile et un trait d eau de cuisson pour lier.",
      "Finir avec parmesan, pignons et poivre du moulin."
    ],
    "notes": [
      "Repere menu : plat de pates deja riche en fromage, eviter un accompagnement feculent ou tres cremeux.",
      "Conservation : 2 jours au refrigerateur, a rechauffer avec un trait d eau.",
      "Securite : refroidir rapidement les restes."
    ],
    "practical": {
      "equipment": [
        "Grande casserole",
        "Passoire",
        "Poele ou sauteuse"
      ],
      "result": [
        "Pates brillantes, salees, parfumees et sans sauce lourde."
      ]
    }
  },
  "poulet_tikka_masala": {
    "title": "Poulet tikka masala",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/poulet_tikka_masala_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "activeTime": 30,
    "cookTime": 35,
    "tags": [
      "poulet",
      "epices",
      "sauce",
      "indien"
    ],
    "aliases": [
      "chicken tikka masala",
      "poulet sauce epicee"
    ],
    "ingredients": [
      {
        "group": "Poulet",
        "items": [
          "650g hauts de cuisses de poulet desosses",
          "120g yaourt nature",
          "15g jus de citron",
          "12g gingembre rape",
          "2 gousses d ail",
          "8g garam masala",
          "4g paprika",
          "3g sel fin"
        ]
      },
      {
        "group": "Sauce",
        "items": [
          "300g coulis de tomate",
          "180g creme liquide",
          "120g oignon",
          "25g beurre",
          "15g huile neutre",
          "8g garam masala",
          "4g cumin",
          "4g paprika",
          "Coriandre fraiche"
        ]
      }
    ],
    "steps": [
      "Couper le poulet en gros morceaux et le melanger avec yaourt, citron, ail, gingembre, epices et sel.",
      "Laisser mariner 30min minimum, puis saisir les morceaux a feu vif pour les colorer.",
      "Faire revenir oignon dans beurre et huile, ajouter epices puis coulis de tomate.",
      "Mijoter 10min, ajouter creme et poulet colore.",
      "Cuire encore 12 a 15min jusqu a sauce epaisse et poulet cuit, puis finir avec coriandre."
    ],
    "notes": [
      "Repere menu : plat sauce epicee, logique avec riz nature ou legumes verts, pas avec puree ou gratin cremeux.",
      "Conservation : 2 jours au refrigerateur.",
      "Securite : cuire le poulet a coeur et ne pas reutiliser la marinade crue sans cuisson."
    ],
    "practical": {
      "equipment": [
        "Poele",
        "Casserole",
        "Bol"
      ],
      "result": [
        "Poulet tendre, sauce epicee cremeuse et lisible."
      ]
    }
  },
  "poulet_pommes_de_terre_asperges": {
    "title": "Poulet pommes de terre asperges",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/poulet_pommes_de_terre_asperges_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Printemps"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 45,
    "tags": [
      "poulet",
      "pommes de terre",
      "asperges",
      "four"
    ],
    "aliases": [
      "poulet asperges pommes de terre",
      "poulet au four asperges"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "700g morceaux de poulet",
          "700g pommes de terre grenaille",
          "300g asperges vertes",
          "60g oignon",
          "35g huile d olive",
          "15g moutarde a l ancienne",
          "10g jus de citron",
          "2 gousses d ail",
          "3g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Prechauffer le four a 190°C.",
      "Couper les pommes de terre en deux et les melanger avec huile, ail, moutarde, sel et poivre du moulin.",
      "Ajouter le poulet et l oignon dans un plat, puis enfourner 30min.",
      "Ajouter les asperges et le jus de citron, puis poursuivre 12 a 15min.",
      "Verifier la cuisson du poulet et arroser avec le jus du plat."
    ],
    "notes": [
      "Repere menu : plat complet avec feculent et legume, ne pas ajouter riz ou puree.",
      "Conservation : 2 jours au refrigerateur.",
      "Securite : cuire le poulet a coeur et refroidir rapidement les restes."
    ],
    "practical": {
      "equipment": [
        "Plat a four",
        "Couteau",
        "Planche"
      ],
      "result": [
        "Plat de four complet, simple, printanier et coherent."
      ]
    }
  },
  "gratin_chou_fleur_mascarpone_moutarde": {
    "title": "Gratin chou-fleur mascarpone moutarde",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/gratin_chou_fleur_mascarpone_moutarde_spooky.jpg",
    "categories": [
      "Plats",
      "Accompagnements"
    ],
    "seasons": [
      "Hiver",
      "Automne"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 35,
    "tags": [
      "chou-fleur",
      "gratin",
      "mascarpone",
      "moutarde"
    ],
    "aliases": [
      "gratin de chou fleur mascarpone",
      "chou fleur moutarde"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "800g chou-fleur en fleurettes",
          "180g mascarpone",
          "120g creme liquide",
          "50g parmesan",
          "25g moutarde a l ancienne",
          "20g chapelure",
          "2g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Precuire le chou-fleur 8 a 10min a l eau salee ou vapeur, il doit rester ferme.",
      "Melanger mascarpone, creme, moutarde, sel et poivre du moulin.",
      "Napper le chou-fleur dans un plat, ajouter parmesan et chapelure.",
      "Cuire 25min a 190°C jusqu a gratin dore.",
      "Laisser reposer 5min avant service pour que la creme se tienne."
    ],
    "notes": [
      "Repere menu : gratin cremeux, a servir avec viande rotie simple ou salade vive, pas avec un autre plat en sauce.",
      "Conservation : 2 jours au refrigerateur.",
      "Securite : refroidir rapidement et rechauffer jusqu a coeur chaud."
    ],
    "practical": {
      "equipment": [
        "Plat a gratin",
        "Casserole ou vapeur",
        "Bol"
      ],
      "result": [
        "Chou-fleur fondant, sauce moutardee et dessus dore."
      ]
    },
    "additionalMasters": [
      "accompagnements_maitre"
    ]
  },
  "pates_brocolis_amandes": {
    "title": "Pates brocolis amandes",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/pates_brocolis_amandes_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Printemps",
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 15,
    "cookTime": 12,
    "tags": [
      "pates",
      "brocolis",
      "amandes",
      "vegetarien"
    ],
    "aliases": [
      "pates aux brocolis",
      "pates brocoli amandes"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "350g pates",
          "450g brocolis",
          "60g amandes effilees",
          "45g huile d olive",
          "50g parmesan",
          "1 gousse d ail",
          "10g jus de citron",
          "2g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les pates dans une grande casserole d eau salee.",
      "Ajouter les brocolis en petites fleurettes dans les 4 dernieres minutes.",
      "Faire dorer les amandes a sec et reserver.",
      "Egoutter pates et brocolis en gardant un peu d eau de cuisson.",
      "Lier avec huile d olive, ail, citron, parmesan, poivre du moulin et un trait d eau de cuisson.",
      "Ajouter les amandes au dernier moment."
    ],
    "notes": [
      "Repere menu : plat de pates vegetal, inutile d ajouter un autre feculent.",
      "Conservation : 2 jours au refrigerateur, amandes a remettre au service si possible.",
      "Securite : refroidir rapidement les restes."
    ],
    "practical": {
      "equipment": [
        "Grande casserole",
        "Poele",
        "Passoire"
      ],
      "result": [
        "Pates vertes, simples, avec croquant net des amandes."
      ]
    }
  },
  "rougail_saucisse": {
    "title": "Rougail saucisse",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/rougail_saucisse_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "activeTime": 20,
    "cookTime": 35,
    "tags": [
      "saucisse",
      "tomate",
      "epice",
      "mijote"
    ],
    "aliases": [
      "rougail saucisses",
      "saucisses tomate epices"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "600g saucisses fumees ou de Toulouse",
          "500g tomates concassees",
          "180g oignons",
          "2 gousses d ail",
          "15g gingembre",
          "20g huile neutre",
          "4g curcuma",
          "Piment selon gout",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Piquer les saucisses, les blanchir 8min si elles sont tres grasses, puis les couper en rondelles.",
      "Faire revenir oignons, ail et gingembre dans l huile.",
      "Ajouter saucisses et colorer 5min.",
      "Ajouter tomates, curcuma, piment et poivre du moulin.",
      "Mijoter 25 a 30min jusqu a sauce reduite et saucisses bien enrobees."
    ],
    "notes": [
      "Repere menu : plat tomate-epice, a servir avec riz nature et un element frais, pas avec gratin ou puree.",
      "Conservation : 2 jours au refrigerateur.",
      "Securite : rechauffer jusqu a sauce bien chaude."
    ],
    "practical": {
      "equipment": [
        "Cocotte",
        "Couteau",
        "Casserole"
      ],
      "result": [
        "Sauce tomate courte, saucisses tranchees et parfum epice."
      ]
    }
  },
  "brochettes_crevettes_chorizo": {
    "title": "Brochettes crevettes chorizo",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/brochettes_crevettes_chorizo_spooky.jpg",
    "categories": [
      "Plats",
      "Apéro"
    ],
    "seasons": [
      "Ete",
      "Printemps"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 18,
    "cookTime": 8,
    "tags": [
      "crevettes",
      "chorizo",
      "brochettes",
      "plancha"
    ],
    "aliases": [
      "brochettes de crevettes au chorizo",
      "crevettes chorizo"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "500g grosses crevettes decortiquees",
          "150g chorizo en rondelles",
          "25g huile d olive",
          "10g jus de citron",
          "1 gousse d ail",
          "10g persil",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Melanger huile, citron, ail, persil et poivre du moulin.",
      "Enrober les crevettes 10min, pas plus longtemps.",
      "Monter les brochettes en alternant crevettes et chorizo.",
      "Cuire a la plancha ou a la poele chaude 2 a 3min par face.",
      "Servir aussitot avec un trait de citron."
    ],
    "notes": [
      "Repere menu : iodé, gras et epice, a equilibrer avec salade ou legumes verts, pas avec sauce fromage.",
      "Conservation : a consommer le jour meme de preference.",
      "Securite : ne pas prolonger la marinade des crevettes et cuire juste a coeur."
    ],
    "practical": {
      "equipment": [
        "Pics a brochettes",
        "Plancha ou poele",
        "Bol"
      ],
      "result": [
        "Brochettes rapides, crevettes juteuses et chorizo grille."
      ]
    },
    "additionalMasters": [
      "apero_maitre"
    ]
  },
  "dhal_lentilles_epices": {
    "title": "Dhal lentilles epices",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/dhal_lentilles_epices_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver",
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 15,
    "cookTime": 30,
    "tags": [
      "lentilles",
      "epices",
      "vegetarien",
      "coco"
    ],
    "aliases": [
      "dhal de lentilles",
      "dal lentilles epices"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "250g lentilles corail",
          "400g lait de coco",
          "300g tomates concassees",
          "140g oignon",
          "2 gousses d ail",
          "15g gingembre",
          "20g huile neutre",
          "6g curry",
          "4g cumin",
          "3g sel fin",
          "Coriandre fraiche"
        ]
      }
    ],
    "steps": [
      "Rincer les lentilles corail.",
      "Faire revenir oignon, ail et gingembre dans l huile.",
      "Ajouter curry et cumin, puis tomates, lentilles et lait de coco.",
      "Mijoter 25 a 30min en remuant souvent, jusqu a texture cremeuse.",
      "Ajuster sel et detendre avec un peu d eau si besoin, puis finir avec coriandre."
    ],
    "notes": [
      "Repere menu : plat vegetal cremeux, a equilibrer avec riz nature ou salade acide, pas avec autre sauce riche.",
      "Conservation : 2 a 3 jours au refrigerateur.",
      "Securite : refroidir rapidement, le dhal epaissit au froid."
    ],
    "practical": {
      "equipment": [
        "Casserole",
        "Passoire",
        "Cuillere"
      ],
      "result": [
        "Dhal cremeux, epice, lisible comme plat complet."
      ]
    }
  },
  "fish_and_chips": {
    "title": "Fish and chips",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/fish_and_chips_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "medium",
    "difficultyScore": 5,
    "yield": "4 personnes",
    "activeTime": 32,
    "cookTime": 18,
    "tags": [
      "poisson",
      "friture",
      "pommes de terre"
    ],
    "aliases": [
      "poisson frit frites",
      "fish chips"
    ],
    "ingredients": [
      {
        "group": "Poisson",
        "items": [
          "600g dos de cabillaud ou lieu",
          "120g farine",
          "160g biere blonde tres froide ou eau petillante",
          "1 oeuf",
          "6g levure chimique",
          "4g sel fin",
          "Poivre du moulin"
        ]
      },
      {
        "group": "Frites et service",
        "items": [
          "800g pommes de terre",
          "1000g huile neutre de friture",
          "1 citron",
          "120g sauce yaourt citronnee"
        ]
      }
    ],
    "steps": [
      "Tailler les pommes de terre en grosses frites, les rincer puis les secher soigneusement.",
      "Cuire les frites dans l huile chaude jusqu a ce qu elles soient tendres, egoutter puis reserver.",
      "Melanger farine, levure, sel, poivre du moulin, oeuf et biere froide pour obtenir une pate epaisse.",
      "Secher le poisson, l enrober de pate puis frire jusqu a ce que la croute soit doree et croustillante.",
      "Replonger les frites quelques minutes pour les dorer, saler puis servir avec citron et sauce."
    ],
    "notes": [
      "Repere menu : plat frit et riche, a equilibrer avec salade acide ou dessert frais.",
      "Conservation : meilleur minute; restes 24h au refrigerateur, rechauffage au four doux pour garder du croustillant.",
      "Securite : surveiller l huile chaude, ne jamais remplir la casserole au-dela de la moitie."
    ],
    "linkedRecipes": [
      {
        "id": "sauce_yaourt_citronnee",
        "role": "Sauce rapide"
      }
    ],
    "practical": {
      "equipment": [
        "Casserole haute",
        "Ecumoire",
        "Papier absorbant"
      ],
      "result": [
        "Poisson croustillant, chair blanche lisible, frites epaisses."
      ]
    }
  },
  "rattes_four": {
    "title": "Rattes au four",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/rattes_four_spooky.jpg",
    "categories": [
      "Accompagnements"
    ],
    "seasons": [
      "Toutes saisons"
    ],
    "difficulty": "easy",
    "difficultyScore": 2,
    "yield": "4 personnes",
    "activeTime": 10,
    "cookTime": 35,
    "tags": [
      "pommes de terre",
      "four",
      "herbes"
    ],
    "aliases": [
      "rattes cuites au four",
      "pommes de terre rattes au four"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "800g pommes de terre rattes",
          "30g huile d olive",
          "2 gousses d ail",
          "3g thym",
          "3g romarin",
          "5g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Prechauffer le four a 200C.",
      "Laver et secher les rattes sans les eplucher.",
      "Melanger avec huile, ail ecrase, thym, romarin, sel et poivre du moulin.",
      "Etaler en une couche dans un plat chaud.",
      "Rotir 30 a 35min en retournant une fois, jusqu a peau ridee et coeur fondant."
    ],
    "notes": [
      "Repere menu : accompagnement neutre, bon avec poisson, poulet ou plat en sauce sans autre feculent.",
      "Conservation : 2 a 3 jours au refrigerateur; rechauffer au four pour retrouver la peau ferme.",
      "Securite : secher les pommes de terre pour eviter les projections d huile."
    ],
    "practical": {
      "equipment": [
        "Plat a four",
        "Couteau",
        "Spatule"
      ],
      "result": [
        "Petites pommes de terre entieres, peau doree et coeur fondant."
      ]
    }
  },
  "gratin_chou_fleur_comte_lardons": {
    "title": "Gratin chou-fleur comte lardons",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/gratin_chou_fleur_comte_lardons_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver",
      "Printemps"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "activeTime": 25,
    "cookTime": 35,
    "tags": [
      "chou-fleur",
      "fromage",
      "lardons"
    ],
    "aliases": [
      "gratin de chou-fleur au comte et aux lardons"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "850g chou-fleur",
          "160g lardons fumes",
          "180g comte rape",
          "300g lait",
          "150g creme liquide",
          "25g beurre",
          "25g farine",
          "2g noix de muscade",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire le chou-fleur en bouquets 8 a 10min, il doit rester un peu ferme.",
      "Dorer les lardons a la poele puis les egoutter.",
      "Fondre le beurre, ajouter farine, puis verser lait et creme en fouettant pour obtenir une sauce nappante.",
      "Ajouter muscade, poivre du moulin, la moitie du comte et les lardons.",
      "Mettre le chou-fleur dans un plat, napper de sauce, couvrir du reste de comte.",
      "Gratiner 25 a 30min a 190C jusqu a surface doree."
    ],
    "notes": [
      "Repere menu : plat cremeux et fromage, ne pas ajouter une sauce riche ni un second gratin.",
      "Conservation : 2 a 3 jours au refrigerateur; rechauffer couvert puis finir decouvert.",
      "Securite : egoutter le chou-fleur pour eviter un gratin aqueux."
    ],
    "practical": {
      "equipment": [
        "Plat a gratin",
        "Casserole",
        "Fouet"
      ],
      "result": [
        "Gratin riche, chou-fleur visible, fromage dore et lardons croustillants."
      ]
    }
  },
  "hachis_parmentier": {
    "title": "Hachis parmentier",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/hachis_parmentier_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Automne",
      "Hiver"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "activeTime": 35,
    "cookTime": 35,
    "tags": [
      "boeuf",
      "pommes de terre",
      "gratin"
    ],
    "aliases": [
      "parmentier de boeuf"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "700g boeuf hache ou reste de boeuf cuit",
          "950g pommes de terre",
          "180g lait",
          "60g beurre",
          "140g oignon",
          "100g carotte",
          "2 gousses d ail",
          "120g comte rape",
          "20g huile d olive",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Cuire les pommes de terre dans l eau salee puis les ecraser avec lait chaud et beurre.",
      "Faire revenir oignon, carotte et ail haches dans l huile.",
      "Ajouter le boeuf et cuire jusqu a ce que la garniture soit bien sechee.",
      "Etaler la viande dans un plat, couvrir de puree puis parsemer de comte.",
      "Cuire 25 a 30min a 190C, jusqu a dessus dore."
    ],
    "notes": [
      "Repere menu : plat complet avec feculent et viande, servir avec salade verte ou legumes acides.",
      "Conservation : 2 a 3 jours au refrigerateur; rechauffage au four couvert.",
      "Securite : refroidir rapidement le plat si prepare en avance."
    ],
    "practical": {
      "equipment": [
        "Casserole",
        "Poele",
        "Plat a gratin"
      ],
      "result": [
        "Couche de viande juteuse, puree doree, plat familial complet."
      ]
    }
  },
  "tomates_farcies": {
    "title": "Tomates farcies",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/tomates_farcies_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Ete",
      "Automne"
    ],
    "difficulty": "medium",
    "difficultyScore": 4,
    "yield": "4 personnes",
    "activeTime": 30,
    "cookTime": 45,
    "tags": [
      "tomates",
      "farce",
      "four"
    ],
    "aliases": [
      "tomates farcies au four"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "900g grosses tomates",
          "500g chair a saucisse",
          "120g oignon",
          "60g mie de pain",
          "80g lait",
          "1 oeuf",
          "2 gousses d ail",
          "20g persil",
          "120g riz",
          "20g huile d olive",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Couper un chapeau aux tomates, les vider puis saler legerement l interieur.",
      "Tremper la mie de pain dans le lait, puis melanger avec chair a saucisse, oeuf, oignon, ail et persil.",
      "Garnir les tomates sans trop tasser et replacer les chapeaux.",
      "Mettre le riz au fond du plat avec un peu de chair de tomate et huile.",
      "Cuire 40 a 45min a 180C, jusqu a farce cuite et tomates confites."
    ],
    "notes": [
      "Repere menu : plat complet tomate + viande + riz, eviter un accompagnement tomate ou un second feculent.",
      "Conservation : 2 jours au refrigerateur; rechauffage doux au four.",
      "Securite : la farce doit etre cuite a coeur, surtout si les tomates sont tres grosses."
    ],
    "practical": {
      "equipment": [
        "Plat a four",
        "Couteau",
        "Saladier"
      ],
      "result": [
        "Tomates bien farcies, jus parfume et riz de cuisson au fond du plat."
      ]
    }
  },
  "piperade_oeuf_plat": {
    "title": "Piperade oeuf au plat",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/piperade_oeuf_plat_spooky.jpg",
    "categories": [
      "Plats"
    ],
    "seasons": [
      "Ete",
      "Automne"
    ],
    "difficulty": "easy",
    "difficultyScore": 3,
    "yield": "4 personnes",
    "activeTime": 25,
    "cookTime": 35,
    "tags": [
      "poivrons",
      "tomates",
      "oeufs"
    ],
    "aliases": [
      "piperade et oeuf au plat",
      "piperade aux oeufs"
    ],
    "ingredients": [
      {
        "group": "Base",
        "items": [
          "650g poivrons rouges et verts",
          "500g tomates",
          "180g oignon",
          "2 gousses d ail",
          "35g huile d olive",
          "4 oeufs",
          "2g piment d Espelette",
          "4g sel fin",
          "Poivre du moulin"
        ]
      }
    ],
    "steps": [
      "Emincer poivrons et oignons, hacher l ail.",
      "Faire revenir oignons et poivrons dans l huile jusqu a ce qu ils commencent a fondre.",
      "Ajouter ail, tomates concassees, sel, poivre du moulin et piment.",
      "Mijoter 25 a 30min pour concentrer la piperade.",
      "Creuser quatre nids, casser les oeufs et cuire a couvert jusqu a blancs pris et jaunes encore souples."
    ],
    "notes": [
      "Repere menu : plat legumes + oeufs, bon avec pain grille ou pommes de terre simples, pas avec autre sauce tomate.",
      "Conservation : piperade seule 2 a 3 jours au refrigerateur; ajouter les oeufs au dernier moment.",
      "Securite : cuire les oeufs juste avant service si le plat est prepare en avance."
    ],
    "practical": {
      "equipment": [
        "Grande poele",
        "Couteau",
        "Couvercle"
      ],
      "result": [
        "Poivrons fondants, tomate concentree, oeufs au plat poses dessus."
      ]
    }
  }
};
