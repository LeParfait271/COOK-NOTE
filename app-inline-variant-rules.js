/* Curated inline-variant composition rules. Keep these rules small and explicit. */
(function initCookNoteInlineVariantRules(global) {
  'use strict';
  global.COOK_NOTE_INLINE_VARIANT_RULES = Object.freeze({
    cocktails_variantes: Object.freeze({
      sharedGroups: Object.freeze([]),
      options: Object.freeze([
        Object.freeze({ key: 'whisky_sour', label: 'Whisky sour', groups: Object.freeze([0]) }),
        Object.freeze({ key: 'whisky_sour_a_l_erable', label: 'Whisky sour à l’érable', groups: Object.freeze([1]) }),
        Object.freeze({ key: 'old_fashioned', label: 'Old fashioned', groups: Object.freeze([2]) }),
        Object.freeze({ key: 'manhattan', label: 'Manhattan', groups: Object.freeze([3]) }),
        Object.freeze({ key: 'sazerac', label: 'Sazerac', groups: Object.freeze([4]) }),
        Object.freeze({ key: 'boulevardier', label: 'Boulevardier', groups: Object.freeze([5]) }),
        Object.freeze({ key: 'lynchburg_lemonade', label: 'Lynchburg lemonade', groups: Object.freeze([6]) }),
        Object.freeze({ key: 'negroni', label: 'Negroni', groups: Object.freeze([7]) }),
        Object.freeze({ key: 'gin_fizz', label: 'Gin fizz', groups: Object.freeze([8]) }),
        Object.freeze({ key: 'gin_fizz_a_la_pomme', label: 'Gin fizz à la pomme', groups: Object.freeze([9]) }),
        Object.freeze({ key: 'pomada', label: 'Pomada', groups: Object.freeze([10]) }),
        Object.freeze({ key: 'singapore_sling', label: 'Singapore sling', groups: Object.freeze([11]) }),
        Object.freeze({ key: 'cosmopolitan', label: 'Cosmopolitan', groups: Object.freeze([12]) }),
        Object.freeze({ key: 'moscow_mule', label: 'Moscow mule', groups: Object.freeze([13]) }),
        Object.freeze({ key: 'bloody_mary', label: 'Bloody mary', groups: Object.freeze([14]) }),
        Object.freeze({ key: 'blue_lagoon', label: 'Blue lagoon', groups: Object.freeze([15]) }),
        Object.freeze({ key: 'peche_originel', label: 'Péché originel', groups: Object.freeze([16]) }),
        Object.freeze({ key: 'daiquiri', label: 'Daïquiri', groups: Object.freeze([17]) }),
        Object.freeze({ key: 'daiquiri_a_la_fraise', label: 'Daïquiri à la fraise', groups: Object.freeze([18]) }),
        Object.freeze({ key: 'dark_and_stormy', label: 'Dark and stormy', groups: Object.freeze([19]) }),
        Object.freeze({ key: 'ti_punch', label: 'Ti-punch', groups: Object.freeze([20]) }),
        Object.freeze({ key: 'caipirinha', label: 'Caïpirinha', groups: Object.freeze([21]) }),
        Object.freeze({ key: 'pisco_sour', label: 'Pisco sour', groups: Object.freeze([22]) }),
        Object.freeze({ key: 'margarita', label: 'Margarita', groups: Object.freeze([23]) }),
        Object.freeze({ key: 'cognac_sour', label: 'Cognac sour', groups: Object.freeze([24]) }),
        Object.freeze({ key: 'cognac_orange_et_miel', label: 'Cognac, orange et miel', groups: Object.freeze([25]) }),
        Object.freeze({ key: 'horse_s_neck', label: 'Horse’s neck', groups: Object.freeze([26]) }),
        Object.freeze({ key: 'cognac_tonic_au_cassis', label: 'Cognac tonic au cassis', groups: Object.freeze([27]) }),
        Object.freeze({ key: 'mojito_classique', label: 'Mojito classique', groups: Object.freeze([28]) }),
        Object.freeze({ key: 'mojito_framboise', label: 'Mojito framboise', groups: Object.freeze([29]) }),
        Object.freeze({ key: 'mojito_mangue', label: 'Mojito mangue', groups: Object.freeze([30]) }),
        Object.freeze({ key: 'mojito_concombre', label: 'Mojito concombre', groups: Object.freeze([31]) }),
        Object.freeze({ key: 'mojito_fruit_de_la_passion', label: 'Mojito fruit de la passion', groups: Object.freeze([32]) }),
        Object.freeze({ key: 'mojito_rhum_ambre', label: 'Mojito rhum ambré', groups: Object.freeze([33]) }),
        Object.freeze({ key: 'mojito_en_carafe', label: 'Mojito en carafe', groups: Object.freeze([34]) }),
        Object.freeze({ key: 'pineaujito', label: 'Pineaujito', groups: Object.freeze([35]) }),
        Object.freeze({ key: 'sunflower', label: 'Sunflower', groups: Object.freeze([36]) }),
        Object.freeze({ key: 'lillet_tonic_aux_framboises', label: 'Lillet tonic aux framboises', groups: Object.freeze([37]) }),
        Object.freeze({ key: 'sauternes_petillant', label: 'Sauternes pétillant', groups: Object.freeze([38]) }),
        Object.freeze({ key: 'spritz', label: 'Spritz', groups: Object.freeze([39]) }),
        Object.freeze({ key: 'spritz_au_campari', label: 'Spritz au campari', groups: Object.freeze([40]) }),
        Object.freeze({ key: 'bellini', label: 'Bellini', groups: Object.freeze([41]) }),
        Object.freeze({ key: 'mimosa', label: 'Mimosa', groups: Object.freeze([42]) }),
        Object.freeze({ key: 'sangria_rouge', label: 'Sangria rouge', groups: Object.freeze([43]) }),
        Object.freeze({ key: 'sangria_blanche_au_cidre', label: 'Sangria blanche au cidre', groups: Object.freeze([44]) }),
        Object.freeze({ key: 'tinto_de_verano', label: 'Tinto de verano', groups: Object.freeze([45]) }),
        Object.freeze({ key: 'grog', label: 'Grog', groups: Object.freeze([46]) }),
        Object.freeze({ key: 'creme_de_whisky', label: 'Crème de whisky', groups: Object.freeze([47]) }),
        Object.freeze({ key: 'rhum_arrange_aux_litchis', label: 'Rhum arrangé aux litchis', groups: Object.freeze([48]) })
      ])
    }),
    cocktails_sans_alcool_variantes: Object.freeze({
      sharedGroups: Object.freeze([]),
      options: Object.freeze([
        Object.freeze({ key: 'lait_de_poule', label: 'Lait de poule', groups: Object.freeze([0]) }),
        Object.freeze({ key: 'mojito_sans_alcool', label: 'Mojito sans alcool', groups: Object.freeze([1]) }),
        Object.freeze({ key: 'kvas', label: 'Kvas', groups: Object.freeze([2]) }),
        Object.freeze({ key: 'fraise_et_menthe', label: 'Fraise et menthe', groups: Object.freeze([3]) }),
        Object.freeze({ key: 'pamplemousse_et_the_vert', label: 'Pamplemousse et thé vert', groups: Object.freeze([4]) }),
        Object.freeze({ key: 'peche_et_abricot', label: 'Pêche et abricot', groups: Object.freeze([5]) }),
        Object.freeze({ key: 'margarita_sans_alcool', label: 'Margarita sans alcool', groups: Object.freeze([6]) }),
        Object.freeze({ key: 'pasteque_et_citron_vert', label: 'Pastèque et citron vert', groups: Object.freeze([7]) }),
        Object.freeze({ key: 'sex_on_the_beach_sans_alcool', label: 'Sex on the beach sans alcool', groups: Object.freeze([8]) }),
        Object.freeze({ key: 'pink_cocktail_au_the_vert', label: 'Pink cocktail au thé vert', groups: Object.freeze([9]) }),
        Object.freeze({ key: 'the_et_jus_de_pomme', label: 'Thé et jus de pomme', groups: Object.freeze([10]) }),
        Object.freeze({ key: 'groseille_et_cassis', label: 'Groseille et cassis', groups: Object.freeze([11]) }),
        Object.freeze({ key: 'lagon_bleu_sans_alcool', label: 'Lagon bleu sans alcool', groups: Object.freeze([12]) }),
        Object.freeze({ key: 'pamplemousse_petillant', label: 'Pamplemousse pétillant', groups: Object.freeze([13]) }),
        Object.freeze({ key: 'the_noir_cassis_et_orange', label: 'Thé noir, cassis et orange', groups: Object.freeze([14]) }),
        Object.freeze({ key: 'sangria_sans_alcool', label: 'Sangria sans alcool', groups: Object.freeze([15]) }),
        Object.freeze({ key: 'pina_colada_sans_alcool', label: 'Piña colada sans alcool', groups: Object.freeze([16]) })
      ])
    }),
    oeufs_mimosa_variantes: Object.freeze({
      sharedGroups: Object.freeze([0, 5]),
      options: Object.freeze([
        Object.freeze({ key: 'betterave', label: 'Betterave', groups: Object.freeze([1, 2]) }),
        Object.freeze({ key: 'avocat_crevette', label: 'Avocat crevette', groups: Object.freeze([3]) }),
        Object.freeze({ key: 'lard_fume', label: 'Lard fumé', groups: Object.freeze([4]) })
      ])
    }),
    paella_royale: Object.freeze({
      sharedGroups: Object.freeze([]),
      options: Object.freeze([
        Object.freeze({ key: 'royale', label: 'Royale', groups: Object.freeze([0]) }),
        Object.freeze({ key: 'fruits_de_mer', label: 'Fruits de mer et chorizo', groups: Object.freeze([1, 2]) })
      ])
    }),
    // Les etapes de la fiche couvrent les deux pates : elles restent communes.
    beignets_calamar: Object.freeze({
      sharedGroups: Object.freeze([0, 2]),
      useRecipeSteps: true,
      options: Object.freeze([
        Object.freeze({ key: 'pate_legere', label: 'Pâte légère', groups: Object.freeze([1]) }),
        Object.freeze({ key: 'tempura', label: 'Tempura', groups: Object.freeze([3]) })
      ])
    }),
    toppings_frites: Object.freeze({
      sharedGroups: Object.freeze([0]),
      options: Object.freeze([
        Object.freeze({ key: 'sel_poivre', label: 'Sel et poivre', groups: Object.freeze([1]) }),
        Object.freeze({ key: 'ail_parmesan', label: 'Ail, parmesan et persil', groups: Object.freeze([2]) }),
        Object.freeze({ key: 'cheddar', label: 'Cheddar et oignons verts', groups: Object.freeze([3, 4]) }),
        Object.freeze({ key: 'paprika', label: 'Paprika et cayenne', groups: Object.freeze([5]) }),
        Object.freeze({ key: 'cheddar_bacon', label: 'Cheddar, bacon et crème aigre', groups: Object.freeze([6, 7]) }),
        Object.freeze({ key: 'patate_douce', label: 'Patate douce paprika et ail', groups: Object.freeze([8, 9]) })
      ])
    })
  });
})(window);
