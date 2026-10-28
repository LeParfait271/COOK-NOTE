// Materiel de cuisine des fiches : vocabulaire unique, synonymes et detection
// depuis le texte (etapes, ingredients, titre). Source commune du script
// scripts/curate-recipe-equipment.js et du validateur
// scripts/validate-recipe-equipment.js.

// Ordre d'affichage = ordre du travail : preparer, melanger, cuire, finir.
const EQUIPMENT = Object.freeze([
  'Balance',
  'Couteau',
  'Planche à découper',
  'Économe',
  'Mandoline',
  'Essoreuse à salade',
  'Dénoyauteur',
  'Râpe',
  'Presse-ail',
  'Presse-agrumes',
  'Saladier',
  'Bol',
  'Fouet',
  'Batteur électrique',
  'Robot pâtissier',
  'Robot hachoir',
  'Mixeur',
  'Mixeur plongeant',
  'Mortier',
  'Passoire',
  'Passoire fine',
  'Tamis',
  'Presse-purée',
  'Casserole',
  'Grande casserole',
  'Poêle',
  'Sauteuse',
  'Cocotte',
  'Wok',
  'Friteuse ou casserole haute',
  'Friteuse à air',
  'Cuit-vapeur',
  'Barbecue ou plancha',
  'Caquelon à fondue',
  'Gaufrier',
  'Presse à burger',
  'Four',
  'Pierre à pizza',
  'Plaque de cuisson',
  'Plat à four',
  'Moule à tarte',
  'Moule à cake',
  'Moule rond',
  'Moule carré',
  'Moule à muffins',
  'Moule à madeleines',
  'Moule à savarin',
  'Moules individuels',
  'Ramequins',
  'Cercle à pâtisserie',
  'Emporte-pièce',
  'Terrine',
  'Rouleau à pâtisserie',
  'Corne',
  'Lame de boulanger',
  'Ficelle de cuisine',
  'Papier cuisson',
  'Papier aluminium',
  'Film alimentaire',
  'Pinceau',
  'Spatule',
  'Cuillère en bois',
  'Louche',
  'Écumoire',
  'Pince',
  'Thermomètre de cuisson',
  'Poche à douille',
  'Cuillère à glace',
  'Chalumeau',
  'Grille',
  'Papier absorbant',
  'Piques à brochettes',
  'Siphon',
  'Sorbetière',
  'Machine à pâtes',
  'Bocal',
  'Verrines'
]);

const EQUIPMENT_SET = new Set(EQUIPMENT);

function normalize(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[œŒ]/g, 'oe')
    .replace(/[æÆ]/g, 'ae')
    .toLowerCase()
    .replace(/[’'`]/g, ' ')
    .replace(/[^a-z0-9°]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Materiel declare dans les fiches -> nom canonique (null : pas du materiel,
// ou deja implicite). Cle : texte normalise.
const DECLARED_SYNONYMS = new Map(Object.entries({
  'couteau': 'Couteau',
  'petit couteau': 'Couteau',
  'couteau bien aiguise': 'Couteau',
  'couteau d office': 'Couteau',
  'couteau de chef': 'Couteau',
  'grand couteau': 'Couteau',
  'couteau scie': 'Couteau',
  'planche': 'Planche à découper',
  'planche a decouper': 'Planche à découper',
  'econome': 'Économe',
  'eplucheur': 'Économe',
  'mandoline': 'Mandoline',
  'rape': 'Râpe',
  'rape fine': 'Râpe',
  'rapee fine': 'Râpe',
  'microplane': 'Râpe',
  'presse ail': 'Presse-ail',
  'presse agrumes': 'Presse-agrumes',
  'presse agrume': 'Presse-agrumes',
  'saladier': 'Saladier',
  'grand saladier': 'Saladier',
  '2 saladiers': 'Saladier',
  'deux saladiers': 'Saladier',
  'cul de poule': 'Saladier',
  'cul de poule tres froid': 'Saladier',
  'robot ou saladier': 'Saladier',
  'robot ou grand saladier': 'Saladier',
  'jatte': 'Saladier',
  'bol': 'Bol',
  'petit bol': 'Bol',
  'bols': 'Bol',
  'fouet': 'Fouet',
  'fouet ou batteur': 'Fouet',
  'batteur': 'Batteur électrique',
  'batteur electrique': 'Batteur électrique',
  'robot': 'Robot pâtissier',
  'robot petrisseur': 'Robot pâtissier',
  'robot patissier': 'Robot pâtissier',
  'hachoir': 'Robot hachoir',
  'robot hachoir': 'Robot hachoir',
  'mixeur': 'Mixeur',
  'blender': 'Mixeur',
  'mixeur ou blender': 'Mixeur',
  'mixeur plongeant': 'Mixeur plongeant',
  'mortier': 'Mortier',
  'mortier et pilon': 'Mortier',
  'passoire': 'Passoire',
  'egouttoir': 'Passoire',
  'passoire fine': 'Passoire fine',
  'chinois': 'Passoire fine',
  'tamis': 'Tamis',
  'tamis fin': 'Tamis',
  'presse puree': 'Presse-purée',
  'moulin a legumes': 'Presse-purée',
  'casserole': 'Casserole',
  'petite casserole': 'Casserole',
  // Liste type copiee dans des dizaines de fiches : ne dit rien de la recette.
  'casserole ou plat adapte': null,
  'casserole ou vapeur': 'Casserole',
  'deux casseroles': 'Casserole',
  'grande casserole': 'Grande casserole',
  'faitout': 'Grande casserole',
  'marmite': 'Grande casserole',
  'casserole haute': 'Friteuse ou casserole haute',
  'casserole ou sauteuse haute': 'Friteuse ou casserole haute',
  'friteuse': 'Friteuse ou casserole haute',
  'poele': 'Poêle',
  'grande poele': 'Poêle',
  'poele antiadhesive': 'Poêle',
  'poele a crepes': 'Poêle',
  'crepiere': 'Poêle',
  'sauteuse': 'Sauteuse',
  'cocotte': 'Cocotte',
  'grande cocotte': 'Cocotte',
  'cocotte avec couvercle': 'Cocotte',
  'cocotte en fonte': 'Cocotte',
  'wok': 'Wok',
  'cuit vapeur': 'Cuit-vapeur',
  'panier vapeur': 'Cuit-vapeur',
  'barbecue': 'Barbecue ou plancha',
  'plancha': 'Barbecue ou plancha',
  'gaufrier': 'Gaufrier',
  'four': 'Four',
  'plaque': 'Plaque de cuisson',
  'plaques': 'Plaque de cuisson',
  'plaque de cuisson': 'Plaque de cuisson',
  'plaques de cuisson': 'Plaque de cuisson',
  'plaque du four': 'Plaque de cuisson',
  'tapis silicone': 'Plaque de cuisson',
  'plat a four': 'Plat à four',
  'plat a gratin': 'Plat à four',
  'grand plat a gratin': 'Plat à four',
  'plat creux': 'Plat à four',
  'plat a bain marie': 'Plat à four',
  'bain marie': 'Casserole',
  'moule a tarte': 'Moule à tarte',
  'cercle a tarte': 'Moule à tarte',
  'moule a cake': 'Moule à cake',
  'moule rond': 'Moule rond',
  'moule a manque': 'Moule rond',
  'moule rond de 20cm': 'Moule rond',
  'moule rond de 22cm': 'Moule rond',
  'moule a charniere': 'Moule rond',
  'moule a muffins': 'Moule à muffins',
  'moule a madeleines': 'Moule à madeleines',
  'moule a savarin': 'Moule à savarin',
  'moule a kouglof': 'Moule à savarin',
  'moules individuels': 'Moules individuels',
  'ramequins': 'Ramequins',
  'ramequin': 'Ramequins',
  'cercle a entremets': 'Cercle à pâtisserie',
  'cercle a patisserie': 'Cercle à pâtisserie',
  'cercles': 'Cercle à pâtisserie',
  'terrine': 'Terrine',
  'rouleau': 'Rouleau à pâtisserie',
  'rouleau a patisserie': 'Rouleau à pâtisserie',
  'papier cuisson': 'Papier cuisson',
  'papier sulfurise': 'Papier cuisson',
  'film alimentaire': 'Film alimentaire',
  'pinceau': 'Pinceau',
  'spatule': 'Spatule',
  'maryse': 'Spatule',
  'spatule souple': 'Spatule',
  'cuillere en bois': 'Cuillère en bois',
  'spatule en bois': 'Cuillère en bois',
  'louche': 'Louche',
  'ecumoire': 'Écumoire',
  'araignee': 'Écumoire',
  'pince': 'Pince',
  'pince de cuisine': 'Pince',
  'thermometre': 'Thermomètre de cuisson',
  'thermometre a sonde': 'Thermomètre de cuisson',
  'thermometre de cuisson': 'Thermomètre de cuisson',
  'sonde': 'Thermomètre de cuisson',
  'poche a douille': 'Poche à douille',
  'douille': 'Poche à douille',
  'douille cannelee': 'Poche à douille',
  'douille unie': 'Poche à douille',
  'grille': 'Grille',
  'grille d egouttage': 'Grille',
  'papier absorbant': 'Papier absorbant',
  'piques en bois': 'Piques à brochettes',
  'piques a brochettes': 'Piques à brochettes',
  'brochettes': 'Piques à brochettes',
  'siphon': 'Siphon',
  'sorbetiere': 'Sorbetière',
  'machine a pates': 'Machine à pâtes',
  'laminoir': 'Machine à pâtes',
  'bocal': 'Bocal',
  'bocal hermetique': 'Bocal',
  'pot hermetique': 'Bocal',
  'bocaux': 'Bocal',
  'verrines': 'Verrines',
  'verrines ou plat': 'Verrines',
  'balance': 'Balance',
  'essoreuse a salade': 'Essoreuse à salade',
  'essoreuse': 'Essoreuse à salade',
  'denoyauteur': 'Dénoyauteur',
  'air fryer': 'Friteuse à air',
  'friteuse a air': 'Friteuse à air',
  'caquelon': 'Caquelon à fondue',
  'rechaud a fondue': 'Caquelon à fondue',
  'presse a burger': 'Presse à burger',
  'pierre a pizza': 'Pierre à pizza',
  'plaque lourde': 'Pierre à pizza',
  'moule carre': 'Moule carré',
  'moule rectangulaire': 'Moule carré',
  'cadre carre': 'Moule carré',
  'cadre': 'Moule carré',
  'emporte piece': 'Emporte-pièce',
  'emporte piece rond': 'Emporte-pièce',
  'corne': 'Corne',
  'lame': 'Lame de boulanger',
  'lame de grignage': 'Lame de boulanger',
  'grignette': 'Lame de boulanger',
  'ficelle de cuisine': 'Ficelle de cuisine',
  'ficelle': 'Ficelle de cuisine',
  'papier aluminium': 'Papier aluminium',
  'cuillere a glace': 'Cuillère à glace',
  'chalumeau': 'Chalumeau',
  'chalumeau de cuisine': 'Chalumeau',
  'zesteur': 'Râpe',
  'rape a gros trous': 'Râpe',
  'eplucheur': 'Économe',
  'bol verseur': 'Bol',
  'bol stable': 'Bol',
  'bol pour chocolat': 'Bol',
  'bol froid': 'Bol',
  'caissette': 'Moule à muffins',
  'moule a mini muffins': 'Moule à muffins',
  'moule a cannele': 'Moules individuels',
  'moule a mini madeleine': 'Moule à madeleines',
  'moule a mini tartelette': 'Moules individuels',
  'moule a soufle individuel': 'Ramequins',
  'moule a souffle individuel': 'Ramequins',
  'grand moule a souffle': 'Ramequins',
  'moule a empreinte': 'Moules individuels',
  'moule a gratin': 'Plat à four',
  'moule a pain de mie': 'Moule à cake',
  'moule moyen': 'Moule rond',
  'petit moule': 'Moule rond',
  'moule': 'Moule rond',
  'mini cocotte': 'Ramequins',
  'cercle plus petit pour l insert': 'Cercle à pâtisserie',
  'cercle inox': 'Cercle à pâtisserie',
  'cercle haut': 'Cercle à pâtisserie',
  'cercle': 'Cercle à pâtisserie',
  'petit cercle a entremet': 'Cercle à pâtisserie',
  'grille de refroidissement': 'Grille',
  'plaque perforee': 'Plaque de cuisson',
  'plaque antiadhesive': 'Plaque de cuisson',
  'grande plaque de cuisson': 'Plaque de cuisson',
  'trois plaque de cuisson': 'Plaque de cuisson',
  'deux plaque de cuisson': 'Plaque de cuisson',
  'plat a rotir': 'Plat à four',
  'plat allant au four': 'Plat à four',
  'plat profond': 'Plat à four',
  'plat e four': 'Plat à four',
  'plat hermetique': 'Bocal',
  'boite hermetique': 'Bocal',
  'bac ferme': 'Bocal',
  'pot propre': 'Bocal',
  'bocal haut': 'Bocal',
  'bocal a conserve': 'Bocal',
  'repe fine': 'Râpe',
  'robot coupe': 'Robot hachoir',
  'robot coupe puissant': 'Robot hachoir',
  'robot mixeur': 'Mixeur',
  'robot muni de la feuille': 'Robot pâtissier',
  'cuiseur vapeur': 'Cuit-vapeur',
  'recipient pour vapeur': 'Cuit-vapeur',
  'sterilisateur': 'Grande casserole',
  'poele gril': 'Barbecue ou plancha',
  'baguette': 'Fouet',
  'spatule coudee': 'Spatule',
  'spatule metallique rigide': 'Spatule',
  'couteau a pain': 'Couteau',
  'couteau long': 'Couteau',
  'couteau lisse': 'Couteau',
  'couteau a lame fine': 'Couteau',
  'cuillere parisienne': 'Couteau',
  'planche reservee a la viande crue': 'Planche à découper',
  'planche dediee au poisson': 'Planche à découper',
  'pic a brochette': 'Piques à brochettes',
  'brochette en bois': 'Piques à brochettes',
  'brochette metallique': 'Piques à brochettes',
  'petite brochette': 'Piques à brochettes',
  'brochette': 'Piques à brochettes',
  'thermometre de friture': 'Thermomètre de cuisson',
  'four vapeur': 'Thermomètre de cuisson',
  'deshydrateur': 'Four',
  'louche de degraissage': 'Louche',
  'poche sans douille': 'Poche à douille',
  'poche': 'Poche à douille',
  'tapis de cuisson perfore': 'Plaque de cuisson',
  'recipient resistant a la chaleur': 'Saladier',
  'saladier resistant a la chaleur': 'Saladier',
  'cuve de robot': 'Robot pâtissier',
  'siphon de 500ml compatible preparation froide': 'Siphon',
  'cartouche pour siphon': 'Siphon',
  'casserole a fond epais': 'Casserole',
  'casserole dont une haute pour le caramel': 'Casserole',
  'pot': 'Bocal',
  'bocaux a conserve': 'Bocal',
  'cercle haut 23 a 24cm': 'Cercle à pâtisserie',
  'petits cercles a entremets': 'Cercle à pâtisserie',
  'casseroles dont une haute pour le caramel': 'Casserole',
  'moule a cake de 26 10cm': 'Moule à cake',
  'moule 6 cakes hauts': 'Moule à cake',
  'couteau aiguise': 'Couteau',
  'siphon de 500ml compatible preparations froides': 'Siphon',
  'brochettes en bois': 'Piques à brochettes',
  'pinceau de cuisine': 'Pinceau',
  // Pas du materiel a sortir, ou deja implicite : retire.
  'cuillere': null,
  'cuillere solide': null,
  'fourchette': null,
  'linge propre': null,
  'assiette creuse': null,
  'trois assiette creuse': null,
  'grande assiette': null,
  'grande assiette plate': null,
  'coupe': null,
  'coupe a cocktail': null,
  'plateau creux': null,
  'couvercle pose': null,
  'longue allumette': null,
  'micro onde': null,
  'plan de travail': null,
  'torchon propre': null,
  'torchon': null,
  'couvercle': null,
  'assiette': null,
  'assiettes': null,
  'plat de service': null,
  'poids de cuisson': null,
  'petit pot ou papier cuisson': 'Bocal'
}));

// Detection depuis le texte normalise des etapes (S), des ingredients (I) et
// du titre (T). Chaque regle : [materiel, test(S, I, T)].
const has = (text, pattern) => pattern.test(text);
const DETECTION_RULES = [
  ['Couteau', (S, I) => has(S, /\b(couper|coupe[rz]?|emincer|emince|ciseler|cisele|hacher|tailler|trancher|detailler|decouper|peler|parer|desosser|inciser|fendre|en des|en rondelles|en lamelles|en brunoise|en julienne|en morceaux|en cubes|en quartiers|en tranches|en batonnets)\b/) || has(I, /\b(emince|emincee|emincees|cisele|ciselee|ciseles|hache|hachee|haches|hachees|en des|en rondelles|en lamelles|en brunoise|en cubes|en morceaux|en tranches|en quartiers)\b/)],
  ['Planche à découper', S => has(S, /\b(planche|planche a decouper)\b/)],
  ['Économe', S => has(S, /\b(eplucher|epluche[rz]?|econome)\b/)],
  ['Mandoline', S => has(S, /\bmandoline\b/)],
  ['Râpe', (S, I) => has(S, /\b(raper|rape[rz]?|zester|microplane)\b/) || has(I, /\b(rape|rapee|rapes|rapees|zeste)\b/)],
  ['Presse-ail', S => has(S, /\bpresse ail\b/)],
  ['Presse-agrumes', S => has(S, /\b(presser (le |les |un |des |la |l |le jus d |le jus de |les jus de )?(citrons?|oranges?|agrumes?|pamplemousses?|limes?)|presse agrumes?)\b/)],
  // Saladier : nomme, ou une phrase qui melange sans autre recipient (une
  // sauce montee dans la casserole n'en demande pas).
  ['Saladier', (S, I, T, sentences) => has(S, /\b(saladier|cul de poule|jatte)\b/) || sentences.some(sentence =>
    has(sentence, /\b(melanger|melangez|incorporer|delayer|mariner|petrir|reunir|combiner|assaisonner la salade)\b/)
    && !has(sentence, /\b(casserole|poele|cocotte|sauteuse|wok|four|plaque|plat|moule|mixeur|mixer|blender|robot|bol|feu|chaud|chauffer|cuire|cuisson)\b/))],
  ['Fouet', S => has(S, /\b(fouet|fouetter|fouettez|emulsionner|emulsion|monter (au fouet|en mayonnaise|avec l huile|l huile)|blanchir (les jaunes|les oeufs)|battre (les oeufs|les jaunes|l oeuf|les blancs))\b/)],
  ['Batteur électrique', S => has(S, /\b(batteur|blancs en neige|monter les blancs|fouetter les blancs|blancs mousseux|meringue|monter la creme|monter en chantilly|en chantilly|bec d oiseau|ferme et brillant|ruban|creme au beurre)\b/)],
  ['Robot pâtissier', S => has(S, /\b(robot patissier|robot petrisseur|au robot (avec le crochet|a la feuille)|crochet|petrir \d+ ?min|petrissage)\b/)],
  ['Robot hachoir', S => has(S, /\b(hachoir|robot hachoir|robot coupe|hacher au robot)\b/)],
  ['Mixeur plongeant', S => has(S, /\b(mixeur plongeant|plongeant)\b/)],
  ['Mixeur', S => has(S, /\b(mixer|mixeur|blender|mixe|mixee|mixees|mixes)\b/) && !has(S, /\b(mixeur plongeant|plongeant)\b/)],
  ['Mortier', S => has(S, /\b(mortier|piler|pilon)\b/)],
  ['Passoire fine', S => has(S, /\b(filtrer|chinois|passoire fine|passer au tamis fin|passer la sauce|passer le jus|passer le bouillon)\b/)],
  ['Passoire', S => has(S, /\b(egoutter|egouttez|passoire|rincer)\b/)],
  ['Tamis', S => has(S, /\b(tamiser|tamis)\b/)],
  ['Presse-purée', S => has(S, /\b(presse puree|moulin a legumes|ecraser (les pommes de terre|en puree|a la fourchette en puree))\b/)],
  ['Grande casserole', S => has(S, /\b(grande casserole|faitout|marmite|grand volume d eau|eau bouillante salee|cuire les pates|pates al dente)\b/)],
  ['Casserole', S => has(S, /\b(casserole|porter a ebullition|porter a fremissement|faire bouillir|fremir|fremissant|bouillir|bouillant|blanchir \d|reduire (de moitie|jusqu|a feu)|faire fondre|fondre le chocolat|chauffer (le lait|la creme|le sirop|l eau|le beurre)|caramel|sirop|creme anglaise|napper|nappante|epaissir)\b/) && !has(S, /\b(grande casserole|faitout|marmite)\b/)],
  ['Poêle', S => has(S, /\b(poele|poeler|poelee|saisir|rissoler|faire sauter|sauter (les|a feu)|faire revenir|revenir (les|l|le|la)|dorer a la poele|torrefier|griller a sec|crepe|crepes|galette)\b/)],
  ['Sauteuse', S => has(S, /\bsauteuse\b/)],
  ['Cocotte', S => has(S, /\b(cocotte|braiser|braise|cuire a l etouffee|ragout|daube|bourguignon|blanquette|navarin|tajine|pot au feu|couvrir et enfourner)\b/)],
  ['Wok', S => has(S, /\bwok\b/)],
  ['Friteuse ou casserole haute', (S, I, T) => has(S, /\b(friture|frire|faire frire|friteuse|bain d huile|bain de friture|huile chaude a 1[5-9]0|huile a 1[5-9]0|chauffer l huile a 1[5-9]0|plonger dans l huile|cuire dans l huile chaude|huile de friture|frire a 1[5-9]0)\b/) || (has(T, /\b(frites|beignets?|churros|accras|acras|tempura|donuts?|croquettes|nems|samoussas?|fish and chips)\b/) && has(S, /\b(huile|blanc de boeuf|graisse|saindoux)\b/) && has(S, /\b1[4-9]\d ?°? ?c\b/))],
  ['Cuit-vapeur', S => has(S, /\b(cuit vapeur|panier vapeur|cuire a la vapeur|cuisson vapeur|cuire vapeur)\b/)],
  ['Barbecue ou plancha', S => has(S, /\b(au barbecue|sur le barbecue|le barbecue|plancha|braises|sur le gril|au gril)\b/) && !has(S, /\bsauce barbecue\b/)],
  ['Gaufrier', S => has(S, /\bgaufrier\b/)],
  ['Four', S => (has(S, /\b(four|enfourner|enfournez|prechauffer|prechauffez|gratiner|gratinez|cuire au four|rotir)\b/) && !has(S, /\bpetits? fours?\b/)) || (has(S, /\b(cuire|cuisson|dorer)\b[^.]{0,40}\b(1[4-9]\d|2[0-6]\d) ?°? ?c\b/) && !has(S, /\b(friture|frire|huile)\b/))],
  ['Plaque de cuisson', S => has(S, /\b(plaque|plaques|tapis silicone)\b/)],
  ['Plat à four', S => has(S, /\b(plat a four|plat a gratin|plat allant au four|le plat beurre|plat a rotir|bain marie au four)\b/)],
  ['Moule à tarte', (S, I, T) => has(S, /\b(moule a tarte|cercle a tarte|foncer|foncez)\b/) || has(T, /\b(tarte|tartelettes?|quiche)\b/)],
  ['Moule à cake', (S, I, T) => has(S, /\bmoule a cake\b/) || (has(T, /\bcake\b/) && has(S, /\bmoule\b/))],
  ['Moule rond', S => has(S, /\b(moule a manque|moule rond|moule a charniere|moule de \d+ ?cm|moule beurre)\b/)],
  ['Moule à muffins', (S, I, T) => has(S, /\bmoule a muffins?\b/) || (has(T, /\b(muffins?|cupcakes?)\b/) && has(S, /\bmoule/))],
  ['Moule à madeleines', (S, I, T) => has(S, /\bmoule a madeleines?\b/) || has(T, /\bmadeleines?\b/)],
  ['Moule à savarin', S => has(S, /\b(moule a savarin|moule a kouglof|moule a baba)\b/)],
  ['Moules individuels', S => has(S, /\b(moules individuels|moules a financiers|moules a canneles|empreintes)\b/)],
  ['Ramequins', S => has(S, /\bramequins?\b/)],
  ['Cercle à pâtisserie', S => has(S, /\b(cercle a entremets|cercle a patisserie|cercles? inox|emporte piece)\b/)],
  ['Terrine', (S, I, T) => has(S, /\bterrine\b/) || has(T, /\bterrine\b/)],
  ['Rouleau à pâtisserie', S => has(S, /\b(etaler la pate|etaler le pate|etaler la pate|abaisser|abaisse|rouleau a patisserie|au rouleau|laminer)\b/)],
  ['Papier cuisson', S => has(S, /\b(papier cuisson|papier sulfurise)\b/)],
  ['Film alimentaire', S => has(S, /\b(film alimentaire|filmer|filme au contact|au contact)\b/)],
  ['Pinceau', S => has(S, /\b(pinceau|badigeonner|badigeonnez|dorer a l oeuf|dorure|lustrer)\b/)],
  ['Spatule', S => has(S, /\b(spatule|maryse|racler|incorporer delicatement|lisser la surface|lisser le dessus)\b/)],
  ['Louche', S => has(S, /\b(louche|louchee)\b/)],
  ['Écumoire', S => has(S, /\b(ecumoire|ecumer|araignee|friture|frire|bain d huile|bain de friture|huile a 1[5-9]0)\b/)],
  ['Pince', S => has(S, /\b(pince|retourner (les|la|le) (viande|brochettes|morceaux|cuisses|cotes|steaks?|poulet))\b/)],
  ['Thermomètre de cuisson', S => has(S, /\b(thermometre|sonde|a coeur|friture|frire a 1[5-9]0|huile a 1[5-9]0)\b/) || has(S, /\b1[12]\d ?°? ?c\b/)],
  ['Poche à douille', S => has(S, /\b(poche a douille|poche|douille|dresser a la poche|coucher des|dresser des (choux|eclairs|meringues|macarons)|pocher la pate|pocher des (choux|eclairs|meringues|macarons))\b/) && !has(S, /\b(oeufs? poches?|pocher (les oeufs|l oeuf|le poisson|les poires|dans))\b/)],
  ['Grille', S => has(S, /\b(refroidir sur (une )?grille|grille de refroidissement|egoutter sur (une )?grille|demouler sur (une )?grille)\b/)],
  ['Papier absorbant', S => has(S, /\b(papier absorbant|friture|frire|bain d huile|bain de friture|huile a 1[5-9]0)\b/)],
  ['Piques à brochettes', (S, I, T) => has(S, /\b(piques?|brochettes?|embrocher)\b/) || has(T, /\bbrochettes?\b/)],
  ['Siphon', S => has(S, /\bsiphon\b/)],
  ['Sorbetière', S => has(S, /\b(sorbetiere|turbiner)\b/)],
  ['Machine à pâtes', S => has(S, /\b(machine a pates|laminoir)\b/)],
  ['Bocal', S => has(S, /\b(bocal|bocaux|pot hermetique|boite hermetique|steriliser)\b/)],
  ['Verrines', S => has(S, /\bverrines?\b/)]
];

// Liste propre d'une fiche : materiel declare (ramene au vocabulaire) +
// materiel detecte dans le texte ; dedoublonne, ordonne, plafonne.
const EQUIPMENT_MAX = 9;

// Precisions qui ne changent pas l'outil a sortir (taille, nombre, option).
const QUALIFIERS = /\b(optionnel|optionnelle|optionnels|optionnelles|facultatif|facultative|facultatifs|conseille|conseillee|propre|propres|avec couvercle|allant au four|a fond epais|a bords hauts|epais|epaisse|large|larges|lourd|lourde|moyen|moyenne|grand|grande|grands|grandes|petit|petite|petits|petites|tres|bien|puissant|souple|munie? de la feuille|avec crochet|avec protege doigts|en fonte|antiadhesive?|haut|haute|basse|stable|precis|de \d+ ?(?:a \d+ ?)?(?:cm|ml)|\d+ ?x ?\d+ ?cm|\d+ ?cm)\b/g;
const singular = text => text.split(' ').map(word => (word.length > 3 ? word.replace(/(?<=[^s])[sx]$/, '') : word)).join(' ');

function lookup(key) {
  if (DECLARED_SYNONYMS.has(key)) return DECLARED_SYNONYMS.get(key);
  const exact = EQUIPMENT.find(name => normalize(name) === key);
  return exact || undefined;
}

// « Moule à cake de 26 × 10cm », « 4 petits ramequins », « Batteur ou fouet » :
// on retire nombre et precisions, on essaie chaque alternative dans l'ordre.
function canonicalDeclared(item) {
  const key = normalize(item);
  const direct = lookup(key);
  if (direct !== undefined) return direct;
  let sawNull = false;
  for (const alternative of key.split(/ ou | et /)) {
    const withoutCount = alternative.replace(/^(?:\d+|deux|trois|quatre|six|huit|dix)(?: a \d+)? /, '');
    const cleaned = withoutCount.replace(QUALIFIERS, ' ').replace(/\s+/g, ' ').trim();
    for (const candidate of [alternative, withoutCount, cleaned, singular(cleaned)]) {
      const found = lookup(candidate);
      if (found) return found;
      if (found === null) sawNull = true;
    }
  }
  return sawNull ? null : undefined;
}

function deriveEquipment({ title = '', steps = [], items = [], declared = [] }) {
  const S = normalize(steps.join(' '));
  const I = normalize(items.join(' '));
  const T = normalize(title);
  const sentences = steps.flatMap(step => String(step || '').split(/[.;:!?]\s+/)).map(normalize).filter(Boolean);
  const found = new Set();
  const unknown = [];
  declared.forEach(item => {
    const canonical = canonicalDeclared(item);
    if (canonical === undefined) unknown.push(item);
    else if (canonical) found.add(canonical);
  });
  DETECTION_RULES.forEach(([name, test]) => {
    if (EQUIPMENT_SET.has(name) && test(S, I, T, sentences)) found.add(name);
  });
  // Coherences : la plaque ou le plat a four supposent le four ; une friteuse
  // remplace la casserole ; le mixeur plongeant remplace le mixeur.
  if (found.has('Plaque de cuisson') && !found.has('Four') && !has(S, /\b(four|enfourner)\b/)) found.delete('Plaque de cuisson');
  if (found.has('Mixeur plongeant')) found.delete('Mixeur');
  if (found.has('Moule à tarte')) found.delete('Moule rond');
  // Plat a four ou moule a gateau d'une recette cuite : le four va avec.
  const baked = ['Plat à four', 'Moule à tarte', 'Moule à cake', 'Moule rond', 'Moule carré', 'Moule à muffins', 'Moule à madeleines', 'Moule à savarin'].some(name => found.has(name));
  if (baked && has(S, /\b(cuire|cuisson|enfourner|gratiner|dorer|°c)\b/) && !has(S, /\b(sans cuisson|au frais|refrigerateur|congelateur)\b/)) found.add('Four');
  if (found.has('Planche à découper') && !found.has('Couteau')) found.delete('Planche à découper');
  if (found.has('Grande casserole') && !has(S, /\b(casserole|sauce|fondre|caramel|sirop)\b/)) found.delete('Casserole');
  const ordered = EQUIPMENT.filter(name => found.has(name));
  return { equipment: ordered.slice(0, EQUIPMENT_MAX), unknown };
}

module.exports = { EQUIPMENT, EQUIPMENT_SET, EQUIPMENT_MAX, DECLARED_SYNONYMS, normalize, canonicalDeclared, deriveEquipment };
