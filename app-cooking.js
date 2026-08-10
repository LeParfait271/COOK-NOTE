/* global React, window */

(function initCookNoteCookingMode() {
  const { useEffect, useRef, useState } = React;
  const runtime = window.CookNoteCookingRuntime || {};
  const { h, t, Button, Icon, stripHtml, scaleIngredient, trapModalFocus } = runtime;
  if (!h || !t || !Button || !Icon || !stripHtml || !scaleIngredient || !trapModalFocus) return;

  function CookingMode({ recipe, steps, stepScopeKey, stepIndex, checked, factor, isFullscreen, onClose, onToggleStep, onPrevious, onNext, onToggleFullscreen }) {
    const closeRef = useRef(null);
    const [ingredientsOpen, setIngredientsOpen] = useState(false);
    const total = steps.length;
    const activeIndex = Math.max(0, Math.min(total - 1, stepIndex));
    const stepKey = `${stepScopeKey}:step:${activeIndex}`;
    const completed = steps.reduce((count, _, index) => count + !!checked[`${stepScopeKey}:step:${index}`], 0);
    const progress = total ? Math.round((completed / total) * 100) : 0;
    const ingredientItems = (recipe.ingredients || []).flatMap(group => group.items || []).map(item => stripHtml(scaleIngredient(item, factor))).filter(Boolean).slice(0, 24);

    useEffect(() => {
      document.body.classList.add('cooking-mode-open');
      closeRef.current?.focus();
      return () => document.body.classList.remove('cooking-mode-open');
    }, []);
    useEffect(() => {
      const handleKey = event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
          return;
        }
        if (event.target?.matches?.('input,textarea,select') || event.target?.isContentEditable) return;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          onPrevious();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          onNext();
        }
      };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [onClose, onNext, onPrevious]);

    if (!total) return null;
    return h('div', { className: 'cooking-mode-backdrop' },
      h('section', { className: 'cooking-mode-shell', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'cooking-mode-title', tabIndex: -1, onKeyDown: trapModalFocus },
        h('header', { className: 'cooking-mode-head' },
          h('div', null, h('p', { className: 'eyebrow' }, t('cooking.mode')), h('h1', { id: 'cooking-mode-title' }, recipe.title)),
          h('div', { className: 'cooking-mode-head-actions' },
            h(Button, { variant: 'ghost', onClick: onToggleFullscreen }, isFullscreen ? t('cooking.exitFullscreen') : t('cooking.fullscreen')),
            h('button', { ref: closeRef, type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': t('cooking.close') }, h(Icon, { name: 'close' }))
          )
        ),
        h('div', { className: 'cooking-mode-progress', role: 'progressbar', 'aria-label': t('cooking.completedOf', { completed, total }), 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': progress }, h('span', { style: { width: `${progress}%` } })),
        h('p', { className: 'cooking-mode-progress-label' }, t('cooking.completedOf', { completed, total })),
        h('article', { className: 'cooking-mode-step-card' },
          h('p', { className: 'cooking-mode-step-count' }, t('cooking.stepOf', { current: activeIndex + 1, total })),
          h('p', { className: 'cooking-mode-step-text' }, stripHtml(steps[activeIndex])),
          h(Button, { variant: 'subtle', className: checked[stepKey] ? 'cooking-mode-step-toggle completed' : 'cooking-mode-step-toggle', pressed: Boolean(checked[stepKey]), onClick: () => onToggleStep(stepKey) }, checked[stepKey] ? t('cooking.completedStep') : t('cooking.completeStep'))
        ),
        h('nav', { className: 'cooking-mode-controls', 'aria-label': t('cooking.mode') },
          h(Button, { variant: 'subtle', disabled: activeIndex === 0, onClick: onPrevious }, t('cooking.previous')),
          h(Button, { variant: 'primary', onClick: onNext }, activeIndex === total - 1 ? t('cooking.finish') : t('cooking.next'))
        ),
        h('button', { type: 'button', className: 'cooking-mode-ingredients-toggle', 'aria-expanded': ingredientsOpen, onClick: () => setIngredientsOpen(value => !value) }, ingredientsOpen ? t('cooking.hideIngredients') : t('cooking.showIngredients')),
        ingredientsOpen && h('section', { className: 'cooking-mode-ingredients', 'aria-labelledby': 'cooking-mode-ingredients-title' },
          h('h2', { id: 'cooking-mode-ingredients-title' }, t('cooking.ingredients')),
          h('ul', null, ingredientItems.map((item, index) => h('li', { key: `${stepScopeKey}:cooking-ingredient:${index}` }, item)))
        )
      )
    );
  }

  window.CookNoteCookingMode = CookingMode;
}());
