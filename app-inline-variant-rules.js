/* Curated inline-variant composition rules. Keep these rules small and explicit. */
(function initCookNoteInlineVariantRules(global) {
  'use strict';
  global.COOK_NOTE_INLINE_VARIANT_RULES = Object.freeze({
    oeufs_mimosa_variantes: Object.freeze({
      sharedGroups: Object.freeze([0, 4]),
      options: Object.freeze([
        Object.freeze({ key: 'betterave', label: 'Betterave', groups: Object.freeze([1, 2]) }),
        Object.freeze({ key: 'avocat_crevette', label: 'Avocat crevette', groups: Object.freeze([3]) })
      ])
    }),
    beignets_calamar: Object.freeze({
      sharedGroups: Object.freeze([]),
      options: Object.freeze([
        Object.freeze({ key: 'calamari', label: 'Calamari', groups: Object.freeze([0, 1, 2]) })
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
