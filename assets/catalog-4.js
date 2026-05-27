// Cook Note - catalogue recettes chunk 4/4
window.RECIPES = Object.assign(window.RECIPES || {}, {
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
      "Fiche maître : bases techniques et montages liés."
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
      "Fiche maître : préparations de tomates confites, séchées ou rôties."
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
        "id": "beurre_ail",
        "label": "Beurre à l’ail"
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
  "pesto_variantes": {
    "title": "Pestos",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/pesto_variantes_spooky.jpg",
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
      "Version salade : mixer basilic + pignons + ail + parmesan puis monter à l’huile et citron.",
      "Version Genovese : piler ail + sel + pignons, ajouter le basilic puis les fromages et l’huile."
    ],
    "notes": [
      "Même fiche, 2 styles : citronné (salades) ou traditionnel (pâtes/gnocchi).",
      "Conservation : 2–4 j au froid, film au contact + fine couche d’huile.",
      "Stockage : bocal ou boîte hermétique au réfrigérateur. Péremption : 3–5 jours; vérifier odeur, texture et absence de fermentation."
    ],
    "difficultyScore": 3,
    "variantGroups": true,
    "aliases": [
      "pesto",
      "pestos",
      "pesto genovese"
    ]
  },
  "legumes_rotis": {
    "title": "Légumes rôtis au four",
    "master": "accompagnements_maitre",
    "image": "/assets/recipe-images-optimized/legumes_rotis_spooky.jpg",
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
          "Cuisson : 35 à 45min à 200°C chaleur tournante"
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
          "Cuisson : 25 à 35min à 200°C chaleur tournante"
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
          "Cuisson : 22 à 35min à 200°C chaleur tournante"
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
          "Cuisson : 30 à 45min à 200°C chaleur tournante"
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
          "Cuisson : 25 à 35min à 200°C chaleur tournante"
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
          "Cuisson : 15 à 25min à 200°C chaleur tournante"
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
          "Cuisson : 18 à 35min à 200°C chaleur tournante"
        ],
        "steps": [
          "Prechauffer le four a 200C chaleur tournante.",
          "Tailler poivron en lanieres, courgette en quartiers ou aubergine en des de 2 a 3cm, puis enrober sans trop saler.",
          "Rotir 18 a 35min selon le legume, retourner une fois et sortir quand l eau de vegetation s est concentree."
        ]
      },
      {
        "group": "Variante oignon, fenouil ou poireau",
        "items": [
          "650g oignons ou fenouil en quartiers, ou poireaux en tronçons de 3 à 4cm",
          "Cuisson : 20 à 35min à 200°C chaleur tournante"
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
          "Cuisson : 10 à 18min à 200°C chaleur tournante"
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
          "Cuisson : 20 à 25min à 200°C chaleur tournante"
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
      "Conservation : 4 j au réfrigérateur.",
      "Stockage : bocal ou boîte hermétique au réfrigérateur. Péremption : 3–5 jours; vérifier odeur, texture et absence de fermentation.",
      "Chaque four réagit différemment : surveillez la coloration et la texture en fin de cuisson, puis ajustez le temps si nécessaire."
    ],
    "difficultyScore": 3,
    "tags": [
      "legumes",
      "four",
      "rôti",
      "accompagnement"
    ],
    "aliases": [
      "legumes au four",
      "legumes rotis",
      "accompagnement legumes"
    ],
    "additionalMasters": [
      "entrees_maitre"
    ]
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
      "La veille : prélever 40g de lait, tiédir à 25–30°C, dissoudre la levure fraîche.",
      "Mélanger farine, sucre, sel et vanille. Ajouter œuf, reste du lait, mélange levure et beurre fondu tiède ou mou.",
      "Pétrir 8–10min jusqu’à pâte lisse, souple et légèrement collante. Couvrir 15min.",
      "Bouler, placer en bol légèrement huilé, laisser 30–45min à température ambiante.",
      "Couvrir et mettre au froid 12–18h.",
      "Le lendemain : sortir 1h avant.",
      "Dégazer légèrement, bouler à 60–70g avec une surface bien tendue.",
      "Apprêt 1h à 1h 30. L’empreinte du doigt doit remonter lentement.",
      "Frire à 160–165°C, 2min 30 à 3min par face, 2–3 pièces maximum à la fois.",
      "Rouler dans le sucre à chaud, saupoudrer de sucre glace tiède ou froid, ou fourrer quand les beignets sont tièdes ou froids."
    ],
    "notes": [
      "Ne jamais fourrer chaud.",
      "Trou sur le côté, douille longue, 30–40g de crème.",
      "Stopper quand le beignet devient légèrement gonflé et lourd.",
      "Huile trop chaude : extérieur foncé et cœur insuffisamment cuit.",
      "Huile trop froide : beignets gras.",
      "Apprêt insuffisant : mie dense.",
      "Sur-apprêt : beignets qui retombent.",
      "Résultat attendu : mie aérée et filante, extérieur finement doré, cuisson à cœur sans sécheresse.",
      "Stockage : idéalement le jour même. Péremption : 24–48h en boîte hermétique; réchauffer doucement pour retrouver la texture.",
      "Chaque four réagit différemment : surveillez la coloration et la texture en fin de cuisson, puis ajustez le temps si nécessaire.",
      "Crèmes à garnir : <span data-goto=\"creme_diplomate_vanille\">Crème diplomate vanille</span> · <span data-goto=\"creme_diplomate_cloud\">Crème diplomate vanille à garnir</span> · <span data-goto=\"creme_patissiere_vanille\">Crème pâtissière vanille</span> · <span data-goto=\"creme_patissiere_praline\">Crème pâtissière praliné</span> · <span data-goto=\"creme_kinder_nutella\">Crème Nutella à garnir</span> · <span data-goto=\"creme_pistache\">Crème pistache à garnir</span> · <span data-goto=\"creme_praline\">Crème praliné</span> · <span data-goto=\"mascarpone\">Crème mascarpone vanille</span> · <span data-goto=\"chantilly_gelatine\">Chantilly stabilisée</span>."
    ],
    "technical": [
      {
        "label": "Conversion levure",
        "value": "1g de levure sèche équivaut à environ 3g de levure fraîche. Pour cette recette, 10–12g de levure fraîche correspondent à environ 3–4g de levure sèche."
      }
    ],
    "difficultyScore": 7
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
      "Base technique pour plusieurs entremets/pâtisseries classiques.",
      "Stockage : boîte hermétique au sec, à température ambiante. Péremption : 5–14 jours selon humidité; garder loin du réfrigérateur sauf garniture fragile.",
      "Chaque four réagit différemment : surveillez la coloration et la texture en fin de cuisson, puis ajustez le temps si nécessaire."
    ],
    "difficultyScore": 8,
    "additionalMasters": [
      "elements_base_maitre"
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
        "id": "chou_fleur_croustillant",
        "label": "Chou-fleur croustillant"
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
        "id": "frites_maison",
        "label": "Frites maison"
      },
      {
        "id": "gaufres_pommes_terre",
        "label": "Gaufres de pommes de terre croustillantes"
      },
      {
        "id": "gratin_chou_fleur",
        "label": "Gratin de chou-fleur"
      },
      {
        "id": "legumes_rotis",
        "label": "Légumes rôtis au four"
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
        "id": "pesto_tomates_sechees_sans_cajou",
        "label": "Pesto tomates séchées"
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
  "oeuf_chili_crisp_toast": {
    "title": "Œuf sur le plat chili crisp sur toast",
    "master": "petit_dejeuner_maitre",
    "image": "/assets/recipe-images-optimized/oeuf_chili_crisp_toast_spooky.jpg",
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
        "group": "Huile chili crisp maison",
        "items": [
          "110g huile d’avocat ou huile neutre",
          "5g flocons de piment concassés ou piment rouge séché finement concassé",
          "7g poudre de piment finement moulue : piment du Sichuan, gochugaru, poudre de chili ou autre piment au choix",
          "0,3g cinq-épices",
          "4 à 5g ail très finement haché ou râpé",
          "1,5g graines de sésame",
          "1,5g sel"
        ]
      },
      {
        "group": "Toast à l’œuf",
        "items": [
          "9 à 14g huile chili crisp maison ou huile chili crisp du commerce",
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
      "Verser l’huile dans une petite casserole et chauffer à feu doux : elle doit être chaude sans fumer.",
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
  "oignons_rotis_thym_miel": {
    "title": "Oignons rôtis au thym et au miel",
    "master": "entrees_maitre",
    "image": "/assets/recipe-images-optimized/oignons_rotis_thym_miel_spooky.jpg",
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
      "Conservation : 3–4 jours au froid en boîte hermétique.",
      "Stockage : bocal ou boîte hermétique au réfrigérateur. Péremption : 3–5 jours; vérifier odeur, texture et absence de fermentation.",
      "Chaque four réagit différemment : surveillez la coloration et la texture en fin de cuisson, puis ajustez le temps si nécessaire."
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
      "Refroidir avant montage pour une tenue nette.",
      "Stockage : au réfrigérateur à 0–4°C, filmé ou en boîte hermétique. Péremption : 24–48h selon fraîcheur des produits laitiers et des œufs."
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
      "Lisser au fouet après refroidissement avant incorporation.",
      "Stockage : au réfrigérateur à 0–4°C, filmé ou en boîte hermétique. Péremption : 24–48h selon fraîcheur des produits laitiers et des œufs."
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
  "babeurre_maison": {
    "title": "Babeurre maison",
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
      "babeurre maison",
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
      "Laisser reposer 10min  à température ambiante.",
      "Utiliser dès que le lait a légèrement épaissi."
    ],
    "notes": [
      "À utiliser dans les pancakes, gaufres ou pâtes levées moelleuses.",
      "Stockage : au réfrigérateur en contenant propre. Péremption : 24h."
    ],
    "tags": [
      "babeurre",
      "lait",
      "base"
    ],
    "difficultyScore": 1
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
      "Cuire à four chaud 7 à 10min selon la taille des moules : les bords doivent être pris et le centre tremblotant.",
      "Attendre 1min, démouler délicatement et servir aussitôt."
    ],
    "notes": [
      "Le temps de cuisson est le point clé : tester un moule avant une série.",
      "Préparation des moules ou ramequins : beurre généreusement puis chemise au cacao ou à la farine, sinon les mi-cuits peuvent coller au démoulage.",
      "Stockage : appareil cru 24h au réfrigérateur, cuisson minute recommandée.",
      "Chaque four réagit différemment : surveillez la coloration et la texture en fin de cuisson, puis ajustez le temps si nécessaire."
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
      "churros maison"
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
      "La pâte doit être assez souple pour être pochée mais garder les stries de la douille.",
      "Stockage : meilleur minute, possible 24h mais perd du croustillant.",
      "Chaque four réagit différemment : surveillez la coloration et la texture en fin de cuisson, puis ajustez le temps si nécessaire."
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
      "Sors le beurre à ramollir environ 45 à 60min avant, selon la température de la pièce : il doit être souple mais pas fondu.",
      "Pour l’arôme vanille, suis le dosage indiqué sur la bouteille : les arômes ne se dosent pas tous pareil.",
      "Ne prolonge pas trop la cuisson : les cookies continuent de cuire légèrement hors du four.",
      "La pâte peut être congelée en boules bien emballées, puis cuite plus tard directement depuis le congélateur.",
      "Chaque four réagit différemment : surveille la coloration et ajuste le temps de cuisson si nécessaire."
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
  "sauce_caramel": {
    "title": "Sauce caramel",
    "master": "sauces_assaisonnements_maitre",
    "image": "/assets/recipe-images-optimized/sauce_caramel_spooky.jpg",
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
      "Laisser tiédir : la sauce épaissit en refroidissant.",
      "Mettre en pot propre et conserver au réfrigérateur."
    ],
    "notes": [
      "Pour une sauce plus fluide, ajoute une petite touche de lait chaud après cuisson.",
      "Pour une sauce plus épaisse, prolonge très légèrement la cuisson en surveillant la couleur et la texture.",
      "Si tu utilises un arôme vanille, suis le dosage indiqué sur la bouteille : les arômes ne se dosent pas tous pareil.",
      "Conservation : environ 1 semaine au réfrigérateur dans un pot propre fermé."
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
  "cotelettes_porc_miel_moutarde": {
    "title": "Côtelettes de porc miel moutarde",
    "master": "plats_maitre",
    "image": "/assets/recipe-images-optimized/cotelettes_porc_miel_moutarde_spooky.jpg",
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
      "Garnitures adaptées : purée de céleri-rave, pommes Anna, carottes glacées, chou pointu rôti ou écrasé de pommes de terre au beurre noisette."
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
  "pancakes_fluffy": {
    "title": "Pancakes fluffy",
    "master": "petit_dejeuner_maitre",
    "image": "/assets/recipe-images-optimized/pancakes_fluffy_spooky.jpg",
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
      "Tu peux remplacer la gousse par de l'arôme vanille, mais suis le dosage indiqué sur la bouteille : les arômes ne se dosent pas tous pareil.",
      "Garnitures possibles : chocolat fondu, sirop d'érable, caramel ou fruits frais."
    ],
    "technical": [
      {
        "label": "Blancs en neige",
        "value": "Incorporer les blancs délicatement pour ne pas perdre le volume."
      },
      {
        "label": "Cuisson",
        "value": "Feu doux à moyen : les pancakes doivent cuire à cœur sans colorer trop vite."
      }
    ]
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
      "Ces pains se congèlent très bien une fois refroidis.",
      "Chaque four réagit différemment : surveille la coloration et ajuste le temps de cuisson si nécessaire."
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
      "Option restaurant : passer 3 à 5min sur grille au four à 190°C, puis saler légèrement à la fleur de sel.",
      "Servir immédiatement avec sauce crème citronnée et herbes fraîches."
    ],
    "notes": [
      "Moins il reste d’eau dans les pommes de terre, plus les gaufres seront croustillantes.",
      "N’ouvre pas le gaufrier trop tôt : la gaufre doit se détacher seule.",
      "Chaque four réagit différemment : surveille la coloration si tu fais la finition au four."
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
      "Résultat cible : très frais, lisse, dominé par la tomate, légèrement acidulé et parfumé par les herbes."
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
        "note": "Préparer des frites belges, des frites maison ou des frites au four, puis ajouter les toppings juste après cuisson."
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
      "Préparer une base de frites : frites belges ou frites maison.",
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
      "Liens utiles : <span data-goto=\"frites_belges\">Frites belges</span> · <span data-goto=\"frites_maison\">Frites maison</span> · <span data-goto=\"frites_patate_douce\">Frites de patate douce</span>.",
      "Ajouter les sauces au dernier moment et éviter de couvrir les frites après topping : la vapeur les ramollit.",
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
      "Raccourci : <span data-goto=\"beignets_calamar\">Beignets de calamar</span>."
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
      "Le gril colore très vite : rester devant le four.",
      "Pour un goût plus doux, prépare le beurre avec de l’ail blanchi ou une quantité d’ail réduite."
    ],
    "technical": [
      {
        "label": "Beurre",
        "value": "Il doit être pommade pour s’étaler sans déchirer le pain."
      },
      {
        "label": "Gril",
        "value": "Cuisson courte et intense : surveiller en continu."
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
        "value": "Le centre doit être pris mais encore souple : il finit de se stabiliser en tiédissant."
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
        "Ne verse pas tout le lait d’un coup : l’ajout progressif évite les grumeaux."
      ],
      "result": [
        "Clafoutis moelleux, fruité, avec une pâte fine autour des cerises."
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
      "rillettes maison"
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
      "Remuer de temps en temps : la viande doit se détacher en filaments sans sécher.",
      "Retirer laurier et thym, égoutter la viande en gardant la graisse de cuisson.",
      "Effilocher la viande à la fourchette, puis incorporer assez de graisse chaude pour obtenir une texture moelleuse.",
      "Mettre en pots propres, tasser légèrement et couvrir d’une fine couche de graisse.",
      "Refroidir rapidement, puis laisser reposer 24h au réfrigérateur avant dégustation."
    ],
    "notes": [
      "Les rillettes reposent sur une cuisson lente dans la graisse : c’est ce qui donne les filaments et le goût profond.",
      "Servir à l’apéro, en entrée ou dans un sandwich avec cornichons et pain grillé.",
      "La couche de graisse protège la surface, mais ne remplace pas une hygiène stricte ni une conservation au froid."
    ],
    "technical": [
      {
        "label": "Cuisson",
        "value": "Le liquide doit frémir à peine : une ébullition forte dessèche la viande et brouille la texture."
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
        "Après ouverture : consommer sous 48h.",
        "Congélation possible en petits pots bien fermés."
      ],
      "mistakes": [
        "Ne garde pas les rillettes tièdes longtemps : refroidis vite les pots avant stockage."
      ],
      "result": [
        "Rillettes fondantes, filandreuses et bien confites."
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
      "La tempura doit rester imparfaite : quelques petits grumeaux donnent une friture plus légère.",
      "Garder l’eau glacée et cuire sans attendre.",
      "Raccourci : <span data-goto=\"beignets_calamar\">Beignets de calamar</span>."
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
  }
});
