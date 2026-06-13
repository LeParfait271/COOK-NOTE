// Cook Note - catalogue recettes chunk 2/4
window.RECIPES = Object.assign(window.RECIPES || {}, {
    "chantilly_maitre":  {
                             "title":  "Chantilly",
                             "image":  "/assets/recipe-images-optimized/chantilly_maitre_spooky.jpg",
                             "categories":  [
                                                "Desserts",
                                                "Base"
                                            ],
                             "seasons":  [
                                             "Toutes saisons"
                                         ],
                             "difficulty":  "easy",
                             "masterType":  "collection",
                             "variants":  [
                                              {
                                                  "id":  "chantilly_classique",
                                                  "label":  "Chantilly classique"
                                              },
                                              {
                                                  "id":  "chantilly_gelatine",
                                                  "label":  "Chantilly stabilisée"
                                              }
                                          ],
                             "ingredients":  [
                                                 {
                                                     "group":  "Choisir une variante",
                                                     "items":  [
                                                                   "Sélectionner la chantilly voulue dans les boutons de la fiche."
                                                               ]
                                                 }
                                             ],
                             "steps":  [
                                           "Choisir une variante pour afficher la méthode adaptée."
                                       ],
                             "notes":  [
                                           "Fiche maître chantilly simple, riche ou stabilisée."
                                       ],
                             "technical":  [
                                               {
                                                   "label":  "Froid",
                                                   "value":  "Creme, bol et fouet bien froids avant montage."
                                               },
                                               {
                                                   "label":  "Tenue",
                                                   "value":  "Arreter des que la texture forme un bec souple a ferme selon l\u0027usage."
                                               },
                                               {
                                                   "label":  "Sucre",
                                                   "value":  "Incorporer progressivement pour garder une bouche legere."
                                               }
                                           ],
                             "master":  "cremes_maitre"
                         },
    "sauces_assaisonnements_maitre":  {
                                          "title":  "Sauces, pestos et assaisonnements",
                                          "image":  "/assets/recipe-images-optimized/sauces_assaisonnements_maitre_spooky.jpg",
                                          "categories":  [
                                                             "Sauces"
                                                         ],
                                          "seasons":  [
                                                          "Toutes saisons"
                                                      ],
                                          "difficulty":  "easy",
                                          "masterType":  "collection",
                                          "variants":  [
                                                           {
                                                               "id":  "aioli_citronne_leger",
                                                               "label":  "Aïoli citronné léger"
                                                           },
                                                           {
                                                               "id":  "balsamique_reduit",
                                                               "label":  "Balsamique réduit"
                                                           },
                                                           {
                                                               "id":  "harissa_maison",
                                                               "label":  "Harissa rouge"
                                                           },
                                                           {
                                                               "id":  "huile_pimentee_pizza",
                                                               "label":  "Huile pimentée pour pizza"
                                                           },
                                                           {
                                                               "id":  "marinades_guide",
                                                               "label":  "Marinades"
                                                           },
                                                           {
                                                               "id":  "mayonnaise_maison",
                                                               "label":  "Mayonnaise"
                                                           },
                                                           {
                                                               "id":  "pesto_tomates_sechees_sans_cajou",
                                                               "label":  "Pesto tomates séchées"
                                                           },
                                                           {
                                                               "id":  "pesto_variantes",
                                                               "label":  "Pestos"
                                                           },
                                                           {
                                                               "id":  "ricotta_fouettee",
                                                               "label":  "Ricotta fouettée"
                                                           },
                                                           {
                                                               "id":  "rouille_haut_de_gamme",
                                                               "label":  "Rouille"
                                                           },
                                                           {
                                                               "id":  "sauce_aigre_douce_vietnam",
                                                               "label":  "Sauce aigre-douce vietnamienne"
                                                           },
                                                           {
                                                               "id":  "sauce_aux_poivres",
                                                               "label":  "Sauce aux poivres"
                                                           },
                                                           {
                                                               "id":  "sauce_caramel",
                                                               "label":  "Sauce caramel"
                                                           },
                                                           {
                                                               "id":  "vinaigrette",
                                                               "label":  "Vinaigrette"
                                                           },
                                                           {
                                                               "id":  "sauce_nem",
                                                               "label":  "Sauce nem"
                                                           }
                                                       ],
                                          "ingredients":  [
                                                              {
                                                                  "group":  "Choisir une variante",
                                                                  "items":  [
                                                                                "Sélectionner la sauce ou l’assaisonnement voulu dans les boutons de la fiche."
                                                                            ]
                                                              }
                                                          ],
                                          "steps":  [
                                                        "Choisir une variante pour afficher la recette complète."
                                                    ],
                                          "notes":  [
                                                        "Fiche maître sauces froides, condiments, huiles et marinades."
                                                    ],
                                          "technical":  [
                                                            {
                                                                "label":  "Equilibre",
                                                                "value":  "Verifier sel, acidite et gras en fin de preparation."
                                                            },
                                                            {
                                                                "label":  "Texture",
                                                                "value":  "Allonger par petites touches pour garder la concentration."
                                                            },
                                                            {
                                                                "label":  "Conservation",
                                                                "value":  "Filmer ou couvrir au contact quand la sauce attend."
                                                            }
                                                        ],
                                          "master":  "sauces_maitre"
                                      },
    "beurre_ail":  {
                       "title":  "Beurre à l’ail",
                       "master":  "bases_salees_maitre",
                       "image":  "/assets/recipe-images-optimized/beurre_ail_spooky.jpg",
                       "categories":  [
                                          "Base",
                                          "Apéro"
                                      ],
                       "seasons":  [
                                       "Toutes saisons"
                                   ],
                       "difficulty":  "easy",
                       "difficultyScore":  1,
                       "yield":  "environ 200g",
                       "aliases":  [
                                       "beurre ail",
                                       "beurre à l’ail",
                                       "beurre ail persil",
                                       "beurre compose ail"
                                   ],
                       "tags":  [
                                    "beurre",
                                    "ail",
                                    "persil",
                                    "base",
                                    "apero"
                                ],
                       "linkedRecipes":  [
                                             {
                                                 "id":  "pain_grille_beurre_ail_herbes",
                                                 "role":  "Utilisation"
                                             }
                                         ],
                       "ingredients":  [
                                           {
                                               "group":  "Beurre parfumé",
                                               "items":  [
                                                             "200g beurre doux ramolli",
                                                             "20g ail haché très finement",
                                                             "12g persil plat ciselé",
                                                             "6g jus de citron",
                                                             "3g sel fin",
                                                             "Poivre du moulin"
                                                         ]
                                           }
                                       ],
                       "steps":  [
                                     "Sortir le beurre environ 45 à 60min avant pour obtenir une texture pommade, souple mais non fondue.",
                                     "Hacher l’ail très finement, puis ciseler le persil.",
                                     "Mélanger le beurre avec l’ail, le persil, le jus de citron, le sel fin et le poivre du moulin.",
                                     "Goûter et ajuster l’assaisonnement, puis transférer en petit pot ou rouler en boudin dans du papier cuisson.",
                                     "Réfrigérer au moins 30min pour raffermir avant de trancher ou tartiner."
                                 ],
                       "notes":  [
                                     "Parfait sur pain grillé, légumes rôtis, viande grillée, poisson, pommes de terre ou pâtes.",
                                     "Pour une version plus douce, blanchir l’ail 30 secondes dans l’eau frémissante puis bien l’égoutter avant de le hacher."
                                 ],
                       "technical":  [
                                         {
                                             "label":  "Texture",
                                             "value":  "Le beurre doit être pommade assez souple pour incorporer les aromates, jamais fondu."
                                         },
                                         {
                                             "label":  "Ail",
                                             "value":  "Hacher très finement évite les morceaux crus agressifs à la dégustation."
                                         }
                                     ],
                       "practical":  {
                                         "equipment":  [
                                                           "Bol",
                                                           "Spatule",
                                                           "Couteau",
                                                           "Petit pot ou papier cuisson"
                                                       ],
                                         "storage":  [
                                                         "5 jours au réfrigérateur en pot hermétique.",
                                                         "Congélation possible en portions pendant 2 mois."
                                                     ],
                                         "mistakes":  [
                                                          "Ne pas faire fondre le beurre il perdrait son émulsion et figerait moins joliment."
                                                      ],
                                         "result":  [
                                                        "Beurre parfumé, tartinable, bien ailé et frais grâce au persil."
                                                    ]
                                     },
                       "additionalMasters":  [
                                                 "apero_maitre"
                                             ]
                   },
    "tomates_variantes":  {
                              "title":  "Tomates confites et séchées",
                              "master":  "apero_maitre",
                              "image":  "/assets/recipe-images-optimized/tomates_variantes_v4_spooky.jpg",
                              "categories":  [
                                                 "Apéro",
                                                 "Entrées",
                                                 "Accompagnements"
                                             ],
                              "seasons":  [
                                              "Été",
                                              "Automne"
                                          ],
                              "difficulty":  "easy",
                              "yield":  "environ 1kg par version",
                              "ingredients":  [
                                                  {
                                                      "group":  "Version séchées",
                                                      "items":  [
                                                                    "1kg tomates Roma",
                                                                    "Sel fin",
                                                                    "Thym",
                                                                    "Huile d\u0027olive pour conservation"
                                                                ],
                                                      "steps":  [
                                                                    "Préchauffer le four à 90–100°C, idéalement en chaleur tournante.",
                                                                    "Couper les tomates Roma en deux, saler légèrement côté chair, puis les poser face coupée vers le haut sur une plaque ou un plat de cuisson.",
                                                                    "Ajouter le thym, puis cuire 2h30 à 3h jusqu’à obtenir des tomates souples, fripées et bien concentrées, sans les brûler.",
                                                                    "Laisser refroidir, puis couvrir d’huile d’olive dans un bocal propre si elles sont préparées pour la conservation."
                                                                ]
                                                  },
                                                  {
                                                      "group":  "Version confites",
                                                      "items":  [
                                                                    "1kg tomates cerises",
                                                                    "6g sel",
                                                                    "3g sucre",
                                                                    "4 gousses d\u0027ail",
                                                                    "Branches de thym",
                                                                    "Huile d\u0027olive"
                                                                ],
                                                      "steps":  [
                                                                    "Préchauffer le four à 120°C.",
                                                                    "Couper les tomates cerises en deux, les disposer dans un plat de cuisson, puis ajouter le sel, le sucre, l’ail, le thym et un filet d’huile d’olive.",
                                                                    "Cuire 1h30 à 2h jusqu’à obtenir des tomates tendres et confites, encore juteuses, sans chercher à les sécher complètement.",
                                                                    "Laisser refroidir, puis conserver sous huile au frais dans un bocal propre si elles ne sont pas utilisées tout de suite."
                                                                ]
                                                  }
                                              ],
                              "steps":  [
                                            "Ouvrir le bloc Version séchées ou Version confites pour afficher les étapes adaptées.",
                                            "Surveiller la texture en fin de cuisson les séchées doivent être concentrées et souples, les confites tendres et encore juteuses.",
                                            "Refroidir puis conserver sous huile au frais si les tomates ne sont pas utilisées immédiatement."
                                        ],
                              "notes":  [
                                            "Séchées parfaites pour antipasti et salades.",
                                            "Confites idéales en bruschetta / pâtes."
                                        ],
                              "difficultyScore":  4,
                              "aliases":  [
                                              "tomates au four",
                                              "tomates confites",
                                              "tomates séchées"
                                          ],
                              "variantGroups":  true,
                              "additionalMasters":  [
                                                        "tomates_maitre",
                                                        "accompagnements_maitre"
                                                    ]
                          },
    "pancakes_variantes":  {
                               "title":  "Pancakes",
                               "master":  "petit_dejeuner_maitre",
                               "image":  "/assets/recipe-images-optimized/pancakes_variantes_v4_spooky.jpg",
                               "categories":  [
                                                  "Petits-déjeuners"
                                              ],
                               "seasons":  [
                                               "Toutes saisons"
                                           ],
                               "difficulty":  "easy",
                               "yield":  "10–12 pancakes",
                               "ingredients":  [
                                                   {
                                                       "group":  "Base sèche",
                                                       "items":  [
                                                                     "250g farine",
                                                                     "40g sucre",
                                                                     "10g levure chimique",
                                                                     "3g sel"
                                                                 ]
                                                   },
                                                   {
                                                       "group":  "Version lait",
                                                       "items":  [
                                                                     "110g œufs (2 œufs moyens)",
                                                                     "300g lait",
                                                                     "40g beurre fondu"
                                                                 ],
                                                       "steps":  [
                                                                     "Fouetter les oeufs avec le lait, puis ajouter le beurre fondu tiede.",
                                                                     "Verser sur les ingredients secs et melanger juste assez pour garder une pate epaisse.",
                                                                     "Cuire les pancakes sur poele chaude graissee, retourner quand les bulles percent la surface."
                                                                 ]
                                                   },
                                                   {
                                                       "group":  "Version babeurre",
                                                       "items":  [
                                                                     "110g œufs (2 œufs moyens)",
                                                                     "300g babeurre",
                                                                     "40g beurre fondu"
                                                                 ],
                                                       "steps":  [
                                                                     "Fouetter les oeufs avec le babeurre, puis ajouter le beurre fondu tiede.",
                                                                     "Verser sur les ingredients secs et melanger peu pour garder le moelleux du babeurre.",
                                                                     "Cuire a feu moyen; retourner quand les bords se tiennent et que le dessus bulle."
                                                                 ]
                                                   },
                                                   {
                                                       "group":  "Babeurre (si besoin)",
                                                       "items":  [
                                                                     "250g lait entier",
                                                                     "10g jus de citron ou vinaigre",
                                                                     "Repos 10min"
                                                                 ],
                                                       "recipeId":  "babeurre_maison"
                                                   }
                                               ],
                               "steps":  [
                                             "Mélanger les ingrédients secs.",
                                             "Ajouter les liquides de la version choisie et mélanger juste assez (pas trop travailler).",
                                             "Repos 10min puis cuisson en petites louches sur poêle beurrée."
                                         ],
                               "notes":  [
                                             "Pour la version babeurre préparer le \u003cspan data-goto=\"babeurre_maison\"\u003ebabeurre\u003c/span\u003e 10min avant.",
                                             "Conservation pâte 4h au froid pancakes cuits 2 j filmés."
                                         ],
                               "difficultyScore":  3,
                               "aliases":  [
                                               "pancakes",
                                               "babeurre"
                                           ],
                               "variantGroups":  true
                           },
    "chantilly_classique":  {
                                "title":  "Chantilly classique",
                                "master":  "chantilly_maitre",
                                "image":  "/assets/recipe-images-optimized/chantilly_classique_spooky.jpg",
                                "categories":  [
                                                   "Desserts"
                                               ],
                                "seasons":  [
                                                "Toutes saisons"
                                            ],
                                "difficulty":  "easy",
                                "yield":  "environ 270g",
                                "ingredients":  [
                                                    {
                                                        "group":  "Base",
                                                        "items":  [
                                                                      "250g crème 35 % très froide",
                                                                      "20–30g sucre glace"
                                                                  ]
                                                    }
                                                ],
                                "steps":  [
                                              "Placer bol, fouet et crème au froid pour faciliter le montage.",
                                              "Verser la crème très froide dans le bol et fouetter progressivement.",
                                              "Quand la crème commence à épaissir, ajouter le sucre glace en pluie.",
                                              "Arrêter au bec d\u0027oiseau la chantilly tient mais reste souple et lisse.",
                                              "Utiliser rapidement ou garder au froid en poche ou bol filmé."
                                          ],
                                "notes":  [
                                              "Parfums vanille, cacao, café, coco (1–2 %).",
                                              "→ Version plus stable \u003cspan data-goto=\"mascarpone\"\u003eChantilly mascarpone\u003c/span\u003e ou \u003cspan data-goto=\"chantilly_gelatine\"\u003eChantilly gélatine\u003c/span\u003e",
                                              "Conservation 24h au froid maximum."
                                          ],
                                "difficultyScore":  3,
                                "tags":  [
                                             "chantilly",
                                             "creme",
                                             "dessert",
                                             "base"
                                         ],
                                "aliases":  [
                                                "creme chantilly",
                                                "chantilly",
                                                "chantilly classique"
                                            ]
                            },
    "creme_diplomate_vanille":  {
                                    "title":  "Crème diplomate vanille",
                                    "master":  "cremes_maitre",
                                    "image":  "/assets/recipe-images-optimized/creme_diplomate_vanille_spooky.jpg",
                                    "categories":  [
                                                       "Desserts"
                                                   ],
                                    "seasons":  [
                                                    "Toutes saisons"
                                                ],
                                    "difficulty":  "medium",
                                    "yield":  "~700g",
                                    "ingredients":  [
                                                        {
                                                            "group":  "Pâtissière",
                                                            "items":  [
                                                                          "250g lait",
                                                                          "50g jaunes d’œufs",
                                                                          "60g sucre",
                                                                          "25g Maïzena",
                                                                          "25g beurre",
                                                                          "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
                                                                      ],
                                                            "recipeId":  "creme_patissiere_vanille"
                                                        },
                                                        {
                                                            "group":  "Chantilly",
                                                            "items":  [
                                                                          "200g crème 30–35 % froide",
                                                                          "20g sucre glace"
                                                                      ],
                                                            "recipeId":  "chantilly_classique"
                                                        }
                                                    ],
                                    "steps":  [
                                                  "Cuire la pâtissière jusqu’à épaississement, ajouter le beurre, filmer au contact puis refroidir.",
                                                  "Monter la chantilly en texture souple.",
                                                  "Lisser la pâtissière froide, puis incorporer la chantilly délicatement."
                                              ],
                                    "notes":  [
                                                  "Dosage fourrage 30–40g par donut.",
                                                  "Texture attendue légère, stable et propre.",
                                                  "Met à jour la recette existante de crème diplomate vanille."
                                              ],
                                    "tags":  [
                                                 "creme",
                                                 "diplomate",
                                                 "vanille",
                                                 "fourrage",
                                                 "donut"
                                             ],
                                    "difficultyScore":  6
                                },
    "court_bouillon":  {
                           "title":  "Court-bouillon",
                           "master":  "bases_salees_maitre",
                           "categories":  [
                                              "Base"
                                          ],
                           "seasons":  [
                                           "Toutes saisons"
                                       ],
                           "difficulty":  "easy",
                           "yield":  "≈ 1 litre (pour pocher 4–6 portions)",
                           "image":  "/assets/recipe-images-optimized/court_bouillon_spooky.jpg",
                           "ingredients":  [
                                               {
                                                   "group":  "Légumes \u0026 aromates",
                                                   "items":  [
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
                                                   "group":  "Liquides",
                                                   "items":  [
                                                                 "2 verres de vin blanc sec (≈ 30cl)",
                                                                 "50cl eau",
                                                                 "Sel"
                                                             ]
                                               }
                                           ],
                           "steps":  [
                                         "Éplucher le poireau, les carottes et l\u0027oignon. Laver le céleri et les herbes.",
                                         "Couper le poireau en quatre dans la longueur et l\u0027attacher avec les branches de céleri et le laurier pour former le bouquet garni.",
                                         "Couper les carottes en quatre dans la longueur. Piquer l\u0027oignon avec le clou de girofle.",
                                         "Dans une cocotte, placer le bouquet garni, les carottes, l\u0027oignon, le vin blanc et 50cl d\u0027eau. Saler et ajouter du poivre du moulin.",
                                         "Porter à ébullition puis laisser cuire 20min à frémissement.",
                                         "Laisser refroidir, puis placer au frais avant utilisation."
                                     ],
                           "notes":  [
                                         "Base aromatique pour pocher poissons, crustacés, légumes ou volailles.",
                                         "Idéal pour pocher poissons (cabillaud, saumon, sole), crustacés, légumes ou volailles.",
                                         "Astuce ajouter un trait de vinaigre blanc ou de jus de citron pour les crustacés.",
                                         "Base possible pour des plats mijotés, sauces et pochages aromatiques.",
                                         "Conservation 3–4 j au froid se congèle très bien 2–3 mois (en portions de 250ml)."
                                     ],
                           "difficultyScore":  2
                       },
    "craquelin_cacao":  {
                            "title":  "Craquelin cacao",
                            "master":  "desserts_maitre",
                            "image":  "/assets/recipe-images-optimized/craquelin_cacao_spooky.jpg",
                            "categories":  [
                                               "Desserts"
                                           ],
                            "seasons":  [
                                            "Toutes saisons"
                                        ],
                            "difficulty":  "easy",
                            "yield":  "décor pour 8 choux",
                            "ingredients":  [
                                                {
                                                    "group":  "Base",
                                                    "items":  [
                                                                  "40g beurre pommade",
                                                                  "45g farine",
                                                                  "50g cassonade ou vergeoise",
                                                                  "6g cacao non sucré",
                                                                  "25g blancs d’œufs",
                                                                  "40g noisettes concassées"
                                                              ]
                                                }
                                            ],
                            "steps":  [
                                          "Mélanger farine + cassonade ou vergeoise + cacao, puis incorporer le beurre.",
                                          "Étaler à 2mm entre deux feuilles et congeler 30min.",
                                          "Découper des anneaux (Ø 8cm, trou Ø 2cm), badigeonner de blanc d’œuf, ajouter les noisettes puis recongeler jusqu’à usage."
                                      ],
                            "notes":  [
                                          "Composant pour \u003cspan data-goto=\"paris_brest\"\u003eParis-Brest\u003c/span\u003e."
                                      ],
                            "difficultyScore":  2
                        },
    "creme_patissiere_praline":  {
                                     "title":  "Crème pâtissière praliné",
                                     "master":  "cremes_maitre",
                                     "image":  "/assets/recipe-images-optimized/creme_patissiere_praline_spooky.jpg",
                                     "categories":  [
                                                        "Desserts",
                                                        "Base"
                                                    ],
                                     "seasons":  [
                                                     "Toutes saisons"
                                                 ],
                                     "difficulty":  "medium",
                                     "yield":  "environ 390g",
                                     "ingredients":  [
                                                         {
                                                             "group":  "Base",
                                                             "items":  [
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
                                     "steps":  [
                                                   "Réhydrater la gélatine dans l’eau froide.",
                                                   "Porter lait + crème à ébullition. Blanchir jaunes + sucre, puis ajouter maïzena et farine.",
                                                   "Verser le liquide chaud sur les jaunes, remettre en casserole et cuire jusqu’à épaississement.",
                                                   "Hors du feu, ajouter gélatine, beurre de cacao, beurre, mascarpone, pâte de noisette et praliné. Mixer, filmer au contact, refroidir."
                                               ],
                                     "notes":  [
                                                   "Ajuster le praliné/pâte de noisette selon l’intensité souhaitée."
                                               ],
                                     "difficultyScore":  6,
                                     "additionalMasters":  [
                                                               "elements_base_maitre"
                                                           ]
                                 },
    "entrees_maitre":  {
                           "title":  "Entrées",
                           "image":  "/assets/recipe-images-optimized/parent_entrees.jpg",
                           "categories":  [
                                              "Entrées"
                                          ],
                           "seasons":  [
                                           "Printemps",
                                           "Été",
                                           "Automne",
                                           "Hiver"
                                       ],
                           "difficulty":  "easy",
                           "masterType":  "collection",
                           "variants":  [
                                            {
                                                "id":  "ajitsuke_tamago_oeufs_marines_ramen",
                                                "label":  "Ajitsuke tamago oeufs marinés ramen"
                                            },
                                            {
                                                "id":  "asperges_mimosa",
                                                "label":  "Asperges mimosa"
                                            },
                                            {
                                                "id":  "beignets_calamar",
                                                "label":  "Beignets de calamar"
                                            },
                                            {
                                                "id":  "bricks_fromage_miel_poires_pecan",
                                                "label":  "Bricks fromage miel poires pecan"
                                            },
                                            {
                                                "id":  "bruschetta_roquefort_noix",
                                                "label":  "Bruschetta roquefort noix"
                                            },
                                            {
                                                "id":  "carpaccio_betterave_mozzarella_yuzu",
                                                "label":  "Carpaccio betterave mozzarella yuzu"
                                            },
                                            {
                                                "id":  "cassolette_crevettes_ravioles_persil",
                                                "label":  "Cassolette de crevettes et ravioles au persil"
                                            },
                                            {
                                                "id":  "chipirons_a_la_plancha",
                                                "label":  "Chipirons à la plancha"
                                            },
                                            {
                                                "id":  "chou_fleur_croustillant",
                                                "label":  "Chou-fleur croustillant"
                                            },
                                            {
                                                "id":  "crudites_maitre",
                                                "label":  "Crudités et salades fraîches"
                                            },
                                            {
                                                "id":  "falafels_four",
                                                "label":  "Falafels au four"
                                            },
                                            {
                                                "id":  "houmous_hakocem",
                                                "label":  "Houmous tahine tres cremeux"
                                            },
                                            {
                                                "id":  "legumes_rotis",
                                                "label":  "Légumes rôtis au four"
                                            },
                                            {
                                                "id":  "oeufs_cocotte_chorizo",
                                                "label":  "Oeufs cocotte chorizo"
                                            },
                                            {
                                                "id":  "oeufs_meurette_faciles",
                                                "label":  "Oeufs en meurette faciles"
                                            },
                                            {
                                                "id":  "oeufs_mimosa_variantes",
                                                "label":  "Œufs mimosa"
                                            },
                                            {
                                                "id":  "oignons_rotis_thym_miel",
                                                "label":  "Oignons rôtis au thym et au miel"
                                            },
                                            {
                                                "id":  "salade_epinards_clementines_amande_feta",
                                                "label":  "Salade epinards clementines amande feta"
                                            },
                                            {
                                                "id":  "salade_oeufs_durs_mayonnaise_bistrot",
                                                "label":  "Salade oeufs durs mayonnaise"
                                            },
                                            {
                                                "id":  "salade_pois_chiche_feta_olives",
                                                "label":  "Salade pois chiches feta olives"
                                            },
                                            {
                                                "id":  "salade_pois_chiches_thon_poivrons",
                                                "label":  "Salade pois chiches thon poivrons"
                                            },
                                            {
                                                "id":  "samoussas_boeuf_epinards_petits_pois",
                                                "label":  "Samoussas boeuf epinards petits pois"
                                            },
                                            {
                                                "id":  "salade_caprese",
                                                "label":  "Tomate mozzarella basilic"
                                            },
                                            {
                                                "id":  "tomates_maitre",
                                                "label":  "Tomates préparées"
                                            },
                                            {
                                                "id":  "veloute_hiver_noix_cajou",
                                                "label":  "Veloute d\u0027hiver noix de cajou"
                                            },
                                            {
                                                "id":  "brochettes_melon_epice",
                                                "label":  "Brochettes de melon epice"
                                            },
                                            {
                                                "id":  "tomates_cocktail_thon_mascarpone",
                                                "label":  "Tomates cocktail farcies au mascarpone, thon et ciboulette"
                                            }
                                        ],
                           "ingredients":  [
                                               {
                                                   "group":  "Variantes",
                                                   "items":  [
                                                                 "Choisir une variante pour afficher les recettes."
                                                             ]
                                               }
                                           ],
                           "steps":  [
                                         "Choisir une variante pour afficher les ingrédients et les étapes."
                                     ],
                           "notes":  [
                                         "Fiche parent de navigation. Les recettes restent conservées dans leurs variantes."
                                     ]
                       },
    "crumble_pomme_poire":  {
                                "title":  "Crumble pomme-poire",
                                "master":  "desserts_maitre",
                                "image":  "/assets/recipe-images-optimized/crumble_pomme_poire.jpg",
                                "categories":  [
                                                   "Desserts"
                                               ],
                                "seasons":  [
                                                "Automne",
                                                "Hiver"
                                            ],
                                "difficulty":  "easy",
                                "difficultyScore":  2,
                                "yield":  "2 personnes",
                                "aliases":  [
                                                "crumble pomme poire",
                                                "crumble aux pommes et poires",
                                                "dessert pomme poire"
                                            ],
                                "tags":  [
                                             "crumble",
                                             "pomme",
                                             "poire",
                                             "dessert"
                                         ],
                                "ingredients":  [
                                                    {
                                                        "group":  "Fruits",
                                                        "items":  [
                                                                      "1 pomme",
                                                                      "1 poire"
                                                                  ]
                                                    },
                                                    {
                                                        "group":  "Pâte à crumble",
                                                        "items":  [
                                                                      "50g de beurre salé en pommade",
                                                                      "50g de sucre",
                                                                      "30g de farine",
                                                                      "30g de poudre de noisette ou de poudre d’amande"
                                                                  ]
                                                    }
                                                ],
                                "steps":  [
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
                                "notes":  [
                                              "Le beurre doit être pommade, pas fondu, pour obtenir un crumble bien sableux.",
                                              "Beurre légèrement le plat à gratin avant d’ajouter les fruits le jus caramélisé accroche moins.",
                                              "Surveiller la coloration en fin de cuisson le dessus doit être doré sans brûler.",
                                              "Très bon tiède, nature ou avec une crème anglaise."
                                          ],
                                "technical":  [
                                                  {
                                                      "label":  "Texture",
                                                      "value":  "Travailler la pâte du bout des doigts pour garder des morceaux irréguliers et croustillants."
                                                  },
                                                  {
                                                      "label":  "Cuisson",
                                                      "value":  "180°C, 30 à 35min selon le plat et la taille des fruits."
                                                  }
                                              ]
                            },
    "tiramisu_speculoos":  {
                               "title":  "Tiramisu spéculoos",
                               "master":  "desserts_cuillere_maitre",
                               "image":  "/assets/recipe-images-optimized/tiramisu_speculoos_spooky.jpg",
                               "categories":  [
                                                  "Desserts"
                                              ],
                               "seasons":  [
                                               "Toutes saisons"
                                           ],
                               "difficulty":  "easy",
                               "yield":  "6 portions",
                               "ingredients":  [
                                                   {
                                                       "group":  "Base",
                                                       "items":  [
                                                                     "250g mascarpone",
                                                                     "100g œufs (2 œufs)",
                                                                     "80g sucre",
                                                                     "200g spéculoos",
                                                                     "100g jus d’orange",
                                                                     "30–45g Grand Marnier"
                                                                 ]
                                                   }
                                               ],
                               "steps":  [
                                             "Fouetter jaunes et sucre.",
                                             "Ajouter mascarpone.",
                                             "Monter les blancs et incorporer délicatement.",
                                             "Tremper les spéculoos dans jus d’orange et Grand Marnier.",
                                             "Monter en couches.",
                                             "Réfrigérer 4h minimum."
                                         ],
                               "notes":  [
                                             "Toujours tout peser avant.",
                                             "Respecter les textures pommade, mousse, bec d’oiseau.",
                                             "Ne jamais précipiter la meringue ou les mélanges mousseux."
                                         ],
                               "tags":  [
                                            "tiramisu",
                                            "speculoos",
                                            "rapide"
                                        ],
                               "difficultyScore":  3
                           },
    "cake_tomate_chorizo_feta":  {
                                     "title":  "Cake tomate chorizo feta",
                                     "master":  "apero_maitre",
                                     "image":  "/assets/recipe-images-optimized/cake_tomate_chorizo_feta_spooky.jpg",
                                     "categories":  [
                                                        "Apéro"
                                                    ],
                                     "seasons":  [
                                                     "Printemps",
                                                     "Été",
                                                     "Automne"
                                                 ],
                                     "difficulty":  "easy",
                                     "difficultyScore":  2,
                                     "yield":  "10 parts",
                                     "aliases":  [
                                                     "cake tomate chorizo feta",
                                                     "cake chorizo feta",
                                                     "cake salé tomate chorizo"
                                                 ],
                                     "tags":  [
                                                  "cake",
                                                  "tomate",
                                                  "chorizo",
                                                  "feta",
                                                  "apero"
                                              ],
                                     "ingredients":  [
                                                         {
                                                             "group":  "Appareil",
                                                             "items":  [
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
                                                             "group":  "Garniture",
                                                             "items":  [
                                                                           "100g chorizo coupé en dés",
                                                                           "100g feta émiettée",
                                                                           "90g tomates séchées égouttées et hachées",
                                                                           "50g échalote ciselée",
                                                                           "10g basilic ou persil ciselé"
                                                                       ]
                                                         }
                                                     ],
                                     "steps":  [
                                                   "Préchauffer le four à 180°C et chemiser un moule à cake.",
                                                   "Mélanger farine, levure chimique, sel fin et poivre du moulin.",
                                                   "Fouetter les œufs avec le lait et l’huile d’olive, puis incorporer les poudres sans trop travailler.",
                                                   "Ajouter le chorizo, la feta, les tomates séchées, l’échalote et les herbes.",
                                                   "Verser dans le moule, lisser et cuire 35 à 45min, jusqu’à ce qu’une lame ressorte sèche.",
                                                   "Laisser tiédir 10min dans le moule, puis démouler et refroidir sur grille avant de trancher."
                                               ],
                                     "notes":  [
                                                   "Couper le chorizo et les tomates en petits morceaux pour une répartition régulière.",
                                                   "Égoutter les tomates séchées pour éviter un cake trop gras.",
                                                   "Servir tiède ou froid, en tranches fines pour l’apéro."
                                               ],
                                     "technical":  [
                                                       {
                                                           "label":  "Mélange",
                                                           "value":  "Arrêter dès que la farine disparaît pour garder une mie tendre."
                                                       },
                                                       {
                                                           "label":  "Cuisson",
                                                           "value":  "Si le dessus colore trop vite, couvrir légèrement avec une feuille de papier cuisson."
                                                       }
                                                   ],
                                     "practical":  {
                                                       "equipment":  [
                                                                         "Moule à cake",
                                                                         "Fouet",
                                                                         "Saladier",
                                                                         "Grille"
                                                                     ],
                                                       "storage":  [
                                                                       "3 jours au réfrigérateur en boîte hermétique.",
                                                                       "Réchauffer quelques minutes au four doux ou servir froid."
                                                                   ],
                                                       "mistakes":  [
                                                                        "Ne pas surmélanger l’appareil après ajout de la farine."
                                                                    ],
                                                       "result":  [
                                                                      "Cake salé moelleux, parfumé, avec garniture bien répartie."
                                                                  ]
                                                   }
                                 },
    "creme_amande_citron":  {
                                "title":  "Fond de tarte amande",
                                "master":  "cremes_maitre",
                                "image":  "/assets/recipe-images-optimized/creme_amande_citron_spooky.jpg",
                                "categories":  [
                                                   "Desserts",
                                                   "Base"
                                               ],
                                "seasons":  [
                                                "Toutes saisons"
                                            ],
                                "difficulty":  "easy",
                                "yield":  "1 insert fin de tarte",
                                "ingredients":  [
                                                    {
                                                        "group":  "Base",
                                                        "items":  [
                                                                      "75g beurre mou",
                                                                      "75g sucre",
                                                                      "50g œuf",
                                                                      "75g poudre d’amande",
                                                                      "10g fécule",
                                                                      "2g zeste de citron"
                                                                  ]
                                                    }
                                                ],
                                "steps":  [
                                              "Crèmer beurre et sucre.",
                                              "Ajouter l’œuf.",
                                              "Incorporer poudre d’amande, fécule et zeste.",
                                              "Étaler environ 5mm dans le fond de tarte et cuire jusqu’à coloration moelleuse."
                                          ],
                                "notes":  [
                                              "Base moelleuse pour tartes aux fruits ou citron."
                                          ],
                                "tags":  [
                                             "creme",
                                             "amande",
                                             "garniture"
                                         ],
                                "difficultyScore":  3,
                                "aliases":  [
                                                "crème d’amande",
                                                "creme amande"
                                            ],
                                "additionalMasters":  [
                                                          "elements_base_maitre"
                                                      ]
                            },
    "meringue_italienne":  {
                               "title":  "Meringue italienne",
                               "master":  "cremes_maitre",
                               "image":  "/assets/recipe-images-optimized/meringue_italienne_spooky.jpg",
                               "categories":  [
                                                  "Desserts",
                                                  "Base"
                                              ],
                               "seasons":  [
                                               "Toutes saisons"
                                           ],
                               "difficulty":  "medium",
                               "yield":  "Décor pour 1 tarte",
                               "ingredients":  [
                                                   {
                                                       "group":  "Base",
                                                       "items":  [
                                                                     "60g blancs d’œufs",
                                                                     "100g sucre",
                                                                     "30g eau",
                                                                     "1g sel",
                                                                     "2g jus de citron"
                                                                 ]
                                                   }
                                               ],
                               "steps":  [
                                             "Cuire sucre, eau et jus de citron à 118–120°C.",
                                             "Monter les blancs mousseux avec le sel.",
                                             "Verser le sirop en filet sur les blancs.",
                                             "Fouetter 5–10min jusqu’à refroidissement, texture lisse, brillante et ferme."
                                         ],
                               "notes":  [
                                             "Verser le sirop lentement.",
                                             "Fouetter jusqu’à refroidissement complet pour une bonne stabilité."
                                         ],
                               "tags":  [
                                            "meringue",
                                            "italienne",
                                            "base",
                                            "patisserie"
                                        ],
                               "difficultyScore":  6,
                               "additionalMasters":  [
                                                         "elements_base_maitre"
                                                     ]
                           },
    "apero_maitre":  {
                         "title":  "Apéro",
                         "image":  "/assets/recipe-images-optimized/parent_apero.jpg",
                         "categories":  [
                                            "Apéro"
                                        ],
                         "seasons":  [
                                         "Printemps",
                                         "Été",
                                         "Automne",
                                         "Hiver"
                                     ],
                         "variants":  [
                                          {
                                              "id":  "aioli_citronne_leger",
                                              "label":  "Aïoli citronné léger"
                                          },
                                          {
                                              "id":  "beignets_calamar",
                                              "label":  "Beignets de calamar"
                                          },
                                          {
                                              "id":  "beurre_ail",
                                              "label":  "Beurre à l’ail"
                                          },
                                          {
                                              "id":  "billes_mozzarella_marinees",
                                              "label":  "Billes de mozzarella marinées"
                                          },
                                          {
                                              "id":  "brie_farci_fruits_secs_noix",
                                              "label":  "Brie farci aux fruits secs et noix"
                                          },
                                          {
                                              "id":  "brochettes_crevettes_chorizo",
                                              "label":  "Brochettes crevettes chorizo"
                                          },
                                          {
                                              "id":  "bruschetta_roquefort_noix",
                                              "label":  "Bruschetta roquefort noix"
                                          },
                                          {
                                              "id":  "cake_sale_lardon",
                                              "label":  "Cake salé poitrine fumée"
                                          },
                                          {
                                              "id":  "cake_tomate_chorizo_feta",
                                              "label":  "Cake tomate chorizo feta"
                                          },
                                          {
                                              "id":  "chorizo_au_cidre",
                                              "label":  "Chorizo au cidre"
                                          },
                                          {
                                              "id":  "chou_fleur_croustillant",
                                              "label":  "Chou-fleur croustillant"
                                          },
                                          {
                                              "id":  "cookies_sales_variantes",
                                              "label":  "Cookies salés"
                                          },
                                          {
                                              "id":  "falafels_four",
                                              "label":  "Falafels au four"
                                          },
                                          {
                                              "id":  "gressins_fromage_olives",
                                              "label":  "Gressins fromage olives"
                                          },
                                          {
                                              "id":  "houmous_hakocem",
                                              "label":  "Houmous tahine tres cremeux"
                                          },
                                          {
                                              "id":  "mojitos_variantes",
                                              "label":  "Mojitos"
                                          },
                                          {
                                              "id":  "oeufs_cocotte_chorizo",
                                              "label":  "Oeufs cocotte chorizo"
                                          },
                                          {
                                              "id":  "oeufs_mimosa_variantes",
                                              "label":  "Œufs mimosa"
                                          },
                                          {
                                              "id":  "pain_grille_beurre_ail_herbes",
                                              "label":  "Pain grillé beurre ail et herbes"
                                          },
                                          {
                                              "id":  "pate_lapin_piment_espelette",
                                              "label":  "Pâté de lapin au piment d’Espelette"
                                          },
                                          {
                                              "id":  "pate_legere_beignets_calamar_crevettes",
                                              "label":  "Pâte légère à frire"
                                          },
                                          {
                                              "id":  "pesto_tomates_sechees_sans_cajou",
                                              "label":  "Pesto tomates séchées"
                                          },
                                          {
                                              "id":  "rillettes_porc",
                                              "label":  "Rillettes de porc"
                                          },
                                          {
                                              "id":  "rillettes_poulet",
                                              "label":  "Rillettes de poulet"
                                          },
                                          {
                                              "id":  "samoussas_boeuf_epinards_petits_pois",
                                              "label":  "Samoussas boeuf epinards petits pois"
                                          },
                                          {
                                              "id":  "sauce_yaourt_citronnee",
                                              "label":  "Sauce yaourt citronnée"
                                          },
                                          {
                                              "id":  "tempura_beignets_calamar_crevettes",
                                              "label":  "Tempura"
                                          },
                                          {
                                              "id":  "terrine_campagne",
                                              "label":  "Terrine de campagne"
                                          },
                                          {
                                              "id":  "terrine_porc_pistaches",
                                              "label":  "Terrine de porc aux pistaches"
                                          },
                                          {
                                              "id":  "tomates_variantes",
                                              "label":  "Tomates confites et séchées"
                                          },
                                          {
                                              "id":  "brochettes_melon_epice",
                                              "label":  "Brochettes de melon epice"
                                          },
                                          {
                                              "id":  "croquettes_pommes_de_terre",
                                              "label":  "Croquettes de pommes de terre"
                                          },
                                          {
                                              "id":  "tomates_cocktail_thon_mascarpone",
                                              "label":  "Tomates cocktail farcies au mascarpone, thon et ciboulette"
                                          }
                                      ],
                         "technical":  [
                                           {
                                               "label":  "Organisation",
                                               "value":  "Regroupe les recettes faciles à partager avant le repas."
                                           }
                                       ],
                         "difficulty":  "easy",
                         "ingredients":  [

                                         ],
                         "steps":  [

                                   ],
                         "notes":  [

                                   ]
                     },
    "cookies_chocolat_blanc_cranberry":  {
                                             "title":  "Cookies chocolat blanc cranberry",
                                             "master":  "cookies_sucres_maitre",
                                             "image":  "/assets/recipe-images-optimized/cookies_chocolat_blanc_cranberry_spooky.jpg",
                                             "categories":  [
                                                                "Desserts"
                                                            ],
                                             "seasons":  [
                                                             "Automne",
                                                             "Hiver"
                                                         ],
                                             "difficulty":  "easy",
                                             "yield":  "18 cookies",
                                             "aliases":  [
                                                             "white chocolate cranberry cookies",
                                                             "cookies cranberry chocolat blanc"
                                                         ],
                                             "ingredients":  [
                                                                 {
                                                                     "group":  "Pâte",
                                                                     "items":  [
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
                                                                     "group":  "Garniture",
                                                                     "items":  [
                                                                                   "120g chocolat blanc concassé",
                                                                                   "90g cranberries séchées"
                                                                               ]
                                                                 }
                                                             ],
                                             "steps":  [
                                                           "Crémer le beurre mou avec les sucres.",
                                                           "Ajouter l’œuf et la vanille, puis mélanger jusqu’à homogénéité.",
                                                           "Incorporer farine, bicarbonate et sel sans trop travailler.",
                                                           "Ajouter chocolat blanc et cranberries.",
                                                           "Former des boules et laisser reposer au froid au moins 30min.",
                                                           "Cuire 10 à 12min à 175°C, jusqu’à bords pris et centre encore moelleux.",
                                                           "Laisser figer quelques minutes sur plaque avant de déplacer."
                                                       ],
                                             "notes":  [
                                                           "Pour des cookies épais, cuire la pâte bien froide.",
                                                           "Si tu utilises un arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil."
                                                       ],
                                             "tags":  [
                                                          "cookies",
                                                          "chocolat blanc",
                                                          "cranberry",
                                                          "gouter"
                                                      ],
                                             "difficultyScore":  3,
                                             "additionalMasters":  [
                                                                       "desserts_maitre"
                                                                   ]
                                         },
    "sauces_maitre":  {
                          "title":  "Sauces",
                          "image":  "/assets/recipe-images-optimized/parent_sauces.jpg",
                          "categories":  [
                                             "Sauces"
                                         ],
                          "seasons":  [
                                          "Toutes saisons"
                                      ],
                          "variants":  [
                                           {
                                               "id":  "beurre_d_escargot_persille",
                                               "label":  "Beurre d’escargot persillé"
                                           },
                                           {
                                               "id":  "coulis_maitre",
                                               "label":  "Coulis"
                                           },
                                           {
                                               "id":  "sauce_chevre_creme",
                                               "label":  "Sauce chevre creme"
                                           },
                                           {
                                               "id":  "sauce_mornay",
                                               "label":  "Sauce Mornay"
                                           },
                                           {
                                               "id":  "sauce_roquefort",
                                               "label":  "Sauce roquefort"
                                           },
                                           {
                                               "id":  "sauce_yaourt_citronnee",
                                               "label":  "Sauce yaourt citronnée"
                                           },
                                           {
                                               "id":  "sauces_burger_variantes",
                                               "label":  "Sauces burger"
                                           },
                                           {
                                               "id":  "sauces_assaisonnements_maitre",
                                               "label":  "Sauces, pestos et assaisonnements"
                                           },
                                           {
                                               "id":  "toppings_frites",
                                               "label":  "Toppings frites"
                                           }
                                       ],
                          "ingredients":  [
                                              {
                                                  "group":  "Variantes",
                                                  "items":  [
                                                                "Choisir une sauce dans la fiche."
                                                            ]
                                              }
                                          ],
                          "steps":  [
                                        "Sélectionner la sauce voulue dans les cartes de recettes."
                                    ],
                          "notes":  [
                                        "Fiche parent pour les sauces, pestos, marinades et assaisonnements."
                                    ]
                      },
    "cookies_sucres_maitre":  {
                                  "title":  "Cookies sucrés",
                                  "master":  "biscuits_gouters_maitre",
                                  "image":  "/assets/recipe-images-optimized/cookies_spooky.jpg",
                                  "categories":  [
                                                     "Desserts"
                                                 ],
                                  "seasons":  [
                                                  "Toutes saisons"
                                              ],
                                  "variants":  [
                                                   {
                                                       "id":  "cookies_beurre_noisette_chocolat_noir_lait",
                                                       "label":  "Cookies au beurre noisette chocolat noir/lait"
                                                   },
                                                   {
                                                       "id":  "cookies_chocolat_noir_lait",
                                                       "label":  "Cookies au chocolat noir/lait"
                                                   },
                                                   {
                                                       "id":  "caramel_cheesecake_cookies",
                                                       "label":  "Cookies caramel cheesecake"
                                                   },
                                                   {
                                                       "id":  "cookies_cerise_chocolat",
                                                       "label":  "Cookies cerise chocolat"
                                                   },
                                                   {
                                                       "id":  "cookies_chocolat_blanc_cranberry",
                                                       "label":  "Cookies chocolat blanc cranberry"
                                                   },
                                                   {
                                                       "id":  "cookies_chocolat_moelleux",
                                                       "label":  "Cookies chocolat moelleux"
                                                   },
                                                   {
                                                       "id":  "cookies_chocolat_noix",
                                                       "label":  "Cookies moelleux aux pépites de chocolat et noix"
                                                   }
                                               ],
                                  "ingredients":  [
                                                      {
                                                          "group":  "Variantes",
                                                          "items":  [
                                                                        "Choisir une recette de cookies sucrés."
                                                                    ]
                                                      }
                                                  ],
                                  "steps":  [
                                                "Sélectionner la recette de cookies voulue."
                                            ],
                                  "notes":  [
                                                "Fiche parent pour garder les cookies sucrés ensemble sans les mélanger aux cookies salés."
                                            ]
                              },
    "cookies_chocolat_noir_lait":  {
                                       "title":  "Cookies au chocolat noir/lait",
                                       "master":  "cookies_sucres_maitre",
                                       "image":  "/assets/recipe-images-optimized/cookies_chocolat_noir_lait_spooky.jpg",
                                       "categories":  [
                                                          "Desserts"
                                                      ],
                                       "seasons":  [
                                                       "Toutes saisons"
                                                   ],
                                       "difficulty":  "easy",
                                       "difficultyScore":  3,
                                       "yield":  "environ 20 cookies",
                                       "aliases":  [
                                                       "cookies chocolat classiques",
                                                       "cookies chocolat noir lait",
                                                       "cookies aux deux chocolats",
                                                       "cookies chocolat"
                                                   ],
                                       "tags":  [
                                                    "cookies",
                                                    "chocolat",
                                                    "gouter"
                                                ],
                                       "ingredients":  [
                                                           {
                                                               "group":  "Pâte",
                                                               "items":  [
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
                                                               "group":  "Chocolat",
                                                               "items":  [
                                                                             "190g chocolat au lait",
                                                                             "190g chocolat noir"
                                                                         ]
                                                           }
                                                       ],
                                       "steps":  [
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
                                       "notes":  [
                                                     "Ne fais pas fondre le beurre il doit rester pommade, souple et crémeux.",
                                                     "Ne travaille pas trop la pâte après l’ajout de la farine.",
                                                     "Le repos au froid aide les cookies à garder une belle épaisseur.",
                                                     "Pour des cookies moelleux, ne dépasse pas 10min de cuisson.",
                                                     "Les cookies cuits se conservent plusieurs jours dans une boîte hermétique.",
                                                     "La pâte crue peut être congelée en boudins ou en boules pour une cuisson ultérieure."
                                                 ],
                                       "technical":  [
                                                         {
                                                             "label":  "Beurre pommade",
                                                             "value":  "Il doit s’écraser facilement à la spatule, sans être liquide."
                                                         },
                                                         {
                                                             "label":  "Repos",
                                                             "value":  "Une nuit au réfrigérateur fonctionne aussi et donne une pâte plus ferme."
                                                         }
                                                     ],
                                       "additionalMasters":  [
                                                                 "desserts_maitre"
                                                             ]
                                   },
    "pates_tarte_variantes":  {
                                  "title":  "Pâtes à tarte",
                                  "master":  "elements_base_maitre",
                                  "image":  "/assets/recipe-images-optimized/pates_tarte_variantes_photo_v2_spooky.jpg",
                                  "categories":  [
                                                     "Base"
                                                 ],
                                  "seasons":  [
                                                  "Toutes saisons"
                                              ],
                                  "yield":  "1 fond de tarte",
                                  "ingredients":  [
                                                      {
                                                          "group":  "Variante pâte brisée beurre",
                                                          "items":  [
                                                                        "300g farine",
                                                                        "115g beurre froid",
                                                                        "60ml eau glacée",
                                                                        "12g sucre",
                                                                        "1/4 c. à café sel"
                                                                    ],
                                                          "steps":  [
                                                                        "Sabler farine, sucre, sel et beurre froid du bout des doigts.",
                                                                        "Ajouter l eau glacee juste assez pour rassembler la pate sans la petrir.",
                                                                        "Former un disque, refroidir 30min, foncer puis cuire a blanc selon la garniture."
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Variante biscuit graham",
                                                          "items":  [
                                                                        "125g biscuits graham émiettés",
                                                                        "60g beurre fondu",
                                                                        "50g sucre"
                                                                    ],
                                                          "steps":  [
                                                                        "Melanger biscuits graham emiettes, sucre et beurre fondu.",
                                                                        "Tasser fermement dans le moule en remontant sur les bords.",
                                                                        "Refroidir 20min ou precuire 8 a 10min a 170C pour une base plus solide."
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Variante oreo",
                                                          "items":  [
                                                                        "200g biscuits Oreo écrasés",
                                                                        "75g beurre fondu"
                                                                    ],
                                                          "steps":  [
                                                                        "Melanger les Oreo ecrases avec le beurre fondu.",
                                                                        "Tasser en couche reguliere dans le moule ou le cercle.",
                                                                        "Refroidir 20min ou precuire 8min a 170C si la garniture est humide."
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Variante amande",
                                                          "items":  [
                                                                        "140g poudre d’amande",
                                                                        "60g beurre fondu",
                                                                        "12g sucre",
                                                                        "1/4 c. à café sel"
                                                                    ],
                                                          "steps":  [
                                                                        "Melanger poudre d amande, sucre, sel et beurre fondu.",
                                                                        "Tasser la pate dans le moule en epaisseur reguliere.",
                                                                        "Refroidir 20min puis precuire 8 a 12min a 170C jusqu a legere coloration."
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Variante shortbread",
                                                          "items":  [
                                                                        "125g farine",
                                                                        "60g beurre",
                                                                        "30g sucre glace",
                                                                        "vanille selon goût ou arôme vanille selon dosage indiqué sur la bouteille"
                                                                    ],
                                                          "steps":  [
                                                                        "Cremer beurre, sucre glace et vanille, puis incorporer la farine sans trop travailler.",
                                                                        "Tasser ou etaler dans le moule, puis refroidir 30min.",
                                                                        "Cuire a blanc a 170C jusqu a blond dore avant de garnir."
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Variante cheddar salée",
                                                          "items":  [
                                                                        "250g farine",
                                                                        "90g cheddar râpé",
                                                                        "60g beurre",
                                                                        "1/4 c. à café sel",
                                                                        "45ml eau glacée"
                                                                    ],
                                                          "steps":  [
                                                                        "Sabler farine, sel, beurre et cheddar rape.",
                                                                        "Ajouter l eau glacee progressivement pour former une pate souple.",
                                                                        "Refroidir 30min, foncer puis precuire jusqu a legere coloration avant garniture salee."
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Variante pâte sucrée",
                                                          "items":  [
                                                                        "250g farine T55",
                                                                        "150g beurre souple",
                                                                        "95g sucre glace",
                                                                        "30g poudre d’amandes ou de noisettes",
                                                                        "60g œuf",
                                                                        "2 pincées sel fin"
                                                                    ],
                                                          "steps":  [
                                                                        "Assouplir le beurre, puis mélanger avec sucre glace, poudre d’amandes, œuf et sel.",
                                                                        "Ajouter la farine et mélanger lentement juste assez pour l’incorporer.",
                                                                        "Étaler entre deux feuilles sur 2 à 3mm, refroidir au moins 1h, foncer puis cuire à 170°C selon la tarte."
                                                                    ]
                                                      }
                                                  ],
                                  "steps":  [
                                                "Choisir une variante et mélanger les éléments secs.",
                                                "Incorporer le beurre ou le liant jusqu’à obtenir une texture sableuse ou compacte selon la variante.",
                                                "Foncer le moule, réfrigérer 30min, puis cuire à blanc selon la garniture prévue."
                                            ],
                                  "notes":  [
                                                "Adapter la cuisson à la garniture précuire pour une crème froide, cuire avec la garniture pour une tarte cuite.",
                                                "Si tu utilises un arôme vanille, suis le dosage indiqué sur la bouteille les arômes ne se dosent pas tous pareil.",
                                                "Conservation pâte crue filmée 24–48h au réfrigérateur ou 2 mois au congélateur fond cuit refroidi en boîte hermétique 2–3 jours au sec."
                                            ],
                                  "tags":  [
                                               "pate",
                                               "tarte",
                                               "base",
                                               "fond de tarte"
                                           ],
                                  "difficultyScore":  4,
                                  "aliases":  [
                                                  "pate a tarte",
                                                  "fond de tarte",
                                                  "pate brisee",
                                                  "pate sucree"
                                              ],
                                  "variantGroups":  true
                              },
    "bouillabaisse_rouille":  {
                                  "title":  "Bouillabaisse",
                                  "master":  "plats_maitre",
                                  "image":  "/assets/recipe-images-optimized/bouillabaisse_rouille_v4_spooky.jpg",
                                  "categories":  [
                                                     "Plats"
                                                 ],
                                  "seasons":  [
                                                  "Toutes saisons"
                                              ],
                                  "difficulty":  "hard",
                                  "difficultyScore":  8,
                                  "yield":  "8 personnes",
                                  "aliases":  [
                                                  "bouillabaisse",
                                                  "soupe de poisson rouille",
                                                  "bouillabaisse haut de gamme",
                                                  "bouillabaisse rouille"
                                              ],
                                  "tags":  [
                                               "poisson",
                                               "bouillabaisse",
                                               "rouille",
                                               "fenouil",
                                               "safran"
                                           ],
                                  "ingredients":  [
                                                      {
                                                          "group":  "Poissons",
                                                          "items":  [
                                                                        "2 daurades royales",
                                                                        "2 rougets barbets",
                                                                        "2 rascasses de ligne"
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Base aromatique",
                                                          "items":  [
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
                                                          "group":  "Liquides",
                                                          "items":  [
                                                                        "200g de jus de moules",
                                                                        "125g de Pernod",
                                                                        "500g de fumet de poisson",
                                                                        "1,5 L de vin blanc"
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Garniture",
                                                          "items":  [
                                                                        "Pommes de terre",
                                                                        "Fenouils",
                                                                        "Rouille",
                                                                        "Piment d’Espelette",
                                                                        "Basilic nain",
                                                                        "Huile d’olive pour service"
                                                                    ],
                                                          "recipeId":  "rouille_haut_de_gamme"
                                                      },
                                                      {
                                                          "group":  "Fenouils au curry",
                                                          "items":  [
                                                                        "Jus de citron",
                                                                        "Sel",
                                                                        "Curry en poudre",
                                                                        "Huile d’olive pour les fenouils"
                                                                    ]
                                                      }
                                                  ],
                                  "steps":  [
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
                                  "notes":  [
                                                "Préparer la \u003cspan data-goto=\"rouille_haut_de_gamme\"\u003erouille\u003c/span\u003e à part pour garder une texture nette au service.",
                                                "Le bouillon doit être très chaud pour terminer la cuisson des tranches de poisson dans l’assiette.",
                                                "Pour des morceaux épais, pocher quelques minutes dans le bouillon à 80-85°C avant dressage.",
                                                "Le Pernod doit soutenir la note anisée du fenouil sans dominer le poisson."
                                            ],
                                  "technical":  [
                                                    {
                                                        "label":  "Bouillon",
                                                        "value":  "Colorer les arêtes avant déglaçage pour donner du relief."
                                                    },
                                                    {
                                                        "label":  "Safran",
                                                        "value":  "L’infuser hors forte ébullition pour éviter une note médicinale."
                                                    },
                                                    {
                                                        "label":  "Service",
                                                        "value":  "Servir en assiette chaude avec bouillon brûlant et garnitures séparées."
                                                    }
                                                ]
                              },
    "cassolette_crevettes_ravioles_persil":  {
                                                 "title":  "Cassolette de crevettes et ravioles au persil",
                                                 "master":  "plats_maitre",
                                                 "image":  "/assets/recipe-images-optimized/cassolette_crevettes_ravioles_persil.jpg",
                                                 "categories":  [
                                                                    "Plats",
                                                                    "Entrées"
                                                                ],
                                                 "seasons":  [
                                                                 "Automne",
                                                                 "Hiver"
                                                             ],
                                                 "difficulty":  "medium",
                                                 "difficultyScore":  5,
                                                 "yield":  "4 personnes",
                                                 "aliases":  [
                                                                 "cassolette crevettes ravioles",
                                                                 "ravioles au persil crevettes",
                                                                 "bisque crémée crevettes"
                                                             ],
                                                 "tags":  [
                                                              "crevettes",
                                                              "ravioles",
                                                              "bisque",
                                                              "gratin"
                                                          ],
                                                 "ingredients":  [
                                                                     {
                                                                         "group":  "Crevettes",
                                                                         "items":  [
                                                                                       "500g de grosses crevettes crues décortiquées",
                                                                                       "Carapaces et têtes des crevettes, si disponibles",
                                                                                       "1 filet d\u0027huile d\u0027olive",
                                                                                       "Sel",
                                                                                       "Poivre du moulin"
                                                                                   ]
                                                                     },
                                                                     {
                                                                         "group":  "Ravioles",
                                                                         "items":  [
                                                                                       "4 plaques de ravioles au persil",
                                                                                       "Eau salée",
                                                                                       "Un peu de beurre ou d\u0027huile neutre pour éviter qu\u0027elles collent après cuisson"
                                                                                   ]
                                                                     },
                                                                     {
                                                                         "group":  "Bisque crémée",
                                                                         "items":  [
                                                                                       "1 échalote émincée",
                                                                                       "1 petite carotte en dés",
                                                                                       "1 c. à soupe de concentré de tomate",
                                                                                       "5cl de cognac ou armagnac",
                                                                                       "12cl de vin blanc sec",
                                                                                       "25cl de fumet de poisson ou bouillon de crustacés",
                                                                                       "15cl de crème liquide entière",
                                                                                       "1 pincée de piment d\u0027Espelette",
                                                                                       "1 petite branche de thym",
                                                                                       "1 feuille de laurier"
                                                                                   ]
                                                                     },
                                                                     {
                                                                         "group":  "Gratin",
                                                                         "items":  [
                                                                                       "30g de parmesan râpé finement",
                                                                                       "20g de chapelure fine ou panko",
                                                                                       "15g de beurre froid en petits dés"
                                                                                   ]
                                                                     },
                                                                     {
                                                                         "group":  "Finition",
                                                                         "items":  [
                                                                                       "Zeste très fin de citron jaune ou vert",
                                                                                       "Une pointe de piment d\u0027Espelette, facultatif"
                                                                                   ]
                                                                     }
                                                                 ],
                                                 "steps":  [
                                                               "Mettre les plaques de ravioles au persil au congélateur 15 minutes avant cuisson pour les raffermir.",
                                                               "Chauffer un filet d\u0027huile d\u0027olive dans une casserole, ajouter les carapaces et têtes de crevettes si disponibles, puis faire colorer 4 à 5 minutes à feu vif en les écrasant légèrement.",
                                                               "Ajouter l\u0027échalote, la carotte, le thym et le laurier, puis faire revenir 3 minutes.",
                                                               "Ajouter le concentré de tomate et cuire 1 minute.",
                                                               "Verser le cognac ou l\u0027armagnac, flamber prudemment ou laisser réduire quelques instants.",
                                                               "Ajouter le vin blanc, réduire de moitié, puis verser le fumet de poisson ou le bouillon de crustacés.",
                                                               "Laisser frémir 20 minutes, filtrer en pressant bien les carapaces, puis remettre le jus filtré dans la casserole.",
                                                               "Ajouter la crème liquide et le piment d\u0027Espelette, puis réduire doucement jusqu\u0027à obtenir une sauce nappante. Rectifier en sel et poivre du moulin.",
                                                               "Porter une grande casserole d\u0027eau salée à frémissement, sans gros bouillon.",
                                                               "Cuire les plaques de ravioles 45 secondes à 1 minute maximum, une par une, puis les retirer délicatement avec une écumoire large.",
                                                               "Déposer les ravioles sur une assiette légèrement beurrée ou huilée pour éviter qu\u0027elles collent.",
                                                               "Saisir les crevettes dans une poêle bien chaude avec un filet d\u0027huile d\u0027olive, 45 secondes à 1 minute par face selon leur taille. Saler, ajouter du poivre du moulin et retirer aussitôt.",
                                                               "Déposer une plaque de ravioles cuite dans chaque cassolette, ajouter les crevettes et napper de bisque crémée chaude sans noyer la garniture.",
                                                               "Mélanger le parmesan râpé et la chapelure, parsemer les cassolettes, puis ajouter quelques dés de beurre froid.",
                                                               "Passer sous le gril du four 2 à 3 minutes, juste pour dorer légèrement le dessus.",
                                                               "À la sortie du four, ajouter un zeste très fin de citron jaune ou vert et éventuellement une pointe de piment d\u0027Espelette. Servir immédiatement."
                                                           ],
                                                 "notes":  [
                                                               "Les ravioles ne doivent pas cuire dans la sauce elles sont cuites séparément, puis simplement montées dans la cassolette.",
                                                               "Les crevettes doivent rester légèrement nacrées avant le passage sous le gril, sinon elles deviennent fermes.",
                                                               "La sauce doit enrober les ravioles et les crevettes, pas les noyer.",
                                                               "Sans carapaces ni têtes, utilise directement un bon fumet de poisson ou un bouillon de crustacés."
                                                           ],
                                                 "technical":  [
                                                                   {
                                                                       "label":  "Bisque",
                                                                       "value":  "La coloration des carapaces apporte les sucs et la profondeur de goût."
                                                                   },
                                                                   {
                                                                       "label":  "Ravioles",
                                                                       "value":  "Le passage au congélateur les raffermit et limite les déchirures à la cuisson."
                                                                   },
                                                                   {
                                                                       "label":  "Gril",
                                                                       "value":  "Le gratinage doit rester court les ravioles et les crevettes sont déjà cuites."
                                                                   }
                                                               ],
                                                 "additionalMasters":  [
                                                                           "entrees_maitre"
                                                                       ]
                                             },
    "mojitos_variantes":  {
                              "title":  "Mojitos",
                              "master":  "apero_maitre",
                              "image":  "/assets/recipe-images-optimized/mojitos_variantes_v4_spooky.jpg",
                              "categories":  [
                                                 "Apéro"
                                             ],
                              "seasons":  [
                                              "Printemps",
                                              "Été"
                                          ],
                              "difficulty":  "easy",
                              "difficultyScore":  2,
                              "yield":  "6 variantes",
                              "variantGroups":  true,
                              "aliases":  [
                                              "mojito",
                                              "mojitos",
                                              "mojito framboise",
                                              "mojito mangue"
                                          ],
                              "tags":  [
                                           "boisson",
                                           "cocktail",
                                           "mojito",
                                           "apero"
                                       ],
                              "ingredients":  [
                                                  {
                                                      "group":  "Mojito classique",
                                                      "items":  [
                                                                    "20g jus de citron vert",
                                                                    "5g sucre",
                                                                    "50g rhum blanc",
                                                                    "5 à 6 feuilles de menthe",
                                                                    "80 à 120g eau gazeuse",
                                                                    "Glaçons"
                                                                ]
                                                  },
                                                  {
                                                      "group":  "Mojito framboise",
                                                      "items":  [
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
                                                      "group":  "Mojito mangue",
                                                      "items":  [
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
                                                      "group":  "Mojito concombre",
                                                      "items":  [
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
                                                      "group":  "Mojito fruit de la passion",
                                                      "items":  [
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
                                                      "group":  "Mojito rhum ambré",
                                                      "items":  [
                                                                    "20g jus de citron vert",
                                                                    "5g sucre",
                                                                    "50g rhum ambré",
                                                                    "50g eau gazeuse",
                                                                    "5 à 6 feuilles de menthe",
                                                                    "Glaçons"
                                                                ]
                                                  }
                                              ],
                              "steps":  [
                                            "Mettre sucre, citron vert, menthe et fruit éventuel dans le verre.",
                                            "Écraser doucement sans broyer la menthe.",
                                            "Ajouter le rhum, puis remplir de glaçons.",
                                            "Compléter avec eau gazeuse bien froide.",
                                            "Mélanger délicatement de bas en haut et servir immédiatement."
                                        ],
                              "notes":  [
                                            "Écrase doucement la menthe doit parfumer sans devenir amère.",
                                            "Utilise une eau gazeuse très froide pour garder un cocktail vif.",
                                            "Pour une version sans alcool, remplace le rhum par la même quantité d’eau gazeuse ou de ginger beer."
                                        ],
                              "technical":  [
                                                {
                                                    "label":  "Équilibre",
                                                    "value":  "Citron, sucre, menthe et dilution doivent rester nets."
                                                },
                                                {
                                                    "label":  "Service",
                                                    "value":  "Préparer minute pour garder bulles et fraîcheur."
                                                }
                                            ]
                          },
    "gaspacho_melon":  {
                           "title":  "Gaspacho de melon",
                           "master":  "crudites_maitre",
                           "image":  "/assets/recipe-images-optimized/gaspacho_melon_spooky.jpg",
                           "categories":  [
                                              "Entrées"
                                          ],
                           "seasons":  [
                                           "Été"
                                       ],
                           "difficulty":  "easy",
                           "difficultyScore":  2,
                           "yield":  "2 petits verres",
                           "nutriScore":  "A",
                           "aliases":  [
                                           "gazpacho melon",
                                           "gaspacho melon sans concombre",
                                           "soupe froide melon"
                                       ],
                           "tags":  [
                                        "gaspacho",
                                        "melon",
                                        "froid",
                                        "ete",
                                        "entree"
                                    ],
                           "ingredients":  [
                                               {
                                                   "group":  "Base",
                                                   "items":  [
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
                                                   "group":  "Finition",
                                                   "items":  [
                                                                 "Filet d’huile d’olive",
                                                                 "Basilic ou menthe ciselée",
                                                                 "Piment d’Espelette pour finition",
                                                                 "Mini-billes de melon"
                                                             ]
                                               }
                                           ],
                           "steps":  [
                                         "Mettre le melon dans un blender avec les tomates, la mie de pain, le jus de citron ou le vinaigre, le sel, le poivre du moulin et le piment.",
                                         "Ajouter quelques feuilles de basilic ou de menthe.",
                                         "Mixer longuement jusqu’à texture lisse.",
                                         "Verser l’huile d’olive en filet pendant que le blender tourne.",
                                         "Ajuster avec un peu d’eau froide ou quelques glaçons si la texture est trop épaisse.",
                                         "Passer au chinois fin pour une texture plus nette.",
                                         "Goûter, ajuster sel, acidité et piment.",
                                         "Réserver au frais au moins 1h et servir très froid."
                                     ],
                           "notes":  [
                                         "Ce gaspacho doit rester fruité, frais et légèrement acidulé, sans goût dominant de tomate.",
                                         "Utilise les chutes de melon de la \u003cspan data-goto=\"salade_melon_mozzarella_jambon_cru\"\u003esalade melon, mozzarella et jambon cru\u003c/span\u003e pour éviter le gaspillage."
                                     ],
                           "technical":  [
                                             {
                                                 "label":  "Équilibre",
                                                 "value":  "Le melon doit dominer, avec tomate et acidité en soutien."
                                             },
                                             {
                                                 "label":  "Texture",
                                                 "value":  "Filtrer pour une bouche plus nette."
                                             }
                                         ]
                       },
    "curry_lentilles_coco":  {
                                 "title":  "Curry de lentilles vertes au lait de coco",
                                 "master":  "plats_maitre",
                                 "image":  "/assets/recipe-images-optimized/curry_lentilles_coco_spooky.jpg",
                                 "categories":  [
                                                    "Plats"
                                                ],
                                 "seasons":  [
                                                 "Automne",
                                                 "Hiver"
                                             ],
                                 "difficulty":  "medium",
                                 "difficultyScore":  5,
                                 "yield":  "4 à 6 personnes",
                                 "nutriScore":  "B",
                                 "aliases":  [
                                                 "curry de lentilles",
                                                 "lentilles vertes lait de coco"
                                             ],
                                 "tags":  [
                                              "curry",
                                              "lentilles",
                                              "coco",
                                              "plat",
                                              "vegetarien"
                                          ],
                                 "ingredients":  [
                                                     {
                                                         "group":  "Lentilles et sauce",
                                                         "items":  [
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
                                                         "group":  "Légumes",
                                                         "items":  [
                                                                       "300g carottes",
                                                                       "200g courgette",
                                                                       "80g épinards frais",
                                                                       "1 citron vert"
                                                                   ]
                                                     },
                                                     {
                                                         "group":  "Épices",
                                                         "items":  [
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
                                                         "group":  "Finition",
                                                         "items":  [
                                                                       "Coriandre fraîche ou basilic thaï",
                                                                       "40g noix de cajou torréfiées",
                                                                       "Huile pimentée douce optionnelle"
                                                                   ]
                                                     },
                                                     {
                                                         "group":  "Riz basmati",
                                                         "items":  [
                                                                       "300g riz basmati",
                                                                       "450ml eau",
                                                                       "5g sel",
                                                                       "Cardamome optionnelle",
                                                                       "Zeste de citron vert"
                                                                   ]
                                                     }
                                                 ],
                                 "steps":  [
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
                                 "notes":  [
                                               "Garde la courgette à part jusqu’à la fin pour qu’elle reste lisible et ne disparaisse pas dans la sauce.",
                                               "Les épices doivent sentir bon mais ne doivent pas brûler.",
                                               "Le citron vert réveille le lait de coco et évite un résultat trop rond.",
                                               "Résultat cible crémeux mais pas lourd, épicé sans agressivité, lentilles entières, légumes lisibles et finition fraîche."
                                           ],
                                 "technical":  [
                                                   {
                                                       "label":  "Texture",
                                                       "value":  "Sauce crémeuse, lentilles entières, légumes identifiables."
                                                   },
                                                   {
                                                       "label":  "Équilibre",
                                                       "value":  "Finir avec citron vert et herbes pour alléger le lait de coco."
                                                   }
                                               ]
                             },
    "pains_burgers_brioche":  {
                                  "title":  "Pains burgers briochés",
                                  "master":  "bases_salees_maitre",
                                  "image":  "/assets/recipe-images-optimized/pains_burgers_brioche_spooky.jpg",
                                  "categories":  [
                                                     "Base"
                                                 ],
                                  "seasons":  [
                                                  "Toutes saisons"
                                              ],
                                  "difficulty":  "medium",
                                  "difficultyScore":  5,
                                  "yield":  "8 pains",
                                  "nutriScore":  "C",
                                  "aliases":  [
                                                  "pain burger brioché",
                                                  "pains burger",
                                                  "buns burger",
                                                  "buns briochés"
                                              ],
                                  "tags":  [
                                               "pain",
                                               "burger",
                                               "buns",
                                               "boulangerie",
                                               "base"
                                           ],
                                  "ingredients":  [
                                                      {
                                                          "group":  "Pâte",
                                                          "items":  [
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
                                                          "group":  "Dorure",
                                                          "items":  [
                                                                        "18g jaune d’œuf (1 jaune)",
                                                                        "15g eau",
                                                                        "1 petite pincée sel optionnelle"
                                                                    ]
                                                      },
                                                      {
                                                          "group":  "Finition",
                                                          "items":  [
                                                                        "Graines de sésame torréfiées",
                                                                        "Ou graines de pavot",
                                                                        "Ou graines de tournesol"
                                                                    ]
                                                      }
                                                  ],
                                  "steps":  [
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
                                  "notes":  [
                                                "Le beurre doit être souple, pas fondu un beurre fondu rend la pâte moins régulière.",
                                                "Évite le contact direct concentré entre sel et levure, qui peut ralentir la pousse.",
                                                "Ne rajoute pas trop de farine si la pâte colle un peu une pâte trop farinée donne des buns secs et denses.",
                                                "Pour un rendu restaurant, toaster les faces coupées à la poêle avec un peu de beurre juste avant montage.",
                                                "Surveille la cuisson tous les fours colorent différemment, et les buns doivent rester moelleux."
                                            ],
                                  "technical":  [
                                                    {
                                                        "label":  "Pousse",
                                                        "value":  "2h première pousse, puis 1h après façonnage."
                                                    },
                                                    {
                                                        "label":  "Cuisson",
                                                        "value":  "200°C chaleur tournante, 10 à 12min."
                                                    },
                                                    {
                                                        "label":  "Conservation",
                                                        "value":  "24h bien emballés ou congélation après refroidissement."
                                                    },
                                                    {
                                                        "label":  "Cible",
                                                        "value":  "Buns ronds, dorés, souples, moelleux et assez solides pour tenir la garniture."
                                                    }
                                                ]
                              },
    "base_pour_flan_sale":  {
                                "title":  "Base pour flan salé",
                                "master":  "elements_base_maitre",
                                "image":  "/assets/recipe-images-optimized/base_pour_flan_sale_spooky.jpg",
                                "categories":  [
                                                   "Base"
                                               ],
                                "seasons":  [
                                                "Printemps",
                                                "Été",
                                                "Automne",
                                                "Hiver"
                                            ],
                                "difficulty":  "easy",
                                "difficultyScore":  2,
                                "yield":  "12 mini-flans",
                                "aliases":  [
                                                "base flan salé",
                                                "mini flans salés",
                                                "appareil à flan salé"
                                            ],
                                "tags":  [
                                             "base",
                                             "flan",
                                             "salé",
                                             "œuf"
                                         ],
                                "ingredients":  [
                                                    {
                                                        "group":  "Base",
                                                        "items":  [
                                                                      "3 œufs",
                                                                      "60g farine",
                                                                      "45g beurre fondu",
                                                                      "150g lait",
                                                                      "2 cuillères à café de moutarde à l\u0027ancienne",
                                                                      "Sel fin",
                                                                      "Poivre du moulin"
                                                                  ]
                                                    }
                                                ],
                                "steps":  [
                                              "Préchauffer le four à 180°C et graisser des empreintes à mini-muffins.",
                                              "Fouetter les œufs avec la farine, puis ajouter le beurre fondu, le lait et la moutarde à l\u0027ancienne.",
                                              "Assaisonner et mélanger sans trop travailler.",
                                              "Répartir dans les empreintes en remplissant aux trois quarts.",
                                              "Cuire environ 15min, jusqu’à ce que les flans soient pris et légèrement dorés.",
                                              "Laisser tiédir quelques minutes avant de démouler."
                                          ],
                                "notes":  [
                                              "La base accepte d’autres garnitures jambon, tomates séchées, olives, herbes, fromage râpé.",
                                              "Garder une garniture bien égouttée pour préserver une texture nette."
                                          ],
                                "technical":  [
                                                  {
                                                      "label":  "Appareil",
                                                      "value":  "Une base lisse évite les paquets de farine dans les petits formats."
                                                  },
                                                  {
                                                      "label":  "Cuisson",
                                                      "value":  "Retirer dès que le centre est pris pour éviter une texture sèche."
                                                  }
                                              ],
                                "practical":  {
                                                  "equipment":  [
                                                                    "Moule à mini-muffins",
                                                                    "Fouet",
                                                                    "Bol verseur"
                                                                ],
                                                  "storage":  [
                                                                  "2 jours au réfrigérateur, réchauffer doucement au four."
                                                              ],
                                                  "mistakes":  [
                                                                   "Évite les garnitures trop humides ou égoutte-les avant de les ajouter.",
                                                                   "Ne surcharge pas les moules les mini-flans doivent rester légers."
                                                               ],
                                                  "result":  [
                                                                 "Mini bouchées salées, moelleuses et faciles à décliner."
                                                             ]
                                              }
                            },
    "cookies_cerise_chocolat":  {
                                    "title":  "Cookies cerise chocolat",
                                    "master":  "cookies_sucres_maitre",
                                    "image":  "/assets/recipe-images-optimized/cookies_cerise_chocolat_spooky.jpg",
                                    "categories":  [
                                                       "Desserts"
                                                   ],
                                    "seasons":  [
                                                    "Toutes saisons"
                                                ],
                                    "difficulty":  "easy",
                                    "difficultyScore":  2,
                                    "yield":  "16 cookies",
                                    "aliases":  [
                                                    "cherry chocolate chip cookies",
                                                    "cookies cerise chocolat",
                                                    "cookies chocolat cerise"
                                                ],
                                    "tags":  [
                                                 "cookies",
                                                 "cerise",
                                                 "chocolat"
                                             ],
                                    "ingredients":  [
                                                        {
                                                            "group":  "Pâte",
                                                            "items":  [
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
                                                            "group":  "Garniture",
                                                            "items":  [
                                                                          "120g pépites de chocolat",
                                                                          "100g cerises séchées hachées"
                                                                      ]
                                                        }
                                                    ],
                                    "steps":  [
                                                  "Crémer le beurre avec la cassonade ou vergeoise et le sucre.",
                                                  "Ajouter l’œuf et la vanille, puis mélanger jusqu’à obtenir une base homogène.",
                                                  "Ajouter farine, cacao, levure et sel.",
                                                  "Incorporer les pépites de chocolat et les cerises séchées.",
                                                  "Former 16 boules et placer 30min au frais.",
                                                  "Cuire 10 à 12min à 180°C, puis laisser reposer sur la plaque avant de déplacer."
                                              ],
                                    "notes":  [
                                                  "Les cerises séchées apportent l’acidité qui équilibre le chocolat.",
                                                  "Pour une version plus gourmande, ajoute quelques morceaux de chocolat noir sur les cookies encore chauds.",
                                                  "Sortir les cookies quand le centre paraît encore tendre."
                                              ],
                                    "technical":  [
                                                      {
                                                          "label":  "Repos",
                                                          "value":  "Le froid limite l’étalement et donne des cookies plus épais."
                                                      },
                                                      {
                                                          "label":  "Cuisson",
                                                          "value":  "Le centre se raffermit hors du four ne pas prolonger inutilement."
                                                      }
                                                  ],
                                    "practical":  {
                                                      "equipment":  [
                                                                        "Robot ou saladier",
                                                                        "Plaque de cuisson",
                                                                        "Papier cuisson"
                                                                    ],
                                                      "storage":  [
                                                                      "4 jours en boîte hermétique.",
                                                                      "Pâte congelable en boules."
                                                                  ],
                                                      "mistakes":  [
                                                                       "Ne cuis pas trop le cacao fait paraître les cookies moins dorés."
                                                                   ],
                                                      "result":  [
                                                                     "Cookies moelleux, chocolatés, avec une note acidulée de cerise."
                                                                 ]
                                                  },
                                    "additionalMasters":  [
                                                              "desserts_maitre",
                                                              "biscuits_gouters_maitre"
                                                          ]
                                },
    "terrine_campagne":  {
                             "title":  "Terrine de campagne",
                             "master":  "apero_maitre",
                             "image":  "/assets/recipe-images-optimized/terrine_campagne_spooky.jpg",
                             "categories":  [
                                                "Apéro"
                                            ],
                             "seasons":  [
                                             "Toutes saisons"
                                         ],
                             "difficulty":  "medium",
                             "difficultyScore":  4,
                             "yield":  "1 terrine",
                             "aliases":  [
                                             "terrine de campagne",
                                             "pâté de campagne",
                                             "terrine porc"
                                         ],
                             "tags":  [
                                          "terrine",
                                          "porc",
                                          "charcuterie"
                                      ],
                             "ingredients":  [
                                                 {
                                                     "group":  "Farce",
                                                     "items":  [
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
                                                     "group":  "Terrine",
                                                     "items":  [
                                                                   "150g crépine ou bardes de lard",
                                                                   "2 feuilles de laurier",
                                                                   "2 branches de thym"
                                                               ]
                                                 }
                                             ],
                             "steps":  [
                                           "Faire mariner les viandes coupées avec cognac, échalote, ail, sel, poivre du moulin et thym pendant 2h au frais.",
                                           "Hacher les viandes avec une grille moyenne.",
                                           "Ajouter les œufs et le persil, puis mélanger jusqu’à obtenir une farce liée.",
                                           "Chemiser la terrine avec crépine ou bardes, remplir avec la farce et lisser.",
                                           "Ajouter laurier et thym sur le dessus, puis couvrir.",
                                           "Cuire au bain-marie à 170°C pendant 1h30 environ.",
                                           "Laisser refroidir sous un léger poids, puis réserver 24h au réfrigérateur avant de trancher."
                                       ],
                             "notes":  [
                                           "Le repos d’une nuit améliore nettement la tenue et le goût.",
                                           "Servir avec cornichons, pain de campagne et moutarde.",
                                           "La terrine doit être cuite à cœur mais rester moelleuse."
                                       ],
                             "technical":  [
                                               {
                                                   "label":  "Farce",
                                                   "value":  "Une farce froide et bien mélangée tranche plus proprement après repos."
                                               },
                                               {
                                                   "label":  "Bain-marie",
                                                   "value":  "L’eau chaude autour de la terrine adoucit la cuisson et limite le dessèchement."
                                               }
                                           ],
                             "practical":  {
                                               "equipment":  [
                                                                 "Terrine",
                                                                 "Hachoir",
                                                                 "Plat à bain-marie",
                                                                 "Sonde"
                                                             ],
                                               "storage":  [
                                                               "4 à 5 jours au réfrigérateur à 0–4°C, bien filmée.",
                                                               "Pour une garde plus longue au frais, couvrir la surface d’une fine couche de saindoux fondu et propre.",
                                                               "Trancher au dernier moment pour éviter le dessèchement."
                                                           ],
                                               "mistakes":  [
                                                                "Évite une farce trop fine la terrine de campagne doit garder une mâche rustique."
                                                            ],
                                               "result":  [
                                                              "Terrine charcutière rustique, parfumée et bien tranchable."
                                                          ]
                                           }
                         },
    "brie_farci_fruits_secs_noix":  {
                                        "title":  "Brie farci aux fruits secs et noix",
                                        "master":  "apero_maitre",
                                        "image":  "/assets/recipe-images-optimized/brie_farci_fruits_secs_noix_spooky.jpg",
                                        "categories":  [
                                                           "Apéro"
                                                       ],
                                        "seasons":  [
                                                        "Automne",
                                                        "Hiver"
                                                    ],
                                        "difficulty":  "easy",
                                        "difficultyScore":  1,
                                        "yield":  "6 personnes",
                                        "aliases":  [
                                                        "brie farci",
                                                        "brie fruits secs",
                                                        "fromage farci noix"
                                                    ],
                                        "tags":  [
                                                     "brie",
                                                     "fromage",
                                                     "noix",
                                                     "fruits secs"
                                                 ],
                                        "ingredients":  [
                                                            {
                                                                "group":  "Fromage",
                                                                "items":  [
                                                                              "1 brie entier moyen"
                                                                          ]
                                                            },
                                                            {
                                                                "group":  "Garniture",
                                                                "items":  [
                                                                              "50g noix variées hachées",
                                                                              "30g fruits secs en petits morceaux",
                                                                              "20g miel",
                                                                              "5g basilic ou persil ciselé"
                                                                          ]
                                                            }
                                                        ],
                                        "steps":  [
                                                      "Mélanger noix, fruits secs, miel et herbes.",
                                                      "Ouvrir le brie déjà préparé en deux disques et étaler la garniture sur la moitié inférieure.",
                                                      "Refermer avec la moitié supérieure et presser très légèrement.",
                                                      "Réfrigérer 30min pour raffermir l’ensemble.",
                                                      "Sortir 10 à 15min avant service, puis couper en quartiers."
                                                  ],
                                        "notes":  [
                                                      "Servir avec pain, crackers ou baguette grillée.",
                                                      "Le miel est optionnel si les fruits secs sont déjà très sucrés.",
                                                      "Hacher les noix assez finement pour obtenir une coupe nette."
                                                  ],
                                        "technical":  [
                                                          {
                                                              "label":  "Repos",
                                                              "value":  "Le froid stabilise la garniture et facilite le service."
                                                          }
                                                      ],
                                        "practical":  {
                                                          "equipment":  [
                                                                            "Couteau long",
                                                                            "Bol",
                                                                            "Planche"
                                                                        ],
                                                          "storage":  [
                                                                          "24h au réfrigérateur, bien filmé.",
                                                                          "Sortir quelques minutes avant service pour retrouver le crémeux."
                                                                      ],
                                                          "mistakes":  [
                                                                           "Ne surcharge pas le centre le brie doit pouvoir se refermer sans déborder."
                                                                       ],
                                                          "result":  [
                                                                         "Brie crémeux, sucré-salé, croquant et prêt à partager."
                                                                     ]
                                                      }
                                    }
});
