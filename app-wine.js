// ---------- Carte des accords mets et vins ----------
// Par style de vin, jamais par marque : 13 styles (avec des exemples de
// cepages et d'appellations pour les reconnaitre) et une quarantaine de
// familles de plats. Chaque plat a ses accords parfaits, ses bons accords et
// ce qu'il vaut mieux eviter, avec la raison en une phrase. La fiche recette
// retrouve son plat (titre, mots-cles, ingredients) et propose un raccourci
// vers la carte, ouverte sur ce plat.

const WINE_STYLES = [
  { id: 'bulles', name: 'un effervescent brut', label: 'Effervescent brut', color: '#f1e3a6', examples: 'Champagne brut, crémant, cava, prosecco', serve: '6 à 8 °C', taste: 'Bulles fines, acidité vive, notes de pomme, de brioche ou d’agrumes. Le joker de l’apéritif et des fritures.' },
  { id: 'blanc-vif', name: 'un blanc sec et vif', label: 'Blanc sec et vif', color: '#e9efb0', examples: 'Sauvignon blanc, muscadet, chablis, picpoul, albariño', serve: '8 à 10 °C', taste: 'Frais, tendu, citronné, parfois minéral ou iodé. Il réveille les plats légers et coupe le gras.' },
  { id: 'blanc-rond', name: 'un blanc sec rond', label: 'Blanc sec rond', color: '#f3d98b', examples: 'Chardonnay élevé en fût, viognier, roussanne, meursault, rioja blanc', serve: '10 à 12 °C', taste: 'Ample, beurré, fruits jaunes, parfois vanillé. Il tient tête aux sauces crémeuses et aux viandes blanches.' },
  { id: 'blanc-aromatique', name: 'un blanc aromatique', label: 'Blanc aromatique', color: '#f6c97f', examples: 'Riesling, gewurztraminer, pinot gris, muscat sec, chenin demi-sec', serve: '8 à 10 °C', taste: 'Floral, fruité, épicé, parfois une pointe de sucre. Le meilleur ami des cuisines épicées et asiatiques.' },
  { id: 'blanc-doux', name: 'un blanc moelleux ou liquoreux', label: 'Blanc moelleux ou liquoreux', color: '#e8b25a', examples: 'Sauternes, jurançon moelleux, coteaux-du-layon, vendanges tardives, tokaji', serve: '8 à 10 °C', taste: 'Miel, abricot, coing, acidité qui équilibre le sucre. Foie gras, bleus et desserts aux fruits.' },
  { id: 'jaune', name: 'un blanc oxydatif', label: 'Blanc oxydatif', color: '#d9a548', examples: 'Vin jaune du Jura, savagnin, xérès fino ou amontillado', serve: '12 à 14 °C', taste: 'Noix, curry, épices, très long en bouche. Le compagnon du comté, des morilles et de la volaille à la crème.' },
  { id: 'rose', name: 'un rosé sec', label: 'Rosé sec', color: '#f4a9a0', examples: 'Rosé de Provence, tavel, bandol rosé, rosado', serve: '8 à 10 °C', taste: 'Fruits rouges frais, agrumes, léger. L’été, les grillades, la cuisine méditerranéenne.' },
  { id: 'rouge-leger', name: 'un rouge léger et fruité', label: 'Rouge léger et fruité', color: '#e07b86', examples: 'Gamay (beaujolais), pinot noir d’Alsace ou de Loire, valpolicella, saumur-champigny', serve: '13 à 15 °C', taste: 'Fruits rouges croquants, peu de tanins, se boit un peu frais. Charcuterie, volaille, poissons charnus.' },
  { id: 'rouge-fin', name: 'un rouge souple et fin', label: 'Rouge souple et fin', color: '#c24f63', examples: 'Pinot noir de Bourgogne, chinon, bourgueil, mencía, nebbiolo léger', serve: '15 à 16 °C', taste: 'Élégant, cerise, sous-bois, tanins soyeux. Volaille rôtie, veau, champignons, canard.' },
  { id: 'rouge-epice', name: 'un rouge solaire et épicé', label: 'Rouge solaire et épicé', color: '#a8344a', examples: 'Grenache, syrah, côtes-du-rhône, languedoc, primitivo, zinfandel', serve: '16 à 17 °C', taste: 'Fruits noirs mûrs, garrigue, poivre, chaleur. Grillades, plats mijotés aux épices, barbecue.' },
  { id: 'rouge-puissant', name: 'un rouge charpenté', label: 'Rouge charpenté', color: '#7d2338', examples: 'Cabernet sauvignon, merlot de Bordeaux, madiran, cahors, malbec', serve: '16 à 18 °C', taste: 'Cassis, tanins fermes, structure. La viande rouge, l’agneau, les plats riches et longs.' },
  { id: 'rouge-doux', name: 'un rouge doux ou muté', label: 'Rouge doux ou muté', color: '#5e1a2c', examples: 'Banyuls, maury, rivesaltes rouge, porto ruby ou tawny', serve: '14 à 16 °C', taste: 'Fruits confits, cacao, café. Le seul vin qui tient face au chocolat.' },
  { id: 'sans-alcool', name: 'une boisson sans alcool', label: 'Sans alcool', color: '#9fd3c7', examples: 'Thé infusé à froid, kombucha, jus de raisin pétillant, eau gazeuse et agrumes', serve: 'bien frais', taste: 'Les mêmes logiques : de l’acidité pour le gras, du fruit pour le sucré, des bulles pour le frit.' }
];

const WINE_FAMILIES = [
  ['viandes', 'Viandes'], ['volailles', 'Volailles'], ['mer', 'Poissons et mer'], ['vegetal', 'Légumes et œufs'],
  ['monde', 'Cuisines du monde'], ['fromages', 'Fromages'], ['apero', 'Apéro et entrées'], ['desserts', 'Desserts']
];

// best : accords parfaits ; good : tres bons ; avoid : a eviter.
const WINE_PAIRINGS = [
  // Volailles
  { id: 'poulet-roti', family: 'volailles', label: 'Poulet rôti', match: /\b(poulet roti|poulet au four|volaille rotie|poulet entier|poulet a la broche)\b/, best: ['rouge-fin', 'blanc-rond'], good: ['rouge-leger', 'jaune'], avoid: ['rouge-puissant'], why: 'Chair tendre et jus doré : un pinot noir soyeux ou un chardonnay ample, sans tanins qui écrasent.' },
  { id: 'volaille-creme', family: 'volailles', label: 'Volaille à la crème ou aux morilles', match: /\b(poulet|volaille|supreme|chapon|pintade)\b.*\b(creme|morilles?|champignons?|vin jaune)\b|\b(creme|morilles?)\b.*\b(poulet|volaille)\b|\bblanquette de volaille\b/, best: ['jaune', 'blanc-rond'], good: ['rouge-fin'], avoid: ['blanc-vif', 'rouge-puissant'], why: 'La crème veut du gras et du volume : vin jaune ou chardonnay boisé, l’accord classique du Jura.' },
  { id: 'poulet-grille', family: 'volailles', label: 'Poulet grillé, mariné ou au citron', match: /\b(poulet|volaille|blanc de poulet|cuisses? de poulet|pilons?)\b.*\b(grille|marine|citron|plancha|barbecue|brochettes?|yakitori|tandoori|tikka)\b|\b(brochettes? de poulet|poulet citron)\b/, best: ['rose', 'blanc-vif'], good: ['rouge-leger', 'blanc-aromatique'], avoid: ['rouge-puissant'], why: 'Le grillé et le citron appellent de la fraîcheur : rosé sec ou blanc vif bien frais.' },
  { id: 'canard', family: 'volailles', label: 'Canard (magret, confit)', match: /\b(canard|magret|confit de canard|aiguillettes de canard|cuisses? de canard)\b/, best: ['rouge-epice', 'rouge-puissant'], good: ['rouge-fin'], avoid: ['blanc-vif'], why: 'Viande rouge et grasse : un madiran, un cahors ou une syrah tiennent le gras du canard.' },
  { id: 'dinde-lapin', family: 'volailles', label: 'Dinde, lapin, pintade', match: /\b(dinde|lapin|pintade|caille|coquelet)\b/, best: ['rouge-fin', 'blanc-rond'], good: ['rouge-leger', 'rose'], avoid: ['rouge-puissant'], why: 'Viandes fines, assez maigres : un rouge souple ou un blanc rond, rien de trop tannique.' },
  // Viandes
  { id: 'boeuf-grille', family: 'viandes', label: 'Bœuf grillé ou rôti', match: /\b(entrecote|cote de boeuf|bavette|steak|onglet|rumsteck|faux filet|filet de boeuf|roti de boeuf|tartare|boeuf grille|boeuf saute)\b/, best: ['rouge-puissant', 'rouge-epice'], good: ['rouge-fin'], avoid: ['blanc-vif', 'blanc-doux'], why: 'Le saignant et les tanins s’adoucissent mutuellement : bordeaux, malbec ou syrah.' },
  { id: 'boeuf-mijote', family: 'viandes', label: 'Bœuf mijoté (bourguignon, daube)', match: /\b(bourguignon|daube|pot au feu|pot-au-feu|joues? de boeuf|paleron|carbonade|boeuf braise|boeuf mijote|jarret de boeuf|chili con carne)\b/, best: ['rouge-fin', 'rouge-epice'], good: ['rouge-puissant'], avoid: ['blanc-vif'], why: 'Cuisiné au vin, servi avec le même style : un bourgogne pour le bourguignon, un rhône pour la daube.' },
  { id: 'agneau', family: 'viandes', label: 'Agneau', match: /\b(agneau|gigot|souris d agneau|carre d agneau|epaule d agneau|navarin|mechoui)\b/, best: ['rouge-puissant', 'rouge-epice'], good: ['rouge-fin'], avoid: ['blanc-vif'], why: 'Goût marqué, gras fondant : un bordeaux, un bandol rouge ou une grenache garrigue.' },
  { id: 'porc', family: 'viandes', label: 'Porc (rôti, filet mignon, côtes)', match: /\b(porc|filet mignon|echine|cote de porc|roti de porc|travers|ribs|pulled pork|cochon)\b/, best: ['rouge-leger', 'blanc-aromatique'], good: ['rose', 'rouge-fin', 'blanc-rond'], avoid: ['rouge-puissant'], why: 'Viande douce et un peu sucrée : un gamay croquant, ou un riesling si la sauce est à la moutarde ou aux pommes.' },
  { id: 'veau', family: 'viandes', label: 'Veau', match: /\b(veau|blanquette|osso buco|escalope|paupiettes?|grenadin|vitello)\b/, best: ['blanc-rond', 'rouge-fin'], good: ['rouge-leger', 'jaune'], avoid: ['rouge-puissant'], why: 'Délicat et souvent en sauce blanche : chardonnay rond ou pinot noir léger.' },
  { id: 'saucisse', family: 'viandes', label: 'Saucisses, choucroute, plats rustiques', match: /\b(saucisses?|choucroute|cassoulet|petit sale|lentilles au petit sale|tartiflette|diots?|andouillette|boudin|morteau|rougail)\b/, best: ['blanc-aromatique', 'rouge-epice'], good: ['rouge-leger', 'blanc-vif'], avoid: ['blanc-doux'], why: 'Riesling ou pinot gris pour la choucroute, rouge du sud-ouest pour le cassoulet, gamay pour le reste.' },
  { id: 'gibier', family: 'viandes', label: 'Gibier (chevreuil, sanglier)', match: /\b(chevreuil|sanglier|biche|cerf|gibier|lievre|faisan|perdreau)\b/, best: ['rouge-puissant', 'rouge-epice'], good: ['rouge-fin'], avoid: ['blanc-vif', 'rose'], why: 'Goût puissant et sauces corsées : des vins mûrs, avec de l’âge si possible.' },
  { id: 'burger-bbq', family: 'viandes', label: 'Burger, barbecue, grillades', match: /\b(burger|barbecue|bbq|grillades?|merguez|brochettes?|kebab|kefta|smash|hot dog|chili rub)\b/, best: ['rouge-epice', 'rose'], good: ['rouge-leger', 'sans-alcool'], avoid: ['blanc-doux'], why: 'Fumé, épicé, convivial : un zinfandel, un côtes-du-rhône ou un rosé bien frais.' },
  // Poissons et mer
  { id: 'poisson-blanc', family: 'mer', label: 'Poisson blanc (cabillaud, sole, bar)', match: /\b(cabillaud|sole|bar|lieu|merlu|colin|dorade|daurade|turbot|lotte|eglefin|poisson blanc|loup|julienne)\b/, best: ['blanc-vif', 'blanc-rond'], good: ['bulles', 'rose'], avoid: ['rouge-puissant', 'rouge-epice'], why: 'Chair délicate : un blanc sec, vif au naturel, plus rond si le poisson est au beurre blanc.' },
  { id: 'poisson-gras', family: 'mer', label: 'Saumon, thon, poissons gras', match: /\b(saumon|thon|truite|maquereau|sardines?|espadon|gravlax)\b/, best: ['blanc-rond', 'rouge-leger'], good: ['rose', 'bulles', 'blanc-vif'], avoid: ['rouge-puissant'], why: 'Le gras du saumon aime un chardonnay ample, ou un pinot noir léger pour le thon mi-cuit.' },
  { id: 'crustaces', family: 'mer', label: 'Crevettes, homard, langoustines', match: /\b(crevettes?|gambas|homard|langoustines?|langouste|crabe|ecrevisses?|scampi)\b/, best: ['blanc-rond', 'bulles'], good: ['blanc-vif', 'blanc-aromatique'], avoid: ['rouge-puissant', 'rouge-epice'], why: 'Chair sucrée et iodée : champagne ou chardonnay rond ; un riesling si c’est épicé.' },
  { id: 'fruits-mer', family: 'mer', label: 'Huîtres, moules, fruits de mer', match: /\b(huitres?|moules?|coquillages?|palourdes?|bulots?|fruits de mer|saint jacques|saint-jacques|coquilles? saint)\b/, best: ['blanc-vif', 'bulles'], good: ['blanc-rond'], avoid: ['rouge-puissant', 'rouge-epice', 'rouge-doux'], why: 'L’iode demande de la tension : muscadet, chablis, picpoul ; un blanc rond pour les saint-jacques.' },
  { id: 'calamar', family: 'mer', label: 'Calamars, poulpe, friture de mer', match: /\b(calamars?|encornets?|chipirons?|poulpe|seiches?|friture|fish and chips|beignets? de)\b/, best: ['blanc-vif', 'bulles'], good: ['rose'], avoid: ['rouge-puissant'], why: 'Le frit et l’iodé adorent les bulles et l’acidité, qui nettoient la bouche.' },
  { id: 'bouillabaisse', family: 'mer', label: 'Bouillabaisse, soupe de poisson, safran', match: /\b(bouillabaisse|soupe de poisson|rouille|zarzuela|paella|cotriade|matelote)\b/, best: ['rose', 'blanc-rond'], good: ['blanc-vif', 'rouge-leger'], avoid: ['rouge-puissant'], why: 'Safran, ail, tomate : un rosé de Bandol ou un blanc du Sud, de Cassis par exemple.' },
  { id: 'sushi', family: 'mer', label: 'Sushi, poisson cru, ceviche', match: /\b(sushis?|makis?|sashimi|ceviche|poke|tataki|carpaccio de|tartare de saumon|tartare de thon)\b/, best: ['blanc-vif', 'bulles'], good: ['blanc-aromatique', 'sans-alcool'], avoid: ['rouge-puissant', 'rouge-epice'], why: 'Le cru est délicat : de l’acidité et peu d’alcool ; un riesling sec si la sauce soja domine.' },
  // Legumes et oeufs
  { id: 'legumes-grilles', family: 'vegetal', label: 'Légumes grillés, cuisine du soleil', match: /\b(ratatouille|aubergines?|courgettes?|poivrons?|legumes grilles|legumes rotis|tian|caponata|piperade)\b/, best: ['rose', 'rouge-leger'], good: ['blanc-vif', 'rouge-epice'], avoid: ['blanc-doux'], why: 'Herbes, huile d’olive, tomate : un rosé de Provence ou un rouge léger un peu frais.' },
  { id: 'champignons', family: 'vegetal', label: 'Champignons, truffe', match: /\b(champignons?|cepes?|girolles?|morilles?|truffes?|risotto aux champignons|poelee forestiere)\b/, best: ['rouge-fin', 'jaune'], good: ['blanc-rond'], avoid: ['blanc-vif'], why: 'Le sous-bois du pinot noir répond à celui des champignons ; vin jaune pour les morilles à la crème.' },
  { id: 'gratin', family: 'vegetal', label: 'Gratins, purées, plats crémeux', match: /\b(gratin|dauphinois|puree|parmentier|lasagnes?|moussaka|hachis|croque|endives au jambon)\b/, best: ['blanc-rond', 'rouge-leger'], good: ['rouge-fin'], avoid: ['blanc-doux'], why: 'Crème et fromage veulent un blanc ample ; un rouge léger si la recette contient de la viande.' },
  { id: 'oeufs', family: 'vegetal', label: 'Œufs, quiches, tartes salées', match: /\b(oeufs?|omelette|quiche|tarte salee|tortilla|frittata|cake sale|souffle|oeufs? cocotte|oeufs? en meurette)\b/, best: ['blanc-vif', 'blanc-aromatique'], good: ['bulles', 'rouge-leger'], avoid: ['rouge-puissant'], why: 'L’œuf enrobe la bouche : un blanc vif ou un riesling (quiche lorraine), un rouge léger pour les œufs en meurette.' },
  { id: 'salade', family: 'vegetal', label: 'Salades composées, crudités', match: /\b(salade|crudites|taboule|buddha bowl|coleslaw|carottes rapees)\b/, best: ['blanc-vif', 'rose'], good: ['bulles', 'sans-alcool'], avoid: ['rouge-puissant', 'blanc-doux'], why: 'La vinaigrette écrase les vins : choisis un blanc très vif, ou mets peu de vinaigre.' },
  { id: 'veggie-epice', family: 'vegetal', label: 'Légumineuses, plats végétariens épicés', match: /\b(lentilles|pois chiches|dahl|dal|falafels?|haricots|houmous|chili sin carne|curry de legumes|legumineuses)\b/, best: ['rouge-epice', 'blanc-aromatique'], good: ['rose', 'rouge-leger'], avoid: ['blanc-vif'], why: 'Terreux et épicé : une grenache souple ou un blanc aromatique.' },
  { id: 'soupe', family: 'vegetal', label: 'Soupes et veloutés', match: /\b(soupe|veloute|potage|minestrone|gaspacho|gazpacho|bouillon)\b/, best: ['blanc-vif', 'blanc-rond'], good: ['jaune', 'sans-alcool'], avoid: ['rouge-puissant'], why: 'Peu de vin avec un plat liquide : un petit verre de blanc ; un fino avec un velouté de châtaigne.' },
  // Cuisines du monde
  { id: 'pates-tomate', family: 'monde', label: 'Pâtes et pizza à la tomate', match: /\b(bolognaise|napolitaine|arrabbiata|puttanesca|pizza|marinara|sauce tomate|lasagne|pates a la tomate|penne)\b/, best: ['rouge-leger', 'rouge-epice'], good: ['rose'], avoid: ['blanc-doux', 'rouge-puissant'], why: 'La tomate est acide : il faut un rouge acide lui aussi, chianti, valpolicella, primitivo.' },
  { id: 'pates-creme', family: 'monde', label: 'Pâtes à la crème, carbonara, risotto', match: /\b(carbonara|alfredo|risotto|pates a la creme|gnocchis?|cacio e pepe|tagliatelles?|fettuccine|pesto)\b/, best: ['blanc-rond', 'blanc-vif'], good: ['bulles', 'rouge-leger'], avoid: ['rouge-puissant'], why: 'Crème et parmesan veulent un blanc qui a du corps ; un blanc vif pour le pesto.' },
  { id: 'asiatique', family: 'monde', label: 'Cuisine asiatique (soja, gingembre, wok)', match: /\b(wok|sauce soja|teriyaki|ramen|pho|bo bun|nems?|gyozas?|pad thai|cantonais|sautes? a l asiatique|tsukune|katsu|bibimbap|kimchi|dumplings?|mirin|gingembre)\b/, best: ['blanc-aromatique', 'bulles'], good: ['rouge-leger', 'rose', 'sans-alcool'], avoid: ['rouge-puissant', 'blanc-rond'], why: 'Sucré-salé et gingembre : un riesling ou un gewurztraminer, avec un peu de sucre qui calme le piment.' },
  { id: 'curry', family: 'monde', label: 'Curry, cuisine indienne et thaïe', match: /\b(curry|tikka|masala|korma|biryani|tandoori|massaman|vindaloo|lait de coco|dhal)\b/, best: ['blanc-aromatique', 'rose'], good: ['bulles', 'sans-alcool'], avoid: ['rouge-puissant', 'rouge-epice'], why: 'Le piment et l’alcool s’enflamment : vins aromatiques, peu alcoolisés, avec un soupçon de douceur.' },
  { id: 'maghreb', family: 'monde', label: 'Couscous, tajine, cuisine du Maghreb', match: /\b(couscous|tajine|tagine|harissa|merguez|pastilla|chakchouka|ras el hanout)\b/, best: ['rouge-epice', 'rose'], good: ['rouge-leger', 'blanc-aromatique'], avoid: ['blanc-vif'], why: 'Épices chaudes et fruits secs : grenache ou rosé gourmand ; un pinot gris pour le tajine aux fruits.' },
  { id: 'mexicain', family: 'monde', label: 'Cuisine mexicaine et tex-mex', match: /\b(tacos?|burritos?|fajitas?|quesadillas?|enchiladas?|guacamole|nachos|chili|mole)\b/, best: ['rouge-epice', 'rose'], good: ['blanc-aromatique', 'sans-alcool'], avoid: ['rouge-puissant'], why: 'Épicé et fumé : un zinfandel fruité, un rosé frais, ou une boisson sans alcool aux agrumes.' },
  // Fromages
  { id: 'fromage-pate-dure', family: 'fromages', label: 'Comté, beaufort, fromages à pâte dure', match: /\b(comte|beaufort|gruyere|emmental|parmesan|parmigiano|mimolette|cantal|salers|abondance|tomme)\b/, best: ['jaune', 'blanc-rond'], good: ['rouge-fin', 'rouge-doux'], avoid: ['rouge-puissant'], why: 'Le comté et le vin jaune, le plus bel accord régional ; un blanc ample sinon. Les rouges tanniques s’y heurtent.' },
  { id: 'fromage-croute-fleurie', family: 'fromages', label: 'Brie, camembert, croûte fleurie', match: /\b(brie|camembert|coulommiers|chaource|brillat|croute fleurie)\b/, best: ['bulles', 'rouge-leger'], good: ['blanc-rond'], avoid: ['rouge-puissant'], why: 'Crémeux, champignon : les bulles d’un champagne ou d’un cidre, ou un rouge très léger.' },
  { id: 'fromage-bleu', family: 'fromages', label: 'Roquefort, bleus', match: /\b(roquefort|bleu d auvergne|fourme|gorgonzola|stilton|bleus?)\b/, best: ['blanc-doux', 'rouge-doux'], good: ['blanc-aromatique'], avoid: ['blanc-vif', 'rouge-puissant'], why: 'Le salé du bleu contre le sucre du sauternes ou du porto : l’accord le plus spectaculaire.' },
  { id: 'chevre', family: 'fromages', label: 'Fromage de chèvre', match: /\b(chevre|crottin|sainte maure|selles sur cher|valencay|picodon|banon)\b/, best: ['blanc-vif'], good: ['rose', 'rouge-leger'], avoid: ['rouge-puissant', 'blanc-doux'], why: 'Accord de terroir : le sancerre (sauvignon) et le crottin de Chavignol viennent du même coin.' },
  { id: 'fondue', family: 'fromages', label: 'Raclette, fondue, tartiflette', match: /\b(raclette|fondue|tartiflette|croziflette|reblochon|mont d or|vacherin|aligot|truffade)\b/, best: ['blanc-vif', 'blanc-aromatique'], good: ['rouge-leger', 'jaune'], avoid: ['rouge-puissant'], why: 'Le blanc de Savoie (jacquère, chignin), vif, allège le fromage fondu ; évite les rouges lourds.' },
  // Apero et entrees
  { id: 'apero', family: 'apero', label: 'Apéritif, amuse-bouches, gougères', match: /\b(apero|aperitif|amuse|gougeres?|toasts?|tapas|feuilletes?|billes|dips?|crackers?|chips)\b/, best: ['bulles', 'blanc-vif'], good: ['rose', 'sans-alcool'], avoid: ['blanc-doux', 'rouge-puissant'], why: 'Des bulles ou un blanc vif ouvrent l’appétit sans fatiguer avant le repas.' },
  { id: 'charcuterie', family: 'apero', label: 'Charcuterie, terrines, rillettes', match: /\b(charcuterie|saucisson|jambon|terrine|rillettes?|pate en croute|pate de campagne|coppa|chorizo|lardons?)\b/, best: ['rouge-leger', 'rose'], good: ['blanc-vif', 'rouge-fin'], avoid: ['blanc-doux'], why: 'Le gras du cochon et le fruit d’un beaujolais : l’accord du bouchon lyonnais.' },
  { id: 'foie-gras', family: 'apero', label: 'Foie gras', match: /\b(foie gras)\b/, best: ['blanc-doux', 'bulles'], good: ['blanc-aromatique', 'rouge-doux'], avoid: ['blanc-vif', 'rouge-puissant'], why: 'Sauternes ou jurançon pour la tradition, champagne pour la légèreté, gewurztraminer pour le pain d’épices.' },
  // Desserts
  { id: 'chocolat', family: 'desserts', label: 'Desserts au chocolat', match: /\b(chocolat|fondant|brownies?|mousse au chocolat|moelleux|ganache|cacao|forêt noire|foret noire|sacher)\b/, best: ['rouge-doux'], good: ['sans-alcool'], avoid: ['bulles', 'blanc-vif', 'rouge-puissant'], why: 'Seuls les rouges mutés tiennent le chocolat : banyuls, maury, porto. Le champagne devient amer.' },
  { id: 'fruits-rouges', family: 'desserts', label: 'Fruits rouges, fraises, framboises', match: /\b(fraises?|framboises?|fruits rouges|cerises?|clafoutis|charlotte|pavlova|groseilles?|mures?|myrtilles?)\b/, best: ['rouge-doux', 'bulles'], good: ['blanc-doux', 'rose'], avoid: ['blanc-vif', 'rouge-puissant'], why: 'Un crémant rosé ou un banyuls jeune prolongent le fruit ; le vin doit toujours être plus sucré que le dessert.' },
  { id: 'tarte-fruits', family: 'desserts', label: 'Tartes aux pommes, poires, abricots', match: /\b(tarte aux pommes|tatin|pommes?|poires?|abricots?|peches?|crumble|chausson|frangipane|amandine|galette des rois)\b/, best: ['blanc-doux'], good: ['blanc-aromatique', 'bulles'], avoid: ['rouge-puissant', 'rouge-epice'], why: 'Le coing et le miel d’un coteaux-du-layon ou d’un jurançon épousent le fruit cuit.' },
  { id: 'agrumes', family: 'desserts', label: 'Desserts aux agrumes, citron', match: /\b(citron|tarte au citron|orange|pamplemousse|agrumes|yuzu|crepes suzette)\b/, best: ['blanc-doux', 'bulles'], good: ['blanc-aromatique'], avoid: ['rouge-puissant', 'rouge-doux'], why: 'L’acidité du citron demande un vin doux mais vif : muscat, vendanges tardives, champagne demi-sec.' },
  { id: 'creme-vanille', family: 'desserts', label: 'Crème brûlée, vanille, caramel', match: /\b(creme brulee|creme caramel|flan|vanille|caramel|panna cotta|ile flottante|riz au lait|tiramisu|cheesecake|baba|creme anglaise)\b/, best: ['blanc-doux', 'jaune'], good: ['rouge-doux', 'sans-alcool'], avoid: ['rouge-puissant', 'blanc-vif'], why: 'Vanille et caramel aiment le liquoreux ou un tawny ; un vin de paille du Jura pour les connaisseurs.' },
  { id: 'patisserie', family: 'desserts', label: 'Pâtisseries, viennoiseries, gâteaux simples', match: /\b(gateau|cake|madeleines?|financiers?|choux|eclairs?|paris brest|millefeuille|brioche|beignets?|crepes?|gaufres?|churros|cookies?|biscuits?)\b/, best: ['bulles', 'blanc-doux'], good: ['sans-alcool'], avoid: ['rouge-puissant'], why: 'Un crémant demi-sec ou un muscat léger, pour garder la gourmandise sans lourdeur.' }
];

const WINE_STYLE_BY_ID = Object.fromEntries(WINE_STYLES.map(style => [style.id, style]));

// Le plat d'une fiche : le titre d'abord, puis mots-cles et ingredients.
function getRecipeWinePairing(recipe) {
  if (!recipe?.title) return null;
  const title = normalizeText(recipe.title);
  const byTitle = WINE_PAIRINGS.find(item => item.match.test(title));
  if (byTitle) return byTitle;
  const categories = (recipe.categories || []).map(normalizeText).join(' ');
  if (/sauces?|bases?/.test(categories) && !/plats|desserts|entrees|apero/.test(categories)) return null;
  const text = normalizeText([...(recipe.tags || []), ...(recipe.aliases || []), ...(recipe.ingredients || []).flatMap(group => group.items || [])].join(' '));
  const pool = /desserts?/.test(categories) ? WINE_PAIRINGS.filter(item => item.family === 'desserts') : WINE_PAIRINGS.filter(item => item.family !== 'desserts');
  return pool.find(item => item.match.test(text)) || null;
}

// Vin cite dans une phrase : nom souligne de sa couleur, touchable.
function WineName({ id, onPick }) {
  const style = WINE_STYLE_BY_ID[id];
  if (!style) return null;
  return h('button', { type: 'button', className: 'wine-name', style: { '--wine': style.color }, onClick: () => onPick(id) }, tc(style.name));
}

// « un rouge souple et fin ou un blanc sec rond » (liste lisible, avec « ou »).
function wineSentence(ids, onPick) {
  const parts = [];
  ids.forEach((id, index) => {
    if (index > 0) parts.push(index === ids.length - 1 ? ` ${tc('ou')} ` : ', ');
    parts.push(h(WineName, { key: id, id, onPick }));
  });
  return parts;
}

const WINE_COLOR_GROUPS = [
  ['Blancs', ['blanc-vif', 'blanc-rond', 'blanc-aromatique', 'jaune']],
  ['Rosé et bulles', ['rose', 'bulles']],
  ['Rouges', ['rouge-leger', 'rouge-fin', 'rouge-epice', 'rouge-puissant']],
  ['Vins doux', ['blanc-doux', 'rouge-doux']],
  ['Sans alcool', ['sans-alcool']]
];

function RecipeWineDialog({ dish, title, onClose, openMap }) {
  const card = (id, level) => {
    const style = WINE_STYLE_BY_ID[id];
    return h('article', { key: id, className: `wine-pick is-${level}`, style: { '--wine': style.color } },
      h('div', { className: 'wine-pick-head' },
        h('i', { 'aria-hidden': true }),
        h('strong', null, tc(style.label)),
        h('em', null, level === 'best' ? tc('accord parfait') : tc('très bon accord'))
      ),
      h('p', null, tc(style.taste)),
      h('dl', null,
        h('div', null, h('dt', null, tc('Se reconnaît à')), h('dd', null, tc(style.examples))),
        h('div', null, h('dt', null, tc('Se sert à')), h('dd', null, tc(style.serve)))
      )
    );
  };
  return h(ModalDialog, { className: '', onClose },
    h('section', { className: 'modal-panel wine-modal wine-recipe-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'wine-recipe-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, tc('Au verre')), h('h2', { id: 'wine-recipe-title' }, tc(title || dish.label))),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('p', { className: 'wine-recipe-why' }, tc(dish.why)),
      h('div', { className: 'wine-picks' }, dish.best.map(id => card(id, 'best')), dish.good.map(id => card(id, 'good'))),
      dish.avoid.length > 0 && h('p', { className: 'wine-avoid' }, `${tc('Plutôt éviter')} : ${dish.avoid.map(id => tc(WINE_STYLE_BY_ID[id].label).toLowerCase()).join(', ')}.`),
      h('div', { className: 'wine-recipe-foot' },
        h('button', { type: 'button', className: 'wine-renew', onClick: openMap }, tc('Toute la carte des accords'), ' ›'),
        h('p', { className: 'wine-legal' }, tc('L’abus d’alcool est dangereux pour la santé, à consommer avec modération.'))
      )
    )
  );
}

function WinePanel({ open, onClose, focus = '', title = '' }) {
  const [view, setView] = useState('plats');
  // Depuis une fiche : les accords de ce plat seulement, la carte entiere sur demande.
  const [full, setFull] = useState(false);
  const [family, setFamily] = useState('');
  const [query, setQuery] = useState('');
  const [styleId, setStyleId] = useState('blanc-vif');
  const listRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    setFull(false);
    setView('plats');
    setQuery('');
    const target = WINE_PAIRINGS.find(item => item.id === focus);
    setFamily(target ? target.family : '');
  }, [open, focus]);
  // Ouverte depuis une fiche : le plat concerne est montre et mis en avant.
  useEffect(() => {
    if (!open || !focus || !full || view !== 'plats') return;
    listRef.current?.querySelector(`[data-wine="${focus}"]`)?.scrollIntoView?.({ block: 'center' });
  }, [open, focus, view, family]);
  if (!open) return null;
  const focusDish = focus && !full ? WINE_PAIRINGS.find(item => item.id === focus) : null;
  if (focusDish) return h(RecipeWineDialog, { dish: focusDish, title, onClose, openMap: () => setFull(true) });
  const needle = normalizeText(query.trim());
  const dishes = WINE_PAIRINGS.filter(item => (!family || item.family === family)
    && (!needle || normalizeText(`${item.label} ${tc(item.label)}`).includes(needle) || item.match.test(needle)));
  const pickStyle = id => { setStyleId(id); setView('vins'); };
  const pickDish = item => { setFamily(item.family); setQuery(''); setView('plats'); window.setTimeout(() => listRef.current?.querySelector(`[data-wine="${item.id}"]`)?.scrollIntoView?.({ block: 'center' }), 60); };
  const style = WINE_STYLE_BY_ID[styleId];
  const perfect = WINE_PAIRINGS.filter(item => item.best.includes(styleId));
  const good = WINE_PAIRINGS.filter(item => item.good.includes(styleId));
  const dishLinks = list => list.map((item, index) => h(React.Fragment, { key: item.id },
    index > 0 && ', ',
    h('button', { type: 'button', className: 'wine-dish-link', onClick: () => pickDish(item) }, tc(item.label).toLowerCase())
  ));
  return h(ModalDialog, { className: '', onClose },
    h('section', { className: 'modal-panel wine-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'wine-modal-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, tc('Carte des accords')), h('h2', { id: 'wine-modal-title' }, tc('Mets et vins'))),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('p', { className: 'wine-intro' }, tc('Choisis un plat : la carte indique les styles de vin qui l’accompagnent le mieux. Touche un vin pour lire son portrait et tout ce qu’il sait accompagner.')),
      // Legende : le soulignement d'un vin reprend sa robe, du plus pale au plus intense.
      h('p', { className: 'wine-colors' },
        h('span', null, tc('Le soulignement suit la couleur du vin')),
        WINE_COLOR_GROUPS.map(([label, ids]) => h('span', { key: label, className: 'wine-colors-group' },
          ids.map(id => h('i', { key: id, style: { background: WINE_STYLE_BY_ID[id].color }, 'aria-hidden': true })),
          tc(label)
        ))
      ),
      h('div', { className: 'wine-switch', role: 'tablist' },
        [['plats', 'Par plat'], ['vins', 'Par vin']].map(([id, label]) => h('button', { key: id, type: 'button', role: 'tab', 'aria-selected': view === id, className: view === id ? 'is-active' : '', onClick: () => setView(id) }, tc(label)))
      ),
      view === 'plats'
        ? h(React.Fragment, null,
          h('div', { className: 'wine-filters' },
            h('input', { type: 'search', value: query, placeholder: tc('Un plat, un ingrédient…'), 'aria-label': tc('Chercher un plat'), onChange: event => setQuery(event.target.value) }),
            h('nav', { className: 'wine-families', 'aria-label': tc('Familles de plats') },
              [['', 'Tout'], ...WINE_FAMILIES].map(([id, label]) => h('button', { key: id || 'all', type: 'button', className: family === id ? 'is-on' : '', 'aria-pressed': family === id, onClick: () => setFamily(id) }, tc(label)))
            )
          ),
          h('ul', { className: 'wine-dishes', ref: listRef }, dishes.map(item => h('li', { key: item.id, 'data-wine': item.id, className: item.id === focus ? 'is-focus' : '' },
            h('h3', null, tc(item.label)),
            h('p', { className: 'wine-best' }, `${tc('Idéal avec')} `, ...wineSentence(item.best, pickStyle), '.'),
            item.good.length > 0 && h('p', { className: 'wine-good' }, `${tc('Très bien aussi')} : `, ...wineSentence(item.good, pickStyle), '.'),
            h('p', { className: 'wine-why' }, tc(item.why)),
            item.avoid.length > 0 && h('p', { className: 'wine-avoid' }, `${tc('Plutôt éviter')} : ${item.avoid.map(id => tc(WINE_STYLE_BY_ID[id].label).toLowerCase()).join(', ')}.`)
          ))),
          dishes.length === 0 && h('p', { className: 'muted' }, tc('Aucun plat ne correspond. Essaie un ingrédient : poulet, saumon, chocolat…'))
        )
        : h('div', { className: 'wine-cellar' },
          h('nav', { className: 'wine-styles', 'aria-label': tc('Styles de vin') },
            WINE_COLOR_GROUPS.map(([label, ids]) => h('div', { key: label, className: 'wine-styles-group' },
              h('span', null, tc(label)),
              ids.map(id => h('button', { key: id, type: 'button', className: id === styleId ? 'is-on' : '', 'aria-pressed': id === styleId, style: { '--wine': WINE_STYLE_BY_ID[id].color }, onClick: () => setStyleId(id) }, h('i', { 'aria-hidden': true }), tc(WINE_STYLE_BY_ID[id].label)))
            ))
          ),
          h('article', { className: 'wine-portrait', style: { '--wine': style.color } },
            h('h3', null, tc(style.label)),
            h('p', { className: 'wine-taste' }, tc(style.taste)),
            h('dl', null,
              h('div', null, h('dt', null, tc('Se reconnaît à')), h('dd', null, tc(style.examples))),
              h('div', null, h('dt', null, tc('Se sert à')), h('dd', null, tc(style.serve)))
            ),
            perfect.length > 0 && h('p', { className: 'wine-best' }, h('strong', null, `${tc('Parfait avec')} `), ...dishLinks(perfect), '.'),
            good.length > 0 && h('p', { className: 'wine-good' }, h('strong', null, `${tc('Très bien avec')} `), ...dishLinks(good), '.')
          )
        ),
      h('p', { className: 'wine-legal' }, tc('L’abus d’alcool est dangereux pour la santé, à consommer avec modération.'))
    )
  );
}

// Raccourci de fin de fiche : une ligne touchable (pastilles de couleur et
// noms des vins), qui ouvre la carte sur ce plat.
function WinePairingShortcut({ recipe, openWine }) {
  const pairing = useMemo(() => getRecipeWinePairing(recipe), [recipe]);
  if (!pairing || !openWine) return null;
  return h('button', { type: 'button', className: 'wine-shortcut', onClick: () => openWine(pairing.id, recipe.title), 'aria-label': `${tc('Accord mets et vins')} : ${pairing.best.map(id => tc(WINE_STYLE_BY_ID[id].label)).join(', ')}` },
    h('span', { className: 'wine-shortcut-icon', 'aria-hidden': true }, h(Icon, { name: 'wine' })),
    h('span', { className: 'wine-shortcut-copy' },
      h('span', { className: 'wine-shortcut-label' }, tc('Au verre')),
      h('span', { className: 'wine-shortcut-names' }, pairing.best.map(id => h('span', { key: id },
        h('i', { style: { background: WINE_STYLE_BY_ID[id].color }, 'aria-hidden': true }),
        tc(WINE_STYLE_BY_ID[id].label)
      )))
    ),
    h('span', { className: 'wine-shortcut-arrow', 'aria-hidden': true }, '›')
  );
}
