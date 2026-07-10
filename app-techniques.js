/* global window */

window.COOK_NOTE_EXTRA_TECHNIQUE_GUIDES = Object.freeze([
  {
    id: 'prechauffer-four',
    title: 'Préchauffer le four',
    label: 'Four',
    description: 'Amener le four à la bonne température avant d’enfourner pour lancer la cuisson au bon rythme.',
    steps: ['Allume le four au moins 10 à 20min avant selon sa taille.', 'Choisis chaleur tournante, statique ou gril comme indiqué.', 'Attends que la température soit stabilisée.', 'Enfourne vite pour limiter la perte de chaleur.'],
    tip: 'Une pâte, un gâteau ou une plaque de légumes enfournés trop tôt cuisent moins régulièrement.',
    query: 'four cuisson gâteau plaque',
    aliases: ['préchauffer', 'prechauffer', 'préchauffer le four', 'prechauffer le four', 'four préchauffé', 'four prechauffe']
  },
  {
    id: 'chauffer-poele',
    title: 'Chauffer une poêle',
    label: 'Cuisson',
    description: 'Mettre la poêle à température avant d’ajouter la matière grasse ou l’aliment pour mieux colorer.',
    steps: ['Pose la poêle sur feu moyen à vif selon la recette.', 'Laisse-la chauffer quelques instants à vide.', 'Ajoute la matière grasse quand la surface est chaude.', 'Dépose l’aliment quand la matière grasse frémit sans brûler.'],
    tip: 'Une poêle trop froide fait rendre de l’eau et empêche la coloration nette.',
    query: 'poêle saisir colorer',
    aliases: ['chauffer la poêle', 'chauffer une poêle', 'poêle chaude', 'poele chaude', 'poêle bien chaude', 'poele bien chaude']
  },
  {
    id: 'faire-fondre',
    title: 'Faire fondre',
    label: 'Cuisson douce',
    description: 'Passer doucement un ingrédient solide à l’état fondu sans le brûler ni le séparer.',
    steps: ['Coupe en morceaux réguliers si besoin.', 'Utilise feu doux, micro-ondes court ou bain-marie selon la fragilité.', 'Remue souvent pour répartir la chaleur.', 'Arrête dès que la texture est fluide.'],
    tip: 'Chocolat, beurre et fromage n’aiment pas les fortes chaleurs : mieux vaut finir avec la chaleur résiduelle.',
    query: 'chocolat beurre fromage',
    aliases: ['faire fondre', 'fondre le chocolat', 'fondre le beurre', 'beurre fondu', 'chocolat fondu']
  },
  {
    id: 'fouetter',
    title: 'Fouetter',
    label: 'Mélange',
    description: 'Mélanger vivement pour homogénéiser, incorporer de l’air ou donner de la tenue à une préparation.',
    steps: ['Choisis un fouet adapté à la taille du bol.', 'Incline légèrement le récipient.', 'Fouette en gardant un rythme régulier.', 'Arrête quand la texture demandée est atteinte.'],
    tip: 'Fouetter trop longtemps peut rendre une crème granuleuse ou faire retomber une préparation fragile.',
    query: 'fouet crème œufs appareil',
    aliases: ['fouetter', 'fouette', 'fouetté', 'fouettée', 'au fouet']
  },
  {
    id: 'mixer',
    title: 'Mixer',
    label: 'Texture',
    description: 'Réduire une préparation en texture lisse, fine ou volontairement rustique avec un mixeur ou un robot.',
    steps: ['Travaille par impulsions pour contrôler la texture.', 'Racle les bords si nécessaire.', 'Ajoute un peu de liquide seulement si la recette le permet.', 'Arrête avant de chauffer ou liquéfier la préparation.'],
    tip: 'Pour une soupe ou une crème très lisse, mixe puis filtre si besoin.',
    query: 'mixeur robot soupe crème',
    aliases: ['mixer', 'mixé', 'mixée', 'mixer finement', 'mixer par impulsions', 'mixeur plongeant']
  },
  {
    id: 'filtrer',
    title: 'Filtrer',
    label: 'Finition',
    description: 'Passer un liquide, une crème ou une sauce pour retirer morceaux, fibres, peaux ou grains.',
    steps: ['Place une passoire fine, un chinois ou une étamine au-dessus d’un récipient.', 'Verse progressivement.', 'Presse légèrement seulement si la recette le permet.', 'Racle le dessous pour récupérer la partie lisse.'],
    tip: 'Filtrer donne une texture plus nette, mais presser trop fort peut apporter de l’amertume ou du trouble.',
    query: 'chinois passoire sauce crème',
    aliases: ['filtrer', 'filtré', 'filtrée', 'passer au chinois', 'passer à la passoire fine', 'passoire fine']
  },
  {
    id: 'egoutter',
    title: 'Égoutter',
    label: 'Préparation',
    description: 'Retirer l’excès d’eau, d’huile ou de jus pour garder une texture nette et éviter de détremper.',
    steps: ['Utilise une passoire, une grille ou du papier selon l’aliment.', 'Laisse s’écouler sans écraser si l’aliment est fragile.', 'Secoue ou tamponne si la recette demande une surface sèche.', 'Transfère seulement quand l’excès de liquide est parti.'],
    tip: 'Préférer une grille au papier pour éviter la vapeur.',
    query: 'égoutter friture légumes ricotta',
    aliases: ['égoutter', 'egoutter', 'égoutté', 'égouttée', 'bien égoutter', 'bien egoutter', 'laisser égoutter']
  },
  {
    id: 'presser',
    title: 'Presser',
    label: 'Préparation',
    description: 'Extraire du jus ou retirer de l’eau d’un ingrédient pour concentrer goût et texture.',
    steps: ['Choisis presse-agrumes, torchon propre, passoire ou main selon l’aliment.', 'Presse progressivement sans éclabousser.', 'Récupère le jus ou jette l’eau selon la recette.', 'Goûte ou pèse si la précision compte.'],
    tip: 'Presser des légumes râpés change beaucoup le croustillant et la tenue.',
    query: 'citron courgette pomme de terre',
    aliases: ['presser', 'pressé', 'pressée', 'presser le citron', 'presser fortement', 'essorer']
  },
  {
    id: 'rectifier-assaisonnement',
    title: 'Rectifier l’assaisonnement',
    label: 'Assaisonnement',
    description: 'Goûter puis ajuster sel, acidité, sucre, épices ou gras pour équilibrer la préparation.',
    steps: ['Goûte avec une cuillère propre.', 'Corrige un seul axe à la fois.', 'Mélange et attends quelques secondes.', 'Goûte à nouveau avant d’ajouter autre chose.'],
    tip: 'Le sel réveille, l’acidité allège, le sucre arrondit et le gras porte les arômes.',
    query: 'sel poivre acidité sucre',
    aliases: ['rectifier l’assaisonnement', 'rectifier assaisonnement', 'ajuster l’assaisonnement', 'corriger l’assaisonnement', 'goûter et ajuster', 'gouter et ajuster']
  },
  {
    id: 'dresser',
    title: 'Dresser',
    label: 'Finition',
    description: 'Installer une préparation sur assiette, plat ou support en contrôlant volume, propreté et lisibilité.',
    steps: ['Prépare les assiettes ou le plat avant le dernier geste chaud.', 'Place les éléments principaux en premier.', 'Ajoute sauce et garnitures sans masquer le sujet.', 'Essuie les bords avant de servir.'],
    tip: 'Un dressage propre est souvent une question de température et d’ordre, pas de décoration excessive.',
    query: 'assiette plat service',
    aliases: ['dresser', 'dressage', 'dresser les assiettes', 'dresser sur assiette']
  },
  {
    id: 'arroser-cuisson',
    title: 'Arroser en cuisson',
    label: 'Cuisson',
    description: 'Ramener jus, beurre ou marinade sur l’aliment pendant la cuisson pour nourrir, parfumer et colorer.',
    steps: ['Incline légèrement le plat ou la poêle.', 'Récupère le jus avec une cuillère.', 'Arrose rapidement la surface.', 'Répète sans ouvrir le four trop longtemps.'],
    tip: 'Arroser aide la coloration, mais trop souvent ouvrir le four ralentit la cuisson.',
    query: 'jus beurre four viande légumes',
    aliases: ['arroser', 'arroser en cuisson', 'arroser régulièrement', 'arroser et remuer']
  },
  {
    id: 'retourner-mi-cuisson',
    title: 'Retourner à mi-cuisson',
    label: 'Cuisson',
    description: 'Changer la face exposée à la chaleur pour obtenir une cuisson et une coloration régulières.',
    steps: ['Attends que la première face soit prise ou colorée.', 'Retourne avec une spatule ou une pince adaptée.', 'Replace les morceaux espacés.', 'Poursuis jusqu’à la texture voulue.'],
    tip: 'Si l’aliment colle, il n’est souvent pas encore prêt à être retourné.',
    query: 'four poêle galette légumes',
    aliases: ['retourner à mi-cuisson', 'retourner a mi-cuisson', 'retourner les morceaux', 'retourner les galettes', 'remuer à mi-cuisson']
  },
  {
    id: 'rotir',
    title: 'Rôtir',
    label: 'Four',
    description: 'Cuire au four ou à chaleur sèche pour concentrer les goûts et obtenir une surface colorée.',
    steps: ['Préchauffe le four.', 'Espace les morceaux pour que l’humidité s’échappe.', 'Ajoute juste assez de matière grasse.', 'Retourne ou arrose selon la recette.'],
    tip: 'Une plaque trop chargée fait cuire à la vapeur au lieu de rôtir.',
    query: 'four légumes viande',
    aliases: ['rôtir', 'rotir', 'rôti', 'rôtie', 'rôtis', 'rôties', 'légumes rôtis', 'legumes rotis']
  },
  {
    id: 'griller',
    title: 'Griller',
    label: 'Cuisson',
    description: 'Colorer vivement par contact direct avec une chaleur forte : gril, barbecue, poêle striée ou four.',
    steps: ['Sèche la surface de l’aliment.', 'Chauffe fortement le support.', 'Huile légèrement l’aliment plutôt que noyer la poêle.', 'Laisse marquer avant de déplacer.'],
    tip: 'Griller demande une surface sèche et une chaleur franche.',
    query: 'gril barbecue pain légumes',
    aliases: ['griller', 'grillé', 'grillée', 'pain grillé', 'toaster', 'toasté', 'toastée']
  },
  {
    id: 'carameliser',
    title: 'Caraméliser',
    label: 'Cuisson',
    description: 'Colorer naturellement sucres ou aliments sucrés pour développer des notes plus profondes.',
    steps: ['Travaille à chaleur moyenne à vive selon la préparation.', 'Laisse le sucre ou les sucs colorer sans brûler.', 'Remue seulement quand nécessaire.', 'Stoppe ou déglace dès que la couleur est atteinte.'],
    tip: 'Plus la couleur fonce, plus l’amertume monte : vise ambré, pas brûlé.',
    query: 'sucre oignon caramel',
    aliases: ['caraméliser', 'carameliser', 'caramélisé', 'caramélisée', 'caramélisation', 'faire caraméliser']
  },
  {
    id: 'confire',
    title: 'Confire',
    label: 'Cuisson douce',
    description: 'Cuire lentement dans gras, sucre, sirop ou jus pour attendrir et concentrer les saveurs.',
    steps: ['Choisis un feu doux et stable.', 'Couvre partiellement si la recette demande de garder l’humidité.', 'Laisse le temps travailler sans forte ébullition.', 'Arrête quand la texture est fondante.'],
    tip: 'Confire n’est pas saisir : la douceur et la durée font le résultat.',
    query: 'tomates ail oignon citron',
    aliases: ['confire', 'confit', 'confite', 'confits', 'confites']
  },
  {
    id: 'braiser',
    title: 'Braiser',
    label: 'Cuisson douce',
    description: 'Cuire longtemps à couvert avec un fond de liquide après coloration pour attendrir une pièce ou des légumes.',
    steps: ['Saisis ou fais revenir l’aliment si la recette le demande.', 'Ajoute une garniture aromatique.', 'Mouille à hauteur partielle.', 'Cuis doucement à couvert jusqu’à tendreté.'],
    tip: 'Un braisage réussi garde peu de bulles et beaucoup de patience.',
    query: 'viande légumes cocotte',
    aliases: ['braiser', 'braisé', 'braisée', 'braisage']
  },
  {
    id: 'rissoler',
    title: 'Rissoler',
    label: 'Cuisson',
    description: 'Colorer de petits morceaux dans une matière grasse pour obtenir une surface dorée et savoureuse.',
    steps: ['Sèche les morceaux.', 'Chauffe la matière grasse.', 'Étale en une seule couche.', 'Remue seulement après coloration.'],
    tip: 'Rissoler fonctionne mal dans une poêle trop pleine : l’eau s’accumule et empêche de dorer.',
    query: 'pommes de terre lardons légumes',
    aliases: ['rissoler', 'rissolé', 'rissolée', 'rissolés', 'rissolées']
  },
  {
    id: 'glacer-legumes',
    title: 'Glacer des légumes',
    label: 'Cuisson',
    description: 'Cuire de petits légumes avec eau, beurre et parfois sucre pour obtenir une brillance nappante.',
    steps: ['Place les légumes en une couche.', 'Ajoute eau à hauteur partielle, beurre, sel et sucre si demandé.', 'Couvre au papier ou au couvercle au début.', 'Découvre et laisse le jus enrober en fin de cuisson.'],
    tip: 'Le glaçage doit briller sans baigner : le liquide final doit être court.',
    query: 'carottes navets petits oignons',
    aliases: ['glacer des légumes', 'glacer les légumes', 'légumes glacés', 'legumes glaces', 'glacer à blanc', 'glacer a blanc']
  },
  {
    id: 'laquer',
    title: 'Laquer',
    label: 'Finition',
    description: 'Appliquer une sauce brillante et concentrée en couches fines pour parfumer et donner un fini satiné.',
    steps: ['Prépare une sauce assez réduite.', 'Badigeonne en couche fine.', 'Passe brièvement au four, au gril ou à la poêle.', 'Répète si nécessaire sans brûler les sucres.'],
    tip: 'Une laque trop liquide coule, une laque trop réduite brûle vite.',
    query: 'miel soja barbecue sauce',
    aliases: ['laquer', 'laqué', 'laquée', 'laquage']
  },
  {
    id: 'nacrer-riz',
    title: 'Nacrer le riz',
    label: 'Riz',
    description: 'Enrober le riz de matière grasse jusqu’à ce qu’il devienne légèrement translucide avant de mouiller.',
    steps: ['Fais revenir l’oignon ou l’échalote si prévu.', 'Ajoute le riz sec.', 'Remue 1 à 2min dans la matière grasse.', 'Mouille quand les grains sont brillants et un peu translucides.'],
    tip: 'Nacrer aide le riz à mieux tenir dans un risotto ou un pilaf.',
    query: 'risotto pilaf riz',
    aliases: ['nacrer', 'nacrer le riz', 'riz nacré', 'riz nacre']
  },
  {
    id: 'mouiller',
    title: 'Mouiller',
    label: 'Sauce',
    description: 'Ajouter un liquide à une base de cuisson, une garniture ou un roux pour créer sauce, bouillon ou cuisson humide.',
    steps: ['Verse le liquide progressivement si la base contient farine ou roux.', 'Mélange pour éviter les grumeaux.', 'Gratte les sucs si la casserole a coloré.', 'Adapte le niveau : court, à hauteur ou complet selon la recette.'],
    tip: 'Mouiller trop vite peut faire des grumeaux ; mouiller trop haut dilue les goûts.',
    query: 'bouillon vin lait sauce',
    aliases: ['mouiller avec', 'mouiller au bouillon', 'mouiller à hauteur', 'mouiller progressivement']
  },
  {
    id: 'porter-ebullition',
    title: 'Porter à ébullition',
    label: 'Cuisson',
    description: 'Amener un liquide à gros bouillons avant de réduire, cuire ou activer une étape précise.',
    steps: ['Chauffe à feu moyen à vif.', 'Surveille les bords puis le centre.', 'Mélange si le liquide contient sucre, lait ou fécule.', 'Baisse dès que l’ébullition demandée est atteinte.'],
    tip: 'Lait, crème et sirops débordent vite : une casserole haute donne plus de marge.',
    query: 'eau lait crème sirop',
    aliases: ['porter à ébullition', 'porter a ebullition', 'porter le lait à ébullition', 'porter la crème à ébullition', 'à ébullition', 'a ebullition']
  },
  {
    id: 'cuire-a-couvert',
    title: 'Cuire à couvert',
    label: 'Cuisson douce',
    description: 'Cuire avec un couvercle pour conserver vapeur, humidité et chaleur autour de l’aliment.',
    steps: ['Baisse le feu après l’ébullition ou la coloration.', 'Pose le couvercle en laissant une petite ouverture si la recette réduit.', 'Contrôle régulièrement le niveau de liquide.', 'Découvre en fin de cuisson si tu dois concentrer.'],
    tip: 'À couvert, l’évaporation baisse : assaisonne et réduis ensuite si nécessaire.',
    query: 'couvercle vapeur cocotte',
    aliases: ['cuire à couvert', 'cuire a couvert', 'à couvert', 'a couvert', 'couvrir et cuire']
  },
  {
    id: 'cuire-a-decouvert',
    title: 'Cuire à découvert',
    label: 'Cuisson',
    description: 'Cuire sans couvercle pour laisser évaporer l’humidité, concentrer les jus ou garder du croustillant.',
    steps: ['Utilise un récipient assez large si tu veux évaporer.', 'Garde un feu adapté pour ne pas attacher.', 'Remue ou arrose selon la préparation.', 'Arrête quand la texture ou le jus est correct.'],
    tip: 'À découvert, le goût se concentre mais la préparation sèche plus vite.',
    query: 'réduction four poêle',
    aliases: ['cuire à découvert', 'cuire a decouvert', 'à découvert', 'a decouvert', 'sans couvercle']
  },
  {
    id: 'piquer-pate',
    title: 'Piquer une pâte',
    label: 'Pâtisserie',
    description: 'Faire de petits trous dans une pâte pour limiter les bulles et les gonflements irréguliers.',
    steps: ['Fonce ou pose la pâte bien froide.', 'Utilise une fourchette ou un pique-vite.', 'Pique régulièrement sans déchirer.', 'Remets au froid si la pâte s’est ramollie.'],
    tip: 'Piquer aide surtout les fonds de tarte, mais ne remplace pas toujours les poids de cuisson.',
    query: 'fond de tarte pâte',
    aliases: ['piquer la pâte', 'piquer le fond', 'piquer à la fourchette', 'pâte piquée', 'pate piquee']
  },
  {
    id: 'dorer-oeuf',
    title: 'Dorer à l’œuf',
    label: 'Pâtisserie',
    description: 'Appliquer une dorure pour obtenir une surface brillante, régulière et appétissante à la cuisson.',
    steps: ['Mélange œuf entier, jaune ou lait selon la dorure voulue.', 'Passe une couche fine au pinceau.', 'Évite les coulures sur les bords feuilletés.', 'Laisse sécher quelques minutes si une seconde couche est prévue.'],
    tip: 'Les coulures de dorure peuvent coller les feuilletages et gêner leur développement.',
    query: 'dorure feuilletage brioche',
    aliases: ['dorer à l’œuf', 'dorer a l oeuf', 'badigeonner de dorure', 'dorure à l’œuf', 'dorure a l oeuf']
  },
  {
    id: 'temperer-chocolat',
    title: 'Tempérer le chocolat',
    label: 'Chocolat',
    description: 'Contrôler les températures du chocolat pour obtenir brillance, cassant et bonne tenue.',
    steps: ['Fais fondre doucement le chocolat.', 'Refroidis en remuant jusqu’à la zone de travail.', 'Réchauffe très légèrement si nécessaire.', 'Utilise rapidement avant cristallisation excessive.'],
    tip: 'Le tempérage dépend du chocolat : noir, lait et blanc n’ont pas les mêmes plages de température.',
    query: 'chocolat enrobage décor',
    aliases: ['tempérer le chocolat', 'temperer le chocolat', 'chocolat tempéré', 'chocolat tempere', 'tempérage du chocolat']
  },
  {
    id: 'cuire-caramel',
    title: 'Cuire un caramel',
    label: 'Sucre',
    description: 'Chauffer le sucre jusqu’à coloration contrôlée pour une sauce, un décor ou une base parfumée.',
    steps: ['Utilise une casserole propre à fond épais.', 'Chauffe sans remuer au début si caramel à sec.', 'Surveille la couleur sur les bords.', 'Stoppe ou décuite dès que l’ambre souhaité est atteint.'],
    tip: 'Le caramel continue de foncer hors du feu : anticipe légèrement.',
    query: 'sucre caramel sauce',
    aliases: ['cuire un caramel', 'caramel à sec', 'caramel a sec', 'faire un caramel', 'caramel ambré']
  },
  {
    id: 'hydrater-gelatine',
    title: 'Hydrater la gélatine',
    label: 'Pâtisserie',
    description: 'Réhydrater feuille ou poudre de gélatine avant de l’incorporer pour éviter grains et mauvaise prise.',
    steps: ['Plonge les feuilles dans beaucoup d’eau froide ou mélange la poudre avec l’eau pesée.', 'Attends le temps indiqué.', 'Essore les feuilles sans les déchirer.', 'Incorpore dans une préparation chaude mais non bouillante.'],
    tip: 'Une gélatine mal hydratée se dissout mal et peut laisser des morceaux.',
    query: 'gélatine entremets crème',
    aliases: ['hydrater la gélatine', 'hydrater la gelatine', 'réhydrater la gélatine', 'rehydrater la gelatine', 'gélatine hydratée', 'gelatine hydratee']
  },
  {
    id: 'cuire-a-la-nappe',
    title: 'Cuire à la nappe',
    label: 'Crème',
    description: 'Cuire une crème aux jaunes jusqu’à ce qu’elle nappe la cuillère sans coaguler.',
    steps: ['Chauffe doucement en remuant constamment.', 'Surveille la texture plutôt que chercher l’ébullition.', 'Passe le doigt sur le dos de la spatule.', 'Stoppe quand la trace reste nette.'],
    tip: 'Au-dessus de 85°C environ, les jaunes risquent de coaguler et de grainer.',
    query: 'crème anglaise jaunes',
    aliases: ['cuire à la nappe', 'cuire a la nappe', 'nappe la cuillère', 'napper la cuillère', 'crème anglaise']
  },
  {
    id: 'temperer-oeufs',
    title: 'Tempérer les œufs',
    label: 'Crème',
    description: 'Réchauffer progressivement œufs ou jaunes avec un liquide chaud pour éviter de les cuire brutalement.',
    steps: ['Fouette les œufs ou jaunes dans un bol.', 'Verse un peu de liquide chaud en filet en fouettant.', 'Ajoute encore une ou deux louches si nécessaire.', 'Reverse dans la casserole pour finir doucement.'],
    tip: 'Tempérer protège les jaunes dans les crèmes, sauces et appareils.',
    query: 'jaunes lait crème',
    aliases: ['tempérer les œufs', 'temperer les oeufs', 'tempérer les jaunes', 'temperer les jaunes', 'verser en filet en fouettant']
  },
  {
    id: 'faire-roux',
    title: 'Faire un roux',
    label: 'Sauce',
    description: 'Cuire farine et matière grasse pour lier une sauce sans goût de farine crue.',
    steps: ['Fais fondre le beurre ou chauffe la matière grasse.', 'Ajoute la farine en une fois.', 'Mélange jusqu’à texture homogène.', 'Cuis blanc, blond ou brun selon la sauce voulue.'],
    tip: 'Un roux chaud se mouille mieux avec un liquide froid ou tiède ajouté progressivement.',
    query: 'béchamel sauce farine beurre',
    aliases: ['faire un roux', 'roux blanc', 'roux blond', 'préparer un roux']
  },
  {
    id: 'dessecher-panade',
    title: 'Dessécher une panade',
    label: 'Pâtisserie',
    description: 'Cuire une pâte riche en eau sur le feu pour retirer l’humidité avant d’ajouter les œufs.',
    steps: ['Mélange sur feu moyen avec une spatule.', 'Cherche une pâte qui se détache des parois.', 'Observe un léger dépôt au fond de la casserole.', 'Transfère puis laisse tiédir avant les œufs.'],
    tip: 'Une panade trop humide donne des choux qui s’affaissent ; trop sèche, elle absorbe mal les œufs.',
    query: 'pâte à choux panade',
    aliases: ['dessécher la panade', 'dessecher la panade', 'dessécher la pâte', 'dessecher la pate', 'pâte à choux']
  },
  {
    id: 'chiqueter',
    title: 'Chiqueter',
    label: 'Pâtisserie',
    description: 'Marquer le bord d’une pâte feuilletée ou d’une tourte pour souder et décorer.',
    steps: ['Soude les bords avant de marquer.', 'Utilise le dos d’un couteau.', 'Fais de petites entailles régulières sans couper complètement.', 'Refroidis si la pâte devient molle.'],
    tip: 'Chiqueter aide aussi à contrôler le développement des bords feuilletés.',
    query: 'feuilletage galette tourte',
    aliases: ['chiqueter', 'chiqueté', 'chiquetée', 'chiqueter les bords']
  },
  {
    id: 'tourer-pate',
    title: 'Tourer une pâte',
    label: 'Pâtisserie',
    description: 'Créer des couches régulières de pâte et de beurre par pliages successifs.',
    steps: ['Garde pâte et beurre à textures proches.', 'Abaisse sans écraser le beurre.', 'Plie selon le tour demandé.', 'Respecte les temps de froid entre les tours.'],
    tip: 'Tourer trop chaud fait sortir le beurre ; trop froid, il casse et donne un feuilletage irrégulier.',
    query: 'feuilletage croissant pâte levée',
    aliases: ['tourer', 'tourer la pâte', 'tourage', 'donner un tour', 'tours simples', 'tours doubles']
  },
  {
    id: 'degazer-pate',
    title: 'Dégazer une pâte',
    label: 'Pain',
    description: 'Chasser une partie du gaz d’une pâte levée pour repartir sur une fermentation plus régulière.',
    steps: ['Dépose la pâte sur le plan légèrement fariné.', 'Appuie doucement avec les mains.', 'Rabats ou divise selon la recette.', 'Évite de déchirer le réseau de gluten.'],
    tip: 'Dégazer ne veut pas dire écraser brutalement : on contrôle la bulle, on ne détruit pas la pâte.',
    query: 'pain brioche pâte levée',
    aliases: ['dégazer', 'degazer', 'dégazer la pâte', 'degazer la pate', 'pâte dégazée']
  },
  {
    id: 'faconner-bouler',
    title: 'Façonner / bouler',
    label: 'Pain',
    description: 'Donner une forme finale ou une préforme à une pâte levée en créant une tension de surface.',
    steps: ['Dégaze ou rabats selon la recette.', 'Ramène les bords vers le centre.', 'Retourne soudure dessous.', 'Fais rouler doucement pour tendre la surface.'],
    tip: 'Une bonne tension aide le pain ou la brioche à pousser vers le haut plutôt qu’à s’étaler.',
    query: 'pain brioche pizza',
    aliases: ['façonner', 'faconner', 'bouler', 'bouler la pâte', 'former une boule', 'mise en forme']
  },
  {
    id: 'pousser-pate',
    title: 'Faire pousser une pâte',
    label: 'Pain',
    description: 'Laisser fermenter une pâte levée jusqu’au volume et à la souplesse attendus.',
    steps: ['Couvre pour éviter le dessèchement.', 'Place à température adaptée.', 'Surveille le volume plutôt que seulement le temps.', 'Enfourne ou rabats quand la pâte est prête.'],
    tip: 'Une pâte trop poussée retombe facilement ; une pâte trop peu poussée manque de légèreté.',
    query: 'levure pain brioche',
    aliases: ['faire pousser', 'laisser pousser', 'pousse de la pâte', 'pâte levée', 'laisser lever', 'temps de pousse']
  },
  {
    id: 'scarifier',
    title: 'Scarifier',
    label: 'Pain',
    description: 'Inciser une pâte juste avant cuisson pour guider son développement au four.',
    steps: ['Utilise une lame très affûtée.', 'Incline légèrement la lame selon le pain.', 'Incise rapidement sans écraser.', 'Enfourne aussitôt.'],
    tip: 'Une scarification nette aide la pâte à s’ouvrir plutôt qu’à éclater au hasard.',
    query: 'pain baguette cuisson',
    aliases: ['scarifier', 'scarifié', 'scarifiée', 'grigner', 'grigne']
  },
  {
    id: 'puncher-biscuit',
    title: 'Puncher un biscuit',
    label: 'Pâtisserie',
    description: 'Imbiber un biscuit avec sirop, café, jus ou alcool pour apporter moelleux et parfum.',
    steps: ['Prépare un sirop froid ou tiède selon le biscuit.', 'Applique au pinceau ou à la cuillère.', 'Avance progressivement.', 'Arrête avant que le biscuit ne se délite.'],
    tip: 'Un biscuit se punch souvent mieux quand il est froid et stable.',
    query: 'génoise biscuit tiramisu',
    aliases: ['puncher', 'imbiber', 'biscuit imbibé', 'imbiber le biscuit', 'imbiber les biscuits']
  },
  {
    id: 'chinoiser',
    title: 'Chinoiser',
    label: 'Finition',
    description: 'Filtrer finement au chinois pour obtenir sauce, crème ou coulis parfaitement lisse.',
    steps: ['Pose le chinois au-dessus d’un récipient stable.', 'Verse la préparation par petites quantités.', 'Aide avec une louche ou une maryse.', 'Racle le dessous pour récupérer le lisse.'],
    tip: 'Chinoiser est plus fin qu’une simple passoire et donne un rendu plus professionnel.',
    query: 'coulis sauce crème',
    aliases: ['chinoiser', 'chinoisé', 'chinoisée', 'passer au chinois étamine', 'chinois étamine']
  },
  {
    id: 'emulsionner',
    title: 'Émulsionner',
    label: 'Sauce',
    description: 'Disperser gras et liquide en fines gouttelettes pour obtenir une sauce liée et brillante.',
    steps: ['Réunis une base aqueuse et une matière grasse.', 'Ajoute le gras progressivement si nécessaire.', 'Fouette, mixe ou secoue vivement.', 'Stabilise avec moutarde, jaune, réduction ou température adaptée.'],
    tip: 'Une émulsion tranche quand le gras est ajouté trop vite ou quand la température est mal contrôlée.',
    query: 'vinaigrette mayonnaise sauce beurre',
    aliases: ['émulsionner', 'emulsionner', 'émulsion', 'emulsion', 'sauce émulsionnée', 'vinaigrette émulsionnée']
  },
  {
    id: 'pincer-sucs',
    title: 'Pincer les sucs',
    label: 'Sauce',
    description: 'Faire colorer légèrement sucs ou concentré de tomate au fond d’un récipient avant de mouiller.',
    steps: ['Garde une chaleur moyenne.', 'Laisse les sucs accrocher légèrement sans brûler.', 'Ajoute concentré ou garniture si prévu.', 'Déglace ou mouille dès que la couleur est profonde.'],
    tip: 'Des sucs pincés donnent du relief ; des sucs brûlés donnent de l’amertume.',
    query: 'sauce jus rôti concentré tomate',
    aliases: ['pincer les sucs', 'sucs pincés', 'pincer le concentré', 'pincer au fond']
  },
  {
    id: 'decortiquer',
    title: 'Décortiquer',
    label: 'Préparation',
    description: 'Retirer carapace, coque ou enveloppe sans abîmer la chair utile.',
    steps: ['Travaille sur un aliment froid ou tiède selon la recette.', 'Détache délicatement la carapace ou la coque.', 'Garde têtes et carapaces propres pour un fumet si utile.', 'Retire le boyau des crevettes si nécessaire.'],
    tip: 'Les parures de crustacés donnent beaucoup de goût aux sauces et bouillons.',
    query: 'crevette langoustine moule',
    aliases: ['décortiquer', 'decortiquer', 'décortiqué', 'décortiquée', 'crevettes décortiquées']
  },
  {
    id: 'lever-filets',
    title: 'Lever des filets',
    label: 'Poisson',
    description: 'Séparer proprement les filets d’un poisson en suivant l’arête centrale.',
    steps: ['Place le poisson stable sur la planche.', 'Incise derrière la tête et longe l’arête.', 'Garde la lame presque à plat.', 'Retire les arêtes restantes à la pince.'],
    tip: 'Une lame longue et souple limite la perte de chair.',
    query: 'poisson filets arêtes',
    aliases: ['lever des filets', 'lever les filets', 'filets levés', 'retirer les arêtes', 'retirer les aretes']
  }
]);
