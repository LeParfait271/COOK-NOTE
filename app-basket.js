// ---------- Panier de courses ----------
// Panneau de la liste de courses (rayons, ajouts a la main, partage, QR),
// sorti de app-panels.js pour son poids.
function shoppingOutputNodes(value) {
  return String(value || '').split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return h('br', { key: `space-${index}`, 'aria-hidden': true });
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      return h(level === 1 ? 'h3' : 'h4', { key: `heading-${index}`, className: `cart-output-heading cart-output-heading-${level}` }, heading[2]);
    }
    const bullet = trimmed.match(/^-\s+(.+)$/);
    if (bullet) {
      return h('div', { key: `bullet-${index}`, className: 'cart-output-line' },
        h('span', { className: 'cart-output-bullet', 'aria-hidden': true }, '\u2022 '),
        bullet[1]
      );
    }
    return h('div', { key: `line-${index}`, className: 'cart-output-line' }, line);
  });
}

function ShoppingTransferQr({ url }) {
  const canvasRef = useRef(null);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setQrReady(false);
    if (!url || !canvasRef.current) return () => {
      cancelled = true;
    };
    loadDeferredScript(QR_CODE_SCRIPT_SRC, 'QRCode').then(QRCode => {
      // Meme QR soigne que le partage de fiche (points ronds, etoile au centre).
      if (cancelled || !canvasRef.current || !QRCode?.create) return null;
      return drawFineQr(canvasRef.current, QRCode, url, 196);
    }).then(result => {
      if (!cancelled && result !== null) setQrReady(true);
    }).catch(() => {
      if (!cancelled) setQrReady(false);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return h('div', { className: 'shopping-transfer', role: 'region', 'aria-label': 'Envoyer la liste sur un autre appareil' },
    h('div', { className: qrReady ? 'share-qr is-ready' : 'share-qr' },
      h('canvas', { ref: canvasRef, className: 'qr-canvas', width: 196, height: 196, 'aria-label': 'QR code de la liste de courses' }),
      !qrReady && h('span', null, tc('Préparation…'))
    ),
    h('p', null, tc('Scanne ce code avec l’appareil photo du téléphone : la liste s’ouvre dans Cook Note, prête pour le magasin.'))
  );
}

function ShoppingBasketPanel({ open, onClose, recipes, recipesComplete = true, factorById, transferUrl = '', pantryItems = [], removeRecipe, setRecipeFactor, clearShopping, notify }) {
  // Accessibility contracts retained for the UI audit: 'aria-label': `Retirer ${recipe.title} du panier courses`; 'aria-label': `${checked ? 'Décocher' : 'Cocher'} ${[amount, item.name].filter(Boolean).join(' ')}`; 'aria-label': `Marquer ${item.name} comme déjà à la maison`; 'aria-label': `Remettre ${item.name} dans la liste à acheter`.
  const [copied, setCopied] = useState(false);
  const [freshOnly, setFreshOnly] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(() => readJson(STORAGE_KEYS.shoppingChecked, {}));
  const [ownedItems, setOwnedItems] = useState(() => readJson(STORAGE_KEYS.shoppingOwned, {}));
  const [stapleItems, setStapleItems] = useState(() => readJson(STORAGE_KEYS.shoppingStaples, {}));
  // Articles ajoutes a la main (hors recettes), gardes sur l'appareil.
  const [extraItems, setExtraItems] = useState(() => readJson('cook_note_shopping_extra', []));
  const [extraDraft, setExtraDraft] = useState('');
  const saveExtra = next => {
    setExtraItems(next);
    writeJson('cook_note_shopping_extra', next);
  };
  const shoppingData = useMemo(() => open ? buildShoppingListData(recipes, factorById) : EMPTY_SHOPPING_DATA, [open, recipes, factorById]);
  const effectiveOwned = useMemo(() => shoppingOwnedWithStaples(shoppingData.groupedItems, ownedItems, stapleItems), [shoppingData, ownedItems, stapleItems]);
  const activeShoppingData = useMemo(() => open ? filterShoppingListData(shoppingData, effectiveOwned, pantryItems) : EMPTY_SHOPPING_DATA, [open, shoppingData, effectiveOwned, pantryItems]);
  const scopedShoppingData = useMemo(() => freshOnly ? filterFreshShoppingData(activeShoppingData) : activeShoppingData, [freshOnly, activeShoppingData]);
  const batchPlan = useMemo(() => open ? getBatchPlanData(recipes) : [], [open, recipes]);
  const rawText = open && recipes.length
    ? freshOnly ? shoppingListTextFromData(scopedShoppingData, 'fresh') : shoppingListText(recipes, factorById, effectiveOwned, 'detailed', pantryItems)
    : 'Liste de courses Cook Note\n\nAucune recette cochée.';
  const extraText = extraItems.length ? `\n\n## ${tc('Ajouts')}\n${extraItems.map(item => `- ${item}`).join('\n')}` : '';
  const text = rawText + extraText;
  const rawCompactText = open && recipes.length
    ? freshOnly ? shoppingListTextFromData(scopedShoppingData, 'fresh') : shoppingListText(recipes, factorById, effectiveOwned, 'compact', pantryItems)
    : 'Courses Cook Note\nAucune recette.';
  const compactText = rawCompactText + (extraItems.length ? `\n${extraItems.join(', ')}` : '');
  const visibleShoppingKeys = useMemo(() => new Set(shoppingData.groupedItems.map(item => item.key)), [shoppingData]);
  const checkedCount = scopedShoppingData.groupedItems.filter(item => checkedItems[item.key]).length;
  const handledCount = checkedCount + scopedShoppingData.ownedGroupedItems.length;
  const totalShoppingCount = scopedShoppingData.groupedItems.length + scopedShoppingData.ownedGroupedItems.length;
  const handledRatio = totalShoppingCount ? Math.round((handledCount / totalShoppingCount) * 100) : 0;
  const freshAisleCount = scopedShoppingData.aisleGroups
    .filter(group => /primeur|cremerie|oeufs|boucherie|poissonnerie/.test(normalizeText(group.label)))
    .reduce((total, group) => total + group.items.length, 0);
  const setShoppingChecked = updater => {
    setCheckedItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJson(STORAGE_KEYS.shoppingChecked, next);
      return next;
    });
  };
  const shareText = () => {
    if (navigator.share) {
      navigator.share({ title: 'Liste de courses Cook Note', text }).then(() => notify?.('Partage de la liste ouvert')).catch(() => {});
    } else {
      copyText(text).then(() => {
        setCopied(true);
        notify?.('Liste de courses copiée');
      });
    }
  };
  const setOwnedShoppingItems = updater => {
    setOwnedItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJson(STORAGE_KEYS.shoppingOwned, next);
      return next;
    });
  };
  const setStaples = updater => {
    setStapleItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJson(STORAGE_KEYS.shoppingStaples, next);
      return next;
    });
  };
  const isStaple = item => Boolean(stapleItems[shoppingStapleKey(item)]);
  const toggleOwnedItem = key => {
    setOwnedShoppingItems(prev => {
      const next = { ...(prev || {}) };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };
  // Remettre a acheter : retire aussi l'article du placard, sinon il resterait
  // range d'office.
  const putBackItem = item => {
    if (isStaple(item)) {
      setStaples(prev => {
        const next = { ...(prev || {}) };
        delete next[shoppingStapleKey(item)];
        return next;
      });
    }
    setOwnedShoppingItems(prev => {
      const next = { ...(prev || {}) };
      delete next[item.key];
      return next;
    });
  };
  const toggleStaple = item => {
    const key = shoppingStapleKey(item);
    const staple = isStaple(item);
    setStaples(prev => {
      const next = { ...(prev || {}) };
      if (staple) delete next[key];
      else next[key] = true;
      return next;
    });
    // Sorti du placard : reste « deja a la maison » pour ce panier.
    if (staple) setOwnedShoppingItems(prev => ({ ...(prev || {}), [item.key]: true }));
    notify?.(staple ? `${item.name} n’est plus gardé au placard` : `${item.name} : toujours au placard`);
  };
  // Le panier vide oublie les « J'ai deja » de cette liste, pas le placard.
  const clearBasket = () => {
    setOwnedShoppingItems({});
    clearShopping();
  };

  useEffect(() => {
    if (open) setCopied(false);
  }, [open, recipes.length]);

  // Nettoie les coches d'articles disparus, seulement une fois toutes les
  // recettes du panier chargees : apres un rechargement, le catalogue arrive en
  // differe et les coches etaient effacees avant que leurs articles reviennent.
  useEffect(() => {
    if (!open || !recipesComplete) return;
    setShoppingChecked(prev => {
      const next = {};
      Object.entries(prev || {}).forEach(([key, value]) => {
        if (visibleShoppingKeys.has(key) && value) next[key] = true;
      });
      return next;
    });
  }, [open, recipesComplete, visibleShoppingKeys]);

  if (!open) return null;
  return h(ModalDialog, { className: '', onClose: onClose },
    h('section', { className: 'modal-panel shopping-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'shopping-modal-title', tabIndex: -1, onKeyDown: trapModalFocus, onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, tc('Panier courses')),
          h('h2', { id: 'shopping-modal-title' }, (recipes.length ? `${recipes.length} recette${recipes.length > 1 ? 's' : ''} cochée${recipes.length > 1 ? 's' : ''}` : 'Aucune recette'))
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      recipes.length
        ? h('div', { className: 'shopping-picked' },
            recipes.map(recipe => h('div', { key: recipe.id, className: 'shopping-picked-item' },
              h('span', { className: 'shopping-picked-title' }, recipe.title),
              setRecipeFactor && h(QuantityFactorControl, {
                recipe,
                factor: factorById?.[recipe.id] || 1,
                setFactor: factor => setRecipeFactor(recipe.id, factor),
                className: 'shopping-picked-quantity'
              }),
              h('a', { className: 'shopping-bring', href: `https://api.getbring.com/rest/bringrecipes/deeplink?url=${encodeURIComponent(`${window.location.origin}${getRecipeUrl(recipe.id)}`)}&source=web`, target: '_blank', rel: 'noreferrer', title: tc('Envoyer cette recette dans l’application Bring!'), 'aria-label': `${tc('Envoyer dans Bring!')} : ${tc(recipe.title)}` }, 'Bring!'),
              h('button', {
                type: 'button',
                className: 'shopping-picked-remove',
                onClick: () => removeRecipe(recipe.id),
                title: 'Retirer du panier courses',
                'aria-label': ('Retirer ' + recipe.title + ' du panier courses')
              }, '×')
            ))
          )
        : h('p', { className: 'muted' }, tc('Ajoute une recette depuis sa fiche pour construire une liste groupée.')),
      // Progression : une ligne de chiffres, une barre, deux filtres.
      recipes.length > 0 && h('div', { className: 'shopping-progress', style: { '--shopping-progress': `${handledRatio}%` }, 'aria-label': 'Avancement des courses' },
        h('div', { className: 'shopping-progress-line' },
          h('strong', null, `${scopedShoppingData.groupedItems.length - checkedCount} à prendre`),
          h('span', null, [
            `${checkedCount} coché${checkedCount > 1 ? 's' : ''}`,
            scopedShoppingData.ownedGroupedItems.length ? `${scopedShoppingData.ownedGroupedItems.length} déjà maison` : '',
            `${scopedShoppingData.aisleGroups.length} rayon${scopedShoppingData.aisleGroups.length > 1 ? 's' : ''}`
          ].filter(Boolean).join(' · ')),
          h('em', null, `${handledRatio} %`)
        ),
        h('div', { className: 'shopping-progress-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': handledRatio, 'aria-label': `${handledRatio} % des courses faites` }, h('i', null)),
        h('div', { className: 'shopping-progress-tools' },
          h('button', {
            type: 'button',
            className: freshOnly ? 'active' : '',
            'aria-pressed': freshOnly,
            onClick: () => setFreshOnly(value => !value)
          }, freshOnly ? 'Tout afficher' : `Frais seulement${freshAisleCount ? ` (${freshAisleCount})` : ''}`),
          checkedCount > 0 && h('button', { type: 'button', onClick: () => setShoppingChecked({}), 'aria-label': `Tout décocher (${checkedCount} article${checkedCount > 1 ? 's' : ''})` }, 'Tout décocher')
        )
      ),
      h('form', { className: 'shopping-extra-form', onSubmit: event => { event.preventDefault(); const value = extraDraft.trim(); if (value && !extraItems.includes(value)) saveExtra([...extraItems, value]); setExtraDraft(''); } },
        h('input', { type: 'text', value: extraDraft, placeholder: tc('Ajouter un article…'), 'aria-label': tc('Ajouter un article à la liste'), onChange: event => setExtraDraft(event.target.value) }),
        h('button', { type: 'submit', disabled: !extraDraft.trim() }, tc('Ajouter'))
      ),
      extraItems.length > 0 && h('section', { className: 'shopping-aisle shopping-extra' },
        h('div', { className: 'shopping-aisle-head' }, h('strong', null, tc('Ajouts')), h('span', null, `${extraItems.length} ${extraItems.length > 1 ? tc('articles') : tc('article')}`)),
        extraItems.map(item => {
          const key = `extra:${item}`;
          const checked = Boolean(checkedItems[key]);
          return h('label', { key, className: checked ? 'shopping-line checked' : 'shopping-line' },
            h('input', { type: 'checkbox', checked, 'aria-label': `${checked ? 'Décocher' : 'Cocher'} ${item}`, onChange: () => setShoppingChecked(prev => ({ ...prev, [key]: !prev[key] })) }),
            h('span', { className: 'shopping-line-main' }, h('span', null, item)),
            h('button', { type: 'button', className: 'shopping-owned-btn', onClick: event => { event.preventDefault(); saveExtra(extraItems.filter(entry => entry !== item)); }, 'aria-label': `${tc('Retirer')} ${item}` }, '×')
          );
        })
      ),
      recipes.length > 0 && h('div', { className: 'shopping-aisles-shell' },
        h('div', { className: 'shopping-aisles' },
        scopedShoppingData.aisleGroups.map(group => h('section', { key: group.label, className: 'shopping-aisle' },
          h('div', { className: 'shopping-aisle-head' },
            h('strong', null, group.label),
            h('span', null, `${group.items.length} article${group.items.length > 1 ? 's' : ''}`)
          ),
          group.items.map(item => {
            const checked = Boolean(checkedItems[item.key]);
            const amount = formatShoppingAmount(item);
            const displayName = item.name;
            // Ligne simple : case, quantite, nom ; la recette d'origine n'est
            // ecrite que si le panier en compte plusieurs.
            return h('label', { key: item.key, className: checked ? 'shopping-line checked' : 'shopping-line', title: item.recipeNames.join(', ') },
              h('input', {
                type: 'checkbox',
                checked,
                'aria-label': `${checked ? 'Décocher' : 'Cocher'} ${[amount, displayName].filter(Boolean).join(' ')}`,
                onChange: () => setShoppingChecked(prev => ({ ...prev, [item.key]: !prev[item.key] }))
              }),
              h('span', { className: 'shopping-line-main' },
                amount && h('strong', null, amount),
                h('span', null, item.name),
                item.purchaseHint && h('em', null, item.purchaseHint)
              ),
              recipes.length > 1 && h('small', null, item.recipeNames.join(', ')),
              h('button', { type: 'button', className: 'shopping-owned-btn', onClick: event => {
                event.preventDefault();
                toggleOwnedItem(item.key);
              }, 'aria-label': ('Marquer ' + displayName + ' comme déjà à la maison'), title: 'Marquer comme déjà à la maison' }, 'J’ai')
            );
          })
        ))
        )
      ),
      recipes.length > 0 && freshOnly && scopedShoppingData.groupedItems.length === 0 && scopedShoppingData.ownedGroupedItems.length === 0 && h('div', { className: 'empty-state shopping-empty' },
        h('h2', null, tc('Aucun achat frais')),
        h('p', null, tc('Les recettes cochées sont couvertes par les rayons secs ou par ce qui est déjà à la maison.'))
      ),
      scopedShoppingData.ownedGroupedItems.length > 0 && h('div', { className: 'shopping-owned-list' },
        h('strong', null, tc('Déjà à la maison')),
        h('p', { className: 'shopping-owned-help' }, tc('« Toujours » garde l’article au placard : il sera rangé d’office dans tes prochaines listes.')),
        scopedShoppingData.ownedGroupedItems.map(item => {
          if (item.ownedByPantry) return h('span', { key: item.key, title: 'Déjà à la maison' }, `${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')} · maison`);
          const staple = isStaple(item);
          return h('div', { key: item.key, className: staple ? 'shopping-owned-item is-staple' : 'shopping-owned-item' },
            h('button', { type: 'button', onClick: () => putBackItem(item), 'aria-label': ('Remettre ' + item.name + ' dans la liste à acheter'), title: 'Remettre dans la liste' }, `${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}`),
            h('button', {
              type: 'button',
              className: 'shopping-staple-btn',
              'aria-pressed': staple,
              onClick: () => toggleStaple(item),
              'aria-label': staple ? `Ne plus garder ${item.name} au placard` : `Garder ${item.name} au placard pour les prochaines listes`,
              title: staple ? 'Gardé au placard pour les prochaines listes' : 'Garder au placard pour les prochaines listes'
            }, staple ? tc('Placard ✓') : tc('Toujours'))
          );
        })
      ),
      recipes.length > 1 && batchPlan.length > 0 && h('details', { className: 'shopping-fold batch-plan' },
        h('summary', null, tc('Ordre de préparation des recettes')),
        batchPlan.map(group => h('section', { key: group.key },
          h('strong', null, group.label),
          h('ul', null, group.items.map(item => h('li', { key: item }, item)))
        ))
      ),
      recipes.length > 0 && h('details', { className: 'shopping-fold' },
        h('summary', null, tc('Texte de la liste (conservation comprise)')),
        h('div', { className: 'cart-output combined-cart', role: 'region', 'aria-label': 'Détail de la liste de courses' }, shoppingOutputNodes(text))
      ),
      // Actions : envoyer (partage du telephone, sinon copie) et copier en
      // premier, le reste en petites pastilles.
      h('div', { className: 'modal-actions shopping-actions' },
        h('div', { className: 'shopping-actions-main' },
          h(Button, { variant: 'primary', disabled: !recipes.length, onClick: shareText }, h(Icon, { name: 'share' }), h('span', null, navigator.share ? tc('Envoyer la liste') : tc('Copier la liste'))),
          navigator.share && h(Button, { variant: 'subtle', disabled: !recipes.length, onClick: () => copyText(text).then(() => {
            setCopied(true);
            notify?.('Liste de courses copiée');
          }) }, h(Icon, { name: 'copy' }), h('span', null, copied ? tc('Copiée') : tc('Copier')))
        ),
        h('div', { className: 'shopping-actions-more' },
          h('button', { type: 'button', disabled: !recipes.length, onClick: () => copyText(compactText).then(() => {
            setCopied(true);
            notify?.('Liste compacte copiée');
          }) }, 'Copier compact'),
          h('button', { type: 'button', disabled: !recipes.length || !transferUrl, onClick: () => setTransferOpen(value => !value), 'aria-pressed': transferOpen, title: 'Afficher un QR code pour ouvrir la liste sur le téléphone' }, transferOpen ? tc('Masquer le QR code') : tc('Sur mon téléphone')),
          h('button', { type: 'button', className: 'is-danger', disabled: !recipes.length, onClick: clearBasket }, tc('Vider le panier'))
        )
      ),
      transferOpen && recipes.length > 0 && transferUrl && h(ShoppingTransferQr, { url: transferUrl })
    )
  );
}
